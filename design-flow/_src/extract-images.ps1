$src = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$src = Join-Path $src '_src'

$urls = New-Object System.Collections.Generic.List[string]
foreach ($f in @('home.html','catalog.html','product.html','cart.html','logo-nexus.svg','logo-tradex.svg')) {
  $p = Join-Path $src $f
  if (-not (Test-Path $p)) { continue }
  $t = Get-Content $p -Raw
  foreach ($m in [regex]::Matches($t, 'https?://[^\s"''<>()\\]+')) {
    $u = $m.Value.TrimEnd(',', ';')
    $urls.Add($u)
  }
}

$uniq = $urls | Sort-Object -Unique
Write-Output ("TOTAL: {0}  UNIQUE: {1}" -f $urls.Count, $uniq.Count)
Write-Output '--- unique urls ---'
$i = 0
foreach ($u in $uniq) { $i++; Write-Output ("[{0}] {1}" -f $i, $u) }
