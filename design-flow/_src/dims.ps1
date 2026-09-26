Add-Type -AssemblyName System.Drawing
$root = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$img  = Join-Path $root 'assets\img'

Get-ChildItem $img -Filter *.png | Sort-Object Name | ForEach-Object {
  $i = [System.Drawing.Image]::FromFile($_.FullName)
  "{0,-20} {1,5} x {2,-5}  ratio {3:N2}" -f $_.Name, $i.Width, $i.Height, ($i.Width / $i.Height)
  $i.Dispose()
}
