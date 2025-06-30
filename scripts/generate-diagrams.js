#!/usr/bin/env node

/**
 * Generate PNG diagrams from Mermaid source files
 * 
 * Prerequisites:
 * npm install -g @mermaid-js/mermaid-cli
 * 
 * Usage:
 * node scripts/generate-diagrams.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const DIAGRAMS_DIR = path.join(__dirname, '..', 'diagrams');
const IMAGES_DIR = path.join(__dirname, '..', 'images');
const MERMAID_CONFIG = path.join(__dirname, 'mermaid-config.json');

// Ensure directories exist
if (!fs.existsSync(DIAGRAMS_DIR)) {
    fs.mkdirSync(DIAGRAMS_DIR, { recursive: true });
}
if (!fs.existsSync(IMAGES_DIR)) {
    fs.mkdirSync(IMAGES_DIR, { recursive: true });
}

// Create mermaid config if it doesn't exist
if (!fs.existsSync(MERMAID_CONFIG)) {
    const config = {
        theme: 'default',
        width: 1200,
        height: 800,
        backgroundColor: 'white',
        scale: 2
    };
    fs.writeFileSync(MERMAID_CONFIG, JSON.stringify(config, null, 2));
    console.log('✓ Created mermaid config file');
}

// Find all .mmd files
const mmdFiles = fs.readdirSync(DIAGRAMS_DIR)
    .filter(file => file.endsWith('.mmd'))
    .map(file => ({
        input: path.join(DIAGRAMS_DIR, file),
        output: path.join(IMAGES_DIR, file.replace('.mmd', '.svg'))
    }));

if (mmdFiles.length === 0) {
    console.log('⚠️  No .mmd files found in diagrams/ directory');
    console.log('   Create .mmd files in diagrams/ directory first');
    process.exit(0);
}

console.log(`🔧 Generating ${mmdFiles.length} diagram(s)...`);

// Generate each diagram
mmdFiles.forEach(({ input, output }) => {
    try {
        const fileName = path.basename(input);
        console.log(`   Processing: ${fileName}`);
        
        // Run mermaid CLI
        execSync(`mmdc -i "${input}" -o "${output}" -c "${MERMAID_CONFIG}"`, {
            stdio: 'pipe'
        });
        
        console.log(`   ✓ Generated: ${path.basename(output)}`);
    } catch (error) {
        console.error(`   ✗ Failed to generate ${path.basename(input)}: ${error.message}`);
    }
});

console.log('🎉 Diagram generation complete!');
console.log('');
console.log('Next steps:');
console.log('1. Review generated SVG files in images/ directory');
console.log('2. Update markdown files with image references');
console.log('3. Commit both .mmd and .svg files to repository'); 