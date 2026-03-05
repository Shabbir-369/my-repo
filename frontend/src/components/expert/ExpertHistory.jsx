import { useState, useEffect } from "react";
import { getExpertHistory } from "../../services/api";

const ExpertHistory = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getExpertHistory();
        setRecords(res.data);
      } catch (err) {
        setError("Could not load review history.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = records.filter((r) => {
    if (filter === "soil") return r.type === "soil";
    if (filter === "seed") return r.type === "seed";
    return true;
  });

  if (loading) return (
    <div className="exp-loading">
      <span className="auth-spinner" style={{ borderColor: "rgba(96,165,250,0.2)", borderTopColor: "#60a5fa" }}></span>
    </div>
  );

  if (error) return <div className="auth-error">⚠️ {error}</div>;

  return (
    <div className="exp-history-section">
      <div className="exp-history-filters">
        {["all", "soil", "seed"].map((f) => (
          <button key={f} className={`queue-filter-btn ${filter === f ? "queue-filter-active" : ""}`} onClick={() => setFilter(f)}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
        <span className="queue-count">{filtered.length} reviews submitted</span>
      </div>

      {filtered.length === 0 ? (
        <div className="queue-empty"><span>📋</span><p>No submitted reviews yet.</p></div>
      ) : (
        <div className="exp-history-list">
          {filtered.map((rec) => (
            <div key={rec.id} className={`exp-history-item ${expanded === rec.id ? "exp-history-item-open" : ""}`}>
              <div className="exp-history-header" onClick={() => setExpanded(expanded === rec.id ? null : rec.id)}>
                <div className="ehi-left">
                  <div className="ehi-avatar">
                    {rec.farmer_name?.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="ehi-name-row">
                      <span className="ehi-farmer">{rec.farmer_name}</span>
                      <span className="ehi-type">{rec.type === "soil" ? "🌱 Soil" : "🌾 Seed"}</span>
                    </div>
                    <p className="ehi-preview">{rec.expert_feedback?.slice(0, 80)}...</p>
                    <span className="ehi-date">Reviewed: {new Date(rec.reviewed_at).toLocaleString()}</span>
                  </div>
                </div>
                <div className="ehi-right">
                  <span className="ehi-done-badge">✓ Submitted</span>
                  <span className="ehi-chevron">{expanded === rec.id ? "−" : "+"}</span>
                </div>
              </div>

              {expanded === rec.id && (
                <div className="exp-history-body">
                  {rec.image_url && (
                    <img src={rec.image_url} alt="analysed" style={{ width: "100%", maxHeight: 180, objectFit: "cover", borderRadius: 10, marginBottom: 14 }} />
                  )}
                  <div className="ehb-grid">
                    <div className="ehb-block">
                      <span className="ehb-label">🤖 AI Prediction</span>
                      <p className="ehb-text">{rec.ai_prediction}</p>
                    </div>
                    <div className="ehb-block ehb-expert">
                      <span className="ehb-label">✍️ Your Advice</span>
                      <p className="ehb-text">{rec.expert_feedback}</p>
                    </div>
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

export default ExpertHistory;