import pandas as pd
import requests
import io
import os
from config import GEMINI_API_KEY
import google.generativeai as genai



def chat_about_dataset(file_url: str, question: str):
    """Answer questions about a dataset using Gemini API"""
    try:
        print(f"[DEBUG] Downloading from: {file_url}")
        resp = requests.get(file_url, timeout=30)
        resp.raise_for_status()
        df = pd.read_csv(io.BytesIO(resp.content))
        preview = df.head(5).to_string()
        print(f"[DEBUG] Dataset shape: {df.shape}")

        # Try using Gemini API
        if GEMINI_API_KEY:
            try:
                genai.configure(api_key=GEMINI_API_KEY)
                # for m in genai.list_models():
                #     print(m.name, m.supported_generation_methods)
                
                # Choose a model (Gemini 1.5 Pro is common)
                model = genai.GenerativeModel("gemini-pro-latest")
                
                prompt = f"""You are a data analyst. Here is a preview of a dataset (first 5 rows):
{preview}

User question: {question}

Answer concisely and refer to the dataset when appropriate."""
                
                response = model.generate_content(prompt)
                reply = response.text if hasattr(response, 'text') else str(response)
                print(f"[DEBUG] Gemini response received")
                return {"reply": reply}
            except ImportError:
                # Fallback if google-generativeai not installed
                print("[WARNING] google-generativeai not installed, using fallback")
                basic = f"Preview: {preview}\n\nQuestion: {question}\n\n(Gemini API not available)"
                return {"reply": basic}
        else:
            # Fallback: basic heuristic reply
            basic = f"Preview: {preview}\n\nQuestion: {question}\n\n(Gemini API key not configured)"
            return {"reply": basic}
    except requests.exceptions.RequestException as e:
        error_msg = f"Failed to download file from {file_url}: {str(e)}"
        print(f"[ERROR] {error_msg}")
        raise ValueError(error_msg)
    except pd.errors.ParserError as e:
        error_msg = f"Failed to parse CSV file: {str(e)}"
        print(f"[ERROR] {error_msg}")
        raise ValueError(error_msg)
    except Exception as e:
        error_msg = f"Unexpected error in chat_about_dataset: {str(e)}"
        print(f"[ERROR] {error_msg}")
        raise ValueError(error_msg)