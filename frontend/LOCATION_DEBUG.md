# Location Setup Debugging Guide

## 🔍 Quick Debugging Steps

### 1. Check Browser Console
Open browser console (F12) and look for:
- ✅ "Google Maps loaded" - Map is loading
- ✅ "📍 Map clicked at: ..." - Click is working
- ✅ "📍 Location selected: ..." - Location selection is working
- ❌ Any red error messages

### 2. Verify API Key
1. Check `.env` file exists in `frontend/` directory
2. Verify API key is correct
3. Restart dev server after changing `.env`

### 3. Test Map Click
1. Open Create Property page
2. Go to Step 2 (Location)
3. **Click anywhere on the map**
4. Check if:
   - Marker moves to clicked position
   - Coordinates update in bottom bar
   - Coordinates show in green "Location set" message

### 4. Test Location Modal
1. Clear browser localStorage: `localStorage.clear()`
2. Refresh page
3. Location modal should appear
4. Try:
   - Search for a location
   - Click "Use My Current Location"
   - Click on map in the modal

## 🐛 Common Issues & Fixes

### Issue: Map Not Loading
**Symptoms:** Blank gray area, "Loading Google Maps..." forever

**Fix:**
1. Check API key in `.env` file
2. Verify Maps JavaScript API is enabled in Google Cloud Console
3. Check browser console for API errors
4. Ensure billing is enabled

### Issue: Click Not Working
**Symptoms:** Clicking map does nothing, marker doesn't move

**Fix:**
1. Check browser console for errors
2. Verify map is not in read-only mode
3. Try refreshing the page
4. Check if Google Maps script loaded (look for "Google Maps loaded" in console)

### Issue: Location Not Saving
**Symptoms:** Location selected but disappears on refresh

**Fix:**
1. Check browser localStorage is enabled
2. Check console for storage errors
3. Verify location store is working
4. Check if location is being set in store

### Issue: Modal Not Showing
**Symptoms:** Location modal doesn't appear on first visit

**Fix:**
1. Clear localStorage: `localStorage.clear()`
2. Refresh page
3. Check App.tsx logic for modal display
4. Verify `isLocationSet` is false in store

## 🧪 Testing Checklist

- [ ] Map loads without errors
- [ ] Click on map sets location (check coordinates update)
- [ ] Drag marker updates location
- [ ] "Use My Location" button works
- [ ] Location search autocomplete works
- [ ] Location modal appears on first visit
- [ ] Location persists after page refresh
- [ ] Location shows in header after setting

## 📝 Debug Console Commands

Run these in browser console to debug:

```javascript
// Check if location is stored
JSON.parse(localStorage.getItem('myground-location-storage'))

// Clear location and test again
localStorage.removeItem('myground-location-storage')
location.reload()

// Check Google Maps API key
import.meta.env.VITE_GOOGLE_MAPS_API_KEY

// Check if Google Maps is loaded
window.google && window.google.maps
```

## ✅ Expected Behavior

1. **On First Visit:**
   - Splash screen shows
   - Location modal appears
   - User can search or click on map
   - Location is saved

2. **On Map Click:**
   - Marker immediately moves to clicked position
   - Coordinates update in real-time
   - Green "Location set" message appears
   - Location is saved to store

3. **After Setting Location:**
   - Location shows in header
   - Location persists across page refreshes
   - Can change location from header dropdown


