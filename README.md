# Mux-Mesh: Spatio-Temporal Data Workspace

A monorepo workspace for spatio-temporal projects, providing shared utilities and infrastructure for building scalable data processing solutions on Google Cloud.

## Overview

Mux-Mesh is an umbrella workspace that houses multiple spatio-temporal projects, each with their own specific purpose and deployment configurations. The workspace provides shared core utilities, logging infrastructure, and development tooling to accelerate development.

## Available Projects

### Core Utilities (`proj/core/`)
Shared infrastructure and utilities used across all pipeline projects.

**Features:**
- Standardized logging configuration for local and Cloud environments
- Common utilities for data processing
- Shared development tooling and configurations

### [APIs Gateway](proj/apis/gateway/README.md)
API gateway service for managing and routing requests to various data processing services.

### [Overture](proj/apis/overture/README.md)
Overture Maps data processing and API service.

### [TomTom Flow](proj/apis/tomtom_flow/README.md)
TomTom traffic flow data processing API service.

### [TomTom Traffic Pipeline](proj/tomtom_intermediate_traffic/README.md)
Real-time traffic data pipeline for collecting and processing TomTom traffic flow data.

**Features:**
- Fetches live traffic flow data from TomTom Intermediate Traffic API
- Processes OpenLR binary data and converts to WKT geometry
- Loads data into BigQuery with efficient staging and partitioning
- Automated scheduling with Cloud Run Jobs and Cloud Scheduler
- Intelligent conditional requests to minimize API usage

**Quick Start:**
```bash
# Deploy to Google Cloud
./proj/tomtom_intermediate_traffic/deployment/deploy.sh your-project-id us-central1

# Run locally
./proj/tomtom_intermediate_traffic/run-local.sh
```

See [`proj/tomtom_intermediate_traffic/README.md`](proj/tomtom_intermediate_traffic/README.md) for detailed documentation.

## Getting Started

### Prerequisites
- [uv](https://docs.astral.sh/uv/) for Python dependency management
- Google Cloud CLI authenticated: `gcloud auth application-default login`
- Python 3.12+

### Workspace Setup
```bash
# Clone the repository
git clone <repository-url>
cd mux-mesh

# Install workspace dependencies
uv sync --all-projects

# Copy environment template
cp env.example .env
# Edit .env with your settings
```

## Project Structure

```
mux-mesh/                                        # Workspace root
├── proj/                                        # Project directory
│   ├── apis/                                    # API services
│   │   ├── gateway/                             # APIs gateway service
│   │   │   └── README.md                       # Gateway documentation
│   │   ├── overture/                            # Overture Maps API service
│   │   │   └── README.md                       # Overture documentation
│   │   └── tomtom_flow/                         # TomTom flow API service
│   │       └── README.md                       # TomTom flow documentation
│   ├── core/                                    # Shared utilities and logging
│   │   ├── src/core/
│   │   │   └── logging_config.py               # Standardized logging setup
│   │   └── pyproject.toml                      # Core project dependencies
│   └── tomtom_intermediate_traffic/             # TomTom traffic pipeline
│       ├── src/tomtom/traffic_flow/             # Pipeline source code
│       ├── deployment/                          # Cloud deployment configs
│       ├── Dockerfile                           # Container configuration
│       ├── run-local.sh                         # Local development script
│       └── README.md                            # Project-specific documentation
├── pyproject.toml                               # Workspace configuration
├── uv.lock                                      # Dependency lock file
├── env.example                                  # Environment template
└── README.md                                    # This file
```

## Workspace Features

- **uv-based dependency management**: Fast, reliable Python package management
- **Workspace isolation**: Each project has its own dependencies while sharing core utilities
- **Standardized tooling**: Consistent development patterns across all projects
- **Cloud-native**: Built for Google Cloud Platform with best practices
- **Local development**: Easy setup and testing with automated scripts

## Development Workflow

### Adding a New Project
1. Create a new project in the workspace:
   ```bash
   cd proj/
   uv init <project-name>
   ```
2. Add project to workspace members in root `pyproject.toml`
3. Add dependencies using `uv add <dependency-name>`
4. Add `core` as a workspace dependency if needed: `uv add core --editable`
5. Follow the established patterns for deployment and local development

### Working with Existing Projects
```bash
# Install all workspace dependencies
uv sync --all-projects

# Run a specific project (example: TomTom pipeline)
./proj/tomtom_intermediate_traffic/run-local.sh

# Add dependencies to a project
cd proj/your_project
uv add your-dependency
```
