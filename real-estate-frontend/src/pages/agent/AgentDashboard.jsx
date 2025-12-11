import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../lib/axios";
import {
  FaHome,
  FaChartLine,
  FaHeart,
  FaEye,
  FaClock,
  FaCheckCircle,
} from "react-icons/fa";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement);

const AgentDashboard = () => {
  const [stats, setStats] = useState({
    totalProperties: 0,
    pending: 0,
    approved: 0,
    totalLikes: 0,
    totalViews: 0,
    recent: [],
    monthlyStats: [],
  });

  const [loading, setLoading] = useState(true);

  // Fetch agent stats
  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await api.get("/api/properties/my/properties");

        const properties = res.data.data.properties || [];

        const totalLikes = properties.reduce((sum, p) => sum + (p.likes || 0), 0);
        const totalViews = properties.reduce((sum, p) => sum + (p.views || 0), 0);

        const pending = properties.filter((p) => p.status === "pending").length;
        const approved = properties.filter((p) => p.status === "approved").length;

        // Take last 5 recent properties
        const recent = properties.slice(0, 5);

        // Dummy monthly stats (you can replace with backend data)
        const monthlyStats = [
          10, 20, 15, 30, 25, 40, 35, 50, 60, 55, 70, 80,
        ];

        setStats({
          totalProperties: properties.length,
          pending,
          approved,
          totalLikes,
          totalViews,
          recent,
          monthlyStats,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="h-10 w-10 border-t-2 border-b-2 border-blue-600 rounded-full animate-spin" />
      </div>
    );

  const analyticsCards = [
    {
      title: "Total Properties",
      value: stats.totalProperties,
      icon: <FaHome />,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Total Views",
      value: stats.totalViews,
      icon: <FaEye />,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Total Likes",
      value: stats.totalLikes,
      icon: <FaHeart />,
      color: "bg-pink-100 text-pink-600",
    },
    {
      title: "Pending Approvals",
      value: stats.pending,
      icon: <FaClock />,
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      title: "Approved Properties",
      value: stats.approved,
      icon: <FaCheckCircle />,
      color: "bg-purple-100 text-purple-600",
    },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Agent Dashboard</h1>

      {/* ======= Analytics Cards ======= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {analyticsCards.map((card, idx) => (
          <div
            key={idx}
            className="bg-white shadow-md rounded-xl p-5 flex flex-col items-center justify-center text-center hover:shadow-lg transition"
          >
            <div className={`p-4 rounded-full text-2xl mb-3 ${card.color}`}>
              {card.icon}
            </div>
            <p className="text-gray-500 text-sm truncate">{card.title}</p>
            <p className="text-xl font-semibold">{card.value}</p>
          </div>
        ))}
      </div>

      {/* ======= Performance Chart ======= */}
      <div className="bg-white p-6 rounded-xl shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Monthly Performance</h2>

        <Line
          data={{
            labels: [
              "Jan", "Feb", "Mar", "Apr", "May", "Jun",
              "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
            ],
            datasets: [
              {
                label: "Property Engagement",
                data: stats.monthlyStats,
                borderColor: "rgb(59 130 246)",
                borderWidth: 3,
                tension: 0.3,
                pointRadius: 4,
              },
            ],
          }}
        />
      </div>

      {/* ======= Recent Activities ======= */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">Recent Properties</h2>

        {stats.recent.length === 0 ? (
          <p className="text-gray-600">No recent properties found.</p>
        ) : (
          <div className="space-y-4">
            {stats.recent.map((p) => (
              <div
                key={p._id}
                className="flex items-center p-4 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100 transition"
              >
                <img
                  src={p.images?.[0]?.url || "/no-image.jpg"}
                  className="h-16 w-24 rounded object-cover"
                />

                <div className="ml-4 flex-1">
                  <h3 className="font-semibold text-gray-800">{p.title}</h3>
                  <p className="text-sm text-gray-600">
                    Status:
                    <span className={`${p.status === "approved" ? "text-green-600" : "text-yellow-600"}`}>
                      {" "}
                      {p.status}
                    </span>
                  </p>
                </div>

                <Link
                  to={`/agent/properties/edit/${p._id}`}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
                >
                  Edit
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentDashboard;
