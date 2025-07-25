//Login.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import {
  auth,
  provider,
  signInWithPopup,
  signInWithEmailAndPassword,
} from "../firebase";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

   const handleSubmit = (e) => {
    e.preventDefault();
    // Authenticate user here (ex: API call)
    // If authentication is successful:
    navigate("/dashboard");
  };


  const handleLogin = () => {
    if (!email || !password) {
      alert("Please fill out both fields.");
      return;
    }

    signInWithEmailAndPassword(auth, email, password)
      .then((res) => {
        alert(`Welcome back, ${res.user.email}`);
        navigate("/dashboard");
      })
      .catch(() => {
        alert("Login failed.");
      });
  };

  const handleGoogleLogin = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        alert(`Welcome ${result.user.displayName || result.user.email}`);
        navigate("/dashboard");
      })
      .catch(() => {
        alert("Google login failed.");
      });
  };

  return (
    <div
      className="fixed inset-0 bg-cover bg-center flex items-center justify-center px-4"
      style={{ backgroundImage: "url('/bg.jpg')" }}
    >
      <div className="w-[90%] max-w-md p-6 rounded-2xl shadow-[0_0_20px_#1e3a8a] flex flex-col items-center gap-4 backdrop-blur-sm bg-[#0b1c36] bg-opacity-95 border border-blue-700">
        <img src="/logo.png" alt="logo" className="w-20" />
        <h1 className="text-2xl font-bold text-white">Login</h1>

        <p className="text-sm text-blue-200 text-center">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-blue-400 hover:underline font-semibold">
            Sign up
          </Link>
        </p>

        <input
          type="email"
          placeholder="Email address"
          className="w-full p-3 rounded-xl bg-[#1a2a45] text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 hover:shadow-[0_0_12px_#2563eb]"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="relative w-full">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full p-3 pr-10 rounded-xl bg-[#1a2a45] text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 hover:shadow-[0_0_12px_#2563eb]"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 cursor-pointer"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 py-2 rounded-xl text-black font-bold transition duration-300 hover:bg-blue-700 hover:shadow-[0_0_15px_#3b82f6]"
        >
          Login
        </button>

        <div className="flex items-center w-full my-3">
          <div className="flex-grow h-px bg-blue-300"></div>
          <span className="px-3 text-blue-200 text-sm">Or</span>
          <div className="flex-grow h-px bg-blue-300"></div>
        </div>

        <div
          onClick={handleGoogleLogin}
          className="p-2 bg-white border-2 border-blue-600 rounded-2xl flex justify-center items-center cursor-pointer hover:bg-gray-100 w-full transition duration-300 hover:shadow-[0_0_12px_#3b82f6]"
        >
          <img src="/google.png" alt="google-icon" className="w-6 h-6 mr-3" />
          <span className="text-black font-semibold">Login with Google</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
