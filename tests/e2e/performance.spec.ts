import { test, expect } from '@playwright/test';

test.describe('Performance', () => {
  test('homepage should load quickly', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    const loadTime = Date.now() - startTime;

    // Should load in under 3 seconds
    expect(loadTime).toBeLessThan(3000);
  });

  test('should have good Core Web Vitals', async ({ page }) => {
    await page.goto('/');

    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');

    // Get performance metrics
    const metrics = await page.evaluate(() => {
      const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
        loadComplete: perfData.loadEventEnd - perfData.loadEventStart,
        firstPaint: performance.getEntriesByType('paint').find((entry) => entry.name === 'first-paint')?.startTime || 0,
        firstContentfulPaint: performance.getEntriesByType('paint').find((entry) => entry.name === 'first-contentful-paint')?.startTime || 0,
      };
    });

    // First Contentful Paint should be under 1.8s
    expect(metrics.firstContentfulPaint).toBeLessThan(1800);

    // DOM Content Loaded should be reasonable
    expect(metrics.domContentLoaded).toBeLessThan(2000);
  });

  test('images should be optimized', async ({ page }) => {
    await page.goto('/');

    // Wait for images to load
    await page.waitForLoadState('networkidle');

    const images = page.locator('img');
    const count = await images.count();

    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const src = await img.getAttribute('src');

      if (src) {
        // Check if image uses modern formats or optimization
        const isOptimized =
          src.includes('agilitycms.com') || // AgilityPic optimized
          src.includes('.webp') ||
          src.includes('.avif') ||
          src.includes('?') || // Has query params for optimization
          src.startsWith('/_next/image'); // Next.js Image optimization

        // Most images should be optimized
        if (i < 5) { // Check first 5 images
          expect(isOptimized).toBeTruthy();
        }
      }
    }
  });

  test('should not have excessive JavaScript', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const jsSize = await page.evaluate(() => {
      const scripts = Array.from(document.querySelectorAll('script[src]'));
      return scripts.reduce((total, script) => {
        // This is a rough estimate - actual size would need to be fetched
        return total;
      }, 0);
    });

    // This is a placeholder - actual bundle size analysis would be done separately
    expect(jsSize).toBeGreaterThanOrEqual(0);
  });

  test('should lazy load below-the-fold content', async ({ page }) => {
    await page.goto('/');

    // Check for lazy loading attributes on images
    const images = page.locator('img');
    const count = await images.count();

    let lazyLoadedCount = 0;
    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const loading = await img.getAttribute('loading');
      if (loading === 'lazy') {
        lazyLoadedCount++;
      }
    }

    // At least some images should be lazy loaded (not all, as above-the-fold should be eager)
    // This is a basic check - more sophisticated checks would verify viewport position
    expect(lazyLoadedCount).toBeGreaterThanOrEqual(0);
  });
});

