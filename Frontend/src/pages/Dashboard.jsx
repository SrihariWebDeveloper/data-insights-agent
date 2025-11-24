import React, { useState } from "react";
import UploadForm from "../components/UploadForm.jsx";
import ChartPanel from "../components/ChartPanel.jsx";
import MetricsSummary from "../components/MetricsSummary.jsx";
import Conversation from "../components/Conversation.jsx";

export default function Dashboard() {
  const [charts, setCharts] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [summary, setSummary] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileUploaded = async (uploadedFileUrl) => {
    setFileUrl(uploadedFileUrl);
    setLoading(true);
    try {
      const res = await fetch("https://data-insights-agent-1.onrender.com/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ datasetUrl: uploadedFileUrl }),
      });
      const data = await res.json();
      console.log("[frontend] /api/analyze response:", data);
      setCharts(Array.isArray(data.charts) ? data.charts : []);
      setMetrics(data.metrics ?? null);
      setSummary(data.summary ?? null);
    } catch (err) {
      console.error("[frontend] analyze error:", err);
      setCharts([]);
      setMetrics(null);
      setSummary(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Data Insights Dashboard</h1>
      <UploadForm onFileUploaded={handleFileUploaded} />

      {loading && <div className="p-3 bg-blue-50 rounded">Analyzing...</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2 space-y-6">
          <ChartPanel charts={charts} />
          <MetricsSummary metrics={metrics} summary={summary} />
        </div>
        <aside>
          <Conversation fileUrl={fileUrl} />
        </aside>
      </div>
    </div>
  );
}
