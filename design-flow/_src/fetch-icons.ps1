[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$ErrorActionPreference = 'Continue'

$root = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$fd   = Join-Path $root 'assets\fonts'
New-Item -ItemType Directory -Force -Path $fd | Out-Null

$ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'

# every Material Symbols ligature used across the four Stitch screens
$icons = @(
  'bolt','local_shipping','expand_more','search','currency_exchange','package_2','favorite',
  'shopping_bag','shopping_cart','arrow_forward','tune','timer','thermostat','architecture',
  'volume_up','volume_off','verified_user','rocket_launch','swap_horizontal_circle','verified',
  'airplanemode_active','support_agent','add','remove','check_circle','star','star_half',
  'grid_view','view_list','unfold_more','chevron_left','chevron_right','close','lock',
  'shield_person','task_alt','flight_takeoff','delete','sell','precision_manufacturing','speed',
  'published_with_changes','contact_support','download','play_arrow','layers','fitness_center',
  'battery_charging_full','cycle','memory','graphic_eq','view_in_ar','radio_button_checked',
  'favorite_border','add_shopping_cart','shopping_cart_checkout','menu','arrow_back','keyboard_arrow_down'
)

$iconList = ($icons -join ',')
$url = "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&icon_names=$iconList&display=block"

Write-Output "requesting subset for $($icons.Count) icons"
$sheet = (Invoke-WebRequest -Uri $url -Headers @{ 'User-Agent' = $ua } -UseBasicParsing -TimeoutSec 180).Content
$sheet | Set-Content -Encoding utf8 (Join-Path $PSScriptRoot 'material-symbols.css')

$srcs = [regex]::Matches($sheet, 'url\((https://[^)]+\.woff2)\)') | ForEach-Object { $_.Groups[1].Value } | Sort-Object -Unique
Write-Output "woff2 urls: $($srcs.Count)"
$i = 0
foreach ($s in $srcs) {
  $i++
  $out = Join-Path $fd "material-symbols-$i.woff2"
  try {
    Invoke-WebRequest -Uri $s -OutFile $out -UseBasicParsing -TimeoutSec 180
    Write-Output ("  [{0}] {1,8:N0} bytes  {2}" -f $i, (Get-Item $out).Length, (Split-Path $s -Leaf))
  } catch { Write-Output "  FAIL $s :: $($_.Exception.Message)" }
}
Write-Output '--- css head ---'
($sheet -split "`n" | Select-Object -First 24) -join "`n"
