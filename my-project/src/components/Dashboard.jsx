import { useState } from "react";
import { useNavigate } from "react-router-dom";
//import mockCourses from "./mockCourses";
// Ensure that you have exported mockCourses as default in that file
import React from "react";

const mockCourses = [
  {
    id: "1",
    title: "Complete Web Development Bootcamp",
    platform: "Udemy",
    price: "$49.99",
    duration: "52 hours",
    rating: 4.6,
    students: "245k",
    level: "Beginner",
    description: "Learn HTML, CSS, JavaScript, Node.js, React, and more in this comprehensive course.",
    tags: ["Web Development", "JavaScript", "React"]
  },
  {
    id: "2",
    title: "Machine Learning A-Z",
    platform: "Coursera",
    price: "$79.99",
    duration: "40 hours",
    rating: 4.8,
    students: "150k",
    level: "Intermediate",
    description: "Hands-on Python & R in Data Science with real examples and exercises.",
    tags: ["Machine Learning", "Python", "Data Science"]
  },
  {
    id: "3",
    title: "Digital Marketing Masterclass",
    platform: "NPTEL",
    price: "Free",
    duration: "30 hours",
    rating: 4.4,
    students: "89k",
    level: "Beginner",
    description: "Complete guide to digital marketing including SEO, Social Media, and PPC.",
    tags: ["Digital Marketing", "SEO", "Social Media"]
  }
];

const Dashboard = () => {
  const [savedCourses, setSavedCourses] = useState([]);

  const toggleSaveCourse = (courseId) => {
    setSavedCourses((prev) =>
      prev.includes(courseId)
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId]
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Discover Your Next Skill
        </h2>
        <p className="text-gray-500 text-lg">
          Find and compare courses from top platforms to accelerate your learning journey
        </p>
      </div>
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Featured Courses</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white shadow-lg rounded-xl p-6 relative hover:shadow-xl transition-shadow"
            >
              <div className="mb-1 flex items-center justify-between">
                <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                  {course.platform}
                </span>
                <button
                  onClick={() => toggleSaveCourse(course.id)}
                  className="text-gray-400 hover:text-red-600 transition"
                  aria-label="Save course"
                >
                  <svg className={`w-5 h-5 ${savedCourses.includes(course.id) ? "fill-red-500" : ""}`} viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 6 4 4 6.5 4c1.74 0 3.41 1.01 4.13 2.44h1.74C14.09 5.01 15.76 4 17.5 4 20 4 22 6 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                </button>
              </div>
              <h4 className="text-lg font-bold mt-2 mb-1">{course.title}</h4>
              <p className="text-gray-600 mb-2 line-clamp-2">{course.description}</p>
              <div className="mb-3 flex space-x-2">
                {course.tags.slice(0, 2).map((tag) => (
                  <span key={tag} className="border border-gray-300 rounded px-2 py-0.5 text-xs bg-gray-50">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-400 mb-3">
                <span>⏰ {course.duration}</span>
                <span>⭐ {course.rating}</span>
                <span>👤 {course.students}</span>
                <span>💲 {course.price}</span>
              </div>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-black font-semibold py-2 rounded-lg transition">
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Dashboard;