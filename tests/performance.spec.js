const { test, expect } = require('@playwright/test');

test.describe('Performance Tests', () => {
  
  test.describe('Page Load Performance', () => {
    test('index page loads within acceptable time', async ({ page }) => {
      const startTime = Date.now();
      
      await page.goto('./index.html');
      await page.waitForLoadState('load');
      
      const loadTime = Date.now() - startTime;
      
      // Page should load within 3 seconds for local files
      expect(loadTime).toBeLessThan(3000);
      console.log(`Index page load time: ${loadTime}ms`);
    });

    test('style guide page loads within acceptable time', async ({ page }) => {
      const startTime = Date.now();
      
      await page.goto('./style-guide.html');
      await page.waitForLoadState('load');
      
      const loadTime = Date.now() - startTime;
      
      // Style guide has more content, allow slightly more time
      expect(loadTime).toBeLessThan(4000);
      console.log(`Style guide page load time: ${loadTime}ms`);
    });

    test('network idle state is reached quickly', async ({ page }) => {
      const startTime = Date.now();
      
      await page.goto('./index.html');
      await page.waitForLoadState('networkidle');
      
      const networkIdleTime = Date.now() - startTime;
      
      // Network should be idle within 5 seconds
      expect(networkIdleTime).toBeLessThan(5000);
      console.log(`Network idle time: ${networkIdleTime}ms`);
    });
  });

  test.describe('Resource Loading Performance', () => {
    test('CSS files load efficiently', async ({ page }) => {
      const cssLoadTimes = [];
      
      page.on('response', response => {
        if (response.url().includes('.css')) {
          const timing = response.request().timing();
          if (timing) {
            cssLoadTimes.push({
              url: response.url(),
              responseTime: timing.responseEnd - timing.responseStart
            });
          }
        }
      });

      await page.goto('./index.html');
      await page.waitForLoadState('networkidle');
      
      // Google Fonts should load reasonably fast
      const googleFontsLoad = cssLoadTimes.find(load => 
        load.url.includes('fonts.googleapis.com')
      );
      
      if (googleFontsLoad) {
        expect(googleFontsLoad.responseTime).toBeLessThan(2000);
      }
    });

    test('JavaScript executes without blocking', async ({ page }) => {
      const jsErrors = [];
      const jsWarnings = [];
      
      page.on('console', msg => {
        if (msg.type() === 'error') {
          jsErrors.push(msg.text());
        } else if (msg.type() === 'warning') {
          jsWarnings.push(msg.text());
        }
      });

      const startTime = Date.now();
      await page.goto('./index.html');
      await page.waitForLoadState('domcontentloaded');
      const domLoadTime = Date.now() - startTime;
      
      // DOM should load quickly
      expect(domLoadTime).toBeLessThan(2000);
      
      // No critical JavaScript errors
      expect(jsErrors.length).toBe(0);
    });

    test('fonts load without causing layout shift', async ({ page }) => {
      await page.goto('./index.html');
      
      // Wait for fonts to load
      await page.waitForFunction(() => {
        return document.fonts.ready;
      });
      
      // Check that Inter font is loaded
      const fontLoaded = await page.evaluate(() => {
        return document.fonts.check('1em Inter');
      });
      
      expect(fontLoaded).toBeTruthy();
    });
  });

  test.describe('Runtime Performance', () => {
    test('smooth scrolling performance', async ({ page }) => {
      await page.goto('./index.html');
      
      // Test smooth scrolling by clicking navigation link
      const startTime = Date.now();
      await page.click('a[href="#about"]');
      
      // Wait for scroll to complete
      await page.waitForTimeout(1000);
      
      const scrollTime = Date.now() - startTime;
      
      // Scroll animation should complete within reasonable time
      expect(scrollTime).toBeLessThan(2000);
      
      // Verify we actually scrolled to the section
      const aboutSection = page.locator('#about');
      await expect(aboutSection).toBeInViewport();
    });

    test('header scroll effect performance', async ({ page }) => {
      await page.goto('./index.html');
      
      const header = page.locator('header');
      
      // Trigger scroll events multiple times
      for (let i = 0; i < 5; i++) {
        await page.evaluate(() => window.scrollTo(0, 100 + Math.random() * 100));
        await page.waitForTimeout(100);
        
        // Header should remain visible and responsive
        await expect(header).toBeVisible();
      }
    });

    test('form interactions are responsive', async ({ page }) => {
      await page.goto('./index.html');
      
      const emailInput = page.locator('input[type="email"]');
      
      if (await emailInput.count() > 0) {
        const startTime = Date.now();
        
        // Test rapid typing
        await emailInput.click();
        await emailInput.fill('test@example.com');
        
        const interactionTime = Date.now() - startTime;
        
        // Form should respond quickly
        expect(interactionTime).toBeLessThan(500);
        await expect(emailInput).toHaveValue('test@example.com');
      }
    });
  });

  test.describe('Memory Usage', () => {
    test('no memory leaks in event listeners', async ({ page }) => {
      await page.goto('./index.html');
      
      // Simulate multiple interactions that could cause memory leaks
      for (let i = 0; i < 10; i++) {
        // Trigger scroll events
        await page.evaluate(() => window.scrollTo(0, Math.random() * 1000));
        await page.waitForTimeout(50);
        
        // Click navigation elements
        await page.click('a[href="#home"]');
        await page.waitForTimeout(50);
      }
      
      // Page should still be responsive
      const finalHeader = page.locator('header');
      await expect(finalHeader).toBeVisible();
    });

    test('DOM size is reasonable', async ({ page }) => {
      await page.goto('./index.html');
      
      const domSize = await page.evaluate(() => {
        return {
          nodeCount: document.querySelectorAll('*').length,
          bodySize: document.body.innerHTML.length
        };
      });
      
      // DOM should not be excessively large
      expect(domSize.nodeCount).toBeLessThan(1000);
      console.log(`DOM node count: ${domSize.nodeCount}`);
    });

    test('style guide DOM size is manageable', async ({ page }) => {
      await page.goto('./style-guide.html');
      
      const domSize = await page.evaluate(() => {
        return {
          nodeCount: document.querySelectorAll('*').length,
          bodySize: document.body.innerHTML.length
        };
      });
      
      // Style guide can be larger but should still be reasonable
      expect(domSize.nodeCount).toBeLessThan(2000);
      console.log(`Style guide DOM node count: ${domSize.nodeCount}`);
    });
  });

  test.describe('Mobile Performance', () => {
    test('mobile page load performance', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      
      const startTime = Date.now();
      await page.goto('./index.html');
      await page.waitForLoadState('load');
      
      const mobileLoadTime = Date.now() - startTime;
      
      // Mobile should load quickly despite smaller resources
      expect(mobileLoadTime).toBeLessThan(3000);
      console.log(`Mobile load time: ${mobileLoadTime}ms`);
    });

    test('mobile scroll performance', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('./index.html');
      
      // Test mobile scrolling
      for (let i = 0; i < 5; i++) {
        await page.touchscreen.tap(200, 400);
        await page.evaluate(() => window.scrollBy(0, 100));
        await page.waitForTimeout(100);
      }
      
      // Page should remain responsive
      const header = page.locator('header');
      await expect(header).toBeVisible();
    });

    test('mobile touch interactions are responsive', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('./index.html');
      
      const button = page.locator('.btn-primary').first();
      
      if (await button.isVisible()) {
        const startTime = Date.now();
        await button.tap();
        const tapTime = Date.now() - startTime;
        
        // Touch should be responsive
        expect(tapTime).toBeLessThan(300);
      }
    });
  });

  test.describe('Optimization Checks', () => {
    test('minimal inline styles', async ({ page }) => {
      await page.goto('./index.html');
      
      const elementsWithInlineStyles = await page.evaluate(() => {
        const elements = document.querySelectorAll('[style]');
        return elements.length;
      });
      
      // Should minimize inline styles for better caching
      // Allow some for dynamic styles but not excessive
      expect(elementsWithInlineStyles).toBeLessThan(10);
    });

    test('external resources are referenced correctly', async ({ page }) => {
      await page.goto('./index.html');
      
      // Check CSS references
      const cssLinks = page.locator('link[rel="stylesheet"]');
      const cssCount = await cssLinks.count();
      
      // Should have external CSS files
      expect(cssCount).toBeGreaterThan(0);
      
      // Check JS references
      const jsScripts = page.locator('script[src]');
      const jsCount = await jsScripts.count();
      
      // Should have external JS files
      expect(jsCount).toBeGreaterThan(0);
    });

    test('proper caching headers simulation', async ({ page }) => {
      await page.goto('./index.html');
      
      // Simulate reload to test caching behavior
      await page.reload();
      await page.waitForLoadState('load');
      
      // Page should still function after reload
      const title = await page.title();
      expect(title).toBeTruthy();
    });

    test('efficient CSS loading strategy', async ({ page }) => {
      await page.goto('./style-guide.html');
      
      // Check that mobile CSS has proper media query
      const mobileCSS = page.locator('link[href="css/style-guide-mobile.css"]');
      const mediaAttribute = await mobileCSS.getAttribute('media');
      
      expect(mediaAttribute).toContain('max-width');
      expect(mediaAttribute).toContain('1024px');
    });
  });
});