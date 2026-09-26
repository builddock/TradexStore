[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$ErrorActionPreference = 'Stop'

$root = Join-Path $PSScriptRoot '..'
$root = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$src  = Join-Path $root '_src'
$img  = Join-Path $root 'assets\img'
New-Item -ItemType Directory -Force -Path $src, $img | Out-Null

function Get-Ok($url, $out) {
  try {
    Invoke-WebRequest -Uri $url -OutFile $out -UseBasicParsing -TimeoutSec 120
    $len = (Get-Item $out).Length
    Write-Output ("OK   {0,-28} {1,10:N0} bytes" -f (Split-Path $out -Leaf), $len)
  } catch {
    Write-Output ("FAIL {0} :: {1}" -f (Split-Path $out -Leaf), $_.Exception.Message)
  }
}

$c = 'CgthaWRhX2NvZGVmeBJ6Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpZCiVodG1sXw'
$amp = [char]38

# ---- screen HTML sources -------------------------------------------------
$html = @{
  'home'    = '00065c64a38ab25a073acd46a123129c'
  'catalog' = '00065c64a413568305762c8b750e868f'
  'product' = '00065c64a3744fc805c2ffb84c23e3d2'
  'cart'    = '00065c64a0f1b0dc073acc137d0c8a6f'
}
$tail = 'EgoSBhD-4eypQxgBkgEjCgpwcm9qZWN0X2lkEhVCEzMyOTg2NDgxOTM2NDY0ODk1Mjk'
$base = 'https://contribution.usercontent.google.com/download?c=' + $c + $tail + $amp + 'filename=' + $amp + 'opi=89354086'

foreach ($k in $html.Keys) {
  Get-Ok $base (Join-Path $src "$k.html")
}

# ---- logo / avatar screens ----------------------------------------------
$svgs = @{
  'logo-nexus.svg'   = '00065c647c76308405762c8b750e868f'
  'logo-tradex.svg'  = '00065c6491de6f9c033859a1302cbf39'
}
$svgTail = 'EgoSBhD-4eypQxgBkgEjCgpwcm9qZWN0X2lkEhVCEzMyOTg2NDgxOTM2NDY0ODk1Mjk'
$svgBase = 'https://contribution.usercontent.google.com/download?c=' + $c + $svgTail + $amp + 'filename=' + $amp + 'opi=89354086'

foreach ($k in $svgs.Keys) {
  Get-Ok $svgBase (Join-Path $src $k)
}

# ---- screenshots (for the flow board) -----------------------------------
$shots = @{
  'shot-home.png'    = 'https://lh3.googleusercontent.com/aida/AEtjO1Vb5cTq5fDZGKSRmyTtBHZyjLhVMT35NU8eMgLBqAtO_gqB6d_Rw8uk_DKjW5rox2Sw1Vj_lyfDZz23TzIRTbctmq4haHRmX8nVzOZkhFE7V58fEku0GM0juCwMDiinYcrLngPOEL89H20OSU-ej0A7Gq0QHYL9TFOksNyUkYM2AHYbiCvMbpIyyIxi8mcpEUNMWSIkjVlUQ0vhTD24sGzsHW67KOsILK3A4atNZY4w6AyMCuK-Y2oo7A'
  'shot-catalog.png' = 'https://lh3.googleusercontent.com/aida/AEtjO1VvXpAHZUVJBf7lsrG-oCh_NdFc_FwdVLQqC0WSKKZwbKefyLCH0K8XJPQdixpl3rm9HArkZpQO2JbK4_vaO6jZHsl8lvlUuTKckkEpYhQy6UI1uADoMpzuxfGrxYwfT5uchACed8Y9lgL4oD8hMjzGCha6dBMa6amRuhVtN8yEiDoKvBfQ-JVMC8v-A7E73m5IPcHGz55VnCep1fa6HdF77ZGJ7M1R-OoeWEIPGdVXfVfJrgMt826PqA'
  'shot-product.png' = 'https://lh3.googleusercontent.com/aida/AEtjO1UQ6PXbVY4hKfj-_ubViaPxgxklcdaW1StQqViMsp6yEKJmiwXwldvz5HRASiiHUMF2J1P7HpobfRshACs0Ef9ESOY2_u3JZeWTcJEoUOrFGwez-62x_PzCVqp52F2SyWP37uWnCpRRXEZtZGaHYY26YrIpRKSw0mSN97L7WAao2kin3alD7Vqko6jeuKm7RxOetW2eiV1siaqIahRq-VOnewaVYUZQ3QNlSigoTNd7w9hrTWm4gKNS'
  'shot-cart.png'    = 'https://lh3.googleusercontent.com/aida/AEtjO1VcgBsZZmmgxZ4oGAoU4KZakX68HqreDP991rtGUAYk9KpvSDIYbb5aVCYURqe94KClFlywkKN_C4v7fG9ybyW3GyWk9y0keJFrNnYTuxR5Cc9D7yBHO3oUCbIjh-w-2nQu19v53YVJfETRxSJXralUXPv2uux6rjMu7Ir4QbwnY5dqioePk6cl4F5hueagyk-Y6NjruQ2K60CxzN4LgsM3lvzeEWC1dJIkDwT4K8TkhGGRwgLzSYHsNQ'
  'logo-nexus.png'   = 'https://lh3.googleusercontent.com/aida/AEtjO1VYLgrd0CwG4Qx6YW3S4So2umrlMb-nA4oZxjSIbZOFg0CYBiynS1ofeaOY1UX8G2CJ8JeGpdSSPW4dUydvd2uNLnkyRswrfDyixjY9tQ9w4SPmgJmfzm72o79MpOicAcDL794CquX4zLvcr-3eXjdKrssaJd9c-_dY7qOqUFxmlHQODzcO4iPqTvvyRb7PeBJKRh1zFarump614hLZgrpMLvY032FQPXLT76ru8_dw97dM2EtnzVwp'
  'logo-tradex.png'  = 'https://lh3.googleusercontent.com/aida/AEtjO1Xhseiu4gNUiw1MR_YLiNQK14F7mGG9J6FMdfxzUjmo5GI_wauRNCEQCFOJgYSAtS28CKzSolcdg-s189987hmzAjPUeZlLQyLSYP8NwUG0JWIGTlTEcTe1mPobWd0oX1c5wfeRXO3bwfjgbZHbX3uett--xFe_NukzDOpaHeaX0hYU6HxGGql9SR9G2_U-WkukHvqJA__j6oqXgJmPA01JgoZgG5HJrPNc8dV0Lerz6Dql8SNnEjyrpw'
  'avatar.png'       = 'https://lh3.googleusercontent.com/aida/AEtjO1XM0UYvJmA_CRUVNSz5iRIvyx1PGF3j_euXdEORyYAYnKW0Or_doOhf9PiXRmQT7mDDXBzLeHsKId1RkzwstIHux9Ze0TuOarKj-_EL_v_ZpkVk_qw8fk1tK8jDAT8u4Uh2SoDpi2aJ_j_7IzjcS_oitCbAhet7IwAdqIw4qSKb7Sj6ujoiMWGPbzbaeD2ATPxGxY0Y__NQ-VzXZZxUjtHFP4_4ishd6MfAdM5HrsUW8IQdT-WhuLyNfA'
}
foreach ($k in $shots.Keys) {
  Get-Ok $shots[$k] (Join-Path $src $k)
}

Write-Output '--- done ---'
