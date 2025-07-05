import { useState } from 'react';
import { X, MessageSquare, Star, AlertCircle, Send } from 'lucide-react';
import { submitFeedback } from '../services/feedbackService';

const FeedbackModal = ({ isOpen, onClose }) => {
  const [feedbackType, setFeedbackType] = useState('suggestion');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const feedbackTypes = [
    { id: 'suggestion', label: '💡 Suggestion', icon: MessageSquare },
    { id: 'comment', label: '💬 Comment', icon: MessageSquare },
    { id: 'bug', label: '🐛 Bug Report', icon: AlertCircle },
    { id: 'feature', label: '⭐ Feature Request', icon: Star },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSubmitting(true);
    
    try {
      // Prepare feedback data
      const feedbackData = {
        type: feedbackType,
        name: name.trim(),
        message: message.trim(),
        rating: rating
      };

      // Submit to Google Sheets
      const result = await submitFeedback(feedbackData);
      
      if (result.success) {
        setSubmitted(true);
        setName('');
        setMessage('');
        setRating(0);
        
        // Auto close after 3 seconds
        setTimeout(() => {
          onClose();
          setSubmitted(false);
        }, 3000);
      } else {
        // Show error message
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Feedback submission error:', error);
      alert('Failed to submit feedback. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setName('');
      setMessage('');
      setRating(0);
      setSubmitted(false);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-6 text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Share Your Feedback</h2>
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <p className="text-white/90 mt-2 text-sm">
            Help us improve PYQ Hub with your suggestions and comments
          </p>
        </div>

        {submitted ? (
          /* Success State */
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-accent-500 to-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Send className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Thank You!</h3>
            <p className="text-gray-600">
              Your feedback has been submitted successfully. We appreciate your input!
            </p>
          </div>
        ) : (
          /* Feedback Form */
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Feedback Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                What type of feedback is this?
              </label>
              <div className="grid grid-cols-2 gap-3">
                {feedbackTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setFeedbackType(type.id)}
                      className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                        feedbackType === type.id
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <Icon className="h-4 w-4" />
                        <span className="text-sm font-medium">{type.label}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Name Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Your Name (Optional)
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
              />
            </div>

            {/* Rating (for suggestions and comments) */}
            {(feedbackType === 'suggestion' || feedbackType === 'comment') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  How would you rate your experience?
                </label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`p-2 rounded-lg transition-colors ${
                        rating >= star
                          ? 'text-secondary-500 bg-secondary-50'
                          : 'text-gray-300 hover:text-secondary-400'
                      }`}
                    >
                      <Star className="h-6 w-6 fill-current" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Message Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Your {feedbackType === 'suggestion' ? 'suggestion' : feedbackType === 'comment' ? 'comment' : feedbackType === 'bug' ? 'bug report' : 'feature request'}
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={
                  feedbackType === 'suggestion'
                    ? 'Share your ideas to improve PYQ Hub...'
                    : feedbackType === 'comment'
                    ? 'Tell us what you think about PYQ Hub...'
                    : feedbackType === 'bug'
                    ? 'Describe the issue you encountered...'
                    : 'Describe the feature you would like to see...'
                }
                className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent resize-none"
                required
              />
            </div>

            {/* Submit Button */}
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !message.trim()}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Submit Feedback</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default FeedbackModal; 