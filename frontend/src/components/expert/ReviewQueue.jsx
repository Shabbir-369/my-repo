import { useState, useEffect } from "react";
// import { fetchPendingReviews } from "../../services/api";
import "../../../expert-dashboard.css";

// Mock data — replace with GET /api/expert/queue
const MOCK_QUEUE = [
  {
    id: 1,
    farmer_name: "Arjun Patil",
    farmer_email: "arjun@farm.in",
    analysis_type: "soil",
    image_url: null,
    ai_prediction: "Nitrogen deficiency detected. Soil pH slightly low at 5.8. Moisture levels appear adequate but could benefit from light irrigation.",
    sensor_data: {
      moisture: 62,
      temperature: 28.4,
      ph: 5.8,
      nitrogen: 14,
      phosphorus: 38,
      potassium: 91,
      recorded_at: "2025-12-10 08:22",
    },
    created_at: "2025-12-10 08:25",
    priority: "high",
  },
  {
    id: 2,
    farmer_name: "Sunita Desai",
    farmer_email: "sunita@agri.in",
    analysis_type: "seed",
    image_url: null,
    ai_prediction: "Seeds appear healthy with good germination potential. No visible signs of fungal infection.",
    sensor_data: null,
    created_at: "2025-12-09 14:10",
    priority: "normal",
  },
  {
    id: 3,
    farmer_name: "Ramesh Kumar",
    farmer_email: "ramesh@fields.in",
    analysis_type: "soil",
    image_url: null,
    ai_prediction: "High moisture content detected. Risk of root rot if waterlogging persists. Potassium levels are critically low.",
    sensor_data: {
      moisture: 91,
      temperature: 26.1,
      ph: 6.2,
      nitrogen: 22,
      phosphorus: 45,
      potassium: 11,
      recorded_at: "2025-12-08 07:50",
    },
    created_at: "2025-12-08 07:55",
    priority: "urgent",
  },
  {
    id: 4,
    farmer_name: "Kavita Sharma",
    farmer_email: "kavita@harvest.in",
    analysis_type: "seed",
    image_url: null,
    ai_prediction: "Possible fungal coating on seed surface. Germination rate may be reduced. Recommend laboratory verification.",
    sensor_data: null,
    created_at: "2025-12-07 16:40",
    priority: "high",
  },
];

const priorityConfig = {
  urgent: { color: "#f87171", bg: "rgba(248,113,113,0.08)", border: "rgba(248,113,113,0.25)", label: "🔴 Urgent" },
  high:   { color: "#f59e0b", bg: "rgba(245,158,11,0.08)",  border: "rgba(245,158,11,0.25)",  label: "🟡 High"   },
  normal: { color: "#4ade80", bg: "rgba(74,222,128,0.08)",  border: "rgba(74,222,128,0.25)",  label: "🟢 Normal" },
};

const ReviewQueue = ({ onSelectRequest }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    // TODO: replace with real API
    // fetchPendingReviews().then(res => { setRequests(res.data); setLoading(false); });
    setTimeout(() => { setRequests(MOCK_QUEUE); setLoading(false); }, 500);
  }, []);

  const filtered = requests.filter((r) => {
    if (filter === "soil") return r.analysis_type === "soil";
    if (filter === "seed") return r.analysis_type === "seed";
    if (filter === "urgent") return r.priority === "urgent";
    return true;
  });

  const urgentCount = requests.filter((r) => r.priority === "urgent").length;

  if (loading) {
    return (
      <div className="exp-loading">
        <span className="auth-spinner" style={{ borderColor: "rgba(96,165,250,0.2)", borderTopColor: "#60a5fa" }}></span>
      </div>
    );
  }

  return (
    <div className="queue-section">
      {/* Stats row */}
      <div className="queue-stats-row">
        <div className="queue-stat-card">
          <span className="qsc-value">{requests.length}</span>
          <span className="qsc-label">Pending Reviews</span>
        </div>
        <div className="queue-stat-card qsc-urgent">
          <span className="qsc-value" style={{ color: "#f87171" }}>{urgentCount}</span>
          <span className="qsc-label">Urgent</span>
        </div>
        <div className="queue-stat-card">
          <span className="qsc-value">{requests.filter(r => r.analysis_type === "soil").length}</span>
          <span className="qsc-label">Soil Analyses</span>
        </div>
        <div className="queue-stat-card">
          <span className="qsc-value">{requests.filter(r => r.analysis_type === "seed").length}</span>
          <span className="qsc-label">Seed Analyses</span>
        </div>
      </div>

      {/* Filters */}
      <div className="queue-filters">
        {["all", "urgent", "soil", "seed"].map((f) => (
          <button
            key={f}
            className={`queue-filter-btn ${filter === f ? "queue-filter-active" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
        <span className="queue-count">{filtered.length} requests</span>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="queue-empty">
          <span>🎉</span>
          <p>All caught up! No pending reviews in this category.</p>
        </div>
      ) : (
        <div className="queue-list">
          {filtered.map((req) => {
            const pc = priorityConfig[req.priority];
            return (
              <div key={req.id} className="queue-item" onClick={() => onSelectRequest(req)}>
                <div className="qi-left">
                  <div className="qi-farmer-avatar">
                    {req.farmer_name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
                  </div>
                  <div className="qi-info">
                    <div className="qi-top-row">
                      <span className="qi-farmer-name">{req.farmer_name}</span>
                      <span className="qi-type-badge">
                        {req.analysis_type === "soil" ? "🌱 Soil" : "🌾 Seed"}
                      </span>
                      {req.sensor_data && (
                        <span className="qi-sensor-tag">📡 Has Sensor Data</span>
                      )}
                    </div>
                    <p className="qi-preview">{req.ai_prediction.slice(0, 90)}...</p>
                    <span className="qi-date">Submitted: {req.created_at}</span>
                  </div>
                </div>
                <div className="qi-right">
                  <span
                    className="qi-priority-badge"
                    style={{ color: pc.color, background: pc.bg, borderColor: pc.border }}
                  >
                    {pc.label}
                  </span>
                  <button className="qi-review-btn">
                    Review →
                  </button>
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