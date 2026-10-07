Add-Type -AssemblyName System.Drawing
$base = 'E:\PROJECTS\StyBay Website'
$files = @(Get-ChildItem -LiteralPath "$base\public\assets\products" -File | Sort-Object { [int]($_.BaseName -replace 'product','') })
$bitmap = New-Object System.Drawing.Bitmap(1200,1100)
$g = [System.Drawing.Graphics]::FromImage($bitmap)
$g.Clear([System.Drawing.Color]::White)
$font = New-Object System.Drawing.Font('Arial',14)
for ($i=0; $i -lt $files.Count; $i++) {
 $img = [System.Drawing.Image]::FromFile($files[$i].FullName)
 $x = ($i % 5)*240; $y = [math]::Floor($i/5)*275
 $scale = [math]::Min(230/$img.Width,240/$img.Height)
 $g.DrawImage($img,[int]($x+(230-$img.Width*$scale)/2),[int]$y,[int]($img.Width*$scale),[int]($img.Height*$scale))
 $g.DrawString($files[$i].Name,$font,[System.Drawing.Brushes]::Black,$x+10,$y+245)
 $img.Dispose()
}
$bitmap.Save("$base\products-contact.jpg",[System.Drawing.Imaging.ImageFormat]::Jpeg)
$g.Dispose(); $bitmap.Dispose()
$files = @(Get-ChildItem -LiteralPath "$base\public\assets\ui-designs" -File)
$bitmap = New-Object System.Drawing.Bitmap(1540,670)
$g = [System.Drawing.Graphics]::FromImage($bitmap)
$g.Clear([System.Drawing.Color]::White)
for ($i=0; $i -lt $files.Count; $i++) {
 $img = [System.Drawing.Image]::FromFile($files[$i].FullName)
 $scale = [math]::Min(210/$img.Width,615/$img.Height)
 $g.DrawImage($img,[int]($i*220),10,[int]($img.Width*$scale),[int]($img.Height*$scale))
 $g.DrawString($files[$i].Name,$font,[System.Drawing.Brushes]::Black,$i*220+5,635)
 Write-Output ($files[$i].Name + ' ' + $img.Width + 'x' + $img.Height)
 $img.Dispose()
}
$bitmap.Save("$base\ui-contact.jpg",[System.Drawing.Imaging.ImageFormat]::Jpeg)
$g.Dispose(); $bitmap.Dispose()
