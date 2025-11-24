import React from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Tooltip, Legend, Title } from "chart.js";
import { Bar, Line, Pie, Scatter } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Tooltip, Legend, Title);

export default function ChartPanel({ charts = [] }) {
  if (!charts || charts.length === 0) {
    return (
      <div className="p-6 border rounded-lg bg-white text-center text-slate-500">
        📊 No charts available. Upload a dataset to generate visualizations.
      </div>
    );
  }

  const renderChart = (chart) => {
    if (!chart) return null;

    const type = chart.type?.toLowerCase?.() ?? "bar";
    const data = chart.data || {};
    const options = {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { display: true, position: "top" },
        title: { display: !!chart.title, text: chart.title || "" },
      },
      ...(chart.options || {}),
    };

    try {
      switch (type) {
        case "bar":
        case "histogram":
          return <Bar data={data} options={options} height={300} />;
        case "line":
          return <Line data={data} options={options} height={300} />;
        case "pie":
          return <Pie data={data} options={options} height={300} />;
        case "scatter":
          return <Scatter data={data} options={options} height={300} />;
        default:
          return (
            <div className="p-4 bg-slate-50 rounded text-sm text-slate-600">
              <pre>{JSON.stringify(chart, null, 2)}</pre>
            </div>
          );
      }
    } catch (err) {
      console.error("Chart render error:", err);
      return (
        <div className="p-4 bg-red-50 rounded text-sm text-red-600">
          ⚠️ Error rendering chart: {err.message}
        </div>
      );
    }
  };

  return (
    <div className="space-y-6">
      {charts.map((c, i) => (
        <div key={i} className="p-6 border rounded-lg bg-white shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg text-slate-800">{c.title || `Chart ${i + 1}`}</h3>
            <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">{c.type?.toUpperCase?.() || "CHART"}</span>
          </div>
          <div className="bg-slate-50 p-4 rounded">{renderChart(c)}</div>
        </div>
      ))}
    </div>
  );
}
