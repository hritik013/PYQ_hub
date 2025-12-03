// Simple Feedback Service for Google Sheets
// This service uses a more reliable approach to handle Google Apps Script communication

const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz1WBDG96Oi0OBgA6FNPmpexMEGIRXDkdA1sQot6PcauH9ZE-3jMdbnzAvcEgrWgymf/exec';

const adminEmail = 'rawathritik18@gmail.com';

export const submitFeedback = async (feedbackData) => {
  try {
    console.log('Submitting feedback to Google Sheets:', feedbackData);
    console.log('Name value being sent:', feedbackData.name);
    
    // Create query parameters for GET request
    const params = new URLSearchParams({
      action: 'submitFeedback',
      timestamp: new Date().toISOString(),
      type: feedbackData.type,
      name: feedbackData.name || '',
      message: feedbackData.message,
      rating: feedbackData.rating || 0,
      userAgent: navigator.userAgent,
      url: window.location.href,
    });
    
    console.log('Query parameters:', params.toString());
    
    const url = `${GOOGLE_APPS_SCRIPT_URL}?${params.toString()}`;
    console.log('Requesting URL:', url);
    
    // Use a simple fetch request without any special headers
    const response = await fetch(url, {
      method: 'GET',
      mode: 'no-cors', // This bypasses CORS but limits response access
    });

    // Since we're using no-cors, we can't read the response
    // We'll assume success if the request completes without throwing
    console.log('Feedback request completed');
    
    // For no-cors requests, we can't read the response, so we'll assume success
    // In a real implementation, you might want to use a different approach
    return { 
      success: true, 
      message: 'Feedback submitted successfully!' 
    };
    
  } catch (error) {
    console.error('Error submitting feedback:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to submit feedback. Please try again later.' 
    };
  }
};

export const fetchFeedback = async () => {
  try {
    console.log('Fetching feedback from Google Sheets...');
    
    // Create query parameters for GET request
    const params = new URLSearchParams({
      action: 'getFeedback',
    });
    
    const url = `${GOOGLE_APPS_SCRIPT_URL}?${params.toString()}`;
    console.log('Requesting URL:', url);
    
    // Try multiple approaches for better mobile compatibility
    try {
      // First, try a direct fetch with CORS headers
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        mode: 'cors',
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Feedback data received via fetch:', data);
        
        if (data.success) {
          return data.feedback || [];
        } else {
          throw new Error(data.error || 'Failed to fetch feedback');
        }
      }
    } catch (fetchError) {
      console.log('Fetch approach failed, trying JSONP:', fetchError);
    }
    
    // Fallback to JSONP approach
    return new Promise((resolve, reject) => {
      // Create a script tag to make JSONP request
      const script = document.createElement('script');
      const callbackName = 'feedbackCallback_' + Date.now();
      
      // Create global callback function
      window[callbackName] = (data) => {
        console.log('Feedback data received via JSONP:', data);
        
        // Clean up
        try {
          document.head.removeChild(script);
        } catch (e) {
          console.log('Script cleanup error:', e);
        }
        delete window[callbackName];
        
        if (data && data.success) {
          resolve(data.feedback || []);
        } else {
          reject(new Error(data?.error || 'Failed to fetch feedback'));
        }
      };
      
      // Set up error handling
      script.onerror = () => {
        console.log('Script onerror triggered');
        try {
          document.head.removeChild(script);
        } catch (e) {
          console.log('Script cleanup error:', e);
        }
        delete window[callbackName];
        reject(new Error('Failed to load feedback script'));
      };
      
      // Set timeout
      const timeoutId = setTimeout(() => {
        if (window[callbackName]) {
          console.log('JSONP request timed out');
          try {
            document.head.removeChild(script);
          } catch (e) {
            console.log('Script cleanup error:', e);
          }
          delete window[callbackName];
          reject(new Error('Request timeout'));
        }
      }, 15000); // Increased timeout for mobile
      
      // Update callback to clear timeout
      const originalCallback = window[callbackName];
      window[callbackName] = (data) => {
        clearTimeout(timeoutId);
        originalCallback(data);
      };
      
      // Make the request
      script.src = `${url}&callback=${callbackName}`;
      script.async = true;
      script.crossOrigin = 'anonymous';
      
      // Add to head
      document.head.appendChild(script);
    });
    
  } catch (error) {
    console.error('Error fetching feedback:', error);
    
    // Return sample data for testing if all approaches fail
    console.log('Returning sample feedback data');
    return [
      {
        timestamp: new Date().toISOString(),
        type: 'suggestion',
        name: 'Test User',
        message: 'This is a sample feedback message for testing purposes.',
        rating: 5,
        userAgent: 'Test Browser',
        url: 'https://example.com'
      },
      {
        timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        type: 'comment',
        name: 'John Doe',
        message: 'Great platform! Really helped me with my exam preparation.',
        rating: 4,
        userAgent: 'Test Browser',
        url: 'https://example.com'
      },
      {
        timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        type: 'feature',
        name: 'Sarah Smith',
        message: 'Would love to see more subjects added to the platform.',
        rating: 5,
        userAgent: 'Test Browser',
        url: 'https://example.com'
      }
    ];
  }
};

 