# Enable Google Maps Billing - Quick Guide

## ⚠️ Error: BillingNotEnabledMapError

This error means **billing must be enabled** for your Google Cloud project, even though Google Maps has a **generous free tier**.

## ✅ Step-by-Step: Enable Billing

### Step 1: Go to Google Cloud Console

1. Visit: https://console.cloud.google.com/
2. Select your project (or create one if you don't have one)

### Step 2: Enable Billing

1. Go to **Billing** in the left menu
   - Or visit: https://console.cloud.google.com/billing
2. Click **"Link a billing account"** or **"Create billing account"**
3. Follow the prompts to:
   - Add a payment method (credit card)
   - Set up billing account
   - Link it to your project

### Step 3: Verify Billing is Enabled

1. Go to your project settings
2. Check that billing account is linked
3. You should see "Billing account: [Your Account]"

## 💰 Google Maps Free Tier (No Cost for Most Use Cases)

**Good News:** Google Maps has a **$200 free credit per month**, which covers:

- **Maps JavaScript API**: 28,000 map loads/month FREE
- **Places API**: 17,000 requests/month FREE  
- **Geocoding API**: 40,000 requests/month FREE

For a development/testing app, you'll likely **never exceed** these limits and **won't be charged**.

## 🔧 After Enabling Billing

1. **Wait 2-5 minutes** for changes to propagate
2. **Clear browser cache**: `Ctrl+Shift+Delete`
3. **Hard refresh**: `Ctrl+F5`
4. **Restart dev server** if needed

## ✅ Verify It's Working

After enabling billing, you should see:
- ✅ Map loads without errors
- ✅ Location search works
- ✅ "Use My Location" works
- ✅ No billing errors in console

## 🆘 Still Getting Errors?

1. **Check billing status**: https://console.cloud.google.com/billing
2. **Verify APIs are enabled**:
   - Maps JavaScript API
   - Places API
   - Geocoding API
3. **Check API key restrictions** allow `localhost:5173`
4. **Wait a few minutes** - changes can take time to propagate

## 📝 Important Notes

- **Billing is required** even for free tier usage
- **You won't be charged** unless you exceed free limits
- **Free tier is very generous** - most apps never exceed it
- **You can set budget alerts** to prevent unexpected charges

## 🔗 Useful Links

- Enable Billing: https://console.cloud.google.com/billing
- Pricing Info: https://mapsplatform.google.com/pricing/
- Free Tier Details: https://developers.google.com/maps/billing-and-pricing/pricing

---

**Once billing is enabled, your maps will work perfectly!** 🎉


