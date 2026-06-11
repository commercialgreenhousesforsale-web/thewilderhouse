<#
  Safe production deploy for The Wilder House (forsythparkvacationrentals.com).

  Why this exists: twice, an AI session overwrote index.html with tour content,
  and a plain `wrangler pages deploy` pushed the gutted homepage live. This
  wrapper refuses to deploy unless index.html still looks like the real
  vacation-rental homepage, then always pins --branch=main (production).

  Usage:  powershell -File .\deploy.ps1   (or pwsh ./deploy.ps1, from project root)
  NOTE: keep this file ASCII-only. Windows PowerShell 5.1 reads .ps1 as ANSI
  unless it has a BOM, and non-ASCII characters break parsing.
#>

$ErrorActionPreference = 'Stop'
$index = Join-Path $PSScriptRoot 'index.html'

if (-not (Test-Path $index)) { Write-Host "ABORT: index.html not found." -ForegroundColor Red; exit 1 }

$bytes   = (Get-Item $index).Length
$content = Get-Content $index -Raw

# Markers that must be present on the genuine homepage.
$required = @('The Wilder House', 'Forsyth Park Vacation Rental', 'listing-card', 'Our Suites')
$missing  = $required | Where-Object { $content -notmatch [regex]::Escape($_) }

$problems = @()
if ($bytes -lt 50000) { $problems += "index.html is only $bytes bytes (expected over 50,000 - the real homepage is about 73 KB)." }
if ($missing)         { $problems += "index.html is missing required homepage markers: $($missing -join ', ')." }

if ($problems) {
  Write-Host ""
  Write-Host "DEPLOY BLOCKED - index.html does not look like the real homepage:" -ForegroundColor Red
  $problems | ForEach-Object { Write-Host "  - $_" -ForegroundColor Red }
  Write-Host ""
  Write-Host "If this is intentional, fix index.html or deploy manually. Nothing was uploaded." -ForegroundColor Yellow
  exit 1
}

Write-Host "index.html check passed ($bytes bytes, all markers present). Deploying to production..." -ForegroundColor Green
npx wrangler pages deploy . --project-name=thewilderhouse --branch=main --commit-dirty=true
