import { useEffect } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';
import { Toaster } from 'react-hot-toast';

// Pages
import Home from './pages/Home';
import Listings from './pages/Listings';
import PropertyDetails from './pages/PropertyDetails';
import About from './pages/About';
import Contact from './pages/Contact';
import Agents from './pages/Agents';
import SubmitProperty from './pages/SubmitProperty';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/user/Dashboard';
import Favorites from './pages/user/Favorites';
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminRoute from './components/AdminRoute';
import NotFound from './pages/NotFound';
import JoinOurTeam from "./pages/JoinOurTeam";
import ContactHR from "./pages/ContactHR";
import AgentListings from "./pages/AgentListings";

const AppContent = ({ darkMode, toggleDarkMode }) => {
  const navigate = useNavigate();
  const { setNavigate } = useAuth();

  // Set up navigation reference when component mounts
  useEffect(() => {
    if (setNavigate) {
      setNavigate(navigate);
    }
  }, [navigate, setNavigate]);

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'dark' : ''}`}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={
          <MainLayout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
            <Home />
          </MainLayout>
        } />
        <Route path="/properties" element={
          <MainLayout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
            <Listings />
          </MainLayout>
        } />
        <Route path="/property/:id" element={
          <MainLayout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
            <PropertyDetails />
          </MainLayout>
        } />
        <Route path="/about" element={
          <MainLayout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
            <About />
          </MainLayout>
        } />
        <Route path="/contact" element={
          <MainLayout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
            <Contact />
          </MainLayout>
        } />
        <Route path="/agents" element={
          <MainLayout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
            <Agents />
          </MainLayout>
        } />
        <Route path="/submit-property" element={
          <MainLayout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
            <SubmitProperty />
          </MainLayout>
        } />
        
        {/* Auth Routes */}
        <Route path="/login" element={
          <MainLayout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
            <Login />
          </MainLayout>
        } />
        <Route path="/register" element={
          <MainLayout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
            <Register />
          </MainLayout>
        } />
        
        {/* Protected User Routes */}
        <Route path="/dashboard" element={
          <MainLayout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
            <Dashboard />
          </MainLayout>
        } />
        <Route path="/favorites" element={
          <MainLayout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
            <Favorites />
          </MainLayout>
        } />

        {/* Admin Routes */}
        <Route path="/admin" element={
          <AdminRoute>
            <MainLayout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
              <AdminDashboard />
            </MainLayout>
          </AdminRoute>
        } />
        <Route path="/admin/dashboard" element={
          <AdminRoute>
            <MainLayout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
              <AdminDashboard />
            </MainLayout>
          </AdminRoute>
        } />
        <Route path="/admin/users" element={
          <AdminRoute>
            <MainLayout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
              <AdminUsers />
            </MainLayout>
          </AdminRoute>
        } />
        {/* JoinOurTeam */}
        <Route path="/join-our-team" element={
          <MainLayout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
          <JoinOurTeam />
          </MainLayout>
        } />

        {/* ContactHR */}
        <Route
         path="/contact-hr"
         element={
         <MainLayout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
      <ContactHR />
    </MainLayout>
  }
/>

<Route path="/agent/:id" element={
  <MainLayout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
    <AgentListings />
  </MainLayout>
} />
        
        {/* 404 Route */}
        <Route path="*" element={
          <MainLayout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
            <NotFound />
          </MainLayout>
        } />
      </Routes>
      <Toaster position="top-right" />
    </div>
  );
};

export default AppContent;
