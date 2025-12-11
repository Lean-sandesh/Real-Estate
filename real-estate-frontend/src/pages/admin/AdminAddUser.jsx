import React, { useState } from "react";
import api from "../../lib/axios";
import { toast } from "react-hot-toast";
import { FaUser, FaEnvelope, FaLock, FaUserShield } from "react-icons/fa";

const AdminAddUser = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Correct backend route: admin creates user using auth/register
      const response = await api.post("/api/auth/register", form);

      toast.success(response.data.message || "User created successfully");

      setForm({ name: "", email: "", password: "", role: "user" });
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-8 rounded-2xl shadow-xl mt-10 border border-gray-200">
      <h2 className="text-3xl font-extrabold text-blue-700 mb-8 text-center">
        👤 Add New User
      </h2>

      <form onSubmit={submit} className="space-y-6">

        {/* Name */}
        <div className="flex items-center border rounded-lg p-3 shadow-sm">
          <FaUser className="text-blue-500 mr-3" />
          <input
            name="name"
            placeholder="Full Name"
            className="w-full outline-none"
            onChange={handleChange}
            value={form.name}
            required
          />
        </div>

        {/* Email */}
        <div className="flex items-center border rounded-lg p-3 shadow-sm">
          <FaEnvelope className="text-green-500 mr-3" />
          <input
            name="email"
            type="email"
            placeholder="Email Address"
            className="w-full outline-none"
            onChange={handleChange}
            value={form.email}
            required
          />
        </div>

        {/* Password */}
        <div className="flex items-center border rounded-lg p-3 shadow-sm">
          <FaLock className="text-red-500 mr-3" />
          <input
            name="password"
            type="password"
            placeholder="Password"
            className="w-full outline-none"
            onChange={handleChange}
            value={form.password}
            required
          />
        </div>

        {/* Role Selector */}
        <div className="flex items-center border rounded-lg p-3 shadow-sm">
          <FaUserShield className="text-purple-500 mr-3" />
          <select
            name="role"
            className="w-full outline-none"
            onChange={handleChange}
            value={form.role}
          >
            <option value="user">User</option>
            <option value="agent">Agent</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {/* Submit Button */}
        <button
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold p-3 rounded-lg shadow-md transition"
        >
          {loading ? "Creating..." : "Create User"}
        </button>
      </form>
    </div>
  );
};

export default AdminAddUser;
