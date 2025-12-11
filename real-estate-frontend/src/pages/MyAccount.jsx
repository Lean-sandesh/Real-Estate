import React from 'react';

const MyAccount = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">My Account</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold">Profile Information</h2>
              <p className="text-gray-600">Manage your account details and preferences.</p>
            </div>
            {/* Add account management components here */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAccount;
