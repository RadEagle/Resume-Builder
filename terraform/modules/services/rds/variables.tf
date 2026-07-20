variable "db_name" {
  description = "The name of the postgresql database"
  type        = string
  default     = "resume_vault"
}

variable "db_instance" {
  description = "The instance type of the postgresql database"
  type        = string
  default     = "db.t4g.micro"
}

variable "db_storage_type" {
  description = "The storage type of the postgresql database"
  type        = string
  default     = "gp3"
}

variable "db_username" {
  description = "The username who owns the database"
  type        = string
  sensitive   = true
}

variable "db_password" {
  description = "The password to access the database"
  type        = string
  sensitive   = true
}

variable "enable_multi_az" {
  description = "Whether to enable multi-az"
  type        = bool
  default     = false
}

variable "enable_deletion_protection" {
  description = "Whether to enable deletion protection"
  type        = bool
  default     = true
}

variable "vpc_id" {
  description = "The ID of the VPC"
  type        = string
}

variable "webserver_security_group_id" {
  description = "The ID of the webserver security group"
  type        = string
}

variable "subnet_ids" {
  description = "The IDs of the subnets"
  type        = list(string)
}