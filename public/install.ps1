$ErrorActionPreference = 'Stop'
$repo = 'B-Divyesh/sf-color-signal-lens'
$release = Invoke-RestMethod "https://api.github.com/repos/$repo/releases/latest"
$asset = $release.assets | Where-Object { $_.name -match '\.(msi|exe|zip)$' } | Select-Object -First 1
$sums = $release.assets | Where-Object { $_.name -eq 'SHA256SUMS' } | Select-Object -First 1
if (-not $asset -or -not $sums) { throw 'A Windows download is not published yet.' }
$folder = Join-Path $env:TEMP "color-signal-lens-$($release.tag_name)"
New-Item -ItemType Directory -Force -Path $folder | Out-Null
$path = Join-Path $folder $asset.name
Invoke-WebRequest $asset.browser_download_url -OutFile $path
$checksums = (Invoke-WebRequest $sums.browser_download_url).Content
$expected = ($checksums -split "`n" | Where-Object { $_ -match [regex]::Escape($asset.name) } | Select-Object -First 1).Split(' ', [System.StringSplitOptions]::RemoveEmptyEntries)[0]
$actual = (Get-FileHash $path -Algorithm SHA256).Hash.ToLower()
if ($actual -ne $expected.ToLower()) { throw 'Checksum did not match. The download was not installed.' }
Write-Host "Verified $($asset.name). Run it from $path to install."
Write-Host 'The app is unsigned; Windows may ask you to confirm it.'
