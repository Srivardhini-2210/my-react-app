import React, { useState } from "react";

const subjectsData = [
  {
    name: "Computer Science",
    subcategories: [
      "Machine Learning",
      "Data Science",
      "DevOps",
      "Cybersecurity",
      "Artificial Intelligence",
      "Cloud Computing",
      "Web Development",
      "Mobile Development",
      "Algorithms",
      "Operating Systems",
      "Databases",
      "Computer Graphics",
      "Networks",
      "Theory of Computation",
      "Blockchain",
    ],
  },
  {
    name: "Health & Medicine",
    subcategories: [
      "Nutrition & Wellness",
      "Disease & Disorders",
      "Public Health",
      "Health Care",
      "Nursing",
      "Anatomy",
      "Veterinary Science",
      "Continuing Medical Education (CME)",
      "Blood Pressure",
      "Wellbeing",
      "Women's Health",
      "Dysphagia",
      "Occupational Therapy",
      "Hygiene",
      "Healthcare Innovation",
    ],
  },
  {
    name: "Mathematics",
    subcategories: [
      "Algebra",
      "Geometry",
      "Calculus",
      "Statistics",
      "Probability",
      "Discrete Math",
      "Number Theory",
    ],
  },
  {
    name: "Business",
    subcategories: [
      "Entrepreneurship",
      "Finance",
      "Marketing",
      "Business Analytics",
      "Leadership",
      "Project Management",
      "E-commerce",
      "Supply Chain",
      "Accounting",
      "Economics",
    ],
  },
  {
    name: "Humanities",
    subcategories: [
      "Philosophy",
      "History",
      "Linguistics",
      "Literature",
      "Theology",
    ],
  },
  {
    name: "Engineering",
    subcategories: [
      "Mechanical",
      "Electrical",
      "Civil",
      "Chemical",
      "Aerospace",
    ],
  },
  {
    name: "Science",
    subcategories: [
      "Physics",
      "Chemistry",
      "Biology",
      "Astronomy",
      "Geology",
    ],
  },
  {
    name: "Data Science",
    subcategories: [
      "Data Analysis",
      "Data Visualization",
      "Big Data",
      "Data Mining",
      "Statistics for Data Science",
    ],
  },
  {
    name: "Programming",
    subcategories: [
      "Python",
      "JavaScript",
      "Java",
      "C++",
      "C#",
      "Rust",
      "Go",
    ],
  },
];

export default function Header() {
  const [hoveredSubject, setHoveredSubject] = useState(subjectsData[0]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <div className="text-xl font-bold text-rose-600">MyCourses</div>

        {/* Navigation */}
        <nav className="flex items-center gap-6">
          {/* Courses Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <button className="text-gray-700 font-medium hover:text-rose-600">
              Courses
            </button>

            {/* Dropdown */}
            {dropdownOpen && (
              <div className="absolute left-0 mt-2 bg-white shadow-lg border border-gray-200 flex">
                {/* Left Column: Subjects */}
                <div className="w-56 max-h-[80vh] overflow-y-auto border-r border-gray-200">
                  {subjectsData.map((subject) => (
                    <div
                      key={subject.name}
                      className={`px-4 py-2 cursor-pointer hover:bg-rose-50 ${
                        hoveredSubject?.name === subject.name
                          ? "bg-rose-100"
                          : ""
                      }`}
                      onMouseEnter={() => setHoveredSubject(subject)}
                    >
                      {subject.name}
                    </div>
                  ))}
                </div>

                {/* Right Column: Subcategories */}
                <div className="w-64 max-h-[80vh] overflow-y-auto">
                  {hoveredSubject?.subcategories?.map((sub) => (
                    <div
                      key={sub}
                      className="px-4 py-2 cursor-pointer hover:bg-rose-50"
                    >
                      {sub}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Other Links */}
          <a href="#" className="text-gray-700 hover:text-rose-600">
            Wishlist
          </a>
          <a href="#" className="text-gray-700 hover:text-rose-600">
            Profile
          </a>
        </nav>
      </div>
    </header>
  );
}
