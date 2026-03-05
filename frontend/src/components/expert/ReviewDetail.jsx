import { useState, useEffect } from "react";
import { getAnalysisDetail, submitFeedback } from "../../services/api";

const METRIC_COLORS = {
  moisture: "#60a5fa", temperature: "#f59e0b", ph: "#4ade80",
  nitrogen: "#a78bfa", phosphorus: "#fb923c", potassium: "#34d399",
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
  const [detail, setDetail]     = useState(null);
  const [loading, setLoading]   = useState(true);
  const [advice, setAdvice]     = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]       = useState("");
  const [fetchError, setFetchError] = useState("");

  useEffect(() => {
    if (!request?.id) return;
    const load = async () => {
      try {
        setLoading(true);
        const res = await getAnalysisDetail(request.id);
        setDetail(res.data);
      } catch (err) {
        setFetchError("Could not load analysis details.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [request?.id]);

  if (!request) return (
    <div className="rd-no-request">
      <span>👈</span><p>No request selected.</p>
      <button className="btn-secondary" onClick={onBack}>← Back to Queue</button>
    </div>
  );

  if (loading) return (
    <div className="exp-loading">
      <span className="auth-spinner" style={{ borderColor: "rgba(96,165,250,0.2)", borderTopColor: "#60a5fa" }}></span>
    </div>
  );

  if (fetchError) return <div className="auth-error">⚠️ {fetchError}</div>;

  const sd = detail?.sensor_data;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (advice.trim().length < 10) {
      setError("Please provide at least 10 characters of feedback."); return;
    }
    setSubmitting(true); setError("");
    try {
      await submitFeedback(request.id, advice);
      onSubmitted();
    } catch (err) {
      setError(err.response?.data?.message || "Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const appendTemplate = (t) => setAdvice((a) => a ? a + " " + t : t);

  return (
    <div className="review-detail-section">
      <button className="rd-back-btn" onClick={onBack}>← Back to Queue</button>

      <div className="rd-grid">
        {/* LEFT */}
        <div className="rd-left">
          {/* Farmer card */}
          <div className="rd-card">
            <h4 className="rd-card-title">👨‍🌾 Farmer Details</h4>
            <div className="rd-farmer-row">
              <div className="rd-farmer-avatar">
                {detail?.farmer_name?.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="rd-farmer-name">{detail?.farmer_name}</p>
                <p className="rd-farmer-email">{detail?.farmer_email}</p>
                <p className="rd-farmer-date">Submitted: {new Date(detail?.created_at).toLocaleString()}</p>
              </div>
              <span className="rd-type-badge">
                {detail?.type === "soil" ? "🌱 Soil Analysis" : "🌾 Seed Analysis"}
              </span>
            </div>
          </div>

          {/* Image */}
          <div className="rd-card">
            <h4 className="rd-card-title">📷 Uploaded Image</h4>
            {detail?.image_url ? (
              <img src={detail.image_url} alt="Farmer upload" className="rd-image" />
            ) : (
              <div className="rd-image-placeholder"><span>🖼️</span><p>Image not available</p></div>
            )}
          </div>

          {/* AI Prediction */}
          <div className="rd-card rd-ai-card">
            <h4 className="rd-card-title">🤖 AI Prediction</h4>
            <p className="rd-ai-text">{detail?.ai_prediction}</p>
            <div className="rd-ai-note">This is an automated prediction. Your expert review will supplement it.</div>
          </div>

          {/* Sensor Data */}
          {sd ? (
            <div className="rd-card">
              <div className="rd-card-title-row">
                <h4 className="rd-card-title">📡 Sensor Snapshot</h4>
                <span className="rd-sensor-time">Recorded: {new Date(sd.recorded_at).toLocaleString()}</span>
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

        {/* RIGHT — advice form */}
        <div className="rd-right">
          <div className="rd-card rd-advice-card">
            <h4 className="rd-card-title">✍️ Your Expert Advice</h4>
            <p className="rd-advice-sub">Write personalised recommendations based on the image, AI prediction, and sensor readings.</p>

            {error && <div className="auth-error rd-error">⚠️ {error}</div>}

            <form onSubmit={handleSubmit} className="rd-form">
              <textarea
                className="rd-textarea"
                placeholder="e.g. Based on the sensor data and image, nitrogen levels appear low. I recommend applying 20kg/acre of urea within the next 7 days..."
                value={advice}
                onChange={(e) => setAdvice(e.target.value)}
                rows={10}
                required
              />
              <div className="rd-char-count">
                <span style={{ color: advice.length < 10 ? "#f87171" : "#4a6b4a" }}>{advice.length} characters</span>
                <span style={{ color: "#4a6b4a" }}>(min. 10)</span>
              </div>

              <div className="rd-templates">
                <p className="rd-templates-label">Quick templates:</p>
                <div className="rd-template-btns">
                  {[
                    "Nitrogen deficiency — apply urea 20kg/acre.",
                    "Reduce irrigation — moisture is too high.",
                    "Seeds appear healthy — proceed with planting.",
                    "Add agricultural lime to raise pH to 6.5.",
                    "Potassium low — apply muriate of potash.",
                  ].map((t) => (
                    <button key={t} type="button" className="rd-template-btn" onClick={() => appendTemplate(t)}>
                      + {t}
                    </button>
                  ))}
                </div>
              </div>

              <button type="submit" className="auth-submit-btn rd-submit-btn" disabled={submitting || advice.trim().length < 10}>
                {submitting ? <><span className="auth-spinner"></span> Sending...</> : <>✉️ Send Advice to Farmer</>}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewDetail;