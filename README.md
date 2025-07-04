# WordPress auto-clicker

A Playwright-based testing tool that continuously tests a target URL until failure occurs. Useful for stress testing, monitoring, and detecting intermittent issues.

## Features

- Continuously reloads and tests a target URL
- Configurable via environment variables
- WordPress login support
- Customizable page title validation
- Video recording on failure
- HTML test reports

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file with your configuration:
```env
TARGET_URL=http://localhost:9400/wp-admin/
MAX_ITERATIONS=100
PAGE_TITLE_CONTAINS=Dashboard
WORDPRESS_USERNAME=admin
WORDPRESS_PASSWORD=password
```

## Environment Variables

- `TARGET_URL` - URL to test (default: `http://localhost:9400/wp-admin/`)
- `MAX_ITERATIONS` - Maximum number of test iterations (default: `100`)
- `PAGE_TITLE_CONTAINS` - Text that should be present in page title (default: `Dashboard`)
- `WORDPRESS_USERNAME` - WordPress login username (default: `admin`)
- `WORDPRESS_PASSWORD` - WordPress login password (default: `password`)

## Running Tests

```bash
# Run the auto-reloader test
npx playwright test auto-reloader.spec.ts

# Run with custom environment variables
TARGET_URL=https://example.com MAX_ITERATIONS=50 npx playwright test auto-reloader.spec.ts
```

## Test Behavior

The test will:
1. Navigate to the target URL
2. Handle WordPress login if presented with login page
3. Wait for page to be fully loaded (networkidle state)
4. Validate that the page title contains the expected text
5. Repeat until failure or max iterations reached

## Customization

Modify the `customTest()` function in `auto-reloader.spec.ts` to implement your specific test logic.

## Reports

- HTML reports are generated in `playwright-report/`
- Videos are recorded on failure in `test-results/`
- Screenshots are taken on failure
