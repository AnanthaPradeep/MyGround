# Location Setup & Troubleshooting Guide

This guide explains how location tracking works in MyGround and how to troubleshoot common issues.

## 🎯 How Location Selection Works

### Method 1: Click on Map (Primary Method)
1. **Click anywhere on the Google Map** - The location is automatically set
2. The marker moves to the clicked position
3. Coordinates update in real-time
4. Location is saved automatically

### Method 2: Drag Marker
1. **Click and drag the marker** to fine-tune the location
2. Coordinates update as you drag
3. Location is saved when you release

### Method 3: Search Location
1. **Type in the search box** - Uses Google Places Autocomplete
2. Select from suggestions
3. Map automatically centers on selected location
4. You can then click on map to adjust

### Method 4: Use Current Location
1. **Click "Use My Location" button**
2. Browser requests location permission
3. If granted, map centers on your location
4. You can then click to adjust if needed

## 🔧 Troubleshooting

### Issue: Map Not Loading

**Symptoms:**
- Blank map area
- Console errors about API key

**Solutions:**
1. Check your API key in `.env` file:
   ```env
   VITE_GOOGLE_MAPS_API_KEY=your_key_here
   ```

2. Verify API key is correct in Google Cloud Console

3. Check that these APIs are enabled:
   - Maps JavaScript API
   - Places API
   - Geocoding API

4. Check browser console for specific error messages

5. Ensure billing is enabled in Google Cloud Console

### Issue: Click on Map Not Working

**Symptoms:**
- Clicking map doesn't set location
- Marker doesn't move
- Coordinates don't update

**Solutions:**
1. **Check if map is in read-only mode** - Some pages show maps in read-only mode
2. **Check browser console** for JavaScript errors
3. **Try refreshing the page**
4. **Check API key permissions** - Ensure Maps JavaScript API is enabled
5. **Verify map is fully loaded** - Wait for "Loading map..." to disappear

### Issue: Geolocation Not Working

**Symptoms:**
- "Use My Location" button doesn't work
- Permission denied error
- Location unavailable

**Solutions:**

1. **Enable Location Permissions:**
   - Chrome: Settings > Privacy and Security > Site Settings > Location
   - Firefox: Settings > Privacy & Security > Permissions > Location
   - Safari: Preferences > Websites > Location Services

2. **Check Browser Support:**
   - Geolocation requires HTTPS (or localhost)
   - Some browsers block geolocation on HTTP

3. **Check Device Location:**
   - Ensure device location/GPS is enabled
   - Check system location settings

4. **Try Different Browser:**
   - Some browsers have stricter location policies

### Issue: Location Search Not Working

**Symptoms:**
- Autocomplete not showing suggestions
- Search returns no results

**Solutions:**
1. **Check Places API is enabled** in Google Cloud Console
2. **Verify API key has Places API access**
3. **Check billing** - Places API requires billing to be enabled
4. **Check API quotas** - You may have hit rate limits
5. **Try typing more characters** - Minimum 3 characters required

### Issue: Coordinates Not Saving

**Symptoms:**
- Location selected but not persisting
- Location resets on page refresh

**Solutions:**
1. **Check localStorage** - Location is stored in browser localStorage
2. **Check browser settings** - Some browsers block localStorage
3. **Check for errors** in browser console
4. **Verify location store** is working correctly

## 🧪 Testing Location Features

### Test Click-to-Set:
1. Open any page with MapPicker (e.g., Create Property)
2. Click anywhere on the map
3. Verify marker moves to clicked position
4. Verify coordinates update in bottom bar
5. Verify location is saved

### Test Drag Marker:
1. Click and hold the marker
2. Drag to new position
3. Release
4. Verify coordinates update
5. Verify location is saved

### Test Search:
1. Type a city name (e.g., "Mumbai")
2. Select from autocomplete suggestions
3. Verify map centers on location
4. Verify coordinates update

### Test Current Location:
1. Click "Use My Location"
2. Allow location permission if prompted
3. Verify map centers on your location
4. Verify coordinates update

## 📋 Best Practices

1. **Always allow location permissions** when prompted
2. **Use HTTPS** for production (required for geolocation)
3. **Test on different browsers** to ensure compatibility
4. **Monitor API usage** in Google Cloud Console
5. **Set up API key restrictions** for security
6. **Use environment variables** for API keys (never commit keys)

## 🔍 Debugging Tips

### Enable Console Logging:
Open browser console (F12) and look for:
- Google Maps load messages
- Geolocation errors
- API errors
- Coordinate updates

### Check Network Tab:
- Verify Google Maps API requests are successful
- Check for 403/401 errors (API key issues)
- Check for CORS errors

### Verify API Key:
1. Go to Google Cloud Console
2. Check API key restrictions
3. Verify allowed referrers include your domain
4. Check API restrictions include required APIs

## 📞 Common Error Messages

### "Failed to load Google Maps"
- **Cause:** API key invalid or missing
- **Fix:** Check `.env` file and API key in Google Cloud Console

### "Geolocation is not supported"
- **Cause:** Browser doesn't support geolocation or not on HTTPS
- **Fix:** Use HTTPS or test on localhost

### "Location access denied"
- **Cause:** User denied location permission
- **Fix:** Enable location permission in browser settings

### "Places API not enabled"
- **Cause:** Places API not enabled in Google Cloud Console
- **Fix:** Enable Places API in Google Cloud Console

## ✅ Quick Checklist

Before reporting issues, verify:
- [ ] API key is set in `.env` file
- [ ] Maps JavaScript API is enabled
- [ ] Places API is enabled (for search)
- [ ] Geocoding API is enabled (for reverse geocoding)
- [ ] Billing is enabled in Google Cloud Console
- [ ] Location permissions are granted
- [ ] Browser supports geolocation
- [ ] No console errors
- [ ] Network requests are successful

## 🚀 Still Having Issues?

1. Check browser console for specific errors
2. Verify API key in Google Cloud Console
3. Test with a fresh API key
4. Check Google Cloud Console for API quotas/limits
5. Verify all required APIs are enabled


