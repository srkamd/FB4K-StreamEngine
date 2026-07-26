Add-Type -AssemblyName System.Drawing

$brainDir = "C:\Users\SRKAMD\.gemini\antigravity\brain\7ce94da0-9b86-49f1-ad7e-11fc02eb4cd4"
$latestFile = Get-ChildItem -Path $brainDir -Filter *.png | Sort-Object LastWriteTime -Descending | Select-Object -First 1

if ($latestFile) {
    Write-Host "✅ Found User Uploaded Screenshot File:" $latestFile.FullName
    $srcImg = [System.Drawing.Image]::FromFile($latestFile.FullName)
    $bmp = New-Object System.Drawing.Bitmap(1280, 800)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.DrawImage($srcImg, 0, 0, 1280, 800)
    
    $dest1 = "C:\Users\SRKAMD\.gemini\antigravity\scratch\fdown-clone\USER_WEBSITE_SCREENSHOT_1280x800.png"
    $dest2 = "C:\Users\SRKAMD\.gemini\antigravity\scratch\fdown-clone\EXACT_2_screenshot_1280x800.png"
    
    $bmp.Save($dest1, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Save($dest2, [System.Drawing.Imaging.ImageFormat]::Png)
    
    $g.Dispose()
    $bmp.Dispose()
    $srcImg.Dispose()
    Write-Host "🎉 SUCCESSFULLY CONVERTED USER SCREENSHOT TO EXACT 1280x800 PNG!"
}
