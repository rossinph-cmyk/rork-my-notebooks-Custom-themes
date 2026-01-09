const fs = require('fs');
const path = require('path');

// For now, create placeholder instruction
const iconPath = process.argv[2] || 'icon.png';

if (!fs.existsSync(iconPath)) {
  console.log('\n⚠️  Please save your app icon as "icon.png" in the project root directory.');
  console.log('Then run: node generate-icons.js\n');
  process.exit(1);
}

const sharp = require('sharp');

const sizes = [
  { folder: 'mipmap-mdpi', size: 48 },
  { folder: 'mipmap-hdpi', size: 72 },
  { folder: 'mipmap-xhdpi', size: 96 },
  { folder: 'mipmap-xxhdpi', size: 144 },
  { folder: 'mipmap-xxxhdpi', size: 192 },
];

const resDir = path.join(__dirname, 'android', 'app', 'src', 'main', 'res');

async function generateIcons() {
  console.log('🎨 Generating app icons...\n');
  
  for (const { folder, size } of sizes) {
    const outputDir = path.join(resDir, folder);
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Generate ic_launcher.png
    await sharp(iconPath)
      .resize(size, size, {
        fit: 'cover',
        position: 'center'
      })
      .png()
      .toFile(path.join(outputDir, 'ic_launcher.png'));
    
    // Generate ic_launcher_round.png (same for now)
    await sharp(iconPath)
      .resize(size, size, {
        fit: 'cover',
        position: 'center'
      })
      .png()
      .toFile(path.join(outputDir, 'ic_launcher_round.png'));
    
    console.log(`✅ Generated ${folder} icons (${size}x${size})`);
  }
  
  console.log('\n✨ All icons generated successfully!\n');
}

generateIcons().catch(err => {
  console.error('❌ Error generating icons:', err);
  process.exit(1);
});
