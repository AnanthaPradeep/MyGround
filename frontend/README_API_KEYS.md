# Google Maps API Keys Configuration

This application uses Google Maps Platform APIs for location services. Follow these steps to configure your API keys.

## 📋 Prerequisites

1. A Google Cloud Platform (GCP) account
2. A project in Google Cloud Console
3. Google Maps Platform APIs enabled

## 🔑 Required APIs

Enable the following APIs in your Google Cloud Console:

1. **Maps JavaScript API** - For displaying maps
2. **Places API** - For location autocomplete and search
3. **Geocoding API** - For converting coordinates to addresses
4. **Geolocation API** (optional) - For advanced location services

## 🚀 Setup Instructions

### Step 1: Get Your API Keys

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (or create a new one)
3. Navigate to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **API Key**
5. Copy your API key

### Step 2: Configure API Key Restrictions (Recommended)

For security, restrict your API key:

1. Click on your API key to edit it
2. Under **Application restrictions**, select **HTTP referrers (web sites)**
3. Add your domain(s):
   - `localhost:*` (for development)
   - `yourdomain.com/*` (for production)
4. Under **API restrictions**, select **Restrict key**
5. Choose:
   - Maps JavaScript API
   - Places API
   - Geocoding API
   - Geolocation API (if using)

### Step 3: Set Environment Variables

1. In the `frontend` directory, create a `.env` file:

```bash
# Copy the example file
cp .env.example .env
```

2. Edit `.env` and add your API keys:

```env
VITE_GOOGLE_MAPS_API_KEY=your_maps_api_key_here
VITE_GOOGLE_GEOLOCATION_API_KEY=your_geolocation_api_key_here
```

3. Save the file

### Step 4: Restart Development Server

After updating the `.env` file, restart your development server:

```bash
npm run dev
```

## 🔄 Updating API Keys

To update your API keys:

1. Edit the `.env` file in the `frontend` directory
2. Update the `VITE_GOOGLE_MAPS_API_KEY` value
3. Restart the development server
4. The new key will be automatically loaded

## 📝 Current Configuration

The API keys are configured in:
- **Config File**: `frontend/src/config/googleMaps.ts`
- **Environment Variables**: `frontend/.env`

The application will:
1. First try to use the API key from `.env` file (`VITE_GOOGLE_MAPS_API_KEY`)
2. Fall back to the default key in the config file if `.env` is not set

## ⚠️ Security Notes

- **Never commit `.env` files** to version control
- The `.env` file is already in `.gitignore`
- Use different API keys for development and production
- Restrict your API keys in Google Cloud Console
- Monitor API usage in Google Cloud Console

## 🐛 Troubleshooting

### Map not loading?
- Check that your API key is correct
- Verify the Maps JavaScript API is enabled
- Check browser console for errors
- Ensure API key restrictions allow your domain

### Autocomplete not working?
- Verify Places API is enabled
- Check API key restrictions include Places API
- Ensure you have billing enabled (Google requires billing for Places API)

### Reverse geocoding failing?
- Verify Geocoding API is enabled
- Check API quotas in Google Cloud Console
- Ensure billing is enabled

## 📚 Additional Resources

- [Google Maps Platform Documentation](https://developers.google.com/maps/documentation)
- [API Key Best Practices](https://developers.google.com/maps/api-security-best-practices)
- [Billing and Pricing](https://developers.google.com/maps/billing-and-pricing)

