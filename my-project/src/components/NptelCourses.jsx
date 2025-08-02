import React, { useState, useEffect } from "react";
import {
  Clock, Star, Users, DollarSign, Heart,
} from "lucide-react";
import CourseSearch from "./CourseSearch"; // Adjust path if needed

const NptelCourses = () => {
  const [allCourses, setAllCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [savedCourses, setSavedCourses] = useState([]);
  const [compareList, setCompareList] = useState([]);

  useEffect(() => {
    fetch("/nptel_courses.json")
      .then((res) => res.json())
      .then((data) => {
        // Only NPTEL courses
        const nptel = data
          .filter(course => course.platform === "NPTEL")
          .map((course, idx) => ({
            id: course.id || idx.toString(),
            rating: course.rating || 4.5,
            students: course.students || "40k",
            price: course.price || "Free",
            tags: course.tags || ["NPTEL"],
            ...course,
          }));
        setAllCourses(nptel);
        setFilteredCourses(nptel);
      });
  }, []);

  const handleSearchResults = (results) => setFilteredCourses(results);
  const handleSearchQuery = (q) => setSearchQuery(q);

  const toggleSaveCourse = (id) => {
    setSavedCourses((prev) =>
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
    );
  };
  const toggleCompare = (id) => {
    setCompareList((prev) =>
      prev.includes(id)
        ? prev.filter((cid) => cid !== id)
        : prev.length < 3
        ? [...prev, id]
        : [prev[1], prev[2], id]
    );
  };

  const handleCompareClick = () => {
    if (compareList.length > 0) {
      alert("Comparing courses: " + compareList.join(", "));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white px-6 py-8">
      <div className="max-w-screen-xl mx-auto text-center mb-8">
        <h1 className="text-3xl font-bold text-indigo-900 mb-2">NPTEL Courses</h1>
        <p className="text-indigo-600 mb-6">Explore and search NPTEL courses below</p>
        <div className="max-w-2xl mx-auto">
          <CourseSearch
            courses={allCourses}
            onSearchResults={handleSearchResults}
            onSearchQuery={handleSearchQuery}
          />
        </div>
      </div>

      {/* Compare Button */}
      <div className="max-w-screen-xl mx-auto flex justify-end mb-6">
        <button
          disabled={compareList.length === 0}
          onClick={handleCompareClick}
          className={`px-4 py-2 rounded ${
            compareList.length > 0
              ? "bg-indigo-600 text-white hover:bg-indigo-700"
              : "bg-gray-300 text-gray-600 cursor-not-allowed"
          }`}
        >
          Compare ({compareList.length})
        </button>
      </div>

      {/* Courses Grid */}
      <div className="max-w-screen-xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCourses.length === 0 ? (
          <p className="text-center text-indigo-600">No courses found.</p>
        ) : (
          filteredCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-lg shadow-md flex flex-col h-full hover:shadow-lg transition-shadow"
            >
              <div className="p-6 flex flex-col gap-3 flex-grow">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-white bg-indigo-600 px-3 py-1 rounded-full shadow">
                    NPTEL
                  </span>
                  <h2 className="text-xl font-semibold text-indigo-900">{course.title}</h2>
                </div>
                <p className="text-gray-700">{course.instructor}</p>
                <p className="mt-auto text-gray-600 flex gap-4 text-sm">
                  <span className="flex items-center gap-1">
                    <Clock size={16} /> {course.duration}
                  </span>
                </p>
                <p className="flex gap-4 text-sm mt-2">
                  <span className="flex items-center gap-1">
                    <Star size={16} className="text-yellow-400" /> {course.rating}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users size={16} className="text-gray-600" /> {course.students}
                  </span>
                  <span className="flex items-center gap-1">
                    <DollarSign size={16} className="text-green-500" /> {course.price}
                  </span>
                </p>
              </div>
              <div className="border-t border-gray-200 p-4 flex items-center justify-between">
                <button
                  className={`px-3 py-1 border rounded flex items-center gap-2 text-sm ${
                    compareList.includes(course.id)
                      ? "border-indigo-600 text-indigo-600"
                      : "border-gray-300 text-gray-600"
                  }`}
                  onClick={() => toggleCompare(course.id)}
                  disabled={!compareList.includes(course.id) && compareList.length >= 3}
                  aria-label={
                    compareList.includes(course.id)
                      ? "Remove from comparison"
                      : "Add to comparison"
                  }
                >
                  <input
                    type="checkbox"
                    checked={compareList.includes(course.id)}
                    onChange={() => toggleCompare(course.id)}
                    disabled={compareList.length >= 3 && !compareList.includes(course.id)}
                    className="cursor-pointer accent-indigo-600"
                  />
                  Compare
                </button>

                <button
                  onClick={() => toggleSaveCourse(course.id)}
                  aria-label={savedCourses.includes(course.id) ? "Unlike course" : "Like course"}
                  className={`text-indigo-600 hover:text-indigo-800 transition-colors ${
                    savedCourses.includes(course.id) ? "font-bold" : ""
                  }`}
                >
                  <Heart
                    size={24}
                    className={savedCourses.includes(course.id) ? "fill-indigo-600" : "stroke-current"}
                  />
                </button>

                <a
                  href={course.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:underline font-semibold"
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

export default NptelCourses;
