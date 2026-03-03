import { useState, useEffect, useCallback } from "react";
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, RadialBarChart, RadialBar
} from "recharts";

const METRIC_COLORS = {
  moisture:    "#60a5fa",
  temperature: "#f59e0b",
  ph:          "#4ade80",
  nitrogen:    "#a78bfa",
  phosphorus:  "#fb923c",
  potassium:   "#34d399",
};

const StatCard = ({ icon, label, value, unit, color, status }) => (
  <div className="sensor-stat-card" style={{ "--sc-color": color }}>
    <div className="ssc-top">
      <span className="ssc-icon">{icon}</span>
      <span className={`ssc-status ssc-status-${status}`}>{status}</span>
    </div>
    <div className="ssc-value">
      {value !== undefined ? value : "--"}<span className="ssc-unit">{unit}</span>
    </div>
    <div className="ssc-label">{label}</div>
    <div className="ssc-bar-wrap">
      <div className="ssc-bar" style={{ width: `${Math.min(100, ((value || 0) / (label === "pH" ? 14 : label === "Temp" ? 50 : 100)) * 100)}%`, background: color }}></div>
    </div>
  </div>
);

const SensorFeed = () => {
  const [sensorData, setSensorData] = useState([]);      // array of { sensor: mac, graph_data: [...] }
  const [loading, setLoading] = useState(true);
  const [isLive, setIsLive] = useState(true);
  const [activeMetric, setActiveMetric] = useState("moisture");
  const [availableSensors, setAvailableSensors] = useState([]);
  const [selectedMac, setSelectedMac] = useState(null);

  const fetchRealData = useCallback(async () => {
    if (!isLive) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch("http://localhost:5000/api/sensors/my-data", {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (!response.ok) throw new Error("Failed to fetch");

      const data = await response.json();

      if (!data || data.length === 0) {
        setSensorData([]);
        setAvailableSensors([]);
        setSelectedMac(null);
        setLoading(false);
        return;
      }

      setSensorData(data);

      // Extract MAC addresses that have data
      const macs = data.map(item => item.sensor);
      setAvailableSensors(macs);
      if (!selectedMac || !macs.includes(selectedMac)) {
        setSelectedMac(macs[0]);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error pulling sensor feed:", error);
      setLoading(false);
    }
  }, [isLive, selectedMac]);

  useEffect(() => {
    fetchRealData();
    const id = setInterval(fetchRealData, 3000);
    return () => clearInterval(id);
  }, [fetchRealData]);

  // Get the currently selected sensor's data
  const currentSensor = sensorData.find(s => s.sensor === selectedMac);
  const graphData = currentSensor?.graph_data || [];
  const latest = graphData.length > 0 ? graphData[graphData.length - 1] : null;

  // NPK data for bar chart
  const npkData = latest ? [
    { name: "N", value: latest.nitrogen,  fill: "#a78bfa" },
    { name: "P", value: latest.phosphorus, fill: "#fb923c" },
    { name: "K", value: latest.potassium,  fill: "#34d399" },
  ] : [];

  if (loading) {
    return (
      <div className="no-sensor-state">
        <h3>Loading Sensor Data...</h3>
        <p>Connecting to database 📡</p>
      </div>
    );
  }

  if (!latest) {
    return (
      <div className="no-sensor-state">
        <span className="no-sensor-icon">📡</span>
        <h3>No Sensor Data Found</h3>
        <p>Ensure your ESP32 is sending data or register a new sensor.</p>
        <button className="btn-primary" onClick={() => {}}>Go to Manage Sensors</button>
      </div>
    );
  }

  return (
    <div className="sensor-feed">
      {/* Live Status Bar */}
      <div className="sensor-status-bar">
        <div className="sensor-live-indicator">
          <span className={`live-dot ${isLive ? "live-dot-active" : ""}`}></span>
          <span>{isLive ? "Live — updating every 3s" : "Paused"}</span>
        </div>
        <div className="sensor-status-bar-right">
          {/* Sensor selection dropdown */}
          {availableSensors.length > 1 && (
            <select
              className="sensor-select"
              value={selectedMac || ''}
              onChange={(e) => setSelectedMac(e.target.value)}
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-light)",
                borderRadius: "var(--radius-md)",
                padding: "4px 8px",
                color: "var(--text-primary)",
                fontSize: "0.8rem",
              }}
            >
              {availableSensors.map(mac => (
                <option key={mac} value={mac}>{mac}</option>
              ))}
            </select>
          )}
          <span className="sensor-id-tag">Sensor: {selectedMac}</span>
          <button className={`live-toggle-btn ${isLive ? "live-toggle-pause" : "live-toggle-resume"}`} onClick={() => setIsLive(p => !p)}>
            {isLive ? "⏸ Pause" : "▶ Resume"}
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="sensor-cards-grid">
        <StatCard icon="💧" label="Moisture" value={latest.moisture}    unit="%" color={METRIC_COLORS.moisture}    status="normal" />
        <StatCard icon="🌡️" label="Temp"     value={latest.temperature} unit="°C" color={METRIC_COLORS.temperature} status="normal" />
        <StatCard icon="⚗️" label="pH"       value={latest.ph}          unit=""   color={METRIC_COLORS.ph}          status="good"   />
        <StatCard icon="🌿" label="Nitrogen" value={latest.nitrogen}    unit="mg/kg" color={METRIC_COLORS.nitrogen}  status="low"    />
        <StatCard icon="🔴" label="Phosphorus" value={latest.phosphorus} unit="mg/kg" color={METRIC_COLORS.phosphorus} status="normal" />
        <StatCard icon="🟡" label="Potassium" value={latest.potassium}  unit="mg/kg" color={METRIC_COLORS.potassium}  status="normal" />
      </div>

      {/* Charts Row */}
      <div className="sensor-charts-grid">
        {/* Line Chart */}
        <div className="chart-card chart-card-wide">
          <div className="chart-card-header">
            <h3 className="chart-title">Time Series</h3>
            <div className="chart-metric-tabs">
              {["moisture","temperature","ph"].map(m => (
                <button key={m} className={`chart-metric-tab ${activeMetric===m ? "chart-metric-active" : ""}`} onClick={() => setActiveMetric(m)} style={activeMetric===m ? { color: METRIC_COLORS[m], borderColor: METRIC_COLORS[m] } : {}}>
                  {m.charAt(0).toUpperCase()+m.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={graphData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2f1f" />
              <XAxis dataKey="time" tick={{ fontSize: 10, fill: "#4a6b4a" }} interval="preserveStartEnd" />
              <YAxis tick={{ fontSize: 10, fill: "#4a6b4a" }} />
              <Tooltip contentStyle={{ background: "#111a11", border: "1px solid #2a3d2a", borderRadius: 8, fontSize: 12 }} labelStyle={{ color: "#a3b8a3" }} itemStyle={{ color: METRIC_COLORS[activeMetric] }} />
              <Line type="monotone" dataKey={activeMetric} stroke={METRIC_COLORS[activeMetric]} strokeWidth={2} dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart — NPK */}
        <div className="chart-card">
          <div className="chart-card-header">
            <h3 className="chart-title">NPK Levels</h3>
            <span className="chart-subtitle">mg/kg</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={npkData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2f1f" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#a3b8a3" }} />
              <YAxis tick={{ fontSize: 10, fill: "#4a6b4a" }} />
              <Tooltip contentStyle={{ background: "#111a11", border: "1px solid #2a3d2a", borderRadius: 8, fontSize: 12 }} labelStyle={{ color: "#a3b8a3" }} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {npkData.map((entry, i) => (
                  <rect key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gauge — Moisture */}
        <div className="chart-card">
          <div className="chart-card-header">
            <h3 className="chart-title">Moisture Gauge</h3>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <RadialBarChart cx="50%" cy="60%" innerRadius="50%" outerRadius="90%" startAngle={180} endAngle={0}
              data={[{ value: latest.moisture, fill: METRIC_COLORS.moisture }]}>
              <RadialBar background={{ fill: "#1f2f1f" }} dataKey="value" cornerRadius={8} />
              <text x="50%" y="58%" textAnchor="middle" dominantBaseline="middle" fill="#f0fdf4" fontSize={28} fontFamily="Syne, sans-serif" fontWeight={800}>
                {latest.moisture}%
              </text>
              <text x="50%" y="72%" textAnchor="middle" fill="#4a6b4a" fontSize={11}>Soil Moisture</text>
            </RadialBarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default SensorFeed;