[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$ErrorActionPreference = 'Continue'

$root = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$src  = Join-Path $root '_src'
$img  = Join-Path $root 'assets\img'
New-Item -ItemType Directory -Force -Path $img | Out-Null

# --- collect urls in deterministic first-appearance order -----------------
$order  = @('home.html','catalog.html','product.html','cart.html','logo-nexus.svg','logo-tradex.svg')
$seen   = @{}
$list   = New-Object System.Collections.Generic.List[string]

foreach ($f in $order) {
  $p = Join-Path $src $f
  if (-not (Test-Path $p)) { continue }
  $t = Get-Content $p -Raw
  foreach ($m in [regex]::Matches($t, 'https://lh3\.googleusercontent\.com/[^\s"''<>()\\]+')) {
    $u = $m.Value.TrimEnd(',', ';')
    if (-not $seen.ContainsKey($u)) { $seen[$u] = $true; $list.Add($u) }
  }
}

Write-Output ("unique images: {0}" -f $list.Count)

$n = 0
$map = New-Object System.Collections.Generic.List[string]
foreach ($u in $list) {
  if ($u -match '/aida-public/') {
    $n++
    $name = 'product-{0:D2}.png' -f $n
  } elseif ($u -match 'AEtjO1XM0UYvJmA') {
    $name = 'avatar.png'
  } else {
    $name = 'logo-tradex-full.png'
  }
  $out = Join-Path $img $name
  try {
    Invoke-WebRequest -Uri $u -OutFile $out -UseBasicParsing -TimeoutSec 180
    $ok = 'OK'
  } catch { $ok = 'FAIL: ' + $_.Exception.Message }
  Write-Output ("{0,-6} {1,-20} {2,9:N0} bytes" -f $ok, $name, (Get-Item $out -ErrorAction SilentlyContinue).Length)
  $map.Add("$name`t$u")
}

$map | Set-Content -Encoding utf8 (Join-Path $src 'image-map.tsv')
Write-Output '--- map written ---'
