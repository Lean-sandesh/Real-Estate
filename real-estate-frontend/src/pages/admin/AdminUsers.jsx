import React, { useEffect, useState } from "react";
import api from "../../lib/axios";
import { toast } from "react-hot-toast";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add User Form
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "user",
    password: "",
  });

  const [saving, setSaving] = useState(false);

  // Fetch all users
  const loadUsers = async () => {
    try {
      const res = await api.get("/api/admin/users");
      setUsers(res.data.data.users || []);
    } catch (err) {
      toast.error("Unable to load users");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add User (admin API)
  const addUser = async (e) => {
    e.preventDefault();

    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      setSaving(true);
      const res = await api.post("/api/admin/users", form);

      toast.success("User created successfully!");

      setUsers((prev) => [...prev, res.data.data.user]);

      setForm({ name: "", email: "", role: "user", password: "" });

    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create user");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  // Role badge colors
  const roleBadge = (role) => {
    const styles = {
      admin: "bg-purple-100 text-purple-700",
      agent: "bg-green-100 text-green-700",
      user: "bg-blue-100 text-blue-700",
    };
    return styles[role] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow">
      <h2 className="text-3xl font-bold mb-6 text-blue-600">👥 Manage Users</h2>

      {/* Add User Form */}
      <form
        onSubmit={addUser}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 p-4 border rounded-xl bg-gray-50"
      >
        <input
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          className="p-3 border rounded-lg"
          required
        />

        <input
          name="email"
          type="email"
          placeholder="Email Address"
          value={form.email}
          onChange={handleChange}
          className="p-3 border rounded-lg"
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="p-3 border rounded-lg"
          required
        />

        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="p-3 border rounded-lg"
        >
          <option value="user">User</option>
          <option value="agent">Agent</option>
          <option value="admin">Admin</option>
        </select>

        <button
          disabled={saving}
          className="md:col-span-2 bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition"
        >
          {saving ? "Adding..." : "Add User"}
        </button>
      </form>

      {/* Users Table */}
      {loading ? (
        <p className="text-gray-500">Loading users...</p>
      ) : (
        <table className="w-full border rounded-lg overflow-hidden shadow-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3 border">Name</th>
              <th className="p-3 border">Email</th>
              <th className="p-3 border">Role</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="hover:bg-gray-50">
                <td className="p-3 border">{u.name}</td>
                <td className="p-3 border">{u.email}</td>

                <td className="p-3 border">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${roleBadge(
                      u.role
                    )}`}
                  >
                    {u.role}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminUsers;
