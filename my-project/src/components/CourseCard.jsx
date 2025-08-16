import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/Button';
import { Badge } from './ui/badge';
import { Star, Clock, Users, BookOpen, Heart } from 'lucide-react';

const CourseCard = ({ course, className = '' }) => {
  const handleBookmark = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Mock bookmark functionality
    console.log('Bookmarked course:', course.title);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating) 
            ? 'fill-yellow-400 text-yellow-400' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <Link to={`/course/${course.id}`}>
      <Card className={`group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ${className}`}>
        {/* Course Image */}
        <div className="relative overflow-hidden rounded-t-lg">
          <img
            src={course.image}
            alt={course.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 right-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBookmark}
              className="h-8 w-8 bg-white/90 hover:bg-white text-gray-600 hover:text-red-500 transition-colors"
            >
              <Heart className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Price Badge */}
          <div className="absolute top-3 left-3">
            <Badge 
              variant={course.price === 'Free' ? 'secondary' : 'default'}
              className={course.price === 'Free' ? 'bg-green-100 text-green-800' : 'bg-blue-600 text-white'}
            >
              {course.price}
            </Badge>
          </div>
        </div>

        <CardHeader className="pb-2">
          {/* Provider */}
          <div className="flex items-center gap-2 mb-2">
            <img
              src={course.providerLogo}
              alt={course.provider}
              className="w-6 h-6 rounded"
            />
            <span className="text-sm text-gray-600">{course.provider}</span>
            <Badge variant="outline" className="ml-auto text-xs">
              {course.platform}
            </Badge>
          </div>

          {/* Title */}
          <h3 className="font-semibold text-lg leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors">
            {course.title}
          </h3>
        </CardHeader>

        <CardContent className="pt-0">
          {/* Rating and Reviews */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex">
              {renderStars(course.rating)}
            </div>
            <span className="font-semibold text-sm">{course.rating}</span>
            <span className="text-gray-500 text-sm">
              ({course.reviews.toLocaleString()} reviews)
            </span>
          </div>

          {/* Course Info */}
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{course.duration}</span>
            </div>
            <div className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              <span>{course.level}</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 line-clamp-2 mb-4">
            {course.description}
          </p>

          {/* Subjects */}
          <div className="flex flex-wrap gap-1 mb-4">
            {course.subjects.slice(0, 2).map((subject, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {subject}
              </Badge>
            ))}
          </div>

          {/* Certificate Price */}
          {course.priceCert && course.price === 'Free' && (
            <div className="text-sm text-gray-600">
              Certificate: <span className="font-semibold">{course.priceCert}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};

export default CourseCard;