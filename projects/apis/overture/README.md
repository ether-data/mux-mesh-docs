# Overture Places API

API for querying Overture Maps place data, featuring semantic category mapping.

## Overview

This API provides functionalities to interact with the Overture Maps places dataset stored in BigQuery. Its core features include:
1.  **Semantic Category Mapping**: Converts user-provided category strings (e.g., "food place near me") into the closest official Overture category (e.g., "restaurant") using a sentence transformer model (`BAAI/bge-base-en-v1.5`). The model can be cached locally or downloaded from a GCS bucket for cloud deployments.
2.  **Place Counting**: Counts Points of Interest (POIs) of a specific (mapped) category within a given WKT polygon, leveraging a pre-built category hierarchy table in BigQuery.

## Project Structure

```
proj/apis/overture/
├── src/overture/
│   ├── __init__.py
│   ├── api/                     # FastAPI endpoints (e.g., place queries)
│   │   └── __init__.py
│   ├── data/                    # Data files like overture_categories.csv, model cache
│   │   └── overture_categories.csv
│   │   └── model_cache/         # Local model cache
│   ├── models/                  # Pydantic data models
│   │   └── __init__.py
│   ├── services/                # Business logic
│   │   ├── __init__.py
│   │   ├── category_mapper.py   # Semantic category mapping logic
│   │   └── overture_places.py   # Logic for querying places
│   ├── server.py                # Server startup script 
│   └── main.py                  # FastAPI application 
├── scripts/                     # Initialization and utility scripts
│   ├── initialize_categories_table.py # script to load category hierarchy to BQ
│   └── initialize_model.py            # script to upload model to GCS
├── tests/                       # Test suite
│   └── test_api.py              
├── pyproject.toml               # Project configuration
└── README.md                    # This file
```

## API Endpoints

### POST `/places/count_by_category`
**Summary:** Count Places (POIs) by Category

Counts the number of places (Points of Interest) of a specific category that fall within a given geometry. The user-provided category is semantically mapped to an official Overture category before querying.

**Geography Input**: Supports multiple input formats including ZIP codes, DMA codes, coordinates, WKT, and H3 indices. See the [Geography Input Documentation](../../docs/geography-input.md) for complete details on all supported types and examples.

**Request Body (`PlaceQueryRequest`):**
```json
{
  "geometry": {
    "kind": "zip",
    "code": "94107"
  },
  "category": "restaurant"
}
```

**Response (`PlaceCountResponse`):**
```json
{
  "input_category": "restaurant",
  "matched_category": "restaurant",
  "count": 42
}
```

## Scripts

The `scripts/` directory is intended for utility and initialization tasks, such as:
- `initialize_categories_table.py`: A script to create and populate the category hierarchy table in BigQuery (e.g., `overture.category_ancestor`) using `overture_categories.csv`.
- `initialize_model.py` (or `upload_model_to_gcs.py`): A script to download the sentence transformer model files and upload them to your GCS bucket for use in cloud environments (e.g., Cloud Run).

## Running the API

1.  **Using the defined script (recommended):**
    Based on the `pyproject.toml` entry `overture-api = "overture.server:start_server"`:
    ```bash
    uv run overture-api
    ```

2.  **Alternatively, using `server.py` directly:**
    ```bash
    uv run python -m overture.server
    ```

## Testing
```bash
uv run pytest
```

## Environment Variables

The service relies on environment variables, typically managed via a `.env` file. Key variables:
- `GOOGLE_CLOUD_PROJECT` (required): Your Google Cloud Project ID. Used for BigQuery and GCS.
- `GCS_BUCKET_NAME` (derived, for `category_mapper`): Defaults to `{GOOGLE_CLOUD_PROJECT}-models`. Ensure this bucket exists and the model is uploaded if running in a GCS-dependent environment.
- `OVERTURE_CATEGORIES_PATH` (internal default): Path to `overture_categories.csv`.
- `MODEL_NAME` (internal default): `BAAI/bge-base-en-v1.5`.

## API Documentation

If the API is built with FastAPI and running, documentation will be available at:
- **Swagger UI**: `http://localhost:8010/docs`
- **ReDoc**: `http://localhost:8010/redoc`
- **OpenAPI schema**: `http://localhost:8010/openapi.json`