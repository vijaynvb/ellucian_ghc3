# Task Management MVP Scaffold

Generated full-stack scaffold from OpenAPI.

## Structure

- `backend/` Express.js + TypeScript + JWT + Zod + Jest
- `frontend/` React + TypeScript + Vite + React Hook Form + Zod + Context API

## Run Commands

### Full Stack (Single Command)

```bash
cd task-management-mvp
npm install
npm run install:all
npm run dev
```

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## TODO Roadmap

1. Add persistent database (PostgreSQL + ORM)
2. Add refresh token flow with token revocation
3. Add full test coverage for role and lifecycle transitions
4. Add OpenAPI contract tests
5. Add charts and richer dashboards for report endpoints
6. Add CI pipeline with lint/typecheck/test/build
7. Add Docker compose setup for local full-stack runtime
