import cloudinary
import cloudinary.uploader
from config import CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET

cloudinary.config(
    cloud_name=CLOUDINARY_CLOUD_NAME,
    api_key=CLOUDINARY_API_KEY,
    api_secret=CLOUDINARY_API_SECRET
)

def upload_file_obj(file_obj, filename=None):
    """
    file_obj: file-like object (werkzeug FileStorage or file.file)
    filename: optional public_id
    """
    options = {"resource_type": "raw", "folder": "data_insights_agent"}
    if filename:
        options["public_id"] = filename
    res = cloudinary.uploader.upload(file_obj, **options)
    return res