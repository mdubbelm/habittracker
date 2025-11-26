/**
 * PWA Icon Generator
 * Generates all required PWA icon sizes from the source SVG
 */

import sharp from 'sharp';
import { readFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ICON_SIZES = [72, 96, 128, 144, 152, 192, 384, 512];
const SOURCE_SVG = join(__dirname, '../public/icons/icon.svg');
const OUTPUT_DIR = join(__dirname, '../public/icons');

async function generateIcons() {
    console.log('Generating PWA icons...\n');

    // Ensure output directory exists
    if (!existsSync(OUTPUT_DIR)) {
        mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    // Read the source SVG
    const svgBuffer = readFileSync(SOURCE_SVG);

    // Generate each size
    for (const size of ICON_SIZES) {
        const outputPath = join(OUTPUT_DIR, `icon-${size}x${size}.png`);

        await sharp(svgBuffer)
            .resize(size, size, {
                fit: 'contain',
                background: { r: 248, g: 245, b: 240, alpha: 1 } // #F8F5F0
            })
            .png()
            .toFile(outputPath);

        console.log(`  ✓ Generated ${size}x${size}`);
    }

    // Generate apple-touch-icon (180x180)
    const appleTouchPath = join(__dirname, '../public/apple-touch-icon.png');
    await sharp(svgBuffer)
        .resize(180, 180, {
            fit: 'contain',
            background: { r: 248, g: 245, b: 240, alpha: 1 }
        })
        .png()
        .toFile(appleTouchPath);
    console.log('  ✓ Generated apple-touch-icon.png (180x180)');

    // Generate favicon (32x32)
    const faviconPath = join(__dirname, '../public/favicon.png');
    await sharp(svgBuffer)
        .resize(32, 32, {
            fit: 'contain',
            background: { r: 248, g: 245, b: 240, alpha: 1 }
        })
        .png()
        .toFile(faviconPath);
    console.log('  ✓ Generated favicon.png (32x32)');

    console.log('\n✅ All icons generated successfully!');
}

generateIcons().catch(console.error);
