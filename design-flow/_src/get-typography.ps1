$src = Join-Path (Resolve-Path (Join-Path $PSScriptRoot '..')).Path '_src'
$t = Get-Content (Join-Path $src 'tailwind-config.txt') -Raw
$t = $t -replace '(?s)^.*?tailwind\.config\s*=\s*', ''
$t = $t -replace '(?s)</script>\s*$', ''
$t = $t.Trim()

# JS object -> JSON (keys are already quoted in this config)
$json = $t -replace ',(\s*[}\]])', '$1'
$obj = $json | ConvertFrom-Json

Write-Output '=== fontFamily ==='
$obj.theme.extend.fontFamily.PSObject.Properties | ForEach-Object { "{0,-22} {1}" -f $_.Name, ($_.Value -join ', ') }

Write-Output ''
Write-Output '=== fontSize ==='
$obj.theme.extend.fontSize.PSObject.Properties | ForEach-Object { "{0,-22} {1}" -f $_.Name, ($_.Value | ConvertTo-Json -Compress) }

Write-Output ''
Write-Output '=== all top-level extend keys ==='
$obj.theme.extend.PSObject.Properties.Name
