import React, { useState } from "react";
import { mockCourses } from "../data/mock";
import { Search } from "lucide-react"; // optional icon

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim() === "") {
      setSuggestions([]);
      return;
    }

    // Filter courses by title or provider
    const filtered = mockCourses.filter(
      (course) =>
        course.title.toLowerCase().includes(value.toLowerCase()) ||
        course.provider.toLowerCase().includes(value.toLowerCase())
    );

    setSuggestions(filtered);
  };

  const handleSuggestionClick = (course) => {
    setQuery(course.title);
    setSuggestions([]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim() === "") return;
    console.log("Searching for:", query);
    // 👉 You can redirect or trigger search results page here
    setSuggestions([]); 
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 mb-8 relative">
      {/* Search Form */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
      >
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="Search courses, topics, or providers..."
          className="flex-grow px-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none"
        />
        <button
          type="submit"
          className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-black flex items-center justify-center"
        >
          <Search className="w-5 h-5 mr-1" />
          Search
        </button>
      </form>

      {/* Suggestions Dropdown */}
      {suggestions.length > 0 && (
        <ul className="absolute w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto z-10">
          {suggestions.map((course) => (
            <li
              key={course.id}
              onClick={() => handleSuggestionClick(course)}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex justify-between"
            >
              <span className="font-medium">{course.title}</span>
              <span className="text-sm text-gray-500">{course.provider}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
