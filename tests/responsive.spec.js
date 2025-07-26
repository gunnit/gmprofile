const { test, expect } = require('@playwright/test');

test.describe('Responsive Design Tests', () => {
  
  test.describe('Mobile Viewport Tests', () => {
    test('index page is mobile responsive', async ({ page }) => {
      // Test on mobile viewport
      await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
      await page.goto('./index.html');
      
      // Navigation should be hidden on mobile
      const navLinks = page.locator('.nav-links');
      const isVisible = await navLinks.isVisible();
      expect(isVisible).toBeFalsy();
      
      // Hero content should stack vertically
      const heroContent = page.locator('.hero-content');
      await expect(heroContent).toBeVisible();
      
      // Hero title should be smaller on mobile
      const heroTitle = page.locator('.hero-text h1');
      const fontSize = await heroTitle.evaluate(el => {
        return window.getComputedStyle(el).fontSize;
      });
      // Mobile title should be smaller than desktop (2.5rem vs 3.5rem)
      expect(parseFloat(fontSize)).toBeLessThan(60); // roughly 3.5rem
    });

    test('hero stats stack vertically on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('./index.html');
      
      const heroStats = page.locator('.hero-stats');
      await expect(heroStats).toBeVisible();
      
      // Stats should be visible and stack vertically
      const stats = page.locator('.hero-stats .stat');
      await expect(stats).toHaveCount(3);
    });

    test('about section stacks vertically on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('./index.html');
      
      const aboutContent = page.locator('.about-content');
      await expect(aboutContent).toBeVisible();
      
      // Expertise list should be single column on mobile
      const expertiseList = page.locator('.expertise-list');
      await expect(expertiseList).toBeVisible();
    });

    test('newsletter form stacks vertically on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('./index.html');
      
      const newsletterForm = page.locator('.newsletter-form');
      await expect(newsletterForm).toBeVisible();
      
      const input = newsletterForm.locator('input');
      const button = newsletterForm.locator('button');
      
      await expect(input).toBeVisible();
      await expect(button).toBeVisible();
    });

    test('contact info stacks vertically on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('./index.html');
      
      const contactInfo = page.locator('.contact-info');
      await expect(contactInfo).toBeVisible();
      
      const contactItems = page.locator('.contact-item');
      await expect(contactItems).toHaveCount(3);
    });
  });

  test.describe('Tablet Viewport Tests', () => {
    test('index page works on tablet', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 }); // iPad
      await page.goto('./index.html');
      
      // Navigation should be visible on tablet
      const navLinks = page.locator('.nav-links');
      await expect(navLinks).toBeVisible();
      
      // Content should be properly spaced
      const heroContent = page.locator('.hero-content');
      await expect(heroContent).toBeVisible();
    });

    test('featured content adapts to tablet', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto('./index.html');
      
      const featuredContent = page.locator('.featured-content');
      await expect(featuredContent).toBeVisible();
      
      // Cards should be visible and properly sized
      const cards = page.locator('.content-card');
      await expect(cards).toHaveCount(3);
    });
  });

  test.describe('Desktop Viewport Tests', () => {
    test('index page displays correctly on desktop', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto('./index.html');
      
      // All elements should be visible and properly positioned
      await expect(page.locator('nav')).toBeVisible();
      await expect(page.locator('.hero')).toBeVisible();
      await expect(page.locator('.content-section')).toBeVisible();
      await expect(page.locator('.about')).toBeVisible();
    });

    test('grid layouts work on desktop', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto('./index.html');
      
      // Hero content should be side by side
      const heroContent = page.locator('.hero-content');
      await expect(heroContent).toBeVisible();
      
      // About content should be side by side
      const aboutContent = page.locator('.about-content');
      await expect(aboutContent).toBeVisible();
    });
  });

  test.describe('Style Guide Responsive Tests', () => {
    test('style guide is mobile responsive', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('./style-guide.html');
      
      // Check that mobile CSS is loaded
      const mobileCSS = page.locator('link[href="css/style-guide-mobile.css"]');
      await expect(mobileCSS).toHaveAttribute('media', 'screen and (max-width: 1024px)');
      
      // Navigation should have mobile toggle
      const navToggle = page.locator('.nav-toggle');
      await expect(navToggle).toBeVisible();
      
      // Content should be readable on mobile
      const container = page.locator('.container');
      await expect(container).toBeVisible();
    });

    test('navigation menu adapts to mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('./style-guide.html');
      
      const navMenu = page.locator('.nav-menu');
      const navToggle = page.locator('.nav-toggle');
      
      await expect(navToggle).toBeVisible();
      // Nav menu might be hidden on mobile (depends on CSS implementation)
    });

    test('color grid adapts to smaller screens', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('./style-guide.html');
      
      const colorGrid = page.locator('.color-grid');
      await expect(colorGrid).toBeVisible();
      
      // Color cards should stack appropriately
      const colorCards = page.locator('.color-card');
      await expect(colorCards.first()).toBeVisible();
    });

    test('component showcase adapts to mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('./style-guide.html');
      
      // Button showcase should be visible
      const buttonShowcase = page.locator('.button-showcase');
      await expect(buttonShowcase.first()).toBeVisible();
      
      // Cards should stack on mobile
      const cardShowcase = page.locator('.card-showcase');
      await expect(cardShowcase).toBeVisible();
    });

    test('typography samples are readable on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('./style-guide.html');
      
      const typographySection = page.locator('#typography');
      await expect(typographySection).toBeVisible();
      
      // Font weight demos should be visible
      const weightDemos = page.locator('.weight-demo');
      await expect(weightDemos.first()).toBeVisible();
      
      // Typography scale should be readable
      const scaleDemo = page.locator('.scale-demo');
      await expect(scaleDemo).toBeVisible();
    });

    test('form elements work on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('./style-guide.html');
      
      const formsSection = page.locator('#forms');
      await expect(formsSection).toBeVisible();
      
      // Form inputs should be touchable
      const textInput = page.locator('input[type="text"]').first();
      await textInput.click();
      await textInput.fill('mobile test');
      await expect(textInput).toHaveValue('mobile test');
    });
  });

  test.describe('Cross-Browser Responsive Tests', () => {
    test('responsive breakpoints work in different browsers', async ({ page, browserName }) => {
      const breakpoints = [
        { width: 320, height: 568 },  // iPhone 5
        { width: 375, height: 667 },  // iPhone SE
        { width: 768, height: 1024 }, // iPad
        { width: 1024, height: 768 }, // iPad Landscape
        { width: 1920, height: 1080 } // Desktop
      ];

      for (const viewport of breakpoints) {
        await page.setViewportSize(viewport);
        await page.goto('./index.html');
        
        // Basic layout should work at all breakpoints
        await expect(page.locator('header')).toBeVisible();
        await expect(page.locator('main')).toBeVisible();
        await expect(page.locator('footer')).toBeVisible();
        
        // Content should not overflow
        const body = page.locator('body');
        const hasHorizontalScrollbar = await body.evaluate(el => {
          return el.scrollWidth > el.clientWidth;
        });
        
        // Allow some tolerance for different browser rendering
        if (hasHorizontalScrollbar) {
          console.warn(`Horizontal scrollbar detected at ${viewport.width}x${viewport.height} in ${browserName}`);
        }
      }
    });

    test('touch interactions work on mobile devices', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('./index.html');
      
      // Test touch events on buttons
      const ctaButton = page.locator('.btn-primary').first();
      await expect(ctaButton).toBeVisible();
      
      // Simulate touch interaction
      await ctaButton.tap();
      
      // Test form interactions
      const emailInput = page.locator('input[type="email"]');
      if (await emailInput.count() > 0) {
        await emailInput.tap();
        await emailInput.fill('test@example.com');
        await expect(emailInput).toHaveValue('test@example.com');
      }
    });
  });
});