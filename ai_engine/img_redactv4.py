import cv2
import numpy as np
import json
import requests
import logging
from PIL import Image, ImageDraw, ImageFont
from ultralytics import YOLO
import os
import google.generativeai as genai
import ast
from dotenv import load_dotenv
import re
import pyzbar.pyzbar as pyzbar
from paddleocr import PaddleOCR


load_dotenv()

ocr = PaddleOCR(use_angle_cls=False, lang="en")

API_KEY = os.getenv("API_KEY")
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

logging.basicConfig(
    level=logging.DEBUG, format="%(asctime)s - %(levelname)s - %(message)s"
)

genai.configure(api_key=GOOGLE_API_KEY)


def extract_json(response_text):
    try:
        response_text = re.sub(r'(?<=\w)"(?=\w)', '"', response_text)
        print(response_text)
        json_data = json.loads(response_text)
        return json_data
    except Exception:
        json_pattern = re.search(
            r"```(JSON|json)?\s*(.*?)```", response_text, re.DOTALL
        )
        if json_pattern:
            json_string = json_pattern.group(2)
            try:
                json_data = ast.literal_eval(json_string)
                return json_data
            except Exception as e:
                print(json_string)
                logging.error(f"Error decoding JSON: {str(e)}")
                try:
                    json_data = json.loads(json_string)
                    return json_data
                except Exception as e:
                    print(json_string)
                    logging.error(f"Error decoding JSON: {str(e)}")
                    return []
    return []


def get_gemini_response(prompt):
    try:
        model = genai.GenerativeModel("gemini-pro")
        safety_settings = [
            {
                "category": "HARM_CATEGORY_HARASSMENT",
                "threshold": "BLOCK_NONE",
            },
            {
                "category": "HARM_CATEGORY_HATE_SPEECH",
                "threshold": "BLOCK_NONE",
            },
            {
                "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                "threshold": "BLOCK_NONE",
            },
            {
                "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
                "threshold": "BLOCK_NONE",
            },
        ]
        response = model.generate_content(prompt, safety_settings=safety_settings)
        return response.text
    except Exception as e:
        logging.error(f"Error in Gemini API call: {str(e)}")
        return None


def perform_ocr(image, attempts=3, max_retries=10):
    def ocr_attempt(img):
        rgb_image = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        ocr_results = ocr.ocr(rgb_image)
        ocr_data = {"left": [], "top": [], "width": [], "height": [], "text": []}
        total_text = ""
        for page in ocr_results:
            for block in page:
                text = block[1][0]
                ocr_data["text"].append(text)
                total_text += text
                bbox = block[0]
                x1, y1 = bbox[0]
                x2, y2 = bbox[2]
                width, height = abs(x2 - x1), abs(y2 - y1)
                ocr_data["left"].append(int(x1))
                ocr_data["top"].append(int(y1))
                ocr_data["width"].append(int(width))
                ocr_data["height"].append(int(height))
        return ocr_data, len(total_text)

    best_result = None
    max_text_length = 0
    successful_attempts = 0
    total_attempts = 0

    while successful_attempts < attempts and total_attempts < max_retries:
        try:
            result, text_length = ocr_attempt(image)
            successful_attempts += 1
            total_attempts += 1

            if text_length > max_text_length:
                best_result = result
                max_text_length = text_length
        except RuntimeError as e:
            print(f"RuntimeError occurred: {e}. Retrying...")
            total_attempts += 1

        if successful_attempts < attempts and total_attempts >= max_retries:
            print(
                f"Warning: Only completed {successful_attempts} successful attempts out of {attempts} desired."
            )

    if best_result:
        print(" ".join(best_result["text"]))
    else:
        print("No successful OCR attempts were made.")

    return best_result


