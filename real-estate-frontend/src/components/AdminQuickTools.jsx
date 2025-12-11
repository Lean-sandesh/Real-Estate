import React, { useState } from 'react';
import { FiChevronDown, FiChevronUp, FiUsers, FiHome, FiSettings, FiPlusCircle, FiBarChart2 } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminQuickTools = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  if (!isAdmin()) return null;

  const tools = [
    { 
      name: 'Users', 
      icon: <FiUsers className="h-5 w-5" />, 
      action: () => navigate('/admin/users') 
    },
    { 
      name: 'Properties', 
      icon: <FiHome className="h-5 w-5" />, 
      action: () => navigate('/admin/properties') 
    },
    { 
      name: 'Add New', 
      icon: <FiPlusCircle className="h-5 w-5" />, 
      action: () => navigate('/admin/properties/new') 
    },
    { 
      name: 'Analytics', 
      icon: <FiBarChart2 className="h-5 w-5" />, 
      action: () => navigate('/admin/analytics') 
    },
    { 
      name: 'Settings', 
      icon: <FiSettings className="h-5 w-5" />, 
      action: () => navigate('/admin/settings') 
    },
  ];

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden w-64">
          <div 
            className="flex items-center justify-between p-4 bg-blue-600 text-white cursor-pointer"
            onClick={() => setIsOpen(false)}
          >
            <h3 className="font-semibold">Admin Tools</h3>
            <FiChevronDown className="h-5 w-5" />
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {tools.map((tool, index) => (
              <div 
                key={index}
                onClick={tool.action}
                className="flex items-center p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"
              >
                <span className="text-blue-600 dark:text-blue-400 mr-3">{tool.icon}</span>
                <span className="text-gray-800 dark:text-gray-200">{tool.name}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          title="Admin Tools"
        >
          <div className="flex items-center">
            <FiSettings className="h-6 w-6" />
            <FiChevronUp className="ml-1 h-4 w-4" />
          </div>
        </button>
      )}
    </div>
  );
};

export default AdminQuickTools;
