import { useState, useEffect } from "react";
import "./Settings.css";

export default function Settings() {
  // Theme
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  // Accent color
  const [accent, setAccent] = useState(localStorage.getItem("accent") || "#4f46e5");

  // Background
  const [background, setBackground] = useState(localStorage.getItem("background") || "default");

  // Toggles
  const [showInsights, setShowInsights] = useState(
    JSON.parse(localStorage.getItem("showInsights") || "true")
  );
  const [showActivity, setShowActivity] = useState(
    JSON.parse(localStorage.getItem("showActivity") || "true")
  );

  // Apply theme + accent + background
  useEffect(() => {
    document.documentElement.style.setProperty("--accent-color", accent);
    document.body.setAttribute("data-theme", theme);
    document.body.setAttribute("data-bg", background);

    localStorage.setItem("theme", theme);
    localStorage.setItem("accent", accent);
    localStorage.setItem("background", background);
    localStorage.setItem("showInsights", showInsights);
    localStorage.setItem("showActivity", showActivity);
  }, [theme, accent, background, showInsights, showActivity]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="settings-page">
      <h1 className="settings-title">Settings</h1>

      {/* Profile Section */}
      <div className="settings-card">
        <h2>Profile</h2>
        <p>Logged in as: <strong>User</strong></p>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>

      {/* Appearance Section */}
      <div className="settings-card">
        <h2>Appearance</h2>

        {/* Theme */}
        <div className="settings-row">
          <label>Theme</label>
          <select value={theme} onChange={(e) => setTheme(e.target.value)}>
            <option value="dark">Dark</option>
            <option value="light">Light</option>
            <option value="glass">Glass</option>
            <option value="neon">Neon</option>
          </select>
        </div>

        {/* Accent Color */}
        <div className="settings-row">
          <label>Accent Color</label>
          <input
            type="color"
            value={accent}
            onChange={(e) => setAccent(e.target.value)}
          />
        </div>

        {/* Background */}
        <div className="settings-row">
          <label>Background</label>
          <select value={background} onChange={(e) => setBackground(e.target.value)}>
            <option value="default">Default</option>
            <option value="gradient">Gradient</option>
            <option value="solid">Solid</option>
            <option value="image1">Image 1</option>
            <option value="image2">Image 2</option>
          </select>
        </div>
      </div>

      {/* Productivity Section */}
      <div className="settings-card">
        <h2>Productivity</h2>

        <div className="settings-row">
          <label>Show Insights</label>
          <input
            type="checkbox"
            checked={showInsights}
            onChange={() => setShowInsights(!showInsights)}
          />
        </div>

        <div className="settings-row">
          <label>Show Recent Activity</label>
          <input
            type="checkbox"
            checked={showActivity}
            onChange={() => setShowActivity(!showActivity)}
          />
        </div>
      </div>

      {/* AI Assistant Section */}
      <div className="settings-card">
        <h2>AI Assistant</h2>
        <p>This will be your custom in-app helper. We can build:</p>
        <ul>
          <li>Task suggestions</li>
          <li>Board organization tips</li>
          <li>Help commands</li>
          <li>Mini chat interface</li>
        </ul>
        <button className="assistant-btn">Open Assistant</button>
      </div>
    </div>
  );
}
