# Google Sheets Feedback Setup Guide

## Step 1: Set up Google Apps Script

1. **Open your Google Sheets**: https://docs.google.com/spreadsheets/d/1JElFqHOvHK4BrvtkN68NEAbKAd45QIZrBxQCCvlPIH8/edit?gid=0#gid=0

2. **Open Apps Script**:
   - Click on "Extensions" in the menu bar
   - Select "Apps Script"

3. **Replace the default code**:
   - Delete all existing code in the editor
   - Copy and paste the code from `google-apps-script.js` file

4. **Save the script**:
   - Click "Save" (or Ctrl+S)
   - Give it a name like "Feedback Handler"

5. **Deploy the script**:
   - Click "Deploy" button
   - Select "New deployment"
   - Choose "Web app" as the type
   - Set "Execute as" to "Me"
   - Set "Who has access" to "Anyone"
   - Click "Deploy"
   - **Copy the Web App URL** - you'll need this for the next step

## Step 2: Set up your spreadsheet headers

1. **Go back to your Google Sheets**
2. **Set up headers** (optional - the script will work without this):
   - In cell A1: `Timestamp`
   - In cell B1: `Feedback Type`
   - In cell C1: `Name`
   - In cell D1: `Message`
   - In cell E1: `Rating`
   - In cell F1: `User Agent`
   - In cell G1: `URL`

## Step 3: Update your feedback service

1. **Open** `src/services/feedbackService.js`
2. **Replace the GOOGLE_APPS_SCRIPT_URL** with your new Web App URL from Step 1

## Step 4: Test the feedback system

1. **Run your React app**
2. **Click the Feedback button** in the navbar
3. **Submit a test feedback**
4. **Check your Google Sheets** to see if the feedback appears
5. **Check the home page** to see if feedback is displayed at the bottom

## Step 5: Feedback Display Features

The feedback display section includes:
- **Real-time feedback loading** from your Google Sheets
- **Beautiful card layout** showing the 10 most recent feedback entries
- **Feedback type icons** (suggestion, comment, bug, feature)
- **Star ratings** for suggestions and comments
- **User names** (when provided)
- **Timestamps** showing when feedback was submitted
- **Responsive design** that works on all devices

## Troubleshooting

### If feedback doesn't appear in sheets:
1. Check the browser console for errors
2. Verify the Web App URL is correct
3. Make sure the Apps Script is deployed as a Web App
4. Check that "Who has access" is set to "Anyone"

### If you get CORS errors:
- The current implementation uses `mode: 'no-cors'` which should handle this
- If you still have issues, you may need to enable CORS in the Apps Script

### If you want to customize the sheet structure:
- Modify the `rowData` array in the `submitFeedback` function
- Update the headers accordingly

## Data Structure

The feedback will be stored with these columns:
- **Timestamp**: When the feedback was submitted
- **Feedback Type**: suggestion, comment, bug, or feature
- **Name**: User's name (optional)
- **Message**: The actual feedback text
- **Rating**: 1-5 star rating (for suggestions and comments)
- **User Agent**: Browser information
- **URL**: The page where feedback was submitted from 