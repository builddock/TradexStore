[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$ErrorActionPreference = 'Stop'

$root = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$fd   = Join-Path $root 'assets\fonts'
$sheet = Get-Content (Join-Path $PSScriptRoot 'material-symbols.css') -Raw

$src = [regex]::Match($sheet, "url\((https://fonts\.gstatic\.com/[^)]+)\)").Groups[1].Value
if (-not $src) { throw 'no font url found' }
Write-Output "font url length: $($src.Length)"

$out = Join-Path $fd 'material-symbols-outlined-subset.woff2'
Invoke-WebRequest -Uri $src -OutFile $out -UseBasicParsing -TimeoutSec 180
Write-Output ("downloaded {0:N0} bytes" -f (Get-Item $out).Length)

$css = @"
/* TradexStore - Material Symbols Outlined, subset to the icons used by the design */
@font-face {
  font-family: 'Material Symbols Outlined';
  font-style: normal;
  font-weight: 100 700;
  font-display: block;
  src: url('../fonts/material-symbols-outlined-subset.woff2') format('woff2');
}

.material-symbols-outlined {
  font-family: 'Material Symbols Outlined';
  font-weight: normal;
  font-style: normal;
  font-size: 24px;
  line-height: 1;
  letter-spacing: normal;
  text-transform: none;
  display: inline-block;
  white-space: nowrap;
  word-wrap: normal;
  direction: ltr;
  -webkit-font-feature-settings: 'liga';
  -webkit-font-smoothing: antialiased;
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
"@
$css | Set-Content -Encoding utf8 (Join-Path $root 'assets\css\icons.css')
Write-Output 'wrote assets/css/icons.css'
