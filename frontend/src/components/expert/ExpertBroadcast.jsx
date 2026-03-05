import { useState } from "react";
// import { sendNotice } from "../../services/api";
import "../../../expert-dashboard.css";

const MOCK_FARMERS = [
  { id: 1, name: "Arjun Patil",   email: "arjun@farm.in"    },
  { id: 2, name: "Sunita Desai",  email: "sunita@agri.in"   },
  { id: 3, name: "Ramesh Kumar",  email: "ramesh@fields.in" },
  { id: 4, name: "Kavita Sharma", email: "kavita@harvest.in"},
];

const ExpertBroadcast = () => {
  const [recipientType, setRecipientType] = useState("all"); // "all" | "specific"
  const [selectedFarmer, setSelectedFarmer] = useState("");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSend = async (e) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      setError("Title and message are required.");
      return;
    }
    if (recipientType === "specific" && !selectedFarmer) {
      setError("Please select a farmer.");
      return;
    }
    setSending(true);
    setError("");
    setSuccess("");

    try {
      // TODO: real API
      // await sendNotice({ recipient_id: recipientType === "specific" ? selectedFarmer : null, title, message });
      await new Promise((r) => setTimeout(r, 1000));
      setSuccess(
        recipientType === "all"
          ? "Notice sent to all farmers!"
          : `Notice sent to ${MOCK_FARMERS.find(f => f.id === parseInt(selectedFarmer))?.name}!`
      );
      setTitle("");
      setMessage("");
      setSelectedFarmer("");
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

        {success && <div className="sm-success">✅ {success}</div>}
        {error   && <div className="auth-error">⚠️ {error}</div>}

        <form className="broadcast-form" onSubmit={handleSend}>
          {/* Recipient type toggle */}
          <div className="form-group">
            <label className="form-label">Recipient</label>
            <div className="bc-recipient-toggle">
              <button
                type="button"
                className={`bc-rec-btn ${recipientType === "all" ? "bc-rec-active" : ""}`}
                onClick={() => setRecipientType("all")}
              >
                📣 All Farmers
              </button>
              <button
                type="button"
                className={`bc-rec-btn ${recipientType === "specific" ? "bc-rec-active" : ""}`}
                onClick={() => setRecipientType("specific")}
              >
                👤 Specific Farmer
              </button>
            </div>
          </div>

          {/* Farmer selector */}
          {recipientType === "specific" && (
            <div className="form-group">
              <label className="form-label">Select Farmer</label>
              <select
                className="form-input bc-select"
                value={selectedFarmer}
                onChange={(e) => setSelectedFarmer(e.target.value)}
                required
              >
                <option value="">— Choose a farmer —</option>
                {MOCK_FARMERS.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name} ({f.email})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Title */}
          <div className="form-group">
            <label className="form-label">Notice Title</label>
            <input
              className="form-input"
              placeholder="e.g. Seasonal Crop Advisory — December 2025"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Message */}
          <div className="form-group">
            <label className="form-label">Message</label>
            <textarea
              className="rd-textarea"
              placeholder="Write your notice here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={7}
              required
            />
          </div>

          <button
            type="submit"
            className="auth-submit-btn"
            style={{ alignSelf: "flex-start", padding: "11px 32px" }}
            disabled={sending}
          >
            {sending ? (
              <><span className="auth-spinner"></span> Sending...</>
            ) : (
              <>📤 Send Notice</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ExpertBroadcast;