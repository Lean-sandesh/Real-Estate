import React from 'react';
import PropTypes from 'prop-types';

// Components
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AdminQuickTools from '../components/AdminQuickTools';

const MainLayout = ({ children, darkMode, toggleDarkMode }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm">
        <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      </header>
      
      <main className="flex-grow">
        {children}
      </main>
      
      <footer className="bg-gray-900 text-white dark:bg-gray-800">
        <Footer />
      </footer>
      
      {/* Admin Quick Tools */}
      <AdminQuickTools />
    </div>
  );
};

MainLayout.propTypes = {
  children: PropTypes.node.isRequired,
  darkMode: PropTypes.bool.isRequired,
  toggleDarkMode: PropTypes.func.isRequired,
};

export default MainLayout;