def find_sensitive_data(text, level):
    # print("Level: ", level, level==1, type(level), int(level)==1)
    if level == 1 or level == 2:
        prompt = (
            "You are a powerful text analysis tool designed to identify all important and sensitive numbers in text. "
            "Please analyze the following text and flag any instances of personally identifiable numbers including but not limited to the following types of numbers:\n\n"
            "1. Aadhaar Numbers: Detect any mention of Aadhaar numbers.\n"
            "2. PAN Numbers: Identify any PAN (Permanent Account Number) in the text.\n"
            "3. Passport Numbers: Flag any references to passport numbers.\n"
            "4. Driving License Numbers: Identify any driving license numbers mentioned.\n"
            "5. Employee ID Numbers: Detect any employee ID numbers.\n"
            "6. Bank Account Numbers: Identify any bank account numbers.\n"
            "7. Credit/Debit Card Numbers: Flag any credit or debit card numbers.\n"
            "8. Roll Numbers/Registration Numbers: Flag any roll numbers or registration numbers.\n"
            "9. Other Identification Numbers: Detect any other sensitive identification numbers that could be used to identify an individual or entity.\n\n"
            "Please list each identified number in the following JSON format:\n\n"
            "[\n"
            "    {\n"
            '        "type": "Aadhaar Number",\n'
            '        "text": "1234 5678 9101"\n'
            "    },\n"
            "    {\n"
            '        "type": "PAN Number",\n'
            '        "text": "ABCDE1234F"\n'
            "    }\n"
            "    // Add ALL identified items\n"
            "]\n\n"
            "Err on the side of caution - if in doubt, include it. However, do not flag single digits or common numeric sequences unless they are part of a sensitive number. Be very thorough and take into account cultural variations such as Indian identification numbers, etc."
            "Provide your comprehensive analysis based on these instructions. Only return the JSON. If at all no item is found, return an empty list.\n\n"
            f"Text to analyze:\n{text}"
        )

    elif level == 3:
        prompt = (
            "You are a highly advanced text analysis tool with the capability to detect and flag all instances of names and numbers within a text. Your task is to comprehensively analyze the text provided and identify every occurrence of any name or number, regardless of its format, context, or cultural origin. This includes but is not limited to the following categories:\n\n"
            "1. **Personal Identification Numbers**: Capture any numbers that could serve as personal identifiers, such as Aadhaar numbers, PAN numbers, Social Security numbers, National ID numbers, and others. Include associated names if present.\n"
            "2. **Financial Account Numbers**: Identify any financial-related numbers, including bank account numbers, credit card numbers, debit card numbers, IBAN, SWIFT codes, etc., and any associated names.\n"
            "3. **Government-Issued Document Numbers**: Detect numbers related to government-issued documents, such as passport numbers, driving license numbers, voter ID numbers, visa numbers, tax identification numbers, and more. Include any related names.\n"
            "4. **Employee and Student Identification Numbers**: Identify numbers related to employment or education, including employee ID numbers, student ID numbers, and any other institutional identification numbers, along with associated names.\n"
            "5. **Contact Numbers**: Capture phone numbers, mobile numbers, fax numbers, and other contact-related numbers.\n"
            "6. **Names on Resumes, CVs, or Job Applications**: Detect any names associated with resumes, CVs, cover letters, job applications, or related documents.\n"
            "7. **Healthcare and Insurance Document Numbers**: Identify numbers related to healthcare or insurance documents, including policy numbers, patient ID numbers, health insurance numbers, and associated names.\n"
            "8. **Vehicle and Property Registration Numbers**: Detect vehicle registration numbers, property deed numbers, or any other numbers related to ownership documents, along with any related names.\n"
            "9. **Any Other Names and Numbers**: Flag any other names and numbers that could be tied to an individual, entity, or important document, including but not limited to serial numbers, utility account numbers, tax records, and registration IDs.\n\n"
            "Your task is to list every identified name and number as a separate instance in the following JSON format:\n\n"
            "[\n"
            "    {\n"
            '        "type": "Name",\n'
            '        "text": "John Doe"\n'
            "    },\n"
            "    {\n"
            '        "type": "Number",\n'
            '        "text": "1234 5678 9101"\n'
            "    },\n"
            "    {\n"
            '        "type": "Number",\n'
            '        "text": "ABCDE1234F"\n'
            "    }\n"
            "    // Add ALL identified items\n"
            "]\n\n"
            "Err on the side of caution—if there is any doubt about whether something is a name or number, include it. Consider all variations in name and number formats across different cultures and document types. Your goal is to identify every possible name and number, leaving nothing unflagged.\n"
            "Return only the JSON output containing the flagged names and numbers.\n\n"
            f"Text to analyze:\n{text}"
        )

    else:
        prompt = (
            "You are a powerful text analysis tool designed to identify all potentially sensitive, personally identifiable, or traceable information in text, including conversations. "
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
            "12. Conversations: Redact entire conversations that could involve personal or sensitive information. This includes dialogue, chat transcripts, or exchanges where individuals discuss matters that could reveal identity, preferences, or other personal details, and any other information enclosed in quoatations.\n"
            "13. Other Potential Identifiers: Flag any other information that could potentially be used to identify or trace an individual or entity.\n\n"
            "Please list each identified item in the following JSON format:\n\n"
            "[\n"
            "    {\n"
            '        "type": "Name",\n'
            '        "text": "John Doe"\n'
            "    },\n"
            "    {\n"
            '        "type": "URL",\n'
            '        "text": "https://example.com"\n'
            "    }\n"
            "    // Add ALL identified items\n"
            "]\n\n"
            "Err on the side of caution - if in doubt, include it. However, do not flag single letters or common words unless they are part of a larger sensitive item. Be very thorough and take into account cultural variations such as Indian names, Indian addresses, etc."
            "Provide your comprehensive analysis based on these instructions. Only return the JSON.\n\n"
            f"Text to analyze:\n{text}"
        )

    data = {"messages": [{"role": "user", "content": prompt}]}

    headers = {"Content-Type": "application/json", "apiKey": API_KEY}
    try:
        response = requests.post(
            "https://api.jabirproject.org/generate", json=data, headers=headers
        )
        if response.status_code == 200:
            entities_json = response.json().get("result", {}).get("content", "")
            print(entities_json)
            try:
                entities = json.loads(entities_json)
            except json.JSONDecodeError:
                logging.error("Error: Unable to parse JSON response from Jabir API")
                entities = None
        else:
            logging.error(
                f"Error in Jabir API call: {response.status_code} - {response.text}"
            )
            entities = None
    except Exception as e:
        logging.error(f"Error in Jabir API call: {e}")
        entities = None

    if entities is None:
        logging.info("Falling back to Gemini Pro API")
        gemini_response = get_gemini_response(prompt)
        if gemini_response:
            try:
                entities = extract_json(gemini_response)
            except Exception:
                logging.error("Error: Unable to parse JSON response from Gemini API")
                entities = []
        else:
            logging.error("Both Jabir and Gemini API calls failed")
            entities = []

    sensitive_data = []
    print("Entities: ", entities)
    for entity in entities:
        item_text = entity["text"]
        if len(item_text) <= 1:
            logging.warning(f"Skipping single character: {item_text}")
            continue
        if item_text.lower() in [
            "the",
            "a",
            "an",
            "and",
            "or",
            "but",
            "in",
            "on",
            "at",
            "to",
            "for",
        ]:
            logging.warning(f"Skipping common word: {item_text}")
            continue
        start = 0
        while True:
            start = text.find(item_text, start)
            if start == -1:
                break
            end = start + len(item_text)
            sensitive_data.append((item_text, start, end, entity["type"]))
            start = end

    url_pattern = re.compile(
        r"http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+"
    )
    identifier_pattern = re.compile(
        r"\b(?:(?:\d{6,})|(?=.*\d)(?=.*[A-Z])[A-Z\d]{8,})\b"
    )

    for match in url_pattern.finditer(text):
        sensitive_data.append((match.group(), match.start(), match.end(), "URL"))

    for match in identifier_pattern.finditer(text):
        sensitive_data.append(
            (match.group(), match.start(), match.end(), "Potential Identifier")
        )

    for data in sensitive_data:
        logging.debug(f"Identified sensitive data: {data}")

    return sensitive_data


