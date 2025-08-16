import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/Button';
import { Badge } from './ui/badge';
import CourseCard from './CourseCard';
import { 
  TrendingUp, 
  User, 
  Clock, 
  Target, 
  BookOpen, 
  Star,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { courses, subjects } from '../data/mockData';

const PersonalizedRecommendations = ({ userId = null }) => {
  const [userProfile, setUserProfile] = useState({
    interests: ['Data Science', 'Machine Learning', 'Computer Science'],
    skillLevel: 'Intermediate',
    preferredDuration: 'Medium', // Short, Medium, Long
    completedCourses: [1, 3], // Course IDs
    bookmarkedCourses: [2, 4],
    searchHistory: ['machine learning', 'python', 'data analysis'],
    timeSpent: {
      'Computer Science': 120, // minutes
      'Data Science': 85,
      'Business': 30
    }
  });

  const [recommendations, setRecommendations] = useState({
    forYou: [],
    trending: [],
    similar: [],
    newCourses: [],
    skillBased: []
  });

  // Mock recommendation algorithm
  useEffect(() => {
    generateRecommendations();
  }, [userProfile]);

  const generateRecommendations = () => {
    // For You - Based on interests and past behavior
    const forYouCourses = courses.filter(course => 
      userProfile.interests.some(interest => 
        course.subjects.includes(interest) || 
        course.title.toLowerCase().includes(interest.toLowerCase())
      ) && 
      !userProfile.completedCourses.includes(course.id) &&
      course.level === userProfile.skillLevel
    ).slice(0, 6);

    // Trending - Popular courses with high ratings
    const trendingCourses = courses
      .filter(course => course.rating >= 4.7 && course.reviews > 50000)
      .sort((a, b) => b.reviews - a.reviews)
      .slice(0, 4);

    // Similar to completed courses
    const completedCoursesData = courses.filter(course => 
      userProfile.completedCourses.includes(course.id)
    );
    
    const similarCourses = courses.filter(course => 
      completedCoursesData.some(completed => 
        completed.subjects.some(subject => course.subjects.includes(subject))
      ) && 
      !userProfile.completedCourses.includes(course.id) &&
      !userProfile.bookmarkedCourses.includes(course.id)
    ).slice(0, 4);

    // New courses in interested subjects
    const newCourses = courses.filter(course => 
      userProfile.interests.some(interest => course.subjects.includes(interest)) &&
      new Date(course.startDate) > new Date('2024-01-01')
    ).slice(0, 4);

    // Skill-based recommendations
    const skillBasedCourses = courses.filter(course => {
      const userLevel = userProfile.skillLevel;
      if (userLevel === 'Beginner') return course.level === 'Intermediate';
      if (userLevel === 'Intermediate') return ['Advanced', 'Intermediate'].includes(course.level);
      return course.level === 'Advanced';
    }).slice(0, 4);

    setRecommendations({
      forYou: forYouCourses,
      trending: trendingCourses,
      similar: similarCourses,
      newCourses: newCourses,
      skillBased: skillBasedCourses
    });
  };

  const RecommendationSection = ({ title, description, courses, icon: Icon, showAll = false }) => {
    const [showMore, setShowMore] = useState(false);
    const displayCourses = showMore ? courses : courses.slice(0, 3);

    if (courses.length === 0) return null;

    return (
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-50">
              <Icon className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg">{title}</CardTitle>
              <p className="text-sm text-gray-600 mt-1">{description}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            {displayCourses.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
          
          {courses.length > 3 && (
            <div className="text-center">
              <Button 
                variant="outline" 
                onClick={() => setShowMore(!showMore)}
                className="gap-2"
              >
                {showMore ? 'Show Less' : `Show ${courses.length - 3} More`}
                <ChevronRight className={`h-4 w-4 transition-transform ${showMore ? 'rotate-90' : ''}`} />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const UserInsights = () => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-600" />
          Your Learning Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Learning Time */}
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600">
              {Object.values(userProfile.timeSpent).reduce((a, b) => a + b, 0)} min
            </div>
            <div className="text-sm text-gray-600">Learning Time</div>
          </div>

          {/* Completed Courses */}
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <BookOpen className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600">
              {userProfile.completedCourses.length}
            </div>
            <div className="text-sm text-gray-600">Completed Courses</div>
          </div>

          {/* Skill Level */}
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <Target className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <div className="text-lg font-bold text-purple-600">
              {userProfile.skillLevel}
            </div>
            <div className="text-sm text-gray-600">Current Level</div>
          </div>
        </div>

        {/* Top Interests */}
        <div className="mt-6">
          <h4 className="font-semibold mb-3">Your Interests</h4>
          <div className="flex flex-wrap gap-2">
            {userProfile.interests.map((interest, index) => (
              <Badge key={index} variant="secondary" className="gap-1">
                {interest}
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* User Insights */}
      <UserInsights />

      {/* Personalized Recommendations */}
      <RecommendationSection
        title="Recommended For You"
        description="Based on your interests and learning history"
        courses={recommendations.forYou}
        icon={User}
      />

      <RecommendationSection
        title="Trending Now"
        description="Popular courses with high ratings this month"
        courses={recommendations.trending}
        icon={TrendingUp}
      />

      <RecommendationSection
        title="Because You Completed"
        description="Similar to courses you've already finished"
        courses={recommendations.similar}
        icon={Star}
      />

      <RecommendationSection
        title="New in Your Interests"
        description="Latest courses in your favorite subjects"
        courses={recommendations.newCourses}
        icon={Sparkles}
      />

      <RecommendationSection
        title="Level Up Your Skills"
        description="Next level courses to advance your expertise"
        courses={recommendations.skillBased}
        icon={Target}
      />

      {/* Personalization Tips */}
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Improve Your Recommendations</h3>
            <p className="text-gray-600 mb-4">
              Help us suggest better courses by updating your learning preferences
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button variant="outline" size="sm">Update Interests</Button>
              <Button variant="outline" size="sm">Set Learning Goals</Button>
              <Button variant="outline" size="sm">Review Skill Level</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PersonalizedRecommendations;