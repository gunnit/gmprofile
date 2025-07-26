const { test, expect } = require('@playwright/test');

test.describe('Index Page Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('./index.html');
  });

  test('page loads successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/Gregor Maric - Automation & AI Strategy Expert/);
  });

  test('has correct meta description', async ({ page }) => {
    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute('content', /Practical automation and AI expertise/);
  });

  test('navigation menu is visible', async ({ page }) => {
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
    
    // Check navigation links
    await expect(page.locator('a[href="#home"]')).toBeVisible();
    await expect(page.locator('a[href="#content"]')).toBeVisible();
    await expect(page.locator('a[href="#about"]')).toBeVisible();
    await expect(page.locator('a[href="#contact"]')).toBeVisible();
  });

  test('hero section content is visible', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('From Boardroom to Automation');
    await expect(page.locator('.subtitle')).toContainText('Bridging Strategy & Implementation');
    await expect(page.locator('.description')).toBeVisible();
  });

  test('CTA buttons are functional', async ({ page }) => {
    const watchTutorialsBtn = page.locator('a[href="https://www.youtube.com/c/RPAChampion"]');
    const getInsightsBtn = page.locator('a[href="#newsletter"]');
    
    await expect(watchTutorialsBtn).toBeVisible();
    await expect(getInsightsBtn).toBeVisible();
    
    // Test that buttons have correct attributes
    await expect(watchTutorialsBtn).toHaveAttribute('target', '_blank');
  });

  test('hero stats are displayed', async ({ page }) => {
    const stats = page.locator('.hero-stats .stat');
    await expect(stats).toHaveCount(3);
    
    await expect(page.locator('.stat-number')).toHaveCount(3);
    await expect(page.locator('.stat-label')).toHaveCount(3);
  });

  test('featured content section loads', async ({ page }) => {
    await expect(page.locator('#content')).toBeVisible();
    await expect(page.locator('.featured-content .content-card')).toHaveCount(3);
    
    // Check each content card has required elements
    const cards = page.locator('.content-card');
    for (let i = 0; i < 3; i++) {
      await expect(cards.nth(i).locator('h3')).toBeVisible();
      await expect(cards.nth(i).locator('p')).toBeVisible();
      await expect(cards.nth(i).locator('.content-link')).toBeVisible();
    }
  });

  test('newsletter section is functional', async ({ page }) => {
    await expect(page.locator('#newsletter')).toBeVisible();
    await expect(page.locator('.newsletter-form input[type="email"]')).toBeVisible();
    await expect(page.locator('.newsletter-form button[type="submit"]')).toBeVisible();
    
    // Test form validation
    const emailInput = page.locator('.newsletter-form input[type="email"]');
    await expect(emailInput).toHaveAttribute('required');
  });

  test('about section displays expertise', async ({ page }) => {
    await expect(page.locator('#about')).toBeVisible();
    await expect(page.locator('.about-text h2')).toContainText('Strategy Meets Implementation');
    
    const expertiseItems = page.locator('.expertise-item');
    await expect(expertiseItems).toHaveCount(6);
  });

  test('contact section has correct links', async ({ page }) => {
    await expect(page.locator('#contact')).toBeVisible();
    
    const calendlyLink = page.locator('a[href="https://calendly.com/maric-gregor/15min"]');
    const emailLink = page.locator('a[href="mailto:gregor@pugliai.com"]');
    const linkedinLink = page.locator('a[href="https://www.linkedin.com/in/maricgregor"]');
    
    await expect(calendlyLink).toBeVisible();
    await expect(emailLink).toBeVisible();
    await expect(linkedinLink).toBeVisible();
  });

  test('footer contains all links', async ({ page }) => {
    const footerLinks = page.locator('footer .footer-links a');
    await expect(footerLinks).toHaveCount(6);
    
    // Check copyright text
    await expect(page.locator('footer p')).toContainText('© 2025 Gregor Maric');
  });

  test('smooth scrolling navigation works', async ({ page }) => {
    // Click on navigation link and verify scroll behavior
    await page.click('a[href="#about"]');
    
    // Wait for scroll animation
    await page.waitForTimeout(1000);
    
    // Check that we're near the about section
    const aboutSection = page.locator('#about');
    await expect(aboutSection).toBeInViewport();
  });

  test('external links open in new tabs', async ({ page }) => {
    const externalLinks = [
      'a[href="https://www.youtube.com/c/RPAChampion"]',
      'a[href="https://www.linkedin.com/learning/learning-power-automate-desktop-for-non-developers"]',
      'a[href="https://pugliai.com/"]'
    ];
    
    for (const linkSelector of externalLinks) {
      const link = page.locator(linkSelector);
      if (await link.count() > 0) {
        await expect(link).toHaveAttribute('target', '_blank');
      }
    }
  });
});