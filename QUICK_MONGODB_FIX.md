# ⚡ Quick MongoDB Fix

## ❌ Current Error
```
MongooseServerSelectionError: connect ECONNREFUSED ::1:27017
```

## ✅ Quick Fix (5 Minutes)

### 1. Create MongoDB Atlas Account (Free)
- Go to: https://www.mongodb.com/cloud/atlas
- Sign up for **FREE** tier
- Create a cluster (M0 Sandbox)

### 2. Get Connection String
1. Click **"Connect"** on your cluster
2. Choose **"Connect your application"**
3. Copy the connection string
4. Replace `<username>` and `<password>` with your database user credentials
5. Add database name: `/myground?` (before the `?`)

**Example:**
```
mongodb+srv://myground-admin:YourPassword@cluster0.xxxxx.mongodb.net/myground?retryWrites=true&w=majority
```

### 3. Add to Render
1. Render Dashboard → Your Backend → **Environment** tab
2. Add environment variable:
   - **Key:** `MONGODB_URI`
   - **Value:** Your connection string from step 2
3. Save - Render will auto-redeploy

### 4. Verify
Check Render logs - should see:
```
✅ MongoDB connected successfully
🚀 Server running on port 5000
```

## 📖 Full Guide
See `MONGODB_ATLAS_SETUP.md` for detailed step-by-step instructions.

---

**⚠️ Important:** Local MongoDB Compass won't work on Render. You MUST use MongoDB Atlas (cloud database) for production.

