#!/usr/bin/env node
import fs from 'node:fs/promises'
import path from 'node:path'
import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const repoRoot = path.resolve(__dirname, '..', '..')
const baseUrl = process.env.FRONTEND_BASE_URL || 'http://127.0.0.1:5173'

const routes = [
  '/',
  '/data-import',
  '/interpolation',
  '/mpi-heatmap-pro',
  '/algorithm-validation',
  '/research-workbench',
  '/geo-mpi-studio',
  '/scene3d',
  '/steps',
  '/report',
  '/geomodel-visualization',
  '/academic-algorithm',
]

const viewports = [
  { name: 'desktop_1920', width: 1920, height: 1080 },
  { name: 'desktop_1440', width: 1440, height: 900 },
  { name: 'tablet_1024', width: 1024, height: 768 },
  { name: 'mobile_768', width: 768, height: 1024 },
  { name: 'mobile_375', width: 375, height: 812 },
]

const now = new Date()
const ts = now.toISOString().replace(/[-:]/g, '').slice(0, 15)
const outDir = path.join(repoRoot, 'data', 'research', 'stage_e', 'ui_accessibility', ts)
const screenshotDir = path.join(outDir, 'screenshots')
const serverHost = '127.0.0.1'
const serverPort = '5173'

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const isServerReady = async () => {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 1800)
  try {
    const response = await fetch(baseUrl, {
      method: 'GET',
      signal: controller.signal,
      headers: { Accept: 'text/html' },
    })
    return response.ok
  } catch {
    return false
  } finally {
    clearTimeout(timer)
  }
}

const ensureFrontendServer = async () => {
  if (await isServerReady()) {
    return { process: null, started: false }
  }

  const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm'
  const child = spawn(
    `${npmCmd} --prefix frontend run dev -- --host ${serverHost} --port ${serverPort} --strictPort`,
    { cwd: repoRoot, stdio: 'ignore', shell: true }
  )

  let ready = false
  for (let i = 0; i < 50; i += 1) {
    if (await isServerReady()) {
      ready = true
      break
    }
    await sleep(700)
  }

  if (!ready) {
    try {
      child.kill()
    } catch {
      // Ignore cleanup errors.
    }
    throw new Error(`frontend dev server not ready at ${baseUrl}`)
  }

  return { process: child, started: true }
}

const loadAxeSource = async () => {
  const candidates = [
    path.join(repoRoot, 'node_modules', 'axe-core', 'axe.min.js'),
    path.join(repoRoot, 'frontend', 'node_modules', 'axe-core', 'axe.min.js'),
  ]
  for (const candidate of candidates) {
    try {
      return { source: `local:${candidate}`, text: await fs.readFile(candidate, 'utf8') }
    } catch {
      // Continue.
    }
  }
  throw new Error('axe-core source not found in node_modules')
}

