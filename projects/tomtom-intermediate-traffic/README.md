# TomTom Traffic Pipeline

This package provides functionality for fetching traffic data from TomTom's Intermediate Traffic API and loading it into BigQuery using Cloud Run Jobs.

## Quick Start

### Local Development

```bash
# Run the pipeline locally (from workspace root)
./proj/tomtom_intermediate_traffic/run-local.sh

# This will:
# - Navigate to workspace root automatically
# - Use uv to manage dependencies and virtual environment
# - Run the pipeline job with proper workspace setup
```

**Prerequisites for local development:**
- Install [uv](https://docs.astral.sh/uv/) for Python dependency management
- Authenticate with Google Cloud: `gcloud auth application-default login`
- Ensure TomTom secrets are created in Secret Manager (see below)

### Cloud Deployment

```bash
# Deploy to Google Cloud Run Jobs
./deployment/deploy.sh your-project-id us-central1

# Setup Cloud Scheduler
./deployment/setup-scheduler.sh your-project-id us-central1
```

## Required Secrets

The pipeline requires these secrets in Google Cloud Secret Manager:

- `tomtom_intermediate_api_key` - Your TomTom API key
- `tomtom_client_certificate` - TLS client certificate (PEM format)
- `tomtom_client_key` - TLS client private key (PEM format)

Create them using:

```bash
# API key (string value)
echo 'your-api-key-string' | gcloud secrets create tomtom_intermediate_api_key --data-file=-

# Certificate files (PEM format)
gcloud secrets create tomtom_client_certificate --data-file=client.pem  
gcloud secrets create tomtom_client_key --data-file=client-key.pem
```

## Environment Variables

- `GOOGLE_CLOUD_PROJECT` - Your Google Cloud project ID (defaults to 'ether-demo')
- `FLOW_TYPE` - Traffic flow type: 'ff' (free flow) or 'nff' (non-free flow) (defaults to 'ff')
- `TOMTOM_INTERMEDIATE_API_PRODUCT_NAME` - TomTom product name (defaults to 'USA_N-HDF_DETAILED-OPENLR')

**Note**: For local development, you can set these in a `.env` file in the workspace root.

## Architecture

- **Cloud Run Job**: Executes the pipeline on schedule
- **Secret Manager**: Stores TomTom API credentials
- **BigQuery**: Stores processed traffic data
- **Cloud Scheduler**: Triggers job execution

## Data Pipeline

1. Checks BigQuery for last update timestamp
2. Fetches data from TomTom API with conditional requests
3. Converts protobuf to structured data with WKT geometry
4. Loads data into BigQuery with staging table approach
5. Atomically updates main table (idempotent)
