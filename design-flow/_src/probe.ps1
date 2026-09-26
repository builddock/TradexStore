Add-Type -AssemblyName System.Drawing
$src = Join-Path (Resolve-Path (Join-Path $PSScriptRoot '..')).Path '_src'

foreach ($f in @('shot-home.png','shot-catalog.png','shot-product.png','shot-cart.png')) {
  $p = Join-Path $src $f
  $bmp = New-Object System.Drawing.Bitmap($p)
  Write-Output ("=== {0}  {1}x{2} ===" -f $f, $bmp.Width, $bmp.Height)

  # sample a grid of colours
  $samples = @{}
  for ($y = 20; $y -lt $bmp.Height; $y += [int]($bmp.Height / 40)) {
    for ($x = 20; $x -lt $bmp.Width; $x += [int]($bmp.Width / 40)) {
      $c = $bmp.GetPixel($x, $y)
      $hex = '#{0:x2}{1:x2}{2:x2}' -f $c.R, $c.G, $c.B
      if ($samples.ContainsKey($hex)) { $samples[$hex]++ } else { $samples[$hex] = 1 }
    }
  }
  $samples.GetEnumerator() | Sort-Object Value -Descending | Select-Object -First 8 |
    ForEach-Object { "   {0}  x{1}" -f $_.Key, $_.Value }
  $bmp.Dispose()
}

Write-Output ''
Write-Output '=== <body> / html classes in sources ==='
foreach ($f in @('home.html','catalog.html','product.html','cart.html')) {
  $t = Get-Content (Join-Path $src $f) -Raw
  $b = [regex]::Match($t, '(?is)<body[^>]*>').Value
  Write-Output ("[{0}] {1}" -f $f, ($b -replace '\s+', ' '))
}
