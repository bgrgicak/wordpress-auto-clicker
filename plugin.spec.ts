import { test, expect, Page } from '@playwright/test';

// Configuration
const TARGET_URL = process.env.TARGET_URL || 'http://localhost:9400/wp-admin/';
const MAX_ITERATIONS = parseInt(process.env.MAX_ITERATIONS || '100');
const PAGE_TITLE_CONTAINS = process.env.PAGE_TITLE_CONTAINS || 'Dashboard';
const PLUGIN_NAME = process.env.PLUGIN_NAME || 'Hello Dolly';

test.describe(`Plugin Tests`, () => {
  test(`should not deactivate the ${PLUGIN_NAME} plugin after reload`, async ({ page }) => {
    console.log(`Starting auto-reloader for URL: ${TARGET_URL}`);
    console.log(`Max iterations: ${MAX_ITERATIONS}`);


    // Navigate to the target URL
    await page.goto(TARGET_URL);

    // if presented with the wordpress login page, login with the credentials
    const loginPage = await page.url();
    if (loginPage.includes('wp-login.php')) {
      console.log('Login page detected, logging in...');
      await page.fill('input[name="log"]', process.env.WORDPRESS_USERNAME || 'admin');
      await page.fill('input[name="pwd"]', process.env.WORDPRESS_PASSWORD || 'password');
      await page.click('input[type="submit"]');
      // wait for the page to load
      await page.waitForLoadState('networkidle');
    }

    // Activate plugin if it is inactive
    const pluginFree = await page.locator(`a[aria-label="Activate ${PLUGIN_NAME}"]`);
    if (await pluginFree.isVisible()) {
      await pluginFree.click();
    }

    let iteration = 0;

    while (iteration < MAX_ITERATIONS) {
      iteration++;
      console.log(`\n--- Iteration ${iteration} ---`);

      // Navigate to the target URL
      await page.goto(TARGET_URL);

      // Check if title contains expected text
      const title = await page.title();
      expect(title).toContain(PAGE_TITLE_CONTAINS);

      // Ensure plugin is active
      const pluginDeactivate = await page.locator(`a[aria-label="Deactivate ${PLUGIN_NAME}"]`);
      expect(pluginDeactivate).toBeVisible();

      if (!(await pluginDeactivate.isVisible())) {
        throw new Error(`Plugin "${PLUGIN_NAME}" is not active - deactivate button not found`);
      }

      console.log(`✓ Test passed on iteration ${iteration}`);
    }

    console.log(`\nCompleted all ${MAX_ITERATIONS} iterations successfully!`);
  });
});