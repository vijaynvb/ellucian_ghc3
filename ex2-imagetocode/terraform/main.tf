locals {
  common_tags = merge(var.tags, { Name = var.project_name })
}

resource "aws_cognito_user_pool" "this" {
  name = "${var.project_name}-user-pool"

  auto_verified_attributes = ["email"]

  password_policy {
    minimum_length    = 8
    require_lowercase = true
    require_numbers   = true
    require_symbols   = false
    require_uppercase = true
  }

  tags = local.common_tags
}

resource "aws_cognito_user_pool_client" "this" {
  name         = "${var.project_name}-client"
  user_pool_id = aws_cognito_user_pool.this.id

  explicit_auth_flows = [
    "ALLOW_USER_PASSWORD_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH",
    "ALLOW_USER_SRP_AUTH"
  ]

  generate_secret = false
}

resource "aws_dynamodb_table" "tasks" {
  name         = "${var.project_name}-tasks"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"

  attribute {
    name = "id"
    type = "S"
  }

  tags = local.common_tags
}

data "archive_file" "lambda_zip" {
  type        = "zip"
  source_dir  = "${path.module}/lambda-src"
  output_path = "${path.module}/lambda.zip"
}

resource "aws_iam_role" "lambda_exec" {
  name = "${var.project_name}-lambda-exec"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
        Action = "sts:AssumeRole"
      }
    ]
  })

  tags = local.common_tags
}

resource "aws_iam_role_policy_attachment" "lambda_logs" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_role_policy" "lambda_dynamodb" {
  name = "${var.project_name}-lambda-dynamodb"
  role = aws_iam_role.lambda_exec.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem",
          "dynamodb:Scan",
          "dynamodb:Query"
        ]
        Resource = [
          aws_dynamodb_table.tasks.arn,
          "${aws_dynamodb_table.tasks.arn}/index/*"
        ]
      }
    ]
  })
}

resource "aws_lambda_function" "graphql_resolver" {
  function_name    = "${var.project_name}-resolver"
  role             = aws_iam_role.lambda_exec.arn
  handler          = "index.handler"
  runtime          = "nodejs20.x"
  filename         = data.archive_file.lambda_zip.output_path
  source_code_hash = data.archive_file.lambda_zip.output_base64sha256
  timeout          = 15

  environment {
    variables = {
      TASKS_TABLE_NAME = aws_dynamodb_table.tasks.name
    }
  }

  tags = local.common_tags
}

resource "aws_iam_role" "appsync_datasource" {
  name = "${var.project_name}-appsync-datasource"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "appsync.amazonaws.com"
        }
        Action = "sts:AssumeRole"
      }
    ]
  })

  tags = local.common_tags
}

resource "aws_iam_role_policy" "appsync_datasource" {
  name = "${var.project_name}-appsync-datasource"
  role = aws_iam_role.appsync_datasource.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "lambda:InvokeFunction"
        ]
        Resource = [
          aws_lambda_function.graphql_resolver.arn
        ]
      },
      {
        Effect = "Allow"
        Action = [
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem",
          "dynamodb:Scan",
          "dynamodb:Query"
        ]
        Resource = [
          aws_dynamodb_table.tasks.arn,
          "${aws_dynamodb_table.tasks.arn}/index/*"
        ]
      }
    ]
  })
}

resource "aws_appsync_graphql_api" "this" {
  name                = "${var.project_name}-api"
  authentication_type = "AMAZON_COGNITO_USER_POOLS"

  user_pool_config {
    aws_region     = var.aws_region
    default_action = "ALLOW"
    user_pool_id   = aws_cognito_user_pool.this.id
  }

  tags = local.common_tags
}

resource "aws_appsync_graphql_schema" "this" {
  api_id     = aws_appsync_graphql_api.this.id
  definition = file("${path.module}/schema.graphql")
}

resource "aws_appsync_datasource" "lambda" {
  api_id           = aws_appsync_graphql_api.this.id
  name             = "LambdaDS"
  type             = "AWS_LAMBDA"
  service_role_arn = aws_iam_role.appsync_datasource.arn

  lambda_config {
    function_arn = aws_lambda_function.graphql_resolver.arn
  }
}

resource "aws_appsync_datasource" "dynamodb" {
  api_id           = aws_appsync_graphql_api.this.id
  name             = "DynamoDBDS"
  type             = "AMAZON_DYNAMODB"
  service_role_arn = aws_iam_role.appsync_datasource.arn

  dynamodb_config {
    table_name = aws_dynamodb_table.tasks.name
    aws_region = var.aws_region
  }
}

resource "aws_appsync_resolver" "list_tasks" {
  api_id      = aws_appsync_graphql_api.this.id
  type        = "Query"
  field       = "listTasks"
  data_source = aws_appsync_datasource.lambda.name

  request_template  = <<EOT
{}
EOT
  response_template = <<EOT
$util.toJson($ctx.result)
EOT

  depends_on = [aws_appsync_graphql_schema.this]
}

resource "aws_appsync_resolver" "create_task" {
  api_id      = aws_appsync_graphql_api.this.id
  type        = "Mutation"
  field       = "createTask"
  data_source = aws_appsync_datasource.lambda.name

  request_template = <<EOT
{
  "operation": "Invoke",
  "payload": {
    "field": "createTask",
    "arguments": $util.toJson($ctx.arguments)
  }
}
EOT
  response_template = <<EOT
$util.toJson($ctx.result)
EOT

  depends_on = [aws_appsync_graphql_schema.this]
}

resource "aws_appsync_resolver" "get_task" {
  api_id      = aws_appsync_graphql_api.this.id
  type        = "Query"
  field       = "getTask"
  data_source = aws_appsync_datasource.dynamodb.name

  request_template = <<EOT
{
  "version": "2018-05-29",
  "operation": "GetItem",
  "key": {
    "id": $util.dynamodb.toDynamoDBJson($ctx.args.id)
  }
}
EOT
  response_template = <<EOT
$util.toJson($ctx.result)
EOT

  depends_on = [aws_appsync_graphql_schema.this]
}

resource "aws_lambda_permission" "allow_appsync" {
  statement_id  = "AllowExecutionFromAppSync"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.graphql_resolver.function_name
  principal     = "appsync.amazonaws.com"
  source_arn    = "${aws_appsync_graphql_api.this.arn}/*"
}

resource "aws_amplify_app" "this" {
  count = var.enable_amplify ? 1 : 0

  name         = "${var.project_name}-frontend"
  repository   = var.amplify_repository_url
  access_token = var.amplify_access_token

  build_spec = <<EOT
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: dist
    files:
      - '**/*'
EOT

  environment_variables = {
    VITE_AWS_REGION         = var.aws_region
    VITE_APPSYNC_GRAPHQL_URL = aws_appsync_graphql_api.this.uris["GRAPHQL"]
    VITE_COGNITO_USER_POOL_ID = aws_cognito_user_pool.this.id
    VITE_COGNITO_CLIENT_ID    = aws_cognito_user_pool_client.this.id
  }

  lifecycle {
    precondition {
      condition     = !var.enable_amplify || (length(var.amplify_repository_url) > 0 && length(var.amplify_access_token) > 0)
      error_message = "When enable_amplify is true, set amplify_repository_url and amplify_access_token."
    }
  }

  tags = local.common_tags
}

resource "aws_amplify_branch" "main" {
  count = var.enable_amplify ? 1 : 0

  app_id      = aws_amplify_app.this[0].id
  branch_name = var.amplify_branch_name
  framework   = "React"
  stage       = "PRODUCTION"

  enable_auto_build = true
}
