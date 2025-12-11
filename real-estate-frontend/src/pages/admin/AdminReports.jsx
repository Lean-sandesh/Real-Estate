import React, { useEffect, useState } from "react";
import api from "../../lib/axios";
import { toast } from "react-hot-toast";

const AdminReports = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadStats = async () => {
    try {
      const res = await api.get("/api/admin/system/stats");
      setStats(res.data.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  if (loading)
    return (
      <div className="p-6 bg-white rounded-xl shadow text-center">
        Loading Reports...
      </div>
    );

  return (
    <div className="p-6 bg-white rounded-xl shadow">
      <h2 className="text-3xl font-bold mb-6 text-blue-600">
        📊 System Reports & Insights
      </h2>

      {/* Growth Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="p-5 border rounded-lg shadow-sm bg-blue-50">
          <h3 className="font-semibold text-blue-700">New Users (30 Days)</h3>
          <p className="text-3xl font-bold">{stats.growth.users}</p>
        </div>

        <div className="p-5 border rounded-lg shadow-sm bg-green-50">
          <h3 className="font-semibold text-green-700">New Properties</h3>
          <p className="text-3xl font-bold">{stats.growth.properties}</p>
        </div>

        <div className="p-5 border rounded-lg shadow-sm bg-yellow-50">
          <h3 className="font-semibold text-yellow-700">New Inquiries</h3>
          <p className="text-3xl font-bold">{stats.growth.inquiries}</p>
        </div>
      </div>

      {/* User Role Distribution */}
      <h3 className="text-2xl font-bold mb-3 text-gray-700">
        👥 User Role Distribution
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        {stats.distributions.users.map((u) => (
          <div
            key={u._id}
            className="p-4 border rounded-lg bg-gray-50 shadow-sm flex justify-between"
          >
            <span className="capitalize font-medium text-gray-700">{u._id}</span>
            <span className="font-bold">{u.count}</span>
          </div>
        ))}
      </div>

      {/* Property Status Distribution */}
      <h3 className="text-2xl font-bold mb-3 text-gray-700">
        🏠 Property Status Breakdown
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.distributions.properties.map((p) => (
          <div
            key={p._id}
            className="p-4 border rounded-lg bg-gray-50 shadow-sm flex justify-between"
          >
            <span className="capitalize font-medium text-gray-700">{p._id}</span>
            <span className="font-bold">{p.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminReports;
