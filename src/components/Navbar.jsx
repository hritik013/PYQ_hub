import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Upload, Search, X } from 'lucide-react';
import { useState } from 'react';
import FeedbackModal from './FeedbackModal';

const Navbar = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  const navItems = [
    { path: '/', label: 'Home', icon: BookOpen },
    { path: '/upload', label: 'Upload PYQ', icon: Upload },
    { path: '/browse', label: 'Browse PYQs', icon: Search },
    { path: '/ai-assistant', label: 'AI Assistant', icon: 'bot' },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-lg border-b border-primary-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center space-x-3">
            <img 
              src="/logo.gif" 
              alt="PYQ Hub Logo" 
              className="h-[150px] w-[150px] object-cover"
            />
          </Link>
          
          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                  }`}
                >
                  {item.icon === 'bot' ? (
                    <img src="/bot.png" alt="AI Assistant" className="h-4 w-4 object-cover" />
                  ) : (
                    <Icon className="h-4 w-4" />
                  )}
                  <span>{item.label}</span>
                </Link>
              );
            })}
            
            {/* Feedback Button */}
            <button
              onClick={() => setIsFeedbackOpen(true)}
              className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-primary-600 hover:bg-gray-50 transition-colors duration-200"
            >
              <img src="/feedback.png" alt="Feedback" className="h-4 w-4 object-cover" />
              <span>Feedback</span>
            </button>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={toggleMobileMenu}
              className="text-gray-600 hover:text-gray-900 p-2"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={closeMobileMenu}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                      isActive
                        ? 'text-primary-600 bg-primary-50'
                        : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                    }`}
                  >
                    {item.icon === 'bot' ? (
                      <img src="/bot.png" alt="AI Assistant" className="h-5 w-5 object-cover" />
                    ) : (
                      <Icon className="h-5 w-5" />
                    )}
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              
              {/* Mobile Feedback Button */}
              <button
                onClick={() => {
                  setIsFeedbackOpen(true);
                  closeMobileMenu();
                }}
                className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-primary-600 hover:bg-gray-50 transition-colors duration-200 w-full"
              >
                <img src="/feedback.png" alt="Feedback" className="h-5 w-5 object-cover" />
                <span>Feedback</span>
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Feedback Modal */}
      <FeedbackModal 
        isOpen={isFeedbackOpen} 
        onClose={() => setIsFeedbackOpen(false)} 
      />
    </nav>
  );
};

export default Navbar; 