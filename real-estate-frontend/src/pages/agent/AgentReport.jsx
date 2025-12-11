import React, { useEffect, useState } from "react";
import api from "../../lib/axios";
import { toast } from "react-hot-toast";
import {
  FaChartLine,
  FaUsers,
  FaHome,
  FaEye,
  FaHeart,
  FaClipboardList,
} from "react-icons/fa";

const AgentReport = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadStats = async () => {
    try {
      const res = await api.get("/api/agent/reports");
      setStats(res.data.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load agent reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  if (loading)
    return (
      <div className="p-6 text-center bg-white rounded-xl shadow">
        Loading Agent Reports...
      </div>
    );

  return (
    <div className="p-6">

      <h2 className="text-4xl font-bold mb-8 text-blue-700">
        📊 Agent Performance Report
      </h2>

      {/* ---- Top Stats Cards ---- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        {/* Total Properties */}
        <div className="p-6 bg-blue-100 rounded-xl shadow hover:shadow-md transition">
          <FaHome className="text-4xl text-blue-600 mb-3" />
          <p className="text-gray-700 font-medium">Total Properties Added</p>
          <p className="text-3xl font-bold">{stats.properties.total}</p>
        </div>

        {/* Total Views */}
        <div className="p-6 bg-purple-100 rounded-xl shadow hover:shadow-md transition">
          <FaEye className="text-4xl text-purple-600 mb-3" />
          <p className="text-gray-700 font-medium">Total Views</p>
          <p className="text-3xl font-bold">{stats.properties.views || 0}</p>
        </div>

        {/* Total Likes */}
        <div className="p-6 bg-red-100 rounded-xl shadow hover:shadow-md transition">
          <FaHeart className="text-4xl text-red-600 mb-3" />
          <p className="text-gray-700 font-medium">Total Likes</p>
          <p className="text-3xl font-bold">{stats.properties.likes || 0}</p>
        </div>

        {/* Revenue */}
        <div className="p-6 bg-green-100 rounded-xl shadow hover:shadow-md transition">
          <FaChartLine className="text-4xl text-green-600 mb-3" />
          <p className="text-gray-700 font-medium">Total Revenue</p>
          <p className="text-3xl font-bold">₹{stats.revenue.total}</p>
        </div>
      </div>

      {/* ---- Property Status Breakdown ---- */}
      <h3 className="text-2xl font-bold text-gray-800 mb-3">
        🏠 Property Status Breakdown
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {stats.properties.statusWise.map((item) => (
          <div
            key={item._id}
            className="p-5 bg-white border rounded-lg shadow hover:shadow-md transition flex justify-between"
          >
            <span className="capitalize text-gray-700 font-medium">
              {item._id}
            </span>
            <span className="font-bold text-gray-900">{item.count}</span>
          </div>
        ))}
      </div>

      {/* ---- Inquiry Breakdown ---- */}
      <h3 className="text-2xl font-bold text-gray-800 mb-3">
        📥 Inquiry Breakdown
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {stats.inquiries.statusWise.map((item) => (
          <div
            key={item._id}
            className="p-5 bg-white border rounded-lg shadow hover:shadow-md transition flex justify-between"
          >
            <span className="capitalize text-gray-700 font-medium">
              {item._id}
            </span>
            <span className="font-bold text-gray-900">{item.count}</span>
          </div>
        ))}
      </div>

      {/* ---- Client Overview ---- */}
      <h3 className="text-2xl font-bold text-gray-800 mb-3">👥 Clients Overview</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="p-5 bg-gray-50 border rounded-lg shadow">
          <p className="text-gray-700 font-medium">Total Clients</p>
          <p className="text-3xl font-bold">{stats.clients.total}</p>
        </div>

        <div className="p-5 bg-gray-50 border rounded-lg shadow">
          <p className="text-gray-700 font-medium">Active Clients</p>
          <p className="text-3xl font-bold">{stats.clients.active}</p>
        </div>

        <div className="p-5 bg-gray-50 border rounded-lg shadow">
          <p className="text-gray-700 font-medium">Closed Deals</p>
          <p className="text-3xl font-bold">{stats.clients.closed}</p>
        </div>
      </div>

      {/* ---- Recent Activity ---- */}
      <h3 className="text-2xl font-bold text-gray-800 mb-4">
        📝 Recent Activity
      </h3>

      {stats.recentActivity?.length > 0 ? (
        <div className="bg-white p-6 rounded-lg shadow">
          {stats.recentActivity.map((log, i) => (
            <div
              key={i}
              className="p-3 border-b last:border-0 flex justify-between"
            >
              <span className="text-gray-700">{log.message}</span>
              <span className="text-gray-500 text-sm">{log.time}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">No recent activity recorded.</p>
      )}
    </div>
  );
};

export default AgentReport;
