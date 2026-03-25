---
description: Describe when these instructions should be loaded by the agent based on task context
/**
 * Backend Folder Configuration
 * 
 * TARGET SCOPE:
 * - Path Pattern: ~/task-management-mvp/backend/**/*
 * - Applies to: All files and subdirectories within the backend folder
 * - Recursive: Yes - includes nested directories
 * 
 * COVERAGE:
 * ✓ Source files (.js, .ts, etc.)
 * ✓ Configuration files
 * ✓ Subdirectories and their contents
 * ✓ All file types within backend/
 * 
 * EXCLUSIONS:
 * ✗ Files outside backend/ folder
 * ✗ Parent directories (task-management-mvp/)
 * ✗ Sibling folders (frontend/, etc.)
 */
applyTo: "~/task-management-mvp/backend/**/*"
---

# Nodejs Express Backend Coding Standards

## Architecture
- Follow Layered Architecture (Controllers, Services, Models).
- Use Dependency Injection for better testability.
- Use validation libraries (e.g., Zod) for request validation.

## Error Handling
- Implement centralized error handling middleware.
- Use custom error classes for different error types.
- Return consistent error response format.

## Security
- Hash passwords using bcrypt before storing.
- Use JWT for authentication and authorization.
- Validate and sanitize all user inputs to prevent injection attacks.

## Testing
- Use Jest for unit and integration testing.
- Mock external dependencies in tests.
- Aim for high test coverage, especially for critical business logic.
