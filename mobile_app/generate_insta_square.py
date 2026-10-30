import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

def create_insta_square_guide():
    # 1080 x 1080 is the standard Instagram / Facebook square format
    W, H = 1080, 1080
    bg = Image.new("RGBA", (W, H), (11, 17, 32, 255))
    bg_draw = ImageDraw.Draw(bg)
    
    # Gradient
    for y in range(H):
        ratio = y / H
        r = int(9 + ratio * 12)
        g = int(14 + ratio * 14)
        b = int(28 + ratio * 24)
        bg_draw.line([(0, y), (W, y)], fill=(r, g, b, 255))
        
    # Ambient glows
    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    g_draw = ImageDraw.Draw(glow)
    g_draw.ellipse((-80, -80, 450, 450), fill=(6, 182, 212, 45))
    g_draw.ellipse((W - 350, 200, W + 150, 700), fill=(245, 158, 11, 40))
    g_draw.ellipse((100, H - 350, 600, H + 150), fill=(59, 130, 246, 35))
    glow = glow.filter(ImageFilter.GaussianBlur(110))
    bg = Image.alpha_composite(bg, glow)
    
    draw = ImageDraw.Draw(bg)
    
    # Fonts
    font_bold = "C:\\Windows\\Fonts\\segoeuib.ttf"
    font_reg = "C:\\Windows\\Fonts\\segoeui.ttf"
    font_extra = "C:\\Windows\\Fonts\\arialbd.ttf"
    
    f_badge = ImageFont.truetype(font_bold, 22)
    f_title = ImageFont.truetype(font_extra, 46)
    f_step_num = ImageFont.truetype(font_extra, 36)
    f_step_title = ImageFont.truetype(font_bold, 28)
    f_step_desc = ImageFont.truetype(font_reg, 22)
    f_url = ImageFont.truetype(font_extra, 46)
    f_cta_sub = ImageFont.truetype(font_bold, 24)

    # 1. Top Badge
    top_badge = "QUICK & FREE TUTORIAL"
    tb_bb = draw.textbbox((0, 0), top_badge, font=f_badge)
    tb_w = tb_bb[2] - tb_bb[0] + 40
    tb_x = (W - tb_w) // 2
    draw.rounded_rectangle([tb_x, 50, tb_x + tb_w, 92], radius=21, fill=(15, 23, 42, 220), outline=(6, 182, 212, 200), width=2)
    draw.text((tb_x + 20, 59), top_badge, fill=(6, 182, 212, 255), font=f_badge)

    # 2. Headline
    t_text = "How to Download Any FB Video or Reel"
    t_bb = draw.textbbox((0, 0), t_text, font=f_title)
    draw.text(((W - (t_bb[2] - t_bb[0])) // 2, 115), t_text, fill=(255, 255, 255), font=f_title)

    sub_t = "Save high-definition 4K MP4 or 320kbps MP3 in 3 easy steps"
    st_bb = draw.textbbox((0, 0), sub_t, font=f_step_desc)
    draw.text(((W - (st_bb[2] - st_bb[0])) // 2, 180), sub_t, fill=(148, 163, 184), font=f_step_desc)

    # 3. Three Step Cards
    steps = [
        ("1", "Copy Video or Reel Link", "Tap 'Share' on Facebook and select 'Copy link' to get the URL.", (6, 182, 212)),
        ("2", "Paste on fb4kdownloader.com", "Open browser, paste link in the search bar, and tap 'Download'.", (245, 158, 11)),
        ("3", "Choose 4K Video or MP3 Audio", "Select your desired quality (4K, 1080p, or 320kbps MP3) and save!", (16, 185, 129))
    ]

    card_y = 240
    card_w = 900
    card_h = 135
    card_x = (W - card_w) // 2

    for num, title, desc, col in steps:
        # Card background
        draw.rounded_rectangle([card_x, card_y, card_x + card_w, card_y + card_h], radius=20, fill=(15, 23, 42, 240), outline=col, width=2)
        
        # Step Number Circle
        circle_size = 64
        c_x = card_x + 30
        c_y = card_y + (card_h - circle_size) // 2
        draw.ellipse([c_x, c_y, c_x + circle_size, c_y + circle_size], fill=col)
        
        num_bb = draw.textbbox((0, 0), num, font=f_step_num)
        nw = num_bb[2] - num_bb[0]
        nh = num_bb[3] - num_bb[1]
        draw.text((c_x + (circle_size - nw) // 2, c_y + (circle_size - nh) // 2 - 4), num, fill=(11, 15, 25), font=f_step_num)
        
        # Step Content
        text_x = c_x + circle_size + 28
        draw.text((text_x, card_y + 26), title, fill=(255, 255, 255), font=f_step_title)
        draw.text((text_x, card_y + 72), desc, fill=(148, 163, 184), font=f_step_desc)
        
        card_y += card_h + 22

    # 4. Giant Bottom Hero URL Box (Mobile & Feed Friendly)
    url_box_w = 900
    url_box_h = 175
    ub_x = (W - url_box_w) // 2
    ub_y = 735

    # Glow
    glow_u = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gu_draw = ImageDraw.Draw(glow_u)
    gu_draw.rounded_rectangle([ub_x - 10, ub_y - 10, ub_x + url_box_w + 10, ub_y + url_box_h + 10], radius=34, fill=(245, 158, 11, 60))
    glow_u = glow_u.filter(ImageFilter.GaussianBlur(30))
    bg = Image.alpha_composite(bg, glow_u)
    draw = ImageDraw.Draw(bg)

    draw.rounded_rectangle([ub_x, ub_y, ub_x + url_box_w, ub_y + url_box_h], radius=26, fill=(15, 23, 42, 250), outline=(245, 158, 11, 230), width=3)

    cta_lbl = "VISIT NOW • 100% FREE • NO APP NEEDED"
    cl_bb = draw.textbbox((0, 0), cta_lbl, font=f_cta_sub)
    draw.text(((W - (cl_bb[2] - cl_bb[0])) // 2, ub_y + 22), cta_lbl, fill=(226, 232, 240), font=f_cta_sub)

    pill_w = 820
    pill_h = 75
    p_x = (W - pill_w) // 2
    p_y = ub_y + 70
    draw.rounded_rectangle([p_x, p_y, p_x + pill_w, p_y + pill_h], radius=20, fill=(245, 158, 11, 255))

    url_str = "fb4kdownloader.com"
    u_bb = draw.textbbox((0, 0), url_str, font=f_url)
    draw.text(((W - (u_bb[2] - u_bb[0])) // 2, p_y + 9), url_str, fill=(11, 15, 25), font=f_url)

    # 5. Bottom Tagline
    footer_lbl = "Available on Mobile Safari, Chrome, Android, iPhone, Windows & Mac"
    ft_bb = draw.textbbox((0, 0), footer_lbl, font=f_step_desc)
    draw.text(((W - (ft_bb[2] - ft_bb[0])) // 2, 945), footer_lbl, fill=(100, 116, 139), font=f_step_desc)

    out_file = r"C:\Users\SRKAMD\.gemini\antigravity\scratch\fdown-clone\fb4k_insta_square_guide.png"
    bg.save(out_file, "PNG", quality=95)
    print(f"Generated: {out_file}")

create_insta_square_guide()
