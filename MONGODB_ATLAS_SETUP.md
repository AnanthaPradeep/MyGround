# 🗄️ MongoDB Atlas Setup Guide for Render Deployment

## ❌ Problem

You're getting this error on Render:
```
connect ECONNREFUSED ::1:27017, connect ECONNREFUSED 127.0.0.1:27017
```

**Why?** Render.com cannot access your local MongoDB Compass database. You need a cloud MongoDB instance (MongoDB Atlas).

---

## ✅ Solution: Set Up MongoDB Atlas (Free Tier Available)

MongoDB Atlas is MongoDB's cloud database service. It has a **free tier** that's perfect for development and small projects.

### Step 1: Create MongoDB Atlas Account

1. **Go to:** [https://www.mongodb.com/cloud/atlas/register](https://www.mongodb.com/cloud/atlas/register)
2. **Sign up** with your email (free account)
3. **Verify your email** when prompted

### Step 2: Create a Free Cluster

1. **After login, you'll see "Create a Deployment"**
2. **Choose "M0 FREE" tier** (Free forever, 512MB storage)
3. **Select Cloud Provider:**
   - AWS (recommended)
   - Google Cloud
   - Azure
4. **Select Region:**
   - Choose closest to your Render server location
   - For Render (US), choose `us-east-1` or similar
5. **Cluster Name:** Leave default or name it `myground-cluster`
6. **Click "Create Deployment"** (takes 3-5 minutes)

### Step 3: Create Database User

1. **While cluster is creating, you'll see "Create Database User"**
2. **Authentication Method:** Password
3. **Username:** `myground-admin` (or your choice)
4. **Password:** 
   - Click "Autogenerate Secure Password" OR create your own
   - **⚠️ SAVE THIS PASSWORD!** You'll need it for the connection string
5. **Database User Privileges:** "Atlas admin" (default)
6. **Click "Create Database User"**

### Step 4: Configure Network Access

1. **Click "Network Access" in left sidebar**
2. **Click "Add IP Address"**
3. **For Render deployment, you need to allow all IPs:**
   - Click "Allow Access from Anywhere"
   - Or manually add: `0.0.0.0/0`
   - **Note:** This allows any IP to connect (required for Render)
4. **Click "Confirm"**
5. **Wait 1-2 minutes for changes to apply**

### Step 5: Get Connection String

1. **Go back to "Database" in left sidebar**
2. **Click "Connect" on your cluster**
3. **Choose "Connect your application"**
4. **Driver:** Node.js
5. **Version:** 5.5 or later
6. **Copy the connection string:**
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

### Step 6: Format Connection String

Replace the placeholders in the connection string:

**Before:**
```
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

**After (replace with your actual values):**
```
mongodb+srv://myground-admin:YOUR_PASSWORD_HERE@cluster0.xxxxx.mongodb.net/myground?retryWrites=true&w=majority
```

**Important:**
- Replace `<username>` with your database username (e.g., `myground-admin`)
- Replace `<password>` with your database password
- Replace `myground` with your database name (or keep `myground`)
- Keep `?retryWrites=true&w=majority` at the end

**Example:**
```
mongodb+srv://myground-admin:MySecurePass123@cluster0.abc123.mongodb.net/myground?retryWrites=true&w=majority
```

### Step 7: Add to Render Environment Variables

1. **Go to Render Dashboard:** [https://dashboard.render.com](https://dashboard.render.com)
2. **Click on your backend Web Service**
3. **Go to "Environment" tab**
4. **Click "Add Environment Variable"**
5. **Add:**
   - **Key:** `MONGODB_URI`
   - **Value:** Your complete connection string from Step 6
6. **Click "Save Changes"**
7. **Render will automatically redeploy**

### Step 8: Verify Connection

1. **Check Render Logs:**
   - Go to your Render service → "Logs" tab
   - Look for: `✅ MongoDB connected successfully`
   - If you see errors, check the connection string format

2. **Test Your API:**
   - Visit: `https://myground-1.onrender.com/health`
   - Should return: `{"status":"OK","timestamp":"..."}`

---

## 📋 Quick Checklist

- [ ] Created MongoDB Atlas account
- [ ] Created M0 FREE cluster
- [ ] Created database user (saved password!)
- [ ] Configured Network Access (allowed `0.0.0.0/0`)
- [ ] Got connection string from Atlas
- [ ] Formatted connection string with database name
- [ ] Added `MONGODB_URI` to Render environment variables
- [ ] Verified connection in Render logs

---

## 🔍 Troubleshooting

### Error: "Authentication failed"
- **Fix:** Check username and password in connection string
- Make sure password doesn't have special characters that need URL encoding
- If password has `@`, `#`, `%`, etc., URL encode them:
  - `@` → `%40`
  - `#` → `%23`
  - `%` → `%25`

### Error: "IP not whitelisted"
- **Fix:** Go to MongoDB Atlas → Network Access
- Add `0.0.0.0/0` to allow all IPs
- Wait 1-2 minutes for changes to apply

### Error: "Invalid connection string"
- **Fix:** Check connection string format:
  - Must start with `mongodb+srv://`
  - Must include username and password
  - Must include database name before `?`
  - Example: `mongodb+srv://user:pass@cluster.net/dbname?retryWrites=true&w=majority`

### Connection string format
**Correct:**
```
mongodb+srv://username:password@cluster.mongodb.net/myground?retryWrites=true&w=majority
```

**Wrong:**
```
mongodb+srv://cluster.mongodb.net/myground  ❌ (missing username/password)
mongodb://localhost:27017/myground  ❌ (local MongoDB, won't work on Render)
```

---

## 💡 Tips

1. **Free Tier Limits:**
   - 512MB storage (enough for development)
   - Shared CPU/RAM
   - Perfect for small to medium projects

2. **Security:**
   - Use a strong password for database user
   - Keep connection string secret (never commit to Git)
   - Consider IP whitelisting for production (but `0.0.0.0/0` works for Render)

3. **Local Development:**
   - You can still use MongoDB Compass locally
   - Use MongoDB Atlas connection string in your local `.env` file too
   - Or keep using `mongodb://localhost:27017/myground` for local dev

4. **Migration:**
   - If you have data in local MongoDB, you can export/import:
   - Use `mongoexport` to export from local
   - Use `mongoimport` to import to Atlas
   - Or use MongoDB Compass to connect to both and copy data

---

## 📝 Example Render Environment Variables

After setup, your Render environment should have:

```env
MONGODB_URI=mongodb+srv://myground-admin:YourPassword123@cluster0.abc123.mongodb.net/myground?retryWrites=true&w=majority
NODE_ENV=production
PORT=5000
JWT_SECRET=your-secure-jwt-secret-key
JWT_EXPIRE=7d
CORS_ORIGIN=https://myground.in,https://www.myground.in
```

---

**✅ Once you add `MONGODB_URI` to Render, your deployment will work!**

**Need help?** Check Render logs for specific error messages.
