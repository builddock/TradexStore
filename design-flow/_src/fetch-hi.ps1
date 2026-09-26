[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
Add-Type -AssemblyName System.Drawing
$src = Join-Path (Resolve-Path (Join-Path $PSScriptRoot '..')).Path '_src'
$hi  = Join-Path $src 'hi'
New-Item -ItemType Directory -Force -Path $hi | Out-Null

$shots = @{
  'home'    = 'https://lh3.googleusercontent.com/aida/AEtjO1Vb5cTq5fDZGKSRmyTtBHZyjLhVMT35NU8eMgLBqAtO_gqB6d_Rw8uk_DKjW5rox2Sw1Vj_lyfDZz23TzIRTbctmq4haHRmX8nVzOZkhFE7V58fEku0GM0juCwMDiinYcrLngPOEL89H20OSU-ej0A7Gq0QHYL9TFOksNyUkYM2AHYbiCvMbpIyyIxi8mcpEUNMWSIkjVlUQ0vhTD24sGzsHW67KOsILK3A4atNZY4w6AyMCuK-Y2oo7A'
  'catalog' = 'https://lh3.googleusercontent.com/aida/AEtjO1VvXpAHZUVJBf7lsrG-oCh_NdFc_FwdVLQqC0WSKKZwbKefyLCH0K8XJPQdixpl3rm9HArkZpQO2JbK4_vaO6jZHsl8lvlUuTKckkEpYhQy6UI1uADoMpzuxfGrxYwfT5uchACed8Y9lgL4oD8hMjzGCha6dBMa6amRuhVtN8yEiDoKvBfQ-JVMC8v-A7E73m5IPcHGz55VnCep1fa6HdF77ZGJ7M1R-OoeWEIPGdVXfVfJrgMt826PqA'
}

foreach ($k in $shots.Keys) {
  foreach ($size in @('=w2400', '=s2400')) {
    $out = Join-Path $hi "$k$($size.Substring(1)).png"
    try {
      Invoke-WebRequest -Uri ($shots[$k] + $size) -OutFile $out -UseBasicParsing -TimeoutSec 180
      $i = [System.Drawing.Image]::FromFile($out)
      Write-Output ("{0,-16} {1} x {2}" -f "$k$size", $i.Width, $i.Height)
      $i.Dispose()
    } catch { Write-Output ("FAIL {0}{1}: {2}" -f $k, $size, $_.Exception.Message) }
  }
}
