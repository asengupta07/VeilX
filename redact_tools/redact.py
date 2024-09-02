import fitz
import json
import requests
import re
import logging

API_KEY = "adc4ae97-fa05-4faf-b1b4-a72805d035c4"

# Set up logging
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')

def extract_text_from_pdf(pdf_path):
    doc = fitz.open(pdf_path)
    text = ""
    for page_num in range(doc.page_count):
        page = doc[page_num]
        text += page.get_text()
    return text, doc

def find_sensitive_data(text):
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
        "Err on the side of caution - if in doubt, include it. However, do not flag single letters or common words unless they are part of a larger sensitive item. "
        "Provide your comprehensive analysis based on these instructions.\n\n"
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

    sensitive_data = []
    for entity in entities:
        item_text = entity['text']
        if len(item_text) <= 1:  # Skip single characters
            logging.warning(f"Skipping single character: {item_text}")
            continue
        if item_text.lower() in ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for']:  # Skip common words
            logging.warning(f"Skipping common word: {item_text}")
            continue
        start = 0
        while True:
            start = text.find(item_text, start)
            if start == -1:
                break
            end = start + len(item_text)
            sensitive_data.append((item_text, start, end, entity['type']))
            start = end

    # Additional regex patterns for URLs and potential identifiers
    url_pattern = re.compile(r'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+')
    identifier_pattern = re.compile(r'\b(?:[A-Z0-9]{8,}|[A-Z]{2,}\d+|\d+[A-Z]{2,})\b')

    for match in url_pattern.finditer(text):
        sensitive_data.append((match.group(), match.start(), match.end(), "URL"))

    for match in identifier_pattern.finditer(text):
        sensitive_data.append((match.group(), match.start(), match.end(), "Potential Identifier"))

    # Log all identified sensitive data
    for data in sensitive_data:
        logging.debug(f"Identified sensitive data: {data}")

    return sensitive_data

def redact_text_in_pdf(pdf_doc, sensitive_data):
    for page_num in range(pdf_doc.page_count):
        page = pdf_doc[page_num]
        for data, start, end, data_type in sensitive_data:
            # Find the sensitive data's position in the page
            instances = page.search_for(data)
            for inst in instances:
                # Log each redaction
                logging.info(f"Redacting on page {page_num + 1}: {data} ({data_type})")
                # Draw a black rectangle over the sensitive data
                page.add_redact_annot(inst, fill=(0, 0, 0))
        
        # Apply redactions for this page
        page.apply_redactions()

def redact_images_in_pdf(pdf_doc):
    for page_num in range(pdf_doc.page_count):
        page = pdf_doc[page_num]
        image_list = page.get_images(full=True)
        for img_index, img in enumerate(image_list):
            xref = img[0]
            rect = page.get_image_bbox(img)
            # Log each image redaction
            logging.info(f"Redacting image on page {page_num + 1}")
            # Create a black rectangle to cover the image
            page.add_redact_annot(rect, fill=(0, 0, 0))
        
        # Apply redactions for this page
        page.apply_redactions()

def save_redacted_pdf(pdf_doc, output_path):
    pdf_doc.save(output_path, garbage=4, deflate=True, clean=True)
    pdf_doc.close()

def main(input_pdf, output_pdf):
    text, pdf_doc = extract_text_from_pdf(input_pdf)
    sensitive_data = find_sensitive_data(text)
    redact_text_in_pdf(pdf_doc, sensitive_data)
    redact_images_in_pdf(pdf_doc)
    save_redacted_pdf(pdf_doc, output_pdf)
    logging.info(f"Redacted PDF saved as {output_pdf}")

if __name__ == "__main__":
    input_pdf = "input5.pdf"
    output_pdf = "output5.pdf"
    main(input_pdf, output_pdf)