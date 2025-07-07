# WordPress Plugin Auto-Tester

A Playwright-based testing tool that continuously run stress tests, and detect intermittent issues.

## Features

- Continuously reloads and tests a target URL
- Configurable via environment variables
- WordPress login support
- Plugin activation/deactivation testing
- Customizable page title validation
- Trace recording on first retry

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
PLUGIN_NAME=Hello Dolly
WORDPRESS_USERNAME=admin
WORDPRESS_PASSWORD=password
```

## Environment Variables

- `TARGET_URL` - URL to test (default: `http://localhost:9400/wp-admin/`)
- `MAX_ITERATIONS` - Maximum number of test iterations (default: `100`)
- `PAGE_TITLE_CONTAINS` - Text that should be present in page title (default: `Dashboard`)
- `PLUGIN_NAME` - Name of the WordPress plugin to test (default: `Hello Dolly`)
- `WORDPRESS_USERNAME` - WordPress login username (default: `admin`)
- `WORDPRESS_PASSWORD` - WordPress login password (default: `password`)

## Running Tests

```bash
# Run the plugin test
npx playwright test plugin.spec.ts

# Run with custom environment variables
TARGET_URL=https://example.com MAX_ITERATIONS=50 npx playwright test plugin.spec.ts
```

## Test Behavior

The test will:
1. Navigate to the target URL
2. Handle WordPress login if presented with login page
3. Wait for page to be fully loaded (networkidle state)
4. Activate the plugin if it's inactive
5. For each iteration:
   - Navigate to the target URL
   - Validate that the page title contains the expected text
   - Ensure the plugin is active (deactivate button is visible)
   - Throw error if plugin is not active
6. Repeat until failure or max iterations reached

## Reports

- Trace recordings are generated on first retry in `test-results/`
