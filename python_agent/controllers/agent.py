from flask import Blueprint, request, jsonify
from tools.summery import dataset_summary
from tools.metrics import dataset_metrics
from tools.chat import chat_about_dataset
from tools.charts import allChartsTool
import pandas as pd
from io import BytesIO
import requests

agent_bp = Blueprint("agent", __name__)

def load_dataset_from_url(file_url: str) -> pd.DataFrame:
    print("[agent] download dataset from:", file_url)
    r = requests.get(file_url, timeout=20)
    r.raise_for_status()
    lower = file_url.lower()
    if lower.endswith(".csv"):
        df = pd.read_csv(BytesIO(r.content))
    elif lower.endswith(".xlsx") or lower.endswith(".xls"):
        df = pd.read_excel(BytesIO(r.content))
    elif lower.endswith(".json"):
        df = pd.read_json(BytesIO(r.content))
    else:
        # try csv fallback
        try:
            df = pd.read_csv(BytesIO(r.content))
        except Exception as e:
            raise Exception("Unsupported file type: " + str(e))
    print(f"[agent] dataset loaded: rows={df.shape[0]} cols={df.shape[1]}")
    return df

@agent_bp.route("/summary", methods=["POST"])
def summary_route():
    payload = request.json or {}
    file_url = payload.get("file_url")
    if not file_url:
        return jsonify({"error": "file_url required"}), 400
    try:
        res = dataset_summary(file_url)
        return jsonify({"ok": True, "summary": res})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@agent_bp.route("/metrics", methods=["POST"])
def metrics_route():
    payload = request.json or {}
    file_url = payload.get("file_url")
    if not file_url:
        return jsonify({"error": "file_url required"}), 400
    try:
        res = dataset_metrics(file_url)
        return jsonify({"ok": True, "metrics": res})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@agent_bp.route("/chat", methods=["POST"])
def chat_route():
    payload = request.json or {}
    file_url = payload.get("file_url")
    question = payload.get("question")
    if not (file_url and question):
        return jsonify({"error": "file_url and question required"}), 400
    try:
        res = chat_about_dataset(file_url, question)
        return jsonify({"ok": True, "response": res})
    except Exception as e:
        return jsonify({"error":str(e)}),500



@agent_bp.route("/chart", methods=["POST"])
def chart_route():
    try:
        payload = request.get_json() or {}
        file_url = payload.get("file_url")
        if not file_url:
            return jsonify({"error": "file_url required"}), 400

        df = load_dataset_from_url(file_url)
        df_dict = df.to_dict(orient="list")
        charts = allChartsTool(df_dict)

        print("[agent] returning charts (count):", len(charts))
        return jsonify({"ok": True, "charts": charts}), 200
    except Exception as e:
        print("[agent] chart error:", str(e))
        return jsonify({"error": str(e)}), 500