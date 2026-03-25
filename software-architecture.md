# Task Management MVP — Software Architecture

> **Stack:** Node.js (Express) + React · In-memory storage (v1) · JWT authentication  
> **Date:** 2026-03-24  
> **Spec version:** OpenAPI 3.0.3 v1.0.0

---

## Table of Contents

1. [Architecture Overview Diagram](#1-architecture-overview-diagram)
2. [Class / Model Diagrams](#2-class--model-diagrams)
   - 2.1 [Domain Models](#21-domain-models)
   - 2.2 [DTOs (Request / Response Shapes)](#22-dtos-request--response-shapes)
   - 2.3 [Controllers → Services → Repositories](#23-controllers--services--repositories)
3. [Sequence Diagrams](#3-sequence-diagrams)
   - 3.1 [Login](#31-login)
   - 3.2 [Logout](#32-logout)
   - 3.3 [Create User (Admin)](#33-create-user-admin)
   - 3.4 [List / Get Users (Admin)](#34-list--get-users-admin)
   - 3.5 [Create Task](#35-create-task)
   - 3.6 [List Tasks with Filters](#36-list-tasks-with-filters)
   - 3.7 [Update Task Details](#37-update-task-details)
   - 3.8 [Update Task Status (Lifecycle Transition)](#38-update-task-status-lifecycle-transition)
   - 3.9 [Assign / Reassign Task](#39-assign--reassign-task)
   - 3.10 [Status Summary Report](#310-status-summary-report)
   - 3.11 [Overdue Tasks Report](#311-overdue-tasks-report)
   - 3.12 [Productivity Report](#312-productivity-report)
   - 3.13 [Trend Report](#313-trend-report)

---

## 1. Architecture Overview Diagram

```mermaid
graph TB
    subgraph Client["Client Layer — Browser"]
        UI["React SPA\n(Vite / CRA)"]
        AuthCtx["AuthContext\n(JWT store)"]
        ReactQuery["React Query /\nAxios HTTP Client"]
        UI --> AuthCtx
        UI --> ReactQuery
    end

    subgraph APIGateway["API Layer — Express.js  :3000"]
        Router["Express Router\n/api/v1"]
        AuthMW["Auth Middleware\n(JWT verify)"]
        RoleMW["Role Guard\n(ADMIN / END_USER)"]
        ValMW["Validation Middleware\n(Zod / Joi)"]
        Router --> AuthMW --> RoleMW --> ValMW
    end

    subgraph Controllers["Controller Layer"]
        AuthCtrl["AuthController\n/auth"]
        UserCtrl["UserController\n/users"]
        TaskCtrl["TaskController\n/tasks"]
        ReportCtrl["ReportController\n/reports"]
    end

    subgraph Services["Service Layer (Business Logic)"]
        AuthSvc["AuthService\n· login · logout\n· tokenIssue · tokenRevoke"]
        UserSvc["UserService\n· create · list · get\n· update · deactivate"]
        TaskSvc["TaskService\n· CRUD · assign\n· statusTransition"]
        ReportSvc["ReportService\n· statusSummary · overdue\n· productivity · trend"]
    end

    subgraph DAL["Data Access Layer"]
        UserRepo["UserRepository"]
        TaskRepo["TaskRepository"]
        TokenStore["TokenBlacklist\n(revoked JWTs)"]
    end

    subgraph Storage["Storage — v1 In-Memory  (swap-ready for DB)"]
        UsersMap["users: Map&lt;userId, User&gt;"]
        TasksMap["tasks: Map&lt;taskId, Task&gt;"]
        BlacklistSet["blacklist: Set&lt;jti&gt;"]
    end

    subgraph ExternalIntegrations["External Integrations (v2+)"]
        JWT["JWT / jose\n(token sign/verify)"]
        Bcrypt["bcryptjs\n(password hash)"]
        EmailSvc["Email Service\n(SendGrid / SES)"]
        MongoDB["MongoDB / PostgreSQL\n(persistent DB)"]
    end

    ReactQuery -->|"HTTP REST\nBearer token"| Router
    ValMW --> AuthCtrl
    ValMW --> UserCtrl
    ValMW --> TaskCtrl
    ValMW --> ReportCtrl
    AuthCtrl --> AuthSvc
    UserCtrl --> UserSvc
    TaskCtrl --> TaskSvc
    ReportCtrl --> ReportSvc
    AuthSvc --> UserRepo
    AuthSvc --> TokenStore
    AuthSvc --> JWT
    AuthSvc --> Bcrypt
    UserSvc --> UserRepo
    TaskSvc --> TaskRepo
    TaskSvc --> UserRepo
    ReportSvc --> TaskRepo
    ReportSvc --> UserRepo
    UserRepo --> UsersMap
    TaskRepo --> TasksMap
    TokenStore --> BlacklistSet
    UsersMap -.->|"future"| MongoDB
    TasksMap -.->|"future"| MongoDB
    AuthSvc -.->|"v2+"| EmailSvc
```

**Explanation**

| Layer | Responsibility |
|---|---|
| **React SPA** | Renders UI, stores JWT in `AuthContext`, issues HTTP requests via Axios / React Query. |
| **Express Router** | Mounts versioned routes (`/api/v1`), applies middleware chain before reaching controllers. |
| **Auth Middleware** | Validates `Authorization: Bearer <JWT>`, extracts `userId` + `role` onto `req.user`. |
| **Role Guard** | Asserts required role(s) per route (e.g. `ADMIN`-only for `/users`). |
| **Validation Middleware** | Schema-validates request body / query params; returns `400 BAD_REQUEST` on failure. |
| **Controllers** | Thin HTTP adapters — parse request, call service, map result to HTTP response. |
| **Services** | All business logic: lifecycle rules, ownership checks, pagination, report calculations. |
| **Repositories** | Pure data-access objects; abstract the storage medium. Swappable with Mongoose/Prisma for v2. |
| **In-Memory Maps** | `Map` and `Set` stores used in v1 for zero-dependency local development. |
| **External** | `bcryptjs` for password hashing at creation/login; `jose` / `jsonwebtoken` for JWT; futures: SendGrid, MongoDB. |

---

## 2. Class / Model Diagrams

### 2.1 Domain Models

```mermaid
classDiagram
    class User {
        +String userId
        +String email
        +String passwordHash
        +Role role
        +UserStatus status
        +Date createdAt
        +Date updatedAt
    }

    class Task {
        +String taskId
        +String title
        +String description
        +TaskPriority priority
        +TaskStatus status
        +String dueDate
        +String createdBy
        +String assignedTo
        +Date createdAt
        +Date updatedAt
        +Date completedAt
    }

    class Role {
        <<enumeration>>
        END_USER
        ADMIN
    }

    class UserStatus {
        <<enumeration>>
        ACTIVE
        INACTIVE
    }

    class TaskPriority {
        <<enumeration>>
        LOW
        MEDIUM
        HIGH
    }

    class TaskStatus {
        <<enumeration>>
        NEW
        IN_PROGRESS
        BLOCKED
        COMPLETED
        CANCELLED
    }

    User "1" --> "0..*" Task : createdBy
    User "1" --> "0..*" Task : assignedTo
    User --> Role
    User --> UserStatus
    Task --> TaskPriority
    Task --> TaskStatus
```

**Explanation:** `User` and `Task` are the two core domain entities. All relations are expressed via IDs (no embedded foreign-key objects in v1). Enumerations are modelled as separate types shared across request/response schemas.

---

### 2.2 DTOs (Request / Response Shapes)

```mermaid
classDiagram
    direction TB

    class LoginRequest {
        +String email
        +String password
    }

    class LoginResponse {
        +String accessToken
        +String tokenType
        +Number expiresInSeconds
        +User user
    }

    class UserCreateRequest {
        +String email
        +String password
        +Role role
        +UserStatus status
    }

    class UserUpdateRequest {
        +Role role
        +UserStatus status
    }

    class UserListResponse {
        +User[] data
        +PaginationMeta pagination
    }

    class TaskCreateRequest {
        +String title
        +String description
        +TaskPriority priority
        +String dueDate
        +String assignedTo
    }

    class TaskUpdateRequest {
        +String title
        +String description
        +TaskPriority priority
        +String dueDate
    }

    class TaskStatusUpdateRequest {
        +TaskStatus status
    }

    class TaskAssignmentRequest {
        +String assignedTo
    }

    class TaskListResponse {
        +Task[] data
        +PaginationMeta pagination
    }

    class PaginationMeta {
        +Number page
        +Number pageSize
        +Number totalItems
        +Number totalPages
        +Boolean hasNextPage
        +Boolean hasPreviousPage
    }

    class ErrorResponse {
        +String code
        +String message
        +String timestamp
    }

    class MessageResponse {
        +String message
    }

    class StatusSummaryReport {
        +String scope
        +Date generatedAt
        +Number totalTasks
        +StatusCount[] statusCounts
    }

    class StatusCount {
        +TaskStatus status
        +Number count
    }

    class OverdueReport {
        +Date generatedAt
        +Task[] data
        +PaginationMeta pagination
    }

    class ProductivityReport {
        +String scope
        +String period
        +String fromDate
        +String toDate
        +Number totalCompleted
        +ProductivityPoint[] series
    }

    class ProductivityPoint {
        +String label
        +Number completedCount
    }

    class TrendReport {
        +String scope
        +String granularity
        +String fromDate
        +String toDate
        +TrendPoint[] points
    }

    class TrendPoint {
        +String label
        +Number createdCount
        +Number completedCount
    }

    LoginResponse *-- PaginationMeta
    UserListResponse *-- PaginationMeta
    TaskListResponse *-- PaginationMeta
    OverdueReport *-- PaginationMeta
    StatusSummaryReport *-- StatusCount
    ProductivityReport *-- ProductivityPoint
    TrendReport *-- TrendPoint
```

**Explanation:** DTOs are plain data bags that map 1-to-1 with the OpenAPI `requestBodies` and response schemas. They are kept distinct from domain models to decouple the HTTP contract from internal representation — especially important when `passwordHash` must never leave the service layer.

---

### 2.3 Controllers → Services → Repositories

```mermaid
classDiagram
    direction LR

    class AuthController {
        +post_login(req, res)
        +post_logout(req, res)
    }

    class UserController {
        +get_list(req, res)
        +post_create(req, res)
        +get_byId(req, res)
        +patch_update(req, res)
    }

    class TaskController {
        +get_list(req, res)
        +post_create(req, res)
        +get_byId(req, res)
        +patch_update(req, res)
        +patch_status(req, res)
        +patch_assignee(req, res)
    }

    class ReportController {
        +get_statusSummary(req, res)
        +get_overdue(req, res)
        +get_productivity(req, res)
        +get_trend(req, res)
    }

    class AuthService {
        +login(email, password) LoginResponse
        +logout(jti) void
        +isTokenRevoked(jti) Boolean
        -issueToken(user) String
        -hashPassword(plain) String
        -verifyPassword(plain, hash) Boolean
    }

    class UserService {
        +listUsers(filters, page) UserListResponse
        +createUser(dto) User
        +getUserById(userId) User
        +updateUser(userId, dto) User
    }

    class TaskService {
        +listTasks(filters, page) TaskListResponse
        +createTask(dto, createdBy) Task
        +getTaskById(taskId) Task
        +updateTask(taskId, dto, requestor) Task
        +updateStatus(taskId, status, requestor) Task
        +updateAssignee(taskId, assignedTo, requestor) Task
        -validateTransition(from, to) void
        -assertNotTerminal(task) void
    }

    class ReportService {
        +statusSummary(scope, userId) StatusSummaryReport
        +overdueTasks(scope, userId, page) OverdueReport
        +productivity(scope, userId, period, from, to) ProductivityReport
        +trend(scope, userId, granularity, from, to) TrendReport
    }

    class UserRepository {
        +findAll(filters) User[]
        +findById(userId) User
        +findByEmail(email) User
        +save(user) User
        +update(userId, patch) User
    }

    class TaskRepository {
        +findAll(filters) Task[]
        +findById(taskId) Task
        +save(task) Task
        +update(taskId, patch) Task
        +countByStatus(scope) Map
        +findOverdue(scope, page) Task[]
        +findCompleted(scope, from, to) Task[]
    }

    class TokenBlacklist {
        +add(jti) void
        +has(jti) Boolean
    }

    AuthController --> AuthService
    UserController --> UserService
    TaskController --> TaskService
    ReportController --> ReportService

    AuthService --> UserRepository
    AuthService --> TokenBlacklist
    UserService --> UserRepository
    TaskService --> TaskRepository
    TaskService --> UserRepository
    ReportService --> TaskRepository
    ReportService --> UserRepository
```

**Explanation:** Controllers are strictly HTTP-aware (parse request, call service, send response). All domain rules live in Services. Repositories are the only layer that touches the data store, making them trivially swappable with database adapters in v2.

---

## 3. Sequence Diagrams

### 3.1 Login

```mermaid
sequenceDiagram
    actor User as User (Browser)
    participant UI as React UI
    participant API as Express /auth/login
    participant MW as Validation MW
    participant AC as AuthController
    participant AS as AuthService
    participant UR as UserRepository
    participant JWT as JWT Library

    User->>UI: Enter email + password → Submit
    UI->>API: POST /api/v1/auth/login\n{ email, password }
    API->>MW: validate body (email format, password minLength 8)
    alt Validation fails
        MW-->>UI: 400 BAD_REQUEST { code, message }
        UI-->>User: Show field errors
    else Validation passes
        MW->>AC: next()
        AC->>AS: login(email, password)
        AS->>UR: findByEmail(email)
        alt User not found
            UR-->>AS: null
            AS-->>AC: throw UnauthorizedError
            AC-->>UI: 401 UNAUTHORIZED
            UI-->>User: "Invalid credentials"
        else User found
            UR-->>AS: User { passwordHash, status, ... }
            AS->>AS: verifyPassword(plain, hash)
            alt Password mismatch
                AS-->>AC: throw UnauthorizedError
                AC-->>UI: 401 UNAUTHORIZED
            else User INACTIVE
                AS-->>AC: throw ForbiddenError
                AC-->>UI: 403 FORBIDDEN "Account inactive"
            else Credentials valid + ACTIVE
                AS->>JWT: sign({ userId, role }, secret, { expiresIn: 8h })
                JWT-->>AS: accessToken (JWT string)
                AS-->>AC: LoginResponse { accessToken, tokenType, expiresInSeconds, user }
                AC-->>UI: 200 OK LoginResponse
                UI->>UI: Store token in AuthContext
                UI-->>User: Redirect to Dashboard
            end
        end
    end
```

---

### 3.2 Logout

```mermaid
sequenceDiagram
    actor User as User (Browser)
    participant UI as React UI
    participant API as Express /auth/logout
    participant AuthMW as Auth Middleware
    participant AC as AuthController
    participant AS as AuthService
    participant TB as TokenBlacklist

    User->>UI: Click "Logout"
    UI->>API: POST /api/v1/auth/logout\nAuthorization: Bearer [token]
    API->>AuthMW: verify token signature + expiry
    alt Token invalid / expired
        AuthMW-->>UI: 401 UNAUTHORIZED
    else Token valid
        AuthMW->>AC: next() with req.user = { userId, role, jti }
        AC->>AS: logout(jti)
        AS->>TB: add(jti)
        TB-->>AS: ok
        AS-->>AC: void
        AC-->>UI: 200 OK { message: "Logged out successfully" }
        UI->>UI: Clear AuthContext + redirect to /login
        UI-->>User: Login page shown
    end
```

---

### 3.3 Create User (Admin)

```mermaid
sequenceDiagram
    actor Admin as Admin (Browser)
    participant UI as React UI
    participant API as Express /users
    participant AuthMW as Auth Middleware
    participant RoleMW as Role Guard (ADMIN)
    participant ValMW as Validation MW
    participant UC as UserController
    participant US as UserService
    participant UR as UserRepository
    participant Bcrypt as bcryptjs

    Admin->>UI: Fill user form → Submit
    UI->>API: POST /api/v1/users\nBearer [adminToken]\n{ email, password, role, status }
    API->>AuthMW: verify JWT
    AuthMW->>RoleMW: req.user.role === ADMIN?
    alt Not ADMIN
        RoleMW-->>UI: 403 FORBIDDEN
    else ADMIN confirmed
        RoleMW->>ValMW: validate body
        alt Invalid payload
            ValMW-->>UI: 400 BAD_REQUEST
        else Valid
            ValMW->>UC: next()
            UC->>US: createUser({ email, password, role, status })
            US->>UR: findByEmail(email)
            alt Email already exists
                UR-->>US: User
                US-->>UC: throw ConflictError
                UC-->>UI: 409 CONFLICT "Email already registered"
            else Email free
                UR-->>US: null
                US->>Bcrypt: hash(password, 12)
                Bcrypt-->>US: passwordHash
                US->>UR: save({ userId: uid(), email, passwordHash, role, status, ... })
                UR-->>US: User (without passwordHash)
                US-->>UC: User
                UC-->>UI: 201 CREATED User
                UI-->>Admin: New user row appears in table
            end
        end
    end
```

---

### 3.4 List / Get Users (Admin)

```mermaid
sequenceDiagram
    actor Admin as Admin (Browser)
    participant UI as React UI
    participant API as Express /users
    participant AuthMW as Auth Middleware
    participant RoleMW as Role Guard
    participant UC as UserController
    participant US as UserService
    participant UR as UserRepository

    Admin->>UI: Navigate to Users page / apply filter
    UI->>API: GET /api/v1/users?role=END_USER&page=1&pageSize=20\nBearer [adminToken]
    API->>AuthMW: verify JWT
    AuthMW->>RoleMW: assert ADMIN
    RoleMW->>UC: next()
    UC->>US: listUsers({ role, status, page, pageSize })
    US->>UR: findAll({ role, status })
    UR-->>US: User[]
    US->>US: paginate(users, page, pageSize)
    US-->>UC: UserListResponse { data, pagination }
    UC-->>UI: 200 OK UserListResponse
    UI-->>Admin: Render users table with pagination

    Note over Admin,UR: Get single user follows same path via GET /users/:userId
```

---

### 3.5 Create Task

```mermaid
sequenceDiagram
    actor EndUser as End User (Browser)
    participant UI as React UI
    participant API as Express /tasks
    participant AuthMW as Auth Middleware
    participant ValMW as Validation MW
    participant TC as TaskController
    participant TS as TaskService
    participant UR as UserRepository
    participant TR as TaskRepository

    EndUser->>UI: Fill task form → Submit
    UI->>API: POST /api/v1/tasks\nBearer [token]\n{ title, description, priority, dueDate, assignedTo }
    API->>AuthMW: verify JWT → req.user
    AuthMW->>ValMW: validate body (title 3-120, description ≤2000)
    alt Validation fails
        ValMW-->>UI: 400 BAD_REQUEST
    else Valid
        ValMW->>TC: next()
        TC->>TS: createTask(dto, createdBy = req.user.userId)
        alt assignedTo provided
            TS->>UR: findById(assignedTo)
            alt Assignee not found or INACTIVE
                UR-->>TS: null / INACTIVE
                TS-->>TC: throw BadRequestError
                TC-->>UI: 400 BAD_REQUEST "Assignee not found or inactive"
            else Valid assignee
                UR-->>TS: User (ACTIVE)
            end
        end
        TS->>TR: save({ taskId: tid(), title, description, priority, status: NEW,\ndueDate, createdBy, assignedTo, createdAt, updatedAt })
        TR-->>TS: Task
        TS-->>TC: Task
        TC-->>UI: 201 CREATED Task
        UI-->>EndUser: Task card added to board
    end
```

---

### 3.6 List Tasks with Filters

```mermaid
sequenceDiagram
    actor User as User (Browser)
    participant UI as React UI
    participant API as Express /tasks
    participant AuthMW as Auth Middleware
    participant TC as TaskController
    participant TS as TaskService
    participant TR as TaskRepository

    User->>UI: Apply filters (status, priority, dueDate range)
    UI->>API: GET /api/v1/tasks?status=IN_PROGRESS&priority=HIGH\n&dueDateFrom=2026-03-24&sortBy=dueDate&sortOrder=asc\n&page=1&pageSize=20\nBearer [token]
    API->>AuthMW: verify JWT → req.user { userId, role }
    AuthMW->>TC: next()
    TC->>TS: listTasks(filters, page, pageSize, requestor)
    Note over TS: ADMIN sees all tasks\nEND_USER sees only own tasks\n(createdBy OR assignedTo)
    TS->>TR: findAll(effectiveFilters)
    TR-->>TS: Task[]
    TS->>TS: sort(tasks, sortBy, sortOrder)
    TS->>TS: paginate(tasks, page, pageSize)
    TS-->>TC: TaskListResponse
    TC-->>UI: 200 OK TaskListResponse
    UI-->>User: Render filtered task list
```

---

### 3.7 Update Task Details

```mermaid
sequenceDiagram
    actor User as User (Browser)
    participant UI as React UI
    participant API as Express /tasks/:taskId
    participant AuthMW as Auth Middleware
    participant ValMW as Validation MW
    participant TC as TaskController
    participant TS as TaskService
    participant TR as TaskRepository

    User->>UI: Edit task fields → Save
    UI->>API: PATCH /api/v1/tasks/tsk_1001\nBearer [token]\n{ title, description, priority, dueDate }
    API->>AuthMW: verify JWT
    AuthMW->>ValMW: validate body (minProperties: 1)
    alt Validation fails
        ValMW-->>UI: 400 BAD_REQUEST
    else Valid
        ValMW->>TC: next()
        TC->>TS: updateTask(taskId, dto, requestor)
        TS->>TR: findById(taskId)
        alt Task not found
            TR-->>TS: null
            TS-->>TC: throw NotFoundError
            TC-->>UI: 404 NOT_FOUND
        else Task found
            TR-->>TS: Task
            TS->>TS: assertNotTerminal(task)\n(COMPLETED / CANCELLED → reject)
            alt Terminal task
                TS-->>TC: throw BadRequestError
                TC-->>UI: 400 "Terminal tasks are read-only"
            else Non-terminal
                TS->>TS: assertOwnershipOrAdmin(task, requestor)
                TS->>TR: update(taskId, { ...patch, updatedAt: now() })
                TR-->>TS: Updated Task
                TS-->>TC: Task
                TC-->>UI: 200 OK Task
                UI-->>User: Task fields updated
            end
        end
    end
```

---

### 3.8 Update Task Status (Lifecycle Transition)

```mermaid
sequenceDiagram
    actor User as User (Browser)
    participant UI as React UI
    participant API as Express /tasks/:taskId/status
    participant AuthMW as Auth Middleware
    participant TC as TaskController
    participant TS as TaskService
    participant TR as TaskRepository

    User->>UI: Change task status → Submit
    UI->>API: PATCH /api/v1/tasks/tsk_1001/status\nBearer [token]\n{ status: "COMPLETED" }
    API->>AuthMW: verify JWT
    AuthMW->>TC: next()
    TC->>TS: updateStatus(taskId, newStatus, requestor)
    TS->>TR: findById(taskId)
    TR-->>TS: Task { status: IN_PROGRESS, ... }
    TS->>TS: validateTransition(IN_PROGRESS → COMPLETED)

    Note over TS: Allowed transitions:\nNEW → IN_PROGRESS, CANCELLED\nIN_PROGRESS → BLOCKED, COMPLETED, CANCELLED\nBLOCKED → IN_PROGRESS, CANCELLED

    alt Transition invalid (e.g. NEW → COMPLETED)
        TS-->>TC: throw BadRequestError\n"Invalid lifecycle transition NEW → COMPLETED"
        TC-->>UI: 400 BAD_REQUEST
        UI-->>User: Show error toast
    else Transition valid
        alt newStatus === COMPLETED
            TS->>TR: update(taskId, { status: COMPLETED,\ncompletedAt: now(), updatedAt: now() })
        else Other valid transition
            TS->>TR: update(taskId, { status: newStatus, updatedAt: now() })
        end
        TR-->>TS: Updated Task
        TS-->>TC: Task
        TC-->>UI: 200 OK Task
        UI-->>User: Status badge updated
    end
```

---

### 3.9 Assign / Reassign Task

```mermaid
sequenceDiagram
    actor Admin as Admin (Browser)
    participant UI as React UI
    participant API as Express /tasks/:taskId/assignee
    participant AuthMW as Auth Middleware
    participant TC as TaskController
    participant TS as TaskService
    participant TR as TaskRepository
    participant UR as UserRepository

    Admin->>UI: Select new assignee from dropdown → Save
    UI->>API: PATCH /api/v1/tasks/tsk_1001/assignee\nBearer [adminToken]\n{ assignedTo: "usr_003" }
    API->>AuthMW: verify JWT → req.user
    AuthMW->>TC: next()
    TC->>TS: updateAssignee(taskId, assignedTo, requestor)
    TS->>TR: findById(taskId)
    alt Task not found
        TR-->>TS: null
        TS-->>TC: throw NotFoundError
        TC-->>UI: 404 NOT_FOUND
    else Task found
        TR-->>TS: Task
        TS->>UR: findById(assignedTo)
        alt Target user not found or INACTIVE
            UR-->>TS: null / INACTIVE
            TS-->>TC: throw BadRequestError
            TC-->>UI: 400 "Target user not found or inactive"
        else Target user ACTIVE
            UR-->>TS: User
            TS->>TS: assertOwnershipOrAdmin(task, requestor)\nEND_USER may only reassign own tasks
            TS->>TR: update(taskId, { assignedTo: usr_003, updatedAt: now() })
            TR-->>TS: Updated Task
            TS-->>TC: Task
            TC-->>UI: 200 OK Task
            UI-->>Admin: Assignee chip updated
        end
    end
```

---

### 3.10 Status Summary Report

```mermaid
sequenceDiagram
    actor User as User (Browser)
    participant UI as React Dashboard
    participant API as Express /reports/status-summary
    participant AuthMW as Auth Middleware
    participant RC as ReportController
    participant RS as ReportService
    participant TR as TaskRepository

    User->>UI: Open Dashboard
    UI->>API: GET /api/v1/reports/status-summary\nBearer [token]
    API->>AuthMW: verify JWT → req.user { userId, role }
    AuthMW->>RC: next()
    RC->>RS: statusSummary(scope, userId)
    Note over RS: ADMIN → scope=global (all tasks)\nEND_USER → scope=user (own tasks)
    RS->>TR: countByStatus(effectiveScope)
    TR-->>RS: status count map
    RS->>RS: build StatusSummaryReport\n{ scope, generatedAt, totalTasks, statusCounts[] }
    RS-->>RC: StatusSummaryReport
    RC-->>UI: 200 OK StatusSummaryReport
    UI-->>User: Render donut / bar chart with counts
```

---

### 3.11 Overdue Tasks Report

```mermaid
sequenceDiagram
    actor User as User (Browser)
    participant UI as React UI
    participant API as Express /reports/overdue
    participant AuthMW as Auth Middleware
    participant RC as ReportController
    participant RS as ReportService
    participant TR as TaskRepository

    User->>UI: Open "Overdue" tab
    UI->>API: GET /api/v1/reports/overdue?page=1&pageSize=20\nBearer [token]
    API->>AuthMW: verify JWT → req.user
    AuthMW->>RC: next()
    RC->>RS: overdueTasks(scope, userId, { page, pageSize })
    RS->>TR: findAll({ dueDate < today, status ≠ COMPLETED\n& ≠ CANCELLED, scope })
    TR-->>RS: Task[]
    RS->>RS: paginate(tasks, page, pageSize)
    RS-->>RC: OverdueReport { generatedAt, data, pagination }
    RC-->>UI: 200 OK OverdueReport
    UI-->>User: Render overdue task list with daysOverdue indicator
```

---

### 3.12 Productivity Report

```mermaid
sequenceDiagram
    actor User as User (Browser)
    participant UI as React UI
    participant API as Express /reports/productivity
    participant AuthMW as Auth Middleware
    participant RC as ReportController
    participant RS as ReportService
    participant TR as TaskRepository

    User->>UI: Select period=weekly + date range → Generate
    UI->>API: GET /api/v1/reports/productivity\n?period=weekly&fromDate=2026-03-01&toDate=2026-03-31\nBearer [token]
    API->>AuthMW: verify JWT
    AuthMW->>RC: next()
    RC->>RS: productivity(scope, userId, period, fromDate, toDate)
    RS->>TR: findCompleted(scope, fromDate, toDate)
    TR-->>RS: Task[] (completedAt within range)
    RS->>RS: bucketByPeriod(tasks, period)\n→ ProductivityPoint[] per week
    RS->>RS: sum totalCompleted
    RS-->>RC: ProductivityReport { scope, period, fromDate, toDate,\ntotalCompleted, series[] }
    RC-->>UI: 200 OK ProductivityReport
    UI-->>User: Render line / bar chart of completed tasks over time
```

---

### 3.13 Trend Report

```mermaid
sequenceDiagram
    actor Admin as Admin (Browser)
    participant UI as React UI
    participant API as Express /reports/trend
    participant AuthMW as Auth Middleware
    participant RC as ReportController
    participant RS as ReportService
    participant TR as TaskRepository

    Admin->>UI: Set granularity=week + date range → Generate
    UI->>API: GET /api/v1/reports/trend\n?granularity=week&fromDate=2026-03-01&toDate=2026-03-31\nBearer [adminToken]
    API->>AuthMW: verify JWT
    AuthMW->>RC: next()
    RC->>RS: trend(scope, userId, granularity, fromDate, toDate)
    RS->>TR: findAll({ createdAt within range, scope })
    TR-->>RS: Task[] (created)
    RS->>TR: findCompleted(scope, fromDate, toDate)
    TR-->>RS: Task[] (completed)
    RS->>RS: bucketByGranularity(created, completed, granularity)\n→ TrendPoint[]  { label, createdCount, completedCount }
    RS-->>RC: TrendReport { scope, granularity, fromDate, toDate, points[] }
    RC-->>UI: 200 OK TrendReport
    UI-->>Admin: Render dual-line chart (created vs completed)
```

---

*End of Software Architecture Document*
