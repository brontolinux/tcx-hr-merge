# TCX Heart Rate Merger - S3 Configuration
# S3 bucket for static website hosting

# S3 bucket for the static website
resource "aws_s3_bucket" "website" {
  bucket = "${local.resource_prefix}-website"

  tags = local.common_tags
}

# Block public access settings - we'll use bucket policy instead
resource "aws_s3_bucket_public_access_block" "website" {
  bucket = aws_s3_bucket.website.id

  block_public_acls       = true
  block_public_policy     = false
  ignore_public_acls      = true
  restrict_public_buckets = false
}

# Enable static website hosting
resource "aws_s3_bucket_website_configuration" "website" {
  bucket = aws_s3_bucket.website.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "index.html"
  }
}

# Bucket policy for read access (optionally restricted by IP)
resource "aws_s3_bucket_policy" "website" {
  bucket = aws_s3_bucket.website.id

  depends_on = [aws_s3_bucket_public_access_block.website]

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "ReadGetObject"
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.website.arn}/*"
        Condition = length(var.allowed_ip_ranges) > 0 ? {
          IpAddress = {
            "aws:SourceIp" = var.allowed_ip_ranges
          }
        } : null
      }
    ]
  })
}

# Upload index.html
resource "aws_s3_object" "index_html" {
  bucket       = aws_s3_bucket.website.id
  key          = "index.html"
  content      = file("${path.module}/../frontend/index.html")
  content_type = "text/html"
  etag         = md5(file("${path.module}/../frontend/index.html"))

  tags = local.common_tags
}

# Upload styles.css
resource "aws_s3_object" "styles_css" {
  bucket       = aws_s3_bucket.website.id
  key          = "styles.css"
  content      = file("${path.module}/../frontend/styles.css")
  content_type = "text/css"
  etag         = md5(file("${path.module}/../frontend/styles.css"))

  tags = local.common_tags
}

# Upload app.js
resource "aws_s3_object" "app_js" {
  bucket       = aws_s3_bucket.website.id
  key          = "app.js"
  content      = file("${path.module}/../frontend/app.js")
  content_type = "application/javascript"
  etag         = md5(file("${path.module}/../frontend/app.js"))

  tags = local.common_tags
}
