# 🔧 Fix Production API 404 Error

## ❌ Problem

In production, you're getting:
```
POST https://myground.in/api/auth/login 404 (Not Found)
POST https://myground.in/api/auth/register 404 (Not Found)
```

**Why?** The frontend is trying to call `https://myground.in/api/...`, but your backend is on Render at `https://myground-1.onrender.com/api/...`.

---

## ✅ Solution Applied

I've updated the code to automatically use the Render backend URL in production:

**Before:**
- Production: `https://myground.in/api` ❌ (doesn't exist)

**After:**
- Production: `https://myground-1.onrender.com/api` ✅ (your Render backend)

---

## 📋 What Changed

### Files Updated:
1. `frontend/src/services/api.ts` - Updated to use Render backend
2. `frontend/src/constants/api.ts` - Updated to use Render backend

### Configuration:
- **Local:** `http://localhost:5000/api` ✅
- **Production:** `https://myground-1.onrender.com/api` ✅

---

## 🚀 Next Steps

### Step 1: Rebuild and Deploy

1. **Commit changes:**
   ```bash
   git add frontend/src/services/api.ts frontend/src/constants/api.ts
   git commit -m "Fix production API URL to use Render backend"
   git push origin main
   ```

2. **Netlify will automatically rebuild** (or trigger manually)

3. **Wait for deployment to complete**

### Step 2: Verify Backend CORS

Make sure your Render backend allows requests from `https://myground.in`:

1. **Go to Render Dashboard** → Your Backend Service → Environment tab
2. **Check `CORS_ORIGIN` includes:**
   ```
   https://myground.in,https://www.myground.in
   ```
3. **If not set, add it:**
   ```
   CORS_ORIGIN=https://myground.in,https://www.myground.in,http://localhost:5173,http://localhost:3000
   ```

### Step 3: Test

1. **Visit:** `https://myground.in/login`
2. **Try to login** - should work now! ✅
3. **Check browser Network tab:**
   - Should see requests to: `https://myground-1.onrender.com/api/auth/login`
   - Should NOT see: `https://myground.in/api/...`

---

## 🔍 Verification

### Check API URL in Browser Console

1. **Open:** `https://myground.in` in browser
2. **Open Developer Console** (F12)
3. **Run:**
   ```javascript
   console.log('API URL:', import.meta.env.VITE_API_URL || 'https://myground-1.onrender.com/api (auto-detected)')
   ```
   Should show: `https://myground-1.onrender.com/api`

### Check Network Requests

1. **Open Network tab** in browser DevTools
2. **Try to login**
3. **Look for API requests:**
   - ✅ Should see: `https://myground-1.onrender.com/api/auth/login`
   - ❌ Should NOT see: `https://myground.in/api/auth/login`

---

## 🐛 If Still Getting 404

### Check 1: Backend is Running

1. **Visit:** `https://myground-1.onrender.com/health`
2. **Should return:** `{"status":"OK","timestamp":"..."}`
3. **If not:** Backend might be down or not deployed

### Check 2: CORS Configuration

1. **Check Render logs** for CORS errors
2. **Verify** `CORS_ORIGIN` includes `https://myground.in`
3. **Check** browser console for CORS error messages

### Check 3: Environment Variable Override

If you set `VITE_API_URL` in Netlify, it will override the code:
1. **Go to Netlify** → Site Settings → Environment Variables
2. **Check** if `VITE_API_URL` is set
3. **If set incorrectly:** Update or remove it
4. **If not set:** Leave it (code will use Render backend automatically)

---

## ✅ Expected Behavior

**After Fix:**
- ✅ Login works: `POST https://myground-1.onrender.com/api/auth/login`
- ✅ Register works: `POST https://myground-1.onrender.com/api/auth/register`
- ✅ All API calls go to Render backend
- ✅ No more 404 errors

---

**✅ After deploying the updated code, your API calls will work correctly!**

