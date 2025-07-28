// src/context/SavedCoursesContext.js
import React, { createContext, useState } from 'react';

export const SavedCoursesContext = createContext();

export const SavedCoursesProvider = ({ children }) => {
  const [savedCourses, setSavedCourses] = useState([]);

  const toggleSaveCourse = (courseId) => {
    setSavedCourses((prev) =>
      prev.includes(courseId)
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId]
    );
  };

  return (
    <SavedCoursesContext.Provider value={{ savedCourses, toggleSaveCourse }}>
      {children}
    </SavedCoursesContext.Provider>
  );
};
