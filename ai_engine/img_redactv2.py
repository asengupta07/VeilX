import cv2
import numpy as np
import easyocr
import json
import requests
import logging
import torch
from PIL import Image
from ultralytics import YOLO

# Set up logging
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')

API_KEY = "adc4ae97-fa05-4faf-b1b4-a72805d035c4"  # Replace with your actual API key

def perform_ocr(image):
    # Initialize easyocr Reader
    reader = easyocr.Reader(['en'])  # Specify languages as needed
    # Perform OCR on the image
    results = reader.readtext(image, detail=1)
    
    # Prepare the OCR data similar to pytesseract's output
    ocr_data = {'text': [], 'left': [], 'top': [], 'width': [], 'height': []}
    for (bbox, text, prob) in results:
        if prob > 0.5:  # Confidence threshold
            (top_left, top_right, bottom_right, bottom_left) = bbox
            x_min = int(top_left[0])
            y_min = int(top_left[1])
            x_max = int(bottom_right[0])
            y_max = int(bottom_right[1])
            print(text)
            ocr_data['text'].append(text)
            ocr_data['left'].append(x_min)
            ocr_data['top'].append(y_min)
            ocr_data['width'].append(x_max - x_min)
            ocr_data['height'].append(y_max - y_min)
    return ocr_data

def find_sensitive_data(text):
    prompt = (
        "You are a powerful text analysis tool designed to identify all potentially sensitive, personally identifiable, or traceable information in text. "
        "Please analyze the following text and flag ALL instances of the following types of information:\n\n"
        "1. Names: Recognize full names of individuals, including but not limited to Indian names.\n"
        "2. Identification Numbers: Identify any numbers that could be identification numbers (e.g., Aadhaar, passport, driving license, employee ID, VID, etc.).\n"
        "3. Addresses: Detect any references to addresses, including street names, city names, and postal codes.\n"
        "4. Phone Numbers: Find all phone numbers, including international formats.\n"
        "5. Email Addresses: Identify all email addresses.\n"
        "6. URLs: Detect all URLs and web addresses.\n"
        "7. Dates: Flag all dates, including birthdays and significant events.\n"
        "8. Financial Information: Identify bank account numbers, credit card numbers, and any monetary amounts.\n"
        "9. Organizations: Flag names of companies, institutions, or any other organizations.\n"
        "10. Locations: Identify any mentioned locations, including countries, states, cities, landmarks, etc.\n"
        "11. Proper Nouns: Flag all proper nouns not covered by the above categories.\n"
        "12. Other Potential Identifiers: Flag any other information that could potentially be used to identify or trace an individual or entity.\n\n"
        "Please list each identified item in the following JSON format:\n\n"
        "[\n"
        "    {\n"
        "        \"type\": \"Name\",\n"
        "        \"text\": \"John Doe\"\n"
        "    },\n"
        "    {\n"
        "        \"type\": \"URL\",\n"
        "        \"text\": \"https://example.com\"\n"
        "    }\n"
        "    // Add ALL identified items\n"
        "]\n\n"
        f"Text to analyze:\n{text}"
    )
    
    data = {"messages": [{"role": "user", "content": prompt}]}

    headers = {
        "Content-Type": "application/json",
        "apiKey": API_KEY
    }

    response = requests.post('https://api.jabirproject.org/generate', json=data, headers=headers)
    if response.status_code == 200:
        entities_json = response.json().get("result", {}).get("content", "")
        try:
            entities = json.loads(entities_json)
        except json.JSONDecodeError:
            logging.error("Error: Unable to parse JSON response")
            return []
    else:
        logging.error(f"Error: {response.status_code} - {response.text}")
        return []
    return entities

