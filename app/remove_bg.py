from PIL import Image

def remove_white_background(input_path, output_path, tolerance=30):
    img = Image.open(input_path).convert("RGBA")
    datas = img.getdata()
    
    new_data = []
    for item in datas:
        # Check if pixel is white or close to white based on tolerance
        if item[0] >= 255 - tolerance and item[1] >= 255 - tolerance and item[2] >= 255 - tolerance:
            # Change all white (also shades of whites) to transparent
            new_data.append((255, 255, 255, 0))
        else:
            new_data.append(item)
            
    img.putdata(new_data)
    img.save(output_path, "PNG")
    print(f"Saved transparent image to {output_path}")

if __name__ == "__main__":
    input_file = "public/assets/ledger/vintage_leather_cover_whiskey_cutout.png"
    output_file = "public/assets/ledger/vintage_leather_cover_whiskey_cutout.png"
    remove_white_background(input_file, output_file, tolerance=30)
