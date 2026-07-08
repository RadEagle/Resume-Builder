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