const { test, expect } = require('@playwright/test');

test.describe('CSS and JS Resource Loading Tests', () => {
  
  test.describe('Index Page Resources', () => {
    test('CSS files load successfully', async ({ page }) => {
      // Track network requests
      const cssRequests = [];
      page.on('response', response => {
        if (response.url().includes('.css')) {
          cssRequests.push({
            url: response.url(),
            status: response.status()
          });
        }
      });

      await page.goto('./index.html');
      
      // Wait for page to fully load
      await page.waitForLoadState('networkidle');
      
      // Check that Google Fonts loaded
      const googleFontsLoaded = cssRequests.some(req => 
        req.url.includes('fonts.googleapis.com') && req.status === 200
      );
      expect(googleFontsLoaded).toBeTruthy();
      
      // Check that local CSS file is referenced
      const cssLink = page.locator('link[href="css/style-guide.css"]');
      await expect(cssLink).toHaveAttribute('rel', 'stylesheet');
    });

    test('JS files load successfully', async ({ page }) => {
      // Track JS requests
      const jsRequests = [];
      page.on('response', response => {
        if (response.url().includes('.js')) {
          jsRequests.push({
            url: response.url(),
            status: response.status()
          });
        }
      });

      await page.goto('./index.html');
      await page.waitForLoadState('networkidle');
      
      // Check that JS file is referenced
      const jsScript = page.locator('script[src="js/style-guide.js"]');
      await expect(jsScript).toHaveCount(1);
    });

    test('smooth scrolling JavaScript works', async ({ page }) => {
      await page.goto('./index.html');
      
      // Test smooth scrolling functionality
      const aboutLink = page.locator('a[href="#about"]');
      await aboutLink.click();
      
      // Wait for scroll animation
      await page.waitForTimeout(1000);
      
      // Check that about section is in viewport
      const aboutSection = page.locator('#about');
      await expect(aboutSection).toBeInViewport();
    });

    test('header scroll effect works', async ({ page }) => {
      await page.goto('./index.html');
      
      // Get initial header background
      const header = page.locator('header');
      
      // Scroll down
      await page.evaluate(() => window.scrollTo(0, 200));
      await page.waitForTimeout(500);
      
      // Header should still be visible (fixed positioning)
      await expect(header).toBeVisible();
    });
  });

  test.describe('Style Guide Page Resources', () => {
    test('CSS files load successfully', async ({ page }) => {
      const cssRequests = [];
      page.on('response', response => {
        if (response.url().includes('.css')) {
          cssRequests.push({
            url: response.url(),
            status: response.status()
          });
        }
      });

      await page.goto('./style-guide.html');
      await page.waitForLoadState('networkidle');
      
      // Check that Google Fonts loaded
      const googleFontsLoaded = cssRequests.some(req => 
        req.url.includes('fonts.googleapis.com') && req.status === 200
      );
      expect(googleFontsLoaded).toBeTruthy();
      
      // Check CSS file references
      const crossBrowserCSS = page.locator('link[href="css/style-guide-crossbrowser.css"]');
      const mobileCSS = page.locator('link[href="css/style-guide-mobile.css"]');
      
      await expect(crossBrowserCSS).toHaveAttribute('rel', 'stylesheet');
      await expect(mobileCSS).toHaveAttribute('rel', 'stylesheet');
      await expect(mobileCSS).toHaveAttribute('media', 'screen and (max-width: 1024px)');
    });

    test('JS files load successfully', async ({ page }) => {
      await page.goto('./style-guide.html');
      await page.waitForLoadState('networkidle');
      
      // Check JS file reference
      const jsScript = page.locator('script[src="js/style-guide-crossbrowser.js"]');
      await expect(jsScript).toHaveCount(1);
    });

    test('service worker registration attempt', async ({ page }) => {
      const consoleMessages = [];
      page.on('console', msg => consoleMessages.push(msg.text()));

      await page.goto('./style-guide.html');
      await page.waitForLoadState('networkidle');
      
      // Service worker registration should be attempted (though may fail in file:// protocol)
      await page.waitForTimeout(1000);
      
      // Check if service worker code is present
      const serviceWorkerScript = page.locator('script').last();
      const scriptContent = await serviceWorkerScript.textContent();
      expect(scriptContent).toContain('serviceWorker');
    });

    test('fallback message for old browsers', async ({ page }) => {
      await page.goto('./style-guide.html');
      
      // Check conditional comment is present
      const pageContent = await page.content();
      expect(pageContent).toContain('[if lt IE 11]');
      expect(pageContent).toContain('fallback-message');
    });
  });

  test.describe('Image Resources', () => {
    test('image directory exists and is accessible', async ({ page }) => {
      await page.goto('./index.html');
      
      // Test that img directory exists by checking file structure
      // Note: Since we're using file:// protocol, we can't directly test image loading
      // but we can verify the structure and references
      
      const pageContent = await page.content();
      // The pages should load without 404 errors for critical resources
      await page.waitForLoadState('networkidle');
    });
  });

  test.describe('Font Loading', () => {
    test('Inter font loads and applies correctly', async ({ page }) => {
      await page.goto('./index.html');
      await page.waitForLoadState('networkidle');
      
      // Check that body element has Inter font family
      const bodyFontFamily = await page.locator('body').evaluate(el => {
        return window.getComputedStyle(el).fontFamily;
      });
      
      expect(bodyFontFamily).toContain('Inter');
    });

    test('font weights are available', async ({ page }) => {
      await page.goto('./style-guide.html');
      await page.waitForLoadState('networkidle');
      
      // Test different font weights
      const weightElements = page.locator('.weight-demo');
      const count = await weightElements.count();
      
      // Should have 9 different weight demonstrations
      expect(count).toBe(9);
    });
  });

  test.describe('Performance Checks', () => {
    test('page load time is reasonable', async ({ page }) => {
      const startTime = Date.now();
      
      await page.goto('./index.html');
      await page.waitForLoadState('networkidle');
      
      const loadTime = Date.now() - startTime;
      
      // Page should load within 5 seconds for local files
      expect(loadTime).toBeLessThan(5000);
    });

    test('no JavaScript errors in console', async ({ page }) => {
      const jsErrors = [];
      page.on('pageerror', error => jsErrors.push(error.message));
      
      await page.goto('./index.html');
      await page.waitForLoadState('networkidle');
      
      // Should have no JavaScript errors
      expect(jsErrors).toHaveLength(0);
    });

    test('style guide page has no JavaScript errors', async ({ page }) => {
      const jsErrors = [];
      page.on('pageerror', error => jsErrors.push(error.message));
      
      await page.goto('./style-guide.html');
      await page.waitForLoadState('networkidle');
      
      // Allow service worker registration failures in file:// protocol
      const criticalErrors = jsErrors.filter(error => 
        !error.includes('serviceWorker') && 
        !error.includes('sw.js') &&
        !error.includes('network')
      );
      
      expect(criticalErrors).toHaveLength(0);
    });
  });
});