import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardSidebar from "../components/dashboard/DashboardSidebar";
import DashboardHeader  from "../components/dashboard/DashboardHeader";
import SensorFeed       from "../components/dashboard/SensorFeed";
import UploadAnalysis   from "../components/dashboard/UploadAnalysis";
import AnalysisHistory  from "../components/dashboard/AnalysisHistory";
import ExpertInbox      from "../components/dashboard/ExpertInbox";
import SensorManager    from "../components/dashboard/SensorManager";
import DashboardSettings from "../components/dashboard/DashboardSettings";
import "../dashboard.css";

const FarmerDashboard = () => {
  const navigate   = useNavigate();
  const [activeTab, setActiveTab] = useState("sensor");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Auth guard — replace with your real AuthContext check
  const token = localStorage.getItem("token");
  useEffect(() => {
    if (!token) navigate("/login");
  }, [token, navigate]);

  const renderContent = () => {
    switch (activeTab) {
      case "sensor":   return <SensorFeed />;
      case "upload":   return <UploadAnalysis />;
      case "history":  return <AnalysisHistory />;
      case "inbox":    return <ExpertInbox />;
      case "sensors":  return <SensorManager />;
      case "settings": return <DashboardSettings />;
      default:         return <SensorFeed />;
    }
  };

  return (
    <div className={`dash-layout ${sidebarOpen ? "" : "dash-sidebar-collapsed"}`}>
      <DashboardSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <div className="dash-main">
        <DashboardHeader
          activeTab={activeTab}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        <div className="dash-content">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;