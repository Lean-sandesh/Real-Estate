import React, { useEffect, useState } from "react";
import api from "../../lib/axios";
import { toast } from "react-hot-toast";

const AdminRevenue = () => {
  const [revenue, setRevenue] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadRevenue = async () => {
    try {
      const res = await api.get("/api/admin/dashboard/stats");

      // ✅ Correct revenue path
      const revenueData = res.data.data.stats.revenue;

      setRevenue(revenueData);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load revenue stats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRevenue();
  }, []);

  if (loading)
    return <p className="p-6 text-center text-gray-500">Loading revenue...</p>;

  if (!revenue)
    return (
      <p className="p-6 text-center text-red-500">
        Revenue data not available.
      </p>
    );

  return (
    <div className="p-6 bg-white rounded-xl shadow">
      <h2 className="text-3xl font-bold mb-6 text-blue-600">💰 Revenue Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Total Revenue */}
        <div className="p-6 rounded-lg shadow-sm bg-blue-50 border">
          <h3 className="text-blue-700 font-semibold">Total Revenue</h3>
          <p className="text-3xl font-bold mt-2">₹{revenue.totalRevenue}</p>
        </div>

        {/* Total Sales */}
        <div className="p-6 rounded-lg shadow-sm bg-green-50 border">
          <h3 className="text-green-700 font-semibold">Total Sales</h3>
          <p className="text-3xl font-bold mt-2">{revenue.totalSales}</p>
        </div>

        {/* Total Rentals */}
        <div className="p-6 rounded-lg shadow-sm bg-yellow-50 border">
          <h3 className="text-yellow-700 font-semibold">Total Rentals</h3>
          <p className="text-3xl font-bold mt-2">{revenue.totalRentals}</p>
        </div>

      </div>
    </div>
  );
};

export default AdminRevenue;
