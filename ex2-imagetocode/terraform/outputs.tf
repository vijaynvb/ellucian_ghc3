output "cognito_user_pool_id" {
  description = "Cognito User Pool ID."
  value       = aws_cognito_user_pool.this.id
}

output "cognito_user_pool_client_id" {
  description = "Cognito App Client ID."
  value       = aws_cognito_user_pool_client.this.id
}

output "dynamodb_table_name" {
  description = "DynamoDB table name used by AppSync/Lambda."
  value       = aws_dynamodb_table.tasks.name
}

output "lambda_function_name" {
  description = "Lambda resolver function name."
  value       = aws_lambda_function.graphql_resolver.function_name
}

output "appsync_graphql_endpoint" {
  description = "AppSync GraphQL API endpoint."
  value       = aws_appsync_graphql_api.this.uris["GRAPHQL"]
}

output "appsync_api_id" {
  description = "AppSync API ID."
  value       = aws_appsync_graphql_api.this.id
}

output "amplify_app_id" {
  description = "Amplify app ID (if enabled)."
  value       = var.enable_amplify ? aws_amplify_app.this[0].id : null
}

output "amplify_default_domain" {
  description = "Amplify default domain (if enabled)."
  value       = var.enable_amplify ? aws_amplify_app.this[0].default_domain : null
}
