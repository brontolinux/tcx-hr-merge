# TCX Heart Rate Merger - Terraform Variables
# Input variables for the static website deployment

variable "project_name" {
  description = "Name of the project, used for resource naming"
  type        = string
  default     = "tcx-hr-merger"
}

variable "environment" {
  description = "Deployment environment (e.g., dev, staging, prod)"
  type        = string
  default     = "prod"
}

variable "aws_region" {
  description = "AWS region for deploying resources"
  type        = string
  default     = "eu-west-1"
}

variable "tags" {
  description = "Tags to apply to all resources"
  type        = map(string)
  default     = {}
}

variable "allowed_ip_ranges" {
  description = "List of IP CIDR ranges (IPv4 and/or IPv6) allowed to access the website. If empty, access is allowed from anywhere."
  type        = list(string)
  default     = []
}
