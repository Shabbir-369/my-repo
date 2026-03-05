import { useState, useEffect } from "react";
import { sendNotice, getFarmersList } from "../../services/api";

const ExpertBroadcast = () => {
  const [farmers, setFarmers]         = useState([]);
  const [recipientType, setRecipientType] = useState("all");
  const [selectedFarmer, setSelectedFarmer] = useState("");
  const [title, setTitle]             = useState("");
  const [message, setMessage]         = useState("");
  const [sending, setSending]         = useState(false);
  const [success, setSuccess]         = useState("");
  const [error, setError]             = useState("");

  useEffect(() => {
    getFarmersList()
      .then((res) => setFarmers(res.data))
      .catch(() => {}); // non-critical
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) { setError("Title and message are required."); return; }
    if (recipientType === "specific" && !selectedFarmer) { setError("Please select a farmer."); return; }

    setSending(true); setError(""); setSuccess("");
    try {
      await sendNotice({
        title,
        message,
        recipient_id: recipientType === "specific" ? selectedFarmer : undefined,
      });
      const recipientName = recipientType === "all"
        ? "all farmers"
        : farmers.find((f) => f.id === selectedFarmer)?.full_name || "the farmer";
      setSuccess(`Notice sent to ${recipientName}!`);
      setTitle(""); setMessage(""); setSelectedFarmer("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send notice.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="broadcast-section">
      <div className="broadcast-card">
        <div className="broadcast-card-header">
          <h3 className="bc-title">📢 Compose Notice</h3>
          <p className="bc-sub">Send advice, alerts, or general announcements to farmers on the platform.</p>
        </div>

        {success && <div className="sm-success" style={{ marginBottom: 16 }}>✅ {success}</div>}
        {error   && <div className="auth-error" style={{ marginBottom: 16 }}>⚠️ {error}</div>}

        <form className="broadcast-form" onSubmit={handleSend}>
          <div className="form-group">
            <label className="form-label">Recipient</label>
            <div className="bc-recipient-toggle">
              <button type="button" className={`bc-rec-btn ${recipientType === "all" ? "bc-rec-active" : ""}`} onClick={() => setRecipientType("all")}>
                📣 All Farmers
              </button>
              <button type="button" className={`bc-rec-btn ${recipientType === "specific" ? "bc-rec-active" : ""}`} onClick={() => setRecipientType("specific")}>
                👤 Specific Farmer
              </button>
            </div>
          </div>

          {recipientType === "specific" && (
            <div className="form-group">
              <label className="form-label">Select Farmer</label>
              <select className="form-input bc-select" value={selectedFarmer} onChange={(e) => setSelectedFarmer(e.target.value)} required>
                <option value="">— Choose a farmer —</option>
                {farmers.map((f) => (
                  <option key={f.id} value={f.id}>{f.full_name} ({f.email})</option>
                ))}
              </select>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Notice Title</label>
            <input className="form-input" placeholder="e.g. Seasonal Crop Advisory — December 2025" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>

          <div className="form-group">
            <label className="form-label">Message</label>
            <textarea className="rd-textarea" placeholder="Write your notice here..." value={message} onChange={(e) => setMessage(e.target.value)} rows={7} required />
          </div>

          <button type="submit" className="auth-submit-btn" style={{ alignSelf: "flex-start", padding: "11px 32px" }} disabled={sending}>
            {sending ? <><span className="auth-spinner"></span> Sending...</> : <>📤 Send Notice</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ExpertBroadcast;