# Cursor Rules System

> **Automated guidance for maintaining code and documentation consistency across the Ether Data workspace**

## 🎯 Overview

The Cursor rules system codifies best practices and processes established through development experience. These rules help maintain consistency and guide future changes across both repositories.

## 📁 Rule Files Location

### Documentation Repository (`mux-mesh-docs/.cursorrules`)
Focuses on:
- Jekyll/GitHub Pages configuration patterns
- Documentation structure and organization  
- Diagram generation workflows
- Custom domain management
- Font and styling guidelines

### Main Repository (`mux-mesh/.cursorrules`)
Focuses on:
- API development patterns
- Service architecture guidelines
- Docker and deployment practices
- Documentation synchronization triggers
- Code quality and testing standards

## 🔄 Documentation Synchronization Process

### Automatic Triggers
Cursor will suggest updating documentation when:

**API Changes**:
- Adding new endpoints or services
- Modifying geography input schemas
- Changing response formats or error handling

**Architecture Changes**:
- New service integrations
- Database schema modifications
- Deployment configuration updates

**Interface Changes**:
- FastAPI route modifications
- New geography types support
- Integration pattern updates

### Manual Process
1. **Complete development work** in `mux-mesh`
2. **Test and validate** functionality
3. **Switch to docs repository** (`mux-mesh-docs`)
4. **Update relevant documentation**:
   - Service-specific docs in `projects/apis/[service]/`
   - Cross-cutting guides in `guides/`
   - Main documentation hub (`README.md`)
5. **Regenerate diagrams** if architecture changed
6. **Commit and push** (auto-deploys to docs.etherdata.ai)

## 🎨 Styling and Design Consistency

### Font Size Standards
- **Base**: 18px (equivalent to ~110% browser zoom)
- **Mobile**: 16px for readability
- **Large screens**: 20px for comfort
- **Headings**: Proportional hierarchy (h1: 2.2em, h2: 1.8em)

### Visual Guidelines
- Use emoji prefixes for major sections
- Maintain consistent badge styling
- Include both Python and JavaScript examples
- Use code blocks for configuration examples

### Jekyll Configuration
- Custom domain: empty `baseurl` for docs.etherdata.ai
- Modernist theme for professional appearance
- Exclude build tools from published site
- Include generated SVG diagrams

## 📊 Diagram Management

### Source and Output
- **Source**: `diagrams/[name].mmd` (Mermaid DSL)
- **Output**: `images/[name].svg` (Generated SVG)
- **Command**: `npm run generate-diagrams`

### Universal Compatibility
- Static SVG files work everywhere
- Scale factor 2 for high-quality rendering
- Commit both source and generated files

### Update Process
1. Edit `.mmd` files for content changes
2. Run generation script
3. Commit both source and SVG files
4. Reference in markdown: `![Description](./images/diagram.svg)`

## 🏗️ API Development Patterns

### uv Compliance Requirements
All new services must be uv-compliant:
- **pyproject.toml**: Proper dependency management with version pinning
- **__init__.py files**: Required in ALL package directories for Python imports
- **Standard structure**: Consistent directory organization across services
- **Dependency management**: Use `uv add` for adding dependencies

### Service Structure
```
proj/apis/[service]/
├── src/[service]/
│   ├── __init__.py    # Package initialization (uv compliance)
│   ├── api/
│   │   ├── __init__.py # Package initialization
│   │   └── [routes].py # FastAPI routes
│   ├── models/
│   │   ├── __init__.py # Package initialization
│   │   └── [models].py # Pydantic models  
│   ├── services/
│   │   ├── __init__.py # Package initialization
│   │   └── [service].py # Business logic
│   └── server.py      # App setup
├── tests/
│   ├── __init__.py    # Package initialization
│   └── test_*.py      # Test suite
├── pyproject.toml     # uv-compliant dependencies
└── README.md          # Minimal + docs link
```

### Geography Input Standards
```json
{"kind": "city", "name": "Essex", "state": "MA"}
{"kind": "county", "name": "Alameda", "state": "CA"}
```

### FastAPI + MCP Best Practices
- Use route decorators (not `app.mount()`)
- Proper Request typing: `request: Request`
- Handle both `/gateway/mcp` and `/gateway/mcp/` URLs

## 🔧 Custom Domain Management

### Configuration Checklist
- [ ] `_config.yml`: `url: "https://docs.etherdata.ai"`, `baseurl: ""`
- [ ] `CNAME` file contains only domain name
- [ ] Documentation badges link to custom domain
- [ ] DNS CNAME points to GitHub Pages

### Troubleshooting Broken Links
1. Check Jekyll configuration
2. Verify CNAME file contents
3. Update documentation links
4. Wait for DNS propagation (10-15 minutes)

## 📚 Documentation Patterns

### Service Documentation Template
```markdown
# [Service Name] API

## Overview
Brief description with key features

## Quick Start  
Installation and basic usage

## Geography Input Examples
All supported geography types

## API Reference
Detailed endpoint documentation

## Integration Examples
Python and JavaScript samples

## Performance Considerations
Optimization guidance
```

### Cross-Cutting Guides
- **Geography Input**: `guides/geography-input.md`
- **Integration Patterns**: Service-specific sections
- **Architecture**: Diagram-driven explanations

## 🚀 Deployment and Updates

### Development Workflow
1. Make changes in appropriate repository
2. Ensure uv compliance for new services (pyproject.toml, __init__.py files)
3. Test locally if major changes
4. Update documentation if needed
5. Generate diagrams if architecture changed
6. Commit and push (triggers auto-deployment)
7. Wait 5-10 minutes for live site update

### Quality Assurance
- Test custom domain functionality
- Verify diagram generation
- Check responsive font scaling
- Validate documentation links

## 💡 Using Cursor Rules Effectively

### For Documentation Updates
- Cursor will remind about docs repo vs main repo
- Suggests documentation structure patterns
- Guides Jekyll configuration decisions
- Prompts for diagram updates when needed

### For Development Work
- Enforces consistent service architecture
- Suggests when documentation updates needed
- Guides FastAPI and geography input patterns
- Promotes testing and deployment best practices

### Rule Evolution
- Rules codify established patterns from experience
- Update rules when new patterns emerge
- Document exceptions and special cases
- Keep rules focused and actionable

## 🔍 Troubleshooting Common Issues

### Documentation Not Updating
1. Check GitHub Pages deployment status
2. Verify Jekyll build succeeded
3. Clear browser cache
4. Check custom domain DNS

### Broken Diagram Images
1. Verify SVG files committed
2. Check image paths in markdown
3. Regenerate diagrams if needed
4. Confirm Jekyll includes images/ directory

### Font Changes Not Applying
1. Verify `style.scss` has Jekyll front matter (`---`)
2. Check CSS syntax and selectors
3. Clear browser cache
4. Wait for Jekyll rebuild

## 📖 Additional Resources

- [Jekyll Documentation](https://jekyllrb.com/docs/)
- [GitHub Pages Guide](https://docs.github.com/en/pages)
- [Mermaid Diagram Syntax](https://mermaid.js.org/intro/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)

---

**Note**: These rules evolve based on development experience. Update them when new patterns emerge or existing practices change. 