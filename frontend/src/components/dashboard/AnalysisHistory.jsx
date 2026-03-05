import { useState, useEffect } from "react";
import { getMyAnalyses } from "../../services/api";

const AnalysisHistory = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState("all");
  const [expanded, setExpanded] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getMyAnalyses();
        setRecords(res.data);
      } catch (err) {
        setError("Could not load analysis history. Please refresh.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = records.filter((r) => {
    if (filter === "verified") return r.expert_verified;
    if (filter === "pending")  return !r.expert_verified;
    if (filter === "soil")     return r.type === "soil";
    if (filter === "seed")     return r.type === "seed";
    return true;
  });

  if (loading) {
    return (
      <div className="dash-loading">
        <span className="auth-spinner" style={{ borderColor: "rgba(74,222,128,0.2)", borderTopColor: "#4ade80" }}></span>
      </div>
    );
  }

  if (error) {
    return <div className="auth-error">⚠️ {error}</div>;
  }

  return (
    <div className="history-section">
      {/* Filters */}
      <div className="history-filters">
        {["all", "soil", "seed", "verified", "pending"].map((f) => (
          <button
            key={f}
            className={`history-filter-btn ${filter === f ? "history-filter-active" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
        <span className="history-count">{filtered.length} records</span>
      </div>

      {filtered.length === 0 ? (
        <div className="history-empty">
          <span>📋</span>
          <p>
            {records.length === 0
              ? "No analyses yet. Upload an image to get started."
              : "No analyses found for this filter."}
          </p>
        </div>
      ) : (
        <div className="history-list">
          {filtered.map((rec) => (
            <div
              key={rec.id}
              className={`history-item ${expanded === rec.id ? "history-item-open" : ""}`}
            >
              <div
                className="history-item-header"
                onClick={() => setExpanded(expanded === rec.id ? null : rec.id)}
              >
                <div className="history-item-left">
                  {/* Thumbnail */}
                  {rec.image_url && (
                    <img
                      src={rec.image_url}
                      alt="analysis"
                      style={{ width: 44, height: 44, borderRadius: 8, objectFit: "cover", flexShrink: 0 }}
                    />
                  )}
                  <div className="history-item-type-badge">
                    {rec.type === "soil" ? "🌱 Soil" : "🌾 Seed"}
                  </div>
                  <div>
                    <p className="history-item-preview">
                      {rec.ai_prediction?.slice(0, 70)}...
                    </p>
                    <span className="history-item-date">
                      {new Date(rec.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="history-item-right">
                  <span className={`history-status-badge ${rec.expert_verified ? "status-verified" : "status-pending"}`}>
                    {rec.expert_verified ? "✓ Expert Verified" : "⏳ Pending Review"}
                  </span>
                  <span className="history-chevron">{expanded === rec.id ? "−" : "+"}</span>
                </div>
              </div>

              {expanded === rec.id && (
                <div className="history-item-body">
                  <div className="history-detail-row">
                    <div className="history-detail-block">
                      <span className="hdb-label">🤖 AI Prediction</span>
                      <p className="hdb-text">{rec.ai_prediction}</p>
                    </div>
                    {rec.expert_feedback ? (
                      <div className="history-detail-block history-expert-block">
                        <span className="hdb-label">
                          👨‍🌾 Expert Feedback
                          {rec.expert_name && (
                            <span style={{ fontWeight: 400, color: "#4a6b4a", marginLeft: 6 }}>
                              — {rec.expert_name}
                            </span>
                          )}
                        </span>
                        <p className="hdb-text">{rec.expert_feedback}</p>
                        {rec.reviewed_at && (
                          <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: 8 }}>
                            Reviewed: {new Date(rec.reviewed_at).toLocaleString()}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="history-detail-block">
                        <span className="hdb-label">👨‍🌾 Expert Feedback</span>
                        <p className="hdb-text" style={{ color: "var(--text-muted)", fontStyle: "italic" }}>
                          Awaiting expert review. You'll receive a notification in your inbox once reviewed.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AnalysisHistory;