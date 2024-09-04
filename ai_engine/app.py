from flask import Flask, request, send_file
from flask_cors import CORS
from redact import redact
from img_redact import redactImg
import os
import shutil

app = Flask(__name__)

CORS(app)

def clear_temp_folder():
    """Remove all files in the temp directory."""
    folder = "temp"
    for filename in os.listdir(folder):
        file_path = os.path.join(folder, filename)
        try:
            if os.path.isfile(file_path) or os.path.islink(file_path):
                os.unlink(file_path)
            elif os.path.isdir(file_path):
                shutil.rmtree(file_path)
        except Exception as e:
            print(f"Failed to delete {file_path}. Reason: {e}")

@app.route("/redaction", methods=["POST"])
def redaction():
    if "file" not in request.files:
        return "No file part", 400
    
    doc = request.files["file"]

    if doc.filename == "":
        return "No selected file", 400
    
    in_path = f"temp/{doc.filename}"
    out_path = f"temp/redacted_{doc.filename}"

    doc.save(in_path)

    redact(in_path, out_path)

    resp = send_file(out_path, as_attachment=True, download_name=f"redacted_{doc.filename}")

    clear_temp_folder()

    return resp


@app.route("/redactimg", methods=["POST"])
def redactimg():
    if "file" not in request.files:
        return "No file part", 400
    
    doc = request.files["file"]

    if doc.filename == "":
        return "No selected file", 400
    
    in_path = f"temp/{doc.filename}"
    out_path = f"temp/redacted_{doc.filename}"

    doc.save(in_path)

    redactImg(in_path, out_path)

    resp = send_file(out_path, as_attachment=True, download_name=f"redacted_{doc.filename}")

    clear_temp_folder()

    return resp



@app.route("/test", methods=["GET"])
def test():
    return "Test successful"

if not os.path.exists("temp"):
    os.makedirs("temp")
clear_temp_folder()

if __name__ == "__main__":
    app.run()
