import pandas as pd
import numpy as np

def allChartsTool(df_dict: dict):
    """
    Returns a list of chart objects (not wrapped).
    Each chart object is a plain dict:
      { type, title, labels?, values?, datasets?, xLabel?, yLabel? }
    """
    df = pd.DataFrame(df_dict)
    print("[agent] allChartsTool: DataFrame shape:", df.shape)
    # drop fully empty columns
    df = df.loc[:, ~(df.isnull().all())]
    numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
    category_cols = df.select_dtypes(include=['object', 'category']).columns.tolist()

    charts = []

    # BAR (category counts or numeric indexed)
    if category_cols:
        col = category_cols[0]
        vc = df[col].fillna("Unknown").astype(str).value_counts()
        charts.append({
            "type": "bar",
            "title": f"Counts of {col}",
            "labels": vc.index.tolist(),
            "values": vc.values.tolist()
        })
    elif numeric_cols:
        col = numeric_cols[0]
        labels = df.index.astype(str).tolist()
        charts.append({
            "type": "bar",
            "title": f"Bar of {col}",
            "labels": labels,
            "values": [float(x) if pd.notna(x) else 0 for x in df[col].tolist()]
        })

    # LINE (all numeric)
    if numeric_cols:
        labels = df.index.astype(str).tolist()
        datasets = []
        for col in numeric_cols:
            datasets.append({"label": col, "data": [float(x) if pd.notna(x) else 0 for x in df[col].tolist()]})
        charts.append({
            "type": "line",
            "title": "Line chart (numeric columns)",
            "labels": labels,
            "datasets": datasets
        })

    # PIE (first category)
    if category_cols:
        col = category_cols[0]
        vc = df[col].fillna("Unknown").astype(str).value_counts()
        charts.append({
            "type": "pie",
            "title": f"Pie of {col}",
            "labels": vc.index.tolist(),
            "values": vc.values.tolist()
        })

    # SCATTER (first two numeric)
    if len(numeric_cols) >= 2:
        x, y = numeric_cols[:2]
        pts = []
        for xi, yi in zip(df[x].tolist(), df[y].tolist()):
            if pd.isna(xi) or pd.isna(yi):
                continue
            pts.append({"x": float(xi), "y": float(yi)})
        charts.append({
            "type": "scatter",
            "title": f"{x} vs {y}",
            "datasets": [{"label": f"{x} vs {y}", "data": pts}],
            "xLabel": x,
            "yLabel": y
        })

    # HISTOGRAM (first numeric)
    if numeric_cols:
        col = numeric_cols[0]
        arr = df[col].dropna().astype(float).values
        if len(arr) > 0:
            hist, bins = np.histogram(arr, bins=10)
            bin_labels = [f"{bins[i]:.2f}" for i in range(len(bins)-1)]
            charts.append({
                "type": "histogram",
                "title": f"Histogram of {col}",
                "labels": bin_labels,
                "values": hist.tolist()
            })

    print(f"[agent] generated {len(charts)} charts")
    return charts