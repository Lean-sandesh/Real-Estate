import React from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiHeart, FiBell, FiSettings, FiLogOut } from 'react-icons/fi';

const Dashboard = () => {
  // Mock data - in a real app, this would come from your API/state
  const user = {
    name: 'John Doe',
    email: 'john@example.com',
    memberSince: 'January 2023',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
  };

  const stats = [
    { name: 'Properties Listed', value: 5, icon: FiHome },
    { name: 'Favorites', value: 12, icon: FiHeart },
    { name: 'Notifications', value: 3, icon: FiBell },
  ];

  const recentActivities = [
    { id: 1, type: 'view', property: 'Luxury Villa in Mumbai', time: '2 hours ago' },
    { id: 2, type: 'saved', property: 'Modern Apartment in Bangalore', time: '1 day ago' },
    { id: 3, type: 'message', property: 'Beach House in Goa', time: '3 days ago' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        {/* Profile Header */}
        <div className="px-6 py-8 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center">
              <img
                className="h-20 w-20 rounded-full border-4 border-white border-opacity-50"
                src={user.avatar}
                alt={user.name}
              />
              <div className="ml-6">
                <h1 className="text-2xl font-bold">{user.name}</h1>
                <p className="text-blue-100">{user.email}</p>
                <p className="text-sm text-blue-100 mt-1">Member since {user.memberSince}</p>
              </div>
            </div>
            <div className="mt-4 md:mt-0">
              <button className="px-4 py-2 bg-white text-blue-700 rounded-md font-medium hover:bg-blue-50 transition-colors">
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-gray-50 dark:bg-gray-700 px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat) => (
              <div key={stat.name} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.name}</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stat.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Recent Activity</h2>
              <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                  {recentActivities.map((activity) => (
                    <li key={activity.id}>
                      <Link to="#" className="block hover:bg-gray-50 dark:hover:bg-gray-700">
                        <div className="px-4 py-4 sm:px-6">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-blue-600 dark:text-blue-400 truncate">
                              {activity.property}
                            </p>
                            <div className="ml-2 flex-shrink-0 flex">
                              <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                {activity.type === 'view' ? 'Viewed' : activity.type === 'saved' ? 'Saved' : 'New Message'}
                              </p>
                            </div>
                          </div>
                          <div className="mt-2 sm:flex sm:justify-between">
                            <div className="sm:flex">
                              <p className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                {activity.time}
                              </p>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Your Listings</h2>
                <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
                  <div className="px-4 py-5 sm:p-6 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No properties listed</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Get started by creating a new property listing.
                    </p>
                    <div className="mt-6">
                      <Link
                        to="/submit-property"
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <FiHome className="-ml-1 mr-2 h-5 w-5" />
                        New Property
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Quick Actions</h3>
                </div>
                <div className="px-4 py-5 sm:p-6">
                  <ul className="space-y-3">
                    <li>
                      <Link
                        to="/submit-property"
                        className="group flex items-center px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-md bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 group-hover:bg-blue-200 dark:group-hover:bg-blue-800">
                          <FiHome className="h-5 w-5" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Add New Property</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">List a new property for sale or rent</p>
                        </div>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/favorites"
                        className="group flex items-center px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-md bg-pink-100 dark:bg-pink-900 text-pink-600 dark:text-pink-300 group-hover:bg-pink-200 dark:group-hover:bg-pink-800">
                          <FiHeart className="h-5 w-5" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">View Favorites</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Your saved properties</p>
                        </div>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/profile/settings"
                        className="group flex items-center px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-md bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 group-hover:bg-green-200 dark:group-hover:bg-green-800">
                          <FiSettings className="h-5 w-5" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Account Settings</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Update your profile and preferences</p>
                        </div>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Account Security</h3>
                </div>
                <div className="px-4 py-5 sm:p-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Email Verification</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Your email is verified</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Password</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Last changed 3 months ago</p>
                    </div>
                    <div>
                      <button
                        type="button"
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Change Password
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
