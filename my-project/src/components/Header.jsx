import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
// For Firebase Auth logout, import these:
import { getAuth, signOut } from "firebase/auth"; // If using Firebase
// React Icons imports
import { FaSearch, FaBell, FaUser, FaSignOutAlt, FaTimes } from "react-icons/fa";

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
  // For Firebase:
  const auth = getAuth();

  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef(null);
  const inputRef = useRef(null);

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
    // If using Firebase Auth:
    signOut(auth)
      .then(() => {
        navigate("/login");
      })
      .catch((error) => {
        // Handle error if needed
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
            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded mt-1 shadow-lg max-h-60 overflow-auto">
                {suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className={`px-4 py-2 cursor-pointer transition-colors ${
                      index === selectedIndex
                        ? 'bg-gray-200 text-gray-900'
                        : 'hover:bg-gray-100 text-gray-700 hover:text-gray-900'
                    }`}
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button className="text-gray-500 hover:text-blue-600 transition">
            <FaBell />
          </button>
          <button className="text-gray-500 hover:text-blue-600 transition">
            <FaUser />
          </button>
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
