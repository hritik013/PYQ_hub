import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Upload, Search, Bot, BookOpen, TrendingUp, Upload as UploadIcon, Users } from 'lucide-react';
import { fetchPYQsFromSupabase } from '../services/supabaseService';
import FeedbackDisplay from '../components/FeedbackDisplay';

const Home = () => {
  const features = [
    {
      icon: Upload,
      title: 'Upload PYQs',
      description: 'Easily upload previous year question papers with automatic categorization',
      path: '/upload',
      color: 'bg-blue-500',
    },
    {
      icon: Search,
      title: 'Browse PYQs',
      description: 'Search and filter question papers by subject, semester, and year',
      path: '/browse',
      color: 'bg-green-500',
    },
    {
      icon: Bot,
      title: 'AI Assistant',
      description: 'Get intelligent study suggestions based on question paper analysis',
      path: '/ai-assistant',
      color: 'bg-purple-500',
    },
  ];

  const [stats, setStats] = useState([
    { label: 'Total PYQs', value: '0', icon: BookOpen },
    { label: 'Subjects', value: '0', icon: TrendingUp },
    { label: 'Active Users', value: '0', icon: Users },
  ]);

  // Function to track active users
  const trackActiveUser = () => {
    const now = Date.now();
    const visitorId = Math.random().toString(36).substr(2, 9);
    const visitorData = {
      id: visitorId,
      timestamp: now,
      lastActive: now
    };

    // Get existing visitors
    const existingVisitors = JSON.parse(localStorage.getItem('pyqVisitors') || '[]');
    
    // Add current visitor
    existingVisitors.push(visitorData);
    
    // Filter visitors active within last 10 seconds
    const tenSecondsAgo = now - 10000;
    const activeVisitors = existingVisitors.filter(visitor => visitor.lastActive > tenSecondsAgo);
    
    // Clean up old visitors (older than 1 hour)
    const oneHourAgo = now - 3600000;
    const recentVisitors = existingVisitors.filter(visitor => visitor.lastActive > oneHourAgo);
    
    // Save updated visitors list
    localStorage.setItem('pyqVisitors', JSON.stringify(recentVisitors));
    
    return activeVisitors.length;
  };

  // Function to get active user count
  const getActiveUserCount = () => {
    const now = Date.now();
    const tenSecondsAgo = now - 10000;
    const visitors = JSON.parse(localStorage.getItem('pyqVisitors') || '[]');
    const activeVisitors = visitors.filter(visitor => visitor.lastActive > tenSecondsAgo);
    return activeVisitors.length;
  };

  useEffect(() => {
    const loadStats = async () => {
      try {
        const pyqs = await fetchPYQsFromSupabase();
        const totalPYQs = pyqs.length;
        const uniqueSubjects = [...new Set(pyqs.map(pyq => pyq.subject).filter(Boolean))];
        const totalSubjects = uniqueSubjects.length;

        // Track current user and get active count
        const activeUsers = trackActiveUser();

        setStats([
          { label: 'Total PYQs', value: totalPYQs.toString(), icon: BookOpen },
          { label: 'Subjects', value: totalSubjects.toString(), icon: TrendingUp },
          { label: 'Active Users', value: activeUsers.toString(), icon: Users },
        ]);
      } catch (error) {
        console.error('Failed to load stats:', error);
      }
    };

    loadStats();

    // Update active users count every 2 seconds
    const interval = setInterval(() => {
      const activeUsers = getActiveUserCount();
      setStats(prevStats => 
        prevStats.map(stat => 
          stat.label === 'Active Users' 
            ? { ...stat, value: activeUsers.toString() }
            : stat
        )
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Update user activity every 2 seconds
  useEffect(() => {
    const updateActivity = () => {
      const visitors = JSON.parse(localStorage.getItem('pyqVisitors') || '[]');
      const currentVisitor = visitors[visitors.length - 1];
      if (currentVisitor) {
        currentVisitor.lastActive = Date.now();
        localStorage.setItem('pyqVisitors', JSON.stringify(visitors));
      }
    };

    const activityInterval = setInterval(updateActivity, 1000);
    return () => clearInterval(activityInterval);
  }, []);

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
          Your Gateway to
          <span className="text-primary-600"> Academic Success</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Access, analyze, and learn from previous year question papers with AI-powered insights. 
          Upload PYQs, browse by subject, and get personalized study recommendations.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/upload" className="btn-primary text-lg px-8 py-3">
            Upload Your First PYQ
          </Link>
          <Link to="/browse" className="btn-secondary text-lg px-8 py-3">
            Browse PYQs
          </Link>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="card text-center">
              <div className="flex justify-center mb-4">
                <Icon className="h-8 w-8 text-primary-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* Features Section */}
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">What You Can Do</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our platform provides everything you need to excel in your studies with previous year question papers.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Link
                key={index}
                to={feature.path}
                className="card hover:shadow-lg transition-shadow duration-200 group"
              >
                <div className={`inline-flex p-3 rounded-lg ${feature.color} mb-4 group-hover:scale-110 transition-transform duration-200`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* CTA Section */}
      <div className="card text-center bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="text-primary-100 mb-6 max-w-2xl mx-auto">
          Join thousands of students who are already using PYQ Hub to improve their exam preparation.
        </p>
        <Link to="/upload" className="bg-white text-primary-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg transition-colors duration-200">
          Start Uploading PYQs
        </Link>
      </div>

      {/* Feedback Display Section */}
      <FeedbackDisplay />
    </div>
  );
};

export default Home; 