def redact_sensitive_data(image, ocr_data, sensitive_data, mode="black"):
    height, width = image.shape[:2]
    mask = np.zeros((height, width), dtype=np.uint8)

    sensitive_patterns = {
        entity["text"].lower(): re.compile(
            r"\b" + re.escape(entity["text"].lower()) + r"\b"
        )
        for entity in sensitive_data
    }

    for i in range(len(ocr_data["text"])):
        ocr_text = ocr_data["text"][i].lower()
        for entity_text, pattern in sensitive_patterns.items():
            if pattern.search(ocr_text):
                x_min = ocr_data["left"][i]
                y_min = ocr_data["top"][i]
                x_max = x_min + ocr_data["width"][i]
                y_max = y_min + ocr_data["height"][i]

                padding = 2
                x_min = max(0, x_min - padding)
                y_min = max(0, y_min - padding)
                x_max = min(width, x_max + padding)
                y_max = min(height, y_max + padding)

                cv2.rectangle(
                    mask, (int(x_min), int(y_min)), (int(x_max), int(y_max)), 255, -1
                )

    if mode == "black":
        image[mask > 0] = [0, 0, 0]
    elif mode == "white":
        image[mask > 0] = [255, 255, 255]
    elif mode == "blur":
        blurred = cv2.GaussianBlur(image, (21, 21), 0)
        image = np.where(mask[:, :, None] > 0, blurred, image)
    else:
        raise ValueError("Invalid mode. Choose 'black', 'white', or 'blur'.")

    return image


