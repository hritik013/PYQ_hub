# Vercel Deployment Guide

## 🚀 Deploy PYQ Hub to Vercel

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Login to Vercel
```bash
vercel login
```
Choose "Continue with GitHub" and follow the prompts.

### Step 3: Deploy Your Project
```bash
vercel
```

Follow the prompts:
- Set up and deploy? → **Yes**
- Which scope? → **Select your account**
- Link to existing project? → **No**
- Project name? → **pyq-hub** (or your preferred name)
- Directory? → **./** (current directory)
- Override settings? → **No**

## 🔧 Fix AI Assistant on Vercel

### Issue: AI Assistant Not Working
The AI Assistant fails on Vercel because environment variables aren't configured.

### Solution: Set Environment Variables

1. **Go to Vercel Dashboard**
   - Visit [vercel.com/dashboard](https://vercel.com/dashboard)
   - Select your PYQ Hub project

2. **Add Environment Variables**
   - Go to **Settings** tab
   - Click **Environment Variables**
   - Add the following variables:

   ```
   Name: VITE_OPENROUTER_API_KEY
   Value: sk-or-v1-your-actual-api-key-here
   Environment: Production, Preview, Development
   ```

3. **Get Your API Key**
   - Go to [OpenRouter.ai](https://openrouter.ai)
   - Sign up/login and get your API key
   - Copy the key (starts with `sk-or-v1-`)

4. **Redeploy**
   - Go to **Deployments** tab
   - Click **Redeploy** on your latest deployment

## 🎯 Alternative: Use Vercel CLI

### Set Environment Variables via CLI
```bash
# Set the API key
vercel env add VITE_OPENROUTER_API_KEY

# When prompted, enter your API key
# Select all environments (Production, Preview, Development)

# Redeploy
vercel --prod
```

## 🔍 Troubleshooting

### AI Assistant Still Not Working?

1. **Check Environment Variables**
   - Go to Vercel Dashboard → Settings → Environment Variables
   - Verify `VITE_OPENROUTER_API_KEY` is set correctly

2. **Check Browser Console**
   - Open your deployed site
   - Press F12 → Console tab
   - Look for error messages

3. **Test API Connection**
   - Go to `/ai-assistant` page
   - Try sending a message
   - Check for specific error messages

4. **Common Errors**:
   - **"API Key Missing"** → Environment variable not set
   - **"401 Unauthorized"** → Invalid API key
   - **"Network Error"** → CORS or connectivity issue

### Debug Steps

1. **Verify API Key**
   ```bash
   # Check if environment variable is set
   vercel env ls
   ```

2. **Test Locally First**
   - Create `.env` file locally
   - Test AI Assistant locally
   - Ensure it works before deploying

3. **Check Vercel Logs**
   - Go to Vercel Dashboard → Functions
   - Check for any build or runtime errors

## 📝 Environment Variables Reference

### Required Variables
```
VITE_OPENROUTER_API_KEY=sk-or-v1-your-api-key
```

### Optional Variables (if using Supabase)
```
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## 🎉 Success Checklist

- ✅ **Vercel CLI installed and logged in**
- ✅ **Project deployed to Vercel**
- ✅ **Environment variables configured**
- ✅ **API key valid and working**
- ✅ **AI Assistant responding correctly**
- ✅ **All features working on live site**

## 🚀 Custom Domain (Optional)

1. **Go to Vercel Dashboard**
2. **Settings → Domains**
3. **Add your custom domain**
4. **Follow DNS configuration instructions**

## 📊 Monitoring

- **Vercel Analytics**: Built-in performance monitoring
- **Function Logs**: Check for API errors
- **Uptime**: Monitor site availability

---

**Your PYQ Hub will be live at**: `https://your-project-name.vercel.app`

**AI Assistant will work once you set the environment variables!** 