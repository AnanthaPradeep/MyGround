# 🚀 Render MongoDB Atlas Setup - Quick Guide

## ✅ Your MongoDB Atlas Connection String

**Username:** `anandhpradeep909_db_user`  
**Password:** `vfdveQ3iVryoQSan`  
**Cluster:** `cluster0.qzvka35.mongodb.net`

## 📝 Complete Connection String for Render

Use this **exact** connection string in Render:

```
mongodb+srv://anandhpradeep909_db_user:vfdveQ3iVryoQSan@cluster0.qzvka35.mongodb.net/myground?retryWrites=true&w=majority
```

**Important:**
- Database name: `myground` (you can change this if needed)
- Includes required query parameters: `?retryWrites=true&w=majority`

---

## 🔧 Step-by-Step: Add to Render

### Step 1: Go to Render Dashboard
1. Go to: [https://dashboard.render.com](https://dashboard.render.com)
2. Click on your backend Web Service (`myground-1`)

### Step 2: Add Environment Variable
1. Click on **"Environment"** tab (left sidebar)
2. Click **"Add Environment Variable"** button
3. Add:
   - **Key:** `MONGODB_URI`
   - **Value:** 
     ```
     mongodb+srv://anandhpradeep909_db_user:vfdveQ3iVryoQSan@cluster0.qzvka35.mongodb.net/myground?retryWrites=true&w=majority
     ```
4. Click **"Save Changes"**

### Step 3: Verify Network Access in MongoDB Atlas
1. Go to: [https://cloud.mongodb.com](https://cloud.mongodb.com)
2. Login to MongoDB Atlas
3. Go to **"Network Access"** (left sidebar)
4. Make sure `0.0.0.0/0` is allowed (allows all IPs for Render)
5. If not, click **"Add IP Address"** → **"Allow Access from Anywhere"**

### Step 4: Check Render Logs
1. Go back to Render Dashboard
2. Click **"Logs"** tab
3. Wait for automatic redeploy (happens after saving environment variable)
4. Look for: `✅ MongoDB connected successfully`

---

## 🏠 Local Development Setup

For **local development**, use MongoDB Compass with:

**Connection String:**
```
mongodb://localhost:27017/myground
```

**Or in your local `.env` file:**
```env
MONGODB_URI=mongodb://localhost:27017/myground
NODE_ENV=development
PORT=5000
JWT_SECRET=your-local-jwt-secret
```

---

## 📋 Complete Render Environment Variables

After adding MongoDB, your Render environment should have:

```env
# Database (REQUIRED)
MONGODB_URI=mongodb+srv://anandhpradeep909_db_user:vfdveQ3iVryoQSan@cluster0.qzvka35.mongodb.net/myground?retryWrites=true&w=majority

# Server Configuration
NODE_ENV=production
PORT=5000

# Authentication
JWT_SECRET=your-secure-jwt-secret-key-minimum-32-characters
JWT_EXPIRE=7d

# CORS
CORS_ORIGIN=https://myground.in,https://www.myground.in,http://localhost:5173,http://localhost:3000
```

---

## ✅ Verification Checklist

- [ ] Added `MONGODB_URI` to Render environment variables
- [ ] Connection string includes database name (`myground`)
- [ ] Connection string includes query parameters (`?retryWrites=true&w=majority`)
- [ ] MongoDB Atlas Network Access allows `0.0.0.0/0`
- [ ] Render logs show `✅ MongoDB connected successfully`
- [ ] Health endpoint works: `https://myground-1.onrender.com/health`

---

## 🐛 Troubleshooting

### Error: "Authentication failed"
- **Check:** Username and password are correct in connection string
- **Check:** No extra spaces in the connection string
- **Check:** Password doesn't need URL encoding (yours looks fine)

### Error: "IP not whitelisted"
- **Fix:** Go to MongoDB Atlas → Network Access
- **Add:** `0.0.0.0/0` (Allow Access from Anywhere)
- **Wait:** 1-2 minutes for changes to apply

### Error: "Server selection timed out"
- **Check:** Network Access is configured correctly
- **Check:** Connection string format is correct
- **Check:** Database name is included (`myground`)

### Still seeing "connect ECONNREFUSED localhost:27017"
- **Fix:** Make sure `MONGODB_URI` is set in Render (not just in code)
- **Fix:** Trigger a new deployment after adding the variable
- **Fix:** Check Render logs to confirm variable is being read

---

## 🔒 Security Notes

1. **Never commit** your connection string to Git
2. **Keep password secure** - don't share publicly
3. **Use environment variables** - never hardcode in code
4. **Rotate password** periodically for security

---

## 📝 Quick Copy-Paste for Render

**Key:**
```
MONGODB_URI
```

**Value:**
```
mongodb+srv://anandhpradeep909_db_user:vfdveQ3iVryoQSan@cluster0.qzvka35.mongodb.net/myground?retryWrites=true&w=majority
```

---

**✅ After adding this to Render, your deployment will work!**

**Check Render logs to confirm:** `✅ MongoDB connected successfully`

