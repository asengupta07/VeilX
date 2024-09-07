from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
from redact import redact
from img_redact import redactImg
from redactv2 import get_sensitive, redactv2, annotate_pdf, get_sensitive_custom, custom_redactv2, add_transaction_hash_to_pdf
import os
import shutil

app = Flask(__name__)
CORS(app)

@app.route('/addtxn', methods=['POST'])
def addtxn():
    if "file" not in request.files:
        return "No file part", 400
    
    doc = request.files["file"]
    txn = request.form["txn"]

    if doc.filename == "":
        return "No selected file", 400
    
    in_path = f"temp/{doc.filename}"
    out_path = f"temp/hash_{doc.filename}"

    doc.save(in_path)

    try:
        transaction_hash = add_transaction_hash_to_pdf(in_path, out_path)
        
        resp = send_file(out_path, as_attachment=True, download_name=f"hash_{doc.filename}")
        
        clear_temp_folder()
        
        return jsonify({
            'message': 'Transaction hash added successfully',
            'transaction_hash': transaction_hash,
            'file': resp
        })
    except Exception as e:
        clear_temp_folder()
        return jsonify({
            'error': str(e)
        }), 500

@app.route('/redactv2', methods=['POST'])
def rv2():
    data = request.json
    sensitive = data['sensitive']
    doc = data['doc']
    print(type(data['level']))
    level = int(data['level'])
    mode = data['mode']

    in_path = f"temp/{doc}"
    out_path = f"temp/redacted_{doc}"
    vop = f"temp/verified_{doc}"
    sens = []
    for sen in sensitive:
        tup = (sen['text'], sen['start'], sen['end'], sen['type'])
        sens.append(tup)

    redactv2(in_path, sens, out_path, level, mode)

    add_transaction_hash_to_pdf(out_path, vop)

    resp = send_file(vop, as_attachment=True, download_name=f"redacted_{doc}")

    clear_temp_folder()

    return resp


@app.route("/customsens", methods=["POST"])
def customsens():
    if "file" not in request.files:
        return "No file part", 400
    
    prompt = request.form['prompt']

    doc = request.files["file"]

    if doc.filename == "":
        return "No selected file", 400
    
    in_path = f"temp/{doc.filename}"
    annotated_path = f"temp/annotated_{doc.filename}"

    doc.save(in_path)

    sensitive = get_sensitive_custom(in_path, prompt)
    resp = []
    for sens in sensitive:
        li = {}
        li['text'] = sens[0]
        li['start'] = sens[1]
        li['end'] = sens[2]
        li['type'] = sens[3]
        resp.append(li)

    return jsonify({
        'doc': doc.filename,
        'sensitive': resp,
    })


@app.route('/customrv2', methods=['POST'])
def customrv2():
    data = request.json
    sensitive = data['sensitive']
    doc = data['doc']

    # image = True if int(data["image"]) == 1 else False
    image = False

    in_path = f"temp/{doc}"
    out_path = f"temp/redacted_{doc}"
    sens = []
    for sen in sensitive:
        tup = (sen['text'], sen['start'], sen['end'], sen['type'])
        sens.append(tup)

    custom_redactv2(in_path, sens, out_path, image, mode="black")

    resp = send_file(out_path, as_attachment=True, download_name=f"redacted_{doc}")

    clear_temp_folder()

    return resp


@app.route('/sensitive', methods=['POST'])
def sens():
    if "file" not in request.files:
        return "No file part", 400
    
    doc = request.files["file"]
    level = int(request.form['level'])

    if doc.filename == "":
        return "No selected file", 400
    
    in_path = f"temp/{doc.filename}"
    annotated_path = f"temp/annotated_{doc.filename}"

    doc.save(in_path)

    sensitive = get_sensitive(in_path, level)
    resp = []
    for sens in sensitive:
        li = {}
        li['text'] = sens[0]
        li['start'] = sens[1]
        li['end'] = sens[2]
        li['type'] = sens[3]
        resp.append(li)
    
    annotate_pdf(in_path, sensitive, annotated_path)

    return jsonify({
        'doc': doc.filename,
        'sensitive': resp,
        'annotated_pdf': f"/download_annotated/{doc.filename}"
    })


@app.route('/download_annotated/<filename>', methods=['GET'])
def download_annotated(filename):
    annotated_path = f"temp/annotated_{filename}"
    return send_file(annotated_path, as_attachment=True, download_name=f"annotated_{filename}")


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
    app.run(host="0.0.0.0")
