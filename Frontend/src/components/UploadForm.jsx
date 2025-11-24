import React, { useState } from "react";

/**
 * Usage:
 * <UploadForm onFileUploaded={url => { ... }} />
 */
const UploadForm = ({ onFileUploaded }) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  // Use XMLHttpRequest for progress or axios if you prefer
  const handle = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setProgress(0);

    try {
      // Build form data
      const fd = new FormData();
      fd.append("file", file); // IMPORTANT: field name must match server multer('file')

      console.log("[frontend] starting upload:", file.name, file.type, file.size);

      // Use fetch with no progress support OR axios for progress.
      // We'll use XMLHttpRequest here to get progress and robust error messages.
      await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "http://localhost:3000/api/upload");

        xhr.onload = () => {
          try {
            const status = xhr.status;
            const text = xhr.responseText;
            console.log("[frontend] raw upload response text:", text);

            // parse JSON safely
            const data = text ? JSON.parse(text) : {};
            if (status >= 200 && status < 300) {
              console.log("[frontend] upload success:", data);
              const url = data.fileUrl || data.file_url || data.url;
              if (!url) {
                return reject(new Error("Server returned no fileUrl. Response: " + text));
              }
              onFileUploaded(url);
              return resolve();
            } else {
              return reject(new Error("Upload failed (" + status + "): " + text));
            }
          } catch (err) {
            return reject(err);
          }
        };

        xhr.onerror = () => reject(new Error("Network error during upload"));
        xhr.onabort = () => reject(new Error("Upload aborted"));
        xhr.upload.onprogress = (evt) => {
          if (evt.lengthComputable) {
            const p = Math.round((evt.loaded / evt.total) * 100);
            setProgress(p);
          }
        };

        xhr.send(fd);
      });

    } catch (err) {
      console.error("[frontend] upload error:", err);
      alert("Upload failed: " + (err.message || err));
    } finally {
      setUploading(false);
      setProgress(0);
      // Clear the file input so user can re-upload the same file if needed
      e.target.value = null;
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <label className="block font-medium mb-2">Upload dataset (CSV, XLSX, JSON)</label>

      <input
        type="file"
        accept=".csv,.xlsx,.xls,.json"
        onChange={handle}
        disabled={uploading}
        className="bg-gray-200 p-2 rounded cursor-pointer"
      />

      {uploading && (
        <div className="mt-5">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-600">Uploading… {progress}%</p>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 mt-3 overflow-hidden">
            <div
              className="h-3 bg-blue-600 transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadForm;
