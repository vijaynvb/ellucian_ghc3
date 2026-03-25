Genereate a Dockerfile for a backend application that uses Node.js and Express. The application should be able to run in a production environment and should include best practices for security and performance.

## requirements:
- user multi-stage builds to optimize the final image size.
- Use the official Node.js image as the base image.
- Set the working directory to /app.
- Copy the package.json and package-lock.json files to the working directory.
- Install the application dependencies using npm ci.
- Copy the rest of the application code to the working directory.
- Expose port 3000 for the application to listen on.- Use a non-root user to run the application for better security.
- Set the NODE_ENV environment variable to production.
- Use a multi-stage build to reduce the final image size.
- Include a health check to ensure the application is running properly.

## output:
- create for task-management-mvp/backend
- A Dockerfile that meets the above requirements.
- A brief explanation of the choices made in the Dockerfile, such as the base image, the use of multi-stage builds, and any security considerations taken into account.

## Actions:

1. Create a Dockerfile with the specified requirements.