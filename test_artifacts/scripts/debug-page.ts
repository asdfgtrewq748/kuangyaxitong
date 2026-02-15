import { chromium } from 'playwright';

async function debugPage() {
  const browser = await chromium.launch({
    headless: false,
    slowMo: 1000,
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
  });

  const page = await context.newPage();

  // 监听控制台消息
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('❌ Console Error:', msg.text());
    }
  });

  // 监听页面错误
  page.on('pageerror', error => {
    console.log('❌ Page Error:', error.message);
  });

  console.log('🔍 加载科研工作台页面...\n');
  await page.goto('http://localhost:5173/research-workbench', {
    waitUntil: 'networkidle'
  });

  // 等待并检查页面内容
  await page.waitForTimeout(5000);

  // 检查页面 HTML
  const bodyHTML = await page.locator('body').innerHTML();
  console.log('页面 HTML 长度:', bodyHTML.length);

  // 检查是否有 Toolbar
  const toolbarCount = await page.locator('toolbar, .toolbar, [class*="toolbar"]').count();
  console.log(`Toolbar 元素数量: ${toolbarCount}`);

  // 检查是否有 StatCard
  const statCardCount = await page.locator('statcard, .stat-card, [class*="stat-card"]').count();
  console.log(`StatCard 元素数量: ${statCardCount}`);

  // 获取所有 Vue 组件
  const vueComponents = await page.locator('[data-v-]').count();
  console.log(`Vue 组件数量: ${vueComponents}`);

  // 检查页面是否真的空白
  const hasContent = await page.evaluate(() => {
    return document.body.children.length > 0;
  });
  console.log(`页面有子元素: ${hasContent}`);

  // 截图
  await page.screenshot({ path: 'debug-blank.png', fullPage: true });
  console.log('\n✅ 截图保存: debug-blank.png');

  console.log('\n⏳ 保持浏览器打开 30 秒供检查...\n');
  await page.waitForTimeout(30000);

  await browser.close();
}

debugPage().catch(console.error);
