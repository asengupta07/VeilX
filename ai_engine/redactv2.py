import fitz
import json
import requests
import re
import logging
import google.generativeai as genai
import ast
from dotenv import load_dotenv
import os

load_dotenv()

API_KEY = os.getenv("API_KEY")
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

# Set up logging
logging.basicConfig(
    level=logging.DEBUG, format="%(asctime)s - %(levelname)s - %(message)s"
)

# Configure Gemini
genai.configure(api_key=GOOGLE_API_KEY)


def extract_text_from_pdf(pdf_path):
    doc = fitz.open(pdf_path)
    text = ""
    for page_num in range(doc.page_count):
        page = doc[page_num]
        text += page.get_text()
    return text, doc


def extract_json(response_text):
    # Regex to detect and extract JSON from the response
    try:
        json_data = json.loads(response_text)
        return json_data
    except json.JSONDecodeError:
        json_pattern = re.search(
            r"```(JSON|json)?\s*(.*?)```", response_text, re.DOTALL
        )
        if json_pattern:
            json_string = json_pattern.group(2)
            try:
                json_data = ast.literal_eval(json_string)
                return json_data
            except json.JSONDecodeError as e:
                logging.error(f"Error decoding JSON: {str(e)}")
                return None
    return None


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


def find_sensitive_data(text, level):
    if level == 1 or level == 2:
        prompt = (
            "You are a powerful text analysis tool designed to identify all important and sensitive numbers in text. "
            "Please analyze the following text and flag ALL instances of the following types of numbers:\n\n"
            "1. Aadhaar Numbers: Detect any mention of Aadhaar numbers.\n"
            "2. PAN Numbers: Identify any PAN (Permanent Account Number) in the text.\n"
            "3. Passport Numbers: Flag any references to passport numbers.\n"
            "4. Driving License Numbers: Identify any driving license numbers mentioned.\n"
            "5. Employee ID Numbers: Detect any employee ID numbers.\n"
            "6. Bank Account Numbers: Identify any bank account numbers.\n"
            "7. Credit/Debit Card Numbers: Flag any credit or debit card numbers.\n"
            "8. Other Identification Numbers: Detect any other sensitive identification numbers that could be used to identify an individual or entity.\n\n"
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
            "Provide your comprehensive analysis based on these instructions. Only return the JSON.\n\n"
            f"Text to analyze:\n{text}"
        )

    if level == 3:
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
            '        "value": "John Doe"\n'
            "    },\n"
            "    {\n"
            '        "type": "Number",\n'
            '        "value": "1234 5678 9101"\n'
            "    },\n"
            "    {\n"
            '        "type": "Number",\n'
            '        "value": "ABCDE1234F"\n'
            "    }\n"
            "    // Add ALL identified items\n"
            "]\n\n"
            "Err on the side of caution—if there is any doubt about whether something is a name or number, include it. Consider all variations in name and number formats across different cultures and document types. Your goal is to identify every possible name and number, leaving nothing unflagged.\n"
            "Return only the JSON output containing the flagged names and numbers.\n\n"
            f"Text to analyze:\n{text}"
        )

    else:
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
        print(gemini_response)
        if gemini_response:
            try:
                entities = extract_json(gemini_response)
            except json.JSONDecodeError:
                logging.error("Error: Unable to parse JSON response from Gemini API")
                return []
        else:
            logging.error("Both Jabir and Gemini API calls failed")
            return []

    sensitive_data = []
    for entity in entities:
        item_text = entity["text"]
        if len(item_text) <= 1:  # Skip single characters
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
        ]:  # Skip common words
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

    # Additional regex patterns for URLs and potential identifiers
    url_pattern = re.compile(
        r"http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+"
    )
    identifier_pattern = re.compile(r"\b(?:[A-Z0-9]{8,}|[A-Z]{2,}\d+|\d+[A-Z]{2,})\b")

    for match in url_pattern.finditer(text):
        sensitive_data.append((match.group(), match.start(), match.end(), "URL"))

    for match in identifier_pattern.finditer(text):
        sensitive_data.append(
            (match.group(), match.start(), match.end(), "Potential Identifier")
        )

    # Log all identified sensitive data
    for data in sensitive_data:
        logging.debug(f"Identified sensitive data: {data}")

    return sensitive_data


