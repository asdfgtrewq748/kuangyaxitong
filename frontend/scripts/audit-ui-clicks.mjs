import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const INTERACTIVE_CLASS_RE = /\b(?:btn|button|icon-btn|tool-btn|chip-btn|action-btn|view-btn|tab-btn|close-btn|back-btn|legend-toggle|lang-toggle)\b/
const CLICK_RE = /@click(?:\.[a-z]+)*\s*=\s*"([^"]+)"/g
const BUTTON_RE = /<button\b(?:[^"'<>]|"[^"]*"|'[^']*')*>/g

function getLineNumber(text, index) {
  return text.slice(0, index).split(/\r?\n/).length
}

function extractFirstIdentifier(expression) {
  const trimmed = String(expression || '').trim()
  const match = trimmed.match(/^([A-Za-z_$][\w$]*)/)
  return match ? match[1] : ''
}

function scriptMentionsIdentifier(script, identifier) {
  if (!script || !identifier) return true
  const escaped = identifier.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return new RegExp(`\\b${escaped}\\b`).test(script)
}

function isInteractiveButtonTag(tag) {
  if (/data-audit-ignore-click/.test(tag)) return false
  if (/@click(?:\.[a-z]+)*=/.test(tag)) return false
  if (/type\s*=\s*"submit"/.test(tag)) return false
  if (/disabled(?:\s|=|>)/.test(tag)) return false
  return INTERACTIVE_CLASS_RE.test(tag)
}

export function analyzeVueSfc(file, text) {
  const findings = []
  const templateMatch = text.match(/<template>([\s\S]*?)<\/template>/)
  const scriptMatch = text.match(/<script[\s\S]*?>([\s\S]*?)<\/script>/)
  if (!templateMatch) return findings

  const template = templateMatch[1]
  const script = scriptMatch?.[1] || ''

  let clickMatch
  while ((clickMatch = CLICK_RE.exec(template))) {
    const expr = clickMatch[1]
    const identifier = extractFirstIdentifier(expr)
    if (!identifier || identifier === '$emit' || identifier === 'emit') continue
    if (!scriptMentionsIdentifier(script, identifier)) {
      findings.push({
        type: 'missing-handler',
        file,
        line: getLineNumber(text, templateMatch.index + clickMatch.index),
        detail: `${identifier} <- ${expr.trim()}`
      })
    }
  }

  let buttonMatch
  while ((buttonMatch = BUTTON_RE.exec(template))) {
    const tag = buttonMatch[0]
    if (!isInteractiveButtonTag(tag)) continue
    findings.push({
      type: 'button-without-click',
      file,
      line: getLineNumber(text, templateMatch.index + buttonMatch.index),
      detail: tag.replace(/\s+/g, ' ').trim()
    })
  }

  return findings
}

export function collectVueFiles(rootDir) {
  const vueFiles = []

  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const nextPath = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        walk(nextPath)
        continue
      }
      if (entry.isFile() && nextPath.endsWith('.vue')) {
        vueFiles.push(nextPath)
      }
    }
  }

  walk(rootDir)
  return vueFiles
}

export function runAudit(rootDir = path.resolve('src')) {
  const files = collectVueFiles(rootDir)
  return files.flatMap((file) => analyzeVueSfc(file, fs.readFileSync(file, 'utf8')))
}

const isCliEntry = process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])

if (isCliEntry) {
  const findings = runAudit()
  if (findings.length === 0) {
    console.log('UI audit passed: no suspicious click handlers found.')
    process.exit(0)
  }

  for (const finding of findings) {
    console.log(`${finding.type}: ${finding.file}:${finding.line}`)
    console.log(`  ${finding.detail}`)
  }

  process.exit(1)
}
