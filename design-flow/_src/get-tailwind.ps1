$src = Join-Path (Resolve-Path (Join-Path $PSScriptRoot '..')).Path '_src'
$t = Get-Content (Join-Path $src 'home.html') -Raw

$m = [regex]::Match($t, '(?is)<script[^>]*>\s*tailwind\.config\s*=.*?</script>')
if (-not $m.Success) {
  # fall back: grab the script containing tailwind.config
  $m = [regex]::Match($t, '(?is)<script[^>]*>(?:(?!</script>).)*?tailwind\.config(?:(?!</script>).)*?</script>')
}
Write-Output "MATCH: $($m.Success)  LEN: $($m.Value.Length)"
$m.Value | Set-Content -Encoding utf8 (Join-Path $src 'tailwind-config.txt')

Write-Output '=== first 200 chars of each <script> ==='
foreach ($s in [regex]::Matches($t, '(?is)<script[^>]*>(.*?)</script>')) {
  $body = $s.Groups[1].Value.Trim()
  if ($body.Length -gt 0) {
    Write-Output ('--- len={0} : {1}' -f $body.Length, ($body.Substring(0, [Math]::Min(160, $body.Length)) -replace "`r?`n", ' '))
  }
}
