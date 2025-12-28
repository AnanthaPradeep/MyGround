# 🚀 Render.com Deployment Checklist

## ⚠️ CRITICAL: Before Deploying to Render

Use this checklist to ensure your deployment succeeds. **Missing any of these will cause deployment to fail!**

### ✅ Step 1: Render Dashboard Configuration

1. **Root Directory:** `backend` ✅
2. **Build Command:** `npm install && npm run build` ✅
3. **Start Command:** `npm start` ✅ (NOT `npm run dev`)
4. **Environment:** Node ✅
5. **Node Version:** 18 or 20 (recommended)

### ✅ Step 2: REQUIRED Environment Variables

**⚠️ These MUST be set in Render Dashboard → Environment tab:**

- [ ] **`MONGODB_URI`** ⚠️ **REQUIRED!** 
  - Format: `mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority`
  - Get this from MongoDB Atlas → Connect → Connection String
  - **Without this, deployment WILL FAIL!**

- [ ] **`NODE_ENV`** = `production`

- [ ] **`JWT_SECRET`** = Your secure random string (at least 32 characters)
  - Generate: `openssl rand -base64 32`
  - Or use: https://randomkeygen.com/

- [ ] **`JWT_EXPIRE`** = `7d` (or your preferred expiry)

- [ ] **`CORS_ORIGIN`** = Your frontend URL(s)
  - Example: `https://myground.in,https://www.myground.in,http://localhost:5173,http://localhost:3000`
  - Include both production and localhost for flexibility
  - Backend URL: `https://myground-1.onrender.com` (already included in defaults)

### ✅ Step 3: Optional Environment Variables

- [ ] **`SMTP_HOST`** = `smtp.gmail.com` (for email OTP)
- [ ] **`SMTP_PORT`** = `587`
- [ ] **`SMTP_USER`** = Your Gmail address
- [ ] **`SMTP_PASS`** = Gmail App Password (not regular password)
- [ ] **`TWILIO_ACCOUNT_SID`** = (optional, for SMS)
- [ ] **`TWILIO_AUTH_TOKEN`** = (optional, for SMS)
- [ ] **`TWILIO_PHONE_NUMBER`** = (optional, for SMS)
- [ ] **`GOOGLE_MAPS_API_KEY`** = (optional, for maps)

### ✅ Step 4: MongoDB Atlas Configuration

1. **Network Access:**
   - Go to MongoDB Atlas → Network Access
   - Add IP Address: `0.0.0.0/0` (allows all IPs)
   - Or add Render's specific IP if known

2. **Database User:**
   - Create a database user with read/write permissions
   - Username and password will be in your connection string

3. **Connection String:**
   - Go to MongoDB Atlas → Connect → Drivers
   - Copy the connection string
   - Replace `<password>` with your actual password
   - Replace `<dbname>` with your database name (e.g., `myground`)

### ✅ Step 5: Verify Deployment

After deployment, check:

1. **Build Status:** Should show "Build successful 🎉"
2. **Logs:** Should show:
   - `✅ MongoDB connected successfully`
   - `🚀 Server running on port [PORT]`
   - `📝 Environment: production`
3. **Health Check:** Visit `https://your-app.onrender.com/health`
   - Should return: `{"status":"OK","timestamp":"..."}`

### ❌ Common Errors & Solutions

| Error | Solution |
|-------|----------|
| `MONGODB_URI not set` | Add `MONGODB_URI` in Render Environment tab |
| `Cannot find module` | Check Build Command includes `npm run build` |
| `ECONNREFUSED localhost:27017` | `MONGODB_URI` not set - add it! |
| `Port binding issues` | Server should listen on `0.0.0.0` (already fixed) |
| `JWT_SECRET is not properly configured` | Add `JWT_SECRET` in Render Environment tab |

### 📝 Quick Copy-Paste for Render Environment Variables

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/myground?retryWrites=true&w=majority
NODE_ENV=production
JWT_SECRET=your-generated-secret-key-here
JWT_EXPIRE=7d
CORS_ORIGIN=https://myground.in,https://www.myground.in,http://localhost:5173,http://localhost:3000
```

**⚠️ Remember:** Replace placeholder values with your actual credentials!

---

## 🔄 After Deployment

1. Update your frontend API URL to point to Render backend
2. Test all endpoints
3. Monitor logs for any errors
4. Set up custom domain if needed

---

**💡 Tip:** Save this checklist and use it every time you deploy!

