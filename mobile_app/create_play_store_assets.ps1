Add-Type -AssemblyName System.Drawing

$outDir = "D:\Projects\fb4kdownloader\store_assets"
if (-not (Test-Path $outDir)) {
    New-Item -ItemType Directory -Path $outDir -Force | Out-Null
}

function Add-RoundedRect($path, $x, $y, $w, $h, $r) {
    $d = $r * 2
    $path.AddArc($x, $y, $d, $d, 180, 90)
    $path.AddArc($x + $w - $d, $y, $d, $d, 270, 90)
    $path.AddArc($x + $w - $d, $y + $h - $d, $d, $d, 0, 90)
    $path.AddArc($x, $y + $h - $d, $d, $d, 90, 90)
    $path.CloseFigure()
}

# =========================================================================
# 1. APP ICON (512 x 512 px)
# =========================================================================
$size = 512
$iconBmp = New-Object System.Drawing.Bitmap($size, $size)
$g = [System.Drawing.Graphics]::FromImage($iconBmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

$g.Clear([System.Drawing.Color]::Transparent)

# Squircle path
$path = New-Object System.Drawing.Drawing2D.GraphicsPath
$r = 110
Add-RoundedRect $path 12 12 ($size - 24) ($size - 24) $r

$bgBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 11, 15, 25))
$g.FillPath($bgBrush, $path)

$borderPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 6, 182, 212), 10)
$g.DrawPath($borderPen, $path)

# Subtle inner squircle
$inPath = New-Object System.Drawing.Drawing2D.GraphicsPath
Add-RoundedRect $inPath 50 50 ($size - 100) ($size - 100) ($r - 20)
$inBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 15, 23, 42))
$g.FillPath($inBrush, $inPath)

# Golden Arrow
$cx = 256
$cy = 230
$shaftW = 70
$shaftTop = 130
$shaftBot = 270

$goldBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 245, 158, 11))
$g.FillRectangle($goldBrush, ($cx - $shaftW / 2), $shaftTop, $shaftW, ($shaftBot - $shaftTop))

$headW = 140
$pts = @(
    (New-Object System.Drawing.PointF(($cx - $headW), $shaftBot)),
    (New-Object System.Drawing.PointF(($cx + $headW), $shaftBot)),
    (New-Object System.Drawing.PointF($cx, ($shaftBot + 120)))
)
$brightGoldBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 251, 191, 36))
$g.FillPolygon($brightGoldBrush, $pts)

# 4K badge
$f4k = New-Object System.Drawing.Font("Arial", 46, [System.Drawing.FontStyle]::Bold)
$badgeBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 56, 189, 248))
$g.DrawString("4K", $f4k, $badgeBrush, 310, 360)

$iconPath = Join-Path $outDir "app_icon_512x512.png"
$iconBmp.Save($iconPath, [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose()
$iconBmp.Dispose()
Write-Host "Generated App Icon: $iconPath"

# =========================================================================
# 2. FEATURE GRAPHIC (1024 x 500 px)
# =========================================================================
$fw = 1024
$fh = 500
$featBmp = New-Object System.Drawing.Bitmap($fw, $fh)
$fg = [System.Drawing.Graphics]::FromImage($featBmp)
$fg.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$fg.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic

# Background gradient
$rect = New-Object System.Drawing.Rectangle(0, 0, $fw, $fh)
$cTop = [System.Drawing.Color]::FromArgb(255, 11, 15, 25)
$cBot = [System.Drawing.Color]::FromArgb(255, 15, 23, 42)
$linBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect, $cTop, $cBot, [System.Drawing.Drawing2D.LinearGradientMode]::Vertical)
$fg.FillRectangle($linBrush, $rect)

# Ambient glow circles
$glowBrush1 = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(40, 6, 182, 212))
$fg.FillEllipse($glowBrush1, -50, -50, 400, 400)
$glowBrush2 = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(35, 245, 158, 11))
$fg.FillEllipse($glowBrush2, 700, 150, 400, 400)

# Load and draw icon on left side
$srcIcon = [System.Drawing.Image]::FromFile($iconPath)
$fg.DrawImage($srcIcon, 80, 110, 260, 260)
$srcIcon.Dispose()

# Text
$fTitle = New-Object System.Drawing.Font("Arial", 46, [System.Drawing.FontStyle]::Bold)
$fSub = New-Object System.Drawing.Font("Arial", 22, [System.Drawing.FontStyle]::Bold)
$fDesc = New-Object System.Drawing.Font("Segoe UI", 16, [System.Drawing.FontStyle]::Regular)
$fBadge = New-Object System.Drawing.Font("Arial", 14, [System.Drawing.FontStyle]::Bold)

$whiteBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
$cyanBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 6, 182, 212))
$goldTextBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 251, 191, 36))
$mutedBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 156, 163, 175))

$fg.DrawString("FB4K Downloader", $fTitle, $whiteBrush, 380, 125)
$fg.DrawString("Fast 4K Ultra HD & Reels Saver", $fSub, $goldTextBrush, 385, 195)
$descLine = "Download high-definition videos, reels, and 320kbps MP3s.`nSmart clipboard link detection • Zero watermarks • 100% Free"
$fg.DrawString($descLine, $fDesc, $mutedBrush, 385, 240)

# Feature Badges
$badges = @("Fast 1-Tap Download", "4K UHD & 1080p", "320kbps MP3", "100% Free & Safe")
$bx = 385
$by = 330
foreach ($b in $badges) {
    $bSize = $fg.MeasureString($b, $fBadge)
    $bw = $bSize.Width + 24
    $bh = 38
    $bPath = New-Object System.Drawing.Drawing2D.GraphicsPath
    Add-RoundedRect $bPath $bx $by $bw $bh 16
    $bBg = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(220, 15, 23, 42))
    $bBorder = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(180, 6, 182, 212), 2)
    $fg.FillPath($bBg, $bPath)
    $fg.DrawPath($bBorder, $bPath)
    $fg.DrawString($b, $fBadge, $whiteBrush, ($bx + 12), ($by + 8))
    $bx += $bw + 12
}

$featPath = Join-Path $outDir "feature_graphic_1024x500.png"
$featBmp.Save($featPath, [System.Drawing.Imaging.ImageFormat]::Png)
$fg.Dispose()
$featBmp.Dispose()
Write-Host "Generated Feature Graphic: $featPath"

# =========================================================================
# 3. PHONE SCREENSHOTS (1080 x 1920 px)
# =========================================================================
$sw = 1080
$sh = 1920

$shots = @(
    @{ Title = "Download FB Reels in 4K"; Sub = "Ultra-Fast Multi-Threaded Video Engine"; Color = [System.Drawing.Color]::FromArgb(255, 6, 182, 212) },
    @{ Title = "Smart Auto-Detection"; Sub = "Auto-fetches video links copied to clipboard"; Color = [System.Drawing.Color]::FromArgb(255, 245, 158, 11) },
    @{ Title = "Multiple HD Formats"; Sub = "Save in 4K, 1080p, 720p or extract 320kbps MP3"; Color = [System.Drawing.Color]::FromArgb(255, 16, 185, 129) }
)

