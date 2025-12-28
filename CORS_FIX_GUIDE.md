# 🔧 CORS Error Fix Guide

## Problem
```
Access to XMLHttpRequest at 'http://localhost:5000/api/auth/register' 
from origin 'https://myground.in' has been blocked by CORS policy
```

## Root Cause
Your frontend at `https://myground.in` is trying to call `http://localhost:5000` instead of your Render backend URL.

## ✅ Solution (2 Steps)

### Step 1: Set Frontend API URL in Netlify

1. **Go to Netlify Dashboard:**
   - Open your site → Site settings → Environment variables

2. **Add Environment Variable:**
   - **Key:** `VITE_API_URL`
   - **Value:** `https://your-backend-url.onrender.com/api`
   - Replace `your-backend-url.onrender.com` with your actual Render backend URL
   - **Example:** Your Render backend URL is `https://myground-1.onrender.com`, so:
     ```
     VITE_API_URL=https://myground-1.onrender.com/api
     ```

3. **Trigger New Deployment:**
   - After adding the variable, go to Deploys tab
   - Click "Trigger deploy" → "Deploy site"
   - This rebuilds your frontend with the correct API URL

### Step 2: Update Backend CORS in Render

1. **Go to Render Dashboard:**
   - Open your backend Web Service → Environment tab

2. **Update CORS_ORIGIN:**
   - Find or add: `CORS_ORIGIN`
   - **Value:** `https://myground.in,https://www.myground.in,http://localhost:5173,http://localhost:3000`
   - This allows both production frontend and localhost for development
   - Backend URL `https://myground-1.onrender.com` is already included in defaults

3. **Save Changes:**
   - Render will automatically redeploy

## ✅ Verification

After both steps:

1. **Check Frontend:**
   - Open browser console on `https://myground.in`
   - Try to register/login
   - Should see API calls to your Render backend (not localhost)

2. **Check Backend Logs:**
   - In Render dashboard → Logs
   - Should see successful API requests
   - No CORS errors

## 🔍 How to Find Your Render Backend URL

1. Go to Render dashboard
2. Click on your backend Web Service
3. Look at the top - you'll see the URL:
   - `https://myground-1.onrender.com` ✅ (Your backend URL)
4. Use this URL in `VITE_API_URL` with `/api` at the end:
   - `https://myground-1.onrender.com/api`

## ⚠️ Common Mistakes

- ❌ Using `http://` instead of `https://` (must use HTTPS in production)
- ❌ Forgetting `/api` at the end of the URL
- ❌ Using localhost URL in production
- ❌ Not triggering a new frontend deployment after adding environment variable

## 📝 Quick Checklist

- [ ] Added `VITE_API_URL` in Netlify with Render backend URL
- [ ] Triggered new frontend deployment
- [ ] Updated `CORS_ORIGIN` in Render with `https://myground.in`
- [ ] Verified API calls go to Render backend (check browser Network tab)
- [ ] Tested registration/login - should work now!

