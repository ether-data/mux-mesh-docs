# Scripts Directory

This directory contains utility scripts.

## Available Scripts

### `show_mcp_tool_schema.py`

A utility to inspect MCP tool schemas exposed by the gateway.

**Usage:**
```bash
# List all available MCP tools
uv run python scripts/show_mcp_tool_schema.py

# Show detailed schema for a specific tool
uv run python scripts/show_mcp_tool_schema.py count_places

# Show help
uv run python scripts/show_mcp_tool_schema.py --help
```

**Features:**
- Lists all available MCP tools with descriptions
- Shows complete JSON schema for any tool
- Displays parameter breakdown and validation rules
- Shows schema definitions and required fields

**Requirements:**
- Must be run from the project root directory
- Requires the gateway MCP server to be importable (dependencies installed) 