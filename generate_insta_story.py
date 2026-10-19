import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

def create_insta_story():
    # 1080 x 1920 is the official 9:16 ratio for Instagram Stories, Facebook Stories, and WhatsApp Status
    W, H = 1080, 1920
    bg = Image.new("RGBA", (W, H), (11, 17, 32, 255))
    bg_draw = ImageDraw.Draw(bg)
    
    # Gradient
    for y in range(H):
        ratio = y / H
        r = int(8 + ratio * 14)
        g = int(12 + ratio * 16)
        b = int(26 + ratio * 32)
        bg_draw.line([(0, y), (W, y)], fill=(r, g, b, 255))
        
    # Ambient glows
    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    g_draw = ImageDraw.Draw(glow)
    g_draw.ellipse((-150, -50, 500, 550), fill=(6, 182, 212, 50))
    g_draw.ellipse((W - 350, 600, W + 250, 1200), fill=(245, 158, 11, 40))
    g_draw.ellipse((100, H - 450, 800, H + 200), fill=(59, 130, 246, 45))
    glow = glow.filter(ImageFilter.GaussianBlur(130))
    bg = Image.alpha_composite(bg, glow)
    
    draw = ImageDraw.Draw(bg)
    
    # Fonts
    font_bold = "C:\\Windows\\Fonts\\segoeuib.ttf"
    font_reg = "C:\\Windows\\Fonts\\segoeui.ttf"
    font_extra = "C:\\Windows\\Fonts\\arialbd.ttf"
    
    f_badge = ImageFont.truetype(font_bold, 26)
    f_title = ImageFont.truetype(font_extra, 56)
    f_sub = ImageFont.truetype(font_reg, 30)
    f_feature = ImageFont.truetype(font_bold, 25)
    f_cta_sub = ImageFont.truetype(font_bold, 30)
    f_url = ImageFont.truetype(font_extra, 54)
    f_footer = ImageFont.truetype(font_reg, 24)

    # 1. Header Pill
    top_badge = "REELS & VIDEO DOWNLOADER"
    tb_bb = draw.textbbox((0, 0), top_badge, font=f_badge)
    tb_w = tb_bb[2] - tb_bb[0] + 50
    tb_x = (W - tb_w) // 2
    draw.rounded_rectangle([tb_x, 100, tb_x + tb_w, 152], radius=26, fill=(15, 23, 42, 220), outline=(6, 182, 212, 220), width=3)
    draw.text((tb_x + 25, 110), top_badge, fill=(6, 182, 212, 255), font=f_badge)

    # 2. Main Title
    t1 = "Download Facebook"
    t2 = "Reels in 4K Quality"
    t1_bb = draw.textbbox((0, 0), t1, font=f_title)
    t2_bb = draw.textbbox((0, 0), t2, font=f_title)
    
    draw.text(((W - (t1_bb[2] - t1_bb[0])) // 2, 180), t1, fill=(255, 255, 255), font=f_title)
    draw.text(((W - (t2_bb[2] - t2_bb[0])) // 2, 255), t2, fill=(251, 191, 36), font=f_title)

    sub_t = "Zero Watermark  |  Full 9:16 Ratio  |  MP4 & MP3"
    st_bb = draw.textbbox((0, 0), sub_t, font=f_sub)
    draw.text(((W - (st_bb[2] - st_bb[0])) // 2, 345), sub_t, fill=(148, 163, 184), font=f_sub)

    # 3. Center Reels UI Card
    img_path = r"C:\Users\SRKAMD\.gemini\antigravity\scratch\fdown-clone\images\preview-reels.png"
    if os.path.exists(img_path):
        preview = Image.open(img_path).convert("RGBA")
        target_card_w = 940
        target_card_h = 700
        
        p_w, p_h = preview.size
        ratio = target_card_w / p_w
        new_h = int(p_h * ratio)
        preview_resized = preview.resize((target_card_w, new_h), Image.Resampling.LANCZOS)
        
        card_content = preview_resized.crop((0, 0, target_card_w, target_card_h))
        
        mask = Image.new("L", (target_card_w, target_card_h), 0)
        mask_draw = ImageDraw.Draw(mask)
        mask_draw.rounded_rectangle([0, 0, target_card_w, target_card_h], radius=28, fill=255)
        
        card_x = (W - target_card_w) // 2
        card_y = 425
        
        shadow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        sh_draw = ImageDraw.Draw(shadow)
        sh_draw.rounded_rectangle([card_x - 14, card_y + 12, card_x + target_card_w + 14, card_y + target_card_h + 35], radius=36, fill=(0, 0, 0, 180))
        shadow = shadow.filter(ImageFilter.GaussianBlur(32))
        bg = Image.alpha_composite(bg, shadow)
        
        bg.paste(card_content, (card_x, card_y), mask)
        
        draw = ImageDraw.Draw(bg)
        draw.rounded_rectangle([card_x, card_y, card_x + target_card_w, card_y + target_card_h], radius=28, outline=(56, 189, 248, 190), width=3)

    # 4. Feature Badges in Grid
    badges = [
        ("4K Ultra HD & 1080p", (14, 165, 233)),
        ("320kbps MP3 Audio", (245, 158, 11)),
        ("No Watermark Added", (16, 185, 129)),
        ("100% Free & Fast", (168, 85, 247))
    ]
    
    b_start_y = 1170
    row1 = badges[:2]
    row2 = badges[2:]
    
    for row_idx, row in enumerate([row1, row2]):
        y = b_start_y + row_idx * 65
        w_item = 445
        gap = 20
        start_x = (W - (w_item * 2 + gap)) // 2
        for col_idx, (b_text, col) in enumerate(row):
            bx = start_x + col_idx * (w_item + gap)
            draw.rounded_rectangle([bx, y, bx + w_item, y + 48], radius=24, fill=(15, 23, 42, 230), outline=col, width=2)
            t_bb = draw.textbbox((0, 0), b_text, font=f_feature)
            draw.text((bx + (w_item - (t_bb[2] - t_bb[0])) // 2, y + 10), b_text, fill=(255, 255, 255), font=f_feature)

    # 5. Giant Glowing Website URL Hero Box
    box_w = 940
    box_h = 220
    box_x = (W - box_w) // 2
    box_y = 1350

    glow_box = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gb_draw = ImageDraw.Draw(glow_box)
    gb_draw.rounded_rectangle([box_x - 15, box_y - 12, box_x + box_w + 15, box_y + box_h + 15], radius=42, fill=(245, 158, 11, 75))
    glow_box = glow_box.filter(ImageFilter.GaussianBlur(36))
    bg = Image.alpha_composite(bg, glow_box)
    draw = ImageDraw.Draw(bg)

    draw.rounded_rectangle([box_x, box_y, box_x + box_w, box_y + box_h], radius=32, fill=(15, 23, 42, 255), outline=(245, 158, 11, 245), width=3)

    cta_label = "OPEN IN YOUR BROWSER:"
    cl_bb = draw.textbbox((0, 0), cta_label, font=f_cta_sub)
    draw.text(((W - (cl_bb[2] - cl_bb[0])) // 2, box_y + 26), cta_label, fill=(226, 232, 240), font=f_cta_sub)

    pill_w = 860
    pill_h = 92
    up_x = (W - pill_w) // 2
    up_y = box_y + 85
    draw.rounded_rectangle([up_x, up_y, up_x + pill_w, up_y + pill_h], radius=26, fill=(245, 158, 11, 255))
    
    url_text = "fb4kdownloader.com"
    u_bb = draw.textbbox((0, 0), url_text, font=f_url)
    draw.text(((W - (u_bb[2] - u_bb[0])) // 2, up_y + 14), url_text, fill=(11, 15, 25), font=f_url)

    # 6. Bottom Story Indicator
    story_cta = "No App Installation Required - Works on All Devices"
    sc_bb = draw.textbbox((0, 0), story_cta, font=f_footer)
    draw.text(((W - (sc_bb[2] - sc_bb[0])) // 2, 1620), story_cta, fill=(148, 163, 184), font=f_footer)
    
    out_file = r"C:\Users\SRKAMD\.gemini\antigravity\scratch\fdown-clone\fb4k_insta_story_reel.png"
    bg.save(out_file, "PNG", quality=95)
    print(f"Generated: {out_file}")

create_insta_story()
