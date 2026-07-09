data "aws_ami" "al2023" {
  most_recent = true

  filter {
    name   = "name"
    values = ["al2023-ami-2023*"]
  }

  owners = ["amazon"]
}

resource "aws_instance" "resume_server" {
  ami           = data.aws_ami.al2023.id
  instance_type = var.instance_type

  vpc_security_group_ids = [aws_security_group.resume_server.id]
  subnet_id              = var.subnet_id

  key_name                    = var.key_name
  associate_public_ip_address = true

  tags = {
    Name = var.instance_name
  }
}

resource "aws_eip" "resume_server" {
  count = var.enable_eip ? 1 : 0

  instance = aws_instance.resume_server.id
  domain   = "vpc"
}