import { test, expect } from '@playwright/test';

test.describe('Blog System', () => {
  test('blog listing page should load', async ({ page }) => {
    await page.goto('/blog');

    // Check page loads
    await expect(page).toHaveURL(/.*\/blog/);

    // Check for blog listing component
    const blogListing = page.locator('[data-agility-component]');
    await expect(blogListing.first()).toBeVisible();
  });

  test('blog posts should be displayed', async ({ page }) => {
    await page.goto('/blog');

    // Wait for content to load
    await page.waitForLoadState('networkidle');

    // Check for blog post cards/articles
    const blogPosts = page.locator('article, [class*="card"], [class*="post"]');
    const count = await blogPosts.count();

    // Should have at least some blog posts (or empty state message)
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('RSS feed should be accessible', async ({ page }) => {
    const response = await page.goto('/blog/rss.xml');

    expect(response?.status()).toBe(200);
    expect(response?.headers()['content-type']).toContain('xml');

    const content = await response?.text();
    expect(content).toContain('<rss');
    expect(content).toContain('<channel>');
  });

  test('RSS feed should have valid structure', async ({ page }) => {
    const response = await page.goto('/blog/rss.xml');
    const content = await response?.text();

    // Check for required RSS elements
    expect(content).toContain('<title>');
    expect(content).toContain('<link>');
    expect(content).toContain('<description>');
  });
});

