# Geography Input Types

The `GeographyInput` type is a discriminated union that supports multiple geographic input formats across the Ether APIs. This flexible system allows users to specify geographic areas using the format most convenient for their use case.

## Overview

All geography inputs use a `kind` field as a discriminator to determine the specific geography type. The system automatically converts all input types to Well-Known Text (WKT) format for spatial operations.

## Supported Geography Types

### ZIP Code

**Purpose**: US postal code boundaries  
**Data Source**: BigQuery public datasets (`bigquery-public-data.geo_us_boundaries.zip_codes`)

```json
{
  "kind": "zip",
  "code": "94107",
  "country": "US"
}
```

**Fields**:
- `kind`: Always `"zip"`
- `code`: 5-digit US ZIP code (pattern: `^\d{5}$`)
- `country`: Country code (default: `"US"`)

### DMA Code (Designated Market Area)

**Purpose**: Television market boundaries  
**Data Source**: Local National DMA shapefiles

```json
{
  "kind": "dma",
  "code": "506"
}
```

**Fields**:
- `kind`: Always `"dma"`
- `code`: 3-digit DMA code (pattern: `^\d{3}$`)

**Common DMA Codes**:
- `"501"`: New York
- `"506"`: Boston-Manchester
- `"803"`: Los Angeles

### Lat/Lon Point

**Purpose**: Geographic coordinates with optional circular buffer  
**Conversion**: Point geometry or buffered polygon approximation

```json
{
  "kind": "point",
  "lat": 37.7585,
  "lon": -122.3995,
  "radius": 1000
}
```

**Fields**:
- `kind`: Always `"point"`
- `lat`: Latitude in degrees (-90 to 90)
- `lon`: Longitude in degrees (-180 to 180)
- `radius`: Buffer radius in meters (default: 0, minimum: 0)

**Behavior**:
- When `radius = 0`: Creates a `POINT` geometry
- When `radius > 0`: Creates a buffered polygon approximating a circle

**Buffer Parameters** (advanced):
- `n_sides`: Number of polygon sides for circle approximation (default: 6)
- `inscribed`: Whether vertices lie on circle boundary (default: true)

**Circle Approximation Quality**:
| Sides | Deviation from Circle |
|-------|----------------------|
| 6     | 13.4%               |
| 8     | 7.6%                |
| 12    | 3.4%                |
| 20    | 1.2%                |

### WKT Geometry

**Purpose**: Direct geometric input using Well-Known Text format  
**Validation**: Must be valid WKT geometry

```json
{
  "kind": "wkt",
  "wkt": "POLYGON((-122.4194 37.7749, -122.4094 37.7749, -122.4094 37.7849, -122.4194 37.7849, -122.4194 37.7749))"
}
```

**Fields**:
- `kind`: Always `"wkt"`
- `wkt`: Valid WKT geometry string

**Supported WKT Types**:
- `POINT(lon lat)`
- `POLYGON((lon lat, lon lat, ...))`
- `MULTIPOLYGON(...)`
- Other valid WKT geometries

### H3 Index

**Purpose**: Uber H3 hexagonal spatial indices  
**Conversion**: H3 cell boundary to polygon geometry

```json
{
  "kind": "h3",
  "h3": "87283082bffffff"
}
```

**Fields**:
- `kind`: Always `"h3"`
- `h3`: Valid H3 cell index (pattern: `^[0-9a-f]{15,16}$`)

**H3 Properties**:
- Hexagonal cells with uniform area at each resolution
- Resolution 0-15 (0 = largest, 15 = smallest)
- Global coverage with minimal distortion

## API Integration

### Request Examples

**Using ZIP Code**:
```bash
curl -X POST "https://api.example.com/places/count" \
  -H "Content-Type: application/json" \
  -d '{
    "geography": {"kind": "zip", "code": "94107"},
    "category": "restaurant"
  }'
```

**Using Buffered Point**:
```bash
curl -X POST "https://api.example.com/places/count" \
  -H "Content-Type: application/json" \
  -d '{
    "geography": {"kind": "point", "lat": 37.7585, "lon": -122.3995, "radius": 1000},
    "category": "hospital"
  }'
```

**Using H3 Index**:
```bash
curl -X POST "https://api.example.com/places/count" \
  -H "Content-Type: application/json" \
  -d '{
    "geography": {"kind": "h3", "h3": "87283082bffffff"},
    "category": "gas_station"
  }'
```

## Best Practices

### Choosing the Right Geography Type

1. **ZIP Code**: Use for standard US postal analysis
2. **DMA Code**: Use for media/broadcast market analysis  
3. **Lat/Lon Point**: Use for location-based searches with known coordinates
4. **WKT**: Use for custom boundaries or GIS integration
5. **H3 Index**: Use for spatial analytics and grid-based analysis

### Performance Considerations

- **ZIP/DMA lookups**: Require database/file access, may be slower
- **Point geometries**: Fastest for simple coordinates
- **Buffered points**: Number of polygon sides is a tradeoff between speed and accuracy
- **WKT**: Universal for complex shapes
- **H3 conversion**: Fast conversion with precise boundaries

### Validation

All geography inputs are validated for:
- Correct schema format
- Value range constraints (lat/lon bounds, etc.)
- WKT geometry validity
- H3 index validity

Invalid inputs return HTTP 422 with descriptive error messages.

## Error Handling

Common validation errors:

```json
{
  "detail": [
    {
      "type": "value_error",
      "msg": "Invalid H3 index: not_valid_h3",
      "input": "not_valid_h3"
    }
  ]
}
```

```json
{
  "detail": "Invalid geometry: ParseException: Expected number but encountered word: 'invalid'"
}
```

## Reference

- **WKT Standard**: [OGC Well-Known Text](https://en.wikipedia.org/wiki/Well-known_text_representation_of_geometry)
- **H3 Documentation**: [Uber H3](https://h3geo.org/)
- **BigQuery Geo Data**: [Public Datasets](https://cloud.google.com/bigquery/public-data)
- **DMA Codes**: [Nielsen DMA Regions](https://en.wikipedia.org/wiki/Media_market) 