/**
 * E2E Test: 插值计算流程
 */
import { expect, test } from 'playwright/test'

const openInterpolationWithSeam = async (page) => {
  await page.goto('/interpolation')
  await expect(page.getByRole('heading', { name: '插值分析' })).toBeVisible()

  const paramsHeading = page.getByRole('heading', { name: '插值参数' })
  if (await paramsHeading.isVisible()) {
    return
  }

  const firstSeamCard = page.locator('.seam-selection-card').first()
  await expect(firstSeamCard).toBeVisible({ timeout: 15_000 })
  await firstSeamCard.click()
  await expect(paramsHeading).toBeVisible({ timeout: 20_000 })
}

const waitForInterpolationReady = async (page) => {
  const generateButton = page.locator('.params-card button.btn.primary').first()
  await expect(generateButton).toBeVisible()
  await expect(generateButton).toBeEnabled({ timeout: 40_000 })
  return generateButton
}

const runInterpolation = async (page) => {
  const generateButton = await waitForInterpolationReady(page)
  await generateButton.click()
  await expect(page.locator('img.contour-image').first()).toBeVisible({ timeout: 30_000 })
}

test.describe('插值计算流程', () => {
  test('用户可以选择煤层并执行插值计算', async ({ page }) => {
    await openInterpolationWithSeam(page)

    const paramsCard = page.locator('.params-card')
    await paramsCard.getByRole('button', { name: 'IDW', exact: true }).click()
    await runInterpolation(page)

    await expect(page.locator('.section-desc').filter({ hasText: 'IDW' }).first()).toBeVisible()
  })

  test('插值计算完成后显示结果图表', async ({ page }) => {
    await openInterpolationWithSeam(page)
    await runInterpolation(page)

    await expect(page.getByRole('heading', { name: '煤层厚度分布' })).toBeVisible()
    await expect(page.getByRole('heading', { name: '煤层埋深分布' })).toBeVisible()
    await expect(page.locator('canvas.uncertainty-canvas')).toBeVisible()
  })

  test('用户可以调整插值参数并重新计算', async ({ page }) => {
    await openInterpolationWithSeam(page)
    await waitForInterpolationReady(page)

    const gridSlider = page.locator('input.slider').first()
    await gridSlider.evaluate((node, value) => {
      node.value = String(value)
      node.dispatchEvent(new Event('input', { bubbles: true }))
      node.dispatchEvent(new Event('change', { bubbles: true }))
    }, 120)

    const paramsCard = page.locator('.params-card')
    const nearestButton = paramsCard.getByRole('button', { name: 'Nearest', exact: true })
    const highQualityButton = paramsCard.getByRole('button', { name: '高精', exact: true })
    await nearestButton.evaluate((node) => node.click())
    await highQualityButton.evaluate((node) => node.click())

    await runInterpolation(page)

    await expect(page.locator('.section-desc').filter({ hasText: 'Nearest' }).first()).toBeVisible()
    await expect(page.locator('.param-value').first()).toHaveText('120')
  })
})
