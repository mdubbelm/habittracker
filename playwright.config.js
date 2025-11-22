import { defineConfig, devices } from '@playwright/test';

/**
 * Health Tracker - Playwright Configuration
 * Configured for iPhone 13 testing and cross-browser compatibility
 */
export default defineConfig({
  testDir: './tests/e2e',

  // Maximum time one test can run
  timeout: 30 * 1000,

  // Test configuration
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  // Reporter to use
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['list'],
    ['junit', { outputFile: 'test-results/junit.xml' }],
  ],

  // Shared settings for all projects
  use: {
    // Base URL for tests
    baseURL: 'http://localhost:3000',

    // Collect trace on first retry
    trace: 'on-first-retry',

    // Screenshot on failure
    screenshot: 'only-on-failure',

    // Video on failure
    video: 'retain-on-failure',

    // Maximum time for actions (click, fill, etc.)
    actionTimeout: 10 * 1000,
  },

  // Configure projects for major browsers and devices
  projects: [
    // === iPhone 13 Testing ===
    {
      name: 'iPhone 13 - Safari',
      use: {
        ...devices['iPhone 13'],
        viewport: { width: 390, height: 844 },
        deviceScaleFactor: 3,
        isMobile: true,
        hasTouch: true,
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
      },
    },

    {
      name: 'iPhone 13 - Landscape',
      use: {
        ...devices['iPhone 13 landscape'],
        viewport: { width: 844, height: 390 },
        deviceScaleFactor: 3,
        isMobile: true,
        hasTouch: true,
      },
    },

    // === Other Mobile Devices ===
    {
      name: 'iPhone 13 Pro',
      use: { ...devices['iPhone 13 Pro'] },
    },

    {
      name: 'Pixel 5',
      use: { ...devices['Pixel 5'] },
    },

    // === Desktop Browsers ===
    {
      name: 'Desktop - Chrome',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 },
      },
    },

    {
      name: 'Desktop - Firefox',
      use: {
        ...devices['Desktop Firefox'],
        viewport: { width: 1280, height: 720 },
      },
    },

    {
      name: 'Desktop - Safari',
      use: {
        ...devices['Desktop Safari'],
        viewport: { width: 1280, height: 720 },
      },
    },

    // === Tablet ===
    {
      name: 'iPad Pro',
      use: { ...devices['iPad Pro'] },
    },
  ],

  // Run local dev server before starting tests
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
