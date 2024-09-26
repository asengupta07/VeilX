from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
from redact import redact
from img_redactv3 import (
    get_sens,
    get_sens_cust,
    get_redacted_image,
    get_redacted_image_cust,
    process_annot,
    perform_ocr,
)

from img_redactv4 import (
    get_sens as get_sens_v2,
    get_sens_cust as get_sens_cust_v2,
    get_redacted_image as get_redacted_image_v2,
    get_redacted_image_cust as get_redacted_image_cust_v2,
    process_annot as process_annot_v2,
    sign_image,
    # perform_ocr as perform_ocr_v2,
)
from img_redact import redactImg
from redactv2 import (
    get_sensitive,
    redactv2,
    annotate_pdf,
    get_sensitive_custom,
    custom_redactv2,
    add_txn,
    get_cat,
)
import os
import shutil

app = Flask(__name__)
CORS(app)


@app.route("/ocrtest", methods=["POST"])
def ocrtest():
    if "file" not in request.files:
        return "No file part", 400

    doc = request.files["file"]

    if doc.filename == "":
        return "No selected file", 400

    in_path = f"temp/{doc.filename}"

    doc.save(in_path)

    text = perform_ocr(in_path)

    return jsonify({"text": text})


@app.route("/signimg", methods=["POST"])
def signimg():
    if "file" not in request.files:
        return "No file part", 400

    doc = request.files["file"]
    txn = request.form["txn"]

    if doc.filename == "":
        return "No selected file", 400

    in_path = f"temp/{doc.filename}"
    out_path = f"temp/signed_{doc.filename}"

    doc.save(in_path)

    sign_image(in_path, out_path, txn=txn)

    resp = send_file(
        out_path, as_attachment=True, download_name=f"signed_{doc.filename}"
    )

    return resp


@app.route("/addtxn", methods=["POST"])
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
        add_txn(in_path, out_path, txn)

        resp = send_file(
            out_path, as_attachment=True, download_name=f"hashed_{doc.filename}"
        )

        return resp

    except Exception as e:
        # clear_temp_folder()
        print(e)
        return jsonify({"error": str(e)}), 500


@app.route("/clear", methods=["GET"])
def clear():
    clear_temp_folder()
    return "Temp folder cleared"


@app.route("/getcat", methods=["POST"])
def getcat():
    if "file" not in request.files:
        return "No file part", 400

    doc = request.files["file"]

    if doc.filename == "":
        return "No selected file", 400

    in_path = f"temp/{doc.filename}"

    doc.save(in_path)

    try:
        category = get_cat(in_path)
        return jsonify({"category": category})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/redactv2", methods=["POST"])
def rv2():
    data = request.json
    sensitive = data["sensitive"]
    doc = data["doc"]
    print(type(data["level"]))
    level = int(data["level"])
    mode = data["mode"]

    in_path = f"temp/{doc}"
    out_path = f"temp/redacted_{doc}"
    sens = []
    for sen in sensitive:
        tup = (sen["text"], sen["start"], sen["end"], sen["type"])
        sens.append(tup)

    redactv2(in_path, sens, out_path, level, mode)

    resp = send_file(out_path, as_attachment=True, download_name=f"redacted_{doc}")

    clear_temp_folder()

    return resp


@app.route("/customsens", methods=["POST"])
def customsens():
    if "file" not in request.files:
        return "No file part", 400

    prompt = request.form["prompt"]

    doc = request.files["file"]

    if doc.filename == "":
        return "No selected file", 400

    in_path = f"temp/{doc.filename}"

    doc.save(in_path)

    sensitive = get_sensitive_custom(in_path, prompt)
    resp = []
    for sens in sensitive:
        li = {}
        li["text"] = sens[0]
        li["start"] = sens[1]
        li["end"] = sens[2]
        li["type"] = sens[3]
        resp.append(li)

    return jsonify(
        {
            "doc": doc.filename,
            "sensitive": resp,
        }
    )


