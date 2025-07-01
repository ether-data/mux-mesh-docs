# Documentation Setup Guide

This guide explains how to set up and use the diagram generation system for universal compatibility.

## 🎯 Overview

This documentation repository uses static SVG images generated from Mermaid source files:
- **Universal compatibility**: SVG images work everywhere (GitHub, GitHub Pages, docs sites)
- **High quality**: Vector graphics scale perfectly at any resolution
- **Simple workflow**: One image format for all platforms

## 🛠️ Prerequisites

### Node.js and npm
Install Node.js (version 14+) and npm from [nodejs.org](https://nodejs.org/)

### Mermaid CLI
Install the Mermaid command-line interface globally:
```bash
npm install -g @mermaid-js/mermaid-cli
```

## 📋 Quick Start

### 1. Clone Repository
```bash
git clone https://github.com/your-org/mux-mesh-docs.git
cd mux-mesh-docs
```

### 2. Install Dependencies (Optional)
For easier management, you can use the local package.json:
```bash
npm install
```

### 3. Generate Diagrams
Run the generation script:
```bash
node scripts/generate-diagrams.js
```

Or using npm script:
```bash
npm run generate-diagrams
```

## 📝 Creating New Diagrams

### 1. Create Mermaid Source File
Create a new `.mmd` file in the `diagrams/` directory:
```bash
# Example: diagrams/my-new-diagram.mmd
graph TD
    A[Start] --> B[Process]
    B --> C[End]
```

### 2. Generate SVG Image
Run the generation script:
```bash
node scripts/generate-diagrams.js
```

### 3. Update Markdown Files
Add the image reference to your markdown:
```markdown
![My Diagram](./images/my-new-diagram.svg)
```

### 4. Commit Changes
Commit both the source and generated files:
```bash
git add diagrams/my-new-diagram.mmd images/my-new-diagram.svg
git commit -m "Add new diagram: my-new-diagram"
```

## 🔧 Configuration

### Mermaid Configuration
Edit `scripts/mermaid-config.json` to customize diagram generation:
```json
{
  "theme": "default",
  "width": 1200,
  "height": 800,
  "backgroundColor": "white"
}
```

### Available Themes
- `default` - Default theme
- `dark` - Dark theme
- `forest` - Forest theme
- `neutral` - Neutral theme

## 📁 Directory Structure

```
mux-mesh-docs/
├── diagrams/                    # Mermaid source files
│   ├── architecture.mmd
│   └── README.md
├── images/                      # Generated SVG files
│   ├── architecture.svg
│   └── .gitkeep
├── scripts/                     # Generation tools
│   ├── generate-diagrams.js
│   └── mermaid-config.json
└── projects/                    # Documentation content
    └── ...
```

## 🔄 Workflow

### Updating Existing Diagrams
1. Edit the `.mmd` file in `diagrams/`
2. Run `node scripts/generate-diagrams.js`
3. Commit both files: `git add diagrams/*.mmd images/*.svg`

### Adding New Diagrams
1. Create new `.mmd` file in `diagrams/`
2. Run generation script
3. Update markdown with image reference
4. Commit all changes

## 🧪 Testing

### Verify GitHub Rendering
1. Push changes to GitHub
2. View the markdown files directly on GitHub
3. **Expected behavior:**
   - SVG image displays clearly and scales properly

### Verify GitHub Pages Rendering
1. Enable GitHub Pages in repository settings
2. Visit the GitHub Pages URL
3. **Expected behavior:**
   - SVG image displays properly with crisp vector graphics

## 🚨 Troubleshooting

### Mermaid CLI Issues
```bash
# Reinstall if needed
npm uninstall -g @mermaid-js/mermaid-cli
npm install -g @mermaid-js/mermaid-cli

# Check installation
mmdc --version
```

### Generation Failures
- Check that `.mmd` files have valid Mermaid syntax
- Verify file permissions in `images/` directory
- Review error messages in console output

### Missing Images in GitHub Pages
- Ensure SVG files are committed to repository
- Check file paths in markdown (relative to document)
- Verify GitHub Pages is properly configured

### Custom Domain Issues
If links are broken after setting up custom domain:

1. **Check Jekyll Configuration**:
   ```yaml
   url: "https://docs.etherdata.ai"
   baseurl: ""  # Empty for custom domains
   ```

2. **Verify CNAME File**:
   - File should contain only: `docs.etherdata.ai`
   - Located in repository root
   - No trailing newlines or extra characters

3. **DNS Configuration**:
   ```
   CNAME docs.etherdata.ai -> ether-data.github.io
   ```

4. **GitHub Pages Settings**:
   - Custom domain field should show: `docs.etherdata.ai`
   - HTTPS should be enforced
   - Wait 10-15 minutes for DNS propagation

## ⚙️ GitHub Pages Configuration

This repository includes a `_config.yml` file that optimizes the Jekyll build for GitHub Pages using the modern, professional **Modernist theme**:

### Custom Domain Setup
The site is configured for the custom domain **docs.etherdata.ai**:
- **CNAME file**: Contains `docs.etherdata.ai` for GitHub Pages custom domain
- **Jekyll config**: URL set to `https://docs.etherdata.ai` with empty baseurl
- **DNS**: Domain should point to GitHub Pages IP addresses

### Theme Features
- **Clean Design**: Minimalist layout focused on content readability
- **Responsive**: Mobile-friendly responsive design
- **GitHub Integration**: Optimized for GitHub Pages hosting
- **Syntax Highlighting**: Code blocks with rouge syntax highlighting
- **Typography**: Professional typography for technical documentation

### Excluded from Website
- `scripts/` - Build tools and generation scripts
- `diagrams/` - Mermaid source files (.mmd)
- `package.json` - Node.js configuration
- `SETUP.md` - Internal development documentation

### Included in Website
- `images/` - Generated SVG diagrams
- `projects/` - API documentation
- `guides/` - User guides
- `utilities/` - Public documentation

This keeps the published website clean while maintaining all development tools in the repository.

### Theme Customization
To customize the Modernist theme:
1. **Colors & Styling**: Override CSS by creating `assets/css/style.scss` 
2. **Layout**: Create custom layouts in `_layouts/` directory
3. **Analytics**: Add Google Analytics ID to `_config.yml`
4. **Logo**: Add site logo via front matter or custom layout

Example custom CSS (`assets/css/style.scss`):
```scss
---
---

@import "{{ site.theme }}";

// Custom overrides here
.wrapper {
  max-width: 1200px; // Wider content area
}
```

## 📚 Resources

- [Mermaid Documentation](https://mermaid-js.github.io/mermaid/)
- [Mermaid CLI Documentation](https://github.com/mermaid-js/mermaid-cli)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Jekyll Configuration](https://jekyllrb.com/docs/configuration/)
- [Jekyll Modernist Theme](https://github.com/pages-themes/modernist) 