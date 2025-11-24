import pandas as pd
import requests
import io

def dataset_summary(file_url: str):
    """Generate summary statistics for a dataset"""
    try:
        # safe download
        print(f"[DEBUG] Downloading from: {file_url}")
        resp = requests.get(file_url, timeout=30)
        resp.raise_for_status()
        print(f"[DEBUG] Downloaded {len(resp.content)} bytes")
        
        df = pd.read_csv(io.BytesIO(resp.content))
        print(f"[DEBUG] Loaded dataframe: {df.shape}")

        summary = {
            "rows": int(df.shape[0]),
            "columns": int(df.shape[1]),
            "null_counts": df.isnull().sum().to_dict(),
            "column_types": df.dtypes.astype(str).to_dict()
        }
        print(f"[DEBUG] Summary: {summary}")
        return summary
    except requests.exceptions.RequestException as e:
        error_msg = f"Failed to download file from {file_url}: {str(e)}"
        print(f"[ERROR] {error_msg}")
        raise ValueError(error_msg)
    except pd.errors.ParserError as e:
        error_msg = f"Failed to parse CSV file: {str(e)}"
        print(f"[ERROR] {error_msg}")
        raise ValueError(error_msg)
    except Exception as e:
        error_msg = f"Unexpected error in dataset_summary: {str(e)}"
        print(f"[ERROR] {error_msg}")
        raise ValueError(error_msg)