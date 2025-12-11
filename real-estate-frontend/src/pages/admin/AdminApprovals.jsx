import React, { useEffect, useState } from "react";
import api from "../../lib/axios";
import { toast } from "react-hot-toast";

const AdminApprovals = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Load pending approvals
  const loadPending = async () => {
    try {
      const res = await api.get("/api/admin/properties/pending");
      setList(res.data.data.properties || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load pending approvals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPending();
  }, []);

  // Approve property
  const approve = async (id) => {
    try {
      setActionLoading(true);

      await api.patch(`/api/properties/${id}/status`, {
        status: "approved",
      });

      toast.success("Property Approved!");
      loadPending(); // Reload list
    } catch (err) {
      console.error(err);
      toast.error("Error approving property");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Pending Property Approvals
      </h2>

      {loading ? (
        <p className="text-center text-gray-500">
          Loading pending properties...
        </p>
      ) : list.length === 0 ? (
        <p className="text-center text-gray-500">No pending properties.</p>
      ) : (
        list.map((property) => (
          <div
            key={property._id}
            className="flex justify-between items-center p-4 border rounded-lg mb-3 hover:bg-gray-50 transition"
          >
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {property.title}
              </h3>

              <p className="text-gray-600 text-sm">
                Agent: {property.agent?.name || "Unknown"}
              </p>

              <p className="text-gray-400 text-sm">
                {property.location?.city}, {property.location?.state}
              </p>
            </div>

            <button
              disabled={actionLoading}
              onClick={() => approve(property._id)}
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg shadow"
            >
              {actionLoading ? "Processing..." : "Approve"}
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default AdminApprovals;
