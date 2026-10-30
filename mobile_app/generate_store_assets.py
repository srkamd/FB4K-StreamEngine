import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

def create_store_assets():
    desktop_dir = r"C:\Users\SRKAMD\OneDrive\Desktop\FB4K_Chrome_Store_Assets"
    os.makedirs(desktop_dir, exist_ok=True)
    
    font_bold = "C:\\Windows\\Fonts\\segoeuib.ttf"
    font_reg = "C:\\Windows\\Fonts\\segoeui.ttf"
    font_extra = "C:\\Windows\\Fonts\\arialbd.ttf"
    
    # ==========================================
    # 1. ICON GENERATOR (16, 32, 48, 128, 512)
    # ==========================================
    icon_sizes = [16, 32, 48, 128, 512]
    for size in icon_sizes:
        img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
        draw = ImageDraw.Draw(img)
        
        radius = max(2, int(size * 0.22))
        
        # Outer squircle with neon border
        draw.rounded_rectangle([0, 0, size - 1, size - 1], radius=radius, fill=(11, 15, 25, 255), outline=(6, 182, 212, 255), width=max(1, size // 32))
        
        # Subtle inner glow / gradient box
        pad = max(1, size // 10)
        draw.rounded_rectangle([pad, pad, size - 1 - pad, size - 1 - pad], radius=max(2, radius - 2), fill=(15, 23, 42, 255))
        
        # Vibrant Golden Down-Arrow
        cx = size // 2
        cy = size // 2
        
        shaft_w = max(2, size // 6)
        shaft_top = max(pad + 2, cy - size // 4)
        shaft_bot = cy + size // 14
        draw.rectangle([cx - shaft_w // 2, shaft_top, cx + shaft_w // 2, shaft_bot], fill=(245, 158, 11, 255))
        
        head_size = max(3, size // 3)
        pts = [
            (cx - head_size, shaft_bot),
            (cx + head_size, shaft_bot),
            (cx, shaft_bot + int(head_size * 0.85))
        ]
        draw.polygon(pts, fill=(251, 191, 36, 255))
        
        # "4K" text for larger icons
        if size >= 48:
            try:
                f_size = size // 4
                f_4k = ImageFont.truetype(font_extra, f_size)
                draw.text((size - f_size * 2 + 2, pad + 2), "4K", fill=(56, 189, 248, 255), font=f_4k)
            except Exception:
                pass
                
        out_path = os.path.join(desktop_dir, f"icon{size}.png")
        img.save(out_path, "PNG")
        
        # Also copy into extension directory
        ext_icon_path = os.path.join(r"C:\Users\SRKAMD\.gemini\antigravity\scratch\fdown-clone\extension", f"icon{size}.png")
        if size in [16, 32, 48, 128]:
            img.save(ext_icon_path, "PNG")
            
    print("Icons generated successfully!")

    # ==========================================
    # 2. SMALL PROMO TILE (440 x 280) — Required
    # ==========================================
    W, H = 440, 280
    promo_small = Image.new("RGBA", (W, H), (11, 15, 25, 255))
    p_draw = ImageDraw.Draw(promo_small)
    
    # Gradient
    for y in range(H):
        ratio = y / H
        r = int(11 + ratio * 8)
        g = int(17 + ratio * 10)
        b = int(32 + ratio * 20)
        p_draw.line([(0, y), (W, y)], fill=(r, g, b, 255))
        
    # Glows
    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    g_draw = ImageDraw.Draw(glow)
    g_draw.ellipse((-50, -50, 200, 200), fill=(6, 182, 212, 60))
    g_draw.ellipse((W - 180, H - 180, W + 50, H + 50), fill=(245, 158, 11, 55))
    glow = glow.filter(ImageFilter.GaussianBlur(60))
    promo_small = Image.alpha_composite(promo_small, glow)
    p_draw = ImageDraw.Draw(promo_small)
    
    # App Icon in Promo
    icon_128 = Image.open(os.path.join(desktop_dir, "icon128.png")).resize((84, 84), Image.Resampling.LANCZOS)
    promo_small.paste(icon_128, (30, 98), icon_128)
    
    # Texts
    f_p_title = ImageFont.truetype(font_extra, 26)
    f_p_sub = ImageFont.truetype(font_bold, 15)
    f_p_tag = ImageFont.truetype(font_reg, 13)
    f_p_badge = ImageFont.truetype(font_bold, 11)
    
    p_draw.text((130, 95), "FB4KDownloader", fill=(255, 255, 255), font=f_p_title)
    p_draw.text((130, 132), "4K Facebook Reel Downloader", fill=(251, 191, 36), font=f_p_sub)
    p_draw.text((130, 158), "1-Click Direct Download • High-Speed", fill=(148, 163, 184), font=f_p_tag)
    
    # Badges
    badges = ["4K Ultra HD", "320kbps MP3", "Zero Watermark"]
    bx = 30
    for b in badges:
        bb = p_draw.textbbox((0, 0), b, font=f_p_badge)
        bw = bb[2] - bb[0] + 16
        p_draw.rounded_rectangle([bx, 205, bx + bw, 227], radius=11, fill=(15, 23, 42, 220), outline=(6, 182, 212, 180), width=1)
        p_draw.text((bx + 8, 209), b, fill=(255, 255, 255), font=f_p_badge)
        bx += bw + 10
        
    promo_small_path = os.path.join(desktop_dir, "promo_small_440x280.png")
    promo_small.save(promo_small_path, "PNG", quality=95)
    print("Small Promo Tile 440x280 created!")

    # ==========================================
    # 3. MARQUEE BANNER (1400 x 560) — Featured
    # ==========================================
    MW, MH = 1400, 560
    marquee = Image.new("RGBA", (MW, MH), (11, 15, 25, 255))
    m_draw = ImageDraw.Draw(marquee)
    
    for y in range(MH):
        ratio = y / MH
        r = int(9 + ratio * 10)
        g = int(14 + ratio * 14)
        b = int(28 + ratio * 28)
        m_draw.line([(0, y), (MW, y)], fill=(r, g, b, 255))
        
    m_glow = Image.new("RGBA", (MW, MH), (0, 0, 0, 0))
    mg_draw = ImageDraw.Draw(m_glow)
    mg_draw.ellipse((-100, -100, 600, 500), fill=(6, 182, 212, 50))
    mg_draw.ellipse((MW - 500, 100, MW + 100, MH + 100), fill=(245, 158, 11, 45))
    m_glow = m_glow.filter(ImageFilter.GaussianBlur(120))
    marquee = Image.alpha_composite(marquee, m_glow)
    m_draw = ImageDraw.Draw(marquee)
    
    # Left Content
    f_m_super = ImageFont.truetype(font_bold, 20)
    f_m_title = ImageFont.truetype(font_extra, 54)
    f_m_sub = ImageFont.truetype(font_reg, 24)
    f_m_pill = ImageFont.truetype(font_bold, 20)
    
    m_draw.rounded_rectangle([80, 75, 410, 115], radius=20, fill=(15, 23, 42, 220), outline=(6, 182, 212, 200), width=2)
    m_draw.text((100, 83), "OFFICIAL CHROME EXTENSION", fill=(6, 182, 212), font=f_m_super)
    
    m_draw.text((80, 140), "FB4KDownloader", fill=(255, 255, 255), font=f_m_title)
    m_draw.text((80, 208), "4K Facebook Reels & Video Downloader", fill=(251, 191, 36), font=ImageFont.truetype(font_extra, 32))
    
    m_draw.text((80, 275), "Download high-definition Facebook Reels, videos, and 320kbps MP3s\ndirectly from your browser with a 1-click on-reel floating button.", fill=(148, 163, 184), font=f_m_sub)
    
    # Pill badges
    pills = ["⚡ 1-Click On-Reel Download", "🎬 4K UHD & 1080p Full HD", "🎧 320kbps MP3 Audio", "🔒 100% Free & Private"]
    py = 370
    px = 80
    for p in pills:
        bb = m_draw.textbbox((0, 0), p, font=f_m_pill)
        pw = bb[2] - bb[0] + 28
        m_draw.rounded_rectangle([px, py, px + pw, py + 46], radius=23, fill=(15, 23, 42, 230), outline=(56, 189, 248, 160), width=2)
        m_draw.text((px + 14, py + 10), p, fill=(255, 255, 255), font=f_m_pill)
        px += pw + 16
        if px > 750:
            px = 80
            py += 60
            
    # Right Side: 3D App Icon / Card Showcase
    icon_master = Image.open(os.path.join(desktop_dir, "icon512.png")).resize((280, 280), Image.Resampling.LANCZOS)
    
    # Shadow for icon
    sh = Image.new("RGBA", (MW, MH), (0, 0, 0, 0))
    sh_draw = ImageDraw.Draw(sh)
    sh_draw.rounded_rectangle([960, 140, 1260, 440], radius=50, fill=(0, 0, 0, 160))
    sh = sh.filter(ImageFilter.GaussianBlur(35))
    marquee = Image.alpha_composite(marquee, sh)
    
    marquee.paste(icon_master, (970, 130), icon_master)
    
    marquee_path = os.path.join(desktop_dir, "marquee_banner_1400x560.png")
    marquee.save(marquee_path, "PNG", quality=95)
    print("Marquee Banner 1400x560 created!")

    # ==========================================
    # 4. STORE SCREENSHOT (1280 x 800) — Required
    # ==========================================
    SW, SH = 1280, 800
    screen = Image.new("RGBA", (SW, SH), (11, 15, 25, 255))
    s_draw = ImageDraw.Draw(screen)
    
    for y in range(SH):
        ratio = y / SH
        r = int(8 + ratio * 12)
        g = int(12 + ratio * 16)
        b = int(26 + ratio * 30)
        s_draw.line([(0, y), (SW, y)], fill=(r, g, b, 255))
        
    s_glow = Image.new("RGBA", (SW, SH), (0, 0, 0, 0))
    sg_draw = ImageDraw.Draw(s_glow)
    sg_draw.ellipse((-80, -80, 500, 500), fill=(6, 182, 212, 45))
    sg_draw.ellipse((SW - 450, 150, SW + 100, SH), fill=(245, 158, 11, 40))
    s_glow = s_glow.filter(ImageFilter.GaussianBlur(100))
    screen = Image.alpha_composite(screen, s_glow)
    s_draw = ImageDraw.Draw(screen)
    
    f_s_title = ImageFont.truetype(font_extra, 42)
    f_s_sub = ImageFont.truetype(font_reg, 22)
    s_draw.text((60, 45), "FB4KDownloader — 1-Click On-Reel Downloader", fill=(255, 255, 255), font=f_s_title)
    s_draw.text((60, 105), "Directly integrates into Facebook Reels and Videos for instant, seamless downloads.", fill=(148, 163, 184), font=f_s_sub)
    
    preview_img_path = r"C:\Users\SRKAMD\.gemini\antigravity\scratch\fdown-clone\images\preview-reels.png"
    if os.path.exists(preview_img_path):
        prev = Image.open(preview_img_path).convert("RGBA")
        prev = prev.resize((1160, 580), Image.Resampling.LANCZOS)
        
        prev_mask = Image.new("L", (1160, 580), 0)
        pm_draw = ImageDraw.Draw(prev_mask)
        pm_draw.rounded_rectangle([0, 0, 1160, 580], radius=20, fill=255)
        
        sh_prev = Image.new("RGBA", (SW, SH), (0, 0, 0, 0))
        shp_draw = ImageDraw.Draw(sh_prev)
        shp_draw.rounded_rectangle([50, 170, 1230, 770], radius=24, fill=(0, 0, 0, 180))
        sh_prev = sh_prev.filter(ImageFilter.GaussianBlur(25))
        screen = Image.alpha_composite(screen, sh_prev)
        
        screen.paste(prev, (60, 160), prev_mask)
        
        s_draw = ImageDraw.Draw(screen)
        s_draw.rounded_rectangle([60, 160, 1220, 740], radius=20, outline=(56, 189, 248, 180), width=2)
        
    screen_path = os.path.join(desktop_dir, "screenshot_store_1280x800.png")
    screen.save(screen_path, "PNG", quality=95)
    print("Store Screenshot 1280x800 created!")

create_store_assets()
