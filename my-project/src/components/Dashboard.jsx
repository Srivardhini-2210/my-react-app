// src/components/Dashboard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Star, Users, Award } from 'lucide-react';
import { Button } from './ui/Button';
import { Card, CardContent, CardFooter } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { mockCourses, mockCategories, mockProviders } from '../data/mock';
import SearchBar from "./SearchBar";
import PopularSubjects from "./PopularSubjects";

const Dashboard = () => {
  const featuredCourses = mockCourses.slice(0, 3);
  const popularCategories = mockCategories.slice(0, 8);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Discover Your Next
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {' '}Learning Adventure
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Find and compare courses from NPTEL, Coursera, and Udemy. 
            Get reviews, ratings, and personalized recommendations all in one place.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mt-8 mb-8">
            <SearchBar />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/courses">
              <Button
                size="lg"
                className="bg-blue-200 hover:bg-blue-300 px-8 py-3 text-black flex items-center"
              >
                <Search className="w-5 h-5 mr-2 text-black" />
                <span className="text-black">Explore Courses</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: '10,000+', label: 'Courses Available', color: 'text-blue-600' },
              { number: '500K+', label: 'Student Reviews', color: 'text-purple-600' },
              { number: '24/7', label: 'Course Access', color: 'text-orange-600' }
            ].map((stat, i) => (
              <div key={i} className="space-y-2">
                <div className={`text-3xl font-bold ${stat.color}`}>{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Insights Section */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-6">
            Your Learning Insights
          </h2>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-6 rounded-lg bg-blue-50 text-center">
              <div className="text-2xl font-bold text-blue-600">2 courses</div>
              <div className="text-sm text-gray-600">Wishlisted</div>
            </div>

            <div className="p-6 rounded-lg bg-green-50 text-center">
              <div className="text-2xl font-bold text-green-600">2</div>
              <div className="text-sm text-gray-600">Completed Courses</div>
            </div>

            <div className="p-6 rounded-lg bg-purple-50 text-center">
              <div className="text-lg font-semibold text-purple-600">Intermediate</div>
              <div className="text-sm text-gray-600">Current Level</div>
            </div>
          </div>

          {/* Interests */}
          <div className="mt-6">
            <h3 className="text-base font-semibold mb-3">Your Interests</h3>
            <div className="flex flex-wrap gap-2">
              {["Data Science", "Machine Learning", "Computer Science"].map((interest, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm flex items-center gap-1"
                >
                  {interest}
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Popular Subjects */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PopularSubjects />
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Courses</h2>
            <p className="text-lg text-gray-600">Hand-picked courses from top platforms</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredCourses.map((course) => (
              <Card key={course.id} className="group hover:shadow-lg transition-all duration-300 flex flex-col">
                <div className="relative overflow-hidden rounded-t-lg">
                  <img 
                    src={course.thumbnail} 
                    alt={course.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Badge className="absolute top-3 right-3 bg-white text-gray-800">
                    {course.provider}
                  </Badge>
                </div>
                <CardContent className="p-6 flex-grow">
                  <h3 className="font-bold text-lg mb-2 line-clamp-2">{course.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{course.instructor}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                      <span>{course.rating}</span>
                      <span className="ml-1">({course.reviewCount})</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      <span>{course.duration}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{course.level}</Badge>
                    <span className="font-semibold text-blue-600">{course.price}</span>
                  </div>
                </CardContent>
                <CardFooter className="p-6 pt-0">
                  <Link to={`/course/${course.id}`} className="w-full">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-black">
                      View Details
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to="/courses">
              <Button variant="outline" size="lg" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                View All Courses
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Platform Partners */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Platform Partners</h2>
            <p className="text-lg text-gray-600">Courses from trusted educational platforms</p>
          </div>
          <div className="flex justify-center items-center space-x-12 opacity-60">
            {mockProviders.map((provider) => (
              <div key={provider.id} className="flex items-center">
                <img 
                  src={provider.logo} 
                  alt={provider.name}
                  className="h-12 hover:opacity-100 transition-opacity"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Award className="w-16 h-16 text-white mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Start Learning?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of learners in CourseXpert to find your perfect course
          </p>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
