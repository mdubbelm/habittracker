# Mobile Testing Guide - iPhone 13

## iPhone 13 Specifications

### Display
- **Size**: 6.1-inch (diagonal)
- **Resolution**: 2532 x 1170 pixels (460 ppi)
- **CSS Viewport**: 390 x 844 pixels
- **Device Pixel Ratio**: 3x
- **Safe Area**: Account for notch and home indicator

### User Agent
```
Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1
```

---

## Local Testing Setup

### 1. Browser DevTools

#### Chrome DevTools
1. Open DevTools (F12 or Cmd+Opt+I)
2. Click Device Toolbar icon (Cmd+Shift+M)
3. Select "iPhone 13 Pro" or custom:
   - Width: 390px
   - Height: 844px
   - Device pixel ratio: 3
4. Enable touch simulation

#### Safari Responsive Design Mode
1. Enable Developer menu (Preferences → Advanced)
2. Develop → Enter Responsive Design Mode (Cmd+Opt+R)
3. Select iPhone 13 or custom viewport

### 2. Development Server with Mobile Preview

Create `dev-server.html` voor instant preview:

```html
<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Health Tracker - iPhone 13 Preview</title>
    <style>
        body {
            margin: 0;
            padding: 20px;
            background: #2c2c2c;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            font-family: system-ui;
        }

        .device-frame {
            width: 390px;
            height: 844px;
            background: #1a1a1a;
            border-radius: 40px;
            padding: 12px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.5);
            position: relative;
        }

        .notch {
            position: absolute;
            top: 12px;
            left: 50%;
            transform: translateX(-50%);
            width: 150px;
            height: 28px;
            background: #1a1a1a;
            border-radius: 0 0 20px 20px;
            z-index: 10;
        }

        iframe {
            width: 100%;
            height: 100%;
            border: none;
            border-radius: 30px;
            background: white;
        }

        .controls {
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        .controls button {
            display: block;
            width: 100%;
            margin: 5px 0;
            padding: 8px 16px;
            border: none;
            background: #6366F1;
            color: white;
            border-radius: 4px;
            cursor: pointer;
        }

        .controls button:hover {
            background: #5558E3;
        }
    </style>
</head>
<body>
    <div class="device-frame">
        <div class="notch"></div>
        <iframe src="./habittracker.html" id="preview"></iframe>
    </div>

    <div class="controls">
        <h3 style="margin: 0 0 10px 0;">iPhone 13 Preview</h3>
        <button onclick="document.getElementById('preview').src = document.getElementById('preview').src">🔄 Reload</button>
        <button onclick="toggleOrientation()">🔄 Rotate</button>
        <button onclick="openDevTools()">🛠️ DevTools</button>
    </div>

    <script>
        function toggleOrientation() {
            const frame = document.querySelector('.device-frame');
            const current = frame.style.transform || '';
            frame.style.transform = current ? '' : 'rotate(90deg)';
            frame.style.transition = 'transform 0.3s ease';
        }

        function openDevTools() {
            alert('Open browser DevTools (F12) and inspect the iframe');
        }
    </script>
</body>
</html>
```

### 3. Xcode iOS Simulator (macOS only)

```bash
# Open iOS Simulator
open -a Simulator

# Select iPhone 13:
# Hardware → Device → iPhone 13

# Open Safari in simulator
# Navigate to: http://localhost:3000
```

**Enable Web Inspector:**
1. iOS Settings → Safari → Advanced → Web Inspector
2. macOS Safari → Develop → [Simulator] → [Page name]

---

## Automated Testing

### Playwright Configuration

Create `playwright.config.js`:

```javascript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',

  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'iPhone 13',
      use: {
        ...devices['iPhone 13'],
        // Custom overrides
        viewport: { width: 390, height: 844 },
        deviceScaleFactor: 3,
        isMobile: true,
        hasTouch: true,
      },
    },

    {
      name: 'iPhone 13 - Landscape',
      use: {
        ...devices['iPhone 13 landscape'],
        viewport: { width: 844, height: 390 },
      },
    },

    {
      name: 'Desktop Chrome',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

### Example Test

Create `tests/e2e/health-tracker.spec.js`:

```javascript
import { test, expect } from '@playwright/test';

