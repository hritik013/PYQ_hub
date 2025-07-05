# AI Assistant Setup Guide

## 🚨 Current Issue
Your AI Assistant is not working because the OpenRouter API key is invalid or missing.

## 🔧 Quick Fix

### Step 1: Get a Free API Key
1. **Go to [OpenRouter.ai](https://openrouter.ai)**
2. **Sign up for a free account**
3. **Get your API key** from the dashboard
4. **Copy the key** (starts with `sk-or-v1-`)

### Step 2: Create Environment File
1. **Create a `.env` file** in your project root (same folder as `package.json`)
2. **Add this line** to the file:
   ```
   VITE_OPENROUTER_API_KEY=your_actual_api_key_here
   ```
3. **Replace** `your_actual_api_key_here` with your real API key

### Step 3: Restart Development Server
1. **Stop your dev server** (Ctrl+C)
2. **Start it again**:
   ```bash
   npm run dev
   ```

## 🎯 Alternative: Use OpenAI Directly

If you prefer to use OpenAI instead:

1. **Get an OpenAI API key** from [OpenAI.com](https://platform.openai.com)
2. **Add to `.env`**:
   ```
   VITE_OPENAI_API_KEY=your_openai_key_here
   ```
3. **Update the AI service** to use OpenAI instead of OpenRouter

## 🔍 Test Your Setup

After setting up the API key:

1. **Go to the AI Assistant page** (`/ai-assistant`)
2. **Try sending a message**
3. **Check browser console** (F12) for any errors
4. **The assistant should now respond** with helpful study guidance

## 💡 Example .env File

```
# AI Service API Keys
VITE_OPENROUTER_API_KEY=sk-or-v1-your-actual-key-here

# Alternative OpenAI
VITE_OPENAI_API_KEY=sk-your-openai-key-here

# Supabase (if you're using it)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
```

## 🆘 Troubleshooting

### "API key not configured" error
- Make sure your `.env` file is in the project root
- Restart your development server
- Check that the key starts with `sk-or-v1-`

### "401 Unauthorized" error
- Your API key is invalid or expired
- Get a new key from OpenRouter
- Make sure you copied the entire key

### "Network Error"
- Check your internet connection
- Try refreshing the page
- Check if OpenRouter is down

## 🎉 Success!

Once configured, your AI Assistant will:
- ✅ Answer study questions
- ✅ Provide exam preparation tips
- ✅ Help with PYQ analysis
- ✅ Give personalized study recommendations

The assistant uses advanced AI models to provide intelligent, context-aware responses for students preparing for exams. 