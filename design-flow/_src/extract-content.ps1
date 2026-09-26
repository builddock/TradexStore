$root = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$src  = Join-Path $root '_src'
$map  = @{}
foreach ($line in Get-Content (Join-Path $src 'image-map.tsv')) {
  $parts = $line -split "`t"
  if ($parts.Count -eq 2) { $map[$parts[1]] = $parts[0] }
}

foreach ($f in @('home.html','catalog.html','product.html','cart.html')) {
  $p = Join-Path $src $f
  $t = Get-Content $p -Raw

  # remove script + style blocks
  $t = [regex]::Replace($t, '(?is)<script.*?</script>', ' ')
  $t = [regex]::Replace($t, '(?is)<style.*?</style>', ' ')
  $t = [regex]::Replace($t, '(?is)<!--.*?-->', ' ')

  # images -> marker with alt and local file
  $t = [regex]::Replace($t, '(?is)<img\b[^>]*>', {
    param($m)
    $tag = $m.Value
    $s = [regex]::Match($tag, 'src="([^"]+)"').Groups[1].Value
    $a = [regex]::Match($tag, 'alt="([^"]*)"').Groups[1].Value
    $cls = [regex]::Match($tag, 'class="([^"]*)"').Groups[1].Value
    $file = if ($map.ContainsKey($s)) { $map[$s] } else { 'UNKNOWN' }
    $sz = if ($cls -match 'w-\[(\d+)px\]') { "w=$($Matches[1])" } else { '' }
    "`n[[IMG $file alt=`"$a`" $sz]]`n"
  })

  # background images
  $t = [regex]::Replace($t, 'background-image:\s*url\(([^)]+)\)', {
    param($m)
    $s = $m.Groups[1].Value.Trim('''', '"')
    $file = if ($map.ContainsKey($s)) { $map[$s] } else { 'UNKNOWN' }
    "`n[[BG-IMG $file]]`n"
  })

  $t = [regex]::Replace($t, '(?is)<(br|/div|/p|/h[1-6]|/li|/a|/button|/span|/section|/footer|/header)\b[^>]*>', "`n")
  $t = [regex]::Replace($t, '(?is)<[^>]+>', ' ')
  $t = [System.Net.WebUtility]::HtmlDecode($t)
  $t = [regex]::Replace($t, '[ \t]+', ' ')

  $lines = $t -split "`n" | ForEach-Object { $_.Trim() } | Where-Object { $_ -ne '' }
  # collapse consecutive duplicates
  $out = New-Object System.Collections.Generic.List[string]
  $prev = $null
  foreach ($l in $lines) { if ($l -ne $prev) { $out.Add($l); $prev = $l } }

  $dest = Join-Path $src ("content-" + [IO.Path]::GetFileNameWithoutExtension($f) + ".txt")
  $out | Set-Content -Encoding utf8 $dest
  Write-Output ("{0} -> {1} lines" -f $f, $out.Count)
}
