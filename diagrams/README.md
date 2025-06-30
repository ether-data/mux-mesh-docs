# Mermaid Diagrams

This directory contains source Mermaid diagram files (.mmd) that are used to generate static SVG images for universal compatibility.

## Files

- `architecture.mmd` - System architecture overview diagram

## Generating SVG Images

To generate SVG images from the Mermaid source files:

### Prerequisites

Install the Mermaid CLI tool:
```bash
npm install -g @mermaid-js/mermaid-cli
```

### Generate Images

Run the generation script:
```bash
node scripts/generate-diagrams.js
```

This will:
1. Process all `.mmd` files in this directory
2. Generate corresponding `.svg` files in the `images/` directory
3. Use the configuration from `scripts/mermaid-config.json`

### Manual Generation

You can also generate images manually:
```bash
mmdc -i diagrams/architecture.mmd -o images/architecture.svg -c scripts/mermaid-config.json
```

## Workflow

1. **Edit**: Modify `.mmd` files in this directory
2. **Generate**: Run the generation script to create SVG files
3. **Commit**: Commit both the source `.mmd` and generated `.svg` files
4. **Verify**: Check that images render correctly across all platforms

## Configuration

The generation process uses `scripts/mermaid-config.json` for:
- Theme settings
- Image dimensions
- Background color
- Other rendering options 