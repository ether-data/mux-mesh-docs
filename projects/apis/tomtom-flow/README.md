# TomTom Traffic Flow API

API for querying TomTom intermediate realtime traffic flow summary and (optionally) detailed segments.

## Overview

This API provides an endpoint to query traffic summary information from the BigQuery `tomtom.traffic_sections` table. It determines traffic conditions based on segments whose geometry intersects with a provided geography and returns realtime traffic data summary, with an option to include the detailed segments. The API supports multiple geography input formats including ZIP codes, coordinates, WKT polygons, and H3 indices.

## Project Structure

```
proj/apis/tomtom_flow/
├── src/tomtom_flow/
│   ├── api/
│   │   └── traffic.py           # Traffic API endpoint
│   ├── models/
│   │   └── traffic.py           # Pydantic data models
│   ├── services/
│   │   └── traffic_service.py   # Business logic layer
│   ├── core/                    # Core utilities (e.g., logging, BQ utils - assumed)
│   ├── main.py                  # FastAPI application
│   └── server.py                # Server startup script
├── tests/                       # Test suite (directory assumed)
│   └── test_api.py              # Example test file
├── pyproject.toml               # Project configuration 
└── README.md                    # This file
```

## API Endpoints

### GET `/`
Root endpoint with API information.

### GET `/health`
Health check endpoint.

### POST `/api/v1/traffic/traffic-summary`
**Summary:** Query Traffic Summary

Query real-time traffic summary, including average relative speed and overall traffic condition, for a given geography. Optionally includes detailed traffic segments.

**Geography Input**: Supports multiple input formats including ZIP codes, coordinates, WKT polygons, and H3 indices. See the [Geography Input Documentation](../../../guides/geography-input.md) for complete details on all supported types and examples.

**Request Body (`TrafficSummaryRequest`):**
```json
{
  "geography": {
    "kind": "wkt",
    "wkt": "POLYGON((-74.0059 40.7128, -74.0059 40.7228, -73.9959 40.7228, -73.9959 40.7128, -74.0059 40.7128))"
  },
  "minutes_in_future": 0,
  "include_segments": false
}
```

**Response (`TrafficSummaryResponse`):**
```json
{
  "query_time": "2024-01-15T12:00:00Z",
  "latest_data_time": "2024-01-15T11:58:30Z",
  "average_relative_speed": 0.85,
  "traffic_condition": "MODERATE_TRAFFIC",
  "segment_count": 15,
  "segments": null
}
```

**Response Fields:**
- `query_time` (datetime): Time when the query was executed.
- `latest_data_time` (datetime, optional): Timestamp of the latest traffic data used for the summary.
- `average_relative_speed` (float, optional): Calculated weighted average relative speed (0.0 to 1.0).
- `traffic_condition` (string): Overall traffic condition string derived from the average relative speed (e.g., "FREE_TRAFFIC", "HEAVY_TRAFFIC").
- `segment_count` (integer): Total number of detailed traffic segments found that intersect the geometry.
- `segments` (array of `TrafficSegment`, optional): List of detailed traffic segments. Included if `include_segments=true`. Each segment has:
  - `create_time_utc` (datetime): Creation time (UTC) of the traffic flow data.
  - `length_meters` (integer, optional): Original length of the location segment in meters.
  - `geom` (string): Geometry of the section as WKT.
  - `relative_speed` (float, optional): Ratio of current speed to free flow speed (0-1).
  - `start_offset_meters` (integer): Start offset of the sub-section in meters relative to the start of the section.
  - `average_speed_kmph` (integer, optional): Average speed along the sub-section in km/h.
  - `traffic_condition` (string, optional): Traffic condition reported for the specific segment.
  - `travel_time_seconds` (integer, optional): Time to pass a sub-section in seconds.
  - `confidence` (integer, optional): Confidence score (0-100) for the speed estimate.
  - `openlr_binary` (string): Hex-encoded binary OpenLR location reference.
  - `adjusted_length_meters` (integer, optional): Calculated length of this specific (sub-)segment in meters.

## Example of Flow Segments

*Note: In the table below, an asterisk (`*`) in the "MARK" column indicates that the segment is part of a group of sub-segments belonging to the same original OpenLR location reference.*

