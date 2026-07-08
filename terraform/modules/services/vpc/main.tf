module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "6.6.1"

  name = "resume-tailor-vpc"
  cidr = var.vpc_cidr

  azs = var.azs

  enable_dns_hostnames   = true
  enable_nat_gateway     = true # set to false to disable NAT gateway
  single_nat_gateway     = true
  one_nat_gateway_per_az = false

  public_subnets  = var.public_subnets
  private_subnets = var.private_subnets
}
