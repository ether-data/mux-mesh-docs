# Ether Gateway - Cloud Run Deployment

This directory contains deployment configurations for running the Ether Gateway on Google Cloud Run.

## Quick Start

```bash
# Deploy to Google Cloud Run
./deployment/deploy.sh your-project-id us-central1
```

## Files

- **`cloudbuild.yaml`** - Cloud Build configuration for building and deploying the container
- **`deploy.sh`** - Deployment script that handles the full build and deploy process
- **`Dockerfile`** - Multi-stage container definition (located in parent directory)
- **`.dockerignore`** - Files to exclude from Docker build context

## Deployment Process

The deployment follows these steps:

1. **Build Stage** - Creates a multi-stage Docker image with all workspace dependencies
2. **Push Stage** - Pushes the image to Google Container Registry
3. **Deploy Stage** - Deploys the image to Cloud Run with production configuration

## Configuration

### Environment Variables

The following environment variables are set for production:

```bash
ENVIRONMENT=production
CORS_ORIGINS=*
# PORT is automatically set by Cloud Run
```

### Health Checks

Cloud Run uses these endpoints for health monitoring:

- **Liveness:** `/health/live` - Basic health check
- **Readiness:** `/health/ready` - Ready to serve traffic
- **Full Health:** `/health` - Comprehensive service health check

## Service URLs

After deployment, the gateway will be available at:

- **Service URL:** `https://ether-gateway-[hash]-[region].run.app`
- **API Documentation:** `/docs`
- **ReDoc:** `/redoc`
- **Health Check:** `/health`

## API Endpoints

The deployed gateway exposes:

- **Places API:** `/v1/places/` (Overture POI data)
- **Traffic API:** `/v1/traffic/` (TomTom traffic data)
- **MCP Gateway:** `/gateway/mcp/` (MCP server)
- **Service Discovery:** `/api/` (Dynamic service discovery)

## Monitoring

### View Logs

```bash
# Recent logs
gcloud logging read 'resource.type="cloud_run_revision" AND resource.labels.service_name="ether-gateway"' --limit=50

# Follow logs
gcloud logging tail 'resource.type="cloud_run_revision" AND resource.labels.service_name="ether-gateway"'
```

### Service Status

```bash
# Get service details
gcloud run services describe ether-gateway --region=us-central1

# List all revisions
gcloud run revisions list --service=ether-gateway --region=us-central1
```

### Testing Deployment

```bash
# Get service URL
SERVICE_URL=$(gcloud run services describe ether-gateway --region=us-central1 --format="value(status.url)")

# Test health endpoint
curl "$SERVICE_URL/health/ready"

# Test API documentation
curl "$SERVICE_URL/docs"
```

## Updating the Service

To update the deployed service:

1. Make changes to the code
2. Run the deployment script again:
   ```bash
   ./deployment/deploy.sh your-project-id us-central1
   ```

Cloud Run will automatically create a new revision and gradually shift traffic to it.

## Troubleshooting

### Common Issues

1. **Build failures** - Check Cloud Build logs:
   ```bash
   gcloud builds list --limit=5
   gcloud builds log <BUILD_ID>
   ```

2. **Service won't start** - Check Cloud Run logs:
   ```bash
   gcloud logging read 'resource.type="cloud_run_revision" AND resource.labels.service_name="ether-gateway"' --limit=20
   ```

3. **Import errors** - Ensure all workspace dependencies are included in the build

### Debug Locally

Test the Docker image locally:

```bash
# Build locally (from workspace root)
docker build -f proj/apis/gateway/Dockerfile -t ether-gateway .

# Run locally
docker run -p 8000:8000 -e ENVIRONMENT=production ether-gateway

# Test
curl http://localhost:8000/health/ready
```
