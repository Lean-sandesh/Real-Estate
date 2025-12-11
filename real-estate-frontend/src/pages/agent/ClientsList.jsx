import React, { useEffect, useState } from "react";
import axios from "../../lib/axios";
import { FiUsers, FiMail, FiPhone, FiSearch } from "react-icons/fi";

const ClientsList = () => {
  const [clients, setClients] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchClients = async () => {
    try {
      const res = await axios.get("/agent/clients");
      setClients(res.data.clients);
      setFiltered(res.data.clients);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // Search filter
  useEffect(() => {
    const result = clients.filter((c) =>
      c.name.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(result);
  }, [search, clients]);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-blue-600 flex items-center gap-2">
          <FiUsers /> My Clients
        </h2>
      </div>

      {/* Search Bar */}
      <div className="mb-5">
        <div className="flex items-center gap-2 border rounded-lg p-3 bg-white shadow-sm max-w-md">
          <FiSearch className="text-gray-500 text-xl" />
          <input
            type="text"
            placeholder="Search clients by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full outline-none"
          />
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-10 text-gray-500">
          <div className="animate-spin h-8 w-8 border-4 border-blue-400 border-t-transparent rounded-full mx-auto mb-3"></div>
          Loading clients...
        </div>
      )}

      {/* Empty State */}
      {!loading && filtered.length === 0 && (
        <div className="bg-white p-10 rounded-lg shadow text-center text-gray-600">
          <FiUsers className="text-5xl mx-auto mb-3 text-gray-300" />
          No clients found.
        </div>
      )}

      {/* Table */}
      {!loading && filtered.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full bg-white shadow rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-blue-50 text-blue-700">
                <th className="p-4 text-left font-semibold">Name</th>
                <th className="p-4 text-left font-semibold">Email</th>
                <th className="p-4 text-left font-semibold">Phone</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((c) => (
                <tr
                  key={c._id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="p-4 flex items-center gap-2">
                    <span className="font-medium">{c.name}</span>
                  </td>
                  <td className="p-4 flex items-center gap-2">
                    <FiMail className="text-gray-500" />
                    {c.email}
                  </td>
                  <td className="p-4 flex items-center gap-2">
                    <FiPhone className="text-green-600" />
                    {c.phone}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ClientsList;
