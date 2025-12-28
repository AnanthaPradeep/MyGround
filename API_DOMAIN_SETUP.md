# 🌐 API Domain Setup Guide

Your code is configured to use `https://myground.in/api` in production. Here are the setup options:

## ✅ Current Configuration

- **Local:** `http://localhost:5000/api` ✅
- **Production:** `https://myground.in/api` ✅ (configured in code)

## 🔧 Setup Options

### Option 1: Direct Render Backend (Easiest - Recommended)

**How it works:**
- Frontend calls `https://myground-1.onrender.com/api` directly
- Backend CORS allows `https://myground.in`

**Setup:**
1. In Netlify, set environment variable:
   ```
   VITE_API_URL=https://myground-1.onrender.com/api
   ```
2. Backend CORS already allows `https://myground.in` ✅

**Pros:** Simple, works immediately
**Cons:** Shows Render URL in network requests

---

### Option 2: Subdomain Setup (Clean URLs)

**How it works:**
- Set up `api.myground.in` subdomain pointing to Render
- Frontend calls `https://api.myground.in/api`

**Setup:**
1. In your DNS provider, add CNAME record:
   ```
   Type: CNAME
   Name: api
   Value: myground-1.onrender.com
   TTL: 3600
   ```
2. Update frontend code to use `https://api.myground.in/api` in production
3. Update backend CORS to allow `https://api.myground.in`

**Pros:** Clean URLs, same root domain
**Cons:** Requires DNS configuration

---

### Option 3: Netlify Proxy (Advanced)

**How it works:**
- Frontend calls `https://myground.in/api`
- Netlify proxies to Render backend

**Setup:**
1. Use Netlify Edge Functions or Functions to proxy requests
2. More complex setup required

**Pros:** Same domain, no CORS
**Cons:** Complex, requires Netlify Functions

---

## 🚀 Recommended: Option 1

For now, use Option 1 (direct Render backend):

1. **In Netlify Dashboard:**
   - Site settings → Environment variables
   - Add: `VITE_API_URL=https://myground-1.onrender.com/api`

2. **In Render Dashboard:**
   - Environment tab
   - Ensure `CORS_ORIGIN` includes: `https://myground.in,https://www.myground.in`

3. **Deploy:**
   - Frontend will use Render backend directly
   - CORS is already configured ✅

---

## 📝 Quick Setup

### Netlify Environment Variable
```
VITE_API_URL=https://myground-1.onrender.com/api
```

### Render CORS (already configured in code)
```
CORS_ORIGIN=https://myground.in,https://www.myground.in,http://localhost:5173,http://localhost:3000
```

---

**✅ Your code is ready! Just set the environment variable in Netlify.**

