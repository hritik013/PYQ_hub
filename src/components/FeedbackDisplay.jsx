import { useState, useEffect } from 'react';
import { MessageSquare, Star, AlertCircle, Heart, User, Clock } from 'lucide-react';
import { fetchFeedback } from '../services/feedbackService';

const FeedbackDisplay = () => {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadFeedback = async () => {
      try {
        setLoading(true);
        const data = await fetchFeedback();
        setFeedback(data);
        setError(null);
      } catch (err) {
        console.error('Failed to load feedback:', err);
        setError('Failed to load feedback');
      } finally {
        setLoading(false);
      }
    };

    loadFeedback();
  }, []);

  const getFeedbackIcon = (type) => {
    switch (type) {
      case 'suggestion':
        return <MessageSquare className="h-5 w-5 text-blue-500" />;
      case 'comment':
        return <MessageSquare className="h-5 w-5 text-green-500" />;
      case 'bug':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'feature':
        return <Heart className="h-5 w-5 text-purple-500" />;
      default:
        return <MessageSquare className="h-5 w-5 text-gray-500" />;
    }
  };

  const getFeedbackTypeLabel = (type) => {
    switch (type) {
      case 'suggestion':
        return 'Suggestion';
      case 'comment':
        return 'Comment';
      case 'bug':
        return 'Bug Report';
      case 'feature':
        return 'Feature Request';
      default:
        return 'Feedback';
    }
  };

  const formatDate = (timestamp) => {
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
      
      if (diffInHours < 1) {
        return 'Just now';
      } else if (diffInHours < 24) {
        return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
      } else {
        const diffInDays = Math.floor(diffInHours / 24);
        return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
      }
    } catch (error) {
      return 'Recently';
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <p className="mt-2 text-gray-600">Loading feedback...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  if (feedback.length === 0) {
    return (
      <div className="text-center py-12">
        <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">No feedback yet. Be the first to share your thoughts!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Real feedback from students using PYQ Hub to improve their exam preparation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {feedback.map((item, index) => (
          <div key={index} className="card hover:shadow-lg transition-shadow duration-200">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-2">
                {getFeedbackIcon(item.type)}
                <span className="text-sm font-medium text-gray-600">
                  {getFeedbackTypeLabel(item.type)}
                </span>
              </div>
              <div className="flex items-center space-x-1 text-gray-400">
                <Clock className="h-4 w-4" />
                <span className="text-xs">{formatDate(item.timestamp)}</span>
              </div>
            </div>

            {/* Name */}
            {item.name && (
              <div className="flex items-center space-x-2 mb-3">
                <User className="h-4 w-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">{item.name}</span>
              </div>
            )}

            {/* Rating */}
            {item.rating > 0 && (
              <div className="flex items-center space-x-1 mb-3">
                {renderStars(item.rating)}
                <span className="text-sm text-gray-600 ml-2">({item.rating}/5)</span>
              </div>
            )}

            {/* Message */}
            <div className="mb-4">
              <p className="text-gray-700 leading-relaxed">
                {item.message.length > 150 
                  ? `${item.message.substring(0, 150)}...` 
                  : item.message
                }
              </p>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span className="capitalize">{item.type}</span>
              {item.name && <span>By {item.name}</span>}
            </div>
          </div>
        ))}
      </div>

      {/* View All Feedback Link */}
      <div className="text-center pt-6">
        <button 
          onClick={() => {
            // You can add a modal or navigate to a feedback page here
            alert('This would show all feedback in a detailed view');
          }}
          className="text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200"
        >
          View All Feedback →
        </button>
      </div>
    </div>
  );
};

export default FeedbackDisplay; 