import React, { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Filter, Grid, List, Star, Clock, BookMarked } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { mockCourses, mockCategories, mockProviders, searchSuggestions } from '../data/mockData';
import { useToast } from '../hooks/use-toast';

const CoursesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedProviders, setSelectedProviders] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedLevels, setSelectedLevels] = useState([]);
  const [priceFilter, setPriceFilter] = useState('all');
  const [sortBy, setSortBy] = useState('relevance');
  const [viewMode, setViewMode] = useState('grid');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [courses, setCourses] = useState(mockCourses);
  const { toast } = useToast();

  const levels = ['Beginner', 'Intermediate', 'Advanced'];

  const filteredSuggestions = useMemo(() => {
    if (!searchQuery) return [];
    return searchSuggestions.filter(suggestion => 
      suggestion.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const filteredCourses = useMemo(() => {
    let filtered = [...courses];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(course => 
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Provider filter
    if (selectedProviders.length > 0) {
      filtered = filtered.filter(course => selectedProviders.includes(course.provider));
    }

    // Category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(course => selectedCategories.includes(course.category));
    }

    // Level filter
    if (selectedLevels.length > 0) {
      filtered = filtered.filter(course => selectedLevels.includes(course.level));
    }

    // Price filter
    if (priceFilter !== 'all') {
      if (priceFilter === 'free') {
        filtered = filtered.filter(course => course.price === 'Free');
      } else if (priceFilter === 'paid') {
        filtered = filtered.filter(course => course.price !== 'Free');
      }
    }

    // Sorting
    if (sortBy === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'reviews') {
      filtered.sort((a, b) => b.reviewCount - a.reviewCount);
    } else if (sortBy === 'title') {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    }

    return filtered;
  }, [courses, searchQuery, selectedProviders, selectedCategories, selectedLevels, priceFilter, sortBy]);

  const handleSearch = (e) => {
    e.preventDefault();
    setShowSuggestions(false);
    setSearchParams({ search: searchQuery });
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    setSearchParams({ search: suggestion });
  };

  const handleBookmark = (courseId) => {
    setCourses(prev => prev.map(course => 
      course.id === courseId 
        ? { ...course, isBookmarked: !course.isBookmarked }
        : course
    ));
    
    const course = courses.find(c => c.id === courseId);
    toast({
      title: course?.isBookmarked ? "Bookmark Removed" : "Bookmark Added",
      description: course?.isBookmarked 
        ? `Removed "${course.title}" from bookmarks`
        : `Added "${course.title}" to bookmarks`,
    });
  };

  const toggleFilter = (filterType, value) => {
    if (filterType === 'provider') {
      setSelectedProviders(prev => 
        prev.includes(value) 
          ? prev.filter(p => p !== value)
          : [...prev, value]
      );
    } else if (filterType === 'category') {
      setSelectedCategories(prev => 
        prev.includes(value)
          ? prev.filter(c => c !== value)
          : [...prev, value]
      );
    } else if (filterType === 'level') {
      setSelectedLevels(prev => 
        prev.includes(value)
          ? prev.filter(l => l !== value)
          : [...prev, value]
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Search courses, topics, or instructors..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    className="pl-10 pr-4 py-3 text-lg"
                  />
                </div>
              </form>
              
              {/* Search Suggestions */}
              {showSuggestions && filteredSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-10 mt-1">
                  {filteredSuggestions.slice(0, 5).map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center"
                    >
                      <Search className="w-4 h-4 text-gray-400 mr-2" />
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Sort and View Controls */}
            <div className="flex items-center gap-4">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Most Relevant</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="reviews">Most Reviewed</SelectItem>
                  <SelectItem value="title">Alphabetical</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex border border-gray-300 rounded-md">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <div className="w-64 space-y-6">
            <Card className="p-4">
              <h3 className="font-semibold mb-4 flex items-center">
                <Filter className="w-5 h-5 mr-2" />
                Filters
              </h3>

              {/* Providers */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Platform</h4>
                <div className="space-y-2">
                  {mockProviders.map((provider) => (
                    <div key={provider.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={provider.name}
                        checked={selectedProviders.includes(provider.name)}
                        onCheckedChange={() => toggleFilter('provider', provider.name)}
                      />
                      <label htmlFor={provider.name} className="text-sm">{provider.name}</label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Category</h4>
                <div className="space-y-2">
                  {mockCategories.slice(0, 6).map((category) => (
                    <div key={category.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={category.name}
                        checked={selectedCategories.includes(category.name)}
                        onCheckedChange={() => toggleFilter('category', category.name)}
                      />
                      <label htmlFor={category.name} className="text-sm">{category.name}</label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Levels */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Level</h4>
                <div className="space-y-2">
                  {levels.map((level) => (
                    <div key={level} className="flex items-center space-x-2">
                      <Checkbox
                        id={level}
                        checked={selectedLevels.includes(level)}
                        onCheckedChange={() => toggleFilter('level', level)}
                      />
                      <label htmlFor={level} className="text-sm">{level}</label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div>
                <h4 className="font-medium mb-3">Price</h4>
                <Select value={priceFilter} onValueChange={setPriceFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Prices</SelectItem>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </Card>
          </div>

          {/* Results */}
          <div className="flex-1">
            <div className="mb-6">
              <p className="text-gray-600">
                Showing {filteredCourses.length} results
                {searchQuery && ` for "${searchQuery}"`}
              </p>
            </div>

            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course) => (
                  <Card key={course.id} className="group hover:shadow-lg transition-all duration-300">
                    <div className="relative">
                      <img 
                        src={course.thumbnail} 
                        alt={course.title}
                        className="w-full h-40 object-cover rounded-t-lg"
                      />
                      <Badge className="absolute top-2 right-2 bg-white text-gray-800">
                        {course.provider}
                      </Badge>
                      <Button
                        size="sm"
                        variant={course.isBookmarked ? "default" : "outline"}
                        onClick={() => handleBookmark(course.id)}
                        className="absolute top-2 left-2"
                      >
                        <BookMarked className="w-4 h-4" />
                      </Button>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-bold text-lg mb-2 line-clamp-2">{course.title}</h3>
                      <p className="text-gray-600 text-sm mb-2">{course.instructor}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                          <span>{course.rating}</span>
                          <span className="ml-1">({course.reviewCount})</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>{course.duration}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mb-3">
                        <Badge variant="outline">{course.level}</Badge>
                        <span className="font-semibold text-blue-600">{course.price}</span>
                      </div>
                      <Link to={`/course/${course.id}`}>
                        <Button className="w-full">View Details</Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredCourses.map((course) => (
                  <Card key={course.id} className="p-6">
                    <div className="flex gap-6">
                      <img 
                        src={course.thumbnail} 
                        alt={course.title}
                        className="w-32 h-24 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-xl">{course.title}</h3>
                          <div className="flex gap-2">
                            <Badge>{course.provider}</Badge>
                            <Button
                              size="sm"
                              variant={course.isBookmarked ? "default" : "outline"}
                              onClick={() => handleBookmark(course.id)}
                            >
                              <BookMarked className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-gray-600 mb-2">{course.instructor}</p>
                        <p className="text-gray-700 mb-3">{course.description}</p>
                        <div className="flex items-center gap-6 text-sm text-gray-500 mb-3">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                            <span>{course.rating}</span>
                            <span className="ml-1">({course.reviewCount})</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            <span>{course.duration}</span>
                          </div>
                          <Badge variant="outline">{course.level}</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-blue-600 text-lg">{course.price}</span>
                          <Link to={`/course/${course.id}`}>
                            <Button>View Details</Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {filteredCourses.length === 0 && (
              <div className="text-center py-16">
                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No courses found</h3>
                <p className="text-gray-500">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;