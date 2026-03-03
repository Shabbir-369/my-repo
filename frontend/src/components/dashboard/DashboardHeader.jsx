const tabTitles = {
  sensor:   { title: "Live Sensor Feed",    sub: "Real-time readings from your ESP32 sensor" },
  upload:   { title: "Upload & Analyse",    sub: "Upload a soil or seed image for AI analysis" },
  history:  { title: "Analysis History",    sub: "All your past analyses and expert reviews" },
  inbox:    { title: "Expert Inbox",        sub: "Advice and messages from your agronomist" },
  sensors:  { title: "Manage Sensors",      sub: "Register and configure your ESP32 devices" },
  settings: { title: "Account Settings",   sub: "Update your profile and preferences" },
};

const DashboardHeader = ({ activeTab, sidebarOpen, setSidebarOpen }) => {
  const info = tabTitles[activeTab] || tabTitles.sensor;
  // Replace with real user data from AuthContext / API
  const user = { name: "Arjun Mehta", initials: "AM" };

  return (
    <header className="dash-header">
      {/* Mobile menu toggle */}
      <button className="dash-header-menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
        ☰
      </button>

      <div className="dash-header-title-block">
        <h1 className="dash-header-title">{info.title}</h1>
        <p className="dash-header-sub">{info.sub}</p>
      </div>

      <div className="dash-header-right">
        {/* Notification bell */}
        <button className="dash-notif-btn" title="Notifications">
          <span>🔔</span>
          <span className="notif-badge">2</span>
        </button>
        {/* User avatar */}
        <div className="dash-user-chip">
          <div className="dash-user-avatar">{user.initials}</div>
          <span className="dash-user-name">{user.name}</span>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;