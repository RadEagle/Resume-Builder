variable "instance_name" {
  description = "The name of the EC2 instance"
  type        = string
  default     = "resume-server"
}

variable "instance_type" {
  description = "The type of the EC2 instance"
  type        = string
  default     = "t3.micro"
}

variable "admin_ip_cidr" {
  description = "The CIDR block of the admin IP"
  type        = string
  sensitive   = true
}

variable "domain_name" {
  description = "The domain name of the EC2 instance"
  type        = string
  default     = null
}

variable "key_name" {
  description = "The name of the key pair"
  type        = string
}

variable "vpc_id" {
  description = "The ID of the VPC"
  type        = string
}

variable "subnet_id" {
  description = "The ID of the subnet"
  type        = string
}

variable "enable_https" {
  description = "Whether to enable HTTPS"
  type        = bool
  default     = false
}

variable "enable_eip" {
  description = "Whether to enable Elastic IP"
  type        = bool
  default     = false
}