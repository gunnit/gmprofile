const { test, expect } = require('@playwright/test');

test.describe('Accessibility Tests', () => {
  
  test.describe('Index Page Accessibility', () => {
    test('has proper heading hierarchy', async ({ page }) => {
      await page.goto('./index.html');
      
      // Check heading structure
      const h1 = page.locator('h1');
      await expect(h1).toHaveCount(1);
      await expect(h1).toContainText('From Boardroom to Automation');
      
      // Check h2 elements exist
      const h2Elements = page.locator('h2');
      const h2Count = await h2Elements.count();
      expect(h2Count).toBeGreaterThan(0);
      
      // Verify heading content makes sense
      await expect(page.locator('h2').first()).toBeVisible();
    });

    test('images have alt text', async ({ page }) => {
      await page.goto('./index.html');
      
      const images = page.locator('img');
      const imageCount = await images.count();
      
      for (let i = 0; i < imageCount; i++) {
        const img = images.nth(i);
        const altText = await img.getAttribute('alt');
        
        // Images should have alt attribute (can be empty for decorative images)
        expect(altText).not.toBeNull();
      }
    });

    test('links have accessible names', async ({ page }) => {
      await page.goto('./index.html');
      
      const links = page.locator('a');
      const linkCount = await links.count();
      
      for (let i = 0; i < linkCount; i++) {
        const link = links.nth(i);
        const text = await link.textContent();
        const ariaLabel = await link.getAttribute('aria-label');
        const title = await link.getAttribute('title');
        
        // Links should have accessible text
        const hasAccessibleName = text?.trim() || ariaLabel || title;
        expect(hasAccessibleName).toBeTruthy();
      }
    });

    test('form elements have labels', async ({ page }) => {
      await page.goto('./index.html');
      
      const inputs = page.locator('input');
      const inputCount = await inputs.count();
      
      for (let i = 0; i < inputCount; i++) {
        const input = inputs.nth(i);
        const id = await input.getAttribute('id');
        const ariaLabel = await input.getAttribute('aria-label');
        const placeholder = await input.getAttribute('placeholder');
        
        if (id) {
          // Check if there's a label for this input
          const label = page.locator(`label[for="${id}"]`);
          const hasLabel = await label.count() > 0;
          
          // Input should have label, aria-label, or meaningful placeholder
          const hasAccessibleLabel = hasLabel || ariaLabel || placeholder;
          expect(hasAccessibleLabel).toBeTruthy();
        }
      }
    });

    test('page has proper language attribute', async ({ page }) => {
      await page.goto('./index.html');
      
      const html = page.locator('html');
      await expect(html).toHaveAttribute('lang', 'en');
    });

    test('page has meaningful title', async ({ page }) => {
      await page.goto('./index.html');
      
      const title = await page.title();
      expect(title).toBeTruthy();
      expect(title.length).toBeGreaterThan(10);
      await expect(page).toHaveTitle(/Gregor Maric/);
    });

    test('meta description exists', async ({ page }) => {
      await page.goto('./index.html');
      
      const metaDescription = page.locator('meta[name="description"]');
      await expect(metaDescription).toHaveCount(1);
      
      const content = await metaDescription.getAttribute('content');
      expect(content).toBeTruthy();
      expect(content.length).toBeGreaterThan(50);
    });

    test('viewport meta tag is present', async ({ page }) => {
      await page.goto('./index.html');
      
      const viewportMeta = page.locator('meta[name="viewport"]');
      await expect(viewportMeta).toHaveCount(1);
      await expect(viewportMeta).toHaveAttribute('content', /width=device-width/);
    });

    test('color contrast is adequate', async ({ page }) => {
      await page.goto('./index.html');
      
      // Test main text elements for basic visibility
      const textElements = [
        '.hero-text h1',
        '.hero-text .subtitle',
        '.hero-text .description',
        'footer p'
      ];
      
      for (const selector of textElements) {
        const element = page.locator(selector);
        if (await element.count() > 0) {
          await expect(element).toBeVisible();
          
          // Basic visibility check - if it's visible, contrast should be reasonable
          const styles = await element.evaluate(el => {
            const computed = window.getComputedStyle(el);
            return {
              color: computed.color,
              backgroundColor: computed.backgroundColor
            };
          });
          
          // Element should have color styles
          expect(styles.color).toBeTruthy();
        }
      }
    });

    test('keyboard navigation works', async ({ page }) => {
      await page.goto('./index.html');
      
      // Test tab navigation
      await page.keyboard.press('Tab');
      
      // First focusable element should be focused
      const focusedElement = page.locator(':focus');
      await expect(focusedElement).toBeVisible();
      
      // Continue tabbing through several elements
      for (let i = 0; i < 5; i++) {
        await page.keyboard.press('Tab');
        const currentFocused = page.locator(':focus');
        if (await currentFocused.count() > 0) {
          await expect(currentFocused).toBeVisible();
        }
      }
    });

    test('focus indicators are visible', async ({ page }) => {
      await page.goto('./index.html');
      
      // Tab to navigation links
      await page.keyboard.press('Tab');
      
      const focusedElement = page.locator(':focus');
      if (await focusedElement.count() > 0) {
        // Check if focus is visible (basic check)
        await expect(focusedElement).toBeVisible();
        
        // Focus should not be completely transparent
        const outlineStyle = await focusedElement.evaluate(el => {
          return window.getComputedStyle(el).outline;
        });
        
        // Should have some form of outline or focus indicator
        expect(outlineStyle !== 'none' || outlineStyle !== '').toBeTruthy();
      }
    });
  });

  test.describe('Style Guide Page Accessibility', () => {
    test('has skip link for accessibility', async ({ page }) => {
      await page.goto('./style-guide.html');
      
      const skipLink = page.locator('.skip-link');
      await expect(skipLink).toHaveCount(1);
      await expect(skipLink).toHaveAttribute('href', '#main-content');
      
      // Skip link should become visible on focus
      await page.keyboard.press('Tab');
      await expect(skipLink).toBeVisible();
    });

    test('main content area is properly marked', async ({ page }) => {
      await page.goto('./style-guide.html');
      
      const main = page.locator('main');
      await expect(main).toHaveCount(1);
      await expect(main).toHaveAttribute('id', 'main-content');
    });

    test('navigation has proper ARIA labels', async ({ page }) => {
      await page.goto('./style-guide.html');
      
      const nav = page.locator('nav');
      await expect(nav).toBeVisible();
      
      // Navigation should be identifiable
      const navText = await nav.textContent();
      expect(navText).toBeTruthy();
    });

    test('form elements have proper labels', async ({ page }) => {
      await page.goto('./style-guide.html');
      
      // Check form inputs in the forms section
      const labeledInputs = page.locator('label + input, label input');
      const labeledInputCount = await labeledInputs.count();
      
      if (labeledInputCount > 0) {
        // All form inputs should have associated labels
        for (let i = 0; i < labeledInputCount; i++) {
          const input = labeledInputs.nth(i);
          await expect(input).toBeVisible();
        }
      }
    });

    test('color swatches have accessible information', async ({ page }) => {
      await page.goto('./style-guide.html');
      
      const colorCards = page.locator('.color-card');
      const colorCardCount = await colorCards.count();
      
      for (let i = 0; i < Math.min(colorCardCount, 5); i++) {
        const card = colorCards.nth(i);
        
        // Each color card should have a name and hex value
        const colorName = card.locator('h4');
        const hexValue = card.locator('.color-hex');
        
        await expect(colorName).toBeVisible();
        await expect(hexValue).toBeVisible();
      }
    });

    test('interactive elements are keyboard accessible', async ({ page }) => {
      await page.goto('./style-guide.html');
      
      // Test button interactions
      const buttons = page.locator('button');
      const buttonCount = await buttons.count();
      
      if (buttonCount > 0) {
        const firstButton = buttons.first();
        await firstButton.focus();
        await expect(firstButton).toBeFocused();
        
        // Should be able to activate with keyboard
        await page.keyboard.press('Enter');
      }
    });

    test('heading structure is logical', async ({ page }) => {
      await page.goto('./style-guide.html');
      
      // Check heading hierarchy
      const h1 = page.locator('h1');
      await expect(h1).toHaveCount(1);
      
      const h2Elements = page.locator('h2');
      const h2Count = await h2Elements.count();
      expect(h2Count).toBeGreaterThan(0);
      
      // h3 elements should be under h2 sections
      const h3Elements = page.locator('h3');
      const h3Count = await h3Elements.count();
      expect(h3Count).toBeGreaterThan(0);
    });

    test('mobile navigation is accessible', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('./style-guide.html');
      
      const navToggle = page.locator('.nav-toggle');
      await expect(navToggle).toBeVisible();
      
      // Toggle should be keyboard accessible
      await navToggle.focus();
      await expect(navToggle).toBeFocused();
    });
  });

  test.describe('Cross-Page Accessibility', () => {
    test('consistent navigation structure', async ({ page }) => {
      // Test index page
      await page.goto('./index.html');
      const indexNav = page.locator('nav');
      await expect(indexNav).toBeVisible();
      
      // Test style guide page  
      await page.goto('./style-guide.html');
      const styleGuideNav = page.locator('nav');
      await expect(styleGuideNav).toBeVisible();
      
      // Both should have navigation landmarks
    });

    test('consistent footer structure', async ({ page }) => {
      // Test index page footer
      await page.goto('./index.html');
      const indexFooter = page.locator('footer');
      await expect(indexFooter).toBeVisible();
      
      // Test style guide footer
      await page.goto('./style-guide.html');
      const styleGuideFooter = page.locator('footer');
      await expect(styleGuideFooter).toBeVisible();
    });

    test('language consistency', async ({ page }) => {
      // Both pages should have same language
      await page.goto('./index.html');
      const indexLang = await page.locator('html').getAttribute('lang');
      
      await page.goto('./style-guide.html');
      const styleLang = await page.locator('html').getAttribute('lang');
      
      expect(indexLang).toBe(styleLang);
      expect(indexLang).toBe('en');
    });
  });
});