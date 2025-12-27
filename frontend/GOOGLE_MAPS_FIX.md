# Google Maps Loading Error Fix Guide

## Error: "This page can't load Google Maps correctly. Do you own this website?"

This error typically occurs due to API key configuration issues. Follow these steps to fix:

## 🔧 Step-by-Step Fix

### 1. Check API Key in `.env` File

1. Open `frontend/.env` file
2. Verify your API key is correct:
   ```env
   VITE_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
   ```
3. **Restart your dev server** after changing `.env`:
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```

### 2. Verify Google Cloud Console Settings

Go to [Google Cloud Console](https://console.cloud.google.com/) and check:

#### A. Enable Required APIs
1. Navigate to **APIs & Services** > **Library**
2. Enable these APIs:
   - ✅ **Maps JavaScript API** (REQUIRED)
   - ✅ **Places API** (for location search)
   - ✅ **Geocoding API** (for address conversion)

#### B. Check API Key Restrictions

1. Go to **APIs & Services** > **Credentials**
2. Click on your API key
3. Under **Application restrictions**:
   - Select **HTTP referrers (web sites)**
   - Add these referrers:
     ```
     http://localhost:5173/*
     http://127.0.0.1:5173/*
     https://yourdomain.com/*
     ```
4. Under **API restrictions**:
   - Select **Restrict key**
   - Choose only:
     - Maps JavaScript API
     - Places API
     - Geocoding API
5. **Save** the changes

#### C. Verify Billing

1. Go to **Billing** in Google Cloud Console
2. Ensure billing is **enabled** for your project
3. Google Maps requires a billing account (but has free tier)

### 3. Test API Key

Test your API key directly in browser:

```
https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places,geometry
```

If you see an error, the API key is invalid or restricted.

### 4. Check Browser Console

Open browser console (F12) and look for:
- ❌ `Google Maps API error: ApiNotActivatedMapError` → Enable Maps JavaScript API
- ❌ `Google Maps API error: RefererNotAllowedMapError` → Fix HTTP referrer restrictions
- ❌ `Google Maps API error: InvalidKeyMapError` → Check API key is correct

### 5. Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Map shows gray/blank | Check API key restrictions allow `localhost:5173` |
| "Do you own this website?" error | Fix HTTP referrer restrictions in Google Cloud Console |
| Marker not showing | Check browser console for errors, verify API is enabled |
| Map loads but no interaction | Check if Maps JavaScript API is enabled |
| Location search not working | Enable Places API in Google Cloud Console |

### 6. Quick Test

1. Clear browser cache: `Ctrl+Shift+Delete` → Clear cache
2. Hard refresh: `Ctrl+F5`
3. Check console for errors
4. Verify API key in `.env` file
5. Restart dev server

## 🔍 Debugging

### Check if API Key is Loaded

Open browser console and run:
```javascript
console.log('API Key:', import.meta.env.VITE_GOOGLE_MAPS_API_KEY)
```

### Check if Google Maps is Loaded

```javascript
console.log('Google Maps loaded:', typeof google !== 'undefined' && typeof google.maps !== 'undefined')
```

### Test API Key Directly

Replace `YOUR_API_KEY` with your actual key:
```
https://maps.googleapis.com/maps/api/geocode/json?address=Mumbai&key=YOUR_API_KEY
```

If this returns an error, your API key has issues.

## ✅ Expected Behavior After Fix

- ✅ Map loads without errors
- ✅ Marker appears at selected location
- ✅ You can click on map to set location
- ✅ You can drag the marker
- ✅ "Use My Location" button works
- ✅ No console errors related to Google Maps

## 📞 Still Not Working?

1. **Double-check API key** - Copy it directly from Google Cloud Console
2. **Verify billing** - Google Maps requires billing to be enabled
3. **Check restrictions** - Make sure `localhost:5173` is allowed
4. **Clear cache** - Clear browser cache and localStorage
5. **Try incognito mode** - Rule out browser extensions interfering

## 🆘 Emergency Fallback

If Google Maps still doesn't work, you can temporarily use a different map provider or show coordinates as text until the API key is fixed.

