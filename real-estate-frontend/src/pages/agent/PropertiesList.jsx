import React, { useEffect, useState } from "react";
import {
  FiEdit,
  FiTrash2,
  FiMapPin,
  FiDollarSign,
  FiHome,
  FiEye,
  FiHeart,
  FiFilter
} from "react-icons/fi";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../lib/axios";

const PropertiesList = () => {
  const [properties, setProperties] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const limit = 6;

  // Fetch agent properties with pagination + filter
  const loadProperties = async () => {
    try {
      const res = await api.get("/api/properties/my/properties", {
        params: {
          status: statusFilter !== "all" ? statusFilter : "",
          page,
          limit
        }
      });

      setProperties(res.data.data.properties || []);
      setStats(res.data.data.stats || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load properties");
    } finally {
      setLoading(false);
    }
  };

  // Delete property
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this property?")) return;

    try {
      await api.delete(`/api/properties/${id}`);
      setProperties((p) => p.filter((item) => item._id !== id));
      toast.success("Property deleted");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete property");
    }
  };

  useEffect(() => {
    loadProperties();
  }, [page, statusFilter]);

  // Status badge color function
  const statusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-200 text-gray-700";
    }
  };

  // Analytics summary
  const totalViews =
    stats.find((s) => s._id === "approved")?.totalViews ||
    stats.find((s) => s._id === "pending")?.totalViews ||
    0;

  const totalLikes =
    stats.find((s) => s._id === "approved")?.totalLikes ||
    stats.find((s) => s._id === "pending")?.totalLikes ||
    0;

  return (
    <div className="p-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <FiHome className="text-blue-600" /> My Properties
        </h1>

        <Link
          to="/agent/properties/add"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
        >
          + Add New Property
        </Link>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6">
        <FiFilter className="text-gray-600" />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border p-2 rounded-lg"
        >
          <option value="all">All</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-blue-50 rounded-lg shadow flex flex-col items-center">
          <FiEye className="text-blue-600 text-3xl" />
          <p className="text-gray-700">Total Views</p>
          <h2 className="text-xl font-bold">{totalViews}</h2>
        </div>

        <div className="p-4 bg-pink-50 rounded-lg shadow flex flex-col items-center">
          <FiHeart className="text-pink-600 text-3xl" />
          <p className="text-gray-700">Likes</p>
          <h2 className="text-xl font-bold">{totalLikes}</h2>
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="grid grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse bg-gray-200 h-64 rounded-xl" />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && properties.length === 0 && (
        <div className="text-center py-20 text-gray-600">
          <h2 className="text-xl font-semibold mb-2">No properties found</h2>
        </div>
      )}

      {/* Properties List */}
      {!loading && properties.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((p) => (
            <div
              key={p._id}
              className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition"
            >
              <img
                src={p.images?.[0]?.url || "/no-image.jpg"}
                alt={p.title}
                className="h-48 w-full object-cover"
              />

              <div className="p-4">
                {/* Title */}
                <h2 className="text-xl font-semibold text-gray-800 truncate">
                  {p.title}
                </h2>

                {/* Price */}
                <p className="flex items-center text-gray-700 mt-1">
                  <FiDollarSign className="mr-1 text-blue-600" />
                  ₹{p.price?.toLocaleString()}
                </p>

                {/* Location */}
                <p className="flex items-center text-gray-600">
                  <FiMapPin className="mr-1 text-red-500" />
                  {p.location?.city}, {p.location?.state}
                </p>

                {/* Status badge */}
                <span
                  className={`inline-block mt-2 px-3 py-1 text-sm rounded-full ${statusColor(
                    p.status
                  )}`}
                >
                  {p.status}
                </span>

                {/* Views & Likes */}
                <div className="flex gap-4 mt-3 text-gray-600">
                  <span className="flex items-center gap-1">
                    <FiEye /> {p.views}
                  </span>
                  <span className="flex items-center gap-1">
                    <FiHeart /> {p.likes}
                  </span>
                </div>

                {/* Buttons */}
                <div className="flex justify-between mt-4">
                  <Link
                    to={`/agent/properties/${p._id}`}
                    className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
                  >
                    View
                  </Link>

                  <Link
                    to={`/agent/properties/edit/${p._id}`}
                    className="flex items-center gap-1 px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                  >
                    <FiEdit />
                    Edit
                  </Link>

                  <button
                    onClick={() => handleDelete(p._id)}
                    className="flex items-center gap-1 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    <FiTrash2 />
                    Delete
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center mt-8 gap-4">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
        >
          Previous
        </button>

        <button
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PropertiesList;
