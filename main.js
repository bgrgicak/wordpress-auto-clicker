const { chromium } = require('playwright');
const path = require('path');

async function runTest(page) {
    try {
        const testModule = require('./tests/your-test.spec.js');
        await testModule.runTest(page);
        return true;
    } catch (error) {
        console.error('Test failed:', error.message);
        return false;
    }
}

async function main() {
    const url = process.argv[2];
    
    if (!url) {
        console.error('Usage: node main.js <URL>');
        process.exit(1);
    }
    
    console.log(`Starting auto-reloader for URL: ${url}`);
    
    let iteration = 0;
    
    while (true) {
        iteration++;
        console.log(`\nIteration ${iteration}: Testing ${url}`);
        
        const browser = await chromium.launch({ headless: false });
        const page = await browser.newPage();
        
        try {
            await page.goto(url);
            
            const testPassed = await runTest(page);
            
            if (testPassed) {
                console.log(`✓ Test passed on iteration ${iteration}`);
            } else {
                console.log(`✗ Test failed on iteration ${iteration}`);
                console.log('Stopping auto-reloader...');
                break;
            }
            
        } catch (error) {
            console.error(`Navigation error on iteration ${iteration}:`, error.message);
            console.log('Stopping auto-reloader...');
            break;
        } finally {
            await browser.close();
        }
        
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
}

main().catch(console.error);