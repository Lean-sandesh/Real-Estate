import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { Link } from "react-router-dom"; 
import {
  FaBars,
  FaTimes,
  FaHome,
  FaUsers,
  FaCog,
  FaChartLine,
  FaPlusCircle,
  FaClipboardCheck,
  FaSignOutAlt,
  FaBuilding,
  FaBell,
  FaSearch,
} from "react-icons/fa";

export default function AdminLayout() {
  const [open, setOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  const menu = [
    { name: "Dashboard", icon: <FaHome />, link: "/admin/dashboard" },
    { name: "Users", icon: <FaUsers />, link: "/admin/users" },
    { name: "Add User", icon: <FaPlusCircle />, link: "/admin/users/new" },
    { name: "Properties", icon: <FaBuilding />, link: "/admin/properties" },
    { name: "Add Property", icon: <FaPlusCircle />, link: "/admin/properties/new" },
    { name: "Approvals", icon: <FaClipboardCheck />, link: "/admin/properties/pending" },
    { name: "Revenue", icon: <FaChartLine />, link: "/admin/revenue" },
    { name: "Reports", icon: <FaChartLine />, link: "/admin/reports" },
    { name: "Settings", icon: <FaCog />, link: "/admin/settings" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* ------------- MOBILE SIDEBAR OVERLAY ------------- */}
      <div
        onClick={() => setMobileOpen(false)}
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-20 transition-opacity ${mobileOpen ? "opacity-100 visible" : "opacity-0 invisible"
          } md:hidden`}
      ></div>

      {/* ---------------- SIDEBAR ---------------- */}
      <aside
        className={`
          bg-white shadow-xl fixed h-full top-0 left-0 transition-all duration-300 z-30
          ${open ? "w-64" : "w-20"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h1
            className={`text-xl font-bold text-blue-600 transition-all duration-200 ${open ? "opacity-100" : "opacity-0 hidden"
              }`}
          >
            Admin Panel
          </h1>

          <button
            onClick={() => (window.innerWidth < 768 ? setMobileOpen(false) : setOpen(!open))}
            className="text-gray-600"
          >
            {open ? <FaTimes size={22} /> : <FaBars size={22} />}
          </button>
        </div>

        {/* MENU LIST */}
        <nav className="mt-4">
          <ul className="space-y-2 px-2">
            {menu.map((item, idx) => (
              <NavLink
                key={idx}
                to={item.link}
                className={({ isActive }) =>
                  `
                    group relative flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-all
                    ${isActive ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-200"}
                  `
                }
              >
                {/* Icon */}
                <span className="text-lg">{item.icon}</span>

                {/* Name */}
                {open && <span className="font-medium">{item.name}</span>}

                {/* Tooltip for collapsed sidebar */}
                {!open && (
                  <span className="absolute left-20 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition z-50">
                    {item.name}
                  </span>
                )}
              </NavLink>
            ))}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-6 w-full px-4">
          <button
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/login";
            }}
            className="flex items-center gap-4 w-full bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 transition"
          >
            <FaSignOutAlt size={18} />
            {open && "Logout"}
          </button>
        </div>
      </aside>

      {/* ---------------- MAIN CONTENT ---------------- */}
      <main
        className="flex-1 transition-all duration-300"
        style={{
          marginLeft: open ? "256px" : "80px",
        }}
      >
        {/* ---------------- TOP NAVBAR ---------------- */}
        <header className="w-full bg-white shadow-md p-4 flex justify-between items-center sticky top-0 z-20">

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setMobileOpen(true)}
          >
            <FaBars size={22} />
          </button>

          <h2 className="text-2xl font-bold text-gray-700 hidden md:block">
            RealEstate Admin
          </h2>

          {/* Search + Notifications */}
          <div className="flex items-center gap-4">

            {/* Search Box */}
            <div className="hidden md:flex bg-gray-100 rounded-lg px-3 py-2 items-center gap-2">
              <FaSearch className="text-gray-500" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent outline-none"
              />
            </div>
            {/* ✅ Home Button beside Search */}
            <Link
              to="/"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
            >
              <FaHome />
              <span>Home</span>
            </Link>


            {/* Notification Bell */}
            <button className="relative">
              <FaBell size={22} className="text-gray-600" />
              <span className="absolute -top-2 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
                3
              </span>
            </button>

            {/* Admin Avatar */}
            <img
              src="/admin-avatar.png"
              alt="Admin"
              className="w-10 h-10 rounded-full border shadow"
            />
          </div>
        </header>

        {/* ---------------- PAGE CONTENT ---------------- */}
        <section className="p-6">
          <Outlet />
        </section>
      </main>
    </div>
  );
}
