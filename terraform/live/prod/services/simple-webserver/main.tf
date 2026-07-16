provider "aws" {
  region = "us-east-1"
}

module "simple-webserver" {
  source = "../../../../modules/services/simple-webserver"

  instance_name = "resume-server-prod"
  instance_type = "t3.micro"

  admin_ip_cidr = var.admin_ip_cidr
  domain_name   = var.prod_domain_name
  key_name      = var.prod_key_name

  vpc_id    = data.terraform_remote_state.vpc.outputs.vpc_id
  subnet_id = data.terraform_remote_state.vpc.outputs.production_public_subnet_id

  enable_https = true
  enable_eip   = true
}

data "terraform_remote_state" "vpc" {
  backend = "s3"

  config = {
    bucket = "jqc-resume-tailor-state"
    key    = "global/vpc/terraform.tfstate"
    region = "us-east-1"
  }
}