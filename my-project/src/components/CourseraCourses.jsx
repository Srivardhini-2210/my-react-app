import React, { useState, useEffect } from "react";
import {
  Clock,
  Star,
  Users,
  DollarSign,
  Heart,
} from "lucide-react";
import CourseSearch from "./CourseSearch"; // Adjust path if needed
import Header from "./Header"; // Adjust the path as needed

const CourseraCourses = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [savedCourses, setSavedCourses] = useState([]);
  const [compareList, setCompareList] = useState([]);

  useEffect(() => {
    fetch("/coursera_courses.json")
      .then((res) => res.json())
      .then((data) => {
        // Only Coursera courses
        const coursera = data
          .filter(course => course.platform === "Coursera")
          .map((course, idx) => ({
            id: course.id || idx.toString(),
            rating: course.rating || 4.5,
            students: course.students || "N/A",
            price: course.price || "Free",
            tags: course.tags || ["Coursera"],
            ...course,
          }));
        setCourses(coursera);
        setFilteredCourses(coursera);
      })
      .catch(() => {
        setCourses([]);
        setFilteredCourses([]);
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
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white px-6 py-8">
      <Header />

      <div className="max-w-screen-xl mx-auto text-center mb-8">
        <h1 className="text-3xl font-bold text-rose-900 mb-2">Coursera Courses</h1>
        <p className="text-rose-600 mb-6">Explore and search Coursera courses below</p>
        <div className="max-w-2xl mx-auto">
          <CourseSearch
            courses={courses}
            onSearchResults={handleSearchResults}
            onSearchQuery={handleSearchQuery}
          />
        </div>
      </div>



      {/* Selected for Comparison */}
      {compareList.length > 0 && (
        <div className="max-w-screen-xl mx-auto bg-pink-100 rounded shadow p-4 mb-8">
          <p className="text-sm text-rose-600 mb-2">
            Selected for comparison ({compareList.length}/3):
          </p>
          <div className="flex flex-wrap gap-2">
            {compareList.map((id) => {
              const course = filteredCourses.find((c) => c.id === id);
              if (!course) return null;
              return (
                <span
                  key={id}
                  className="bg-rose-200 text-rose-700 rounded px-3 py-1 text-xs flex items-center gap-1"
                >
                  {course.title}
                  <button
                    onClick={() => toggleCompare(id)}
                    className="cursor-pointer hover:text-red-600 font-semibold"
                    aria-label={`Remove ${course.title} from comparison`}
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
      <div className="max-w-screen-xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.length === 0 ? (
          <p className="text-center text-rose-600 py-12">No courses found.</p>
        ) : (
          filteredCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white border border-gray-300 rounded-lg shadow flex flex-col hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex justify-end gap-2 p-3 border-b border-gray-200">
                <button
                  onClick={() => toggleCompare(course.id)}
                  className="h-8 w-8 border rounded bg-white flex items-center justify-center"
                  disabled={
                    !compareList.includes(course.id) && compareList.length >= 3
                  }
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
                    className="h-4 w-4 accent-rose-600"
                  />
                </button>

                <button
                  onClick={() => toggleSaveCourse(course.id)}
                  aria-label={
                    savedCourses.includes(course.id) ? "Unlike course" : "Like course"
                  }
                  className="p-1 rounded hover:text-rose-600 text-gray-600 transition-colors"
                >
                  <Heart
                    size={21}
                    className={
                      savedCourses.includes(course.id)
                        ? "fill-rose-600 text-rose-600"
                        : "stroke-current"
                    }
                  />
                </button>
              </div>

              {/* Platform badge above the title, left side */}
              <div className="p-4 flex flex-col flex-grow">
                <div className="flex justify-start mb-1">
                  <span className="text-xs font-semibold text-white bg-rose-600 px-2 py-1 rounded">
                    Coursera
                  </span>
                </div>
                <h4 className="text-lg font-bold mb-1 line-clamp-2">{course.title}</h4>
                <p className="text-gray-600 mb-3 line-clamp-4">
                  {course.instructor}
                </p>
                <div className="flex flex-wrap gap-6 text-gray-500 text-sm mb-4">
                  <div className="flex items-center gap-1">
                    <Clock size={14} /> {course.duration}
                  </div>
                  {course.rating && (
                    <div className="flex items-center gap-1">
                      <Star size={14} /> {course.rating}
                    </div>
                  )}
                  {course.students && (
                    <div className="flex items-center gap-1">
                      <Users size={14} /> {course.students}
                    </div>
                  )}
                  {course.price && (
                    <div className="flex items-center gap-1">
                      <DollarSign size={14} /> {course.price}
                    </div>
                  )}
                </div>
                <p className="text-xs text-pink-900 mb-2">
                  Start: {course.start_date}
                </p>
                <a
                  href={course.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto bg-rose-300 text-white py-2 rounded font-semibold hover:bg-rose-700 transition text-center"
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

export default CourseraCourses;
