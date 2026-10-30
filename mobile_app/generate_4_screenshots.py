import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

def create_4_screenshots():
    folder = r"C:\Users\SRKAMD\OneDrive\Desktop\FB4K_Chrome_Store_Assets"
    os.makedirs(folder, exist_ok=True)
    
    W, H = 1280, 800
    font_bold = "C:\\Windows\\Fonts\\segoeuib.ttf"
    font_reg = "C:\\Windows\\Fonts\\segoeui.ttf"
    font_extra = "C:\\Windows\\Fonts\\arialbd.ttf"
    
    f_badge = ImageFont.truetype(font_bold, 18)
    f_title = ImageFont.truetype(font_extra, 38)
    f_sub = ImageFont.truetype(font_reg, 21)
    
    # 4 Screenshot Themes & Definitions
    screens_data = [
        {
            "id": 1,
            "badge": "FEATURE 01: ON-REEL FLOATING BUTTON",
            "title": "1-Click Download Directly on Facebook Reels",
            "sub": "A sleek floating button appears right on every Reel for instant, in-browser downloading.",
            "img": r"C:\Users\SRKAMD\.gemini\antigravity\scratch\fdown-clone\images\preview-reels.png",
            "accent": (6, 182, 212) # Cyan
        },
        {
            "id": 2,
            "badge": "FEATURE 02: MULTI-FORMAT AUDIO & VIDEO",
            "title": "Extract 320kbps MP3 Audio & High-Res MP4",
            "sub": "Choose between 4K Ultra HD, 1080p Full HD, or extract crystal-clear 320kbps MP3 audio.",
            "img": r"C:\Users\SRKAMD\.gemini\antigravity\scratch\fdown-clone\images\preview-mp3.png",
            "accent": (245, 158, 11) # Gold
        },
        {
            "id": 3,
            "badge": "FEATURE 03: SMART EXTENSION POPUP",
            "title": "Auto-Detect Active Reels with 1-Tap Control",
            "sub": "Quick access toolbar popup instantly identifies the playing video and starts downloading.",
            "img": r"C:\Users\SRKAMD\.gemini\antigravity\scratch\fdown-clone\images\preview-desktop-home.png",
            "accent": (168, 85, 247) # Purple
        },
        {
            "id": 4,
            "badge": "FEATURE 04: PRIVACY & HIGH SPEED",
            "title": "Zero-Disk Storage & Ad-Free Experience",
            "sub": "Direct in-browser stream capture with no sketchy popups, redirects, or permanent logging.",
            "img": r"C:\Users\SRKAMD\.gemini\antigravity\scratch\fdown-clone\images\preview-blog.png",
            "accent": (16, 185, 129) # Emerald
        }
    ]
    
    for s in screens_data:
        screen = Image.new("RGBA", (W, H), (11, 15, 25, 255))
        draw = ImageDraw.Draw(screen)
        
        # Deep luxury dark gradient background
        for y in range(H):
            ratio = y / H
            r = int(9 + ratio * 10)
            g = int(13 + ratio * 13)
            b = int(27 + ratio * 28)
            draw.line([(0, y), (W, y)], fill=(r, g, b, 255))
            
        # Ambient color glow
        glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        g_draw = ImageDraw.Draw(glow)
        g_draw.ellipse((-100, -100, 550, 450), fill=(s["accent"][0], s["accent"][1], s["accent"][2], 45))
        g_draw.ellipse((W - 450, 200, W + 100, H), fill=(245, 158, 11, 35))
        glow = glow.filter(ImageFilter.GaussianBlur(110))
        screen = Image.alpha_composite(screen, glow)
        draw = ImageDraw.Draw(screen)
        
        # Header Badge
        bb = draw.textbbox((0, 0), s["badge"], font=f_badge)
        bw = bb[2] - bb[0] + 36
        draw.rounded_rectangle([60, 40, 60 + bw, 76], radius=18, fill=(15, 23, 42, 230), outline=(s["accent"][0], s["accent"][1], s["accent"][2], 220), width=2)
        draw.text((78, 48), s["badge"], fill=s["accent"], font=f_badge)
        
        # Title & Subtitle
        draw.text((60, 95), s["title"], fill=(255, 255, 255), font=f_title)
        draw.text((60, 148), s["sub"], fill=(148, 163, 184), font=f_sub)
        
        # Embed Main Showcase Card
        img_path = s["img"]
        if os.path.exists(img_path):
            card_w = 1160
            card_h = 560
            
            raw_img = Image.open(img_path).convert("RGBA")
            rw, rh = raw_img.size
            ratio = card_w / rw
            new_h = int(rh * ratio)
            resized = raw_img.resize((card_w, new_h), Image.Resampling.LANCZOS)
            
            card_img = resized.crop((0, 0, card_w, card_h))
            
            # Rounded corners
            mask = Image.new("L", (card_w, card_h), 0)
            m_draw = ImageDraw.Draw(mask)
            m_draw.rounded_rectangle([0, 0, card_w, card_h], radius=20, fill=255)
            
            # Shadow
            sh = Image.new("RGBA", (W, H), (0, 0, 0, 0))
            sh_draw = ImageDraw.Draw(sh)
            sh_draw.rounded_rectangle([50, 205, 1230, 785], radius=28, fill=(0, 0, 0, 180))
            sh = sh.filter(ImageFilter.GaussianBlur(28))
            screen = Image.alpha_composite(screen, sh)
            
            screen.paste(card_img, (60, 195), mask)
            
            # Glowing Border
            draw = ImageDraw.Draw(screen)
            draw.rounded_rectangle([60, 195, 1220, 755], radius=20, outline=(s["accent"][0], s["accent"][1], s["accent"][2], 180), width=2)

        # Convert to 24-bit RGB (No Alpha) required by Chrome Web Store
        screen_rgb = screen.convert("RGB")
        
        png_out = os.path.join(folder, f"screenshot_{s['id']}_1280x800.png")
        jpg_out = os.path.join(folder, f"screenshot_{s['id']}_1280x800.jpg")
        
        screen_rgb.save(png_out, "PNG")
        screen_rgb.save(jpg_out, "JPEG", quality=95)
        print(f"Generated Screenshot {s['id']}: {png_out}")

create_4_screenshots()