def detect_images(image, model):
    image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    pil_image = Image.fromarray(image_rgb)

    results = model(pil_image)

    image_height, image_width = image.shape[:2]
    max_area = (image_width * image_height) / 4

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
                    image_regions.append(
                        (int(x1), int(y1), int(box_width), int(box_height))
                    )

    return image_regions


def detect_qr_codes(image):
    if len(image.shape) == 3:
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    else:
        gray = image

    qr_codes = pyzbar.decode(gray)
    qr_regions = []

    for qr in qr_codes:
        x, y, w, h = qr.rect
        qr_regions.append((x, y, w, h))
        logging.info(f"QR code detected at ({x}, {y})")

    if not qr_regions:
        logging.info("No QR codes detected in the image")

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
        if 0.2 < aspect_ratio < 5.0 and 1000 < cv2.contourArea(cnt) < 10000:
            signature_regions.append((x, y, w, h))
            logging.info(f"Signature detected at coordinates: ({x}, {y}, {w}, {h})")

    return signature_regions


def draw_redaction_boxes(image, regions, mode="black"):
    mask = np.zeros(image.shape[:2], dtype=np.uint8)

    for x, y, w, h in regions:
        cv2.rectangle(mask, (x, y), (x + w, y + h), 255, -1)

    if mode == "black":
        image[mask > 0] = [0, 0, 0]
    elif mode == "white":
        image[mask > 0] = [255, 255, 255]
    elif mode == "blur":
        blurred = cv2.GaussianBlur(image, (21, 21), 0)
        image = np.where(mask[:, :, None] > 0, blurred, image)
    else:
        raise ValueError("Invalid mode. Choose 'black', 'white', or 'blur'.")

    return image


def find_sensitive_data_cust(text, prompt):
    prompt = (
        "You are an advanced, highly adaptable text analysis tool. "
        "Your task is to analyze the following text based on the user's custom prompt. "
        "This tool is culturally aware and capable of understanding diverse proper nouns, "
        "including names, addresses, and unique regional terms from various cultural contexts, such as Indian, East Asian, Middle Eastern, African, and Western names. "
        "The analysis should be precise, handling subtle differences in syntax and structure common in various languages and dialects. "
        "Ensure flexibility in recognizing variations in spelling, transliteration, and formatting of culturally specific information.\n\n"
        f"User Prompt: {prompt}\n\n"
        "Your task is to identify and flag all items that match the user's criteria in a manner that respects regional naming conventions, abbreviations, and format differences. "
        "Be thorough, and do not deviate from the user's prompt, but ensure the analysis accounts for a wide range of global linguistic patterns and naming conventions.\n\n"
        "Return all identified items in the following JSON format:\n\n"
        "[\n"
        "    {\n"
        '        "type": "Name",\n'
        '        "text": "Dupindar Singh"\n'
        "    },\n"
        "    {\n"
        '        "type": "Address",\n'
        '        "text": "123, M.G. Road, Bengaluru, Karnataka, India"\n'
        "    }\n"
        "    // Add ALL identified items\n"
        "]\n\n"
        "Ensure that you maintain this exact format at ALL COSTS.\n\n"
        f"Text to analyze:\n{text}"
    )
    try:
        gemini_response = get_gemini_response(prompt)
        if gemini_response:
            try:
                entities = extract_json(gemini_response)
            except Exception:
                logging.error("Error: Unable to parse JSON response from Gemini API")
                return []
        else:
            logging.error("Error: No response from Gemini API")
            return []
    except Exception as e:
        logging.error(f"Error in Gemini API call: {e}")
        return []

    sensitive_data = []
    for entity in entities:
        item_text = entity["text"]
        if len(item_text) <= 1:
            logging.warning(f"Skipping single character: {item_text}")
            continue
        if item_text.lower() in [
            "the",
            "a",
            "an",
            "and",
            "or",
            "but",
            "in",
            "on",
            "at",
            "to",
            "for",
        ]:
            logging.warning(f"Skipping common word: {item_text}")
            continue
        start = 0
        while True:
            start = text.find(item_text, start)
            if start == -1:
                break
            end = start + len(item_text)
            sensitive_data.append((item_text, start, end, entity["type"]))
            start = end

    for data in sensitive_data:
        logging.debug(f"Identified sensitive data: {data}")

    return sensitive_data


def get_sens(image_path, redaction_level=1):
    image = cv2.imread(image_path)
    ocr_data = perform_ocr(image)
    text_content = " ".join(ocr_data["text"])
    sensitive_data = find_sensitive_data(text_content, redaction_level)
    return sensitive_data, ocr_data


