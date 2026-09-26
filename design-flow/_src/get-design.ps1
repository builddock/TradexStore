$root = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$src  = Join-Path $root '_src'

$f = Get-ChildItem "c:\Users\vipul\AppData\Roaming\Code\User\workspaceStorage\a94ce1c3cb8754ab792c76ec6227e6ad\GitHub.copilot-chat\chat-session-resources\52abaaea-5d88-46b7-abc6-91ee53709f77" -Recurse -Filter content.json |
      Sort-Object Length -Descending | Select-Object -First 1 -ExpandProperty FullName
Write-Output "source: $f"

$j = Get-Content $f -Raw | ConvertFrom-Json
$p = $j.projects | Where-Object { $_.name -eq 'projects/3298648193646489529' }
if (-not $p) { $p = $j.projects[0] }

Write-Output ("project: {0}  title: {1}" -f $p.name, $p.title)
Write-Output '--- keys ---'
$p.PSObject.Properties.Name
Write-Output '--- designTheme keys ---'
$p.designTheme.PSObject.Properties.Name

$p.designTheme.designMd | Set-Content -Encoding utf8 (Join-Path $src 'design-md.md')
Write-Output ("designMd chars: {0}" -f $p.designTheme.designMd.Length)