@app.route("/customrv2", methods=["POST"])
def customrv2():
    data = request.json
    sensitive = data["sensitive"]
    doc = data["doc"]

    image = True if int(data["image"]) == 1 else False
    # image = False

    in_path = f"temp/{doc}"
    out_path = f"temp/redacted_{doc}"
    sens = []
    for sen in sensitive:
        tup = (sen["text"], sen["start"], sen["end"], sen["type"])
        sens.append(tup)

    custom_redactv2(in_path, sens, out_path, image, mode="black")

    resp = send_file(out_path, as_attachment=True, download_name=f"redacted_{doc}")

    # clear_temp_folder()

    return resp


@app.route("/redactimgcust", methods=["POST"])
def redactimgcust():
    data = request.json
    sensitive = data["sensitive"]
    doc = data["doc"]

    image = True if int(data["image"]) == 1 else False

    in_path = f"temp/{doc}"
    out_path = f"temp/redacted_{doc}"
    sens = []
    for sen in sensitive:
        tup = (sen["text"], sen["start"], sen["end"], sen["type"])
        sens.append(tup)

    get_redacted_image_cust(in_path, sens, out_path, image)

    resp = send_file(out_path, as_attachment=True, download_name=f"redacted_{doc}")

    # clear_temp_folder()

    return resp


@app.route("/redactimgcustv2", methods=["POST"])
def redactimgcustv2():
    data = request.json
    sensitive = data["sensitive"]
    doc = data["doc"]
    ocr = data["ocr"]
    print(ocr)

    image = True if int(data["image"]) == 1 else False

    in_path = f"temp/{doc}"
    out_path = f"temp/redacted_{doc}"
    # sens = []
    # for sen in sensitive:
    #     tup = (sen["text"], sen["start"], sen["end"], sen["type"])
    #     sens.append(tup)

    get_redacted_image_cust_v2(
        image_path=in_path,
        sensitive_data=sensitive,
        output_path=out_path,
        image=image,
        ocr_data=ocr,
    )

    resp = send_file(out_path, as_attachment=True, download_name=f"redacted_{doc}")

    # clear_temp_folder()

    return resp


@app.route("/redactimgv3", methods=["POST"])
def redactimgv3():
    data = request.json
    sensitive = data["sensitive"]
    doc = data["doc"]
    level = int(data["level"])
    mode = data["mode"]

    in_path = f"temp/{doc}"
    out_path = f"temp/redacted_{doc}"

    get_redacted_image(
        image_path=in_path,
        sensitive_data=sensitive,
        output_path=out_path,
        redaction_level=level,
        mode=mode,
    )

    resp = send_file(out_path, as_attachment=True, download_name=f"redacted_{doc}")

    # clear_temp_folder()

    return resp


@app.route("/redactimgv4", methods=["POST"])
def redactimgv4():
    data = request.json
    sensitive = data["sensitive"]
    doc = data["doc"]
    level = int(data["level"])
    mode = data["mode"]
    ocr = data["ocr"]
    print(ocr)

    in_path = f"temp/{doc}"
    out_path = f"temp/redacted_{doc}"

    get_redacted_image_v2(
        image_path=in_path,
        sensitive_data=sensitive,
        output_path=out_path,
        redaction_level=level,
        mode=mode,
        ocr_data=ocr,
    )

    resp = send_file(out_path, as_attachment=True, download_name=f"redacted_{doc}")

    # clear_temp_folder()

    return resp


@app.route("/sensitive", methods=["POST"])
def sens():
    if "file" not in request.files:
        return "No file part", 400

    doc = request.files["file"]
    level = int(request.form["level"])

    if doc.filename == "":
        return "No selected file", 400

    in_path = f"temp/{doc.filename}"
    annotated_path = f"temp/annotated_{doc.filename}"

    doc.save(in_path)

    sensitive = get_sensitive(in_path, level)
    resp = []
    for sens in sensitive:
        li = {}
        li["text"] = sens[0]
        li["start"] = sens[1]
        li["end"] = sens[2]
        li["type"] = sens[3]
        resp.append(li)

    annotate_pdf(in_path, sensitive, annotated_path)

    return jsonify(
        {
            "doc": doc.filename,
            "sensitive": resp,
            "annotated_pdf": f"/download_annotated/{doc.filename}",
        }
    )


