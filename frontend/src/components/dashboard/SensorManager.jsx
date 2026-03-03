import { useState, useEffect } from "react";

const MOCK_SENSORS = [
  { id: "s1", esp32_mac_address: "A4:CF:12:BE:9D:01", status: "active", latitude: 18.5204, longitude: 73.8567, created_at: "2025-11-10" },
];

const SensorManager = () => {
  const [sensors, setSensors]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm]         = useState({ esp32_mac_address: "", latitude: "", longitude: "" });
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState("");
  const [success, setSuccess]   = useState("");

  useEffect(() => {
    // TODO: fetch("/api/sensor/my-sensors", ...).then(...)
    setTimeout(() => { setSensors(MOCK_SENSORS); setLoading(false); }, 500);
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    setSaving(true); setError(""); setSuccess("");
    // TODO:
    // const res = await fetch("/api/sensor/register", { method:"POST", headers:{ "Content-Type":"application/json", Authorization:`Bearer ${localStorage.getItem("token")}` }, body: JSON.stringify(form) });
    // const data = await res.json();
    // if (!res.ok) { setError(data.message); setSaving(false); return; }
    await new Promise(r => setTimeout(r, 1000));
    setSensors(prev => [...prev, { id: Date.now(), ...form, status: "active", created_at: new Date().toLocaleDateString() }]);
    setSuccess("Sensor registered successfully!");
    setShowForm(false);
    setForm({ esp32_mac_address: "", latitude: "", longitude: "" });
    setSaving(false);
  };

  const statusColor = { active: "#4ade80", inactive: "#f87171", maintenance: "#f59e0b" };

  if (loading) return <div className="dash-loading"><span className="auth-spinner" style={{borderColor:"rgba(74,222,128,0.2)",borderTopColor:"#4ade80"}}></span></div>;

  return (
    <div className="sensor-manager">
      <div className="sensor-manager-top">
        <div>
          <h3 className="sm-heading">Your ESP32 Sensors</h3>
          <p className="sm-sub">{sensors.length} sensor{sensors.length!==1?"s":""} registered</p>
        </div>
        <button className="btn-primary sm-add-btn" onClick={() => setShowForm(p=>!p)}>
          {showForm ? "✕ Cancel" : "+ Register New Sensor"}
        </button>
      </div>

      {success && <div className="sm-success">✅ {success}</div>}
      {error   && <div className="auth-error">⚠️ {error}</div>}

      {/* Register Form */}
      {showForm && (
        <form className="sm-form" onSubmit={handleRegister}>
          <h4 className="sm-form-title">Register New Sensor</h4>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">ESP32 MAC Address</label>
              <input className="form-input" placeholder="AA:BB:CC:DD:EE:FF" value={form.esp32_mac_address}
                onChange={e=>setForm({...form,esp32_mac_address:e.target.value})} required
                pattern="^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$" title="Format: AA:BB:CC:DD:EE:FF" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Latitude (optional)</label>
              <input className="form-input" placeholder="18.5204" type="number" step="any" value={form.latitude}
                onChange={e=>setForm({...form,latitude:e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">Longitude (optional)</label>
              <input className="form-input" placeholder="73.8567" type="number" step="any" value={form.longitude}
                onChange={e=>setForm({...form,longitude:e.target.value})} />
            </div>
          </div>
          <button type="submit" className="auth-submit-btn sm-submit-btn" disabled={saving}>
            {saving ? <span className="auth-spinner"></span> : "Register Sensor"}
          </button>
        </form>
      )}

      {/* Sensors List */}
      {sensors.length === 0 ? (
        <div className="sm-empty">
          <span>📡</span>
          <p>No sensors yet. Register your first ESP32 device above.</p>
        </div>
      ) : (
        <div className="sm-list">
          {sensors.map(s => (
            <div key={s.id} className="sm-item">
              <div className="sm-item-left">
                <div className="sm-item-icon">📡</div>
                <div>
                  <p className="sm-mac">{s.esp32_mac_address}</p>
                  <p className="sm-item-meta">Registered: {s.created_at}{s.latitude ? ` · ${s.latitude}, ${s.longitude}` : ""}</p>
                </div>
              </div>
              <div className="sm-item-right">
                <span className="sm-status-badge" style={{ color: statusColor[s.status], borderColor: statusColor[s.status], background: `${statusColor[s.status]}15` }}>
                  ● {s.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SensorManager;