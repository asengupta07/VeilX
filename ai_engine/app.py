from flask import Flask, request, send_file
from flask_cors import CORS
from redact import redact
import os

app = Flask(__name__)

CORS(app)

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

    return send_file(out_path, as_attachment=True, download_name=f"redacted_{doc.filename}")


if __name__ == "__main__":
    if not os.path.exists("temp"):
        os.makedirs("temp")
    app.run(debug=True)