| MARK | OPENLR HASH  | START_OFFSET_M   | TOTAL_LEN_M   | ADJUSTED_LEN_M   | REL_SPEED  | CONDITION      |
|------|--------------|------------------|---------------|------------------|------------|----------------|
| *    | accdb40aa1   | 0                | 5067          | 4458             | 1.000      | FREE_TRAFFIC   |
| *    | accdb40aa1   | 4458             | 5067          | 609              | 1.000      | FREE_TRAFFIC   |
|      | b4b6652ec3   | 0                | 3700          | 3700             | 1.000      | FREE_TRAFFIC   |
|      | ab1efdfb32   | 0                | 3680          | 3680             | 1.000      | FREE_TRAFFIC   |
|      | c29fd85277   | 0                | 873           | 873              | 1.000      | FREE_TRAFFIC   |
|      | 688030b810   | 0                | 20            | 20               | 0.408      | HEAVY_TRAFFIC  |
| *    | e15f37a0cd   | 0                | 5067          | 697              | 1.000      | FREE_TRAFFIC   |
| *    | e15f37a0cd   | 697              | 5067          | 4370             | 1.000      | FREE_TRAFFIC   |
|      | fbb12a0916   | 0                | 2038          | 2038             | 1.000      | FREE_TRAFFIC   |
|      | ffc7cfd837   | 0                | 63            | 63               | 0.750      | HEAVY_TRAFFIC  |
|      | 3c9d6187c6   | 0                | 873           | 873              | 1.000      | FREE_TRAFFIC   |
|      | abb2afdd6b   | 0                | 4079          | 4079             | 1.000      | FREE_TRAFFIC   |
| *    | 8c2305082e   | 0                | 4067          | 3681             | 1.000      | FREE_TRAFFIC   |
| *    | 8c2305082e   | 3681             | 4067          | 386              | 1.000      | FREE_TRAFFIC   |
| *    | 8b52042bc3   | 0                | 2038          | 901              | 0.939      | FREE_TRAFFIC   |
| *    | 8b52042bc3   | 901              | 2038          | 308              | 0.246      | HEAVY_TRAFFIC  |
| *    | 8b52042bc3   | 1209             | 2038          | 829              | 0.894      | HEAVY_TRAFFIC  |

## Scripts

The `scripts/` directory (if present) would be intended for utility and initialization tasks. The API primarily relies on the existing BigQuery `tomtom.traffic_sections` table and standard geography conversion utilities.

## Running the API

Ensure your virtual environment is activated.

1.  **Using the defined script (recommended):**
    After installing the package with `uv pip install -e .`, you can use the script defined in `pyproject.toml`:
    ```bash
    uv run tomtom-flow
    ```
    This will start the Uvicorn server with auto-reload enabled.

2.  **Alternatively, using `server.py` directly:**
    ```bash
    uv run python -m tomtom_flow.server
    ```


## Testing

### Run all tests:
```bash
uv run pytest
```

## Environment Variables

The service relies on environment variables for configuration, typically managed via a `.env` file (see `.env.example`). Key variables include:
- `GOOGLE_CLOUD_PROJECT`: Your Google Cloud Project ID.
- `MAX_BYTES_BILLED` (Optional): Max bytes for BigQuery queries.
- `MAX_RESULTS_RETURN` (Optional): Max results for queries.

## Example Usage

### Query traffic summary for different geography types:
```bash
# Basic summary using WKT polygon
curl -X POST "http://localhost:8000/api/v1/traffic/traffic-summary" \
  -H "Content-Type: application/json" \
  -d '{
    "geography": {
      "kind": "wkt",
      "wkt": "POLYGON((-74.0059 40.7128, -74.0059 40.7228, -73.9959 40.7228, -73.9959 40.7128, -74.0059 40.7128))"
    }
  }'

# Summary using ZIP code
curl -X POST "http://localhost:8000/api/v1/traffic/traffic-summary" \
  -H "Content-Type: application/json" \
  -d '{
    "geography": {
      "kind": "zip",
      "code": "01929"
    }
  }'

# Summary including detailed segments and future prediction
curl -X POST "http://localhost:8000/api/v1/traffic/traffic-summary" \
  -H "Content-Type: application/json" \
  -d '{
    "geography": {
      "kind": "point",
      "lat": 37.7749,
      "lon": -122.4194,
      "radius": 1000
    },
    "minutes_in_future": 15,
    "include_segments": true
  }'
```

## API Documentation

Once the server is running, API documentation is available at:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`
- **OpenAPI schema**: `http://localhost:8000/openapi.json`

