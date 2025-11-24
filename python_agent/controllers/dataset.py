from flask import Blueprint, request, jsonify, current_app
from utils.cloudinary import upload_file_obj
from models.dataset_model import save_dataset_record, get_user_datasets

dataset_bp = Blueprint("dataset", __name__)

@dataset_bp.route("/upload", methods=["POST"])
def upload_dataset():
    print("hello")
    db = current_app.config['db']
    # expects multipart/form-data with 'file'
    if "file" not in request.files:
        return jsonify({"error": "file not provided"}), 400
    file = request.files["file"]
    filename = file.filename.rsplit(".", 1)[0] if file.filename else None

    try:
        res = upload_file_obj(file, filename)
    except Exception as e:
        return jsonify({"error": f"Upload failed: {str(e)}"}), 500

    url = res.get("secure_url")
    size = res.get("bytes")
    # save record to db
    saved = save_dataset_record(db, request.user_id, url, file.filename, size_bytes=size)
    # remove heavy fields if needed
    return jsonify({"ok": True, "url": url, "record": {"id": str(saved["_id"]), "filename": saved["filename"], "uploaded_at": saved["uploaded_at"].isoformat()}})

@dataset_bp.route("/mine", methods=["GET"])
def my_datasets():
    db = current_app.config['db']
    datasets = get_user_datasets(db, request.user_id)
    # convert ObjectId and datetimes to strings
    out = []
    for d in datasets:
        out.append({
            "id": str(d.get("_id")),
            "url": d.get("url"),
            "filename": d.get("filename"),
            "uploaded_at": d.get("uploaded_at").isoformat() if d.get("uploaded_at") else None
        })

        print(f"file name is {out}")
    return jsonify({"datasets":out})