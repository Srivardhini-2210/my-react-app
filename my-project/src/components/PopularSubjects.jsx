// src/components/PopularSubjects.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Code,
  Globe,
  Megaphone,
  PenTool,
  Briefcase,
  Database,
  LineChart,
  Camera,
  Cpu,
  Layers,
  BookOpen,
  Palette,
} from "lucide-react";

const categories = [
  { name: "Programming", count: 124, icon: Code, color: "bg-blue-100 text-blue-600" },
  { name: "Web Development", count: 98, icon: Globe, color: "bg-green-100 text-green-600" },
  { name: "Digital Marketing", count: 76, icon: Megaphone, color: "bg-pink-100 text-pink-600" },
  { name: "Design", count: 54, icon: PenTool, color: "bg-yellow-100 text-yellow-600" },
  { name: "Business Management", count: 88, icon: Briefcase, color: "bg-purple-100 text-purple-600" },
  { name: "Database & SQL", count: 67, icon: Database, color: "bg-orange-100 text-orange-600" },
  { name: "Data Analytics", count: 102, icon: LineChart, color: "bg-indigo-100 text-indigo-600" },
  { name: "Photography", count: 43, icon: Camera, color: "bg-red-100 text-red-600" },
  { name: "Artificial Intelligence", count: 59, icon: Cpu, color: "bg-cyan-100 text-cyan-600" },
  { name: "UI/UX Design", count: 73, icon: Layers, color: "bg-teal-100 text-teal-600" },
  { name: "Education & Teaching", count: 45, icon: BookOpen, color: "bg-rose-100 text-rose-600" },
  { name: "Arts & Creativity", count: 61, icon: Palette, color: "bg-lime-100 text-lime-600" },
];

export default function PopularSubjects() {
  const navigate = useNavigate();

  const handleClick = (subject) => {
    // Navigate to a subject-specific route
    navigate(`/subjects/${encodeURIComponent(subject)}`);
  };

  return (
    <section className="mt-10">
      <h2 className="text-xl font-bold mb-6">Popular Subjects</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {categories.map((category, index) => (
          <div
            key={index}
            onClick={() => handleClick(category.name)}
            className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col items-center text-center hover:scale-105"
          >
            <div className={`p-4 rounded-full mb-3 ${category.color}`}>
              <category.icon size={28} />
            </div>
            <h3 className="text-lg font-semibold">{category.name}</h3>
            <p className="text-sm text-gray-500">{category.count} Courses</p>
          </div>
        ))}
      </div>
    </section>
  );
}
