import { useState, useEffect } from "react";
import { getFarmerMessages, markMessageRead, getFarmerNotices } from "../../services/api";

const ExpertInbox = () => {
  const [tab, setTab]           = useState("messages");
  const [messages, setMessages] = useState([]);
  const [notices, setNotices]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [selected, setSelected] = useState(null);
  const [error, setError]       = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const [msgRes, noticeRes] = await Promise.all([
          getFarmerMessages(),
          getFarmerNotices(),
        ]);
        setMessages(msgRes.data);
        setNotices(noticeRes.data);
      } catch (err) {
        setError("Could not load inbox. Please refresh.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSelect = async (msg) => {
    setSelected(msg);
    if (!msg.is_read) {
      try {
        await markMessageRead(msg.id);
        setMessages((prev) =>
          prev.map((m) => (m.id === msg.id ? { ...m, is_read: true } : m))
        );
      } catch (e) {
        // non-critical, ignore
      }
    }
  };

  const unread = messages.filter((m) => !m.is_read).length;

  if (loading) {
    return (
      <div className="dash-loading">
        <span className="auth-spinner" style={{ borderColor: "rgba(74,222,128,0.2)", borderTopColor: "#4ade80" }}></span>
      </div>
    );
  }

  if (error) return <div className="auth-error">⚠️ {error}</div>;

  return (
    <div className="inbox-section">
      {/* Tabs */}
      <div className="inbox-tabs">
        <button
          className={`inbox-tab ${tab === "messages" ? "inbox-tab-active" : ""}`}
          onClick={() => setTab("messages")}
        >
          💬 Expert Advice
          {unread > 0 && <span className="inbox-unread-badge">{unread}</span>}
        </button>
        <button
          className={`inbox-tab ${tab === "notices" ? "inbox-tab-active" : ""}`}
          onClick={() => setTab("notices")}
        >
          📢 Notices
        </button>
      </div>

      {tab === "messages" && (
        <div className="inbox-layout">
          {/* Message List */}
          <div className="inbox-list">
            {messages.length === 0 ? (
              <div className="inbox-empty">
                <span>💬</span>
                <p>No expert messages yet. Upload an image to get started.</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`inbox-msg-item ${!msg.is_read ? "inbox-msg-unread" : ""} ${selected?.id === msg.id ? "inbox-msg-selected" : ""}`}
                  onClick={() => handleSelect(msg)}
                >
                  <div className="imi-top">
                    <div className="imi-avatar">
                      {msg.expert_name?.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
                    </div>
                    <div className="imi-info">
                      <span className="imi-name">{msg.expert_name}</span>
                      <span className="imi-date">{new Date(msg.created_at).toLocaleString()}</span>
                    </div>
                    {!msg.is_read && <span className="imi-dot"></span>}
                  </div>
                  <p className="imi-preview">{msg.message.slice(0, 80)}...</p>
                  <span className="imi-type-tag">
                    {msg.analysis_type === "soil" ? "🌱 Soil" : "🌾 Seed"}
                  </span>
                </div>
              ))
            )}
          </div>

          {/* Message Detail */}
          <div className="inbox-detail">
            {selected ? (
              <>
                <div className="inbox-detail-header">
                  <div className="idc-avatar">
                    {selected.expert_name?.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="idc-name">{selected.expert_name}</h3>
                    <span className="idc-date">{new Date(selected.created_at).toLocaleString()}</span>
                  </div>
                </div>

                {/* Show the image that was analysed */}
                {selected.image_url && (
                  <img
                    src={selected.image_url}
                    alt="analysed"
                    style={{ width: "100%", maxHeight: 200, objectFit: "cover", borderRadius: 12, marginBottom: 16 }}
                  />
                )}

                {/* AI prediction context */}
                {selected.ai_prediction && (
                  <div style={{
                    padding: "10px 14px",
                    background: "rgba(96,165,250,0.05)",
                    border: "1px solid rgba(96,165,250,0.15)",
                    borderRadius: 10,
                    marginBottom: 14,
                  }}>
                    <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.4px" }}>
                      🤖 AI Prediction
                    </p>
                    <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.65 }}>
                      {selected.ai_prediction}
                    </p>
                  </div>
                )}

                <div className="inbox-detail-body">
                  <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.4px" }}>
                    👨‍🌾 Expert Advice
                  </p>
                  <p className="inbox-detail-msg">{selected.message}</p>
                </div>
              </>
            ) : (
              <div className="inbox-detail-empty">
                <span>👈</span>
                <p>Select a message to read</p>
              </div>
            )}
          </div>
        </div>
      )}

      {tab === "notices" && (
        <div className="notices-list">
          {notices.length === 0 ? (
            <div className="inbox-empty">
              <span>📢</span>
              <p>No notices yet.</p>
            </div>
          ) : (
            notices.map((n) => (
              <div key={n.id} className="notice-card">
                <div className="notice-card-header">
                  <span className="notice-icon">📢</span>
                  <span className="notice-title">{n.title}</span>
                  <span className="notice-date">{new Date(n.created_at).toLocaleString()}</span>
                </div>
                {n.sender_name && (
                  <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: 8 }}>
                    From: {n.sender_name}
                  </p>
                )}
                <p className="notice-body">{n.message}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ExpertInbox;