def redact_sensitive_data(image, ocr_data, sensitive_data):
    height, width = image.shape[:2]
    mask = np.zeros((height, width), dtype=np.uint8)

    for entity in sensitive_data:
        entity_text = entity['text'].lower()
        entity_words = entity_text.split()
        
        for i, word in enumerate(ocr_data['text']):
            if word.lower() in entity_text:
                x_min = ocr_data['left'][i]
                y_min = ocr_data['top'][i]
                x_max = x_min + ocr_data['width'][i]
                y_max = y_min + ocr_data['height'][i]
                
                padding = 2
                x_min = max(0, x_min - padding)
                y_min = max(0, y_min - padding)
                x_max = min(width, x_max + padding)
                y_max = min(height, y_max + padding)
                
                cv2.rectangle(mask, (x_min, y_min), (x_max, y_max), 255, -1)
                logging.info(f"Redacting: {word} ({entity['type']})")
    
    image[mask > 0] = [0, 0, 0] 
    
    return image

def detect_images(image, model):
    # Convert BGR to RGB
    image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    pil_image = Image.fromarray(image_rgb)
    
    # Perform detection
    results = model(pil_image)
    
    image_height, image_width = image.shape[:2]
    max_area = (image_width * image_height) / 4  # Maximum allowed area for detection

    image_regions = []
    for result in results:
        boxes = result.boxes.xyxy.cpu().numpy()
        classes = result.boxes.cls.cpu().numpy()
        confs = result.boxes.conf.cpu().numpy()
        
        for box, cls, conf in zip(boxes, classes, confs):
            if conf > 0.1:
                x1, y1, x2, y2 = box
                box_width = x2 - x1
                box_height = y2 - y1
                box_area = box_width * box_height
                
                if box_area <= max_area:
                    image_regions.append((int(x1), int(y1), int(box_width), int(box_height)))
    
    return image_regions

def detect_qr_codes(image):
    qr_detector = cv2.QRCodeDetector()
    bbox, _ = qr_detector.detect(image)
    qr_regions = []
    
    if bbox is not None:
        for i in range(len(bbox)):
            x_min = int(bbox[i][0][0])
            y_min = int(bbox[i][0][1])
            x_max = int(bbox[i][1][0])
            y_max = int(bbox[i][1][1])
            qr_regions.append((x_min, y_min, x_max - x_min, y_max - y_min))
            logging.info(f"QR code detected and redacted")
    
    return qr_regions


def detect_signatures(image):
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    edged = cv2.Canny(blurred, 50, 150)
    
    contours, _ = cv2.findContours(edged, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    signature_regions = []
    
    for cnt in contours:
        x, y, w, h = cv2.boundingRect(cnt)
        aspect_ratio = float(w) / h
        
        if 2 < aspect_ratio < 6 and 30 < w < 300 and 10 < h < 100:
            signature_regions.append((x, y, w, h))
            logging.info(f"Signature detected and redacted")
    
    return signature_regions

def draw_redaction_boxes(image, regions):
    for (x, y, w, h) in regions:
        cv2.rectangle(image, (x, y), (x + w, y + h), (0, 0, 0), -1)
    
    return image

def main(image_path, output_path, model):
    image = cv2.imread(image_path)
    logging.info(f"Processing document: {image_path}")

    ocr_data = perform_ocr(image)
    text_content = ' '.join(ocr_data['text'])
    print(text_content)
    sensitive_data = find_sensitive_data(text_content)

    redacted_image = redact_sensitive_data(image.copy(), ocr_data, sensitive_data)

    image_regions = detect_images(redacted_image, model)
    redacted_image = draw_redaction_boxes(redacted_image, image_regions)

    qr_regions = detect_qr_codes(redacted_image)
    redacted_image = draw_redaction_boxes(redacted_image, qr_regions)

    signature_regions = detect_signatures(redacted_image)
    redacted_image = draw_redaction_boxes(redacted_image, signature_regions)

    cv2.imwrite(output_path, redacted_image)
    logging.info(f"Redacted image saved as {output_path}")

if __name__ == "__main__":
    model = YOLO('yolov8n.pt')
    input_path = "input.jpg"
    output_path = "output2.jpg"
    main(input_path, output_path, model)