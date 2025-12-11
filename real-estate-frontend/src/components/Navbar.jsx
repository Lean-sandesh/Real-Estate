import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.jpg";

import {
  FiMenu,
  FiX,
  FiUser,
  FiHeart,
  FiHome,
  FiInfo,
  FiMail,
  FiUsers,
  FiPlusCircle,
  FiSun,
  FiMoon,
  FiLogIn,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";
import { FaBuilding } from "react-icons/fa";
import PropTypes from "prop-types";
import { useAuth } from "../context/AuthContext";

const Navbar = ({ darkMode, toggleDarkMode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileProfileOpen, setIsMobileProfileOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [imageError, setImageError] = useState(false);

  const location = useLocation();
  const profileRef = useRef(null);

  const { user, logout, loading } = useAuth();

  // Debug - remove later
  useEffect(() => {
    console.log("Navbar user:", user);
  }, [user]);

  // If auth is still loading, render skeleton (instead of null to avoid blank page)
  if (loading) {
    return (
      <nav className="w-full bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="h-6 w-28 bg-gray-200 rounded" />
            <div className="h-6 w-20 bg-gray-200 rounded" />
          </div>
        </div>
      </nav>
    );
  }

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsMenuOpen(false);
    setIsMobileProfileOpen(false);
    setIsProfileOpen(false);
  }, [location]);

  // Outside click to close profile dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { name: "Home", path: "/", icon: <FiHome className="mr-1" /> },
    { name: "Properties", path: "/properties", icon: <FaBuilding className="mr-1" /> },
    { name: "Agents", path: "/agents", icon: <FiUsers className="mr-1" /> },
    { name: "About", path: "/about", icon: <FiInfo className="mr-1" /> },
    { name: "Contact", path: "/contact", icon: <FiMail className="mr-1" /> },
  ];

  // fallback initial
  const getInitial = (name) => {
    if (!name) return "U";
    return name.charAt(0).toUpperCase();
  };

  // Support multiple server-side avatar names and safe values
  const rawUserImage =
    user?.image ||
    user?.profileImage ||
    user?.avatar ||
    user?.photo ||
    user?.picture ||
    null;

  // If server sends empty string, treat as null
  const userImage = rawUserImage?.trim?.() ? rawUserImage : null;

  // Handler when <img> fails to load
  const handleImgError = (e) => {
    console.warn("Avatar image failed to load:", e?.target?.src);
    setImageError(true);
    // optionally set e.target.src = '/default-avatar.png' if you have a default img
  };

  return (
    <nav
      className={`w-full transition-all duration-300 ${
        isScrolled
          ? "bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-md"
          : "bg-white dark:bg-gray-900"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img src="" alt="Logo" className="h-8 w-auto" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              Real Estate
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex md:items-center md:space-x-1">
            {navLinks.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium flex items-center ${
                  location.pathname === item.path
                    ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30"
                    : "text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right side (Desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            
            {user ? (
              <Link
                to="/submit-property"
                className="flex items-center px-4 py-2 text-sm rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <FiPlusCircle className="mr-2" />
                Submit Property
              </Link>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 text-sm rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <FiLogIn className="inline mr-1" /> Login
              </Link>
            )}

            {/* Profile (Desktop) */}
            {user && (
              <div className="relative" ref={profileRef}>
                <div
                  onClick={() => {
                    setIsProfileOpen(!isProfileOpen);
                    setImageError(false); // reset image error on open
                  }}
                  className="flex items-center space-x-2 cursor-pointer select-none"
                >
                  {userImage && !imageError ? (
                    <img
                      src={userImage}
                      alt={user.name || "User"}
                      onError={handleImgError}
                      className="w-9 h-9 rounded-full object-cover border border-gray-300 dark:border-gray-600"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
                      {getInitial(user.name)}
                    </div>
                  )}

                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {user.name || "User"}
                  </span>
                </div>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg py-2 z-50">
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <FiUser className="mr-2" /> Profile
                    </Link>
                    <Link
                      to="/favorites"
                      className="flex items-center px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <FiHeart className="mr-2" /> Favorites
                    </Link>
                    <Link
                      to="/settings"
                      className="flex items-center px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <FiSettings className="mr-2" /> Settings
                    </Link>
                    <button
                      onClick={logout}
                      className="w-full text-left flex items-center px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <FiLogOut className="mr-2" /> Logout
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Dark Mode */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {darkMode ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}
            </button>
          </div>

          {/* Mobile Right Side */}
          <div className="md:hidden flex items-center space-x-2">

            {user && (
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {user.name}
              </span>
            )}

            {user && (
              <div
                onClick={() => setIsMobileProfileOpen(!isMobileProfileOpen)}
                className="flex items-center space-x-2 cursor-pointer"
              >
                {userImage && !imageError ? (
                  <img
                    src={userImage}
                    alt={user.name || "User"}
                    onError={handleImgError}
                    className="w-8 h-8 rounded-full object-cover border border-gray-300 dark:border-gray-600"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                    {getInitial(user.name)}
                  </div>
                )}
              </div>
            )}

            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {darkMode ? <FiSun /> : <FiMoon />}
            </button>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-blue-600"
            >
              {isMenuOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t">
          {navLinks.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="block px-4 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {item.name}
            </Link>
          ))}

          {!user && (
            <Link
              to="/login"
              className="block px-4 py-2 text-blue-600 dark:text-blue-400 font-medium"
            >
              Login
            </Link>
          )}
        </div>
      )}

      {/* Mobile Profile */}
      {isMobileProfileOpen && user && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t">
          <Link to="/profile" className="block px-4 py-2">Profile</Link>
          <Link to="/favorites" className="block px-4 py-2">Favorites</Link>
          <Link to="/settings" className="block px-4 py-2">Settings</Link>
          <button onClick={logout} className="block w-full text-left px-4 py-2">
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

Navbar.propTypes = {
  darkMode: PropTypes.bool.isRequired,
  toggleDarkMode: PropTypes.func.isRequired,
};

export default Navbar;
