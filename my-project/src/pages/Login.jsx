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
      className="w-screen h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: "url('/bg.jpg')" }}
    >
      <div className="w-[90%] max-w-md p-6 bg-white text-base rounded-xl shadow-lg flex flex-col items-center gap-4">
        <img src="/logo.png" alt="logo" className="w-20" />
        <h1 className="text-2xl font-bold">Welcome Back</h1>

        <p className="text-sm text-gray-700 text-center">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-blue-500 hover:underline">
            Sign up
          </Link>
        </p>

        <input
          type="email"
          placeholder="Email address"
          className="w-full p-2 rounded-xl bg-gray-100 placeholder-gray-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="relative w-full">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full p-2 pr-10 rounded-xl bg-gray-100 placeholder-gray-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <button
          onClick={handleLogin}
          className="w-full bg-blue-500 py-2 rounded-xl text-black hover:bg-blue-600"
        >
          Login
        </button>

        <div className="flex items-center w-full my-3">
          <div className="flex-grow h-px bg-gray-300"></div>
          <span className="px-3 text-gray-500 text-sm">Or</span>
          <div className="flex-grow h-px bg-gray-300"></div>
        </div>

        <div
          onClick={handleGoogleLogin}
          className="p-2 bg-slate-100 border-2 border-blue-400 rounded-2xl flex justify-center items-center cursor-pointer hover:bg-slate-200 w-full"
        >
          <img src="/google.png" alt="google-icon" className="w-6 h-6 mr-3" />
          <span className="text-black font-semibold">Login with Google</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
