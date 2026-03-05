import { useAuth } from "../../context/AuthContext";
import "../../../expert-dashboard.css";

const tabTitles = {
  queue:     { title: "Review Queue",        sub: "Pending farmer analysis requests awaiting your expert feedback" },
  review:    { title: "Review Request",      sub: "Examine the uploaded image, sensor data, and AI prediction" },
  history:   { title: "Submitted Reviews",   sub: "All analyses you have reviewed and sent back to farmers" },
  broadcast: { title: "Send Notice",         sub: "Broadcast an announcement to a specific farmer or all users" },
  settings:  { title: "Account Settings",    sub: "Update your profile and preferences" },
};

const ExpertHeader = ({ activeTab, sidebarOpen, setSidebarOpen }) => {
  const { user } = useAuth();
  const info = tabTitles[activeTab] || tabTitles.queue;

  const displayName = user?.full_name || "Expert";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="exp-header">
      <button
        className="exp-header-menu-btn"
        onClick={() => setSidebarOpen((p) => !p)}
        aria-label="Toggle sidebar"
      >
        {sidebarOpen ? "✕" : "☰"}
      </button>

      <div className="exp-header-title-block">
        <div className="exp-header-title">{info.title}</div>
        <div className="exp-header-sub">{info.sub}</div>
      </div>

      <div className="exp-header-right">
        {/* Expert badge */}
        <div className="exp-expert-badge">
          <span className="exp-expert-dot"></span>
          Expert
        </div>
        <div className="exp-user-chip">
          <div className="exp-user-avatar">{initials}</div>
          <span className="exp-user-name">{displayName}</span>
        </div>
      </div>
    </header>
  );
};

export default ExpertHeader;