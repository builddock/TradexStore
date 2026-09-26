[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$ErrorActionPreference = 'Stop'

$root = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$fd   = Join-Path $root 'assets\fonts'
New-Item -ItemType Directory -Force -Path $fd | Out-Null

$ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'

$families = @{
  'Space Grotesk' = 'Space+Grotesk:wght@500;600;700'
  'Geist'         = 'Geist:wght@400;500;600;700'
  'JetBrains Mono'= 'JetBrains+Mono:wght@400;500;600;700'
}

$css = New-Object System.Collections.Generic.List[string]
$css.Add('/* TradexStore - self-hosted fonts (downloaded from Google Fonts, latin subset) */')
$count = 0

foreach ($fam in $families.Keys) {
  $url = "https://fonts.googleapis.com/css2?family=$($families[$fam])&display=swap"
  $sheet = (Invoke-WebRequest -Uri $url -Headers @{ 'User-Agent' = $ua } -UseBasicParsing -TimeoutSec 120).Content

  # split into @font-face blocks, keep latin + latin-ext only
  $blocks = [regex]::Matches($sheet, '(?s)/\*\s*([a-z0-9\-\[\]]+)\s*\*/\s*(@font-face\s*\{.*?\})')
  foreach ($b in $blocks) {
    $subset = $b.Groups[1].Value
    if ($subset -ne 'latin') { continue }
    $block = $b.Groups[2].Value

    $src = [regex]::Match($block, 'url\((https://[^)]+\.woff2)\)').Groups[1].Value
    if (-not $src) { continue }

    $slug = ($fam -replace '\s+', '-').ToLower()
    $wt   = [regex]::Match($block, 'font-weight:\s*(\d+)').Groups[1].Value
    $style= [regex]::Match($block, 'font-style:\s*(\w+)').Groups[1].Value
    if (-not $style) { $style = 'normal' }
    $file = "$slug-$wt.woff2"

    Invoke-WebRequest -Uri $src -OutFile (Join-Path $fd $file) -UseBasicParsing -TimeoutSec 120
    $count++

    $css.Add("@font-face {")
    $css.Add("  font-family: '$fam';")
    $css.Add("  font-style: $style;")
    $css.Add("  font-weight: $wt;")
    $css.Add("  font-display: swap;")
    $css.Add("  src: url('../fonts/$file') format('woff2');")
    $css.Add("}")
  }
  Write-Output ("{0,-16} -> ok" -f $fam)
}

$css | Set-Content -Encoding utf8 (Join-Path $root 'assets\css\fonts.css')
Write-Output ("--- {0} font files ---" -f $count)
Get-ChildItem $fd | Select-Object Name, Length | Format-Table -AutoSize
