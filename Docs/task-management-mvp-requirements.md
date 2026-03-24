# Task Management MVP - Business Requirements Specification

## 1. Document Purpose
This document defines the business requirements blueprint for a Task Management MVP focused on task creation, assignment, and lifecycle tracking.

## 2. Business Context
### 2.1 Problem Statement
Teams need a simple, role-based application to create, assign, and track tasks consistently. Current informal tracking leads to missed deadlines, poor visibility, and delayed follow-up.

### 2.2 Business Goals
1. Provide a reliable workflow for creating and tracking tasks from creation to closure.
2. Enable role-based operation for End Users and Admins.
3. Improve visibility with actionable reporting (status summary, overdue, productivity, trend).
4. Deliver fast user experience, targeting common actions under 1 second.

### 2.3 Success Metrics
1. 95% of common user actions complete in under 1 second at target load.
2. 100% of tasks have a valid lifecycle state.
3. 100% of state transitions comply with lifecycle rules.
4. 90% of users can complete task create-and-update flow without support after onboarding.

### 2.4 Scope In (v1)
1. Email/password login.
2. Roles: End User and Admin.
3. Task CRUD (as constrained by role and state).
4. Task assignment and reassignment.
5. Task lifecycle tracking.
6. Reporting views:
   - Status summary
   - Overdue tasks
   - Productivity
   - Trend
7. In-memory storage only.

### 2.5 Scope Out (v1)
1. Notifications (email, SMS, push).
2. Audit trail/history logs as a feature.
3. Persistent database storage.
4. External system integrations.

## 3. Actors and Personas
### 3.1 End User
1. Creates tasks.
2. Updates own or assigned tasks based on rules.
3. Moves tasks through allowed lifecycle states.
4. Views own productivity and task status reports.

### 3.2 Admin
1. Performs all End User capabilities.
2. Manages all users.
3. Views organization-wide reports.
4. Reassigns tasks across users.
5. Resolves blocked or stale tasks.

## 4. Domain Model and Business Rules
### 4.1 Core Entities
#### User
1. `userId` (unique)
2. `email` (unique)
3. `passwordHash`
4. `role` (`END_USER` | `ADMIN`)
5. `status` (`ACTIVE` | `INACTIVE`)
6. `createdAt`, `updatedAt`

#### Task
1. `taskId` (unique)
2. `title` (required, 3-120 chars)
3. `description` (optional, max 2000 chars)
4. `priority` (`LOW` | `MEDIUM` | `HIGH`)
5. `status` (`NEW` | `IN_PROGRESS` | `BLOCKED` | `COMPLETED` | `CANCELLED`)
6. `dueDate` (optional)
7. `createdBy` (userId)
8. `assignedTo` (userId, optional at creation)
9. `createdAt`, `updatedAt`, `completedAt` (optional)

### 4.2 Lifecycle Rules
Allowed transitions:
1. `NEW -> IN_PROGRESS`, `NEW -> CANCELLED`
2. `IN_PROGRESS -> BLOCKED`, `IN_PROGRESS -> COMPLETED`, `IN_PROGRESS -> CANCELLED`
3. `BLOCKED -> IN_PROGRESS`, `BLOCKED -> CANCELLED`
4. `COMPLETED` and `CANCELLED` are terminal states.

### 4.3 Validation Rules
1. Title is mandatory and trimmed.
2. Due date (if provided) must be greater than or equal to task creation date.
3. `assignedTo` must reference an `ACTIVE` user.
4. Only Admin can assign tasks to any user; End User can assign only to self unless policy changes.
5. Completed tasks must set `completedAt`.
6. Task cannot return from terminal states in v1.

## 5. Epics and Functional Requirements

### Epic E1: Authentication and Session Management
**Workflow:** user logs in with email/password and accesses role-specific features.

#### FR-1 Login with email/password
- Actor: End User, Admin
- Requirement: System shall authenticate valid email/password credentials.
- Acceptance conditions:
1. Given valid credentials, when user submits login, then access is granted.
2. Given invalid credentials, when user submits login, then access is denied with generic error.
3. Authentication response time for valid login is under 1 second in 95% requests at target load.

#### FR-2 Role-based access baseline
- Actor: End User, Admin
- Requirement: System shall enforce role checks for protected actions.
- Acceptance conditions:
1. End User cannot access admin-only user management endpoints/views.
2. Admin can access all user and task operations.
3. Unauthorized requests return appropriate error response and do not mutate state.

### Epic E2: Task Creation and Assignment
**Workflow:** user creates a task and assigns it to a user.

#### FR-3 Create task
- Actor: End User, Admin
- Requirement: System shall allow task creation with required fields and defaults.
- Acceptance conditions:
1. Task with valid title is created in `NEW` status.
2. `createdBy` is always set to authenticated user.
3. Validation rejects invalid title length or malformed payload.

#### FR-4 Assign and reassign task
- Actor: End User, Admin
- Requirement: System shall allow assignment/reassignment based on role rules.
- Acceptance conditions:
1. Admin can assign/reassign any task to any active user.
2. End User can assign to self only (v1 baseline assumption).
3. Assignment updates are visible immediately in task detail and list views.

### Epic E3: Task Lifecycle Tracking
**Workflow:** user updates status through allowed transitions.

