Genereate a Dockerfile for a frontend application that uses React. The application should be able to run in a production environment and should include best practices for security and performance.

## requirements:
- user multi-stage builds to optimize the final image size.
- Use the official Node.js image as the base image for the build stage.
- Set the working directory to /app.
- Copy the package.json and package-lock.json files to the working directory.
- Install the application dependencies using npm ci.
- Copy the rest of the application code to the working directory.
- Build the application using npm run build.
- Use the official Nginx image as the base image for the production stage.
- Copy the built application from the build stage to the Nginx HTML directory.
- Expose port 80 for the application to listen on.
- Use a non-root user to run the application for better security.
- Include a health check to ensure the application is running properly. 

## output:
- create for task-management-mvp/frontend
- A Dockerfile that meets the above requirements.
- A brief explanation of the choices made in the Dockerfile, such as the base image, the use of multi-stage builds, and any security considerations taken into account.

## Actions: 
1. Create a Dockerfile with the specified requirements.