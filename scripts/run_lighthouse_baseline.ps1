$ErrorActionPreference = 'Stop'

$backend = $null
$frontend = $null

try {
  $repoRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
  $backendDir = Join-Path $repoRoot 'backend'
  $frontendDir = Join-Path $repoRoot 'frontend'
  $outDir = Join-Path $repoRoot 'docs\lighthouse'
  $e2eDir = Join-Path $repoRoot 'tests\e2e'
  $chromeCandidates = @(
    "$env:ProgramFiles\Google\Chrome\Application\chrome.exe",
    "$env:ProgramFiles(x86)\Google\Chrome\Application\chrome.exe",
    "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe",
    "$env:ProgramFiles(x86)\Microsoft\Edge\Application\msedge.exe"
  )
  $chromePath = $chromeCandidates | Where-Object { Test-Path $_ } | Select-Object -First 1
  if (-not $chromePath -and (Test-Path $e2eDir)) {
    try {
      Push-Location $e2eDir
      $playwrightChromePath = & node -e "const { chromium } = require('playwright'); console.log(chromium.executablePath());" 2>$null
      Pop-Location
      if ($LASTEXITCODE -eq 0 -and $playwrightChromePath) {
        $trimmed = $playwrightChromePath.ToString().Trim()
        if ($trimmed -and (Test-Path $trimmed)) {
          $chromePath = $trimmed
        }
      }
    } catch {
      try { Pop-Location } catch {}
      # no-op fallback
    }
  }
  if (-not $chromePath) {
    throw 'No Chrome/Edge executable found for Lighthouse.'
  }

  $backend = Start-Process -FilePath python -ArgumentList '-m','uvicorn','app.main:app','--host','127.0.0.1','--port','8001' -WorkingDirectory $backendDir -PassThru
  $frontend = Start-Process -FilePath npm.cmd -ArgumentList 'run','dev','--','--host','127.0.0.1','--port','5173' -WorkingDirectory $frontendDir -PassThru

  $deadline = (Get-Date).AddSeconds(120)
  do {
    Start-Sleep -Seconds 2
    $frontReady = Get-NetTCPConnection -LocalPort 5173 -State Listen -ErrorAction SilentlyContinue
    $backReady = Get-NetTCPConnection -LocalPort 8001 -State Listen -ErrorAction SilentlyContinue
  } while ((-not $frontReady -or -not $backReady) -and (Get-Date) -lt $deadline)

  if (-not $frontReady) { throw 'Frontend dev server did not start on 5173 in time.' }
  if (-not $backReady) { throw 'Backend server did not start on 8001 in time.' }

  New-Item -ItemType Directory -Force -Path $outDir | Out-Null

  $targets = @(
    @{ id = 'home'; url = 'http://127.0.0.1:5173/' },
    @{ id = 'data'; url = 'http://127.0.0.1:5173/data' },
    @{ id = 'interpolation'; url = 'http://127.0.0.1:5173/interpolation' },
    @{ id = 'report'; url = 'http://127.0.0.1:5173/report' }
  )

  foreach ($t in $targets) {
    $outFile = Join-Path $outDir ("{0}.json" -f $t.id)
    $env:CHROME_PATH = $chromePath
    npx -y lighthouse $t.url --quiet --chrome-flags="--headless --no-sandbox --disable-dev-shm-usage" --only-categories=performance,accessibility,best-practices,seo --output=json --output-path=$outFile | Out-Null
  }

  Push-Location $repoRoot
  node -e "const fs=require('fs'); const p='docs/lighthouse'; const ids=['home','data','interpolation','report']; const rows=ids.map(id=>{ const j=JSON.parse(fs.readFileSync(p + '/' + id + '.json','utf8')); const c=j.categories; return { id, url:j.finalDisplayedUrl||j.requestedUrl, performance:Math.round((c.performance.score??0)*100), accessibility:Math.round((c.accessibility.score??0)*100), best_practices:Math.round((c['best-practices'].score??0)*100), seo:Math.round((c.seo.score??0)*100)};}); console.log(JSON.stringify(rows,null,2));"
  Pop-Location
}
finally {
  Remove-Item Env:CHROME_PATH -ErrorAction SilentlyContinue
  if ($backend -and -not $backend.HasExited) {
    Stop-Process -Id $backend.Id -Force -ErrorAction SilentlyContinue
  }
  if ($frontend -and -not $frontend.HasExited) {
    Stop-Process -Id $frontend.Id -Force -ErrorAction SilentlyContinue
  }
}
