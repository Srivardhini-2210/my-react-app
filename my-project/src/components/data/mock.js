export const mockCourses = [
  {
    id: '1',
    title: 'Machine Learning Fundamentals',
    provider: 'NPTEL',
    instructor: 'Dr. Priya Sharma',
    rating: 4.7,
    reviewCount: 2845,
    duration: '12 weeks',
    level: 'Beginner',
    price: 'Free',
    thumbnail: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=250&fit=crop',
    description: 'Comprehensive introduction to machine learning concepts, algorithms, and practical applications.',
    category: 'Data Science',
    tags: ['machine-learning', 'python', 'algorithms'],
    startDate: '2024-02-15',
    isBookmarked: false,
    reviews: [
      {
        id: '1',
        user: 'Sarah Johnson',
        rating: 5,
        comment: 'Excellent course with clear explanations and practical examples.',
        date: '2024-01-15'
      },
      {
        id: '2',
        user: 'Mike Chen',
        rating: 4,
        comment: 'Good content but could use more hands-on projects.',
        date: '2024-01-10'
      }
    ]
  },
  {
    id: '2',
    title: 'Full Stack Web Development',
    provider: 'Coursera',
    instructor: 'Prof. David Wilson',
    rating: 4.5,
    reviewCount: 1923,
    duration: '16 weeks',
    level: 'Intermediate',
    price: '$49/month',
    thumbnail: 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=400&h=250&fit=crop',
    description: 'Learn to build modern web applications using React, Node.js, and MongoDB.',
    category: 'Web Development',
    tags: ['react', 'nodejs', 'mongodb', 'javascript'],
    startDate: '2024-02-20',
    isBookmarked: true,
    reviews: []
  },
  {
    id: '3',
    title: 'Python for Data Analysis',
    provider: 'Udemy',
    instructor: 'Dr. Emily Rodriguez',
    rating: 4.8,
    reviewCount: 3567,
    duration: '8 weeks',
    level: 'Beginner',
    price: '$79.99',
    thumbnail: 'https://images.unsplash.com/photo-1526379879527-8559ecfcaec0?w=400&h=250&fit=crop',
    description: 'Master Python programming for data analysis with pandas, NumPy, and matplotlib.',
    category: 'Programming',
    tags: ['python', 'data-analysis', 'pandas', 'numpy'],
    startDate: '2024-02-10',
    isBookmarked: false,
    reviews: []
  },
  {
    id: '4',
    title: 'Digital Marketing Strategy',
    provider: 'Coursera',
    instructor: 'Prof. Lisa Anderson',
    rating: 4.3,
    reviewCount: 1456,
    duration: '6 weeks',
    level: 'Beginner',
    price: '$39/month',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop',
    description: 'Learn comprehensive digital marketing strategies and tools for modern businesses.',
    category: 'Marketing',
    tags: ['marketing', 'digital-strategy', 'analytics'],
    startDate: '2024-02-25',
    isBookmarked: false,
    reviews: []
  },
  {
    id: '5',
    title: 'Introduction to Cloud Computing',
    provider: 'NPTEL',
    instructor: 'Dr. Rajesh Kumar',
    rating: 4.6,
    reviewCount: 2134,
    duration: '10 weeks',
    level: 'Intermediate',
    price: 'Free',
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=250&fit=crop',
    description: 'Explore cloud computing fundamentals, services, and deployment models.',
    category: 'Cloud Computing',
    tags: ['cloud', 'aws', 'azure', 'deployment'],
    startDate: '2024-03-01',
    isBookmarked: true,
    reviews: []
  },
  {
    id: '6',
    title: 'UX/UI Design Masterclass',
    provider: 'Udemy',
    instructor: 'Maria Garcia',
    rating: 4.7,
    reviewCount: 2891,
    duration: '14 weeks',
    level: 'Beginner',
    price: '$99.99',
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=250&fit=crop',
    description: 'Complete guide to user experience and interface design principles and tools.',
    category: 'Design',
    tags: ['ux', 'ui', 'design', 'figma', 'adobe'],
    startDate: '2024-02-18',
    isBookmarked: false,
    reviews: []
  }
];

export const mockCategories = [
  { id: '1', name: 'Data Science', count: 156 },
  { id: '2', name: 'Web Development', count: 234 },
  { id: '3', name: 'Programming', count: 189 },
  { id: '4', name: 'Marketing', count: 87 },
  { id: '5', name: 'Cloud Computing', count: 98 },
  { id: '6', name: 'Design', count: 123 },
  { id: '7', name: 'Business', count: 76 },
  { id: '8', name: 'Artificial Intelligence', count: 145 }
];

export const mockProviders = [
  { id: '1', name: 'NPTEL', logo: 'https://via.placeholder.com/60x30/1f2937/ffffff?text=NPTEL' },
  { id: '2', name: 'Coursera', logo: 'https://via.placeholder.com/60x30/0056d3/ffffff?text=Coursera' },
  { id: '3', name: 'Udemy', logo: 'https://via.placeholder.com/60x30/a435f0/ffffff?text=Udemy' }
];

export const mockReminders = [
  {
    id: '1',
    courseId: '1',
    courseName: 'Machine Learning Fundamentals',
    reminderDate: '2024-02-15T10:00:00Z',
    type: 'start_date',
    message: 'Course starts today!'
  },
  {
    id: '2',
    courseId: '2',
    courseName: 'Full Stack Web Development',
    reminderDate: '2024-02-19T15:30:00Z',
    type: 'assignment_due',
    message: 'Assignment due tomorrow'
  }
];

export const searchSuggestions = [
  'Machine Learning',
  'Web Development', 
  'Python Programming',
  'Data Science',
  'React JS',
  'Digital Marketing',
  'Cloud Computing',
  'UX Design',
  'JavaScript',
  'Artificial Intelligence'
];