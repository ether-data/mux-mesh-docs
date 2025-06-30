# Census Data API

API for querying US Census demographic data using natural language and flexible geography inputs.

## Overview

This API provides an intelligent interface to US Census demographic data, allowing users to query comprehensive population statistics using natural language queries and flexible geographic boundaries. The system combines AI-powered SQL generation with advanced spatial indexing to deliver accurate and efficient demographic insights.

**Key Features:**
- **Natural Language Queries**: Ask questions in plain English about demographic data
- **Flexible Geography Input**: Support for ZIP codes, DMA codes, cities, counties, coordinates, WKT polygons, and H3 indices
- **AI-Powered SQL Generation**: Automatic conversion of natural language to optimized BigQuery SQL
- **H3 Spatial Indexing**: Efficient spatial operations using Uber's H3 hexagonal grid system
- **Comprehensive Demographics**: Access to complete US Census demographic datasets

## Project Structure

```
proj/apis/census/
├── src/census/
│   ├── api/                     # FastAPI endpoints
│   │   ├── census.py            # Census query endpoint
│   │   └── health.py            # Health check endpoint
│   ├── models/                  # Pydantic data models
│   │   └── census.py            # Request/response models
│   ├── services/                # Business logic
│   │   └── census_service.py    # Census data query logic
│   ├── main.py                  # FastAPI application
│   └── server.py                # Server startup script
├── scripts/                     # SQL scripts and utilities
│   └── census_us_h3_aggregation.sql  # H3 aggregation SQL script
├── pyproject.toml               # Project configuration
└── README.md                    # Project documentation
```

## API Endpoints

### POST `/query`
**Summary:** Query Census Demographic Data

Query US Census demographic data for specific geographic areas using natural language. The API automatically converts geography inputs to H3 indexes and uses AI to generate and execute SQL queries against census data stored in BigQuery.

**Geography Input**: Supports multiple input formats including ZIP codes, DMA codes, cities, counties, coordinates, WKT polygons, and H3 indices. See the [Geography Input Documentation](../../../guides/geography-input.md) for complete details on all supported types and examples.

**Request Body (`CensusQueryRequest`):**
```json
{
  "geography": {
    "kind": "zip",
    "code": "94595"
  },
  "query": "What is the total population?",
  "include_h3_indexes": false
}
```

**Geography Examples:**
```json
// ZIP Code
{"kind": "zip", "code": "94595"}

// City
{"kind": "city", "name": "Essex", "state": "MA"}

// County
{"kind": "county", "name": "Alameda", "state": "CA"}

// Point with radius
{"kind": "point", "lat": 37.7749, "lon": -122.4194, "radius": 5000}

// H3 Index
{"kind": "h3", "h3": "87283082bffffff"}
```

**Response (`CensusQueryResponse`):**
```json
{
  "results": [
    {"geoid": "87283082bffffff", "total_pop": 1500}
  ],
  "total_results": 1,
  "h3_indexes": ["87283082bffffff"]
}
```

### GET `/health`
Health check endpoint for service monitoring.

## Natural Language Query Examples

The API supports a wide variety of natural language queries about demographic data:

**Population Queries:**
- "What is the total population?"
- "How many people live here?"
- "Population density per square mile"

**Age Demographics:**
- "What is the median age?"
- "How many children under 18?"
- "Population over 65 years old"

**Income and Employment:**
- "What is the median household income?"
- "Unemployment rate"
- "Average family income"

**Housing:**
- "How many housing units?"
- "Homeownership rate"
- "Average rent"

**Education:**
- "What percentage have college degrees?"
- "High school graduation rate"

## Running the API

### Standalone Operation

```bash
# Run the census API locally
cd proj/apis/census
uv run python -m census.server
```

The API will be available at `http://localhost:8020`

### Via Gateway Integration

The Census API is integrated into the main API gateway and available at `/v1/census/query` when running through the gateway.

