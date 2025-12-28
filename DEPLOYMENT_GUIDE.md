# MyGround Deployment Guide

This guide will help you deploy your MyGround application to production.

## Table of Contents
1. [Frontend Deployment (Netlify)](#frontend-deployment-netlify)
2. [Backend Deployment Options](#backend-deployment-options)
3. [Domain Configuration (myground.in)](#domain-configuration-mygroundin)
4. [Environment Variables](#environment-variables)
5. [Post-Deployment Checklist](#post-deployment-checklist)

---

## Frontend Deployment (Netlify)

### Prerequisites
- A GitHub, GitLab, or Bitbucket account
- Your frontend code pushed to a Git repository
- A Netlify account (free tier works)

### Step 1: Prepare Your Repository

1. **Push your code to Git:**
   ```bash
   cd frontend
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

### Step 2: Connect to Netlify

1. **Log in to Netlify:**
   - Go to [netlify.com](https://www.netlify.com)
   - Sign up or log in with your Git provider

2. **Create a New Site:**
   - Click "Add new site" → "Import an existing project"
   - Select your Git provider (GitHub, GitLab, or Bitbucket)
   - Authorize Netlify to access your repositories
   - Select your repository

3. **Configure Build Settings:**
   - **Base directory:** `frontend` (if your repo contains both frontend and backend)
   - **Build command:** `npm run build` (already configured in `netlify.toml`)
   - **Publish directory:** `dist` (already configured in `netlify.toml`)

4. **Set Environment Variables (CRITICAL - Required for API calls!):**
   - Go to Site settings → Environment variables
   - **⚠️ REQUIRED:** Add this variable:
     ```
     VITE_API_URL=https://myground-1.onrender.com/api
     ```
   - Your backend URL is: `https://myground-1.onrender.com`
   - Always include `/api` at the end
     ```
   - **⚠️ Without this, frontend will try to call `http://localhost:5000` and fail with CORS errors!**
   - **💡 Tip:** You can add this after backend deployment, then trigger a new frontend build

5. **Deploy:**
   - Click "Deploy site"
   - Netlify will build and deploy your frontend
   - You'll get a URL like `https://random-name-123.netlify.app`

### Step 3: Test Your Deployment

1. Visit your Netlify URL
2. Test all major features:
   - User registration/login
   - Property listing
   - Search functionality
   - API connectivity

---

## Backend Deployment Options

Netlify is primarily for frontend hosting. Your backend needs to be deployed separately. Here are the best options:

### Option 1: Railway (Recommended - Easy Setup)

1. **Sign up:** Go to [railway.app](https://railway.app)
2. **Create New Project:**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Select your repository
   - Set root directory to `backend`

3. **Configure Environment Variables:**
   - Add all your `.env` variables in Railway dashboard
   - Important variables:
     ```
     PORT=5000
     MONGODB_URI=your-mongodb-connection-string
     JWT_SECRET=your-jwt-secret
     NODE_ENV=production
     ```

4. **Deploy:**
   - Railway will automatically detect Node.js
   - It will build and deploy your backend
   - You'll get a URL like `https://your-app.railway.app`

### Option 2: Render (Free Tier Available)

1. **Sign up:** Go to [render.com](https://render.com)
2. **Create New Web Service:**
   - Connect your GitHub repository
   - **Root Directory:** `backend` (IMPORTANT!)
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start` (NOT `npm run dev` - this is critical!)
   - **Environment:** Node
   - **Node Version:** 18 or 20 (recommended)

3. **Configure Environment Variables (CRITICAL):**
   - Go to your Web Service → "Environment" tab
   - **MUST SET:** `MONGODB_URI` - Your MongoDB Atlas connection string
   - Add all other variables from `backend/.env.example`:
     ```
     PORT=5000
     NODE_ENV=production
     MONGODB_URI=your-mongodb-atlas-connection-string (REQUIRED!)
     JWT_SECRET=your-secure-jwt-secret-key
     JWT_EXPIRE=7d
     CORS_ORIGIN=https://myground.in,https://www.myground.in,http://localhost:5173,http://localhost:3000
     SMTP_HOST=smtp.gmail.com
     SMTP_PORT=587
     SMTP_USER=your-email@gmail.com
     SMTP_PASS=your-app-password
     ```
   - **⚠️ Without MONGODB_URI, the app will try to connect to localhost and fail!**

4. **Deploy:**
   - Render will build and deploy
   - You'll get a URL like `https://your-app.onrender.com`

### Option 3: DigitalOcean App Platform

1. **Sign up:** Go to [digitalocean.com](https://www.digitalocean.com)
2. **Create App:**
   - Connect your repository
   - Set root directory to `backend`
   - Configure build and start commands
   - Add environment variables

### Option 4: AWS / Heroku / Other Cloud Providers

- Follow similar steps as above
- Ensure Node.js runtime is supported
- Configure environment variables
- Set up MongoDB connection

### Backend Environment Variables Checklist

Make sure to set these in your backend hosting platform:

```env
PORT=5000
NODE_ENV=production
MONGODB_URI=your-mongodb-atlas-connection-string
JWT_SECRET=your-secure-jwt-secret-key
JWT_EXPIRES_IN=7d

# Email Configuration (if using)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Twilio (if using SMS)
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
TWILIO_PHONE_NUMBER=your-twilio-number

# Google Maps API
GOOGLE_MAPS_API_KEY=your-google-maps-api-key

# CORS Origins (add your frontend URL)
CORS_ORIGIN=https://myground.in,https://www.myground.in
```

---

## Domain Configuration (myground.in)

### Step 1: Add Domain to Netlify

1. **In Netlify Dashboard:**
   - Go to your site → Site settings → Domain management
   - Click "Add custom domain"
   - Enter `myground.in`
   - Click "Verify"

2. **Netlify will show you DNS records to add**

### Step 2: Configure DNS Records

Go to your domain registrar (where you bought myground.in) and add these DNS records:

#### Option A: Using A Records (Recommended)
```
Type: A
Name: @
Value: 75.2.60.5
TTL: 3600

Type: A
Name: @
Value: 75.2.60.5
TTL: 3600
```

#### Option B: Using CNAME (Easier)
```
Type: CNAME
Name: @
Value: your-site-name.netlify.app
TTL: 3600

Type: CNAME
Name: www
Value: your-site-name.netlify.app
TTL: 3600
```

**Note:** Netlify will provide the exact values in the domain management section.

### Step 3: Enable HTTPS

1. **In Netlify:**
   - Go to Site settings → Domain management
   - Click "Verify DNS configuration"
   - Once verified, Netlify will automatically provision SSL certificate via Let's Encrypt
   - This may take a few minutes to a few hours

### Step 4: Configure www Subdomain (Optional)

1. **Add www.myground.in:**
   - In Netlify domain management, add `www.myground.in`
   - Configure DNS CNAME record:
     ```
     Type: CNAME
     Name: www
     Value: your-site-name.netlify.app
     ```

2. **Set Primary Domain:**
   - In Netlify, set `myground.in` as the primary domain
   - Enable "Force HTTPS"
   - Enable "Redirect www to non-www" or vice versa (your preference)

---

## Environment Variables

### Frontend Environment Variables (Netlify)

Set these in Netlify → Site settings → Environment variables:

```env
VITE_API_URL=https://myground-1.onrender.com/api
```

**Important:** 
- Your backend URL is: `https://myground-1.onrender.com`
- Use `https://` (not `http://`) - **Required for production!**
- Always include `/api` at the end

### Backend Environment Variables

Set these in your backend hosting platform (Railway, Render, etc.):

```env
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/myground?retryWrites=true&w=majority
JWT_SECRET=your-very-secure-secret-key-minimum-32-characters
JWT_EXPIRES_IN=7d
CORS_ORIGIN=https://myground.in,https://www.myground.in,https://your-netlify-url.netlify.app
```

---

## Post-Deployment Checklist

### Frontend (Netlify)
- [ ] Site is accessible at `https://myground.in`
- [ ] HTTPS is enabled and working
- [ ] All routes work (no 404 errors on refresh)
- [ ] Environment variables are set correctly
- [ ] API calls are working (check browser console)
- [ ] Images and assets load correctly
- [ ] Mobile responsiveness works
- [ ] Dark mode toggle works

### Backend
- [ ] Backend is accessible at your backend URL
- [ ] API endpoints respond correctly
- [ ] Database connection is working
- [ ] Authentication works (login/register)
- [ ] CORS is configured correctly
- [ ] Environment variables are all set
- [ ] File uploads work (if applicable)
- [ ] Email/SMS services work (if applicable)

### Integration
- [ ] Frontend can communicate with backend
- [ ] Authentication flow works end-to-end
- [ ] Property CRUD operations work
- [ ] Search functionality works
- [ ] Maps/Google Maps API works
- [ ] Notifications work

### Security
- [ ] HTTPS is enabled on both frontend and backend
- [ ] CORS is properly configured
- [ ] Environment variables are not exposed in client code
- [ ] API keys are secure
- [ ] Database credentials are secure

### Performance
- [ ] Site loads quickly (< 3 seconds)
- [ ] Images are optimized
- [ ] Caching is working
- [ ] CDN is serving static assets

---

## Troubleshooting

### Frontend Issues

**Problem: Routes return 404 on refresh**
- **Solution:** The `netlify.toml` redirect rule should handle this. Make sure it's committed to your repo.

**Problem: API calls fail**
- **Solution:** 
  - Check `VITE_API_URL` environment variable in Netlify
  - Check browser console for CORS errors
  - Verify backend CORS settings include your Netlify URL

**Problem: Build fails**
- **Solution:**
  - Check build logs in Netlify
  - Ensure all dependencies are in `package.json`
  - Check Node version compatibility

### Backend Issues

**Problem: Backend can't connect to MongoDB**
- **Solution:**
  - Verify `MONGODB_URI` is correct
  - Check MongoDB Atlas IP whitelist (add `0.0.0.0/0` for cloud hosting)
  - Verify network access in MongoDB Atlas

**Problem: CORS errors**
- **Solution:**
  - Add your frontend URL to `CORS_ORIGIN` in backend environment variables
  - Include both `https://myground.in` and `https://www.myground.in`

**Problem: Environment variables not working**
- **Solution:**
  - Restart your backend service after adding environment variables
  - Verify variable names match exactly (case-sensitive)

### Domain Issues

**Problem: Domain not resolving**
- **Solution:**
  - Wait 24-48 hours for DNS propagation
  - Use [whatsmydns.net](https://www.whatsmydns.net) to check DNS propagation
  - Verify DNS records are correct at your registrar

**Problem: SSL certificate not provisioning**
- **Solution:**
  - Ensure DNS is fully propagated
  - Wait up to 24 hours for Let's Encrypt
  - Check Netlify domain management for errors

---

## Additional Resources

- [Netlify Documentation](https://docs.netlify.com/)
- [Railway Documentation](https://docs.railway.app/)
- [Render Documentation](https://render.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)

---

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review build logs in your hosting platform
3. Check browser console for errors
4. Verify all environment variables are set correctly

Good luck with your deployment! 🚀

