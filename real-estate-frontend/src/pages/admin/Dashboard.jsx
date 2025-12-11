import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaUsers,
  FaHome,
  FaChartLine,
  FaClipboardCheck,
} from "react-icons/fa";
import api from "../../lib/axios";
import { toast } from "react-hot-toast";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await api.get("/api/admin/dashboard/stats");

      if (!res.data?.data?.stats) {
        toast.error("Invalid dashboard response");
        return;
      }

      const s = res.data.data.stats;

      setStats({
        users: s.users.total,
        properties: s.properties.total,
        pending: s.properties.pending,
        revenue: s.revenue?.totalRevenue ?? 0,
      });

      setRecent(res.data.data.recentActivities);

    } catch (err) {
      console.error("Dashboard Error:", err);
      toast.error("Failed to load dashboard stats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500">
        <div className="animate-pulse text-xl">Loading dashboard…</div>
      </div>
    );
  }

  if (!stats)
    return (
      <p className="text-center p-6 text-red-500">Dashboard Stats Missing</p>
    );

  const cards = [
    {
      name: "Total Users",
      value: stats.users,
      icon: <FaUsers className="h-7 w-7" />,
      link: "/admin/users",
      color: "from-blue-500 to-blue-600",
    },
    {
      name: "Total Properties",
      value: stats.properties,
      icon: <FaHome className="h-7 w-7" />,
      link: "/admin/properties",
      color: "from-green-500 to-green-600",
    },
    {
      name: "Pending Approvals",
      value: stats.pending,
      icon: <FaClipboardCheck className="h-7 w-7" />,
      link: "/admin/properties/pending",
      color: "from-yellow-500 to-yellow-600",
    },
    {
      name: "Total Revenue",
      value: `₹${stats.revenue}`,
      icon: <FaChartLine className="h-7 w-7" />,
      link: "/admin/revenue",
      color: "from-purple-500 to-purple-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-8">

        <h1 className="text-4xl font-extrabold text-gray-800 mb-10 text-center tracking-tight">
          Admin Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {cards.map((card, i) => (
            <Link
              key={i}
              to={card.link}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition transform duration-200"
            >
              <div className="flex items-center">
                <div
                  className={`p-4 rounded-full bg-gradient-to-r ${card.color} text-white mr-4 shadow`}
                >
                  {card.icon}
                </div>
                <div>
                  <p className="text-sm text-gray-500">{card.name}</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {card.value}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="bg-white p-6 rounded-xl shadow mb-12">
          <h2 className="text-2xl font-semibold mb-6">Quick Actions</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Add New User", desc: "Create user", link: "/admin/users/new" },
              { title: "Add Property", desc: "Add property listing", link: "/admin/properties/new" },
              { title: "Site Settings", desc: "Manage configuration", link: "/admin/settings" },
              { title: "View Reports", desc: "Insights & analytics", link: "/admin/reports" },
            ].map((a, i) => (
              <Link
                key={i}
                to={a.link}
                className="p-6 border rounded-lg hover:bg-gray-50 hover:shadow-md transition"
              >
                <h3 className="font-semibold text-gray-800">{a.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{a.desc}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* RECENT ACTIVITIES */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-2xl font-semibold mb-6">Recent Activity</h2>

          {!recent ? (
            <p className="text-gray-500">No recent activity</p>
          ) : (
            <div className="space-y-6">

              <div>
                <h3 className="text-xl font-bold">Latest Users</h3>
                {recent.users.slice(0, 5).map((u) => (
                  <div key={u._id} className="p-3 border rounded-lg flex justify-between">
                    <span>{u.name} ({u.role})</span>
                    <span className="text-gray-500 text-sm">
                      {new Date(u.createdAt).toLocaleDateString("en-GB")}
                    </span>
                  </div>
                ))}
              </div>

              <div>
                <h3 className="text-xl font-bold">Latest Properties</h3>
                {recent.properties.slice(0, 5).map((p) => (
                  <div key={p._id} className="p-3 border rounded-lg flex justify-between">
                    <span>{p.title}</span>
                    <span className="text-gray-500 text-sm">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