```bash
# Run via gateway
cd proj/apis/gateway
./run-local.sh
```

Access via gateway at `http://localhost:8000/v1/census/query`

## Environment Variables

Configure the service using environment variables:

```bash
# Google Cloud Configuration
GOOGLE_CLOUD_PROJECT=your-project-id    # Required for BigQuery access

# API Configuration
CENSUS_PORT=8020                         # Port for standalone operation
ENVIRONMENT=development                  # Environment (development/production)

# BigQuery Settings
MAX_BYTES_BILLED=1000000000             # Max bytes for BigQuery queries
MAX_RESULTS_RETURN=10000                # Max results to return
```

## Data Sources

The API accesses US Census data from several BigQuery datasets:

- **Census Boundaries**: `bigquery-public-data.geo_us_boundaries`
- **Demographic Data**: US Census demographic tables with H3 spatial indexing
- **Geographic Reference**: ZIP codes, counties, cities, and DMA boundaries

## Example Usage

### Query Population by ZIP Code
```bash
curl -X POST "http://localhost:8020/query" \
  -H "Content-Type: application/json" \
  -d '{
    "geography": {"kind": "zip", "code": "94107"},
    "query": "What is the total population?"
  }'
```

### Query Demographics by City
```bash
curl -X POST "http://localhost:8020/query" \
  -H "Content-Type: application/json" \
  -d '{
    "geography": {"kind": "city", "name": "Essex", "state": "MA"},
    "query": "What is the median household income?"
  }'
```

### Query with H3 Index Output
```bash
curl -X POST "http://localhost:8020/query" \
  -H "Content-Type: application/json" \
  -d '{
    "geography": {"kind": "county", "name": "Alameda", "state": "CA"},
    "query": "Population density",
    "include_h3_indexes": true
  }'
```

## H3 Spatial Indexing

The Census API leverages Uber's H3 hexagonal spatial indexing system for efficient geographic operations:

- **Adaptive Resolution**: Automatically selects appropriate H3 resolution based on geography size
- **Uniform Coverage**: Hexagonal cells provide consistent area coverage
- **Efficient Queries**: Optimized spatial joins using H3 indexes
- **Scalable Processing**: Fast aggregation across large geographic areas

## API Documentation

Interactive documentation is available when the service is running:

**Standalone Mode:**
- **Swagger UI**: `http://localhost:8020/docs`
- **ReDoc**: `http://localhost:8020/redoc`
- **OpenAPI Schema**: `http://localhost:8020/openapi.json`

**Via Gateway:**
- **Swagger UI**: `http://localhost:8000/docs` (combined documentation)
- **ReDoc**: `http://localhost:8000/redoc`

## Performance Considerations

- **Query Optimization**: AI generates optimized SQL queries for efficient BigQuery execution
- **Spatial Indexing**: H3 indexes enable fast geographic lookups and aggregations
- **Caching**: Geographic boundary lookups are cached for improved performance
- **Result Limits**: Configurable limits prevent excessive data transfer
- **Adaptive Resolution**: H3 resolution automatically adapts to geography size

## Error Handling

The API provides detailed error responses for common issues:

- **Invalid Geography**: 404 when ZIP code, city, or county is not found
- **Query Processing**: 422 for malformed natural language queries
- **Data Limits**: 413 when results exceed configured limits
- **Service Errors**: 500 for internal processing issues

## Integration Examples

### Python Client
```python
import requests

response = requests.post('http://localhost:8020/query', json={
    'geography': {'kind': 'zip', 'code': '94107'},
    'query': 'What is the total population?'
})

data = response.json()
print(f"Population: {data['results'][0]['total_pop']}")
```

### JavaScript/Node.js
```javascript
const response = await fetch('http://localhost:8020/query', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    geography: {kind: 'city', name: 'Essex', state: 'MA'},
    query: 'median household income'
  })
});

const data = await response.json();
console.log('Results:', data.results);
``` 