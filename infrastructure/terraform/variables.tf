variable "environment" {
  description = "Environment name"
  type        = string
  default     = "dev"
}

variable "location" {
  description = "Azure region"
  type        = string
  default     = "centralindia"
}

variable "project_name" {
  description = "Project name"
  type        = string
  default     = "ecom"
}

variable "sql_admin_password" {
  description = "SQL Server administrator password"
  type        = string
  sensitive   = true
}

variable "allowed_ip_addresses" {
  description = "List of allowed IP addresses for App Service"
  type        = list(string)
  default     = []
}