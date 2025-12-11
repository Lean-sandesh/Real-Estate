import React, { useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";

import {
  FaBars,
  FaTimes,
  FaHome,
  FaClipboardCheck,
  FaUserTie,
  FaChartLine,
  FaPlusCircle,
  FaSignOutAlt,
  FaBell,
} from "react-icons/fa";

export default function AgentLayout() {
  const [open, setOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  // Auto page title (agent/dashboard → Dashboard)
  const pageTitle =
    location.pathname
      .split("/")
      .pop()
      .replace("-", " ")
      .replace(/\b\w/g, (c) => c.toUpperCase()) || "Dashboard";

  const menu = [
    { name: "Dashboard", icon: <FaHome />, link: "/agent/dashboard" },
    { name: "My Properties", icon: <FaHome />, link: "/agent/properties" },
    { name: "Add Property", icon: <FaPlusCircle />, link: "/agent/properties/add" },
    { name: "Pending Approvals", icon: <FaClipboardCheck />, link: "/agent/pending" },
    { name: "Clients", icon: <FaUserTie />, link: "/agent/clients" },
    { name: "Revenue", icon: <FaChartLine />, link: "/agent/revenue" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed h-full top-0 left-0 bg-white shadow-xl border-r
          transition-all duration-300 z-50
          ${open ? "w-64" : "w-20"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h1
            className={`text-xl font-bold text-green-600 transition-all ${
              open ? "opacity-100" : "opacity-0 hidden"
            }`}
          >
            Agent Panel
          </h1>

          <button
            onClick={() =>
              window.innerWidth < 768
                ? setMobileOpen(false)
                : setOpen(!open)
            }
            className="text-gray-600 hover:scale-110 transition"
          >
            {open ? <FaTimes size={22} /> : <FaBars size={22} />}
          </button>
        </div>

        {/* Sidebar Menu */}
        <nav className="mt-4">
          <ul className="space-y-2 px-2">
            {menu.map((item, idx) => (
              <NavLink
                key={idx}
                to={item.link}
                className={({ isActive }) =>
                  `
                    group relative flex items-center gap-4 p-3 rounded-lg transition-all
                    ${
                      isActive
                        ? "bg-gradient-to-r from-green-600 to-green-500 text-white shadow-md border-l-4 border-white"
                        : "text-gray-700 hover:bg-gray-200 hover:border-l-4 hover:border-green-500"
                    }
                  `
                }
              >
                <span className="text-lg transition-transform group-hover:scale-110">
                  {item.icon}
                </span>

                {open && (
                  <span className="font-medium tracking-wide">
                    {item.name}
                  </span>
                )}

                {/* tooltip when sidebar collapsed */}
                {!open && (
                  <span className="absolute left-20 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition z-50 shadow-lg">
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
            className="flex items-center gap-4 w-full bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 hover:scale-105 transition shadow-lg"
          >
            <FaSignOutAlt size={18} />
            {open && "Logout"}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main
        className={`
          flex-1 transition-all duration-300
          ${open ? "md:ml-64" : "md:ml-20"}
          ml-0
        `}
      >
        {/* TOP NAVBAR */}
        <header className="w-full bg-white shadow-md p-4 flex justify-between items-center sticky top-0 z-40 backdrop-blur-md">
          
          {/* Mobile menu button */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setMobileOpen(true)}
          >
            <FaBars size={22} />
          </button>

          <h2 className="text-xl md:text-2xl font-bold text-gray-700 capitalize">
            {pageTitle}
          </h2>

          {/* Notifications + Avatar */}
          <div className="flex items-center gap-6">
            <button className="relative hover:scale-110 transition">
              <FaBell size={22} className="text-gray-600" />
              <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
                4
              </span>
            </button>

            <img
              src="/agent-avatar.jpg"
              alt="Agent"
              className="w-10 h-10 rounded-full border shadow-md hover:scale-105 transition"
            />
          </div>
        </header>

        {/* PAGE CONTENT */}
        <section className="p-6">
          <Outlet />
        </section>
      </main>

    </div>
  );
}
