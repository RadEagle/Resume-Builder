data "aws_iam_policy_document" "assume_role" {
  statement {
    effect  = "Allow"
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["ec2.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "webserver" {
  name               = "${var.instance_name}-role"
  assume_role_policy = data.aws_iam_policy_document.assume_role.json
}

data "aws_iam_policy_document" "ses-send" {
  statement {
    effect    = "Allow"
    actions   = ["ses:SendEmail", "ses:SendRawEmail"]
    resources = ["*"]
  }
}

resource "aws_iam_role_policy" "ses" {
  name   = "${var.instance_name}-ses"
  role   = aws_iam_role.webserver.id
  policy = data.aws_iam_policy_document.ses-send.json
}

resource "aws_iam_instance_profile" "webserver" {
  name = "${var.instance_name}-profile"
  role = aws_iam_role.webserver.name
}