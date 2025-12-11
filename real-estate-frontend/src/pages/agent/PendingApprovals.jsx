import React, { useEffect, useState } from "react";
import api from "../../lib/axios";
import { FiMapPin, FiClock } from "react-icons/fi";

const PendingApprovals = () => {
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPending = async () => {
    try {
      const res = await api.get("/api/properties/my/properties", {
        params: { status: "pending" }
      });

      setPending(res.data.data.properties || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        Pending Property Approvals
      </h2>

      {loading && <p className="text-gray-600">Loading pending properties...</p>}

      {!loading && pending.length === 0 && (
        <p className="text-gray-600">No pending approvals.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pending.map((p) => (
          <div key={p._id} className="bg-white shadow rounded-xl overflow-hidden">
            {/* Image */}
            <img
              src={p.images?.[0]?.url || "/no-image.jpg"}
              alt={p.title}
              className="h-48 w-full object-cover"
            />

            <div className="p-4">
              {/* Title */}
              <h3 className="text-xl font-semibold text-gray-800 truncate">
                {p.title}
              </h3>

              {/* Location */}
              <p className="flex items-center text-gray-600 mt-1">
                <FiMapPin className="mr-1 text-red-500" />
                {p.location?.city}, {p.location?.state}
              </p>

              {/* Status */}
              <span className="mt-3 inline-block bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">
                <FiClock className="inline mr-1" />
                Awaiting Approval
              </span>

              {/* Price */}
              <p className="text-gray-700 mt-3 font-semibold">
                ₹{p.price?.toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PendingApprovals;
