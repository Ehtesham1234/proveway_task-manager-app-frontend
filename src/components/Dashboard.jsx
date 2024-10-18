import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Dashboard = () => {
  const { logout } = useAuth();
  const location = useLocation();
  const userName = localStorage.getItem("username");
  return (
    <div className="flex h-screen bg-gray-100">
      <nav className="w-64 bg-white shadow-md">
        <div className="p-4">
          <h2 className="text-2xl font-semibold text-gray-800">{userName}</h2>
        </div>
        <ul className="mt-4">
          <li>
            <Link
              to="/"
              className={`block py-2 px-4 ${
                location.pathname === "/"
                  ? "bg-indigo-500 text-white"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              Tasks
            </Link>
          </li>
          <li>
            <Link
              to="/categories"
              className={`block py-2 px-4 ${
                location.pathname === "/categories"
                  ? "bg-indigo-500 text-white"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              Categories
            </Link>
          </li>
          <li>
            <Link
              to="/calendar"
              className={`block py-2 px-4 ${
                location.pathname === "/calendar"
                  ? "bg-indigo-500 text-white"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              Calendar
            </Link>
          </li>
        </ul>
        <div className="mt-auto p-4">
          <button
            onClick={logout}
            className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </nav>
      <main className="flex-1 p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;
