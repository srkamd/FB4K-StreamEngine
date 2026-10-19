import os
from PIL import Image, ImageDraw, ImageFont

def generate_extension_icons():
    ext_dir = r"C:\Users\SRKAMD\.gemini\antigravity\scratch\fdown-clone\extension"
    os.makedirs(ext_dir, exist_ok=True)
    
    sizes = [16, 32, 48, 128]
    
    for size in sizes:
        img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
        draw = ImageDraw.Draw(img)
        
        # Rounded rectangle with cyan to blue gradient
        corner_r = max(2, int(size * 0.22))
        
        # Base rounded rect
        draw.rounded_rectangle([0, 0, size - 1, size - 1], radius=corner_r, fill=(11, 15, 25, 255), outline=(6, 182, 212, 255), width=max(1, size // 32))
        
        # Golden inner circle / pill
        margin = max(1, size // 10)
        draw.rounded_rectangle([margin, margin, size - 1 - margin, size - 1 - margin], radius=corner_r - 1, fill=(245, 158, 11, 240))
        
        # White / dark arrow down inside
        mid_x = size // 2
        mid_y = size // 2
        
        # Arrow shaft
        arrow_w = max(2, size // 7)
        shaft_top = mid_y - size // 4
        shaft_bot = mid_y + size // 10
        draw.rectangle([mid_x - arrow_w // 2, shaft_top, mid_x + arrow_w // 2, shaft_bot], fill=(11, 15, 25, 255))
        
        # Arrow head
        head_size = max(3, size // 4)
        points = [
            (mid_x - head_size, shaft_bot),
            (mid_x + head_size, shaft_bot),
            (mid_x, shaft_bot + head_size)
        ]
        draw.polygon(points, fill=(11, 15, 25, 255))
        
        # Small "4K" text on 48 and 128
        if size >= 48:
            try:
                font = ImageFont.truetype("C:\\Windows\\Fonts\\arialbd.ttf", size // 5)
                draw.text((size - size // 3 - 2, size - size // 4 - 2), "4K", fill=(255, 255, 255), font=font)
            except Exception:
                pass
                
        out_path = os.path.join(ext_dir, f"icon{size}.png")
        img.save(out_path, "PNG")
        print(f"Generated: {out_path}")

generate_extension_icons()
