import { useState, useEffect } from "react";
import { FiBell, FiMoon, FiSun, FiTrash } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import api from "../lib/axios";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const { user, loadUser, logout } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [passwords, setPasswords] = useState({ current: "", new: "" });
  const [notifications, setNotifications] = useState(true);
  const [theme, setTheme] = useState("light");
  const [language, setLanguage] = useState("English");

  useEffect(() => {
    if (user) {
      setEmail(user.email);
    }

    const savedTheme = localStorage.getItem("theme") || "light";
    const savedLang = localStorage.getItem("language") || "English";
    const savedNotif = JSON.parse(localStorage.getItem("notifications") || "true");

    setTheme(savedTheme);
    setLanguage(savedLang);
    setNotifications(savedNotif);
  }, [user]);

  // Change Theme
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark");
  };

  // Update Email
  const updateEmail = async () => {
    try {
      const res = await api.put("/auth/update-email", { email });
      await loadUser();
      alert("Email updated successfully");
    } catch (err) {
      alert("Failed to update email");
      console.error(err);
    }
  };

  // Change Password
  const changePassword = async () => {
    if (!passwords.current || !passwords.new) {
      alert("Enter both current & new passwords");
      return;
    }

    try {
      const res = await api.put("/auth/change-password", passwords);
      alert("Password changed successfully");
      setPasswords({ current: "", new: "" });
    } catch (err) {
      alert("Failed to change password");
      console.error(err);
    }
  };

  // Notifications toggle
  const toggleNotifications = () => {
    const newValue = !notifications;
    setNotifications(newValue);
    localStorage.setItem("notifications", JSON.stringify(newValue));
  };

  // Delete Account
  const deleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account?")) return;

    try {
      await api.delete("/auth/delete-account");
      logout(); // clear session
    } catch (err) {
      alert("Failed to delete account");
      console.error(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 px-4 py-2 rounded-md bg-gradient-to-r from-blue-500 to-blue-700 text-white hover:from-blue-600 hover:to-blue-800 transition-all duration-300 shadow-md"
      >
        <span className="text-lg">←</span>
        <span>Back</span>
      </button>
      <h1 className="text-4xl font-bold mb-8 text-gray-800 dark:text-white">Settings</h1>

      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 space-y-10">

        {/* Update Email */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Account Settings</h2>

          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 space-y-4">

            <div>
              <label className="text-gray-700 dark:text-gray-300">Email</label>
              <input
                className="w-full p-2 border rounded mt-1 bg-white dark:bg-gray-700"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                onClick={updateEmail}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Update Email
              </button>
            </div>

            {/* Change Password */}
            <div>
              <label className="text-gray-700 dark:text-gray-300">Current Password</label>
              <input
                type="password"
                className="w-full p-2 border rounded mt-1 bg-white dark:bg-gray-700"
                value={passwords.current}
                onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
              />

              <label className="text-gray-700 dark:text-gray-300 mt-2 block">
                New Password
              </label>
              <input
                type="password"
                className="w-full p-2 border rounded mt-1 bg-white dark:bg-gray-700"
                value={passwords.new}
                onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
              />

              <button
                onClick={changePassword}
                className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Change Password
              </button>
            </div>

          </div>
        </section>

        {/* Notification Toggle */}
        <section className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              Notifications
            </h3>
            <p className="text-gray-500 text-sm">Turn app notifications on or off</p>
          </div>

          <button
            onClick={toggleNotifications}
            className={`px-5 py-2 rounded-lg font-medium text-sm 
              ${notifications ? "bg-green-600 text-white" : "bg-gray-400 text-white"}`}
          >
            {notifications ? "Enabled" : "Disabled"}
          </button>
        </section>

        {/* Theme Toggle */}
        <section className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Theme</h3>
            <p className="text-gray-500 text-sm">Switch between light or dark mode</p>
          </div>

          <button
            onClick={toggleTheme}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg flex items-center gap-2"
          >
            {theme === "light" ? <FiMoon /> : <FiSun />}
            {theme === "light" ? "Dark Mode" : "Light Mode"}
          </button>
        </section>

        {/* Language */}
        <section className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Language</h3>
            <p className="text-gray-500 text-sm">Select your preferred language</p>
          </div>

          <select
            value={language}
            onChange={(e) => {
              setLanguage(e.target.value);
              localStorage.setItem("language", e.target.value);
            }}
            className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white border 
                       border-gray-300 dark:border-gray-600 text-sm rounded-lg px-3 py-2"
          >
            <option>English</option>
            <option>Hindi</option>
            <option>Marathi</option>
          </select>
        </section>

        {/* Delete Account */}
        <section className="pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={deleteAccount}
            className="flex items-center gap-2 text-red-600 hover:text-red-700 text-sm font-medium transition"
          >
            <FiTrash className="text-base" />
            Delete my account
          </button>
        </section>
      </div>
    </div>
  );
}
