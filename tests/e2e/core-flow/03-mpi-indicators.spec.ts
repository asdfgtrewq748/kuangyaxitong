/**
 * E2E Test: MPI 指标查看
 */
import { expect, test } from 'playwright/test'

const openMpiDashboard = async (page) => {
  await page.goto('/mpi-heatmap-pro')
  await expect(page.locator('.nav-title')).toHaveText('MPI 数值模拟')
  await expect(page.locator('.stage-container')).toBeVisible()
  await expect(page.locator('canvas.layer-bg')).toBeVisible()
  await expect(page.locator('canvas.layer-dynamic')).toBeVisible()
  await expect(page.locator('canvas.layer-overlay')).toBeVisible()
  await expect(page.locator('.mini-stats')).toBeVisible({ timeout: 30_000 })
}

test.describe('MPI 指标查看', () => {
  test('用户可以查看 MPI 仪表盘', async ({ page }) => {
    await openMpiDashboard(page)

    await expect(page.locator('.mini-stat').first()).toContainText('均值')
    await expect(page.locator('.floating-hint')).toContainText('拖拽移动')
  })

  test('用户可以切换不同的 MPI 图层指标', async ({ page }) => {
    await openMpiDashboard(page)

    await page.getByRole('button', { name: '控制面板', exact: true }).click()
    await expect(page.locator('.control-panel')).toBeVisible()

    const contourToggle = page.locator('.layer-toggle', { hasText: '等值线' }).locator('input[type="checkbox"]')
    const gradedBandToggle = page.locator('.layer-toggle', { hasText: '分级带' }).locator('input[type="checkbox"]')

    const contourBefore = await contourToggle.isChecked()
    const gradedBefore = await gradedBandToggle.isChecked()

    await contourToggle.click({ force: true })
    await gradedBandToggle.click({ force: true })

    await expect(contourToggle).toHaveJSProperty('checked', !contourBefore)
    await expect(gradedBandToggle).toHaveJSProperty('checked', !gradedBefore)
  })

  test('MPI 指标热力图与图例正常显示', async ({ page }) => {
    await openMpiDashboard(page)
    await page.getByRole('button', { name: '控制面板', exact: true }).click()

    await expect(page.locator('.legend-gradient')).toBeVisible()
    await expect(page.locator('.legend-labels')).toContainText('低风险')
    await expect(page.locator('.legend-labels')).toContainText('高风险')
    await expect(page.locator('.loading-overlay')).toHaveCount(0)

    const canvasSize = await page.locator('canvas.layer-bg').evaluate((canvas) => ({
      width: canvas.width,
      height: canvas.height
    }))
    expect(canvasSize.width).toBeGreaterThan(0)
    expect(canvasSize.height).toBeGreaterThan(0)
  })
})
