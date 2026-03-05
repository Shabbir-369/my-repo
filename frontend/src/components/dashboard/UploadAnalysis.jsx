import { useState, useRef } from "react";
import { uploadAnalysis } from "../../services/api";

const UploadAnalysis = () => {
  const [type, setType]         = useState("soil");
  const [file, setFile]         = useState(null);
  const [preview, setPreview]   = useState(null);
  const [loading, setLoading]   = useState(false);
  const [result, setResult]     = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError]       = useState("");
  const fileInputRef            = useRef();

  const handleFile = (f) => {
    if (!f || !f.type.startsWith("image/")) {
      setError("Please select a valid image file (JPG, PNG, etc.)");
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      setError("Image must be under 10MB.");
      return;
    }
    setError("");
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setResult(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = async () => {
    if (!file) return;
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("type", type);

      const res = await uploadAnalysis(formData);
      setResult(res.data.analysis);
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError("");
  };

  return (
    <div className="upload-section">
      {!result ? (
        <>
          {/* Type Toggle */}
          <div className="upload-type-toggle">
            {["soil", "seed"].map((t) => (
              <button
                key={t}
                className={`upload-type-btn ${type === t ? "upload-type-active" : ""}`}
                onClick={() => setType(t)}
              >
                {t === "soil" ? "🌱 Soil Analysis" : "🌾 Seed Analysis"}
              </button>
            ))}
          </div>

          {error && <div className="auth-error" style={{ marginBottom: 12 }}>⚠️ {error}</div>}

          {/* Drop Zone */}
          <div
            className={`upload-dropzone ${dragOver ? "dropzone-over" : ""} ${preview ? "dropzone-has-file" : ""}`}
            onClick={() => !preview && fileInputRef.current.click()}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            {preview ? (
              <div className="dropzone-preview">
                <img src={preview} alt="preview" className="preview-img" />
                <button
                  className="preview-remove-btn"
                  onClick={(e) => { e.stopPropagation(); reset(); }}
                >
                  ✕ Remove
                </button>
              </div>
            ) : (
              <div className="dropzone-placeholder">
                <span className="dropzone-icon">📷</span>
                <p className="dropzone-title">Drop your image here</p>
                <p className="dropzone-sub">or click to browse — JPG, PNG up to 10MB</p>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => handleFile(e.target.files[0])}
          />

          <button
            className="auth-submit-btn upload-submit-btn"
            disabled={!file || loading}
            onClick={handleSubmit}
          >
            {loading ? (
              <><span className="auth-spinner"></span> Uploading & Analysing...</>
            ) : (
              <>🔬 Run AI Analysis <span className="btn-arrow">→</span></>
            )}
          </button>
        </>
      ) : (
        /* Result Card */
        <div className="analysis-result-card">
          <div className="arc-header">
            <span className="arc-badge">🤖 AI Result</span>
            <span className="arc-time">{new Date(result.created_at).toLocaleString()}</span>
          </div>
          <div className="arc-body">
            <img src={result.image_url} alt="analysed" className="arc-thumb" />
            <div className="arc-info">
              <div className="arc-type-tag">
                {result.type === "soil" ? "🌱 Soil" : "🌾 Seed"} Analysis
              </div>
              <p className="arc-prediction">{result.ai_prediction}</p>
              <div className="arc-status">
                <span className="arc-status-dot"></span>
                Pending Expert Review
              </div>
            </div>
          </div>
          <div className="arc-footer">
            <p className="arc-expert-note">
              ✉️ An agricultural expert will review this and send you personalised advice in your inbox within 24 hours.
            </p>
            <button className="btn-secondary arc-new-btn" onClick={reset}>
              Upload Another Image
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadAnalysis;