/**
 * Generate PWA icons from seal.png
 */
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputImage = path.join(__dirname, '../public/assets/ocean/seal.png');
const outputDir = path.join(__dirname, '../public');

const sizes = [
  { size: 192, name: 'icon-192.png' },
  { size: 512, name: 'icon-512.png' }
];

async function generateIcons() {
  console.log('🎨 Generating PWA icons from seal.png...\n');

  for (const { size, name } of sizes) {
    const outputPath = path.join(outputDir, name);

    await sharp(inputImage)
      .resize(size, size, {
        fit: 'contain',
        background: { r: 33, g: 150, b: 243, alpha: 1 } // Ocean blue background
      })
      .png()
      .toFile(outputPath);

    console.log(`✅ Created ${name} (${size}x${size})`);
  }

  console.log('\n🎉 PWA icons generated successfully!');
  console.log('📁 Location: frontend/public/');
}

generateIcons().catch(err => {
  console.error('❌ Error generating icons:', err);
  process.exit(1);
});