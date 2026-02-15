import { chromium } from 'playwright';

async function verifyFix() {
  const browser = await chromium.launch({
    headless: false,
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
  });

  const page = await context.newPage();

  console.log('🔍 检查科研工作台页面...\n');

  // 访问页面
  await page.goto('http://localhost:5173/research-workbench', {
    waitUntil: 'networkidle'
  });

  // 等待 Vue 应用加载
  await page.waitForTimeout(3000);

  // 检查页面标题
  const title = await page.title();
  console.log(`页面标题: ${title}`);

  // 检查是否有内容
  const bodyText = await page.locator('body').textContent();
  const hasContent = bodyText && bodyText.length > 100;
  console.log(`页面有内容: ${hasContent ? '✅ 是' : '❌ 否'}`);
  console.log(`内容长度: ${bodyText?.length || 0} 字符`);

  // 检查是否有错误
  const errors = [];
  page.on('pageerror', error => {
    errors.push(error.message);
  });

  // 截图
  await page.screenshot({ path: 'verify-fixed.png', fullPage: true });
  console.log('\n✅ 截图保存: verify-fixed.png');

  if (errors.length > 0) {
    console.log('\n❌ 控制台错误:');
    errors.forEach(err => console.log(`  - ${err}`));
  } else {
    console.log('\n✅ 无控制台错误');
  }

  console.log('\n⏳ 保持浏览器打开 20 秒供检查...\n');
  await page.waitForTimeout(20000);

  await browser.close();
  console.log('\n✨ 验证完成！');
}

verifyFix().catch(console.error);
