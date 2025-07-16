// src/pages/Dashboard.jsx
import React from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="w-screen h-screen bg-gray-900 text-white flex flex-col">
      {/* Navbar */}
      <nav className="bg-gray-800 p-4 flex justify-between items-center shadow-md">
        <h1 className="text-xl font-bold">My Dashboard</h1>
        <div className="space-x-4">
          <Link
            to="/"
            className="text-white hover:text-blue-400 transition duration-200"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="text-white hover:text-blue-400 transition duration-200"
          >
            Signup
          </Link>
        </div>
      </nav>

      {/* Main content fills remaining space */}
      <div className="flex-1 flex items-center justify-center">
        <h2 className="text-3xl font-semibold">Welcome to your Dashboard!</h2>
      </div>
    </div>
  );
};

export default Dashboard;
