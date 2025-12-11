import React, { useEffect, useState } from "react";
import axios from "../../lib/axios.js";

const RevenuePage = () => {
  const [revenue, setRevenue] = useState([]);

  const fetchRevenue = async () => {
    try {
      const res = await axios.get("/agent/revenue");
      setRevenue(res.data.revenue);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchRevenue();
  }, []);

  const total = revenue.reduce((acc, item) => acc + item.amount, 0);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Revenue Report</h2>

      <p className="text-xl font-semibold mb-4">
        Total Revenue: ₹{total.toLocaleString()}
      </p>

      <div className="bg-white shadow rounded p-4">
        {revenue.map((r) => (
          <div key={r._id} className="border-b py-3">
            <p className="font-semibold">{r.clientName}</p>
            <p className="text-gray-600">Amount: ₹{r.amount}</p>
            <p className="text-gray-400 text-sm">{r.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RevenuePage;
