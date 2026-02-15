import { chromium } from 'playwright';

async function testOptimizedPages() {
  const browser = await chromium.launch({
    headless: false,
    slowMo: 500, // 慢速以便观察
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
  });

  const page = await context.newPage();

  console.log('📸 测试地质建模可视化页面...');
  await page.goto('http://localhost:5173/geomodel-visualization', {
    waitUntil: 'networkidle'
  });
  await page.screenshot({ path: 'test-geomodel.png', fullPage: true });
  console.log('✅ 地质建模页面截图已保存: test-geomodel.png');

  // 检查组件是否正确渲染
  const toolbarExists = await page.locator('.toolbar').count();
  const statCardsExist = await page.locator('.stat-card').count();
  const sidePanelExists = await page.locator('.side-panel').count();

  console.log(`📊 组件检查结果:`);
  console.log(`  - Toolbar: ${toolbarExists > 0 ? '✅' : '❌'}`);
  console.log(`  - StatCards: ${statCardsExist} 个`);
  console.log(`  - SidePanel: ${sidePanelExists > 0 ? '✅' : '❌'}`);

  console.log('\n📸 测试科研工作台页面...');
  await page.goto('http://localhost:5173/research-workbench', {
    waitUntil: 'networkidle'
  });
  await page.screenshot({ path: 'test-research.png', fullPage: true });
  console.log('✅ 科研工作台截图已保存: test-research.png');

  const researchToolbar = await page.locator('.toolbar').count();
  const researchStatCards = await page.locator('.stat-card').count();

  console.log(`📊 科研工作台组件检查:`);
  console.log(`  - Toolbar: ${researchToolbar > 0 ? '✅' : '❌'}`);
  console.log(`  - StatCards: ${researchStatCards} 个`);

  console.log('\n📸 测试 MPI 热力图页面...');
  await page.goto('http://localhost:5173/mpi-heatmap-pro', {
    waitUntil: 'networkidle'
  });
  await page.screenshot({ path: 'test-mpi.png', fullPage: true });
  console.log('✅ MPI 热力图截图已保存: test-mpi.png');

  console.log('\n⏳ 保持浏览器打开 10 秒供手动检查...');
  await page.waitForTimeout(10000);

  await browser.close();
  console.log('\n✨ 测试完成！');
}

testOptimizedPages().catch(console.error);
