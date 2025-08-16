import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, X, Star, Clock, Users, Globe, Award, Check } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { mockCourses } from './data/mock';
import { useToast } from '../hooks/use-toast';

const ComparePage = () => {
  const [selectedCourses, setSelectedCourses] = useState([mockCourses[0], mockCourses[1]]);
  const [availableCourses] = useState(mockCourses);
  const { toast } = useToast();

  const addCourse = (courseId) => {
    if (selectedCourses.length >= 4) {
      toast({
        title: "Maximum limit reached",
        description: "You can compare up to 4 courses at a time.",
        variant: "destructive",
      });
      return;
    }

    const course = availableCourses.find(c => c.id === courseId);
    if (course && !selectedCourses.find(c => c.id === courseId)) {
      setSelectedCourses(prev => [...prev, course]);
    }
  };

  const removeCourse = (courseId) => {
    if (selectedCourses.length <= 2) {
      toast({
        title: "Minimum courses required",
        description: "You need at least 2 courses to compare.",
        variant: "destructive",
      });
      return;
    }
    setSelectedCourses(prev => prev.filter(c => c.id !== courseId));
  };

  const getComparisonData = () => {
    return [
      {
        label: 'Platform',
        values: selectedCourses.map(course => course.provider)
      },
      {
        label: 'Instructor',
        values: selectedCourses.map(course => course.instructor)
      },
      {
        label: 'Rating',
        values: selectedCourses.map(course => (
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
            <span>{course.rating}</span>
            <span className="text-gray-500 ml-1">({course.reviewCount})</span>
          </div>
        ))
      },
      {
        label: 'Duration',
        values: selectedCourses.map(course => course.duration)
      },
      {
        label: 'Level',
        values: selectedCourses.map(course => (
          <Badge variant="outline">{course.level}</Badge>
        ))
      },
      {
        label: 'Price',
        values: selectedCourses.map(course => (
          <span className="font-semibold text-blue-600">{course.price}</span>
        ))
      },
      {
        label: 'Category',
        values: selectedCourses.map(course => course.category)
      },
      {
        label: 'Start Date',
        values: selectedCourses.map(course => new Date(course.startDate).toLocaleDateString())
      },
      {
        label: 'Certificate',
        values: selectedCourses.map(() => (
          <div className="flex items-center text-green-600">
            <Check className="w-4 h-4 mr-1" />
            <span>Included</span>
          </div>
        ))
      },
      {
        label: 'Access',
        values: selectedCourses.map(() => 'Lifetime')
      }
    ];
  };

  const availableCoursesForAdd = availableCourses.filter(
    course => !selectedCourses.find(sc => sc.id === course.id)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Compare Courses</h1>
          <p className="text-gray-600">
            Compare courses side by side to make the best choice for your learning journey
          </p>
        </div>

        {/* Course Selection */}
        <div className="mb-8">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold">Selected Courses ({selectedCourses.length})</h2>
            {selectedCourses.length < 4 && (
              <Select onValueChange={addCourse}>
                <SelectTrigger className="w-64">
                  <div className="flex items-center">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Course to Compare
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {availableCoursesForAdd.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>

        {/* Comparison Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left p-6 w-48 bg-gray-50 font-medium text-gray-900">
                      Course Details
                    </th>
                    {selectedCourses.map((course) => (
                      <th key={course.id} className="p-6 min-w-72 bg-gray-50">
                        <div className="space-y-4">
                          <div className="relative">
                            <img 
                              src={course.thumbnail} 
                              alt={course.title}
                              className="w-full h-40 object-cover rounded-lg"
                            />
                            {selectedCourses.length > 2 && (
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => removeCourse(course.id)}
                                className="absolute top-2 right-2"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                          <div>
                            <h3 className="font-bold text-lg line-clamp-2 mb-2">{course.title}</h3>
                            <Link to={`/course/${course.id}`}>
                              <Button size="sm" className="w-full">
                                View Details
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {getComparisonData().map((row, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="p-6 font-medium text-gray-900 border-r border-gray-200">
                        {row.label}
                      </td>
                      {row.values.map((value, courseIndex) => (
                        <td key={courseIndex} className="p-6 text-center">
                          {typeof value === 'string' ? value : value}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Feature Comparison */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Features Included</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  'Video Lectures',
                  'Downloadable Resources',
                  'Quizzes & Assignments',
                  'Discussion Forums',
                  'Certificate of Completion',
                  'Lifetime Access',
                  'Mobile App Access',
                  'Instructor Support'
                ].map((feature) => (
                  <div key={feature} className="grid grid-cols-3 gap-4 items-center">
                    <span className="text-sm font-medium">{feature}</span>
                    {selectedCourses.map((course) => (
                      <div key={course.id} className="flex justify-center">
                        <Check className="w-5 h-5 text-green-600" />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Learning Path Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {selectedCourses.map((course, index) => (
                  <div key={course.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-6 h-6 bg-blue-600 text-white text-sm rounded-full flex items-center justify-center">
                        {index + 1}
                      </div>
                      <h4 className="font-semibold">{course.title}</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {course.level === 'Beginner' ? 'Great starting point for beginners' :
                       course.level === 'Intermediate' ? 'Perfect for building advanced skills' :
                       'Advanced concepts for experienced learners'}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {course.duration}
                      </span>
                      <span className="flex items-center">
                        <Users className="w-3 h-3 mr-1" />
                        {course.level}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="mt-8 flex justify-center gap-4">
          <Link to="/courses">
            <Button variant="outline" size="lg">
              Browse More Courses
            </Button>
          </Link>
          <Button size="lg">
            <Award className="w-5 h-5 mr-2" />
            Start Learning Journey
          </Button>
        </div>

        {/* Popular Comparisons */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Popular Course Comparisons</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { title: 'Machine Learning vs Data Science', courses: 2 },
                { title: 'React vs Angular Development', courses: 2 },
                { title: 'Python vs JavaScript Programming', courses: 2 },
                { title: 'AWS vs Azure Cloud Computing', courses: 2 },
                { title: 'Digital Marketing Strategies', courses: 3 },
                { title: 'UX/UI Design Fundamentals', courses: 2 }
              ].map((comparison, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                  <h4 className="font-semibold mb-2">{comparison.title}</h4>
                  <p className="text-sm text-gray-600">Compare {comparison.courses} courses</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
