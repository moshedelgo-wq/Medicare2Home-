param([string]$Domain)
if (-not $Domain) { $Domain = Read-Host "Enter production domain, e.g. https://www.example.co.il" }
$Domain=$Domain.TrimEnd('/')
if ($Domain -notmatch '^https://') { Write-Host 'ERROR: Use the full HTTPS URL.' -ForegroundColor Red; exit 1 }
$root=Split-Path -Parent $MyInvocation.MyCommand.Path
Get-ChildItem $root -Recurse -File | Where-Object { $_.Extension -in '.html','.xml','.txt','.webmanifest' } | ForEach-Object {
  $c=Get-Content $_.FullName -Raw -Encoding UTF8
  $c=$c.Replace('__SITE_URL__',$Domain)
  $c=$c.Replace('content="noindex,nofollow" name="robots"','content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" name="robots"')
  Set-Content $_.FullName $c -Encoding UTF8
}
Set-Content (Join-Path $root 'robots.txt') "User-agent: *`nAllow: /`nSitemap: $Domain/sitemap.xml`n" -Encoding UTF8
Write-Host "Configured for $Domain" -ForegroundColor Green
Write-Host 'Now upload the CONTENTS of this folder to the HTTPS web root.'
