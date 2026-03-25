---
description: security related coding standards for the nodejs express backend as well as general security best practices for the project
applyTo: "**"
---

# security Guidlines

## Input Safety
- Always validate input 
- Never trust client-provide data 

## Secrets   
- Never hardcode secrets in code
- Use environment variables for secrets

## API Contracts
- Follow OpenAPI contract strictly for request/response formats
- Validate all incoming requests against OpenAPI schema
- Ensure all required fields are present and correctly typed

## Unsafe patterns (do not generate)
- eval() 
- logging sensitive information (e.g., passwords, tokens)
- using weak hashing algorithms (e.g., MD5, SHA1)
- using outdated libraries with known vulnerabilities
- allowing CORS from all origins in production
