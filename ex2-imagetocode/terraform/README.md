# Terraform: Amplify + Lambda + AppSync + DynamoDB + Cognito

This Terraform stack deploys the architecture shown in the provided image:

- Amazon Cognito for authentication
- AWS Amplify for frontend hosting (optional)
- AWS Lambda as GraphQL resolver logic
- AWS AppSync GraphQL API
- DynamoDB as application data store

## Folder Structure

- `versions.tf` provider and Terraform version constraints
- `variables.tf` input variables
- `main.tf` AWS resources
- `schema.graphql` AppSync schema
- `lambda-src/index.js` Lambda resolver code
- `outputs.tf` deployment outputs
- `terraform.tfvars.example` sample variable values

## Prerequisites

- Terraform >= 1.5
- AWS credentials configured (environment variables, profile, or SSO)

## Deploy

```bash
cd ex2-imagetocode/terraform
cp terraform.tfvars.example terraform.tfvars
# edit terraform.tfvars with your values
terraform init
terraform plan
terraform apply
```

## Notes

- Set `enable_amplify=false` if you do not want to create Amplify resources.
- If `enable_amplify=true`, both `amplify_repository_url` and `amplify_access_token` are required.
- Lambda uses AWS SDK v3 clients available in the managed Node.js 20.x runtime.
