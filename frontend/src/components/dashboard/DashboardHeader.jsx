const tabTitles = {
  sensor:   { title: "Live Sensor Feed",    sub: "Real-time readings from your ESP32 sensor" },
  upload:   { title: "Upload & Analyse",    sub: "Upload a soil or seed image for AI analysis" },
  history:  { title: "Analysis History",    sub: "All your past analyses and expert reviews" },
  inbox:    { title: "Expert Inbox",        sub: "Advice and messages from your agronomist" },
  sensors:  { title: "Manage Sensors",      sub: "Register and configure your ESP32 devices" },
  settings: { title: "Account Settings",   sub: "Update your profile and preferences" },
};

import { useAuth } from "../../context/AuthContext";
const DashboardHeader = ({ activeTab, sidebarOpen, setSidebarOpen }) => {
  const { user } = useAuth();   // <-- get user from context
  const info = tabTitles[activeTab] || tabTitles.sensor;

  // Fallback if user is not loaded yet
  const displayName = user?.full_name || "Farmer";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="dash-header">
      {/* ... rest of the component ... */}
      <div className="dash-user-chip">
        <div className="dash-user-avatar">{initials}</div>
        <span className="dash-user-name">{displayName}</span>
      </div>
    </header>
  );
};

export default DashboardHeader;