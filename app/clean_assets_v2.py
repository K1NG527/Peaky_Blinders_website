import os
from PIL import Image, ImageMath

def remove_background(input_path, output_path):
    try:
        # Load the image and ensure it has an alpha channel
        img = Image.open(input_path).convert("RGBA")
        
        # Split image into RGB and Alpha channels
        r, g, b, a = img.split()
        
        # Make a mask: True where color is NOT white (or very light gray)
        # We consider anything above 225, 225, 225 to be background
        mask_r = ImageMath.eval("convert(a < 225, 'L')", a=r)
        mask_g = ImageMath.eval("convert(a < 225, 'L')", a=g)
        mask_b = ImageMath.eval("convert(a < 225, 'L')", a=b)
        
        # Combine the masks - a pixel is foreground if it's dark enough in ANY channel
        mask = ImageMath.eval("convert(a | b | c, 'L')", a=mask_r, b=mask_g, c=mask_b)
        
        # Apply mask to alpha channel
        # Use 255 for solid, 0 for transparent
        transparent = Image.new('L', img.size, 0)
        new_alpha = Image.composite(a, transparent, mask)
        
        # Recombine into a new image
        img.putalpha(new_alpha)
        
        # Crop the bounding box tightly to remove all the new transparent padding
        bbox = img.getbbox()
        if bbox:
            img = img.crop(bbox)
            
        # Resize if too large
        max_size = 500
        if img.width > max_size or img.height > max_size:
            ratio = min(max_size / img.width, max_size / img.height)
            new_size = (int(img.width * ratio), int(img.height * ratio))
            img = img.resize(new_size, Image.Resampling.LANCZOS)
            
        # Save output
        img.save(output_path, "PNG")
        print(f"Successfully processed and saved: {output_path}")

    except Exception as e:
        print(f"Error processing {input_path}: {e}")


# Process the assets
paths = [
    (
        r"C:\Users\devan\.gemini\antigravity\brain\1fcac471-3877-4a89-b15e-71047de284fc\vintage_whiskey_crate_1771747581243.png",
        r"C:\Users\devan\Downloads\Thomas Fxcking Shelby\app\public\assets\ledger\vintage_whiskey_crate.png"
    ),
    (
        r"C:\Users\devan\.gemini\antigravity\brain\1fcac471-3877-4a89-b15e-71047de284fc\lewis_gun_asset_1771747605114.png",
        r"C:\Users\devan\Downloads\Thomas Fxcking Shelby\app\public\assets\ledger\lewis_gun_asset.png"
    ),
    (
        r"C:\Users\devan\.gemini\antigravity\brain\1fcac471-3877-4a89-b15e-71047de284fc\vintage_ammo_box_1771747628718.png",
        r"C:\Users\devan\Downloads\Thomas Fxcking Shelby\app\public\assets\ledger\vintage_ammo_box.png"
    ),
    (
        r"C:\Users\devan\.gemini\antigravity\brain\1fcac471-3877-4a89-b15e-71047de284fc\vintage_ink_stamp_card_1771750418222.png",
        r"C:\Users\devan\Downloads\Thomas Fxcking Shelby\app\public\assets\ledger\vintage_ink_stamp_card.png"
    ),
    (
        r"C:\Users\devan\.gemini\antigravity\brain\1fcac471-3877-4a89-b15e-71047de284fc\vintage_ink_bottle_quill_1771750435956.png",
        r"C:\Users\devan\Downloads\Thomas Fxcking Shelby\app\public\assets\ledger\vintage_ink_bottle_quill.png"
    )
]

for in_path, out_path in paths:
    remove_background(in_path, out_path)
