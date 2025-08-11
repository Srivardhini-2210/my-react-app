// src/data/mock.js

export const mockCourses = [
  {
    id: 1,
    title: "Introduction to Machine Learning",
    instructor: "Andrew Ng",
    provider: "Coursera",
    thumbnail: "https://source.unsplash.com/400x300/?machine-learning",
    rating: 4.8,
    reviewCount: 1200,
    duration: "6 weeks",
    level: "Beginner",
    price: "Free",
  },
  {
    id: 2,
    title: "Full-Stack Web Development Bootcamp",
    instructor: "Colt Steele",
    provider: "Udemy",
    thumbnail: "https://source.unsplash.com/400x300/?web-development",
    rating: 4.7,
    reviewCount: 850,
    duration: "12 weeks",
    level: "Intermediate",
    price: "$49.99",
  },
  {
    id: 3,
    title: "Data Science with Python",
    instructor: "Jose Portilla",
    provider: "Udemy",
    thumbnail: "https://source.unsplash.com/400x300/?data-science",
    rating: 4.6,
    reviewCount: 950,
    duration: "8 weeks",
    level: "Intermediate",
    price: "$39.99",
  },
];

export const mockCategories = [
  { id: 1, name: "Computer Science", count: 320 },
  { id: 2, name: "Data Science", count: 210 },
  { id: 3, name: "Business", count: 180 },
  { id: 4, name: "Personal Development", count: 150 },
  { id: 5, name: "Health & Fitness", count: 120 },
  { id: 6, name: "Language Learning", count: 90 },
  { id: 7, name: "Arts & Humanities", count: 85 },
  { id: 8, name: "Mathematics", count: 75 },
];

export const mockProviders = [
  {
    id: 1,
    name: "Coursera",
    logo: "/coursera.png",
  },
  {
    id: 2,
    name: "Udemy",
    logo: "https://upload.wikimedia.org/wikipedia/commons/e/e3/Udemy_logo.svg",
  },
  {
    id: 3,
    name: "NPTEL",
    logo: "/nptel.png",
  },
];
