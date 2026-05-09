param(
  [string]$RepoUrl = "https://github.com/man072012/hsk4-tutorial.git",
  [string]$RepoPath = "$HOME\hsk4-tutorial",
  [string]$CommitMessage = "Release final HSK4 visual redesign"
)

$ErrorActionPreference = "Stop"

Write-Host "HSK4 GitHub Pages publisher" -ForegroundColor Cyan
Write-Host "This script does NOT contain or store any GitHub token." -ForegroundColor Yellow

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
  throw "Git is not installed or not available in PATH."
}

$PackageRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$Source = Join-Path $PackageRoot "hsk4-project-full"
if (-not (Test-Path $Source)) {
  throw "Cannot find hsk4-project-full next to this script."
}

if (-not (Test-Path $RepoPath)) {
  Write-Host "Cloning repository..." -ForegroundColor Cyan
  git clone $RepoUrl $RepoPath
}

if (-not (Test-Path (Join-Path $RepoPath ".git"))) {
  throw "RepoPath exists but is not a Git repository: $RepoPath"
}

Write-Host "Copying files to repository..." -ForegroundColor Cyan
Copy-Item -Path (Join-Path $Source "*") -Destination $RepoPath -Recurse -Force

Push-Location $RepoPath
try {
  git status --short
  Write-Host "Review the changed files above." -ForegroundColor Yellow
  $confirm = Read-Host "Type YES to commit and push"
  if ($confirm -ne "YES") {
    Write-Host "Cancelled before commit." -ForegroundColor Yellow
    exit 0
  }
  git add .
  git commit -m $CommitMessage
  git push origin main
  Write-Host "Done. GitHub Pages will update shortly." -ForegroundColor Green
} finally {
  Pop-Location
}
