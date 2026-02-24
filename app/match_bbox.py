from PIL import Image

def match_bounding_box(input_path, output_path, reference_bbox, canvas_size=(640, 640), tolerance=50):
    # 1. Open the generated image
    img = Image.open(input_path).convert("RGBA")
    
    # 2. Convert near-white background pixels to transparent
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
    
    # 3. Get the bounding box of the actual book in the generated image
    bbox = img.getbbox()
    if not bbox:
        print("Image is entirely transparent!")
        return
        
    # Crop to just the book
    cropped_book = img.crop(bbox)
    
    # 4. Calculate target dimensions based on reference bounding box
    # reference_bbox is (left, upper, right, lower)
    target_width = reference_bbox[2] - reference_bbox[0]
    target_height = reference_bbox[3] - reference_bbox[1]
    
    # 5. Resize book to match target dimensions
    resized_book = cropped_book.resize((target_width, target_height), Image.Resampling.LANCZOS)
    
    # 6. Create a blank transparent canvas
    final_canvas = Image.new("RGBA", canvas_size, (0, 0, 0, 0))
    
    # 7. Paste the resized book at the exact offset of the reference bounding box
    final_canvas.paste(resized_book, (reference_bbox[0], reference_bbox[1]), resized_book)
    
    # 8. Save
    final_canvas.save(output_path, "PNG")
    print(f"Successfully matched book to bounding box {reference_bbox} and saved.")

if __name__ == "__main__":
    import sys
    if len(sys.argv) < 3:
        print("Usage: python match_bbox.py <input> <output>")
        sys.exit(1)
        
    input_file = sys.argv[1]
    output_file = sys.argv[2]
    
    # The exact bounding box of the historical ledger: (60, 9, 580, 632)
    hist_bbox = (60, 9, 580, 632)
    
    match_bounding_box(input_file, output_file, hist_bbox)
