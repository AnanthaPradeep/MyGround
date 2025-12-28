# Quick Deployment Guide for MyGround

## 🚀 Quick Start (5 Minutes)

### Step 1: Deploy Frontend to Netlify

1. **Push code to GitHub:**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect to Netlify:**
   - Go to [netlify.com](https://netlify.com) and sign in
   - Click "Add new site" → "Import an existing project"
   - Select your GitHub repository
   - **Base directory:** `frontend`
   - **Build command:** `npm run build` (auto-detected)
   - **Publish directory:** `dist` (auto-detected)

3. **Add Environment Variable:**
   - Go to Site settings → Environment variables
   - Add: `VITE_API_URL` = `https://your-backend-url.com/api`
   - (You'll update this after deploying backend)

4. **Deploy:** Click "Deploy site"

### Step 2: Deploy Backend to Railway (Recommended)

1. **Sign up:** Go to [railway.app](https://railway.app)

2. **Create Project:**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Set **Root Directory** to `backend`

3. **Add Environment Variables:**
   ```
   PORT=5000
   NODE_ENV=production
   MONGODB_URI=your-mongodb-atlas-connection-string
   JWT_SECRET=your-secure-secret-key
   CORS_ORIGIN=https://your-netlify-url.netlify.app,https://myground.in
   ```

4. **Deploy:** Railway auto-deploys

5. **Get Backend URL:** Copy the Railway URL (e.g., `https://myground-production.up.railway.app`)

6. **Update Frontend:**
   - Go back to Netlify
   - Update `VITE_API_URL` to: `https://your-railway-url.com/api`
   - Trigger a new deployment

### Step 3: Connect Domain (myground.in)

1. **In Netlify:**
   - Site settings → Domain management
   - Add custom domain: `myground.in`

2. **At Your Domain Registrar:**
   - Add CNAME record:
     - Name: `@`
     - Value: `your-site-name.netlify.app`
   - Add CNAME for www:
     - Name: `www`
     - Value: `your-site-name.netlify.app`

3. **Wait:** DNS propagation takes 1-24 hours

4. **Enable HTTPS:** Netlify auto-provisions SSL (may take a few hours)

## ✅ Checklist

- [ ] Frontend deployed on Netlify
- [ ] Backend deployed on Railway/Render
- [ ] Environment variables set in both platforms
- [ ] Frontend `VITE_API_URL` points to backend
- [ ] Backend `CORS_ORIGIN` includes frontend URL
- [ ] Domain DNS configured
- [ ] HTTPS enabled
- [ ] Test login/register
- [ ] Test property listing
- [ ] Test search functionality

## 🔧 Common Issues

**CORS Errors?**
- Add your Netlify URL to backend `CORS_ORIGIN`
- Format: `https://myground.in,https://www.myground.in,https://your-site.netlify.app`

**API Not Working?**
- Check `VITE_API_URL` in Netlify environment variables
- Verify backend is running (check Railway/Render logs)
- Check browser console for errors

**Domain Not Working?**
- Wait 24 hours for DNS propagation
- Verify DNS records at your registrar
- Check [whatsmydns.net](https://www.whatsmydns.net)

## 📚 Full Guide

See `DEPLOYMENT_GUIDE.md` for detailed instructions.

