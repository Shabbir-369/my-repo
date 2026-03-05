import { useState } from "react";
// import { submitExpertReview } from "../../services/api";
import "../../../expert-dashboard.css";

const METRIC_COLORS = {
  moisture:    "#60a5fa",
  temperature: "#f59e0b",
  ph:          "#4ade80",
  nitrogen:    "#a78bfa",
  phosphorus:  "#fb923c",
  potassium:   "#34d399",
};

const SensorPill = ({ label, value, unit, color }) => (
  <div className="rd-sensor-pill" style={{ "--pill-color": color }}>
    <span className="rdsp-label">{label}</span>
    <span className="rdsp-value" style={{ color }}>
      {value ?? "--"}<span className="rdsp-unit">{unit}</span>
    </span>
  </div>
);

const ReviewDetail = ({ request, onBack, onSubmitted }) => {
  const [advice, setAdvice] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [charCount, setCharCount] = useState(0);

  if (!request) {
    return (
      <div className="rd-no-request">
        <span>👈</span>
        <p>No request selected. Go back to the queue.</p>
        <button className="btn-secondary" onClick={onBack}>← Back to Queue</button>
      </div>
    );
  }

  const handleAdviceChange = (e) => {
    setAdvice(e.target.value);
    setCharCount(e.target.value.length);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (advice.trim().length < 20) {
      setError("Please provide at least 20 characters of feedback.");
      return;
    }
    setSubmitting(true);
    setError("");

    try {
      // TODO: real API call
      // await submitExpertReview({ analysis_id: request.id, expert_feedback: advice });
      await new Promise((r) => setTimeout(r, 1200)); // mock delay
      onSubmitted();
    } catch (err) {
      setError(err.response?.data?.message || "Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const sd = request.sensor_data;

  return (
    <div className="review-detail-section">
      {/* Back nav */}
      <button className="rd-back-btn" onClick={onBack}>
        ← Back to Queue
      </button>

      <div className="rd-grid">
        {/* LEFT: Farmer info + AI result + sensor data */}
        <div className="rd-left">
          {/* Farmer Card */}
          <div className="rd-card">
            <h4 className="rd-card-title">👨‍🌾 Farmer Details</h4>
            <div className="rd-farmer-row">
              <div className="rd-farmer-avatar">
                {request.farmer_name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="rd-farmer-name">{request.farmer_name}</p>
                <p className="rd-farmer-email">{request.farmer_email}</p>
                <p className="rd-farmer-date">Submitted: {request.created_at}</p>
              </div>
              <span className="rd-type-badge">
                {request.analysis_type === "soil" ? "🌱 Soil Analysis" : "🌾 Seed Analysis"}
              </span>
            </div>
          </div>

          {/* Image placeholder */}
          <div className="rd-card">
            <h4 className="rd-card-title">📷 Uploaded Image</h4>
            {request.image_url ? (
              <img src={request.image_url} alt="Farmer upload" className="rd-image" />
            ) : (
              <div className="rd-image-placeholder">
                <span>🖼️</span>
                <p>Image preview unavailable</p>
              </div>
            )}
          </div>

          {/* AI Prediction */}
          <div className="rd-card rd-ai-card">
            <h4 className="rd-card-title">🤖 AI Prediction</h4>
            <p className="rd-ai-text">{request.ai_prediction}</p>
            <div className="rd-ai-note">
              This is an automated prediction. Your expert review will override and supplement it.
            </div>
          </div>

          {/* Sensor Data */}
          {sd ? (
            <div className="rd-card">
              <div className="rd-card-title-row">
                <h4 className="rd-card-title">📡 Live Sensor Snapshot</h4>
                <span className="rd-sensor-time">Recorded: {sd.recorded_at}</span>
              </div>
              <div className="rd-sensor-grid">
                <SensorPill label="Moisture"    value={sd.moisture}    unit="%"      color={METRIC_COLORS.moisture}    />
                <SensorPill label="Temperature" value={sd.temperature} unit="°C"     color={METRIC_COLORS.temperature} />
                <SensorPill label="pH"          value={sd.ph}          unit=""       color={METRIC_COLORS.ph}          />
                <SensorPill label="Nitrogen"    value={sd.nitrogen}    unit=" mg/kg" color={METRIC_COLORS.nitrogen}    />
                <SensorPill label="Phosphorus"  value={sd.phosphorus}  unit=" mg/kg" color={METRIC_COLORS.phosphorus}  />
                <SensorPill label="Potassium"   value={sd.potassium}   unit=" mg/kg" color={METRIC_COLORS.potassium}   />
              </div>
            </div>
          ) : (
            <div className="rd-card rd-no-sensor">
              <h4 className="rd-card-title">📡 Sensor Data</h4>
              <p className="rd-no-sensor-text">No ESP32 sensor data linked to this submission.</p>
            </div>
          )}
        </div>

        {/* RIGHT: Submit advice */}
        <div className="rd-right">
          <div className="rd-card rd-advice-card">
            <h4 className="rd-card-title">✍️ Your Expert Advice</h4>
            <p className="rd-advice-sub">
              Write personalised recommendations for this farmer based on the image, AI prediction, and sensor readings.
            </p>

            {error && <div className="auth-error rd-error">⚠️ {error}</div>}

            <form onSubmit={handleSubmit} className="rd-form">
              <textarea
                className="rd-textarea"
                placeholder={`e.g. Based on the sensor data and uploaded image, nitrogen levels are critically low at ${sd?.nitrogen ?? "—"} mg/kg. I recommend applying 20kg/acre of urea fertilizer within the next 7 days. Also consider liming to raise pH from ${sd?.ph ?? "—"} to the optimal 6.5–7.0 range for better nutrient uptake...`}
                value={advice}
                onChange={handleAdviceChange}
                rows={10}
                required
              />
              <div className="rd-char-count">
                <span style={{ color: charCount < 20 ? "#f87171" : "#4a6b4a" }}>
                  {charCount} characters
                </span>
                <span style={{ color: "#4a6b4a" }}>(min. 20)</span>
              </div>

              {/* Quick insert templates */}
              <div className="rd-templates">
                <p className="rd-templates-label">Quick templates:</p>
                <div className="rd-template-btns">
                  {[
                    "Nitrogen deficiency — apply urea 20kg/acre.",
                    "Reduce irrigation — moisture too high.",
                    "Seeds healthy — proceed with planting.",
                    "Add agricultural lime to raise pH.",
                  ].map((t) => (
                    <button
                      key={t}
                      type="button"
                      className="rd-template-btn"
                      onClick={() => {
                        const newVal = advice ? advice + " " + t : t;
                        setAdvice(newVal);
                        setCharCount(newVal.length);
                      }}
                    >
                      + {t}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="auth-submit-btn rd-submit-btn"
                disabled={submitting || advice.trim().length < 20}
              >
                {submitting ? (
                  <><span className="auth-spinner"></span> Sending Advice...</>
                ) : (
                  <>✉️ Send Advice to Farmer</>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewDetail;