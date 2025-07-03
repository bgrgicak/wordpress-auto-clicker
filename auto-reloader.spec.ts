import { test, expect, Page } from '@playwright/test';

// Configuration
const TARGET_URL = process.env.TARGET_URL || 'http://localhost:9400/wp-admin/';
const MAX_ITERATIONS = parseInt(process.env.MAX_ITERATIONS || '100');
const PAGE_TITLE_CONTAINS = process.env.PAGE_TITLE_CONTAINS || 'Dashboard';

// Custom test function - modify this to implement your specific test logic
async function customTest(page: Page) {
  // Wait for page to be fully loaded
  await page.waitForLoadState('networkidle');

  // Check if title contains expected text
  const title = await page.title();
  expect(title).toContain(PAGE_TITLE_CONTAINS);


  // expect an a tag with aria-label="Deactivate Free" to exist
  // const deactivateFree = await page.getByLabel('Deactivate Free');
  // expect(deactivateFree).toBeTruthy();

  // Add your custom test logic here
  console.log(`✓ Page loaded successfully.`);
}

test.describe('Auto-Reloader Tests', () => {
  test('should continuously test the target URL until failure', async ({ page }) => {
    console.log(`Starting auto-reloader for URL: ${TARGET_URL}`);
    console.log(`Max iterations: ${MAX_ITERATIONS}`);

    let iteration = 0;

    while (iteration < MAX_ITERATIONS) {
      iteration++;
      console.log(`\n--- Iteration ${iteration} ---`);

      try {
        // Navigate to the target URL
        await page.goto(TARGET_URL);

        // if presented with the wordpress login page, login with the credentials
        const loginPage = await page.url();
        if (loginPage.includes('wp-login.php')) {
          console.log('Login page detected, logging in...');
          await page.fill('input[name="log"]', process.env.WORDPRESS_USERNAME || 'admin');
          await page.fill('input[name="pwd"]', process.env.WORDPRESS_PASSWORD || 'password');
          await page.click('input[type="submit"]');
        }

        // Run the custom test, if the test fails, throw an error
        await customTest(page);

        console.log(`✓ Test passed on iteration ${iteration}`);

      } catch (error) {
        console.error(`✗ Test failed on iteration ${iteration}:`, error);
        throw error; // This will fail the test and stop execution
      }
    }

    console.log(`\nCompleted all ${MAX_ITERATIONS} iterations successfully!`);
  });
});