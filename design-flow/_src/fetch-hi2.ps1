[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
Add-Type -AssemblyName System.Drawing
$root = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$src  = Join-Path $root '_src'
$hi   = Join-Path $src 'hi'
New-Item -ItemType Directory -Force -Path $hi | Out-Null

$shots = [ordered]@{
  'home'    = 'https://lh3.googleusercontent.com/aida/AEtjO1Vb5cTq5fDZGKSRmyTtBHZyjLhVMT35NU8eMgLBqAtO_gqB6d_Rw8uk_DKjW5rox2Sw1Vj_lyfDZz23TzIRTbctmq4haHRmX8nVzOZkhFE7V58fEku0GM0juCwMDiinYcrLngPOEL89H20OSU-ej0A7Gq0QHYL9TFOksNyUkYM2AHYbiCvMbpIyyIxi8mcpEUNMWSIkjVlUQ0vhTD24sGzsHW67KOsILK3A4atNZY4w6AyMCuK-Y2oo7A'
  'catalog' = 'https://lh3.googleusercontent.com/aida/AEtjO1VvXpAHZUVJBf7lsrG-oCh_NdFc_FwdVLQqC0WSKKZwbKefyLCH0K8XJPQdixpl3rm9HArkZpQO2JbK4_vaO6jZHsl8lvlUuTKckkEpYhQy6UI1uADoMpzuxfGrxYwfT5uchACed8Y9lgL4oD8hMjzGCha6dBMa6amRuhVtN8yEiDoKvBfQ-JVMC8v-A7E73m5IPcHGz55VnCep1fa6HdF77ZGJ7M1R-OoeWEIPGdVXfVfJrgMt826PqA'
  'product' = 'https://lh3.googleusercontent.com/aida/AEtjO1UQ6PXbVY4hKfj-_ubViaPxgxklcdaW1StQqViMsp6yEKJmiwXwldvz5HRASiiHUMF2J1P7HpobfRshACs0Ef9ESOY2_u3JZeWTcJEoUOrFGwez-62x_PzCVqp52F2SyWP37uWnCpRRXEZtZGaHYY26YrIpRKSw0mSN97L7WAao2kin3alD7Vqko6jeuKm7RxOetW2eiV1siaqIahRq-VOnewaVYUZQ3QNlSigoTNd7w9hrTWm4gKNS'
  'cart'    = 'https://lh3.googleusercontent.com/aida/AEtjO1VcgBsZZmmgxZ4oGAoU4KZakX68HqreDP991rtGUAYk9KpvSDIYbb5aVCYURqe94KClFlywkKN_C4v7fG9ybyW3GyWk9y0keJFrNnYTuxR5Cc9D7yBHO3oUCbIjh-w-2nQu19v53YVJfETRxSJXralUXPv2uux6rjMu7Ir4QbwnY5dqioePk6cl4F5hueagyk-Y6NjruQ2K60CxzN4LgsM3lvzeEWC1dJIkDwT4K8TkhGGRwgLzSYHsNQ'
}
foreach ($k in $shots.Keys) {
  $out = Join-Path $hi "$k-full.png"
  Invoke-WebRequest -Uri ($shots[$k] + '=w2400') -OutFile $out -UseBasicParsing -TimeoutSec 180
  $i = [System.Drawing.Image]::FromFile($out); Write-Output ("{0,-10} {1} x {2}" -f $k, $i.Width, $i.Height); $i.Dispose()
}
