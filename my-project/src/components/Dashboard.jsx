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
import CourseFilters from "./CourseFilters";
//import "./App.css"; // Your custom CSS (buttons) if any

const PLATFORMS = [
  { name: "NPTEL" },
  { name: "Coursera" },
  { name: "Udemy" },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [allCourses, setAllCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [savedCourses, setSavedCourses] = useState([]);
  const [compareList, setCompareList] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    platforms: [],
    levels: [],
    priceRanges: [],
    durations: [],
    ratings: [],
    formats: [],
  });

  useEffect(() => {
    fetch("/all_courses.json")
      .then(res => res.json())
      .then(data => {
        const courses = data.map((course, idx) => ({
          id: course.id || idx.toString(),
          rating: course.rating || 0,
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

  const onPlatformClick = (platform) => {
    if (platform === "NPTEL") {
      navigate("/courses/nptel");
      return;
    }
    if (platform === "Coursera") {
      navigate("/courses/coursera");
      return;
    }
    if (selectedPlatform === platform) {
      setSelectedPlatform(null);
      setFilteredCourses(allCourses);
    } else {
      setSelectedPlatform(platform);
      setFilteredCourses(allCourses.filter(c => c.platform === platform));
    }
    setSearchQuery("");
  };

  const applyFilters = (courses, filters, query) => {
    return courses.filter(course => {
      if (filters.platforms.length && !filters.platforms.includes(course.platform)) return false;
      if (filters.levels.length && !filters.levels.includes(course.level)) return false;
      if (filters.priceRanges.length) {
        let matches = false;
        for (const pr of filters.priceRanges) {
          if (pr === "Free" && course.price === "Free") matches = true;
          else if (pr === "<$20") {
            const price = parseFloat(course.price.replace('$', '')) || 0;
            if (price < 20) matches = true;
          } else if (pr === "$20-$50") {
            const price = parseFloat(course.price.replace('$', '')) || 0;
            if (price >= 20 && price <= 50) matches = true;
          } else if (pr === "$50-$100") {
            const price = parseFloat(course.price.replace('$', '')) || 0;
            if (price > 50 && price <= 100) matches = true;
          } else if (pr === "$100+") {
            const price = parseFloat(course.price.replace('$', '')) || 0;
            if (price > 100) matches = true;
          }
        }
        if (!matches) return false;
      }
      if (filters.durations.length) {
        let matches = false;
        const durationHours = parseInt(course.duration) || 0;
        for (const dr of filters.durations) {
          if (dr === "< 5 hours" && durationHours < 5) matches = true;
          else if (dr === "5-15 hours" && durationHours >= 5 && durationHours <= 15) matches = true;
          else if (dr === "15-30 hours" && durationHours > 15 && durationHours <= 30) matches = true;
          else if (dr === "30+ hours" && durationHours > 30) matches = true;
        }
        if (!matches) return false;
      }
      if (filters.ratings.length) {
        let matches = false;
        for (const rt of filters.ratings) {
          if (rt === "4+ stars" && course.rating >= 4) matches = true;
          else if (rt === "3+ stars" && course.rating >= 3) matches = true;
          else if (rt === "2+ stars" && course.rating >= 2) matches = true;
        }
        if (!matches) return false;
      }
      if (query) {
        const q = query.toLowerCase();
        if (!(
          course.title?.toLowerCase().includes(q) ||
          (course.instructor && course.instructor.toLowerCase().includes(q)) ||
          (course.tags && course.tags.some(tag => tag.toLowerCase().includes(q))) ||
          (course.platform && course.platform.toLowerCase().includes(q))
        )) {
          return false;
        }
      }
      return true;
    });
  };

  const onSearchChange = (query) => {
    setSearchQuery(query);
    const filtered = applyFilters(allCourses, activeFilters, query);
    setFilteredCourses(filtered);
  };

  const onFilterChange = (filters) => {
    setActiveFilters(filters);
    const filtered = applyFilters(allCourses, filters, searchQuery);
    setFilteredCourses(filtered);
  };

  const clearFilters = () => {
    const emptyFilters = {
      platforms: [],
      levels: [],
      priceRanges: [],
      durations: [],
      ratings: [],
      formats: []
    };
    setActiveFilters(emptyFilters);
    setFilteredCourses(applyFilters(allCourses, emptyFilters, searchQuery));
  };

  const toggleSave = (id) => {
    setSavedCourses(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const toggleCompare = (id) => {
    setCompareList(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id);
      if (prev.length < 3) return [...prev, id];
      return [prev[1], prev[2], id];
    });
  };

  const handleCompareClick = () => {
    if (compareList.length) {
      alert(`Comparing courses: ${compareList.join(", ")}`);
    }
  };

  return (
    <div className="min-h-screen px-6 py-8 bg-gradient-to-br from-purple-500 via-purple-300 to-fuchsia-200">
      {/* Header */}
      <div className="max-w-screen-xl mx-auto text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Discover Your Skill</h1>
        <p className="text-gray-700">Find and compare courses from top platforms</p>
      </div>

      {/* Centered Search Bar */}
      <div className="max-w-screen-xl mx-auto flex flex-col items-center justify-center mb-6">
        <div className="w-full sm:w-2/3 md:w-1/2 max-w-xl">
          <CourseSearch
            courses={allCourses}
            onSearchResults={onSearchChange}
            onSearchQuery={setSearchQuery}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row gap-4 md:items-center justify-center mb-10">
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => setShowFilter(true)}
            className={`filter-btn${showFilter ? " active" : ""}`}
          >
            <Filter size={20} />
            <span>Filter</span>
          </button>
          <button
            onClick={handleCompareClick}
            disabled={compareList.length === 0}
            className={`compare-btn${compareList.length ? "" : " disabled"}`}
          >
            <ArrowUpDown size={20} />
            Compare
            {compareList.length > 0 && (
              <span style={{
                backgroundColor: "#fbcfe8", color: "#831843",
                padding: "0.125rem 0.5rem", borderRadius: "9999px", fontSize: "0.75rem", marginLeft: "0.5rem"
              }}>
                {compareList.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Filter modal */}
      {showFilter && (
        <CourseFilters
          filters={activeFilters}
          onFiltersChange={onFilterChange}
          onClearFilters={clearFilters}
          isVisible={showFilter}
          onClose={() => setShowFilter(false)}
        />
      )}

      {/* Header */}
      <div className="max-w-screen-xl mx-auto text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Top platforms Available..</h1>
        
      </div>

      {/* Platform Cards */}
      <div className="max-w-screen-xl mx-auto flex flex-wrap justify-center gap-8 mb-12">
        {PLATFORMS.map(plat => (
          <button
            key={plat.name}
            onClick={() => onPlatformClick(plat.name)}
            className={`cursor-pointer rounded-xl w-44 p-6 flex flex-col items-center text-white font-bold shadow-xl transition-transform duration-300 ${
              plat.name === "NPTEL"
                ? "bg-gradient-to-br from-indigo-600 to-indigo-400"
                : plat.name === "Coursera"
                ? "bg-gradient-to-br from-pink-600 to-rose-400"
                : plat.name === "Udemy"
                ? "bg-gradient-to-br from-emerald-500 to-lime-400"
                : "bg-gradient-to-br from-gray-200 to-gray-100 text-gray-800"
            } ${
              selectedPlatform === plat.name ? "scale-105 ring-4 ring-indigo-400" : ""
            }`}
          >
            {plat.name === "NPTEL" && (
              <img
                src="/nptel.png"
                alt="NPTEL logo"
                className="h-15 w-auto mb-2 bg-opacity-80 p-1"
              />
            )}
            {plat.name === "Coursera" && (
              <img
                src="/coursera.png"
                alt="Coursera logo"
                className="h-15 w-auto mb-2 bg-opacity-80 p-1"
              />
            )}
            {plat.name === "Udemy" && (
              <img
                src="/udemy.png"
                alt="Udemy logo"
                className="h-15 w-auto mb-2 bg-opacity-80 p-1"
              />
            )}
            <h3 className="text-2xl">{plat.name}</h3>
            <p className="mt-2 text-sm font-light">Click to view {plat.name} courses</p>
          </button>
        ))}
        {selectedPlatform && (
          <button onClick={() => {
            setSelectedPlatform(null);
            setFilteredCourses(allCourses);
            setSearchQuery('');
          }} className="self-center px-5 py-3 rounded bg-gray-200 hover:bg-gray-300 text-gray-800">
            Show All
          </button>
        )}
      </div>

      {/* Selected for comparison */}
      {compareList.length > 0 && (
        <div className="max-w-screen-xl mx-auto bg-sky-100 rounded shadow-md p-4 mb-10">
          <h4 className="font-semibold text-blue-700 mb-2">Selected for Comparison ({compareList.length} of 3)</h4>
          <div className="flex flex-wrap gap-3">
            {compareList.map(id => {
              const course = filteredCourses.find(c => c.id === id);
              return (
                <span key={id} className="bg-blue-200 text-blue-900 rounded px-3 py-1 flex items-center gap-2 text-sm">
                  {course?.title || "Course"}
                  <button onClick={() => toggleCompare(id)} aria-label={`Remove ${course?.title || "Course"} from comparison`} className="text-red-600 font-bold hover:text-red-800">×</button>
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
        ) : filteredCourses.map(course => (
          <div
            key={course.id}
            className={`
              rounded-lg shadow-lg flex flex-col h-full text-white
              ${
                course.platform === "NPTEL"
                  ? "bg-gradient-to-br from-indigo-600 to-indigo-400"
                  : course.platform === "Coursera"
                  ? "bg-gradient-to-br from-pink-600 to-rose-400"
                  : course.platform === "Udemy"
                  ? "bg-gradient-to-br from-emerald-500 to-lime-400"
                  : "bg-gradient-to-br from-gray-200 to-gray-100 text-gray-800"
              }
            `}
          >
            <div className="p-6 flex flex-col gap-3 flex-grow">
              <div className="flex items-center gap-3">
                {course.platform === "Coursera" && (
                  <img src="/coursera.png" alt="Coursera logo" className="h-8 w-auto rounded" />
                )}
                {course.platform === "NPTEL" && (
                  <img src="/nptel.png" alt="NPTEL logo" className="h-8 w-auto rounded" />
                )}
                {course.platform === "Udemy" && (
                  <img src="/udemy.png" alt="Udemy logo" className="h-8 w-auto rounded" />
                )}
                <span className="text-xs font-bold px-3 py-1 rounded-full shadow bg-black bg-opacity-20">
                  {course.platform}
                </span>
              </div>
              <p>{course.instructor}</p>
              <p className="mt-auto flex gap-3 text-sm">
                <span className="flex items-center gap-1"><Clock size={14} />{course.duration}</span>
                <span className="flex items-center gap-1"><Star size={14} />{course.rating}</span>
                <span className="flex items-center gap-1"><Users size={14} />{course.students}</span>
                <span className="flex items-center gap-1"><DollarSign size={14} />{course.price}</span>
              </p>
              <p>Start: {course.start_date}</p>
            </div>
            <div className="border-t border-white/20 p-4 flex items-center justify-between bg-white/10 rounded-b-lg">
              <button
                onClick={() => toggleCompare(course.id)}
                disabled={!compareList.includes(course.id) && compareList.length >= 3}
                className={`px-3 py-1 border rounded text-xs flex items-center gap-2 backdrop-blur-md transition-colors
                  ${compareList.includes(course.id) ? "border-green-400 text-green-400" : "border-gray-200 text-gray-200"}
                  ${compareList.length >= 3 && !compareList.includes(course.id) ? "opacity-60 cursor-not-allowed" : "hover:bg-white/50"}`}
              >
                <input type="checkbox" className="accent-green-400" checked={compareList.includes(course.id)} onChange={() => toggleCompare(course.id)} disabled={compareList.length >= 3 && !compareList.includes(course.id)} />
                Compare
              </button>
              <button onClick={() => toggleSave(course.id)} aria-label="Toggle favorite" className={`transition-colors ${savedCourses.includes(course.id) ? "text-red-500" : "text-white/80"}`}>
                <Heart size={24} fill={savedCourses.includes(course.id) ? "#ef4444" : "none"} />
              </button>
              <a href={course.link} target="_blank" rel="noopener noreferrer" className="text-white underline font-semibold">
                Go to Course
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
