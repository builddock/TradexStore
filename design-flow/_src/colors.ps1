$src = Join-Path (Resolve-Path (Join-Path $PSScriptRoot '..')).Path '_src'
$all = @{}
foreach ($f in @('home.html','catalog.html','product.html','cart.html')) {
  $t = Get-Content (Join-Path $src $f) -Raw
  foreach ($m in [regex]::Matches($t, '#[0-9a-fA-F]{6}\b')) {
    $k = $m.Value.ToLower()
    if ($all.ContainsKey($k)) { $all[$k]++ } else { $all[$k] = 1 }
  }
}
$all.GetEnumerator() | Sort-Object Value -Descending | Select-Object -First 28 |
  ForEach-Object { "{0}  x{1}" -f $_.Key, $_.Value }
