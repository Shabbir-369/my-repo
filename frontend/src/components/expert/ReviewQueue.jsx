import { useState, useEffect } from "react";
import { getPendingQueue } from "../../services/api";

const priorityConfig = {
  urgent: { color: "#f87171", bg: "rgba(248,113,113,0.08)", border: "rgba(248,113,113,0.25)", label: "🔴 Urgent" },
  high:   { color: "#f59e0b", bg: "rgba(245,158,11,0.08)",  border: "rgba(245,158,11,0.25)",  label: "🟡 High"   },
  normal: { color: "#4ade80", bg: "rgba(74,222,128,0.08)",  border: "rgba(74,222,128,0.25)",  label: "🟢 Normal" },
};

const getPriority = (createdAt) => {
  const ageHours = (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60);
  if (ageHours > 24) return "urgent";
  if (ageHours > 6)  return "high";
  return "normal";
};

const ReviewQueue = ({ onSelectRequest }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState("all");
  const [error, setError]       = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getPendingQueue();
        setRequests(res.data);
      } catch (err) {
        setError("Could not load queue. Please refresh.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const enriched = requests.map((r) => ({ ...r, priority: getPriority(r.created_at) }));
  const filtered = enriched.filter((r) => {
    if (filter === "soil")   return r.type === "soil";
    if (filter === "seed")   return r.type === "seed";
    if (filter === "urgent") return r.priority === "urgent";
    return true;
  });

  const urgentCount = enriched.filter((r) => r.priority === "urgent").length;

  if (loading) return (
    <div className="exp-loading">
      <span className="auth-spinner" style={{ borderColor: "rgba(96,165,250,0.2)", borderTopColor: "#60a5fa" }}></span>
    </div>
  );

  if (error) return <div className="auth-error">⚠️ {error}</div>;

  return (
    <div className="queue-section">
      <div className="queue-stats-row">
        <div className="queue-stat-card">
          <span className="qsc-value">{requests.length}</span>
          <span className="qsc-label">Pending Reviews</span>
        </div>
        <div className="queue-stat-card qsc-urgent">
          <span className="qsc-value" style={{ color: "#f87171" }}>{urgentCount}</span>
          <span className="qsc-label">Urgent (&gt;24h)</span>
        </div>
        <div className="queue-stat-card">
          <span className="qsc-value">{requests.filter((r) => r.type === "soil").length}</span>
          <span className="qsc-label">Soil Analyses</span>
        </div>
        <div className="queue-stat-card">
          <span className="qsc-value">{requests.filter((r) => r.type === "seed").length}</span>
          <span className="qsc-label">Seed Analyses</span>
        </div>
      </div>

      <div className="queue-filters">
        {["all", "urgent", "soil", "seed"].map((f) => (
          <button key={f} className={`queue-filter-btn ${filter === f ? "queue-filter-active" : ""}`} onClick={() => setFilter(f)}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
        <span className="queue-count">{filtered.length} requests</span>
      </div>

      {filtered.length === 0 ? (
        <div className="queue-empty"><span>🎉</span><p>All caught up! No pending reviews in this category.</p></div>
      ) : (
        <div className="queue-list">
          {filtered.map((req) => {
            const pc = priorityConfig[req.priority];
            return (
              <div key={req.id} className="queue-item" onClick={() => onSelectRequest(req)}>
                <div className="qi-left">
                  <div className="qi-farmer-avatar">
                    {req.farmer_name?.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
                  </div>
                  <div className="qi-info">
                    <div className="qi-top-row">
                      <span className="qi-farmer-name">{req.farmer_name}</span>
                      <span className="qi-type-badge">{req.type === "soil" ? "🌱 Soil" : "🌾 Seed"}</span>
                    </div>
                    <p className="qi-preview">{req.ai_prediction?.slice(0, 90)}...</p>
                    <span className="qi-date">Submitted: {new Date(req.created_at).toLocaleString()}</span>
                  </div>
                </div>
                <div className="qi-right">
                  <span className="qi-priority-badge" style={{ color: pc.color, background: pc.bg, borderColor: pc.border }}>{pc.label}</span>
                  <button className="qi-review-btn">Review →</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ReviewQueue;