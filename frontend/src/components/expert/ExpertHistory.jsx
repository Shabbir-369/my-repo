import { useState, useEffect } from "react";

const MOCK_SUBMITTED = [
  {
    id: 10,
    farmer_name: "Priya Nair",
    analysis_type: "soil",
    ai_prediction: "Nitrogen deficiency detected. Soil pH slightly low at 5.8.",
    expert_feedback: "Nitrogen levels are low at 14 mg/kg. Apply 20kg/acre of urea. Consider liming the field to raise pH from 5.8 to 6.5. Reduce irrigation by 20% for the next week.",
    reviewed_at: "2025-12-07 10:30",
  },
  {
    id: 11,
    farmer_name: "Rajan Iyer",
    analysis_type: "seed",
    ai_prediction: "Seeds appear healthy with good germination potential.",
    expert_feedback: "Seeds look healthy. Good germination rate expected. Store below 18°C with humidity under 60%. Pre-soak for 8 hours before planting.",
    reviewed_at: "2025-12-01 14:15",
  },
  {
    id: 12,
    farmer_name: "Meena Reddy",
    analysis_type: "soil",
    ai_prediction: "High moisture content. Risk of root rot if not addressed.",
    expert_feedback: "Moisture at 91% is critically high. Stop irrigation immediately and improve drainage. Potassium is also low at 11 mg/kg — apply 15kg/acre of muriate of potash.",
    reviewed_at: "2025-11-28 09:00",
  },
];

const ExpertHistory = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    // TODO: fetch from /api/expert/history
    setTimeout(() => { setRecords(MOCK_SUBMITTED); setLoading(false); }, 500);
  }, []);

  const filtered = records.filter((r) => {
    if (filter === "soil") return r.analysis_type === "soil";
    if (filter === "seed") return r.analysis_type === "seed";
    return true;
  });

  if (loading) {
    return (
      <div className="exp-loading">
        <span className="auth-spinner" style={{ borderColor: "rgba(96,165,250,0.2)", borderTopColor: "#60a5fa" }}></span>
      </div>
    );
  }

  return (
    <div className="exp-history-section">
      <div className="exp-history-filters">
        {["all", "soil", "seed"].map((f) => (
          <button
            key={f}
            className={`queue-filter-btn ${filter === f ? "queue-filter-active" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
        <span className="queue-count">{filtered.length} reviews</span>
      </div>

      {filtered.length === 0 ? (
        <div className="queue-empty">
          <span>📋</span>
          <p>No submitted reviews found.</p>
        </div>
      ) : (
        <div className="exp-history-list">
          {filtered.map((rec) => (
            <div
              key={rec.id}
              className={`exp-history-item ${expanded === rec.id ? "exp-history-item-open" : ""}`}
            >
              <div
                className="exp-history-header"
                onClick={() => setExpanded(expanded === rec.id ? null : rec.id)}
              >
                <div className="ehi-left">
                  <div className="ehi-avatar">
                    {rec.farmer_name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="ehi-name-row">
                      <span className="ehi-farmer">{rec.farmer_name}</span>
                      <span className="ehi-type">
                        {rec.analysis_type === "soil" ? "🌱 Soil" : "🌾 Seed"}
                      </span>
                    </div>
                    <p className="ehi-preview">{rec.expert_feedback.slice(0, 80)}...</p>
                    <span className="ehi-date">Reviewed: {rec.reviewed_at}</span>
                  </div>
                </div>
                <div className="ehi-right">
                  <span className="ehi-done-badge">✓ Submitted</span>
                  <span className="ehi-chevron">{expanded === rec.id ? "−" : "+"}</span>
                </div>
              </div>

              {expanded === rec.id && (
                <div className="exp-history-body">
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