/**
 * E2E Test: Report Export Flow
 */
import { expect, test } from 'playwright/test';

const jsonResponse = (body) => ({
  status: 200,
  headers: {
    'content-type': 'application/json',
    'access-control-allow-origin': '*'
  },
  body: JSON.stringify(body)
});

const corsPreflight = {
  status: 204,
  headers: {
    'access-control-allow-origin': '*',
    'access-control-allow-methods': 'GET,POST,OPTIONS',
    'access-control-allow-headers': '*'
  }
};

const stats = (mean) => ({
  min: mean - 10,
  max: mean + 10,
  mean,
  std: 3.2,
  p10: mean - 7,
  p50: mean,
  p90: mean + 7
});

const mockReportApis = async (page) => {
  await page.route('**/seams/list*', async (route) => {
    await route.fulfill(jsonResponse({
      seams: [
        { name: '15-1上煤' },
        { name: '16-1煤' }
      ]
    }));
  });

  await page.route('**/summary/index*', async (route) => {
    await route.fulfill(jsonResponse({ grid: stats(55) }));
  });

  await page.route('**/summary/index-workfaces*', async (route) => {
    await route.fulfill(jsonResponse({ grid: stats(58) }));
  });

  await page.route('**/summary/steps?*', async (route) => {
    await route.fulfill(jsonResponse({ grid: stats(52) }));
  });

  await page.route('**/summary/steps-workfaces*', async (route) => {
    await route.fulfill(jsonResponse({ grid: stats(49) }));
  });

  await page.route('**/seams/overburden*', async (route) => {
    const url = new URL(route.request().url());
    const seamName = url.searchParams.get('seam_name') || '15-1上煤';
    await route.fulfill(jsonResponse({
      boreholes: [
        {
          name: 'ZK01',
          x: 100,
          y: 200,
          seam_top_depth: 300,
          layers: [
            { name: seamName, thickness: 3.2 },
            { name: '砂岩', thickness: 12.5 }
          ]
        },
        {
          name: 'ZK02',
          x: 140,
          y: 240,
          seam_top_depth: 315,
          layers: [
            { name: seamName, thickness: 3.5 },
            { name: '砂岩', thickness: 11.0 }
          ]
        }
      ]
    }));
  });

  await page.route('**/api/rock-params/query*', async (route) => {
    await route.fulfill(jsonResponse({
      lithology: '砂岩',
      density: 2.4,
      elastic_modulus: 12.8,
      tensile_strength: 1.3
    }));
  });

  await page.route('**/api/mpi/batch*', async (route) => {
    if (route.request().method() === 'OPTIONS') {
      await route.fulfill(corsPreflight);
      return;
    }

    await route.fulfill(jsonResponse({
      results: [
        { id: 'ZK01', mpi: 61.2, breakdown: { rsi: 60.1, bri: 63.4, asi: 60.0 } },
        { id: 'ZK02', mpi: 57.8, breakdown: { rsi: 58.4, bri: 56.8, asi: 58.2 } }
      ],
      summary: {
        min: 57.8,
        max: 61.2,
        mean: 59.5,
        std: 1.7
      }
    }));
  });
};

const openReportPage = async (page) => {
  await mockReportApis(page);
  await page.goto('/report');

  await expect(page.locator('.report-page')).toBeVisible();
  await expect(page.locator('.hero')).toBeVisible();
  await expect(page.locator('.status-chip.ready')).toBeVisible({ timeout: 20_000 });
  await expect(page.locator('.cards-grid .metric-card')).toHaveCount(4);
};

test.describe('报告导出流程', () => {
  test('用户可以导出报告文件', async ({ page }) => {
    await openReportPage(page);

    const exportButton = page.locator('.hero-actions .btn.secondary').first();
    await expect(exportButton).toBeEnabled();

    const downloadPromise = page.waitForEvent('download');
    await exportButton.click();
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toMatch(/^pressure_report_\d{4}-\d{2}-\d{2}\.csv$/);
  });

  test('用户可以自定义报告内容并刷新', async ({ page }) => {
    await openReportPage(page);

    const seamSelect = page.locator('.controls select').first();
    const targetValue = await seamSelect.locator('option').nth(1).getAttribute('value');
    await seamSelect.selectOption(targetValue || '16-1煤');

    await expect(seamSelect).toHaveValue(targetValue || '16-1煤');
    await expect(page.locator('.status-chip.ready')).toBeVisible({ timeout: 20_000 });

    await page.locator('.hero-actions .btn.primary').click();
    await expect(page.locator('.status-chip.ready')).toBeVisible({ timeout: 20_000 });

    await expect(page.locator('.mpi-stats .stat-item')).toHaveCount(7);
    await expect(page.locator('.table-wrap tbody tr')).toHaveCount(4);
  });

  test('报告包含必要统计数据与章节内容', async ({ page }) => {
    await openReportPage(page);

    await expect(page.locator('.cards-grid .metric-card')).toHaveCount(4);
    await expect(page.locator('.mpi-layout')).toBeVisible();
    await expect(page.locator('.mpi-extremes article')).toHaveCount(2);
    await expect(page.locator('.geomodel-quality-grid')).toHaveCount(0);
    await expect(page.locator('.table-wrap')).toBeVisible();
    await expect(page.locator('.table-wrap tbody tr')).toHaveCount(4);

    const columnCount = await page.locator('.table-wrap thead th').count();
    expect(columnCount).toBeGreaterThanOrEqual(8);
  });
});
