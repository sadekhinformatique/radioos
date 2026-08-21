#!/usr/bin/env node

/**
 * RadioOS PWA Icon Generator
 *
 * Generates PNG icons from SVG template for manifest.json
 * Requires: npm install sharp (optional, for PNG generation)
 *
 * Usage: node public/icons/generate-icons.js
 */

const fs = require("fs");
const path = require("path");

const SIZES = [72, 96, 128, 144, 152, 192, 384, 512];

// SVG template for RadioOS icon
const createSVG = (size) => `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Background circle -->
  <circle cx="${size/2}" cy="${size/2}" r="${size/2}" fill="#2563EB"/>
  
  <!-- Radio waves -->
  <g opacity="0.3">
    <circle cx="${size/2}" cy="${size/2}" r="${size*0.35}" stroke="white" stroke-width="${size*0.02}" fill="none"/>
    <circle cx="${size/2}" cy="${size/2}" r="${size*0.25}" stroke="white" stroke-width="${size*0.02}" fill="none"/>
    <circle cx="${size/2}" cy="${size/2}" r="${size*0.15}" stroke="white" stroke-width="${size*0.02}" fill="none"/>
  </g>
  
  <!-- Center dot -->
  <circle cx="${size/2}" cy="${size/2}" r="${size*0.08}" fill="white"/>
  
  <!-- Letter R -->
  <text x="${size/2}" y="${size*0.62}" 
        font-family="Arial, sans-serif" 
        font-size="${size*0.4}" 
        font-weight="bold" 
        fill="white" 
        text-anchor="middle">R</text>
  
  <!-- Broadcast lines -->
  <g opacity="0.5">
    <path d="M${size*0.3} ${size*0.25} Q${size*0.5} ${size*0.15} ${size*0.7} ${size*0.25}" 
          stroke="white" 
          stroke-width="${size*0.015}" 
          fill="none" 
          stroke-linecap="round"/>
    <path d="M${size*0.25} ${size*0.35} Q${size*0.5} ${size*0.2} ${size*0.75} ${size*0.35}" 
          stroke="white" 
          stroke-width="${size*0.015}" 
          fill="none" 
          stroke-linecap="round"/>
  </g>
</svg>`;

// Icon with text for larger sizes
const createDetailedSVG = (size) => `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="${size}" height="${size}" rx="${size*0.15}" fill="#2563EB"/>
  
  <!-- Radio waves -->
  <g opacity="0.2">
    <circle cx="${size/2}" cy="${size*0.35}" r="${size*0.2}" stroke="white" stroke-width="${size*0.015}" fill="none"/>
    <circle cx="${size/2}" cy="${size*0.35}" r="${size*0.12}" stroke="white" stroke-width="${size*0.015}" fill="none"/>
  </g>
  
  <!-- Microphone icon -->
  <g transform="translate(${size*0.35}, ${size*0.2})">
    <rect x="${size*0.1}" y="0" width="${size*0.1}" height="${size*0.2}" rx="${size*0.05}" fill="white"/>
    <path d="M${size*0.05} ${size*0.15} Q${size*0.15} ${size*0.25} ${size*0.25} ${size*0.15}" 
          stroke="white" 
          stroke-width="${size*0.02}" 
          fill="none"/>
    <line x1="${size*0.15}" y1="${size*0.22}" x2="${size*0.15}" y2="${size*0.28}" 
          stroke="white" 
          stroke-width="${size*0.02}"/>
  </g>
  
  <!-- Letter R -->
  <text x="${size/2}" y="${size*0.75}" 
        font-family="Arial, sans-serif" 
        font-size="${size*0.25}" 
        font-weight="bold" 
        fill="white" 
        text-anchor="middle">R</text>
</svg>`;

async function generateIcons() {
  const iconsDir = path.join(__dirname);
  
  console.log("🎨 Generating RadioOS PWA icons...\n");
  
  // Generate SVG icons
  for (const size of SIZES) {
    const svg = size >= 192 ? createDetailedSVG(size) : createSVG(size);
    const filename = `icon-${size}x${size}.svg`;
    const filepath = path.join(iconsDir, filename);
    
    fs.writeFileSync(filepath, svg);
    console.log(`✅ Created ${filename}`);
  }
  
  // Try to generate PNGs if sharp is available
  try {
    const sharp = require("sharp");
    console.log("\n📦 Generating PNG icons with sharp...\n");
    
    for (const size of SIZES) {
      const svgPath = path.join(iconsDir, `icon-${size}x${size}.svg`);
      const pngPath = path.join(iconsDir, `icon-${size}x${size}.png`);
      
      await sharp(svgPath)
        .resize(size, size)
        .png()
        .toFile(pngPath);
      
      console.log(`✅ Created icon-${size}x${size}.png`);
    }
    
    console.log("\n🎉 All icons generated successfully!\n");
  } catch (e) {
    console.log("\n⚠️  Sharp not found. PNG icons not generated.");
    console.log("   Install sharp to generate PNGs: npm install sharp");
    console.log("   Or use SVG icons directly in manifest.json\n");
    
    // Update manifest to use SVG
    const manifestPath = path.join(__dirname, "..", "manifest.json");
    if (fs.existsSync(manifestPath)) {
      const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
      manifest.icons = manifest.icons.map((icon) => ({
        ...icon,
        src: icon.src.replace(".png", ".svg"),
        type: "image/svg+xml",
      }));
      fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
      console.log("📝 Updated manifest.json to use SVG icons");
    }
  }
  
  console.log("📁 Icons saved to: public/icons/\n");
}

generateIcons().catch(console.error);
