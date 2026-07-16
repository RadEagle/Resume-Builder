variable "stage_key_name" {
  description = "The name of the key pair"
  type        = string
  sensitive   = true
}

variable "stage_domain_name" {
  description = "The domain name of the EC2 instance"
  type        = string
  sensitive   = true
}

variable "admin_ip_cidr" {
  description = "The IP address of the admin"
  type        = string
  sensitive   = true
}