#### FR-5 Update task status
- Actor: End User, Admin
- Requirement: System shall enforce lifecycle transition rules.
- Acceptance conditions:
1. Valid transition succeeds and persists in memory.
2. Invalid transition is rejected with explanatory message.
3. Transition to `COMPLETED` sets `completedAt`.

#### FR-6 Update task details
- Actor: End User, Admin
- Requirement: System shall allow edits to mutable fields until terminal state.
- Acceptance conditions:
1. Title, description, priority, due date are editable for non-terminal tasks.
2. Terminal tasks (`COMPLETED`, `CANCELLED`) are read-only except admin cancel rationale if added later.
3. Validation is re-applied on every edit.

### Epic E4: Task Discovery and Reporting
**Workflow:** users monitor work using operational and trend views.

#### FR-7 Task list and filtering
- Actor: End User, Admin
- Requirement: System shall provide list views with filters.
- Acceptance conditions:
1. Filters include status, assignee, priority, due date range.
2. End User sees own and assigned tasks only (unless policy changes).
3. Admin can view all tasks.

#### FR-8 Status summary report
- Actor: End User, Admin
- Requirement: System shall show counts by status.
- Acceptance conditions:
1. Report displays counts for all lifecycle statuses.
2. End User scope is user-restricted; Admin scope is global.

#### FR-9 Overdue report
- Actor: End User, Admin
- Requirement: System shall show tasks past due date and not completed.
- Acceptance conditions:
1. Overdue criteria: `dueDate < now` and status not `COMPLETED`.
2. Report updates within 1 second after status or due date edits.

#### FR-10 Productivity report
- Actor: End User, Admin
- Requirement: System shall display completed task volume over a selected period.
- Acceptance conditions:
1. Period presets: daily, weekly, monthly.
2. Count and completion trend are shown for selected scope.

#### FR-11 Trend report
- Actor: End User, Admin
- Requirement: System shall display trend of created vs completed tasks over time.
- Acceptance conditions:
1. Trend granularity supports day and week.
2. Data is computed from in-memory task dataset in near real time.

### Epic E5: User Administration
**Workflow:** admin manages user accounts and role assignment.

#### FR-12 Create and manage users
- Actor: Admin
- Requirement: System shall allow admin to create, activate/deactivate users, and assign roles.
- Acceptance conditions:
1. Unique email is enforced.
2. Only `END_USER` and `ADMIN` roles are allowed in v1.
3. Inactive users cannot authenticate.

## 6. Non-Functional Requirements (Measurable)
### 6.1 Security Baseline
1. Passwords must be hashed and never stored in plain text.
2. Authentication and authorization checks are mandatory for all protected endpoints.
3. Generic authentication failure messages must avoid user enumeration.
4. Session/token expiration policy must be defined and enforced (default assumption: 8 hours).

### 6.2 Performance
1. 95th percentile latency under 1 second for common actions:
   - Login
   - Create task
   - Update status
   - View task list with default filter
   - View summary report
2. Reporting queries complete under 1 second at target load.

### 6.3 Scalability
1. Support 100 registered users and up to 50 concurrent active sessions.
2. Degradation under peak load must remain graceful; error rate under 1% for common actions.

### 6.4 Reliability and Availability (v1)
1. In-memory data may reset on restart; this is accepted for v1.
2. System should recover to functional state within 2 minutes after process restart.
3. Application-level error responses must be deterministic and documented.

### 6.5 Maintainability and Architecture Constraints
1. Follow clean architecture boundaries (presentation, application, domain, infrastructure).
2. Keep domain rules centralized in domain/application layers.
3. Use DDD-aligned aggregates/entities for `User` and `Task`.
4. Public functions should include concise doc comments as per repository guidance.

## 7. Assumptions and Constraints
### 7.1 Confirmed Constraints
1. Storage is in-memory only for v1.
2. No third-party integrations in v1.
3. No mandated compliance framework at this stage.

### 7.2 Open Decisions (Explicitly Marked)
1. Access control depth (not finalized):
   - Option A: Basic RBAC (`END_USER`, `ADMIN`) [assumed for this document]
   - Option B: Detailed permission matrix [deferred]
2. Reporting delivery (not finalized):
   - Option A: On-screen dashboards only [assumed for this document]
   - Option B: Add export capability [deferred]
3. Deployment target (not finalized):
   - Option C: Decide later and treat as assumption [used in this document]

## 8. Traceability Matrix (FR -> Actor -> Workflow)
1. FR-1, FR-2 -> End User/Admin -> Authentication and access
2. FR-3, FR-4 -> End User/Admin -> Task creation and assignment
3. FR-5, FR-6 -> End User/Admin -> Lifecycle tracking
4. FR-7 to FR-11 -> End User/Admin -> Reporting and monitoring
5. FR-12 -> Admin -> User administration

## 9. Quality Check Results
1. Required sections are present: problem statement, personas, epics, FRs, NFRs, assumptions/constraints.
2. Functional requirements are mapped to actors and workflows.
3. Scope exclusions are explicit and consistent with out-of-scope list.
4. NFRs are measurable and testable.
5. Open assumptions are clearly labeled and isolated.

## 10. Sign-off Checklist for Next Iteration
1. Confirm Option A/B for access control depth.
2. Confirm reporting export requirement.
3. Confirm deployment target (cloud/on-prem) and operational constraints.
4. Decide whether audit trail moves into v1.1 or later.
