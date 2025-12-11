import React, { useEffect, useState } from "react";
import api from "../../lib/axios";
import { toast } from "react-hot-toast";

const AdminProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const loadProperties = async () => {
    try {
      const res = await api.get("/api/admin/properties"); // ADMIN ROUTE
      setProperties(res.data.data.properties || []);
    } catch (err) {
      console.error(err);
      toast.error("Unable to load properties");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProperties();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      setActionLoading(true);

      await api.patch(`/api/properties/${id}/status`, { status });

      toast.success(`Property ${status}!`);
      loadProperties();
    } catch (err) {
      console.error(err);
      toast.error("Action failed");
    } finally {
      setActionLoading(false);
    }
  };

  const deleteProperty = async (id) => {
    if (!confirm("Are you sure you want to delete this property?")) return;

    try {
      setActionLoading(true);

      await api.delete(`/api/properties/${id}`);

      toast.success("Property deleted");
      loadProperties();
    } catch (err) {
      toast.error("Delete failed");
    } finally {
      setActionLoading(false);
    }
  };

  const statusColor = {
    approved: "text-green-700 bg-green-100",
    pending: "text-yellow-700 bg-yellow-100",
    rejected: "text-red-700 bg-red-100",
    "under-construction": "bg-blue-100 text-blue-700",
    sold: "bg-purple-100 text-purple-700",
    expired: "bg-gray-300 text-gray-700",
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        All Properties
      </h2>

      {loading ? (
        <p className="text-center text-gray-500">Loading properties...</p>
      ) : properties.length === 0 ? (
        <p className="text-center text-gray-500">No properties found.</p>
      ) : (
        <table className="w-full border rounded-xl overflow-hidden">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3 border">Title</th>
              <th className="p-3 border">Agent</th>
              <th className="p-3 border">Price</th>
              <th className="p-3 border">Status</th>
              <th className="p-3 border text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {properties.map((p) => (
              <tr key={p._id} className="hover:bg-gray-50 transition">
                <td className="p-3 border font-medium">{p.title}</td>
                <td className="p-3 border">{p.agent?.name || "N/A"}</td>
                <td className="p-3 border text-gray-700 font-semibold">
                  ₹{p.price}
                </td>
                <td className="p-3 border">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      statusColor[p.status] || "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {p.status}
                  </span>
                </td>

                {/* ACTION BUTTONS */}
                <td className="p-3 border text-center space-x-2">
                  {p.status === "pending" && (
                    <>
                      <button
                        disabled={actionLoading}
                        onClick={() => updateStatus(p._id, "approved")}
                        className="px-3 py-1 bg-green-600 text-white rounded"
                      >
                        Approve
                      </button>

                      <button
                        disabled={actionLoading}
                        onClick={() => updateStatus(p._id, "rejected")}
                        className="px-3 py-1 bg-red-600 text-white rounded"
                      >
                        Reject
                      </button>
                    </>
                  )}

                  <button
                    disabled={actionLoading}
                    onClick={() => deleteProperty(p._id)}
                    className="px-3 py-1 bg-gray-800 text-white rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminProperties;
