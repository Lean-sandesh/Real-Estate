import React, { useState } from "react";
import api from "../../lib/axios";
import { toast } from "react-hot-toast";

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    theme: "light",
    maintenanceMode: false,
    siteTitle: "Real Estate Pro",
    supportEmail: "support@realestatepro.com",
  });

  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      // Future API: await api.put("/api/admin/settings", settings);
      toast.success("Settings updated successfully!");
    } catch (err) {
      toast.error("Failed to update settings");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-xl shadow">
      <h2 className="text-3xl font-bold mb-6 text-blue-600">
        ⚙️ Admin Settings
      </h2>

      {/* Website Title */}
      <div className="mb-6">
        <label className="block font-semibold mb-1">Website Title</label>
        <input
          type="text"
          name="siteTitle"
          value={settings.siteTitle}
          onChange={handleChange}
          className="border p-3 rounded-lg w-full focus:ring focus:ring-blue-300"
        />
      </div>

      {/* Support Email */}
      <div className="mb-6">
        <label className="block font-semibold mb-1">Support Email</label>
        <input
          type="email"
          name="supportEmail"
          value={settings.supportEmail}
          onChange={handleChange}
          className="border p-3 rounded-lg w-full focus:ring focus:ring-blue-300"
        />
      </div>

      {/* Theme Selector */}
      <div className="mb-6">
        <label className="block font-semibold mb-2">Theme Mode</label>

        <select
          name="theme"
          value={settings.theme}
          onChange={handleChange}
          className="border p-3 rounded-lg w-full focus:ring focus:ring-blue-300"
        >
          <option value="light">☀️ Light Mode</option>
          <option value="dark">🌙 Dark Mode</option>
        </select>

        <span
          className={`inline-block mt-2 px-3 py-1 text-sm rounded-full ${
            settings.theme === "dark"
              ? "bg-gray-800 text-white"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {settings.theme === "dark" ? "Dark mode active" : "Light mode active"}
        </span>
      </div>

      {/* Maintenance Mode */}
      <div className="mb-8 flex items-center gap-3">
        <input
          type="checkbox"
          name="maintenanceMode"
          checked={settings.maintenanceMode}
          onChange={handleChange}
          className="h-5 w-5 cursor-pointer"
        />
        <label className="font-semibold cursor-pointer">
          Enable Maintenance Mode (Site Offline)
        </label>
      </div>

      {/* Save Button */}
      <button
        onClick={saveSettings}
        disabled={saving}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition w-full font-semibold"
      >
        {saving ? "Saving..." : "Save Settings"}
      </button>

      <p className="text-sm text-gray-500 mt-4 text-center">
        *Future Update:* These settings will sync with backend using an API.
      </p>
    </div>
  );
};

export default AdminSettings;
