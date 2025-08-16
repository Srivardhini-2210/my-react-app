import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { 
  Search, 
  Filter, 
  Star, 
  Users, 
  Clock, 
  DollarSign, 
  Globe,
  BookOpen,
  SlidersHorizontal,
  X,
  TrendingUp,
  Heart,
  Grid,
  List,
  ChevronDown
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Slider } from './ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const CoursesPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // State
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [filters, setFilters] = useState({
    platform: searchParams.get('platform') || 'all',
    category: searchParams.get('category') || 'all',
    difficulty: searchParams.get('difficulty') || 'all',
    language: searchParams.get('language') || 'all',
    priceRange: [0, 200],
    rating: 0,
    sortBy: 'created_at',
    sortOrder: -1
  });
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCourses, setTotalCourses] = useState(0);
  const [stats, setStats] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const ITEMS_PER_PAGE = 12;

  // Fetch courses with debounced search
  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        skip: (currentPage - 1) * ITEMS_PER_PAGE,
        limit: ITEMS_PER_PAGE,
        ...(searchTerm && { search: searchTerm }),
        ...(filters.platform && filters.platform !== 'all' && { platform: filters.platform }),
        ...(filters.category && filters.category !== 'all' && { category: filters.category }),
        ...(filters.difficulty && filters.difficulty !== 'all' && { difficulty: filters.difficulty }),
        ...(filters.language && filters.language !== 'all' && { language: filters.language }),
        ...(filters.priceRange[0] > 0 && { price_min: filters.priceRange[0] }),
        ...(filters.priceRange[1] < 200 && { price_max: filters.priceRange[1] }),
        ...(filters.rating > 0 && { rating_min: filters.rating }),
        sort_by: filters.sortBy,
        sort_order: filters.sortOrder
      };

      const response = await axios.get(`${API}/courses`, { params });
      setCourses(response.data);
      setTotalCourses(response.data.length); // In real app, this would come from response headers
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, filters, currentPage]);

  // Fetch stats
  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API}/stats/overview`);
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  // Fetch search suggestions
  const fetchSuggestions = async (query) => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }
    
    try {
      const response = await axios.get(`${API}/search/suggestions?q=${query}`);
      setSuggestions(response.data.suggestions);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    const delayedFetch = setTimeout(() => {
      if (searchTerm) {
        fetchSuggestions(searchTerm);
      }
    }, 300);

    return () => clearTimeout(delayedFetch);
  }, [searchTerm]);

  // Update URL params
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (filters.platform) params.set('platform', filters.platform);
    if (filters.category) params.set('category', filters.category);
    if (filters.difficulty) params.set('difficulty', filters.difficulty);
    if (filters.language) params.set('language', filters.language);
    
    setSearchParams(params);
  }, [searchTerm, filters, setSearchParams]);

  const handleFilterChange = (key, value) => {
    // Convert "all" values to empty strings for API
    const apiValue = value === "all" ? "" : value;
    setFilters(prev => ({ ...prev, [key]: apiValue }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      platform: 'all',
      category: 'all',
      difficulty: 'all',
      language: 'all',
      priceRange: [0, 200],
      rating: 0,
      sortBy: 'created_at',
      sortOrder: -1
    });
    setSearchTerm('');
    setCurrentPage(1);
  };

  const handleAddToComparison = (courseId) => {
    const existing = JSON.parse(localStorage.getItem('courseComparison') || '[]');
    if (existing.length >= 3) {
      alert('You can compare maximum 3 courses at once');
      return;
    }
    if (existing.includes(courseId)) {
      alert('Course already added to comparison');
      return;
    }
    
    existing.push(courseId);
    localStorage.setItem('courseComparison', JSON.stringify(existing));
    alert('Course added to comparison!');
  };

  const getPlatformColor = (platform) => {
    const colors = {
      'NPTEL': 'bg-green-100 text-green-800',
      'Udemy': 'bg-purple-100 text-purple-800',
      'Coursera': 'bg-blue-100 text-blue-800'
    };
    return colors[platform] || 'bg-gray-100 text-gray-800';
  };

  const getDifficultyColor = (level) => {
    const colors = {
      'Beginner': 'bg-green-100 text-green-800',
      'Intermediate': 'bg-yellow-100 text-yellow-800',
      'Advanced': 'bg-red-100 text-red-800'
    };
    return colors[level] || 'bg-gray-100 text-gray-800';
  };

  const CourseCard = ({ course, isListView = false }) => (
    <Card className={`group hover:shadow-lg transition-all duration-300 ${isListView ? 'flex flex-row' : 'flex flex-col'}`}>
      <div className={`relative overflow-hidden ${isListView ? 'w-48 h-32' : 'w-full h-48'}`}>
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 left-2 flex gap-2">
          <Badge className={getPlatformColor(course.platform)}>
            {course.platform}
          </Badge>
          <Badge className={getDifficultyColor(course.difficulty_level)}>
            {course.difficulty_level}
          </Badge>
        </div>
        <div className="absolute top-2 right-2 flex gap-2">
          <Button 
            size="sm" 
            variant="secondary" 
            onClick={(e) => {
              e.preventDefault();
              handleAddToComparison(course.id);
            }}
          >
            <TrendingUp className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="secondary">
            <Heart className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      <CardContent className={`p-4 flex-grow ${isListView ? 'flex flex-col justify-between' : ''}`}>
        <div>
          <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {course.title}
          </h3>
          <p className="text-gray-600 text-sm mb-2">{course.instructor}</p>
          
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
              <span>{course.rating}</span>
              <span className="ml-1">({course.review_count.toLocaleString()})</span>
            </div>
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              <span>{course.enrollment_count.toLocaleString()}</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              <span>{course.duration}</span>
            </div>
          </div>

          {!isListView && (
            <div className="flex flex-wrap gap-1 mb-3">
              {course.skills.slice(0, 3).map((skill, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {skill}
                </Badge>
              ))}
              {course.skills.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{course.skills.length - 3} more
                </Badge>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-green-600" />
            <span className="font-semibold text-lg">
              {course.price === 0 ? 'Free' : `$${course.price}`}
            </span>
            {course.original_price && course.original_price > course.price && (
              <span className="text-sm text-gray-500 line-through">
                ${course.original_price}
              </span>
            )}
          </div>
          
          <Link to={`/course/${course.id}`}>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
              View Details
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Explore Courses</h1>
              <p className="text-gray-600">Discover courses from NPTEL, Udemy, and Coursera</p>
            </div>

            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search courses, instructors, skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  className="pl-10"
                />
              </div>
              
              {/* Search Suggestions */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-md shadow-lg z-10">
                  {suggestions.map((suggestion, index) => (
                    <div 
                      key={index}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setSearchTerm(suggestion.title);
                        setShowSuggestions(false);
                      }}
                    >
                      <div className="font-medium">{suggestion.title}</div>
                      <div className="text-sm text-gray-500">
                        {suggestion.instructor} • {suggestion.platform}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Stats Bar */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.total_courses}</div>
                <div className="text-sm text-gray-600">Total Courses</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.total_enrollments}</div>
                <div className="text-sm text-gray-600">Total Enrollments</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{stats.completed_courses}</div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">3</div>
                <div className="text-sm text-gray-600">Platforms</div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <div className="w-80 space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Filters</h2>
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Clear All
                </Button>
              </div>

              <div className="space-y-6">
                {/* Platform Filter */}
                <div>
                  <label className="block text-sm font-medium mb-2">Platform</label>
                  <Select value={filters.platform} onValueChange={(value) => handleFilterChange('platform', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="All platforms" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Platforms</SelectItem>
                      <SelectItem value="NPTEL">NPTEL</SelectItem>
                      <SelectItem value="Udemy">Udemy</SelectItem>
                      <SelectItem value="Coursera">Coursera</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <Select value={filters.category} onValueChange={(value) => handleFilterChange('category', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="All categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="Computer Science">Computer Science</SelectItem>
                      <SelectItem value="Data Science">Data Science</SelectItem>
                      <SelectItem value="Web Development">Web Development</SelectItem>
                      <SelectItem value="Cloud Computing">Cloud Computing</SelectItem>
                      <SelectItem value="Design">Design</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Difficulty Filter */}
                <div>
                  <label className="block text-sm font-medium mb-2">Difficulty Level</label>
                  <Select value={filters.difficulty} onValueChange={(value) => handleFilterChange('difficulty', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="All levels" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Price Range: ${filters.priceRange[0]} - ${filters.priceRange[1]}
                  </label>
                  <Slider
                    value={filters.priceRange}
                    onValueChange={(value) => handleFilterChange('priceRange', value)}
                    max={200}
                    step={5}
                    className="mt-2"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Free</span>
                    <span>$200+</span>
                  </div>
                </div>

                {/* Rating Filter */}
                <div>
                  <label className="block text-sm font-medium mb-2">Minimum Rating</label>
                  <Select value={filters.rating.toString()} onValueChange={(value) => handleFilterChange('rating', parseFloat(value))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Any Rating</SelectItem>
                      <SelectItem value="4.5">4.5+ Stars</SelectItem>
                      <SelectItem value="4.0">4.0+ Stars</SelectItem>
                      <SelectItem value="3.5">3.5+ Stars</SelectItem>
                      <SelectItem value="3.0">3.0+ Stars</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Language Filter */}
                <div>
                  <label className="block text-sm font-medium mb-2">Language</label>
                  <Select value={filters.language} onValueChange={(value) => handleFilterChange('language', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="All languages" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Languages</SelectItem>
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="Spanish">Spanish</SelectItem>
                      <SelectItem value="French">French</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Quick Comparison Access */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Course Comparison</h3>
              <p className="text-sm text-gray-600 mb-4">
                Compare up to 3 courses side by side
              </p>
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => navigate('/compare')}
              >
                View Comparison
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold">
                  {loading ? 'Loading...' : `${totalCourses} courses found`}
                </h2>
                {searchTerm && (
                  <p className="text-gray-600">Results for "{searchTerm}"</p>
                )}
              </div>

              <div className="flex items-center gap-4">
                {/* Sort Options */}
                <Select value={`${filters.sortBy}_${filters.sortOrder}`} onValueChange={(value) => {
                  const [sortBy, sortOrder] = value.split('_');
                  handleFilterChange('sortBy', sortBy);
                  handleFilterChange('sortOrder', parseInt(sortOrder));
                }}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="created_at_-1">Newest First</SelectItem>
                    <SelectItem value="rating_-1">Highest Rated</SelectItem>
                    <SelectItem value="price_1">Price: Low to High</SelectItem>
                    <SelectItem value="price_-1">Price: High to Low</SelectItem>
                    <SelectItem value="enrollment_count_-1">Most Popular</SelectItem>
                  </SelectContent>
                </Select>

                {/* View Toggle */}
                <div className="flex border rounded-md">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Course Grid/List */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-sm animate-pulse">
                    <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : courses.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your filters or search terms</p>
                <Button onClick={clearFilters}>Clear Filters</Button>
              </div>
            ) : (
              <div className={viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
                : 'space-y-4'
              }>
                {courses.map((course) => (
                  <Link key={course.id} to={`/course/${course.id}`}>
                    <CourseCard course={course} isListView={viewMode === 'list'} />
                  </Link>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalCourses > ITEMS_PER_PAGE && (
              <div className="flex justify-center mt-8">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    Previous
                  </Button>
                  
                  {/* Page Numbers */}
                  {[...Array(Math.ceil(totalCourses / ITEMS_PER_PAGE))].map((_, i) => (
                    <Button
                      key={i + 1}
                      variant={currentPage === i + 1 ? 'default' : 'outline'}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </Button>
                  ))}
                  
                  <Button
                    variant="outline"
                    disabled={currentPage >= Math.ceil(totalCourses / ITEMS_PER_PAGE)}
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;