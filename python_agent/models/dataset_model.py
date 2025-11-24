from bson import ObjectId
from datetime import datetime

def save_dataset_record(db, user_id, url, filename, size_bytes=None):
    doc = {
        "user_id": ObjectId(user_id),
        "url": url,
        "filename": filename,
        "size_bytes": size_bytes,
        "uploaded_at": datetime.utcnow()
    }
    res = db.datasets.insert_one(doc)
    return db.datasets.find_one({"_id": res.inserted_id})

def get_user_datasets(db, user_id):
    from bson import ObjectId
    return list(db.datasets.find({"user_id": ObjectId(user_id)}).sort("uploaded_at",-1))