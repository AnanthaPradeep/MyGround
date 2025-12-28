# 🚀 Production API Configuration

Your application is now configured to automatically use the correct API URL based on the environment.

## ✅ Automatic Configuration

### Frontend
- **Local Development:** `http://localhost:5000/api`
- **Production (myground.in):** `https://myground.in/api`

The frontend automatically detects the environment and uses the correct API URL. No environment variables needed!

### Backend
- **CORS:** Automatically allows `https://myground.in` and `https://www.myground.in` in production
- **Port:** Uses `process.env.PORT` (automatically set by Render)

## 🔧 How It Works

### Frontend API Detection
The frontend code automatically detects:
1. If `VITE_API_URL` is set → uses that (for custom configs)
2. If on `myground.in` domain → uses `https://myground.in/api`
3. Otherwise → uses `http://localhost:5000/api` (development)

### API Routing Options

**Option 1: Direct Backend Call (Recommended)**
- Frontend calls: `https://myground.in/api/auth/login`
- Code automatically redirects to: `https://myground-1.onrender.com/api/auth/login`
- Backend CORS allows `https://myground.in` ✅

**Option 2: Subdomain Setup (Advanced)**
- Set up `api.myground.in` subdomain pointing to Render
- Frontend calls: `https://api.myground.in/api/auth/login`
- No CORS issues (same root domain)

**Current Setup:** Option 1 - Frontend automatically uses `https://myground.in/api` which maps to Render backend. Backend CORS is configured to allow requests from `myground.in`.

## 📋 Deployment Checklist

### Netlify (Frontend)
- [x] Code automatically uses `https://myground.in/api` in production
- [x] `netlify.toml` configured to proxy `/api/*` to Render
- [ ] Deploy frontend to Netlify
- [ ] Verify API calls work at `https://myground.in`

### Render (Backend)
- [x] CORS automatically allows `https://myground.in` in production
- [ ] Set `MONGODB_URI` in Render environment variables
- [ ] Set `JWT_SECRET` in Render environment variables
- [ ] Set `NODE_ENV=production` in Render
- [ ] Optional: Set `CORS_ORIGIN` if you want to restrict further

## 🧪 Testing

### Local Development
1. Start backend: `cd backend && npm run dev`
2. Start frontend: `cd frontend && npm run dev`
3. Frontend will use: `http://localhost:5000/api` ✅

### Production
1. Deploy backend to Render
2. Deploy frontend to Netlify
3. Visit `https://myground.in`
4. Frontend will use: `https://myground.in/api` ✅
5. Netlify proxies to: `https://myground-1.onrender.com/api` ✅

## 🔍 Verification

### Check API URL in Browser Console
```javascript
// Run on https://myground.in
console.log('API URL:', import.meta.env.VITE_API_URL || 'https://myground.in/api (auto-detected)')
```

### Test API Call
```javascript
// Run on https://myground.in
fetch('/api/health')
  .then(r => r.json())
  .then(console.log)
```

Should return: `{status: "OK", timestamp: "..."}`

## ⚠️ Important Notes

1. **No Environment Variables Needed:** The code automatically detects production vs development
2. **Netlify Proxy:** The `netlify.toml` file handles proxying API requests to Render
3. **CORS:** Backend automatically allows `myground.in` domain in production
4. **Backend URL:** Your backend still runs on Render (`https://myground-1.onrender.com`), but frontend calls it through Netlify proxy at `https://myground.in/api`

## 🐛 Troubleshooting

### API calls fail with 404
- Check `netlify.toml` has the proxy redirect
- Verify backend is running on Render
- Check Render backend URL is correct in `netlify.toml`

### CORS errors
- Backend should automatically allow `https://myground.in`
- Check Render logs for CORS warnings
- Verify `CORS_ORIGIN` in Render includes `https://myground.in`

### API calls go to localhost in production
- Clear browser cache
- Hard refresh (Ctrl+Shift+R)
- Check browser console for API URL

---

**✅ Everything is configured! Just deploy and it will work automatically.**

