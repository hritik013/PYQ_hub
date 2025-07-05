// Google Apps Script for Feedback Collection
// This script handles feedback submissions and stores them in Google Sheets

function doGet(e) {
  try {
    // Get parameters from the request
    const params = e.parameter;
    const action = params.action;
    const callback = params.callback;
    
    let data;
    if (action === 'submitFeedback') {
      data = submitFeedback(params);
    } else if (action === 'getFeedback') {
      data = getFeedback(params);
    } else {
      data = {
        success: false,
        error: 'Invalid action'
      };
    }
    
    // If callback is provided, use JSONP
    if (callback) {
      const jsonpResponse = `${callback}(${JSON.stringify(data)})`;
      return ContentService.createTextOutput(jsonpResponse)
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
    } else {
      // Regular JSON response
      return ContentService.createTextOutput(JSON.stringify(data))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
  } catch (error) {
    const errorData = {
      success: false,
      error: error.toString()
    };
    
    const callback = e.parameter.callback;
    if (callback) {
      const jsonpResponse = `${callback}(${JSON.stringify(errorData)})`;
      return ContentService.createTextOutput(jsonpResponse)
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
    } else {
      return ContentService.createTextOutput(JSON.stringify(errorData))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }
}

function submitFeedback(params) {
  try {
    // Log all parameters for debugging
    console.log('Received parameters:', JSON.stringify(params));
    
    // Get the active spreadsheet (this will be your feedback sheet)
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadsheet.getActiveSheet();
    
    // Prepare the data to insert
    const timestamp = params.timestamp || new Date().toISOString();
    const type = params.type || 'general';
    const name = params.name || '';
    const message = params.message || '';
    const rating = params.rating || 0;
    const userAgent = params.userAgent || '';
    const url = params.url || '';
    
    // Log the processed data
    console.log('Processed data - Name:', name, 'Type:', type, 'Message:', message);
    
    // Create row data
    const rowData = [
      timestamp,           // Column A: Timestamp
      type,               // Column B: Feedback Type
      name,               // Column C: Name
      message,            // Column D: Message
      rating,             // Column E: Rating
      userAgent,          // Column F: User Agent
      url                 // Column G: URL
    ];
    
    // Add the row to the sheet
    sheet.appendRow(rowData);
    
    // Return success data
    return {
      success: true,
      message: 'Feedback submitted successfully'
    };
    
  } catch (error) {
    return {
      success: false,
      error: error.toString()
    };
  }
}

function getFeedback(params) {
  try {
    console.log('Fetching feedback from Google Sheets...');
    
    // Get the active spreadsheet
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadsheet.getActiveSheet();
    
    // Get all data from the sheet
    const data = sheet.getDataRange().getValues();
    
    // Skip the header row and process the data
    const feedback = [];
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (row.length >= 7) { // Make sure we have all columns
        feedback.push({
          timestamp: row[0] || '',
          type: row[1] || '',
          name: row[2] || '',
          message: row[3] || '',
          rating: row[4] || 0,
          userAgent: row[5] || '',
          url: row[6] || ''
        });
      }
    }
    
    // Sort by timestamp (newest first)
    feedback.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    // Limit to the most recent 10 feedback entries
    const recentFeedback = feedback.slice(0, 10);
    
    console.log('Returning feedback:', recentFeedback.length, 'entries');
    
    return {
      success: true,
      feedback: recentFeedback
    };
    
  } catch (error) {
    console.error('Error fetching feedback:', error);
    return {
      success: false,
      error: error.toString()
    };
  }
}

// Optional: Function to set up the sheet headers
function setupSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getActiveSheet();
  
  // Set headers
  const headers = [
    'Timestamp',
    'Feedback Type',
    'Name',
    'Message',
    'Rating',
    'User Agent',
    'URL'
  ];
  
  // Clear existing content and set headers
  sheet.clear();
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Format headers
  sheet.getRange(1, 1, 1, headers.length)
    .setFontWeight('bold')
    .setBackground('#4285f4')
    .setFontColor('white');
  
  // Auto-resize columns
  sheet.autoResizeColumns(1, headers.length);
} 