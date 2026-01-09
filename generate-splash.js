const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const iconPath = path.join(__dirname, 'icon.png');

if (!fs.existsSync(iconPath)) {
  console.log('❌ icon.png not found');
  process.exit(1);
}

const splashSizes = [
  { folder: 'drawable-mdpi', size: 150 },
  { folder: 'drawable-hdpi', size: 225 },
  { folder: 'drawable-xhdpi', size: 300 },
  { folder: 'drawable-xxhdpi', size: 450 },
  { folder: 'drawable-xxxhdpi', size: 600 },
];

const resDir = path.join(__dirname, 'android', 'app', 'src', 'main', 'res');

async function generateSplashScreens() {
  console.log('🎨 Generating splash screen logos...\n');
  
  for (const { folder, size } of splashSizes) {
    const outputDir = path.join(resDir, folder);
    
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    await sharp(iconPath)
      .resize(size, size, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .png()
      .toFile(path.join(outputDir, 'splashscreen_logo.png'));
    
    console.log(`✅ Generated ${folder} splash logo (${size}x${size})`);
  }
  
  console.log('\n✨ All splash screens generated successfully!\n');
}

generateSplashScreens().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
