from PIL import Image
import os

def clean_and_save(input_path, output_path):
    try:
        if not os.path.exists(input_path):
            print(f"File not found: {input_path}")
            return
            
        img = Image.open(input_path).convert("RGBA")
        datas = img.getdata()
        
        newData = []
        # Aggressive white removal, anything close to white or light gray becomes transparent
        for item in datas:
            # Check if pixel is light gray/white (RGB all > 200)
            if item[0] > 200 and item[1] > 200 and item[2] > 200:
                newData.append((255, 255, 255, 0))  # Fully transparent
            else:
                newData.append(item)
                
        img.putdata(newData)
        
        # Crop the bounding box tightly
        bbox = img.getbbox()
        if bbox:
            img = img.crop(bbox)
        
        # Resize to a reasonable maximal dimension (e.g., 400px wide for ledger size)
        max_size = 400
        ratio = min(max_size / img.width, max_size / img.height)
        new_size = (int(img.width * ratio), int(img.height * ratio))
        img = img.resize(new_size, Image.Resampling.LANCZOS)
        
        img.save(output_path, "PNG")
        print(f"Saved cleaned asset: {output_path}")
    except Exception as e:
        print(f"Error processing {input_path}: {e}")

# Process the three assets
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
    )
]

for in_path, out_path in paths:
    clean_and_save(in_path, out_path)
