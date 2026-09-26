$p = Join-Path $PSScriptRoot 'tailwind-config.txt'
$t = Get-Content $p -Raw
$t = $t -replace '(?s)^.*?tailwind\.config\s*=\s*', ''
$t = $t -replace '(?s)</script>\s*$', ''
$t = $t -replace ', "', ",`n  `""
Write-Output '=== typography / spacing lines ==='
$t -split "`n" | Where-Object { $_ -match 'font|spacing|borderRadius|fontSize|lineHeight|letterSpacing' }
Write-Output ''
Write-Output '=== tail of config ==='
($t -split "`n" | Select-Object -Last 12)