test.describe('Health Tracker - iPhone 13', () => {
  test('should load app correctly', async ({ page }) => {
    await page.goto('/');

    // Check viewport
    const viewport = page.viewportSize();
    expect(viewport.width).toBe(390);
    expect(viewport.height).toBe(844);

    // Check title
    await expect(page).toHaveTitle(/Health Tracker/);

    // Check health score circle is visible
    await expect(page.locator('.health-circle')).toBeVisible();
  });

  test('should track sleep data', async ({ page }) => {
    await page.goto('/');

    // Adjust sleep slider
    const sleepSlider = page.locator('#sleepScore');
    await sleepSlider.fill('8');

    // Verify score updates
    const scoreText = page.locator('.score-value');
    await expect(scoreText).not.toHaveText('0%');
  });

  test('should save data', async ({ page }) => {
    await page.goto('/');

    // Fill in data
    await page.locator('#sleepScore').fill('9');
    await page.locator('#waterIntake').fill('8');
    await page.locator('#walked').check();

    // Save
    await page.locator('button:has-text("Opslaan")').click();

    // Check for success message
    await expect(page.locator('.success-message')).toBeVisible();
  });

  test('should handle touch gestures', async ({ page }) => {
    await page.goto('/');

    // Swipe navigation (if applicable)
    const nav = page.locator('.bottom-nav');
    await nav.tap();

    // Verify navigation works
    await expect(page.locator('.active-tab')).toBeVisible();
  });

  test('should work in landscape mode', async ({ page }) => {
    await page.setViewportSize({ width: 844, height: 390 });
    await page.goto('/');

    // Verify layout adapts
    await expect(page.locator('.health-circle')).toBeVisible();
  });

  test('should handle safe area (notch)', async ({ page }) => {
    await page.goto('/');

    // Check top elements don't overlap with notch
    const header = page.locator('header');
    const headerBox = await header.boundingBox();

    // Should have safe area padding (iOS safe-area-inset-top)
    expect(headerBox.y).toBeGreaterThan(0);
  });
});

test.describe('Performance - iPhone 13', () => {
  test('should load in under 2 seconds', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;

    expect(loadTime).toBeLessThan(2000);
  });

  test('should maintain 60fps during animations', async ({ page }) => {
    await page.goto('/');

    // Monitor performance
    const metrics = await page.evaluate(() => {
      return new Promise(resolve => {
        const observer = new PerformanceObserver(list => {
          const entries = list.getEntries();
          resolve(entries);
        });
        observer.observe({ entryTypes: ['measure'] });

        // Trigger animation
        document.querySelector('#sleepScore').value = 10;
        document.querySelector('#sleepScore').dispatchEvent(new Event('input'));
      });
    });

    // Verify no dropped frames
  });
});
```

### Run Tests

```bash
# Install Playwright
npm install -D @playwright/test

# Install browsers
npx playwright install

# Run tests
npx playwright test

# Run specific project
npx playwright test --project="iPhone 13"

# Debug mode
npx playwright test --debug

