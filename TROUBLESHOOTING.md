# Troubleshooting: Name Field Not Appearing in Google Sheets

## Step 1: Check Browser Console

1. **Open your browser's Developer Tools** (F12)
2. **Go to the Console tab**
3. **Submit a feedback with a name**
4. **Look for these log messages**:
   - `Submitting feedback to Google Sheets:`
   - `Name value being sent:`
   - `Query parameters:`

## Step 2: Check Google Apps Script Logs

1. **Go to your Google Apps Script project**
2. **Click on "Executions" in the left sidebar**
3. **Look for recent executions**
4. **Click on an execution to see the logs**
5. **Check for these messages**:
   - `Received parameters:`
   - `Processed data - Name:`

## Step 3: Verify Your Setup

### Check if you're using the updated script:
1. **Open your Google Apps Script**
2. **Look for the `name` parameter in the `submitFeedback` function**
3. **Make sure it has this line**: `const name = params.name || '';`

### Check your spreadsheet headers:
1. **Open your Google Sheets**
2. **Verify Column C has "Name" as the header**
3. **If not, add "Name" to cell C1**

## Step 4: Common Issues and Solutions

### Issue 1: Old Google Apps Script URL
**Problem**: You're still using the old script URL that doesn't handle the name field.

**Solution**: 
1. Deploy a new version of the Google Apps Script
2. Update the `GOOGLE_APPS_SCRIPT_URL` in `feedbackService.js`

### Issue 2: Wrong Spreadsheet
**Problem**: The script is connected to a different spreadsheet.

**Solution**:
1. Make sure you're editing the Apps Script from the correct spreadsheet
2. The script should be bound to your feedback spreadsheet

### Issue 3: Column Mismatch
**Problem**: The data is being inserted in the wrong columns.

**Solution**:
1. Check the `rowData` array in the script
2. Make sure the order matches your spreadsheet headers

## Step 5: Test the Fix

1. **Update your Google Apps Script** with the new code
2. **Deploy a new version**
3. **Update the URL** in your `feedbackService.js`
4. **Test with a new feedback submission**

## Step 6: Manual Test

You can test the Google Apps Script directly:

1. **Open your Google Apps Script**
2. **Click "Run" on the `submitFeedback` function**
3. **Add test parameters**:
   ```javascript
   {
     action: 'submitFeedback',
     timestamp: '2024-01-01T00:00:00.000Z',
     type: 'test',
     name: 'Test User',
     message: 'Test message',
     rating: 5,
     userAgent: 'Test Browser',
     url: 'https://example.com'
   }
   ```

## Expected Data Structure

Your Google Sheets should have these columns:
- **A**: Timestamp
- **B**: Feedback Type
- **C**: Name ← This is where the name should appear
- **D**: Message
- **E**: Rating
- **F**: User Agent
- **G**: URL

## Debug Information

If you're still having issues, please check:
1. **Browser console logs** (what values are being sent?)
2. **Google Apps Script execution logs** (what values are being received?)
3. **Spreadsheet structure** (are the columns in the right order?)
4. **Script URL** (are you using the latest deployed version?) 