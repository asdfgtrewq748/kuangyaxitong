
import { chromium } from 'playwright';

async function testPage() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
  });
  const page = await context.newPage();

  console.log('Testing page: research');
  console.log('URL: http://localhost:5173/research-workbench');

  const errors = [];
  page.on('pageerror', (error) => {
    errors.push(error.message);
  });

  try {
    // Navigate to page
    await page.goto('http://localhost:5173/research-workbench', { waitUntil: 'networkidle', timeout: 10000 });

    // Wait for page to load
    await page.waitForTimeout(2000);

    // Check if main selector exists
    const mainElement = await page.$('.workspace');
    if (!mainElement) {
      errors.push('Main element not found: .workspace');
    }

    // Check for content
    const bodyText = await page.locator('body').textContent();
    const hasContent = bodyText && bodyText.length > 100;

    // Take screenshot
    await page.screenshot({ path: 'test_artifacts/screenshots/research_20260216_104434.png', fullPage: true });

    // Get page title
    const title = await page.title();

    await browser.close();

    // Return result
    const result = {
      page: 'research',
      url: 'http://localhost:5173/research-workbench',
      title: title,
      passed: errors.length === 0 && hasContent,
      hasContent: hasContent,
      contentLength: bodyText ? bodyText.length : 0,
      errors: errors,
      screenshot: 'test_artifacts/screenshots/research_20260216_104434.png',
      timestamp: new Date().toISOString()
    };

    console.log('RESULT:' + JSON.stringify(result));
  } catch (error) {
    await browser.close();
    const result = {
      page: 'research',
      passed: false,
      errors: [error.message],
      screenshot: null
    };
    console.log('RESULT:' + JSON.stringify(result));
  }
}

testPage().catch(console.error);
