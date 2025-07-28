// src/components/Header.jsx
import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

// React Icons imports (added FaHeart for wishlist)
import { FaSearch, FaBell, FaUser, FaSignOutAlt, FaTimes, FaHeart } from "react-icons/fa";

// Context for saved courses
import { SavedCoursesContext } from '../context/SavedCoursesContext'; // Adjust path

// Mock suggestions data
const mockSuggestions = [
  "React Development",
  "JavaScript Fundamentals",
  "Python for Beginners",
  "Data Science with Python",
  "Web Development Bootcamp",
  "Machine Learning Basics",
  "UI/UX Design",
  "Node.js Backend",
  "SQL Database Design",
  "Digital Marketing"
];

const Header = () => {
  const navigate = useNavigate();
  const auth = getAuth();

  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef(null);
  const inputRef = useRef(null);

  // Profile states
  const [userInfo, setUserInfo] = useState(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [loading, setLoading] = useState(true);
  const profileRef = useRef(null);

  // Wishlist states
  const [showWishlistDropdown, setShowWishlistDropdown] = useState(false);
  const wishlistRef = useRef(null);
  const { savedCourses } = useContext(SavedCoursesContext) || { savedCourses: [] };

  // Fetch user info from Firestore on mount
  useEffect(() => {
    const fetchUserInfo = async () => {
      const user = auth.currentUser;
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUserInfo(userDoc.data());
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        const filtered = mockSuggestions.filter(suggestion =>
          suggestion.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSuggestions(filtered);
        setShowSuggestions(filtered.length > 0);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
      setSelectedIndex(-1);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Click outside for profile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Click outside for wishlist
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wishlistRef.current && !wishlistRef.current.contains(event.target)) {
        setShowWishlistDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => prev < suggestions.length - 1 ? prev + 1 : prev);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          setSearchQuery(suggestions[selectedIndex]);
          setShowSuggestions(false);
          setSelectedIndex(-1);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSuggestions([]);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigate("/login");
      })
      .catch((error) => {
        alert("Logout failed");
      });
  };

  return (
    <header className="border-b bg-white sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <img src="/logo.png" alt="logo" className="w-20" />
          <h1 className="text-xl font-bold text-gray-900">CourseXpert</h1>
        </div>
        <div className="flex-1 max-w-xl mx-8">
          <div className="relative" ref={searchRef}>
            <span className="absolute left-3 top-2 text-gray-400">
              <FaSearch />
            </span>
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => searchQuery && setSuggestions(mockSuggestions.filter(s => s.toLowerCase().includes(searchQuery.toLowerCase())))}
              placeholder="Search courses, skills, topics..."
              className="pl-10 pr-10 w-full bg-gray-50 border border-gray-300 rounded py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-2 text-gray-400 hover:text-gray-600"
              >
                <FaTimes />
              </button>
            )}
            {showSuggestions && suggestions.length > 0 && (
              <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded mt-1 shadow-lg max-h-60 overflow-auto">
                {suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className={`px-4 py-2 cursor-pointer transition-colors ${
                      index === selectedIndex ? 'bg-gray-200 text-gray-900' : 'hover:bg-gray-100 text-gray-700 hover:text-gray-900'
                    }`}
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-3 relative">
          <button className="text-gray-500 hover:text-blue-600 transition">
            <FaBell />
          </button>
          {/* Wishlist Button */}
          <div ref={wishlistRef}>
            <button
              onClick={() => setShowWishlistDropdown(!showWishlistDropdown)}
              className="text-gray-500 hover:text-red-600 transition relative"
            >
              <FaHeart className="text-xl" /> {/* Increased size for visibility */}
              {savedCourses.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5">
                  {savedCourses.length}
                </span>
              )}
            </button>
            {showWishlistDropdown && (
              <div className="absolute top-full right-0 mt-2 bg-white border border-gray-300 rounded shadow-lg p-4 w-64 z-50 max-h-60 overflow-y-auto">
                <h3 className="font-bold mb-2">Wishlist</h3>
                {savedCourses.length > 0 ? (
                  <ul className="space-y-2">
                    {savedCourses.map((id) => <li key={id}>Course {id}</li>)} {/* Customize with real data */}
                  </ul>
                ) : (
                  <p>No items in wishlist.</p>
                )}
              </div>
            )}
          </div>
          {/* Profile Button with Dropdown */}
          <button
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            className="text-gray-500 hover:text-blue-600 transition relative"
          >
            <FaUser />
          </button>
          {/* Profile Dropdown */}
          {showProfileDropdown && (
            <div className="absolute top-full right-0 mt-2 bg-white border border-gray-300 rounded shadow-lg p-4 w-64 z-50">
              {loading ? (
                <p>Loading profile...</p>
              ) : userInfo ? (
                <>
                  <h3 className="font-bold text-lg mb-2">{userInfo.fullName}</h3>
                  <p className="text-sm text-gray-600 mb-1">Email: {userInfo.email}</p>
                  <p className="text-sm text-gray-600 mb-1">DOB: {userInfo.dob}</p>
                  <p className="text-sm text-gray-600 mb-1">Gender: {userInfo.gender}</p>
                  <p className="text-sm text-gray-600 mb-1">Education: {userInfo.educationLevel}</p>
                  {userInfo.domainOfEducation && (
                    <p className="text-sm text-gray-600 mb-1">Domain: {userInfo.domainOfEducation}</p>
                  )}
                  <p className="text-sm text-gray-600 mb-1">Profession: {userInfo.profession}</p>
                  <p className="text-sm text-gray-600 mb-1">Country: {userInfo.country}</p>
                  <p className="text-sm text-gray-600 mb-1">Interests:</p>
                  <ul className="list-disc pl-4 text-sm text-gray-600">
                    {userInfo.interests.map((interest) => (
                      <li key={interest}>{interest}</li>
                    ))}
                  </ul>
                </>
              ) : (
                <p>No profile data available.</p>
              )}
            </div>
          )}
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
