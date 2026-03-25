variable "aws_region" {
  description = "AWS region for all resources."
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Prefix used for naming resources."
  type        = string
  default     = "image2code-appsync"
}

variable "tags" {
  description = "Common tags for resources."
  type        = map(string)
  default = {
    ManagedBy = "Terraform"
    Project   = "ex2-imagetocode"
  }
}

variable "enable_amplify" {
  description = "Set true to create Amplify app + branch."
  type        = bool
  default     = false
}

variable "amplify_repository_url" {
  description = "Git repository URL for Amplify (required when enable_amplify=true)."
  type        = string
  default     = ""
}

variable "amplify_access_token" {
  description = "OAuth token for the Git provider used by Amplify (required when enable_amplify=true)."
  type        = string
  default     = ""
  sensitive   = true
}

variable "amplify_branch_name" {
  description = "Branch to connect in Amplify."
  type        = string
  default     = "main"
}
