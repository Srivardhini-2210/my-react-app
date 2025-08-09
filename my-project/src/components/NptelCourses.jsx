import React, { useState, useEffect } from "react";
import {
  Clock,
  Star,
  Users,
  DollarSign,
  Heart,
} from "lucide-react";
import CourseSearch from "./CourseSearch";

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

    

      {/* Courses Grid */}
      <div className="max-w-screen-xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.length === 0 ? (
          <p className="text-center text-indigo-600 py-12">No courses found.</p>
        ) : (
          filteredCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white border border-gray-300 rounded-lg shadow flex flex-col hover:shadow-lg transition-shadow duration-200"
            >
              {/* Top-right buttons: compare & save */}
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
                    className="h-4 w-4 accent-indigo-600"
                  />
                </button>

                <button
                  onClick={() => toggleSaveCourse(course.id)}
                  aria-label={
                    savedCourses.includes(course.id) ? "Unlike course" : "Like course"
                  }
                  className="p-1 rounded hover:text-indigo-600 text-gray-600 transition-colors"
                >
                  <Heart
                    size={21}
                    className={
                      savedCourses.includes(course.id)
                        ? "fill-indigo-600 text-indigo-600"
                        : "stroke-current"
                    }
                  />
                </button>
              </div>

              {/* Course info */}
              <div className="p-4 flex flex-col flex-grow">
                {/* Platform badge */}
                <div className="flex justify-start mb-1">
                  <span className="text-xs font-semibold text-white bg-indigo-600 px-2 py-1 rounded">
                    NPTEL
                  </span>
                </div>

                {/* Course title */}
                <h4 className="text-lg font-bold mb-1 line-clamp-2">{course.title}</h4>

                {/* Instructor */}
                <p className="text-gray-600 mb-3 line-clamp-4">{course.instructor}</p>

                {/* Course details */}
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

                {/* Start Date */}
                <p className="text-xs text-indigo-900 mb-2">
                  Start: {course.start_date}
                </p>

                {/* Go to course button */}
                <a
                  href={course.link}
                  target="_blank"
                  rel="noopener noreferrer"
                   className="mt-auto bg-indigo-300 text-white py-2 rounded font-semibold hover:bg-indigo-700 transition text-center"
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
