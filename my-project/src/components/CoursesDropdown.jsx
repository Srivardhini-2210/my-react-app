import React, { useState, useRef, useEffect } from "react";

const subjectsData = [
  {
    name: "Computer Science",
    subcategories: [
      "Artificial Intelligence",
      "Blockchain",
      "Cloud Computing",
      "Computer Graphics",
      "Computer Networking",
      "Cybersecurity",
      "Data Science",
      "Databases",
      "DevOps",
      "Human-Computer Interaction",
      "Machine Learning",
      "Mobile Development",
      "Operating Systems",
      "Programming Languages",
      "Software Engineering",
      "Theory of Computation",
      "Web Development",
    ],
  },
  {
    name: "Business",
    subcategories: [
      "Accounting",
      "Business Analytics",
      "Communication Skills",
      "E-Commerce",
      "Entrepreneurship",
      "Finance",
      "Human Resources",
      "Leadership & Management",
      "Marketing",
      "Project Management",
      "Sales",
      "Supply Chain Management",
    ],
  },
  {
    name: "Health & Medicine",
    subcategories: [
      "Anatomy",
      "Cancer",
      "Cardiology",
      "Dentistry",
      "Dermatology",
      "Dietetics",
      "Diseases & Disorders",
      "Emergency Medicine",
      "Epidemiology",
      "Healthcare Administration",
      "Mental Health",
      "Nursing",
      "Nutrition & Wellness",
      "Obstetrics & Gynecology",
      "Pediatrics",
      "Pharmacology",
      "Public Health",
      "Surgery",
    ],
  },
  {
    name: "Mathematics",
    subcategories: [
      "Algebra",
      "Calculus",
      "Discrete Mathematics",
      "Geometry",
      "Graph Theory",
      "Linear Algebra",
      "Number Theory",
      "Probability",
      "Statistics",
      "Topology",
    ],
  },
  {
    name: "Data Science",
    subcategories: [
      "Big Data",
      "Business Intelligence",
      "Data Analysis",
      "Data Visualization",
      "Deep Learning",
      "Machine Learning",
      "Natural Language Processing",
      "Predictive Analytics",
      "Reinforcement Learning",
      "Statistics",
    ],
  },
  {
    name: "Humanities",
    subcategories: [
      "Anthropology",
      "Archaeology",
      "History",
      "Linguistics",
      "Literature",
      "Philosophy",
      "Theology",
    ],
  },
  {
    name: "Social Sciences",
    subcategories: [
      "Criminology",
      "Economics",
      "Education",
      "International Relations",
      "Law",
      "Political Science",
      "Psychology",
      "Sociology",
    ],
  },
  {
    name: "Engineering",
    subcategories: [
      "Aerospace Engineering",
      "Biomedical Engineering",
      "Chemical Engineering",
      "Civil Engineering",
      "Electrical Engineering",
      "Environmental Engineering",
      "Industrial Engineering",
      "Mechanical Engineering",
      "Systems Engineering",
    ],
  },
  {
    name: "Physical Science & Engineering",
    subcategories: [
      "Astronomy",
      "Chemistry",
      "Earth Science",
      "Environmental Science",
      "Materials Science",
      "Physics",
    ],
  },
  {
    name: "Art & Design",
    subcategories: [
      "3D Modeling",
      "Animation",
      "Architecture",
      "Design Thinking",
      "Fashion Design",
      "Film",
      "Graphic Design",
      "Interior Design",
      "Music",
      "Photography",
      "User Experience",
      "Video Game Design",
    ],
  },
  {
    name: "Education & Teaching",
    subcategories: [
      "Early Childhood Education",
      "Educational Technology",
      "Higher Education",
      "K-12 Education",
      "Language Learning",
      "Special Education",
      "Teacher Training",
    ],
  },
  {
    name: "Personal Development",
    subcategories: [
      "Career Development",
      "Creativity",
      "Critical Thinking",
      "Mindfulness",
      "Personal Finance",
      "Productivity",
      "Public Speaking",
      "Self Improvement",
      "Time Management",
      "Wellbeing",
    ],
  },
  {
    name: "Language Learning",
    subcategories: [
      "Chinese",
      "English",
      "French",
      "German",
      "Italian",
      "Japanese",
      "Korean",
      "Portuguese",
      "Russian",
      "Spanish",
    ],
  },
  {
    name: "Programming & Software Development",
    subcategories: [
      "C",
      "C++",
      "C#",
      "Go",
      "Java",
      "JavaScript",
      "Kotlin",
      "PHP",
      "Python",
      "R",
      "Ruby",
      "Rust",
      "Swift",
      "TypeScript",
    ],
  },
  {
    name: "Test Prep",
    subcategories: [
      "GRE",
      "GMAT",
      "SAT",
      "ACT",
      "LSAT",
      "MCAT",
      "TOEFL",
      "IELTS",
    ],
  },
];

export default function CoursesDropdown() {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(subjectsData[0]);
  const closeTimerRef = useRef(null);
  const wrapperRef = useRef(null);

  const openMenu = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setOpen(true);
  };

  const scheduleClose = () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => {
      setOpen(false);
      closeTimerRef.current = null;
    }, 150);
  };

  const cancelClose = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  const leftColStyle = {
    width: 240,
    maxHeight: "80vh",
    overflowY: "auto",
    WebkitOverflowScrolling: "touch",
  };
  const rightColStyle = {
    width: 340,
    maxHeight: "80vh",
    overflowY: "auto",
    WebkitOverflowScrolling: "touch",
  };

  return (
    <div
      ref={wrapperRef}
      className="relative"
      onMouseEnter={openMenu}
      onMouseLeave={scheduleClose}
    >
      <button className="px-3 py-1 rounded text-gray-700 hover:text-rose-600">
        Courses
      </button>

      {open && (
        <div
          className="absolute left-0 mt-2 bg-white border border-gray-200 shadow-lg"
          style={{ display: "flex", minWidth: 600, zIndex: 60 }}
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
        >
          {/* Left column: subjects */}
          <div
            className="border-r border-gray-200 cc-scroll"
            style={leftColStyle}
            onMouseEnter={cancelClose}
          >
            {subjectsData.map((s) => (
              <div
                key={s.name}
                className={`px-4 py-3 cursor-pointer hover:bg-gray-100 ${
                  hovered.name === s.name ? "bg-gray-100" : ""
                }`}
                onMouseEnter={() => setHovered(s)}
              >
                <div className="flex justify-between items-center">
                  <span>{s.name}</span>
                  {s.subcategories && s.subcategories.length > 0 && (
                    <span className="text-gray-400">›</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Right column: subcategories */}
          <div
            className="cc-scroll"
            style={rightColStyle}
            onMouseEnter={cancelClose}
          >
            {hovered?.subcategories?.map((sub) => (
              <div
                key={sub}
                className="px-4 py-3 cursor-pointer hover:bg-gray-100"
              >
                {sub}
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        .cc-scroll::-webkit-scrollbar { width: 10px; }
        .cc-scroll::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.15); border-radius: 6px; }
        .cc-scroll { scrollbar-width: thin; scrollbar-color: rgba(0,0,0,0.15) transparent; }
      `}</style>
    </div>
  );
}
