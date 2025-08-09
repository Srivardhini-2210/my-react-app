import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

import {
  FaBell,
  FaUser,
  FaSignOutAlt,
  FaHeart,
  FaEnvelope,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaGraduationCap,
  FaBriefcase,
  FaUser as FaUserIcon,
} from "react-icons/fa";

import { SavedCoursesContext } from '../context/SavedCoursesContext'; // Adjust path

// Mock wishlist data (keep or replace with dynamic)
const mockWishlist = [
  { id: 1, title: "React Development", instructor: "John Doe", price: "$99" },
  { id: 2, title: "Machine Learning Basics", instructor: "Jane Smith", price: "$149" },
  { id: 3, title: "UI/UX Design", instructor: "Mike Johnson", price: "$79" }
];

const Header = () => {
  const navigate = useNavigate();
  const auth = getAuth();

  // Profile states
  const [userInfo, setUserInfo] = useState(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [loading, setLoading] = useState(true);
  const profileRef = useRef(null);

  // Wishlist states
  const [showWishlistDropdown, setShowWishlistDropdown] = useState(false);
  const wishlistRef = useRef(null);
  const { savedCourses } = useContext(SavedCoursesContext) || { savedCourses: [] };

  // Fetch user info
  useEffect(() => {
    const fetchUserInfo = async () => {
      const user = auth.currentUser;
      if (!user) {
        setUserInfo(null);
        setLoading(false);
        return;
      }
      try {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUserInfo(userDoc.data());
        } else {
          setUserInfo({ fullName: user.email || 'User' }); // Basic fallback
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
        setUserInfo(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUserInfo();
  }, [auth]);

  // Click outside handlers
  useEffect(() => {
    const handleClickOutsideProfile = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };
    const handleClickOutsideWishlist = (event) => {
      if (wishlistRef.current && !wishlistRef.current.contains(event.target)) {
        setShowWishlistDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutsideProfile);
    document.addEventListener('mousedown', handleClickOutsideWishlist);
    return () => {
      document.removeEventListener('mousedown', handleClickOutsideProfile);
      document.removeEventListener('mousedown', handleClickOutsideWishlist);
    };
  }, []);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigate("/");
      })
      .catch(() => {
        alert("Logout failed");
      });
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow shadow-gray-200 border-b">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {/* Reduced height and width for logo */}
          <img src="/logo.png" alt="Logo" className="h-10 w-10 object-contain" />
          <h1 className="text-lg font-bold text-gray-900">CourseXpert</h1>
        </div>

        {/* Right side icons and dropdowns */}
        <div className="flex items-center space-x-3 relative">
          <button className="text-gray-500 hover:text-blue-600 transition">
            <FaBell />
          </button>

          {/* Wishlist Dropdown */}
          <div ref={wishlistRef} className="relative">
            <button
              onClick={() => setShowWishlistDropdown(!showWishlistDropdown)}
              className="text-gray-500 hover:text-red-600 transition relative"
              aria-haspopup="true"
              aria-expanded={showWishlistDropdown}
            >
              <FaHeart className="text-xl" />
              {mockWishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                  {mockWishlist.length}
                </span>
              )}
            </button>
            {showWishlistDropdown && (
              <div className="absolute top-full right-0 mt-2 bg-white border border-gray-300 rounded shadow-lg p-4 w-80 z-50 max-h-80 overflow-y-auto">
                <h3 className="font-bold mb-2">Wishlist ({mockWishlist.length})</h3>
                {mockWishlist.length > 0 ? (
                  mockWishlist.map((item) => (
                    <div key={item.id} className="flex flex-col items-start p-4 border-b">
                      <div className="flex justify-between w-full">
                        <div>
                          <h4 className="text-sm font-medium">{item.title}</h4>
                          <p className="text-xs text-gray-500">{item.instructor}</p>
                        </div>
                        <span className="text-sm font-semibold text-blue-500">{item.price}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500">No items in wishlist</p>
                )}
                {mockWishlist.length > 0 && (
                  <button className="w-full text-center text-blue-500 mt-2">View All Wishlist</button>
                )}
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div ref={profileRef} className="relative">
            <button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="text-gray-500 hover:text-blue-600 transition relative"
              aria-haspopup="true"
              aria-expanded={showProfileDropdown}
            >
              <FaUser />
            </button>
            {showProfileDropdown && (
              <div className="absolute top-full right-0 mt-2 bg-white border border-gray-300 rounded shadow-lg p-4 w-80 z-50 max-h-80 overflow-y-auto">
                {loading ? (
                  <p className="text-center">Loading...</p>
                ) : userInfo ? (
                  <div className="p-4">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="h-12 w-12 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold text-lg">
                        <FaUserIcon className="text-2xl" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{userInfo.fullName || 'User'}</h3>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <FaEnvelope className="text-xs" />
                          {userInfo.email}
                        </p>
                      </div>
                    </div>
                    {/* Additional user info */}
                    <div className="space-y-3 mb-4 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500 flex items-center gap-2">
                          <FaCalendarAlt className="text-base" />
                          Birth Date
                        </span>
                        <span>{userInfo.dob ? new Date(userInfo.dob).toLocaleDateString() : "N/A"}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500 flex items-center gap-2">
                          <FaMapMarkerAlt className="text-base" />
                          Location
                        </span>
                        <span>{userInfo.country || "N/A"}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500 flex items-center gap-2">
                          <FaGraduationCap className="text-base" />
                          Education
                        </span>
                        <span>{userInfo.educationLevel || "N/A"}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500 flex items-center gap-2">
                          <FaBriefcase className="text-base" />
                          Profession
                        </span>
                        <span>{userInfo.profession || "N/A"}</span>
                      </div>
                    </div>
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Interests</h4>
                      <div className="flex flex-wrap gap-1">
                        {userInfo.interests && userInfo.interests.length > 0 ? (
                          userInfo.interests.map((interest, idx) => (
                            <span key={idx} className="px-2 py-1 bg-gray-200 text-gray-800 rounded-md text-xs">
                              {interest}
                            </span>
                          ))
                        ) : (
                          <p className="text-sm text-gray-500">No interests added.</p>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-center text-gray-500">No profile data available.</p>
                )}
                <button className="w-full text-center text-blue-500 border-t border-gray-300 py-2">View Full Profile</button>
              </div>
            )}
          </div>

          <button
            onClick={handleLogout}
            className="bg-red-500 text-black px-3 py-1 rounded hover:bg-red-700 transition flex items-center"
          >
            <FaSignOutAlt className="mr-1" /> Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
