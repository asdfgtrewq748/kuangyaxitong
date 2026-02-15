import { chromium } from 'playwright';

async function inspectPage() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  console.log('🔍 加载地质建模页面...\n');
  await page.goto('http://localhost:5173/geomodel-visualization', {
    waitUntil: 'networkidle'
  });

  await page.waitForTimeout(3000);

  // 获取页面标题
  const title = await page.title();
  console.log(`页面标题: ${title}\n`);

  // 检查所有 h1 元素
  const h1Texts = await page.locator('h1').allTextContents();
  console.log(`H1 标题: ${h1Texts.join(', ')}\n`);

  // 检查是否有 Toolbar 组件
  const toolbarHTML = await page.locator('.toolbar, .page-header, header').first().innerHTML().catch(() => 'Not found');
  console.log('Toolbar HTML 片段:', toolbarHTML.substring(0, 200), '...\n');

  // 检查卡片元素
  const cards = await page.locator('.card, .stat-card').count();
  console.log(`卡片元素数量: ${cards}\n`);

  // 检查表格
  const tables = await page.locator('table').count();
  console.log(`表格数量: ${tables}\n`);

  // 截图
  await page.screenshot({ path: 'inspect-geomodel.png', fullPage: true });
  console.log('✅ 截图保存: inspect-geomodel.png\n');

  // 测试科研工作台
  console.log('🔍 加载科研工作台...\n');
  await page.goto('http://localhost:5173/research-workbench', {
    waitUntil: 'networkidle'
  });

  await page.waitForTimeout(3000);

  const researchTitle = await page.title();
  console.log(`页面标题: ${researchTitle}\n`);

  const researchH1 = await page.locator('h1').first().textContent();
  console.log(`主标题: ${researchH1}\n`);

  await page.screenshot({ path: 'inspect-research.png', fullPage: true });
  console.log('✅ 截图保存: inspect-research.png\n');

  console.log('⏳ 保持浏览器打开 20 秒...\n');
  await page.waitForTimeout(20000);

  await browser.close();
  console.log('✨ 检查完成！');
}

inspectPage().catch(console.error);
