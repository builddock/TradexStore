[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$ErrorActionPreference = 'Stop'

$src = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$src = Join-Path $src '_src'
New-Item -ItemType Directory -Force -Path $src | Out-Null

function Get-Ok($url, $out) {
  try {
    Invoke-WebRequest -Uri $url -OutFile $out -UseBasicParsing -TimeoutSec 180
    Write-Output ("OK   {0,-24} {1,10:N0} bytes" -f (Split-Path $out -Leaf), (Get-Item $out).Length)
  } catch {
    Write-Output ("FAIL {0,-24} {1}" -f (Split-Path $out -Leaf), $_.Exception.Message)
  }
}

$urls = [ordered]@{
  'home.html' = 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ6Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpZCiVodG1sXzAwMDY1YzY0YTM4YWIyNWEwNzNhY2Q0NmExMjMxMjljEgoSBhD-4eypQxgBkgEjCgpwcm9qZWN0X2lkEhVCEzMyOTg2NDgxOTM2NDY0ODk1Mjk&filename=&opi=89354086'
  'catalog.html' = 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ6Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpZCiVodG1sXzAwMDY1YzY0YTQxMzU2ODMwNTc2MmM4Yjc1MGU4NjhmEgoSBhD-4eypQxgBkgEjCgpwcm9qZWN0X2lkEhVCEzMyOTg2NDgxOTM2NDY0ODk1Mjk&filename=&opi=89354086'
  'product.html' = 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ6Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpZCiVodG1sXzAwMDY1YzY0YTM3NDRmYzgwNWMyZmZiODRjMjNlM2QyEgoSBhD-4eypQxgBkgEjCgpwcm9qZWN0X2lkEhVCEzMyOTg2NDgxOTM2NDY0ODk1Mjk&filename=&opi=89354086'
  'cart.html' = 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ6Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpZCiVodG1sXzAwMDY1YzY0YTBmMWIwZGMwNzNhY2MxMzdkMGM4YTZmEgoSBhD-4eypQxgBkgEjCgpwcm9qZWN0X2lkEhVCEzMyOTg2NDgxOTM2NDY0ODk1Mjk&filename=&opi=89354086'
  'logo-nexus.svg' = 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ6Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpZCiVodG1sXzAwMDY1YzY0N2M3NjMwODQwNTc2MmM4Yjc1MGU4NjhmEgoSBhD-4eypQxgBkgEjCgpwcm9qZWN0X2lkEhVCEzMyOTg2NDgxOTM2NDY0ODk1Mjk&filename=&opi=89354086'
  'logo-tradex.svg' = 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ6Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpZCiVodG1sXzAwMDY1YzY0OTFkZTZmOWMwMzM4NTlhMTMwMmNiZjM5EgoSBhD-4eypQxgBkgEjCgpwcm9qZWN0X2lkEhVCEzMyOTg2NDgxOTM2NDY0ODk1Mjk&filename=&opi=89354086'
  'avatar.png' = 'https://lh3.googleusercontent.com/aida/AEtjO1XM0UYvJmA_CRUVNSz5iRIvyx1PGF3j_euXdEORyYAYnKW0Or_doOhf9PiXRmQT7mDDXBzLeHsKId1RkzwstIHux9Ze0TuOarKj-_EL_v_ZpkVk_qw8fk1tK8jDAT8u4Uh2SoDpi2aJ_j_7IzjcS_oitCbAhet7IwAdqIw4qSKb7Sj6ujoiMWGPbzbaeD2ATPxGxY0Y__NQ-VzXZZxUjtHFP4_4ishd6MfAdM5HrsUW8IQdT-WhuLyNfA'
}

foreach ($k in $urls.Keys) { Get-Ok $urls[$k] (Join-Path $src $k) }

Write-Output '--- files ---'
Get-ChildItem $src -File | Select-Object Name, Length | Sort-Object Name | Format-Table -AutoSize
