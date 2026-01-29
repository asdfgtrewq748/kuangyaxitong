$ErrorActionPreference = 'Stop'

$root = Resolve-Path $PSScriptRoot

Write-Host "[1/3] Setup backend" -ForegroundColor Cyan
Set-Location "$root\backend"
if (!(Test-Path .venv)) {
  python -m venv .venv
}
. .\.venv\Scripts\Activate.ps1
$env:PIP_INDEX_URL = "https://pypi.org/simple"
$env:PIP_ONLY_BINARY = ":all:"
python -m pip install --upgrade pip
python -m pip install -r requirements.txt

Write-Host "[2/3] Start backend" -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd `"$root\backend`"; . .\.venv\Scripts\Activate.ps1; uvicorn app.main:app --host 0.0.0.0 --port 8000"

Write-Host "[3/3] Start frontend" -ForegroundColor Cyan
Set-Location "$root\frontend"
if (!(Test-Path node_modules)) {
  npm install
}
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd `"$root\frontend`"; npm run dev"

Write-Host "All services started." -ForegroundColor Green
