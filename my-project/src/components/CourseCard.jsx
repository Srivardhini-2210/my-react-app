import React from "react";

const CourseCard = ({ course }) => {
  return (
    <div className="bg-white shadow-md rounded-2xl p-4 hover:shadow-lg transition duration-300">
      <h2 className="text-xl font-semibold text-indigo-600 mb-2">{course.title}</h2>
      <p className="text-sm text-gray-700 mb-1"><strong>Platform:</strong> NPTEL</p>
      <p className="text-sm text-gray-700 mb-1"><strong>Instructor:</strong> {course.instructor}</p>
      <p className="text-sm text-gray-700 mb-1"><strong>Duration:</strong> {course.duration}</p>
      <p className="text-sm text-gray-700 mb-2"><strong>Start Date:</strong> {course.start_date}</p>
      <a
        href={course.link}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-blue-500 underline"
      >
        Go to Course
      </a>
    </div>
  );
};

export default CourseCard;
