import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load and display correctly', async ({ page }) => {
    await page.goto('/');

    // Check page title
    await expect(page).toHaveTitle(/Joel Varty/i);

    // Check header is visible
    const header = page.locator('header');
    await expect(header).toBeVisible();

    // Check navigation links
    const navLinks = ['About', 'Blog', 'Career', 'Uses'];
    for (const link of navLinks) {
      await expect(page.getByRole('link', { name: link })).toBeVisible();
    }

    // Check footer is visible
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
  });

  test('should have working navigation', async ({ page }) => {
    await page.goto('/');

    // Test navigation links
    await page.getByRole('link', { name: 'Blog' }).click();
    await expect(page).toHaveURL(/.*\/blog/);

    await page.goto('/');
    await page.getByRole('link', { name: 'About' }).click();
    await expect(page).toHaveURL(/.*\/about/);
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
    await page.goto('/');

    // Mobile menu button should be visible
    const mobileMenuButton = page.locator('button[aria-label*="menu" i], button[aria-label*="Menu" i]');
    await expect(mobileMenuButton).toBeVisible();
  });

  test('should support dark mode toggle', async ({ page }) => {
    await page.goto('/');

    // Find and click theme toggle
    const themeToggle = page.locator('button[aria-label*="theme" i], button[aria-label*="Theme" i]');
    if (await themeToggle.isVisible()) {
      await themeToggle.click();

      // Check that dark mode class is applied
      const html = page.locator('html');
      const hasDarkClass = await html.evaluate((el) => el.classList.contains('dark'));
      expect(hasDarkClass).toBeTruthy();
    }
  });
});

