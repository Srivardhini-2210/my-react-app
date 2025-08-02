import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Clock,
  Star,
  Users,
  DollarSign,
  Heart,
  Filter,
  ArrowUpDown,
} from "lucide-react";
import CourseSearch from "./CourseSearch";

const PLATFORMS = [
  { name: "NPTEL", from: "from-indigo-600", to: "to-indigo-400", badge: "bg-indigo-700" },
  { name: "Coursera", from: "from-pink-600", to: "to-rose-400", badge: "bg-rose-600" },
  { name: "LinkedIn Learning", from: "from-emerald-500", to: "to-lime-400", badge: "bg-emerald-600" },
];

function getCardBg(platform) {
  const p = PLATFORMS.find(x => x.name === platform);
  return p ? `bg-gradient-to-br ${p.from} ${p.to}` : "bg-gradient-to-br from-gray-200 to-gray-100";
}

function getBadgeBg(platform) {
  const p = PLATFORMS.find(x => x.name === platform);
  return p ? p.badge : "bg-gray-300";
}

const Dashboard = () => {
  const navigate = useNavigate();

  const [allCourses, setAllCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [savedCourses, setSavedCourses] = useState([]);
  const [compareList, setCompareList] = useState([]);
  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => {
    fetch("/all_courses.json")
      .then(res => res.json())
      .then(data => {
        const courses = data.map((course, idx) => ({
          id: course.id || idx.toString(),
          rating: course.rating || "N/A",
          students: course.students || "N/A",
          price: course.price || "Free",
          tags: course.tags || [course.platform],
          ...course,
        }));
        setAllCourses(courses);
        setFilteredCourses(courses);
      })
      .catch(() => {
        setAllCourses([]);
        setFilteredCourses([]);
      });
  }, []);

  // Platform card click handler with navigation for NPTEL and Coursera
  const onPlatformClick = (platform) => {
    if (platform === "NPTEL") {
      navigate("/courses/nptel");  // Redirect to NPTEL courses page
      return;
    }
    if (platform === "Coursera") {
      navigate("/courses/coursera");  // Redirect to Coursera courses page
      return;
    }
    // For other platforms, filter inline
    if (selectedPlatform === platform) {
      setSelectedPlatform(null);
      setFilteredCourses(allCourses);
    } else {
      setSelectedPlatform(platform);
      setFilteredCourses(allCourses.filter(c => c.platform === platform));
    }
    setSearchQuery("");
  };

  // Search bar handler for input changes
  const onSearchChange = (query) => {
    setSearchQuery(query);
    let baseCourses = selectedPlatform ? allCourses.filter(c => c.platform === selectedPlatform) : allCourses;
    if (query.trim()) {
      const q = query.toLowerCase();
      baseCourses = baseCourses.filter(
        c =>
          c.title.toLowerCase().includes(q) ||
          (c.instructor && c.instructor.toLowerCase().includes(q)) ||
          (c.tags && c.tags.some(tag => tag.toLowerCase().includes(q))) ||
          (c.platform && c.platform.toLowerCase().includes(q))
      );
    }
    setFilteredCourses(baseCourses);
  };

  // For when CourseSearch provides filtered list
  const onSearchResults = (results) => setFilteredCourses(results);

  // Toggle like/save for individual course
  const toggleSave = (id) => {
    setSavedCourses(prev =>
      prev.includes(id) ? prev.filter(cid => cid !== id) : [...prev, id]
    );
  };

  // Toggle select/deselect course for compare (max 3)
  const toggleCompare = (id) => {
    setCompareList(prev => {
      if (prev.includes(id)) return prev.filter(cid => cid !== id);
      if (prev.length < 3) return [...prev, id];
      return [prev[1], prev[2], id]; // rotate oldest out
    });
  };

  // Compare button click handler (show alert placeholder)
  const handleCompareClick = () => {
    if (compareList.length > 0) {
      alert(`Comparing courses:\n${compareList.join(", ")}`);
      // Extend: navigate to compare page or show modal
    }
  };

  // Filter button toggle (UI placeholder for filters)
  const toggleFilter = () => setShowFilter(prev => !prev);

  // Clear platform selection to show all courses
  const clearPlatformFilter = () => {
    setSelectedPlatform(null);
    setFilteredCourses(allCourses);
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 to-white px-6 py-8">
      {/* Header */}
      <div className="max-w-screen-xl mx-auto text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Discover Your Skill</h1>
        <p className="text-gray-700">Find and compare courses from top platforms</p>
      </div>

      {/* Top controls */}
      <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row gap-4 md:items-center justify-between mb-10">
        <div className="flex-grow md:max-w-xl">
          <CourseSearch
            courses={selectedPlatform ? allCourses.filter(c => c.platform === selectedPlatform) : allCourses}
            onSearchResults={onSearchResults}
            onSearchQuery={onSearchChange}
          />
        </div>

        <div className="flex gap-4">
          <button
            onClick={toggleFilter}
            className={`flex items-center gap-2 px-5 py-2 border border-gray-400 rounded hover:bg-gray-100 cursor-pointer ${showFilter ? "bg-gray-200" : "bg-white"}`}
          >
            <Filter size={20} />
            Filter
          </button>

          <button
            onClick={handleCompareClick}
            disabled={compareList.length === 0}
            className={`flex items-center gap-2 px-5 py-2 rounded cursor-pointer transition-colors
              ${compareList.length > 0 ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-300 text-gray-600 cursor-not-allowed"}
            `}
          >
            <ArrowUpDown size={20} />
            Compare
            {compareList.length > 0 && (
              <span className="ml-2 bg-blue-300 text-blue-900 font-bold text-xs rounded-full px-2 py-0.5 select-none">
                {compareList.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Platform Cards */}
      <div className="max-w-screen-xl mx-auto flex flex-wrap justify-center gap-8 mb-12">
        {PLATFORMS.map(plat => (
          <button
            key={plat.name}
            onClick={() => onPlatformClick(plat.name)}
            className={`cursor-pointer rounded-xl w-44 p-6 flex flex-col items-center text-white font-bold shadow-xl transition-transform duration-300 ${
              selectedPlatform === plat.name ? "scale-105 ring-4 ring-indigo-400" : ""
            } ${plat.from} ${plat.to} bg-gradient-to-br focus:outline-none`}
          >
            <h3 className="text-2xl">{plat.name}</h3>
            <p className="mt-2 text-sm font-light">Click to view {plat.name} courses</p>
          </button>
        ))}
        {selectedPlatform && (
          <button
            onClick={clearPlatformFilter}
            className="self-center px-5 py-3 rounded bg-gray-200 hover:bg-gray-300 text-gray-800"
          >
            Show All
          </button>
        )}
      </div>

      {/* Selected for Comparison */}
      {compareList.length > 0 && (
        <div className="max-w-screen-xl mx-auto bg-sky-100 rounded shadow-md p-4 mb-10">
          <h4 className="font-semibold text-blue-700 mb-2">
            Selected for Comparison ({compareList.length} of 3)
          </h4>
          <div className="flex flex-wrap gap-3">
            {compareList.map(id => {
              const course = filteredCourses.find(c => c.id === id);
              return (
                <span key={id} className="bg-blue-200 text-blue-900 rounded px-3 py-1 flex items-center gap-2 text-sm">
                  {course?.title || "Course"}
                  <button
                    onClick={() => toggleCompare(id)}
                    aria-label={`Remove ${course?.title || "Course"} from comparison`}
                    className="text-red-600 font-bold hover:text-red-800"
                  >
                    &times;
                  </button>
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Courses Grid */}
      <div className="max-w-screen-xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCourses.length === 0 ? (
          <p className="text-center text-gray-500 py-16">No courses found.</p>
        ) : (
          filteredCourses.map(course => (
            <div key={course.id} className={`${getCardBg(course.platform)} rounded-lg shadow-lg flex flex-col h-full`}>
              <div className="p-6 flex flex-col gap-3 flex-grow text-white">
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full shadow ${getBadgeBg(course.platform)}`}>
                    {course.platform}
                  </span>
                  <h2 className="text-2xl font-semibold drop-shadow">{course.title}</h2>
                </div>
                <p>{course.instructor}</p>
                <p className="mt-auto">
                  <Clock className="inline mr-1" size={16} />
                  {course.duration}
                </p>
                <p>Start: {course.start_date}</p>
                <p className="flex gap-4 mt-2 text-sm">
                  <span className="flex items-center gap-1">
                    <Star className="text-yellow-400" size={16} />
                    {course.rating}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="text-sky-300" size={16} />
                    {course.students}
                  </span>
                  <span className="flex items-center gap-1">
                    <DollarSign className="text-green-400" size={16} />
                    {course.price}
                  </span>
                </p>
              </div>
              <div className="border-t border-white/20 p-4 flex items-center justify-between bg-white/10 rounded-b-lg">
                <button
                  onClick={() => toggleCompare(course.id)}
                  disabled={!compareList.includes(course.id) && compareList.length >= 3}
                  className={`px-3 py-1 border rounded text-xs flex items-center gap-2
                    bg-white/30 backdrop-blur-md transition-colors 
                    ${compareList.includes(course.id) ? "border-green-400 text-green-400" : "border-gray-200 text-gray-200"}
                    ${compareList.length >= 3 && !compareList.includes(course.id) ? "opacity-60 cursor-not-allowed" : "hover:bg-white/50"}
                  `}
                >
                  <input
                    type="checkbox"
                    checked={compareList.includes(course.id)}
                    onChange={() => toggleCompare(course.id)}
                    className="cursor-pointer accent-blue-600"
                    disabled={compareList.length >= 3 && !compareList.includes(course.id)}
                  />
                  Compare
                </button>
                <button
                  onClick={() => toggleSave(course.id)}
                  aria-label="Toggle like (favorite)"
                  className={`text-lg transition-colors ${savedCourses.includes(course.id) ? "text-red-500" : "text-white/70"}`}
                >
                  <Heart size={24} fill={savedCourses.includes(course.id) ? "#ef4444" : "none"} />
                </button>
                <a
                  href={course.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white underline font-semibold hover:text-indigo-300"
                >
                  Go to Course
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
