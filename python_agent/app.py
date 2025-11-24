from flask import Flask, jsonify
from flask_cors import CORS
import pymongo
from config import MONGO_URI

# controllers import
from controllers.dataset import dataset_bp
from controllers.agent import agent_bp

app = Flask(__name__)
CORS(app)

# MongoDB client (shared)
mongo_client = pymongo.MongoClient(MONGO_URI)
db = mongo_client["data_insights_db"]

# Store db in app config to avoid circular imports
app.config['db'] = db
app.register_blueprint(dataset_bp, url_prefix="/dataset")
app.register_blueprint(agent_bp, url_prefix="/agent")

@app.route("/")
def home():
    return jsonify({"status": "Agent backend running"})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8001,debug=True)