# UI mode (interactive)
npx playwright test --ui
```

---

## BrowserStack (Cloud Testing)

### Setup

1. Create account: https://www.browserstack.com/
2. Get credentials
3. Install BrowserStack Local:

```bash
npm install -g browserstack-local
```

### Configuration

Create `.browserstack.json`:

```json
{
  "devices": [
    {
      "device": "iPhone 13",
      "os_version": "17",
      "browser": "safari",
      "real_mobile": true
    },
    {
      "device": "iPhone 13 Pro",
      "os_version": "17",
      "browser": "safari",
      "real_mobile": true
    }
  ]
}
```

### Playwright + BrowserStack

```javascript
// playwright.config.js
export default defineConfig({
  use: {
    connectOptions: {
      wsEndpoint: `wss://cdp.browserstack.com/playwright?caps=${encodeURIComponent(JSON.stringify({
        'browser': 'safari',
        'os': 'ios',
        'os_version': '17',
        'device': 'iPhone 13',
        'realMobile': 'true',
        'browserstack.username': process.env.BROWSERSTACK_USERNAME,
        'browserstack.accessKey': process.env.BROWSERSTACK_ACCESS_KEY,
      }))}`,
    },
  },
});
```

---

## Visual Regression Testing

### Setup Playwright Screenshots

```javascript
test('visual regression - health score', async ({ page }) => {
  await page.goto('/');

  // Take screenshot
  await expect(page).toHaveScreenshot('health-score-initial.png', {
    fullPage: true,
    maxDiffPixels: 100,
  });

  // Change data
  await page.locator('#sleepScore').fill('10');

  // Compare
  await expect(page).toHaveScreenshot('health-score-perfect.png');
});
```

---

## Debugging Tips

### 1. Remote Debugging (Safari)

1. Connect iPhone via USB
2. Enable Web Inspector on device
3. Safari → Develop → [Device] → [Page]

### 2. Chrome Remote Debugging (Android)

```bash
chrome://inspect/#devices
```

### 3. Console Logging

```javascript
// Add viewport info to console
console.log('Viewport:', window.innerWidth, 'x', window.innerHeight);
console.log('DPR:', window.devicePixelRatio);
console.log('Touch:', 'ontouchstart' in window);
```

### 4. Viewport Debugging

```css
/* Add to CSS temporarily */
body::before {
  content: attr(data-viewport);
  position: fixed;
  top: 0;
  left: 0;
  background: red;
  color: white;
  padding: 5px;
  z-index: 99999;
  font-size: 12px;
}
```

```javascript
// Update content
document.body.setAttribute('data-viewport',
  `${window.innerWidth}x${window.innerHeight} @ ${window.devicePixelRatio}x`
);
```

---

## Safe Area (Notch & Home Indicator)

### CSS for Safe Areas

```css
/* Support for iPhone notch */
:root {
  --safe-area-inset-top: env(safe-area-inset-top, 0px);
  --safe-area-inset-right: env(safe-area-inset-right, 0px);
  --safe-area-inset-bottom: env(safe-area-inset-bottom, 0px);
  --safe-area-inset-left: env(safe-area-inset-left, 0px);
}

/* Apply to fixed elements */
header {
  padding-top: calc(20px + var(--safe-area-inset-top));
}

.bottom-nav {
  padding-bottom: calc(20px + var(--safe-area-inset-bottom));
}
```

### Viewport Meta Tag

```html
<meta name="viewport"
      content="width=device-width, initial-scale=1.0, viewport-fit=cover">
```

---

## Checklist voor iPhone 13 Testing

### Visual
- [ ] App fits within viewport (390x844)
- [ ] No horizontal scrolling
- [ ] Text is readable (min 16px)
- [ ] Touch targets ≥ 44x44px
- [ ] Safe area respected (notch, home indicator)
- [ ] Animations run smoothly (60fps)
- [ ] Images load correctly (@3x)

### Functionality
- [ ] All buttons work with touch
- [ ] Forms can be filled
- [ ] Sliders work with touch/drag
- [ ] Data saves correctly
- [ ] Navigation works
- [ ] localStorage works
- [ ] Service Worker installs

### Performance
- [ ] Initial load < 2s
- [ ] Smooth scrolling
- [ ] No jank during animations
- [ ] Battery impact acceptable
- [ ] Memory usage reasonable

### Orientation
- [ ] Portrait mode works
- [ ] Landscape mode works (optional)
- [ ] Rotation transitions smoothly

### PWA
- [ ] Can install to home screen
- [ ] Works offline
- [ ] Icons display correctly
- [ ] Splash screen shows

---

## CI/CD Integration

### GitHub Actions

```yaml
# .github/workflows/mobile-test.yml
name: Mobile Tests

on: [push, pull_request]

jobs:
  test-iphone:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npx playwright install
      - run: npx playwright test --project="iPhone 13"
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

---

## Resources

- [iOS Design Guidelines](https://developer.apple.com/design/human-interface-guidelines/ios)
- [Playwright Devices](https://playwright.dev/docs/emulation#devices)
- [BrowserStack Devices](https://www.browserstack.com/list-of-browsers-and-platforms)
- [Can I Use - iOS Safari](https://caniuse.com/?compare=ios_saf+17.0&compareCats=all)
- [Safari Web Inspector Guide](https://webkit.org/web-inspector/)

---

**Laatst bijgewerkt**: November 2024
**Test Coverage**: iPhone 13 (iOS 17+)
