import { useState } from "react";

const DashboardSettings = () => {
  const [profile, setProfile]       = useState({ full_name: "Arjun Mehta", email: "arjun@example.com" });
  const [passwords, setPasswords]   = useState({ current_password: "", new_password: "", confirm_password: "" });
  const [profileMsg, setProfileMsg] = useState("");
  const [passMsg, setPassMsg]       = useState("");
  const [passErr, setPassErr]       = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPass, setSavingPass]       = useState(false);
  const [showCurrent, setShowCurrent]     = useState(false);
  const [showNew, setShowNew]             = useState(false);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSavingProfile(true); setProfileMsg("");
    // TODO: PATCH /api/user/profile
    await new Promise(r => setTimeout(r, 800));
    setProfileMsg("Profile updated successfully.");
    setSavingProfile(false);
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    setPassMsg(""); setPassErr("");
    if (passwords.new_password !== passwords.confirm_password) { setPassErr("New passwords do not match."); return; }
    if (passwords.new_password.length < 8) { setPassErr("Password must be at least 8 characters."); return; }
    setSavingPass(true);
    // TODO: PATCH /api/user/change-password
    await new Promise(r => setTimeout(r, 800));
    setPassMsg("Password changed successfully.");
    setPasswords({ current_password: "", new_password: "", confirm_password: "" });
    setSavingPass(false);
  };

  return (
    <div className="settings-section">
      {/* Profile Card */}
      <div className="settings-card">
        <div className="settings-card-header">
          <h3 className="settings-card-title">👤 Profile Information</h3>
          <p className="settings-card-sub">Update your name and email address.</p>
        </div>
        {profileMsg && <div className="settings-success">✅ {profileMsg}</div>}
        <form className="settings-form" onSubmit={handleProfileSave}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-input" value={profile.full_name}
                onChange={e=>setProfile({...profile,full_name:e.target.value})} required />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input className="form-input" type="email" value={profile.email}
                onChange={e=>setProfile({...profile,email:e.target.value})} required />
            </div>
          </div>
          <button type="submit" className="auth-submit-btn settings-save-btn" disabled={savingProfile}>
            {savingProfile ? <span className="auth-spinner"></span> : "Save Profile"}
          </button>
        </form>
      </div>

      {/* Password Card */}
      <div className="settings-card">
        <div className="settings-card-header">
          <h3 className="settings-card-title">🔒 Change Password</h3>
          <p className="settings-card-sub">Use a strong password with at least 8 characters.</p>
        </div>
        {passMsg && <div className="settings-success">✅ {passMsg}</div>}
        {passErr && <div className="auth-error">⚠️ {passErr}</div>}
        <form className="settings-form" onSubmit={handlePasswordSave}>
          <div className="form-group">
            <label className="form-label">Current Password</label>
            <div className="input-wrap">
              <span className="input-icon">🔒</span>
              <input type={showCurrent ? "text" : "password"} className="form-input input-with-icon input-with-toggle"
                placeholder="Enter current password"
                value={passwords.current_password}
                onChange={e=>setPasswords({...passwords,current_password:e.target.value})} required />
              <button type="button" className="pass-toggle" onClick={() => setShowCurrent(p=>!p)}>{showCurrent?"🙈":"👁"}</button>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">New Password</label>
              <div className="input-wrap">
                <span className="input-icon">🔒</span>
                <input type={showNew ? "text" : "password"} className="form-input input-with-icon input-with-toggle"
                  placeholder="Min. 8 characters"
                  value={passwords.new_password}
                  onChange={e=>setPasswords({...passwords,new_password:e.target.value})} required />
                <button type="button" className="pass-toggle" onClick={() => setShowNew(p=>!p)}>{showNew?"🙈":"👁"}</button>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <div className="input-wrap">
                <span className="input-icon">🔒</span>
                <input type="password"
                  className={`form-input input-with-icon ${passwords.confirm_password && passwords.confirm_password!==passwords.new_password ? "input-error" : passwords.confirm_password && passwords.confirm_password===passwords.new_password ? "input-success" : ""}`}
                  placeholder="Re-enter new password"
                  value={passwords.confirm_password}
                  onChange={e=>setPasswords({...passwords,confirm_password:e.target.value})} required />
              </div>
            </div>
          </div>
          <button type="submit" className="auth-submit-btn settings-save-btn" disabled={savingPass}>
            {savingPass ? <span className="auth-spinner"></span> : "Update Password"}
          </button>
        </form>
      </div>

      {/* Danger Zone */}
      <div className="settings-card settings-danger-card">
        <div className="settings-card-header">
          <h3 className="settings-card-title settings-danger-title">⚠️ Danger Zone</h3>
          <p className="settings-card-sub">These actions are permanent and cannot be undone.</p>
        </div>
        <button className="settings-danger-btn" onClick={() => { if(window.confirm("Are you sure you want to delete your account? This cannot be undone.")) { /* TODO: DELETE /api/user/account */ }}}>
          Delete My Account
        </button>
      </div>
    </div>
  );
};

export default DashboardSettings;