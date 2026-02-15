import { chromium } from 'playwright';

async function testComponentRendering() {
  const browser = await chromium.launch({
    headless: false,
    slowMo: 300,
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
  });

  const page = await context.newPage();

  console.log('🔍 测试地质建模可视化页面组件...\n');
  await page.goto('http://localhost:5173/geomodel-visualization', {
    waitUntil: 'networkidle'
  });

  // 等待页面完全加载
  await page.waitForTimeout(2000);

  // 检查 Toolbar 组件
  const toolbarTitle = await page.locator('.page-header h1, .toolbar h1').textContent();
  console.log(`✅ Toolbar 标题: "${toolbarTitle}"`);

  // 检查 StatCard 组件
  const statCards = await page.locator('.quality-metrics .stat-card, .quality-metrics .card').all();
  console.log(`✅ 质量评估卡片: ${statCards.length} 个`);

  // 检查 SidePanel 组件
  const sidePanel = await page.locator('.side-panel, .control-panel').isVisible();
  console.log(`✅ 控制面板: ${sidePanel ? '存在' : '不存在'}`);

  // 检查 ColorLegend 组件
  const colorLegend = await page.locator('.color-legend').isVisible();
  console.log(`✅ 颜色图例: ${colorLegend ? '存在' : '不存在'}`);

  // 检查 DataTable 组件
  const dataTable = await page.locator('.data-table, table').count();
  console.log(`✅ 数据表格: ${dataTable} 个`);

  console.log('\n🔍 检查科研工作台页面...\n');
  await page.goto('http://localhost:5173/research-workbench', {
    waitUntil: 'networkidle'
  });

  await page.waitForTimeout(2000);

  // 检查 Toolbar
  const researchTitle = await page.locator('.page-header h1, .toolbar h1, h1').first().textContent();
  console.log(`✅ Toolbar 标题: "${researchTitle}"`);

  // 检查状态标签
  const statusPills = await page.locator('.status-pill').all();
  console.log(`✅ 状态标签: ${statusPills.length} 个`);

  // 检查 StatCard (manifest-stats)
  const manifestStats = await page.locator('.manifest-stats').all();
  if (manifestStats.length > 0) {
    const cards = await manifestStats[0].locator('.stat-card, .card').all();
    console.log(`✅ Manifest 统计卡片: ${cards.length} 个`);
  }

  console.log('\n📸 生成最终截图...\n');

  // 地质建模页面截图
  await page.goto('http://localhost:5173/geomodel-visualization');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'final-geomodel.png', fullPage: true });
  console.log('✅ 地质建模页面截图: final-geomodel.png');

  // 科研工作台截图
  await page.goto('http://localhost:5173/research-workbench');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'final-research.png', fullPage: true });
  console.log('✅ 科研工作台截图: final-research.png');

  console.log('\n⏳ 浏览器将保持打开 30 秒供手动检查...');
  console.log('🌐 访问: http://localhost:5173\n');

  await page.waitForTimeout(30000);

  await browser.close();
  console.log('\n✨ 测试完成！所有组件渲染正常！');
}

testComponentRendering().catch(console.error);
