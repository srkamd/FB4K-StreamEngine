import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

def create_mobile_social_graphic():
    # 1080 x 1350 is the optimal 4:5 vertical ratio for Instagram, LinkedIn Mobile, and Facebook Mobile
    W, H = 1080, 1350
    
    # 1. Background gradient
    bg = Image.new("RGBA", (W, H), (11, 17, 32, 255))
    bg_draw = ImageDraw.Draw(bg)
    
    for y in range(H):
        ratio = y / H
        r = int(7 + ratio * 13)
        g = int(11 + ratio * 15)
        b = int(25 + ratio * 28)
        bg_draw.line([(0, y), (W, y)], fill=(r, g, b, 255))
        
    # Ambient glows
    glow_cyan = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gc_draw = ImageDraw.Draw(glow_cyan)
    gc_draw.ellipse((-100, -50, 500, 500), fill=(6, 182, 212, 45))
    gc_draw.ellipse((W - 350, 400, W + 200, 950), fill=(245, 158, 11, 35))
    gc_draw.ellipse((W//2 - 250, H - 350, W//2 + 250, H + 150), fill=(59, 130, 246, 40))
    glow_cyan = glow_cyan.filter(ImageFilter.GaussianBlur(120))
    bg = Image.alpha_composite(bg, glow_cyan)

    draw = ImageDraw.Draw(bg)
    
    # Fonts
    font_bold = "C:\\Windows\\Fonts\\segoeuib.ttf"
    font_reg = "C:\\Windows\\Fonts\\segoeui.ttf"
    font_extra = "C:\\Windows\\Fonts\\arialbd.ttf"
    
    f_badge = ImageFont.truetype(font_bold, 24)
    f_title = ImageFont.truetype(font_extra, 52)
    f_sub = ImageFont.truetype(font_reg, 26)
    f_feature = ImageFont.truetype(font_bold, 23)
    f_cta_label = ImageFont.truetype(font_bold, 28)
    f_url = ImageFont.truetype(font_extra, 50)
    f_footer = ImageFont.truetype(font_reg, 22)

    # 2. Header Top Pill (Clean text without emoji glyph boxes)
    top_badge_text = "HIGH-PERFORMANCE MEDIA STREAM ENGINE"
    tb_bbox = draw.textbbox((0, 0), top_badge_text, font=f_badge)
    tb_w = tb_bbox[2] - tb_bbox[0] + 50
    tb_h = 46
    tb_x = (W - tb_w) // 2
    tb_y = 65
    draw.rounded_rectangle([tb_x, tb_y, tb_x + tb_w, tb_y + tb_h], radius=23, fill=(15, 23, 42, 210), outline=(6, 182, 212, 200), width=2)
    draw.text((tb_x + 25, tb_y + 9), top_badge_text, fill=(6, 182, 212, 255), font=f_badge)

    # 3. Main Headline
    title_line1 = "Download Facebook"
    title_line2 = "Reels & Videos in 4K"
    t1_bbox = draw.textbbox((0, 0), title_line1, font=f_title)
    t2_bbox = draw.textbbox((0, 0), title_line2, font=f_title)
    
    draw.text(((W - (t1_bbox[2] - t1_bbox[0])) // 2, 135), title_line1, fill=(255, 255, 255), font=f_title)
    draw.text(((W - (t2_bbox[2] - t2_bbox[0])) // 2, 198), title_line2, fill=(251, 191, 36), font=f_title)

    # Subtitle
    sub_text = "Fast In-Memory Streaming  |  320kbps MP3 Audio  |  Zero Disk Storage"
    s_bbox = draw.textbbox((0, 0), sub_text, font=f_sub)
    draw.text(((W - (s_bbox[2] - s_bbox[0])) // 2, 270), sub_text, fill=(148, 163, 184), font=f_sub)

    # 4. Center Product Showcase: Real Website UI with Glass Frame
    img_path = r"C:\Users\SRKAMD\.gemini\antigravity\scratch\fdown-clone\images\preview-desktop-home.png"
    if os.path.exists(img_path):
        preview = Image.open(img_path).convert("RGBA")
        target_card_w = 930
        target_card_h = 525
        
        p_w, p_h = preview.size
        ratio = target_card_w / p_w
        new_h = int(p_h * ratio)
        preview_resized = preview.resize((target_card_w, new_h), Image.Resampling.LANCZOS)
        
        card_content = preview_resized.crop((0, 0, target_card_w, target_card_h))
        
        mask = Image.new("L", (target_card_w, target_card_h), 0)
        mask_draw = ImageDraw.Draw(mask)
        mask_draw.rounded_rectangle([0, 0, target_card_w, target_card_h], radius=24, fill=255)
        
        card_x = (W - target_card_w) // 2
        card_y = 330
        
        shadow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        sh_draw = ImageDraw.Draw(shadow)
        sh_draw.rounded_rectangle([card_x - 12, card_y + 10, card_x + target_card_w + 12, card_y + target_card_h + 30], radius=32, fill=(0, 0, 0, 170))
        shadow = shadow.filter(ImageFilter.GaussianBlur(28))
        bg = Image.alpha_composite(bg, shadow)
        
        bg.paste(card_content, (card_x, card_y), mask)
        
        draw = ImageDraw.Draw(bg)
        draw.rounded_rectangle([card_x, card_y, card_x + target_card_w, card_y + target_card_h], radius=24, outline=(56, 189, 248, 180), width=3)

    # 5. Feature Badges Floating below UI (Pure clean text)
    badges = [
        ("4K Ultra HD", (14, 165, 233)),
        ("320kbps MP3 Audio", (245, 158, 11)),
        ("100% Free & Private", (16, 185, 129)),
        ("Chrome Extension", (168, 85, 247))
    ]
    
    badge_y = 880
    total_b_w = 0
    b_widths = []
    for b_text, col in badges:
        bb = draw.textbbox((0, 0), b_text, font=f_feature)
        bw = (bb[2] - bb[0]) + 40
        b_widths.append(bw)
        total_b_w += bw
        
    spacing = 16
    total_w = total_b_w + spacing * (len(badges) - 1)
    bx_start = (W - total_w) // 2
    
    curr_x = bx_start
    for i, (b_text, col) in enumerate(badges):
        bw = b_widths[i]
        draw.rounded_rectangle([curr_x, badge_y, curr_x + bw, badge_y + 44], radius=22, fill=(15, 23, 42, 230), outline=col, width=2)
        draw.text((curr_x + 20, badge_y + 10), b_text, fill=(255, 255, 255), font=f_feature)
        curr_x += bw + spacing

    # 6. HUGE, BOLD, PROMINENT WEBSITE ADDRESS HERO BOX (Mobile Highlight)
    box_w = 890
    box_h = 180
    box_x = (W - box_w) // 2
    box_y = 955

    glow_box = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gb_draw = ImageDraw.Draw(glow_box)
    gb_draw.rounded_rectangle([box_x - 15, box_y - 10, box_x + box_w + 15, box_y + box_h + 15], radius=38, fill=(245, 158, 11, 65))
    glow_box = glow_box.filter(ImageFilter.GaussianBlur(32))
    bg = Image.alpha_composite(bg, glow_box)
    draw = ImageDraw.Draw(bg)

    # Outer container
    draw.rounded_rectangle([box_x, box_y, box_x + box_w, box_y + box_h], radius=28, fill=(15, 23, 42, 250), outline=(245, 158, 11, 240), width=3)

    # Sub-label
    cta_label = "VISIT OFFICIAL WEBSITE NOW:"
    cl_bb = draw.textbbox((0, 0), cta_label, font=f_cta_label)
    draw.text(((W - (cl_bb[2] - cl_bb[0])) // 2, box_y + 22), cta_label, fill=(226, 232, 240), font=f_cta_label)

    # The Big Website URL Bar
    url_pill_w = 810
    url_pill_h = 80
    up_x = (W - url_pill_w) // 2
    up_y = box_y + 72
    
    # Bright Gold Pill
    draw.rounded_rectangle([up_x, up_y, up_x + url_pill_w, up_y + url_pill_h], radius=22, fill=(245, 158, 11, 255))
    
    url_text = "fb4kdownloader.com"
    u_bb = draw.textbbox((0, 0), url_text, font=f_url)
    u_w = u_bb[2] - u_bb[0]
    draw.text(((W - u_w) // 2, up_y + 10), url_text, fill=(11, 15, 25), font=f_url)

    # 7. Bottom Footnote & Device Badges
    footer_text = "Works seamlessly on Android, iPhone, Windows, Mac & Chrome"
    f_bb = draw.textbbox((0, 0), footer_text, font=f_footer)
    draw.text(((W - (f_bb[2] - f_bb[0])) // 2, 1175), footer_text, fill=(148, 163, 184), font=f_footer)
    
    copy_text = "Free Online Facebook Video & Reels Downloader  |  fb4kdownloader.com"
    cp_bb = draw.textbbox((0, 0), copy_text, font=f_footer)
    draw.text(((W - (cp_bb[2] - cp_bb[0])) // 2, 1220), copy_text, fill=(100, 116, 139), font=f_footer)

    out_path = r"C:\Users\SRKAMD\.gemini\antigravity\scratch\fdown-clone\fb4k_mobile_social_post.png"
    bg.save(out_path, "PNG", quality=95)
    print(f"Generated successfully: {out_path}")

create_mobile_social_graphic()
