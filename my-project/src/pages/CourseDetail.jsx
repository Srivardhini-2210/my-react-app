/* import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  Star, 
  Users, 
  Clock, 
  Globe, 
  Award, 
  BookOpen, 
  CheckCircle, 
  Play,
  Heart,
  Share2,
  ArrowLeft,
  DollarSign,
  TrendingUp,
  User,
  Calendar
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Progress } from '../components/ui/progress';
import { Separator } from '../components/ui/separator';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [userProgress, setUserProgress] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState('');

  useEffect(() => {
    fetchCourseDetails();
    fetchUserProgress();
    fetchRecommendations();
    // eslint-disable-next-line
  }, [courseId]);

  const fetchCourseDetails = async () => {
    try {
      const response = await axios.get(`${API}/courses/${courseId}`);
      setCourse(response.data);
    } catch (err) {
      setError('Failed to load course details');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProgress = async () => {
    try {
      // Mock user ID - in real app, get from auth context
      const mockUserId = 'user123';
      const response = await axios.get(`${API}/user-progress/${mockUserId}`);
      const courseProgress = response.data.find(p => p.course_id === courseId);
      setUserProgress(courseProgress);
    } catch (err) {
      console.log('No progress found');
    }
  };

  const fetchRecommendations = async () => {
    try {
      const mockUserId = 'user123';
      const response = await axios.get(`${API}/recommendations/${mockUserId}?limit=3`);
      setRecommendations(response.data.recommendations);
    } catch (err) {
      console.log('Failed to load recommendations');
    }
  };

  const handleMarkCompleted = async () => {
    if (!selectedDifficulty) {
      alert('Please select your experienced difficulty level');
      return;
    }

    try {
      const mockUserId = 'user123';
      await axios.post(`${API}/user-progress/mark-completed`, null, {
        params: {
          user_id: mockUserId,
          course_id: courseId,
          difficulty_experienced: selectedDifficulty
        }
      });
      
      setShowCompletionModal(false);
      fetchUserProgress();
      alert('Course marked as completed!');
    } catch (err) {
      alert('Failed to mark course as completed');
    }
  };

  const handleAddToComparison = () => {
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Course Not Found</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => navigate('/courses')}>Back to Courses</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
   
    </div>
  );
};

export default CourseDetail;  */