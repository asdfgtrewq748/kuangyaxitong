/**
 * E2E Test: Simulation Flow
 */
import { expect, test } from 'playwright/test';

const openSimulationPage = async (page) => {
  await page.goto('/mpi-heatmap-pro');
  await expect(page.locator('.stage-container')).toBeVisible();
  await expect(page.locator('.playback-bar')).toBeVisible();
  await expect(page.locator('.progress-slider')).toBeVisible();
  await expect(page.locator('canvas.layer-bg')).toBeVisible();
  await expect(page.locator('.loading-overlay')).toHaveCount(0, { timeout: 30_000 });
};

const getProgress = async (page) => Number(await page.locator('.progress-slider').inputValue());

const setProgress = async (page, target) => {
  await page.locator('.progress-slider').evaluate((node, value) => {
    node.value = String(value);
    node.dispatchEvent(new Event('input', { bubbles: true }));
    node.dispatchEvent(new Event('change', { bubbles: true }));
  }, target);
};

test.describe('模拟预测流程', () => {
  test('用户可以启动模拟预测', async ({ page }) => {
    await openSimulationPage(page);

    const playButton = page.locator('.play-btn-mini');
    const start = await getProgress(page);

    await playButton.click();
    await expect(playButton).toHaveClass(/playing/);

    await page.waitForFunction(
      ([selector, baseline]) => {
        const slider = document.querySelector(selector);
        if (!slider) return false;
        return Number(slider.value) > baseline + 0.5;
      },
      ['.progress-slider', start],
      { timeout: 12_000 }
    );

    await playButton.click();
    await expect(playButton).not.toHaveClass(/playing/);
  });

  test('模拟完成后显示预测结果', async ({ page }) => {
    await openSimulationPage(page);
    await setProgress(page, 100);

    await expect(page.locator('.progress-info span').first()).toHaveText('100%');
    await expect(page.locator('.progress-info span').nth(1)).toHaveText('500m');
    await expect(page.locator('.loading-overlay')).toHaveCount(0);
    await expect(page.locator('canvas.layer-bg')).toBeVisible();
    await expect(page.locator('canvas.layer-dynamic')).toBeVisible();
    await expect(page.locator('canvas.layer-overlay')).toBeVisible();
  });

  test('用户可以查看模拟历史', async ({ page }) => {
    await openSimulationPage(page);

    const stepBack = page.locator('.step-btn').first();
    const stepForward = page.locator('.step-btn').nth(1);

    await setProgress(page, 0);
    await stepForward.click();
    await expect(page.locator('.progress-info span').first()).not.toHaveText('0%');

    await stepBack.click();
    await expect(page.locator('.progress-info span').first()).toHaveText('0%');

    const speed2x = page.locator('.speed-btn', { hasText: '2x' });
    await speed2x.click();
    await expect(speed2x).toHaveClass(/active/);

    const playButton = page.locator('.play-btn-mini');
    await playButton.click();
    await expect(playButton).toHaveClass(/playing/);
    await page.waitForTimeout(700);
    await playButton.click();

    await expect(page.locator('.progress-info span').first()).not.toHaveText('0%');
  });
});
