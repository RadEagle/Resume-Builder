variable "domain_name" {
  description = "The apex domain name of the EC2 instance"
  type        = string
  sensitive   = true
}

variable "staging_subdomain" {
  description = "The subdomain name of the staging EC2 instance"
  type        = string
  default     = "staging"
}
