import { FiBell, FiMoon, FiSun, FiTrash } from "react-icons/fi";

export default function Settings() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold mb-8 text-gray-800 dark:text-white">Settings</h1>

      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 space-y-10">
        
        {/* Account Settings */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Account Settings</h2>
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
            <p className="text-gray-700 dark:text-gray-300 mb-4">Manage your account:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-400">
              <li>Change Password</li>
              <li>Update Email</li>
              <li>Notification Preferences</li>
            </ul>
          </div>
        </section>

        
         {/* Language */}
        <section className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Language</h3>
            <p className="text-gray-500 text-sm">Select your preferred language</p>
          </div>
          <select className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>English</option>
            <option>Hindi</option>
            <option>Marathi</option>
          </select>
        </section>

        {/* Privacy */}
        <section className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Privacy Settings</h3>
            <p className="text-gray-500 text-sm">Control who sees your activity</p>
          </div>
          <button className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition">
            Manage
          </button>
        </section>

       

        {/* Delete Account */}
        <section className="pt-6 border-t border-gray-200 dark:border-gray-700">
          <button className="flex items-center gap-2 text-red-600 hover:text-red-700 text-sm font-medium transition">
            <FiTrash className="text-base" />
            Delete my account
          </button>
        </section>
      </div>
    </div>
  );
}