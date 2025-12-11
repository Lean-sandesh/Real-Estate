import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-gray-800 text-white min-h-screen p-4">
          <h2 className="text-2xl font-bold mb-8">Admin Panel</h2>
          <nav className="space-y-2">
            <Link 
              to="/admin/dashboard" 
              className="block px-4 py-2 rounded hover:bg-gray-700"
            >
              Dashboard
            </Link>
            <Link 
              to="/admin/properties" 
              className="block px-4 py-2 rounded hover:bg-gray-700"
            >
              Properties
            </Link>
            <Link 
              to="/admin/users" 
              className="block px-4 py-2 rounded hover:bg-gray-700"
            >
              Users
            </Link>
            <Link 
              to="/admin/settings" 
              className="block px-4 py-2 rounded hover:bg-gray-700"
            >
              Settings
            </Link>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-gray-500 text-sm font-medium">Total Properties</h3>
                <p className="text-3xl font-bold">0</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-gray-500 text-sm font-medium">Active Users</h3>
                <p className="text-3xl font-bold">0</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-gray-500 text-sm font-medium">Total Bookings</h3>
                <p className="text-3xl font-bold">0</p>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
              <div className="space-y-4">
                <p className="text-gray-600">No recent activity to display.</p>
                {/* Add recent activity items here */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
