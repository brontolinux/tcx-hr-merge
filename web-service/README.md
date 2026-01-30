# TCX Heart Rate Merger - Web Service

A web-based version of the TCX Heart Rate Merger tool. It allows you to:

- Upload your two TCX files through a simple web interface
- Merge the heart rate data automatically
- Download the merged file

**Privacy**: All processing happens entirely in your browser - your files never leave your device.

**BUILT WITH CoPilot, YMMV!!!**

## Architecture

The web service is a static website deployed to AWS S3. All TCX file processing is done client-side in JavaScript, so no server-side computation is needed.

```
┌─────────────┐      ┌─────────────────┐
│   Browser   │─────▶│   S3 Website    │
│             │      │  (Static files) │
│  - Load UI  │      └─────────────────┘
│  - Parse TCX│
│  - Merge HR │
│  - Download │
└─────────────┘
```

**Benefits of client-side processing:**

- **Privacy**: Your fitness data never leaves your browser
- **Speed**: No network round-trip for processing
- **Cost**: No Lambda or API Gateway costs
- **Simplicity**: Just static file hosting

## Local Usage

Since all processing happens client-side in your browser, you can use the tool without deploying it to AWS. Simply open the `frontend/index.html` file directly in your browser:

```bash
# From the web-service directory
xdg-open frontend/index.html   # Linux
open frontend/index.html       # macOS
start frontend/index.html      # Windows
```

Or drag and drop the file into your browser window. The tool will work exactly the same way as the hosted version.

## Prerequisites

- [Terraform](https://www.terraform.io/downloads) >= 1.0.0
- AWS CLI configured with appropriate credentials
- AWS account with permissions to create S3 resources

## Deployment

1. Navigate to the terraform directory:

   ```bash
   cd terraform
   ```

2. Copy the example variables file and customize:

   ```bash
   cp terraform.tfvars.example terraform.tfvars
   # Edit terraform.tfvars with your preferred settings
   ```

3. Initialize Terraform:

   ```bash
   terraform init
   ```

4. Review the deployment plan:

   ```bash
   terraform plan
   ```

5. Apply the configuration:

   ```bash
   terraform apply
   ```

6. After deployment, Terraform will output:
   - `website_url`: The URL of your web service

## Configuration Options

| Variable            | Description                   | Default         |
| ------------------- | ----------------------------- | --------------- |
| `project_name`      | Name used for resource naming | `tcx-hr-merger` |
| `environment`       | Deployment environment        | `prod`          |
| `aws_region`        | AWS region for deployment     | `eu-west-1`     |
| `allowed_ip_ranges` | List of allowed IP CIDRs      | `[]` (all IPs)  |

## IP Restriction

To restrict access to specific IP ranges, set the `allowed_ip_ranges` variable. Both IPv4 and IPv6 CIDR notation are supported:

```hcl
allowed_ip_ranges = [
  "203.0.113.0/24",              # Office network (IPv4)
  "198.51.100.0/24",             # VPN range (IPv4)
  "192.0.2.1/32",                # Single IPv4 address
  "2001:db8::/32",               # IPv6 range
  "2001:db8:1234:5678::1/128"    # Single IPv6 address
]
```

When this variable is empty (default), the website is accessible from any IP address.

## Directory Structure

```
web-service/
├── frontend/           # Static website files
│   ├── index.html      # Main HTML page
│   ├── styles.css      # Stylesheet
│   └── app.js          # JavaScript application (includes merge logic)
└── terraform/          # Infrastructure as Code
    ├── main.tf         # Common configuration, providers, locals
    ├── variables.tf    # Input variables
    ├── outputs.tf      # Output values
    ├── s3.tf           # S3 bucket and website hosting
    └── terraform.tfvars.example
```

## Security Notes

- All file processing happens in your browser - no data is sent to any server
- Files are read into memory, processed, and discarded when you close the page
- S3 bucket policy can restrict access by IP address
- File size is validated client-side before processing (max 15MB)

## Cleanup

To destroy all AWS resources:

```bash
cd terraform
terraform destroy
```
