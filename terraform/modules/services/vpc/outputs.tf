# VPC
output "vpc_id" {
  value       = module.vpc.vpc_id
  description = "The ID of the VPC"
}

output "vpc_cidr" {
  value       = module.vpc.vpc_cidr_block
  description = "The CIDR block of the VPC"
}

output "vpc_public_subnets" {
  value       = module.vpc.public_subnets
  description = "The public subnets of the VPC"
}

output "vpc_private_subnets" {
  value       = module.vpc.private_subnets
  description = "The private subnets of the VPC"
}

output "vpc_nat_public_ips" {
  value       = module.vpc.nat_public_ips
  description = "The public IP addresses of the NAT gateways"
}

# Public Subnets
output "production_public_subnet_id" {
  value       = module.vpc.public_subnets[0]
  description = "The ID of the production public subnet"
}

output "staging_public_subnet_id" {
  value       = module.vpc.public_subnets[1]
  description = "The ID of the staging public subnet"
}

output "spare_public_subnet_id" {
  value       = module.vpc.public_subnets[2]
  description = "The ID of the spare public subnet"
}

# Private Subnets
output "production_private_subnet_id" {
  value       = module.vpc.private_subnets[0]
  description = "The ID of the production private subnet"
}

output "staging_private_subnet_id" {
  value       = module.vpc.private_subnets[1]
  description = "The ID of the staging private subnet"
}

output "spare_private_subnet_id" {
  value       = module.vpc.private_subnets[2]
  description = "The ID of the spare private subnet"
}