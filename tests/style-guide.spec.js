const { test, expect } = require('@playwright/test');

test.describe('Style Guide Page Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('./style-guide.html');
  });

  test('page loads successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/Gregor Maric - Brand Style Guide/);
  });

  test('navigation menu is functional', async ({ page }) => {
    const nav = page.locator('.navbar');
    await expect(nav).toBeVisible();
    
    // Check navigation links
    const navLinks = [
      'a[href="#overview"]',
      'a[href="#colors"]', 
      'a[href="#typography"]',
      'a[href="#components"]',
      'a[href="#forms"]',
      'a[href="#heroes"]',
      'a[href="#patterns"]'
    ];
    
    for (const linkSelector of navLinks) {
      await expect(page.locator(linkSelector)).toBeVisible();
    }
  });

  test('brand logo and navigation are visible', async ({ page }) => {
    await expect(page.locator('.logo')).toContainText('GM');
    await expect(page.locator('.brand-text')).toContainText('Style Guide');
  });

  test('hero section displays correctly', async ({ page }) => {
    await expect(page.locator('.hero-title')).toContainText('Brand Style Guide');
    await expect(page.locator('.hero-subtitle')).toContainText('Comprehensive design system');
    
    // Check hero stats
    const stats = page.locator('.hero-stats .stat');
    await expect(stats).toHaveCount(3);
  });

  test('brand overview section loads', async ({ page }) => {
    await expect(page.locator('.brand-overview')).toBeVisible();
    
    const brandCards = page.locator('.brand-card');
    await expect(brandCards).toHaveCount(3);
    
    // Check that each card has a heading
    await expect(brandCards.nth(0).locator('h3')).toContainText('Mission');
    await expect(brandCards.nth(1).locator('h3')).toContainText('Vision');
    await expect(brandCards.nth(2).locator('h3')).toContainText('Values');
  });

  test('color palette section displays all colors', async ({ page }) => {
    await expect(page.locator('#colors')).toBeVisible();
    
    // Check primary colors
    const primaryColors = page.locator('.color-section').first().locator('.color-card');
    await expect(primaryColors).toHaveCount(3);
    
    // Check that color swatches are visible
    await expect(page.locator('.color-swatch.primary-blue')).toBeVisible();
    await expect(page.locator('.color-swatch.primary-purple')).toBeVisible();
    await expect(page.locator('.color-swatch.primary-navy')).toBeVisible();
    
    // Check hex codes are displayed
    await expect(page.locator('.color-hex')).toHaveCount.greaterThan(0);
  });

  test('typography section shows font samples', async ({ page }) => {
    await expect(page.locator('#typography')).toBeVisible();
    
    // Check font weights
    const weightDemos = page.locator('.weight-demo');
    await expect(weightDemos).toHaveCount(9);
    
    // Check typography scale
    await expect(page.locator('.demo-h1')).toBeVisible();
    await expect(page.locator('.demo-h2')).toBeVisible();
    await expect(page.locator('.demo-body')).toBeVisible();
  });

  test('components section displays all UI elements', async ({ page }) => {
    await expect(page.locator('#components')).toBeVisible();
    
    // Check buttons
    await expect(page.locator('.btn.btn-primary')).toBeVisible();
    await expect(page.locator('.btn.btn-secondary')).toBeVisible();
    await expect(page.locator('.btn.btn-outline')).toBeVisible();
    await expect(page.locator('.btn.btn-ghost')).toBeVisible();
    
    // Check cards
    const cards = page.locator('.card-showcase .card');
    await expect(cards).toHaveCount(3);
    
    // Check badges
    await expect(page.locator('.badge')).toHaveCount.greaterThan(0);
    
    // Check alerts
    await expect(page.locator('.alert')).toHaveCount(4);
  });

  test('forms section shows all input types', async ({ page }) => {
    await expect(page.locator('#forms')).toBeVisible();
    
    // Check form inputs
    await expect(page.locator('input[type="text"]')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('select')).toBeVisible();
    await expect(page.locator('textarea')).toBeVisible();
    await expect(page.locator('input[type="checkbox"]')).toBeVisible();
    await expect(page.locator('input[type="radio"]')).toBeVisible();
    
    // Check newsletter form
    await expect(page.locator('.newsletter-form')).toBeVisible();
  });

  test('hero variations are displayed', async ({ page }) => {
    await expect(page.locator('#heroes')).toBeVisible();
    
    const heroVariants = page.locator('.hero-variant');
    await expect(heroVariants).toHaveCount(3);
    
    await expect(page.locator('.hero-gradient')).toBeVisible();
    await expect(page.locator('.hero-clean')).toBeVisible();
    await expect(page.locator('.hero-minimal')).toBeVisible();
  });

  test('design patterns section loads', async ({ page }) => {
    await expect(page.locator('#patterns')).toBeVisible();
    
    // Check grid demo
    const gridItems = page.locator('.grid-item');
    await expect(gridItems).toHaveCount(4);
    
    // Check spacing system
    await expect(page.locator('.spacing-demo')).toBeVisible();
    
    // Check border radius demos
    await expect(page.locator('.radius-demo')).toBeVisible();
    
    // Check shadow demos
    await expect(page.locator('.shadow-demo')).toBeVisible();
  });

  test('footer is present and functional', async ({ page }) => {
    await expect(page.locator('.footer')).toBeVisible();
    await expect(page.locator('.footer-brand .logo')).toContainText('GM');
    
    const footerLinks = page.locator('.footer-links a');
    await expect(footerLinks).toHaveCount.greaterThan(0);
    
    await expect(page.locator('.footer-bottom p')).toContainText('© 2025 Gregor Maric');
  });

  test('skip link for accessibility', async ({ page }) => {
    const skipLink = page.locator('.skip-link');
    await expect(skipLink).toBeHidden(); // Should be hidden by default
    
    // Test focus behavior
    await page.keyboard.press('Tab');
    await expect(skipLink).toBeVisible();
  });

  test('mobile navigation toggle exists', async ({ page }) => {
    const navToggle = page.locator('.nav-toggle');
    await expect(navToggle).toBeVisible();
    
    // Check toggle spans
    const toggleSpans = navToggle.locator('span');
    await expect(toggleSpans).toHaveCount(3);
  });

  test('interactive elements are clickable', async ({ page }) => {
    // Test button interactions
    const primaryBtn = page.locator('.btn.btn-primary').first();
    await expect(primaryBtn).toBeEnabled();
    
    // Test form elements
    const textInput = page.locator('input[type="text"]').first();
    await textInput.click();
    await textInput.fill('test');
    await expect(textInput).toHaveValue('test');
  });
});