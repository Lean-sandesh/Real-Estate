import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Context
import { AuthProvider } from './context/AuthContext';

// Components
import AppContent from './AppContent';
import ScrollToTop from './components/ScrollToTop';

// Pages
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import Favorites from './pages/Favorites';
import Listings from './pages/Listings';
import AdminDashboard from "./pages/admin/Dashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminAddUser from "./pages/admin/AdminAddUser";
import AdminProperties from "./pages/admin/AdminProperties";
import AdminApprovals from "./pages/admin/AdminApprovals";
import AdminRevenue from "./pages/admin/AdminRevenue";
import AdminReports from "./pages/admin/AdminReports";
import AdminSettings from "./pages/admin/AdminSettings";
import ProtectedRoute from "./components/ProtectedRoute";
import AgentDashboard from './pages/agent/AgentDashboard';
import PropertiesList from './pages/agent/PropertiesList';
import AddProperty from './pages/agent/AddProperty';
import ClientsList from './pages/agent/ClientsList';
import PendingApprovals from './pages/agent/PendingApprovals';
import RevenuePage from './pages/agent/RevenuePage';
import AdminAddProperty from './pages/admin/AdminAddProperty';
import PropertyDetails from './components/PropertyDetails';
import AdminLayout from './pages/admin/AdminLayout';
import AgentLayout from './pages/agent/AgentLayout';
import AgentReport from './pages/agent/AgentReport';
import { FavoritesProvider } from './context/FavoritesContext';


function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', newMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <Router>
      <ScrollToTop />
      <AuthProvider>
        <FavoritesProvider>
        <Routes>
          <Route
            path="/*"
            element={<AppContent darkMode={darkMode} toggleDarkMode={toggleDarkMode} />}
          />

          <Route path="/profile" element={<Profile />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/listings" element={<Listings />} />
          {/* ---------------- Admin Routes ---------------- */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="users/new" element={<AdminAddUser />} />
            <Route path="properties" element={<AdminProperties />} />
            <Route path="properties/new" element={<AdminAddProperty />} />
            <Route path="properties/pending" element={<AdminApprovals />} />
            <Route path="revenue" element={<AdminRevenue />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>


          <Route
            path="/agent"
            element={
              <ProtectedRoute role="agent">
                <AgentLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<AgentDashboard />} />
            <Route path="properties" element={<PropertiesList />} />
            <Route path="properties/add" element={<AddProperty />} />
            <Route path="clients" element={<ClientsList />} />
            <Route path="pending" element={<PendingApprovals />} />
            <Route path="revenue" element={<RevenuePage />} />
            <Route path="reports" element={<AgentReport />} />
          </Route>
          <Route path="/Properties/:id" element={<PropertyDetails />} />
        </Routes>
        </FavoritesProvider>
      </AuthProvider>
      <Toaster />
    </Router>
  );
}

export default App;