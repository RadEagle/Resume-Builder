provider "aws" {
  region = "us-east-1"
}

locals {
  cidr_subnets = cidrsubnets("10.0.0.0/17", 4, 4, 4, 4, 4, 4)
}

module "vpc" {
  source = "../../../modules/services/vpc"

  vpc_cidr        = "10.0.0.0/17"
  azs             = ["us-east-1a", "us-east-1b", "us-east-1c"]
  public_subnets  = slice(local.cidr_subnets, 0, 3)
  private_subnets = slice(local.cidr_subnets, 3, 6)

  public_subnet_tags_per_az = {
    "us-east-1a" = { Environment = "production" }
    "us-east-1b" = { Environment = "staging" }
  }
  private_subnet_tags_per_az = {
    "us-east-1a" = { Environment = "production" }
    "us-east-1b" = { Environment = "staging" }
  }

  enable_nat_gateway = false
}