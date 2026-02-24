from PIL import Image

def match_lamp_bounding_box(input_path, output_path, reference_bbox, canvas_size=(640, 640), tolerance=50):
    img = Image.open(input_path).convert("RGBA")
    
    datas = img.getdata()
    new_data = []
    
    for item in datas:
        if item[0] >= 255 - tolerance and item[1] >= 255 - tolerance and item[2] >= 255 - tolerance:
            new_data.append((255, 255, 255, 0))
        else:
            new_data.append(item)
            
    img.putdata(new_data)
    
    bbox = img.getbbox()
    if not bbox:
        print("Image is entirely transparent!")
        return
        
    cropped_item = img.crop(bbox)
    
    target_width = reference_bbox[2] - reference_bbox[0]
    target_height = reference_bbox[3] - reference_bbox[1]
    
    resized_item = cropped_item.resize((target_width, target_height), Image.Resampling.LANCZOS)
    
    final_canvas = Image.new("RGBA", canvas_size, (0, 0, 0, 0))
    final_canvas.paste(resized_item, (reference_bbox[0], reference_bbox[1]), resized_item)
    
    final_canvas.save(output_path, "PNG")
    print(f"Successfully matched item to bounding box {reference_bbox} and saved.")

if __name__ == "__main__":
    import sys
    if len(sys.argv) < 3:
        print("Usage: python match_lamp.py <input> <output>")
        sys.exit(1)
        
    input_file = sys.argv[1]
    output_file = sys.argv[2]
    
    lamp_bbox = (88, 34, 552, 596)
    match_lamp_bounding_box(input_file, output_file, lamp_bbox)
