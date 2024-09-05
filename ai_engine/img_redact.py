import cv2
import numpy as np
import pytesseract
import json
import requests
import logging
from PIL import Image
from ultralytics import YOLO
import dotenv

pytesseract.pytesseract.tesseract_cmd = ( r'/usr/bin/tesseract' )
# Set up logging
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')

API_KEY = dotenv.load_dotenv().get("API_KEY")

def perform_ocr(image):
    # Convert OpenCV image to PIL Image
    pil_image = Image.fromarray(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))
    ocr_data = pytesseract.image_to_data(pil_image, output_type=pytesseract.Output.DICT, lang='eng')
    return ocr_data

def find_sensitive_data(text):
    print(text)
    prompt = (
        "You are a powerful text analysis tool designed to identify all potentially sensitive, personally identifiable, or traceable information in text. "
        "Please analyze the following text and flag ALL instances of the following types of information:\n\n"
        "1. Names: Recognize full names of individuals, including but not limited to Indian names.\n"
        "2. Identification Numbers: Identify any numbers that could be identification numbers (e.g., Aadhaar, passport, driving license, employee ID, etc.).\n"
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
        print(entities_json)
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
        
        i = 0
        while i < len(ocr_data['text']):
            if ocr_data['text'][i].lower() == entity_words[0]:
                match_length = 1
                for j in range(1, len(entity_words)):
                    if i + j < len(ocr_data['text']) and ocr_data['text'][i + j].lower() == entity_words[j]:
                        match_length += 1
                    else:
                        break
                
                if match_length == len(entity_words):
                    x_min = min(ocr_data['left'][i + k] for k in range(match_length))
                    y_min = min(ocr_data['top'][i + k] for k in range(match_length))
                    x_max = max(ocr_data['left'][i + k] + ocr_data['width'][i + k] for k in range(match_length))
                    y_max = max(ocr_data['top'][i + k] + ocr_data['height'][i + k] for k in range(match_length))
                    
                    padding = 2
                    x_min = max(0, x_min - padding)
                    y_min = max(0, y_min - padding)
                    x_max = min(width, x_max + padding)
                    y_max = min(height, y_max + padding)
                    logging.info(f"Redacting: {entity_text} ({entity['type']})")
                    cv2.rectangle(mask, (x_min, y_min), (x_max, y_max), 255, -1)
                    
                    i += match_length - 1 
            i += 1
    
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
    data, bbox, _ = qr_detector.detectAndDecode(image)
    qr_regions = []
    
    if bbox is not None:
        for i in range(len(bbox)):
            x_min = int(bbox[i][0][0])
            y_min = int(bbox[i][0][1])
            x_max = int(bbox[(i + 1) % len(bbox)][0][0])
            y_max = int(bbox[(i + 1) % len(bbox)][0][1])
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
        aspect_ratio = w / float(h)
        if 0.2 < aspect_ratio < 5.0 and 1000 < cv2.contourArea(cnt) < 10000:  # You can adjust these thresholds
            signature_regions.append((x, y, w, h))
            logging.info(f"Signature detected at coordinates: ({x}, {y}, {w}, {h})")
    
    return signature_regions

def redact_images(image, image_regions):
    redacted = image.copy()
    for (x, y, w, h) in image_regions:
        logging.info(f"Redacting image at coordinates: ({x}, {y}, {w}, {h})")
        
        x, y = max(0, x), max(0, y)
        w = min(w, image.shape[1] - x)
        h = min(h, image.shape[0] - y)
        redacted[y:y+h, x:x+w] = (0, 0, 0)
        
    return redacted

def redactImg(input_image, output_image):
    image = cv2.imread(input_image)
    if image is None:
        logging.error(f"Failed to load image: {input_image}")
        return

    model = YOLO('yolov5su.pt')

    ocr_data = perform_ocr(image)
    full_text = ' '.join(ocr_data['text'])

    sensitive_data = find_sensitive_data(full_text)
    redacted_text_image = redact_sensitive_data(image, ocr_data, sensitive_data)

    image_regions = detect_images(redacted_text_image, model)
    qr_code_regions = detect_qr_codes(redacted_text_image)
    signature_regions = detect_signatures(redacted_text_image)

    all_regions = image_regions + qr_code_regions + signature_regions

    final_redacted_image = redact_images(redacted_text_image, all_regions)

    cv2.imwrite(output_image, final_redacted_image)
    logging.info(f"Redacted image saved as {output_image}")

if __name__ == "__main__":
    input_image = "input.jpg"
    output_image = "output.jpg"
    redactImg(input_image, output_image)