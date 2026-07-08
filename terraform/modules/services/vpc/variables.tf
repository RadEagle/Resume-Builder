variable "vpc_cidr" {
  type        = string
  description = "The IP range to use for the VPC"
  default     = "10.0.0.0/16"
}

variable "azs" {
  type        = list(string)
  description = "AZs to create subnets into"
}

variable "public_subnets" {
  type        = list(string)
  description = "subnets to create for public network traffic, one per AZ"
}

variable "private_subnets" {
  type        = list(string)
  description = "subnets to create for private network traffic, one per AZ"
}

variable "public_subnet_tags_per_az" {
  type        = map(map(string))
  description = "tags to add to the public subnets"
  default     = {}
}

variable "private_subnet_tags_per_az" {
  type        = map(map(string))
  description = "tags to add to the private subnets"
  default     = {}
}