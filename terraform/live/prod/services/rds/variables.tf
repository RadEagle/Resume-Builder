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