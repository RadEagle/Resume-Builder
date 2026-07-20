provider "aws" {
  region = "us-east-1"
}

module "rds" {
  source = "../../../../modules/services/rds"

  db_name         = "resume_vault_prod"
  db_instance     = "db.t4g.micro"
  db_storage_type = "gp3"

  db_username = var.db_username
  db_password = var.db_password

  enable_deletion_protection = false

  vpc_id                      = data.terraform_remote_state.vpc.outputs.vpc_id
  webserver_security_group_id = data.terraform_remote_state.webserver.outputs.instance_security_group_id
  subnet_ids                  = [data.terraform_remote_state.vpc.outputs.production_private_subnet_id, data.terraform_remote_state.vpc.outputs.spare_private_subnet_id]
}

data "terraform_remote_state" "vpc" {
  backend = "s3"

  config = {
    bucket = "jqc-resume-tailor-state"
    key    = "global/vpc/terraform.tfstate"
    region = "us-east-1"
  }
}

data "terraform_remote_state" "webserver" {
  backend = "s3"

  config = {
    bucket = "jqc-resume-tailor-state"
    key    = "prod/services/simple-webserver/terraform.tfstate"
    region = "us-east-1"
  }
}