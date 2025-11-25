#!/usr/bin/env node

/**
 * Automated Screenshot Capture
 *
 * Uses Playwright to capture screenshots of all app views
 * for documentation, blog posts, and presentations.
 *
 * Usage:
 *   node scripts/capture-screenshots.js
 *   node scripts/capture-screenshots.js --version=v0.2.0
 */

import { chromium, devices } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { execSync } from 'child_process';

// ES module __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const CONFIG = {
    baseURL: 'http://localhost:8080',
    device: 'iPhone 13',
    locale: 'nl-NL',
    timeout: 5000
};

// Parse arguments
const args = process.argv.slice(2);
const versionArg = args.find(arg => arg.startsWith('--version='));
const version = versionArg ? versionArg.split('=')[1] : getVersionFromGit();

/**
 * Get version from git (commit hash)
 */
function getVersionFromGit() {
    try {
        const hash = execSync('git rev-parse --short HEAD').toString().trim();
        return `commit-${hash}`;
    } catch (e) {
        return 'manual';
    }
}

/**
 * Get current date in YYYY-MM-DD format
 */
function getDate() {
    return new Date().toISOString().split('T')[0];
}

/**
 * Create screenshots folder structure
 */
function setupFolders() {
    const date = getDate();
    const folderName = `${date}_${version}`;
    const screenshotsDir = path.join(__dirname, '..', 'screenshots', folderName);

    if (!fs.existsSync(screenshotsDir)) {
        fs.mkdirSync(screenshotsDir, { recursive: true });
        console.log(`✅ Created folder: screenshots/${folderName}`);
    }

    return screenshotsDir;
}

/**
 * Main screenshot capture function
 */
async function captureScreenshots() {
    console.log('📸 Starting screenshot capture...');
    console.log(`   Version: ${version}`);
    console.log(`   Device: ${CONFIG.device}`);
    console.log(`   URL: ${CONFIG.baseURL}\n`);

    // Setup folders
    const outputDir = setupFolders();

    // Launch browser
    const browser = await chromium.launch({
        headless: true // Set to false to see the browser
    });

    const context = await browser.newContext({
        ...devices[CONFIG.device],
        locale: CONFIG.locale
    });

    const page = await context.newPage();
    page.setDefaultTimeout(CONFIG.timeout);

    try {
        // Navigate to app
        console.log('🌐 Loading app...');
        await page.goto(`${CONFIG.baseURL}/src/index.html`);

        // Wait for app to load
        await page.waitForSelector('#app', { state: 'visible' });

        // Check if privacy notice is shown (first time)
        const privacyNotice = await page.locator('#privacy-notice').isVisible();

        if (privacyNotice) {
            console.log('📝 Capturing privacy notice...');
            await page.screenshot({
                path: path.join(outputDir, '01_privacy-notice.png'),
                fullPage: false
            });

            // Accept privacy
            await page.click('#accept-privacy');
            await page.waitForTimeout(500);
        }

        // 1. Homepage / Tracker View (default view)
        console.log('📸 Capturing homepage (tracker view)...');
        await page.waitForSelector('.health-circle', { state: 'visible' });
        await page.screenshot({
            path: path.join(outputDir, '02_homepage-tracker.png'),
            fullPage: true
        });

        // Fill in some test data for better screenshots
        console.log('📝 Filling test data...');

        // Use evaluate for range inputs (sliders)
        await page.evaluate(() => {
            document.getElementById('sleep-score').value = 8;
            document.getElementById('sleep-score').dispatchEvent(new Event('input'));
        });
        await page.evaluate(() => {
            document.getElementById('back-pain').value = 2;
            document.getElementById('back-pain').dispatchEvent(new Event('input'));
        });

        // Water intake via + button clicks (input is readonly)
        for (let i = 0; i < 6; i++) {
            await page.click('#water-add');
            await page.waitForTimeout(100);
        }

        await page.check('#walked');
        await page.check('#dreamed');

        // Screenshot with filled form
        console.log('📸 Capturing filled tracker form...');
        await page.screenshot({
            path: path.join(outputDir, '03_tracker-filled.png'),
            fullPage: true
        });

        // Save data
        await page.click('#save-data');
        await page.waitForTimeout(1000); // Wait for save animation

        // Screenshot with updated health score
        console.log('📸 Capturing updated health score...');
        await page.screenshot({
            path: path.join(outputDir, '04_health-score-updated.png'),
            fullPage: true
        });

        // 2. Stats View
        console.log('📸 Capturing stats view...');
        await page.click('[data-view="stats-view"]');
        await page.waitForTimeout(500);
        await page.screenshot({
            path: path.join(outputDir, '05_stats-view.png'),
            fullPage: true
        });

        // 3. History View
        console.log('📸 Capturing history view...');
        await page.click('[data-view="history-view"]');
        await page.waitForTimeout(500);
        await page.screenshot({
            path: path.join(outputDir, '06_history-view.png'),
            fullPage: true
        });

        // 4. Settings View
        console.log('📸 Capturing settings view...');
        await page.click('[data-view="settings-view"]');
        await page.waitForTimeout(500);
        await page.screenshot({
            path: path.join(outputDir, '07_settings-view.png'),
            fullPage: true
        });

        // Back to tracker for final shot
        await page.click('[data-view="tracker-view"]');
        await page.waitForTimeout(500);

        console.log('\n✅ All screenshots captured successfully!');
        console.log(`📁 Location: screenshots/${path.basename(outputDir)}\n`);

        // Create version README
        createVersionReadme(outputDir);

    } catch (error) {
        console.error('❌ Error capturing screenshots:', error.message);
        throw error;
    } finally {
        await browser.close();
    }
}

/**
 * Create README for this version's screenshots
 */
function createVersionReadme(outputDir) {
    const date = getDate();

    let commitHash = 'N/A';
    let commitMessage = 'N/A';

    try {
        commitHash = execSync('git rev-parse HEAD').toString().trim();
        commitMessage = execSync('git log -1 --pretty=%B').toString().trim();
    } catch (e) {
        // Git not available or not a repo
    }

    const readme = `# Screenshots - ${version}

**Date:** ${date}
**Commit:** ${commitHash}
**Message:** ${commitMessage}

## Captured Views

1. ✅ Privacy Notice (first-time user)
2. ✅ Homepage / Tracker View (empty)
3. ✅ Tracker Form (filled with test data)
4. ✅ Health Score (updated after save)
5. ✅ Stats View
6. ✅ History View
7. ✅ Settings View

## Test Data Used

- Sleep Score: 8/10
- Back Pain: 2/10
- Water Intake: 6 glasses
- Walked: Yes
- Dreamed: Yes
- Sugar/Alcohol: No
- Caffeine: Yes (assumed default)

## Device Specs

- **Device:** iPhone 13
- **Viewport:** 390×844px
- **DPR:** 3x
- **Locale:** nl-NL

## Notes

[Add any version-specific notes here]

---

*Auto-generated by scripts/capture-screenshots.js*
`;

    fs.writeFileSync(path.join(outputDir, 'README.md'), readme);
    console.log('✅ Version README created');
}

// Run it!
captureScreenshots().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
});
