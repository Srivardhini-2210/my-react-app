import React, { useState } from "react";
import { createUserWithEmailAndPassword, signInWithPopup, updateProfile } from "firebase/auth";
import { auth, provider } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",     // <-- Added
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSignup = () => {
    const { username, email, password, confirmPassword } = formData;
    if (!username) {
      alert("Please enter a username");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((res) => {
        // Set the displayName to the entered username
        updateProfile(res.user, { displayName: username }).then(() => {
          alert("Account created");
          navigate("/dashboard");
        });
      })
      .catch((err) => {
        console.error(err);
        alert("Signup failed");
      });
  };

  const handleGoogleSignup = () => {
    signInWithPopup(auth, provider)
      .then((res) => {
        alert(`Welcome, ${res.user.displayName}`);
        navigate("/dashboard");
      })
      .catch((err) => {
        alert("Google Sign-in failed");
      });
  };

  return (
    <div
      className="w-screen h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: "url('/bg.jpg')" }}
    >
      <div className="w-[90%] max-w-md p-5 bg-white flex flex-col items-center gap-3 rounded-xl shadow-lg">
        <img src="/logo.png" alt="logo" className="w-20" />
        <h1 className="text-2xl font-bold">Create Account</h1>

        <p className="text-sm text-gray-600 text-center">
          Already have an account?{" "}
          <Link to="/" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>

        {/* Username Field */}
        <input
          type="text"
          placeholder="Username"
          className="w-full mb-2 p-2 rounded bg-gray-100 text-gray-900"
          onChange={(e) =>
            setFormData({ ...formData, username: e.target.value })
          }
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-2 p-2 rounded bg-gray-100 text-gray-900"
          onChange={(e) =>
            setFormData({ ...formData, email: e.target.value })
          }
        />

        <div className="relative w-full">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full mb-2 p-2 rounded bg-gray-100 text-gray-900 pr-10"
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
          <span
            className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-600 cursor-pointer"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full mb-2 p-2 rounded bg-gray-100 text-gray-900"
          onChange={(e) =>
            setFormData({ ...formData, confirmPassword: e.target.value })
          }
        />

        <button
          onClick={handleSignup}
          className="w-full p-2 bg-blue-500 text-black font-semibold rounded-xl hover:bg-blue-600 mt-1"
        >
          Create Account
        </button>

        <div className="flex items-center w-full my-3">
          <div className="flex-grow h-px bg-gray-300"></div>
          <span className="px-3 text-gray-500 text-sm">Or</span>
          <div className="flex-grow h-px bg-gray-300"></div>
        </div>

        <div
          onClick={handleGoogleSignup}
          className="p-2 bg-slate-100 border-4 border-blue-400 rounded-2xl flex justify-center items-center cursor-pointer hover:bg-slate-200"
        >
          <img src="/google.png" alt="google-icon" className="w-6 h-6 mr-3" />
          <span className="text-black font-semibold text-sm md:text-base">
            Sign up with Google
          </span>
        </div>
      </div>
    </div>
  );
};

export default Signup;
