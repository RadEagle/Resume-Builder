module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "6.6.1"

  name = "resume-tailor-vpc"
  cidr = var.vpc_cidr

  azs = var.azs

  enable_dns_hostnames   = true
  enable_nat_gateway     = var.enable_nat_gateway
  single_nat_gateway     = true
  one_nat_gateway_per_az = false

  public_subnets  = var.public_subnets
  private_subnets = var.private_subnets

  public_subnet_tags_per_az  = var.public_subnet_tags_per_az
  private_subnet_tags_per_az = var.private_subnet_tags_per_az

  public_subnet_names  = ["public-production", "public-staging", "public-spare"]
  private_subnet_names = ["private-production", "private-staging", "private-spare"]
}