def get_sens_cust(image_path, prompt):
    image = cv2.imread(image_path)
    ocr_data = perform_ocr(image)
    text_content = " ".join(ocr_data["text"])
    sensitive_data = find_sensitive_data_cust(text_content, prompt)
    return sensitive_data, ocr_data


def get_redacted_image(
    image_path,
    output_path,
    model="yolov8n.pt",
    redaction_level=1,
    mode="black",
    sensitive_data=None,
    ocr_data=None,
):
    model = YOLO("yolov8n.pt")
    image = cv2.imread(image_path)
    if ocr_data is None:
        ocr_data = perform_ocr(image)
    redacted_image = redact_sensitive_data(image.copy(), ocr_data, sensitive_data, mode)
    if redaction_level > 1:
        qr_regions = detect_qr_codes(redacted_image)
        redacted_image = draw_redaction_boxes(redacted_image, qr_regions, mode)

        signature_regions = detect_signatures(redacted_image)
        redacted_image = draw_redaction_boxes(redacted_image, signature_regions, mode)

        image_regions = detect_images(redacted_image, model)
        redacted_image = draw_redaction_boxes(redacted_image, image_regions, mode)

    cv2.imwrite(output_path, redacted_image)
    logging.info(f"Redacted image saved as {output_path}")


def get_redacted_image_cust(
    image_path,
    output_path,
    model="yolov8n.pt",
    image=False,
    mode="black",
    sensitive_data=None,
    ocr_data=None,
):
    model = YOLO("yolov8n.pt")
    img = cv2.imread(image_path)
    if ocr_data is None:
        ocr_data = perform_ocr(img)
    redacted_image = redact_sensitive_data(img.copy(), ocr_data, sensitive_data, mode)
    if image:
        qr_regions = detect_qr_codes(redacted_image)
        redacted_image = draw_redaction_boxes(redacted_image, qr_regions, mode)

        signature_regions = detect_signatures(redacted_image)
        redacted_image = draw_redaction_boxes(redacted_image, signature_regions, mode)

        image_regions = detect_images(redacted_image, model)
        redacted_image = draw_redaction_boxes(redacted_image, image_regions, mode)

    cv2.imwrite(output_path, redacted_image)
    logging.info(f"Redacted image saved as {output_path}")


def annotate(image, sensitive_data):
    draw = ImageDraw.Draw(image, "RGBA")
    font = ImageFont.load_default()

    ocr_data = perform_ocr(np.array(image))

    for i, word in enumerate(ocr_data["text"]):
        for entity in sensitive_data:
            text, _, _, type_ = entity

            if text.lower() in word.lower():
                x, y = ocr_data["left"][i], ocr_data["top"][i]
                w, h = ocr_data["width"][i], ocr_data["height"][i]

                logging.info(f"Annotating '{text}' as {type_}")

                draw.rectangle([x, y, x + w, y + h], fill=(255, 255, 0, 64))
                draw.text((x, y - 15), f"{type_}", fill=(255, 0, 0), font=font)


def save_image(image, path):
    image.save(path)


def process_annot(input_path, sensitive_data, output_path):
    with Image.open(input_path) as img:
        annotate(img, sensitive_data)
        save_image(img, output_path)
    logging.info(f"Annotated image saved as {output_path}")


def main(image_path, output_path, model, redaction_level=1, mode="black"):
    image = cv2.imread(image_path)
    logging.info(f"Processing document: {image_path}")
    ocr_data = perform_ocr(image)
    text_content = " ".join(ocr_data["text"])
    sensitive_data = find_sensitive_data(text_content, redaction_level)
    if redaction_level >= 1:
        redacted_image = redact_sensitive_data(
            image.copy(), ocr_data, sensitive_data, mode
        )
    if redaction_level >= 2:
        qr_regions = detect_qr_codes(redacted_image)
        redacted_image = draw_redaction_boxes(redacted_image, qr_regions, mode)

        signature_regions = detect_signatures(redacted_image)
        redacted_image = draw_redaction_boxes(redacted_image, signature_regions, mode)
        image_regions = detect_images(redacted_image, model)
        redacted_image = draw_redaction_boxes(redacted_image, image_regions, mode)
    cv2.imwrite(output_path, redacted_image)
    logging.info(f"Redacted image saved as {output_path}")


if __name__ == "__main__":
    model = YOLO("yolov8n.pt")
    input_path = "input.jpg"
    output_path = "output_redacted.jpg"
    main(input_path, output_path, model, redaction_level=2, mode="blur")
