resource "aws_db_instance" "postgresql" {
  db_name = var.db_name

  engine         = "postgres"
  engine_version = "18"
  instance_class = var.db_instance
  storage_type   = var.db_storage_type

  username = var.db_username
  password = var.db_password

  vpc_security_group_ids = [aws_security_group.default.id]
  storage_encrypted      = true
  publicly_accessible    = false

  db_subnet_group_name = aws_db_subnet_group.primary.name
  multi_az             = var.enable_multi_az

  allocated_storage         = 20
  backup_retention_period   = 7
  deletion_protection       = var.enable_deletion_protection
  skip_final_snapshot       = false
  final_snapshot_identifier = "resume-vault-prod-final-snapshot"
}

resource "aws_security_group" "default" {
  name        = "rds-security-group"
  description = "Security group for RDS"
  vpc_id      = var.vpc_id

  tags = {
    Name = "rds-security-group"
  }
}

resource "aws_vpc_security_group_ingress_rule" "webserver_to_postgresql" {
  security_group_id            = aws_security_group.default.id
  referenced_security_group_id = var.webserver_security_group_id

  ip_protocol = "tcp"
  from_port   = 5432
  to_port     = 5432
}

resource "aws_db_subnet_group" "primary" {
  name       = "rds-subnet-group"
  subnet_ids = var.subnet_ids

  tags = {
    Name = "rds-subnet-group"
  }
}