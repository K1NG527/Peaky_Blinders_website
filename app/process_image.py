from PIL import Image

def process_ledger_cover(input_path, output_path, tolerance=50, target_size=(640, 640)):
    # Open and ensure RGBA
    img = Image.open(input_path).convert("RGBA")
    
    # Resize to exact dimensions
    img = img.resize(target_size, Image.Resampling.LANCZOS)
    
    datas = img.getdata()
    new_data = []
    
    for item in datas:
        # Check if pixel is close to white
        if item[0] >= 255 - tolerance and item[1] >= 255 - tolerance and item[2] >= 255 - tolerance:
            # Change white to transparent
            new_data.append((255, 255, 255, 0))
        else:
            new_data.append(item)
            
    img.putdata(new_data)
    img.save(output_path, "PNG")
    print(f"Processed image and saved to {output_path} with size {target_size}")

if __name__ == "__main__":
    import sys
    if len(sys.argv) < 3:
        print("Usage: python process_image.py <input> <output>")
        sys.exit(1)
        
    input_file = sys.argv[1]
    output_file = sys.argv[2]
    
    process_ledger_cover(input_file, output_file, tolerance=40)
