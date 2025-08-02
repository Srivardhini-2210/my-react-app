import React, { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";

/**
 * CourseSearch React component for searching and filtering courses.
 * @param {Array} courses - List of course objects to search/filter.
 * @param {Function} onSearchResults - Callback with filtered courses.
 * @param {Function} onSearchQuery - Callback with current search query.
 */
const CourseSearch = ({ courses, onSearchResults, onSearchQuery }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const searchRef = useRef(null);
  const inputRef = useRef(null);

  // Generate search suggestions
  const generateSuggestions = (query) => {
    // Always include all course titles regardless of platform
    const allCourseTitles = courses.map((course) => course.title);

    // Use a Set to store unique suggestions
    const allSuggestions = new Set(allCourseTitles);

    if (!query.trim()) {
      // No input query: show all course titles up to 8
      return Array.from(allSuggestions).slice(0, 8);
    }

    const queryLower = query.toLowerCase();

    courses.forEach((course) => {
      if (course.title.toLowerCase().includes(queryLower)) {
        allSuggestions.add(course.title);
      }

      (course.tags || []).forEach((tag) => {
        if (tag.toLowerCase().includes(queryLower)) {
          allSuggestions.add(tag);
        }
      });

      if (course.platform && course.platform.toLowerCase().includes(queryLower)) {
        allSuggestions.add(course.platform);
      }

      if (course.level && course.level.toLowerCase().includes(queryLower)) {
        allSuggestions.add(course.level);
      }

      const descriptionWords = (course.description || "").toLowerCase().split(/\s+/);
      descriptionWords.forEach((word) => {
        if (word.length > 3 && word.includes(queryLower)) {
          allSuggestions.add(word);
        }
      });
    });

    return Array.from(allSuggestions).slice(0, 8);
  };

  // Filter courses based on input query
  const filterCourses = (query) => {
    if (!query.trim()) return courses;

    const queryLower = query.toLowerCase();

    return courses.filter((course) => {
      return (
        course.title.toLowerCase().includes(queryLower) ||
        (course.description && course.description.toLowerCase().includes(queryLower)) ||
        (course.platform && course.platform.toLowerCase().includes(queryLower)) ||
        (course.level && course.level.toLowerCase().includes(queryLower)) ||
        (course.tags && course.tags.some((tag) => tag.toLowerCase().includes(queryLower)))
      );
    });
  };

  // Handle input changes
  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setSelectedSuggestionIndex(-1);

    // Generate suggestions
    const newSuggestions = generateSuggestions(value);
    setSuggestions(newSuggestions);
    setShowSuggestions(newSuggestions.length > 0);

    // Filter and forward results
    const filtered = filterCourses(value);
    onSearchResults(filtered);
    onSearchQuery(value);
  };

  // Handle selecting a suggestion
  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
    const filtered = filterCourses(suggestion);
    onSearchResults(filtered);
    onSearchQuery(suggestion);
    if (inputRef.current) inputRef.current.focus();
  };

  // Keyboard nav within suggestion list
  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedSuggestionIndex((prev) => (prev === suggestions.length - 1 ? 0 : prev + 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedSuggestionIndex((prev) => (prev <= 0 ? suggestions.length - 1 : prev - 1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedSuggestionIndex >= 0) {
          handleSuggestionClick(suggestions[selectedSuggestionIndex]);
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
        break;
      default:
        break;
    }
  };

  // Clear search box
  const handleClearSearch = () => {
    setSearchTerm("");
    setSuggestions(courses.map(course => course.title).slice(0, 8));
    setShowSuggestions(true);
    setSelectedSuggestionIndex(-1);
    onSearchResults(courses);
    onSearchQuery("");
    if (inputRef.current) inputRef.current.focus();
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Show all courses as suggestions on focus when input is empty
  const handleFocus = () => {
    if (!searchTerm.trim()) {
      const allTitles = courses.map(course => course.title).slice(0, 8);
      setSuggestions(allTitles);
      setShowSuggestions(allTitles.length > 0);
    } else if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  return (
    <div ref={searchRef} className="relative max-w-2xl mx-auto mb-8 w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          className="w-full pl-10 pr-12 h-12 border border-gray-300 rounded text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Search courses, topics, platforms, or levels..."
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
        />
        {searchTerm && (
          <button
            type="button"
            onClick={handleClearSearch}
            className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center h-8 w-8 bg-transparent text-gray-400 hover:text-gray-600 focus:outline-none"
            tabIndex={-1}
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-64 overflow-y-auto rounded border border-gray-300 bg-white shadow-lg">
          <div className="p-2">
            <div className="mb-2 px-2 text-xs text-gray-400">Suggestions</div>
            {suggestions.map((suggestion, index) => (
              <button
                type="button"
                key={suggestion}
                onClick={() => handleSuggestionClick(suggestion)}
                className={`w-full rounded-sm px-2 py-2 text-left text-sm focus:outline-none focus:bg-gray-200 hover:bg-gray-100 ${
                  selectedSuggestionIndex === index ? "bg-gray-200 text-gray-900" : ""
                }`}
              >
                <div className="flex items-center gap-2">
                  <Search className="h-3 w-3 text-gray-400" />
                  {suggestion}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {searchTerm && (
        <div className="mt-2">
          <span className="mr-2 text-sm text-gray-500">
            Found {filterCourses(searchTerm).length} course{filterCourses(searchTerm).length !== 1 ? "s" : ""}
          </span>
          <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-700">
            "{searchTerm}"
          </span>
        </div>
      )}
    </div>
  );
};

export default CourseSearch;
