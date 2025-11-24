import pandas as pd
import requests
import io

def dataset_metrics(file_url: str):
    """Calculate metrics for numeric and categorical columns"""
    try:
        print(f"[DEBUG] Downloading from: {file_url}")
        resp = requests.get(file_url, timeout=30)
        resp.raise_for_status()
        df = pd.read_csv(io.BytesIO(resp.content))
        print(f"[DEBUG] Loaded dataframe: {df.shape}")

        numeric = df.select_dtypes(include=["number"])
        categorical = df.select_dtypes(include=["object","category"])

        metrics = {
            "numeric": numeric.describe().to_dict() if len(numeric.columns) > 0 else {},
            "categorical": categorical.describe().to_dict() if len(categorical.columns) > 0 else {}
        }
        print(f"[DEBUG] Metrics: {metrics}")
        return metrics
    except requests.exceptions.RequestException as e:
        error_msg = f"Failed to download file from {file_url}: {str(e)}"
        print(f"[ERROR] {error_msg}")
        raise ValueError(error_msg)
    except pd.errors.ParserError as e:
        error_msg = f"Failed to parse CSV file: {str(e)}"
        print(f"[ERROR] {error_msg}")
        raise ValueError(error_msg)
    except Exception as e:
        error_msg = f"Unexpected error in dataset_metrics: {str(e)}"
        print(f"[ERROR] {error_msg}")
        raise ValueError(error_msg)