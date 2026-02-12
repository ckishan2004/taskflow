import React, { useMemo, useState } from "react";
import "../style/setting.css";

export default function Settings() {
  const user = useMemo(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : { name: "John Doe", email: "john@example.com" };
  }, []);

  const [activeTab, setActiveTab] = useState("profile");
  const [avatar, setAvatar] = useState("https://placehold.co/150x150?text=User+Photo");
  const [name, setName] = useState(user.name || "John Doe");
  const [email, setEmail] = useState(user.email || "john@example.com");
  const [bio, setBio] = useState("Productive task manager");

  const onPickImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setAvatar(String(ev.target?.result || ""));
    reader.readAsDataURL(file);
  };

  const onSave = (e) => {
    e.preventDefault();
    localStorage.setItem("user", JSON.stringify({ name, email }));
    alert("Saved!");
  };

  return (
    <main className="main">
      <div className="container">
        <div className="settings-container">
          <h1 className="settings-title">Account Settings</h1>

          <div className="settings-tabs">
            <button className={`tab-btn ${activeTab === "profile" ? "active" : ""}`} data-tab="profile" onClick={() => setActiveTab("profile")}>
              Profile
            </button>
            <button className={`tab-btn ${activeTab === "preferences" ? "active" : ""}`} data-tab="preferences" onClick={() => setActiveTab("preferences")}>
              Preferences
            </button>
            <button className={`tab-btn ${activeTab === "security" ? "active" : ""}`} data-tab="security" onClick={() => setActiveTab("security")}>
              Security
            </button>
            <button className={`tab-btn ${activeTab === "notifications" ? "active" : ""}`} data-tab="notifications" onClick={() => setActiveTab("notifications")}>
              Notifications
            </button>
          </div>

          <div className={`tab-content ${activeTab === "profile" ? "active" : ""}`} id="profile">
            <form className="settings-form" onSubmit={onSave}>
              <div className="form-group">
                <label>Profile Picture</label>
                <div className="avatar-upload">
                  <div>
                    <input type="file" id="imageUpload" accept=".png, .jpg, .jpeg" onChange={onPickImage} />
                  </div>
                  <div className="avatar-preview" id="imagePreview" style={{ backgroundImage: `url('${avatar}')` }} />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input type="text" id="name" className="form-control" value={name} onChange={(e) => setName(e.target.value)} />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>

              <div className="form-group">
                <label htmlFor="bio">Bio</label>
                <textarea id="bio" className="form-control" rows="3" value={bio} onChange={(e) => setBio(e.target.value)} />
              </div>

              <button type="submit" className="btn btn-primary">Save Changes</button>
            </form>
          </div>

          <div className={`tab-content ${activeTab === "preferences" ? "active" : ""}`} id="preferences">
            <p>Preferences settings go here.</p>
          </div>

          <div className={`tab-content ${activeTab === "security" ? "active" : ""}`} id="security">
            <p>Security settings go here.</p>
          </div>

          <div className={`tab-content ${activeTab === "notifications" ? "active" : ""}`} id="notifications">
            <p>Notifications settings go here.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
