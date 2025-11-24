import React from "react";
import { motion } from "framer-motion";

const MetricsSummary = ({ metrics }) => {
  if (!metrics) {
    return (
      <div className="p-6 bg-white rounded-xl shadow text-center text-gray-400 border">
        No metrics available
      </div>
    );
  }

  // Helper → formats nested objects into readable text
  const renderValue = (val) => {
    if (val === null || val === undefined) return "N/A";

    if (typeof val === "object") {
      return (
        <pre className="text-xs bg-gray-100 p-3 rounded whitespace-pre-wrap overflow-x-auto">
          {JSON.stringify(val, null, 2)}
        </pre>
      );
    }

    return String(val);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-6 bg-white rounded-xl shadow border space-y-4"
    >
      <h2 className="text-lg font-semibold text-gray-800">
        Dataset Metrics Summary
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Object.entries(metrics).map(([key, value], index) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="p-4 rounded-lg bg-gray-50 border shadow-sm"
          >
            <div className="text-xs uppercase tracking-wide text-gray-500">
              {key.replace(/_/g, " ")}
            </div>

            <div className="mt-2 text-sm text-gray-800">
              {renderValue(value)}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default MetricsSummary;
