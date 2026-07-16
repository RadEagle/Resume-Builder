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

# variable "preview_subdomain" {
#   description = "The subdomain name of the incoming prod EC2 instance"
#   type        = string
#   default     = "preview"
# }

variable "legacy_subdomain" {
  description = "The subdomain name of the legacy EC2 instance"
  type        = string
  default     = "legacy"
}

variable "legacy_prod_ip" {
  description = "The existing elastic IP for the old server"
  type        = string
  sensitive   = true
}