const run = async () => {
  await fs.mkdir(screenshotDir, { recursive: true })
  const axe = await loadAxeSource()
  const serverHandle = await ensureFrontendServer()

  const entries = []
  let browser
  try {
    try {
      browser = await chromium.launch({ headless: true, channel: 'msedge' })
    } catch {
      browser = await chromium.launch({ headless: true })
    }

    for (const route of routes) {
      for (const viewport of viewports) {
        const context = await browser.newContext({
          viewport: { width: viewport.width, height: viewport.height },
        })
        const page = await context.newPage()
        let screenshot = null
        let error = ''
        let loadStatus = 'PASS'

        try {
          await page.goto(`${baseUrl}${route}`, { waitUntil: 'domcontentloaded', timeout: 60000 })
          await page.waitForTimeout(1800)

          const layout = await page.evaluate(() => {
            const de = document.documentElement
            const body = document.body
            const scrollWidth = Math.max(
              de ? de.scrollWidth : 0,
              body ? body.scrollWidth : 0
            )
            const clientWidth = de ? de.clientWidth : window.innerWidth
            return { scrollWidth, clientWidth }
          })
          const scrollWidth = Number(layout.scrollWidth || 0)
          const clientWidth = Number(layout.clientWidth || 0)
          const overflow = scrollWidth > clientWidth + 1

          await page.addScriptTag({ content: axe.text })
          const axeResult = await page.evaluate(async () => {
            if (!window.axe) {
              return { violations: [], error: 'axe_unavailable' }
            }
            const result = await window.axe.run(document, {
              runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa'] },
              resultTypes: ['violations'],
            })
            return {
              violations: result.violations.map((v) => ({
                id: v.id,
                impact: v.impact || 'unknown',
                help: v.help,
                nodeCount: Array.isArray(v.nodes) ? v.nodes.length : 0,
                targets: Array.isArray(v.nodes)
                  ? v.nodes.slice(0, 3).map((node) => {
                    if (Array.isArray(node.target)) return node.target.join(' | ')
                    return ''
                  }).filter(Boolean)
                  : [],
              })),
            }
          })

          const violations = Array.isArray(axeResult.violations) ? axeResult.violations : []
          const critical = violations.filter((v) => v.impact === 'critical').length
          const serious = violations.filter((v) => v.impact === 'serious').length

          if (overflow || critical > 0 || serious > 0) {
            const safeRoute = route.replace(/^\//, '').replace(/\//g, '_') || 'home'
            screenshot = `${safeRoute}_${viewport.name}.png`
            await page.screenshot({ path: path.join(screenshotDir, screenshot), fullPage: true })
          }

          entries.push({
            route,
            viewport: viewport.name,
            width: viewport.width,
            height: viewport.height,
            loadStatus,
            horizontalOverflow: overflow,
            scrollWidth,
            clientWidth,
            axeCritical: critical,
            axeSerious: serious,
            violations,
            screenshot,
            error: '',
          })
        } catch (err) {
          loadStatus = 'FAIL'
          error = String(err)
          const safeRoute = route.replace(/^\//, '').replace(/\//g, '_') || 'home'
          screenshot = `${safeRoute}_${viewport.name}_fail.png`
          try {
            await page.screenshot({ path: path.join(screenshotDir, screenshot), fullPage: true })
          } catch {
            screenshot = null
          }
          entries.push({
            route,
            viewport: viewport.name,
            width: viewport.width,
            height: viewport.height,
            loadStatus,
            horizontalOverflow: false,
            scrollWidth: 0,
            clientWidth: 0,
            axeCritical: 0,
            axeSerious: 0,
            violations: [],
            screenshot,
            error,
          })
        } finally {
          await context.close()
        }
      }
    }
  } finally {
    if (browser) {
      await browser.close()
    }
    if (serverHandle.process && !serverHandle.process.killed) {
      try {
        serverHandle.process.kill()
      } catch {
        // Ignore cleanup errors.
      }
    }
  }

  const summary = {
    totalChecks: entries.length,
    failedLoad: entries.filter((e) => e.loadStatus !== 'PASS').length,
    horizontalOverflowChecks: entries.filter((e) => e.horizontalOverflow).length,
    axeCriticalTotal: entries.reduce((acc, e) => acc + e.axeCritical, 0),
    axeSeriousTotal: entries.reduce((acc, e) => acc + e.axeSerious, 0),
  }

  const payload = {
    generatedAt: new Date().toISOString(),
    baseUrl,
    axeSource: axe.source,
    summary,
    entries,
  }

  await fs.writeFile(path.join(outDir, 'report.json'), JSON.stringify(payload, null, 2), 'utf8')
  const lines = [
    '# Frontend Layout + Accessibility Audit',
    '',
    `- generated_at: ${payload.generatedAt}`,
    `- base_url: ${baseUrl}`,
    `- axe_source: ${axe.source}`,
    '',
    '| Route | Viewport | Status | Overflow | Critical | Serious | Detail |',
    '|---|---|---|---|---:|---:|---|',
  ]
  for (const entry of entries) {
    lines.push(
      `| ${entry.route} | ${entry.viewport}(${entry.width}x${entry.height}) | ${entry.loadStatus} | ` +
      `${entry.horizontalOverflow ? 'YES' : 'NO'} | ${entry.axeCritical} | ${entry.axeSerious} | ${entry.error.slice(0, 120)} |`
    )
  }
  await fs.writeFile(path.join(outDir, 'report.md'), `${lines.join('\n')}\n`, 'utf8')

  console.log(JSON.stringify(summary, null, 2))
  console.log(`output: ${outDir}`)
  const success =
    summary.failedLoad === 0 &&
    summary.horizontalOverflowChecks === 0 &&
    summary.axeCriticalTotal === 0 &&
    summary.axeSeriousTotal === 0
  process.exit(success ? 0 : 2)
}

run().catch((err) => {
  console.error(err)
  process.exit(2)
})
