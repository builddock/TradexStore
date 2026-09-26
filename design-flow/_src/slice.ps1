Add-Type -AssemblyName System.Drawing
$root = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$hi   = Join-Path $root '_src\hi'
$out  = Join-Path $root '_src\slices'
New-Item -ItemType Directory -Force -Path $out | Out-Null

$names = $args
if (-not $names -or $names.Count -eq 0) { $names = @('home') }

foreach ($n in $names) {
  $file = Join-Path $hi "$n-full.png"
  if (-not (Test-Path $file)) { Write-Output "missing $file"; continue }

  $src = [System.Drawing.Image]::FromFile($file)
  $scale = 1100 / $src.Width
  $w = 1100
  $h = [int]($src.Height * $scale)

  $scaled = New-Object System.Drawing.Bitmap($w, $h)
  $g = [System.Drawing.Graphics]::FromImage($scaled)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.DrawImage($src, 0, 0, $w, $h)
  $g.Dispose()

  $sliceH = 1500
  $idx = 0
  for ($y = 0; $y -lt $h; $y += $sliceH) {
    $idx++
    $cur = [Math]::Min($sliceH, $h - $y)
    $rect = New-Object System.Drawing.Rectangle(0, $y, $w, $cur)
    $crop = $scaled.Clone($rect, $scaled.PixelFormat)
    $dest = Join-Path $out ("{0}-{1:D2}.png" -f $n, $idx)
    $crop.Save($dest, [System.Drawing.Imaging.ImageFormat]::Png)
    $crop.Dispose()
    Write-Output ("{0}  {1}x{2}" -f $dest, $w, $cur)
  }
  $scaled.Dispose(); $src.Dispose()
}
