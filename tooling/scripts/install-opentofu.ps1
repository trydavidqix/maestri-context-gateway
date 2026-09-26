$ErrorActionPreference = 'Stop'

$repoRoot = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..\..'))
$versionFile = Join-Path $repoRoot 'infra\cloud\tofu\.opentofu-version'
$version = (Get-Content -LiteralPath $versionFile -Raw).Trim()
if ($version -ne '1.12.6') {
  throw 'Update the pinned OpenTofu version and its verified checksum together.'
}
$assetName = "tofu_${version}_windows_amd64.zip"
$expectedSha256 = '0d1421721cf9ec24b41b698a9620dda218d47fa7e76ac3dc15cdbc13bd79b0bb'
$destination = Join-Path $repoRoot '.tools\opentofu'
$destination = [System.IO.Path]::GetFullPath($destination)
$zipPath = Join-Path $destination $assetName
$downloadUri = "https://github.com/opentofu/opentofu/releases/download/v${version}/${assetName}"

New-Item -ItemType Directory -Force -Path $destination | Out-Null
Invoke-WebRequest -Uri $downloadUri -OutFile $zipPath

$actualSha256 = (Get-FileHash -LiteralPath $zipPath -Algorithm SHA256).Hash.ToLowerInvariant()
if ($actualSha256 -ne $expectedSha256) {
  Remove-Item -LiteralPath $zipPath -Force
  throw 'OpenTofu archive checksum validation failed.'
}

Expand-Archive -LiteralPath $zipPath -DestinationPath $destination -Force
Remove-Item -LiteralPath $zipPath -Force

$tofuPath = Join-Path $destination 'tofu.exe'
if (-not (Test-Path -LiteralPath $tofuPath)) {
  throw 'OpenTofu executable was not found after extraction.'
}

& $tofuPath version
if ($LASTEXITCODE -ne 0) {
  throw 'OpenTofu version check failed.'
}