$i = 1
foreach ($s in $shots) {
    $sBmp = New-Object System.Drawing.Bitmap($sw, $sh)
    $sg = [System.Drawing.Graphics]::FromImage($sBmp)
    $sg.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $sg.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic

    # Dark background
    $sRect = New-Object System.Drawing.Rectangle(0, 0, $sw, $sh)
    $sTop = [System.Drawing.Color]::FromArgb(255, 3, 7, 18)
    $sBot = [System.Drawing.Color]::FromArgb(255, 17, 24, 39)
    $sLin = New-Object System.Drawing.Drawing2D.LinearGradientBrush($sRect, $sTop, $sBot, [System.Drawing.Drawing2D.LinearGradientMode]::Vertical)
    $sg.FillRectangle($sLin, $sRect)

    # Ambient glow
    $sColor = $s.Color
    $sGlow = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(40, $sColor.R, $sColor.G, $sColor.B))
    $sg.FillEllipse($sGlow, 140, 100, 800, 800)

    # Top Title Card
    $fSTitle = New-Object System.Drawing.Font("Arial", 46, [System.Drawing.FontStyle]::Bold)
    $fSSub = New-Object System.Drawing.Font("Segoe UI", 24, [System.Drawing.FontStyle]::Regular)
    $sTextBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
    $sAccentBrush = New-Object System.Drawing.SolidBrush($sColor)

    $tSize = $sg.MeasureString($s.Title, $fSTitle)
    $sg.DrawString($s.Title, $fSTitle, $sTextBrush, (($sw - $tSize.Width) / 2), 150)

    $subSize = $sg.MeasureString($s.Sub, $fSSub)
    $sg.DrawString($s.Sub, $fSSub, $sAccentBrush, (($sw - $subSize.Width) / 2), 230)

    # Simulated Mobile Phone Frame in center
    $phoneX = 140
    $phoneY = 340
    $phoneW = 800
    $phoneH = 1450
    $phonePath = New-Object System.Drawing.Drawing2D.GraphicsPath
    Add-RoundedRect $phonePath $phoneX $phoneY $phoneW $phoneH 55

    $phoneBg = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 11, 15, 25))
    $phoneBorder = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 31, 41, 55), 8)
    $sg.FillPath($phoneBg, $phonePath)
    $sg.DrawPath($phoneBorder, $phonePath)

    # Inside phone mockup: Draw Brand Squircle
    $mockIcon = [System.Drawing.Image]::FromFile($iconPath)
    $sg.DrawImage($mockIcon, 440, 480, 200, 200)
    $mockIcon.Dispose()

    # Mockup URL input bar
    $barPath = New-Object System.Drawing.Drawing2D.GraphicsPath
    Add-RoundedRect $barPath 200 740 680 90 20
    $barBg = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 15, 23, 42))
    $barBorder = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 6, 182, 212), 3)
    $sg.FillPath($barBg, $barPath)
    $sg.DrawPath($barBorder, $barPath)

    $fBar = New-Object System.Drawing.Font("Segoe UI", 20, [System.Drawing.FontStyle]::Regular)
    $barTextBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 148, 163, 184))
    $sg.DrawString("https://www.facebook.com/reel/98234...", $fBar, $barTextBrush, 230, 765)

    # Download Button
    $btnPath = New-Object System.Drawing.Drawing2D.GraphicsPath
    Add-RoundedRect $btnPath 200 870 680 95 24
    $btnBg = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 6, 182, 212))
    $sg.FillPath($btnBg, $btnPath)

    $fBtn = New-Object System.Drawing.Font("Arial", 28, [System.Drawing.FontStyle]::Bold)
    $btnTextBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 3, 7, 18))
    $btnTitle = "Download High Quality"
    $btnSize = $sg.MeasureString($btnTitle, $fBtn)
    $sg.DrawString($btnTitle, $fBtn, $btnTextBrush, (($sw - $btnSize.Width) / 2), 895)

    # Resolution Cards
    $cards = @(
        @{ Res = "4K Ultra HD (60 FPS)"; Size = "2160p - 145 MB"; Tag = "MAX QUALITY"; Bg = [System.Drawing.Color]::FromArgb(255, 245, 158, 11) },
        @{ Res = "1080p Full HD"; Size = "1080p - 48 MB"; Tag = "FAST"; Bg = [System.Drawing.Color]::FromArgb(255, 6, 182, 212) },
        @{ Res = "320kbps MP3 Audio"; Size = "Audio - 4.2 MB"; Tag = "AUDIO ONLY"; Bg = [System.Drawing.Color]::FromArgb(255, 16, 185, 129) }
    )
    $cy = 1010
    foreach ($c in $cards) {
        $cPath = New-Object System.Drawing.Drawing2D.GraphicsPath
        Add-RoundedRect $cPath 200 $cy 680 120 20
        $cBg = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 15, 23, 42))
        $cBorder = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 55, 65, 81), 2)
        $sg.FillPath($cBg, $cPath)
        $sg.DrawPath($cBorder, $cPath)

        $fCardT = New-Object System.Drawing.Font("Arial", 22, [System.Drawing.FontStyle]::Bold)
        $fCardS = New-Object System.Drawing.Font("Segoe UI", 18, [System.Drawing.FontStyle]::Regular)
        $sg.DrawString($c.Res, $fCardT, $whiteBrush, 230, ($cy + 25))
        $sg.DrawString($c.Size, $fCardS, $mutedBrush, 230, ($cy + 65))

        # Tag pill
        $fTag = New-Object System.Drawing.Font("Arial", 14, [System.Drawing.FontStyle]::Bold)
        $tagPath = New-Object System.Drawing.Drawing2D.GraphicsPath
        Add-RoundedRect $tagPath 690 ($cy + 38) 160 40 12
        $tagBg = New-Object System.Drawing.SolidBrush($c.Bg)
        $sg.FillPath($tagBg, $tagPath)
        $tagText = $c.Tag
        $tagSize = $sg.MeasureString($tagText, $fTag)
        $sg.DrawString($tagText, $fTag, $btnTextBrush, (690 + (160 - $tagSize.Width) / 2), ($cy + 48))

        $cy += 145
    }

    $shotPath = Join-Path $outDir "screenshot_${i}_1080x1920.png"
    $sBmp.Save($shotPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $sg.Dispose()
    $sBmp.Dispose()
    Write-Host "Generated Screenshot ${i}: $shotPath"
    $i++
}

Write-Host "All Play Store Assets Generated in $outDir Successfully!"
