/**
 * E2E Test: 数据导入流程
 */
import { expect, test } from 'playwright/test'

const buildCsv = (name: string) => ({
  name,
  mimeType: 'text/csv',
  buffer: Buffer.from(
    [
      'name,x,y,elastic_modulus,density,tensile_strength,thickness',
      'ZK01,100,200,12.5,2.4,1.2,3.6'
    ].join('\n'),
    'utf-8'
  )
})

test.describe('数据导入流程', () => {
  test('用户可以上传 CSV 文件并看到解析结果', async ({ page }) => {
    await page.goto('/data')

    const dataFileInput = page.locator('input[type="file"][accept=".csv"]')
    await dataFileInput.setInputFiles(buildCsv(`e2e-upload-${Date.now()}.csv`))

    await expect(page.locator('.file-name').first()).toBeVisible()
    await expect(page.getByRole('button', { name: '上传数据' })).toBeEnabled()

    await page.getByRole('button', { name: '上传数据' }).click()

    await expect(page.locator('.toast-content')).toContainText('已上传 1 个文件')
    await expect(page.locator('.result-title')).toHaveText('扫描完成')
  })

  test('不支持格式的文件不会进入上传队列', async ({ page }) => {
    await page.goto('/data')

    const dataFileInput = page.locator('input[type="file"][accept=".csv"]')
    await dataFileInput.setInputFiles({
      name: 'invalid_format.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('not,csv', 'utf-8')
    })

    await expect(page.locator('.file-item')).toHaveCount(0)
    await expect(page.getByRole('button', { name: '上传数据' })).toBeDisabled()
  })

  test('上传后可看到提取的坐标预览', async ({ page }) => {
    await page.goto('/data')

    const dataFileInput = page.locator('input[type="file"][accept=".csv"]')
    await dataFileInput.setInputFiles(buildCsv(`e2e-coord-${Date.now()}.csv`))

    await page.getByRole('button', { name: '上传数据' }).click()

    await expect(page.locator('.extracted-coords .subsection-title')).toHaveText('从文件中提取的坐标')
    await expect(page.locator('.extracted-coords .subsection-desc')).toContainText('发现 1 个钻孔')
  })
})