def redact_text_in_pdf(pdf_doc, sensitive_data, level):
    for page_num in range(pdf_doc.page_count):
        page = pdf_doc[page_num]
        for data, start, end, data_type in sensitive_data:
            # Redact the full sensitive data
            instances = page.search_for(data, quads=True)
            for inst in instances:
                logging.info(
                    f"Redacting full text on page {page_num + 1}: {data} ({data_type})"
                )
                page.add_redact_annot(inst, fill=(1, 1, 1))

            # Split the data into words and redact each word
            words = data.split()
            for word in words:
                word_instances = page.search_for(word, quads=True)
                for word_inst in word_instances:
                    logging.info(
                        f"Redacting word on page {page_num + 1}: {word} ({data_type})"
                    )
                    page.add_redact_annot(word_inst, fill=(1, 1, 1))

        # Apply redactions for this page
        if level < 3:
            page.apply_redactions(images=0, graphics=0)
        else:
            page.apply_redactions()

def get_custom_sensitive_data(text, user_prompt):
    # Customize the prompt based on the user input
    prompt = (
        "You are a powerful text analysis tool. "
        "Please analyze the following text based on the user's custom prompt:\n\n"
        f"User Prompt: {user_prompt}\n\n"
        "Identify and flag all items that match the user's criteria. Be robust but do not deviate from the user's prompt. Return them in the following JSON format:\n\n"
        "[\n"
        "    {\n"
        "        \"type\": \"Custom\",\n"
        "        \"text\": \"Example data\"\n"
        "    }\n"
        "    // Add ALL identified items\n"
        "]\n\n"
        f"Text to analyze:\n{text}"
    )

    try:
        # Use get_gemini_response to make the request and get a response
        gemini_response = get_gemini_response(prompt)
        if gemini_response:
            print(gemini_response)  # Debugging print statement
            try:
                entities = json.loads(gemini_response)  # Parsing the JSON response
            except json.JSONDecodeError:
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
            sensitive_data.append((item_text, start, end, entity["type"]))
            start = end
            
    for data in sensitive_data:
        logging.debug(f"Identified sensitive data: {data}")

    return sensitive_data


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
            page.add_redact_annot(rect, fill=(1, 1, 1))

        # Apply redactions for this page
        page.apply_redactions()


def save_redacted_pdf(pdf_doc, output_path):
    pdf_doc.save(output_path, garbage=4, deflate=True, clean=True)
    pdf_doc.close()


def get_sensitive(input_pdf, level):
    text, pdf_doc = extract_text_from_pdf(input_pdf)
    sensitive_data = find_sensitive_data(text, level)
    return sensitive_data



def get_sensitive_custom(input_pdf, prompt):
    text, pdf_doc = extract_text_from_pdf(input_pdf)
    sensitive_data = find_custom_sensitive_data(text, prompt)
    return sensitive_data

def redactv2(input_pdf, sensitive_data, output_pdf, level):
    text, pdf_doc = extract_text_from_pdf(input_pdf)
    redact_text_in_pdf(pdf_doc, sensitive_data, level)
    if level < 2:
        redact_images_in_pdf(pdf_doc)
    save_redacted_pdf(pdf_doc, output_pdf)
    logging.info(f"Redacted PDF saved as {output_pdf}")


def annotate_sensitive_data_in_pdf(pdf_doc, sensitive_data):
    for page_num in range(pdf_doc.page_count):
        page = pdf_doc[page_num]
        page_text = page.get_text()

        for entity in sensitive_data:
            entity_text = entity['text']
            entity_type = entity['type']

            # Find all instances of the sensitive data in the page's text
            instances = page.search_for(entity_text)
            for inst in instances:
                # Log the annotation
                logging.info(f"Annotating '{entity_text}' as {entity_type} on page {page_num + 1}")
                
                # Add a highlight annotation to the sensitive data
                highlight = page.add_highlight_annot(inst)

                # Optionally, you can add a popup note to explain the annotation
                highlight.set_info(
                    title="Sensitive Data",
                    content=f"Type: {entity_type}\nText: {entity_text}"
                )

def save_annotated_pdf(pdf_doc, output_path):
    pdf_doc.save(output_path, garbage=4, deflate=True, clean=True)
    pdf_doc.close()

def annotate_pdf(input_pdf, sensitive_data, output_pdf):
    text, pdf_doc = extract_text_from_pdf(input_pdf)
    annotate_sensitive_data_in_pdf(pdf_doc, sensitive_data)
    save_annotated_pdf(pdf_doc, output_pdf)
    logging.info(f"Annotated PDF saved as {output_pdf}")


# if __name__ == "__main__":
#     input_pdf = "input5.pdf"
#     output_pdf = "output5.pdf"
#     redact(input_pdf, output_pdf)