@app.route("/imgsens", methods=["POST"])
def imgsens():
    if "file" not in request.files:
        return "No file part", 400

    doc = request.files["file"]
    level = int(request.form["level"])

    if doc.filename == "":
        return "No selected file", 400

    in_path = f"temp/{doc.filename}"
    annot_path = f"temp/annotated_{doc.filename}"

    doc.save(in_path)

    sensitive = get_sens(in_path, level)

    process_annot(in_path, sensitive, annot_path)

    resp = []
    for sens in sensitive:
        li = {}
        li["text"] = sens[0]
        li["start"] = sens[1]
        li["end"] = sens[2]
        li["type"] = sens[3]
        resp.append(li)

    return jsonify(
        {
            "doc": doc.filename,
            "sensitive": resp,
            "annotated_img": f"/download_annotated/{doc.filename}",
        }
    )


@app.route("/imgsensv2", methods=["POST"])
def imgsensv2():
    if "file" not in request.files:
        return "No file part", 400

    doc = request.files["file"]
    level = int(request.form["level"])

    if doc.filename == "":
        return "No selected file", 400

    in_path = f"temp/{doc.filename}"
    annot_path = f"temp/annotated_{doc.filename}"

    doc.save(in_path)

    sensitive, ocr = get_sens_v2(in_path, level)

    process_annot_v2(in_path, sensitive, annot_path)

    resp = []
    for sens in sensitive:
        li = {}
        li["text"] = sens[0]
        li["start"] = sens[1]
        li["end"] = sens[2]
        li["type"] = sens[3]
        resp.append(li)

    return jsonify(
        {
            "doc": doc.filename,
            "sensitive": resp,
            "ocr": ocr,
            "annotated_img": f"/download_annotated/{doc.filename}",
        }
    )


@app.route("/imgsenscustv2", methods=["POST"])
def imgsenscustv2():
    if "file" not in request.files:
        return "No file part", 400

    prompt = request.form["prompt"]

    doc = request.files["file"]

    if doc.filename == "":
        return "No selected file", 400

    in_path = f"temp/{doc.filename}"
    annotated_path = f"temp/annotated_{doc.filename}"

    doc.save(in_path)

    sensitive, ocr = get_sens_cust_v2(in_path, prompt)
    resp = []
    for sens in sensitive:
        li = {}
        li["text"] = sens[0]
        li["start"] = sens[1]
        li["end"] = sens[2]
        li["type"] = sens[3]
        resp.append(li)

    process_annot_v2(in_path, sensitive, annotated_path)

    return jsonify(
        {
            "doc": doc.filename,
            "sensitive": resp,
            "ocr": ocr,
            "annotated_pdf": f"/download_annotated/{doc.filename}",
        }
    )


@app.route("/imgsenscust", methods=["POST"])
def imgsenscust():
    if "file" not in request.files:
        return "No file part", 400

    prompt = request.form["prompt"]

    doc = request.files["file"]

    if doc.filename == "":
        return "No selected file", 400

    in_path = f"temp/{doc.filename}"
    annotated_path = f"temp/annotated_{doc.filename}"

    doc.save(in_path)

    sensitive = get_sens_cust(in_path, prompt)
    resp = []
    for sens in sensitive:
        li = {}
        li["text"] = sens[0]
        li["start"] = sens[1]
        li["end"] = sens[2]
        li["type"] = sens[3]
        resp.append(li)

    process_annot(in_path, sensitive, annotated_path)

    return jsonify(
        {
            "doc": doc.filename,
            "sensitive": resp,
            "annotated_pdf": f"/download_annotated/{doc.filename}",
        }
    )


@app.route("/download_annotated/<filename>", methods=["GET"])
def download_annotated(filename):
    annotated_path = f"temp/annotated_{filename}"
    return send_file(
        annotated_path, as_attachment=True, download_name=f"annotated_{filename}"
    )


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

    resp = send_file(
        out_path, as_attachment=True, download_name=f"redacted_{doc.filename}"
    )

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

    resp = send_file(
        out_path, as_attachment=True, download_name=f"redacted_{doc.filename}"
    )

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
