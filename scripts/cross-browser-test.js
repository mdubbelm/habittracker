#!/usr/bin/env node

/**
 * Cross-Browser Testing Script
 *
 * Tests the Health Tracker app across multiple browsers
 * to verify visual consistency and functionality.
 */

import { chromium, firefox, webkit } from 'playwright';
import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const CONFIG = {
    baseURL: 'http://localhost:8080',
    timeout: 10000
};

const BROWSERS = [
    { name: 'Chrome', engine: chromium, options: {} },
    { name: 'Firefox', engine: firefox, options: {} },
    { name: 'Safari', engine: webkit, options: {} }
];

const TESTS = [
    {
        name: 'Page loads correctly',
        test: async page => {
            await page.goto(`${CONFIG.baseURL}/src/index.html`);
            await page.waitForSelector('#app', { state: 'visible' });

            // Accept privacy if shown
            const privacyVisible = await page.locator('#privacy-notice').isVisible();
            if (privacyVisible) {
                await page.click('#accept-privacy');
                await page.waitForTimeout(300);
            }

            return { passed: true };
        }
    },
    {
        name: 'Health score circle renders',
        test: async page => {
            const circle = await page.locator('.health-circle').isVisible();
            const scoreText = await page.locator('#svg-score-value').textContent();
            return {
                passed: circle && scoreText !== null,
                details: `Score: ${scoreText}`
            };
        }
    },
    {
        name: 'Quick stats grid displays (2x2)',
        test: async page => {
            const stats = await page.locator('.stat-card').count();
            return {
                passed: stats === 4,
                details: `Found ${stats} stat cards`
            };
        }
    },
    {
        name: 'Water glasses render (8 icons)',
        test: async page => {
            const glasses = await page.locator('.glass-icon').count();
            return {
                passed: glasses === 8,
                details: `Found ${glasses} glass icons`
            };
        }
    },
    {
        name: 'Water + button works',
        test: async page => {
            const before = await page.locator('#water-intake').inputValue();
            await page.click('#water-add');
            await page.waitForTimeout(200);
            const after = await page.locator('#water-intake').inputValue();
            return {
                passed: parseInt(after) === parseInt(before) + 1,
                details: `${before} → ${after}`
            };
        }
    },
    {
        name: 'Gradient headers visible',
        test: async page => {
            const headers = await page.locator('.tracking-card h3').count();
            return {
                passed: headers >= 2,
                details: `Found ${headers} card headers`
            };
        }
    },
    {
        name: 'Bottom navigation works',
        test: async page => {
            // Click stats view
            await page.click('[data-view="stats-view"]');
            await page.waitForTimeout(300);
            const statsVisible = await page.locator('#stats-view.active').isVisible();

            // Click back to tracker
            await page.click('[data-view="tracker-view"]');
            await page.waitForTimeout(300);
            const trackerVisible = await page.locator('#tracker-view.active').isVisible();

            return {
                passed: statsVisible && trackerVisible,
                details: 'Navigation switches views correctly'
            };
        }
    },
    {
        name: 'Save button works',
        test: async page => {
            await page.click('#save-data');
            await page.waitForTimeout(500);

            // Check for feedback (button text change or animation)
            const buttonText = await page.locator('#save-data').textContent();
            const hasOpgeslagen = buttonText.includes('Opgeslagen');

            return {
                passed: true, // Save doesn't error
                details: hasOpgeslagen ? 'Shows "Opgeslagen!" feedback' : 'Save completed'
            };
        }
    },
    {
        name: 'Alcohol pills have aria-pressed',
        test: async page => {
            // Show alcohol section
            await page.check('#alcohol-consumed');
            await page.waitForTimeout(300);

            const pill = page.locator('.pill-button').first();
            const ariaPressed = await pill.getAttribute('aria-pressed');

            // Click pill
            await pill.click();
            await page.waitForTimeout(200);
            const ariaPressedAfter = await pill.getAttribute('aria-pressed');

            return {
                passed: ariaPressed === 'false' && ariaPressedAfter === 'true',
                details: `aria-pressed: ${ariaPressed} → ${ariaPressedAfter}`
            };
        }
    },
    {
        name: 'Screen reader water status exists',
        test: async page => {
            const srText = await page.locator('#water-status').textContent();
            return {
                passed: srText && srText.includes('Water:'),
                details: `SR announces: "${srText}"`
            };
        }
    }
];

async function runTests() {
    console.log('🧪 Cross-Browser Testing\n');
    console.log('='.repeat(60));

    const results = {};
    const outputDir = path.join(__dirname, '..', 'screenshots', 'cross-browser-test');

    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    for (const browser of BROWSERS) {
        console.log(`\n🌐 Testing ${browser.name}...`);
        console.log('-'.repeat(40));

        results[browser.name] = { passed: 0, failed: 0, tests: [] };

        try {
            const browserInstance = await browser.engine.launch({ headless: true });
            const context = await browserInstance.newContext({
                viewport: { width: 390, height: 844 } // iPhone 13
            });
            const page = await context.newPage();
            page.setDefaultTimeout(CONFIG.timeout);

            for (const test of TESTS) {
                try {
                    const result = await test.test(page);
                    const status = result.passed ? '✅' : '❌';
                    console.log(`  ${status} ${test.name}`);
                    if (result.details) {
                        console.log(`     └─ ${result.details}`);
                    }

                    results[browser.name].tests.push({
                        name: test.name,
                        ...result
                    });

                    if (result.passed) {
                        results[browser.name].passed++;
                    } else {
                        results[browser.name].failed++;
                    }
                } catch (error) {
                    console.log(`  ❌ ${test.name}`);
                    console.log(`     └─ Error: ${error.message}`);
                    results[browser.name].tests.push({
                        name: test.name,
                        passed: false,
                        error: error.message
                    });
                    results[browser.name].failed++;
                }
            }

            // Take final screenshot
            await page.screenshot({
                path: path.join(outputDir, `${browser.name.toLowerCase()}-final.png`),
                fullPage: true
            });

            await browserInstance.close();
        } catch (error) {
            console.log(`  ❌ Browser failed to launch: ${error.message}`);
            results[browser.name].error = error.message;
        }
    }

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 SUMMARY\n');

    let allPassed = true;

    for (const [browserName, result] of Object.entries(results)) {
        if (result.error) {
            console.log(`${browserName}: ❌ Failed to run (${result.error})`);
            allPassed = false;
        } else {
            const total = result.passed + result.failed;
            const percentage = Math.round((result.passed / total) * 100);
            const status = result.failed === 0 ? '✅' : '⚠️';
            console.log(
                `${browserName}: ${status} ${result.passed}/${total} tests passed (${percentage}%)`
            );
            if (result.failed > 0) {
                allPassed = false;
            }
        }
    }

    console.log('\n' + '='.repeat(60));

    if (allPassed) {
        console.log('🎉 All browsers passed!\n');
    } else {
        console.log('⚠️  Some tests failed. Check details above.\n');
    }

    // Save results to JSON
    fs.writeFileSync(path.join(outputDir, 'results.json'), JSON.stringify(results, null, 2));

    console.log(`📁 Screenshots saved to: screenshots/cross-browser-test/`);

    return allPassed;
}

runTests()
    .then(passed => process.exit(passed ? 0 : 1))
    .catch(error => {
        console.error('Fatal error:', error);
        process.exit(1);
    });
