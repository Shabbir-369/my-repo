import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/logo.png";
import "../../../expert-dashboard.css";

const navItems = [
  { id: "queue",     icon: "📥", label: "Review Queue" },
  { id: "history",   icon: "📋", label: "Submitted Reviews" },
  { id: "broadcast", icon: "📢", label: "Send Notice" },
  { id: "settings",  icon: "⚙️", label: "Settings" },
];

const ExpertSidebar = ({ activeTab, setActiveTab, sidebarOpen, setSidebarOpen }) => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  return (
    <aside className={`exp-sidebar ${sidebarOpen ? "exp-sidebar-open" : "exp-sidebar-closed"}`}>
      {/* Logo */}
      <div className="exp-sidebar-logo">
        <Link to="/" className="exp-logo-link">
          <span className="exp-logo-icon">
            <img src={logo} alt="🌱" />
          </span>
          {sidebarOpen && <span className="exp-logo-text">AgriSense</span>}
        </Link>
        <button className="exp-collapse-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? "◀" : "▶"}
        </button>
      </div>

      {/* Role Badge */}
      {sidebarOpen && (
        <div className="exp-role-badge">
          <span className="exp-role-dot"></span>
          Expert Account
        </div>
      )}

      {/* Nav */}
      <nav className="exp-nav">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`exp-nav-item ${activeTab === item.id || (activeTab === "review" && item.id === "queue") ? "exp-nav-active" : ""}`}
            onClick={() => setActiveTab(item.id)}
            title={!sidebarOpen ? item.label : ""}
          >
            <span className="exp-nav-icon">{item.icon}</span>
            {sidebarOpen && <span className="exp-nav-label">{item.label}</span>}
            {(activeTab === item.id || (activeTab === "review" && item.id === "queue")) && sidebarOpen && (
              <span className="exp-nav-active-dot"></span>
            )}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="exp-sidebar-footer">
        <button className="exp-logout-btn" onClick={handleLogout}>
          <span>🚪</span>
          {sidebarOpen && <span>Log Out</span>}
        </button>
      </div>
    </aside>
  );
};

export default ExpertSidebar;