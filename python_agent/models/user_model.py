from bson import ObjectId

def create_user(db, user_obj):
    res = db.users.insert_one(user_obj)
    return db.users.find_one({"_id": res.inserted_id})

def find_user_by_email(db, email):
    return db.users.find_one({"email": email})

def find_user_by_id(db, user_id):
    return db.users.find_one({"_id": ObjectId(user_id)})