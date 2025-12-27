# OTP Setup Guide

## Email Configuration (Using Gmail)

1. **Enable 2-Step Verification** on your Google account
2. **Generate App Password**:
   - Go to Google Account → Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
   - Copy the 16-character password

3. **Add to `.env` file**:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password-here
```

## SMS Configuration (Using Twilio)

1. **Sign up for Twilio**: https://www.twilio.com/
2. **Get your credentials**:
   - Account SID
   - Auth Token
   - Phone Number

3. **Add to `.env` file**:
```env
TWILIO_ACCOUNT_SID=your-account-sid
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_PHONE_NUMBER=+1234567890
```

## Development Mode

If SMTP or Twilio credentials are not configured:
- OTPs will be **logged to console** (backend terminal)
- OTPs will be **returned in API response** (development only)
- Frontend will show OTP in alert (development only)

This allows testing without setting up email/SMS services.

## Production Mode

In production:
- OTPs are **NOT** returned in API response
- OTPs are sent via configured email/SMS services
- OTPs expire after 10 minutes
- OTPs are stored in MongoDB and auto-deleted after expiration

## Testing

1. **Without Email/SMS Setup** (Development):
   - OTP will appear in backend console
   - OTP will appear in browser alert (development mode)

2. **With Email/SMS Setup**:
   - Check your email inbox
   - Check your mobile phone for SMS

## API Endpoints

### Send OTP
```
POST /api/auth/send-otp
Body: { mobile: "9876543210", email: "user@example.com" }
```

### Verify OTP
```
POST /api/auth/verify-otp
Body: { mobile: "9876543210", email: "user@example.com", otp: "123456" }
```

