import OTP from '../models/OTP';
import nodemailer from 'nodemailer';

/**
 * Generate a 6-digit OTP
 */
export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Send OTP via Email
 */
export const sendOTPEmail = async (email: string, otp: string): Promise<boolean> => {
  try {
    // Create transporter (using Gmail as example)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // If no SMTP credentials, log to console (for development)
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log('\n📧 ============================================');
      console.log('📧 OTP Email (Development Mode)');
      console.log('📧 ============================================');
      console.log(`📧 To: ${email}`);
      console.log(`📧 OTP: ${otp}`);
      console.log('📧 ⚠️  Configure SMTP credentials in .env to send real emails');
      console.log('📧 ============================================\n');
      return true; // Return true for development
    }

    // Send email
    const mailOptions = {
      from: `"MyGround" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'MyGround - OTP Verification',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0ea5e9;">MyGround OTP Verification</h2>
          <p>Your OTP for account verification is:</p>
          <div style="background-color: #f0f9ff; border: 2px solid #0ea5e9; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
            <h1 style="color: #0ea5e9; font-size: 32px; margin: 0; letter-spacing: 5px;">${otp}</h1>
          </div>
          <p>This OTP is valid for 10 minutes.</p>
          <p style="color: #666; font-size: 12px;">If you didn't request this OTP, please ignore this email.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ OTP email sent to ${email}`);
    return true;
  } catch (error) {
    console.error('Error sending OTP email:', error);
    // For development, still return true if email fails
    if (!process.env.SMTP_USER) {
      return true;
    }
    return false;
  }
};

/**
 * Send OTP via SMS
 */
export const sendOTPSMS = async (mobile: string, otp: string): Promise<boolean> => {
  try {
    // For development, log to console
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
      console.log('\n📱 ============================================');
      console.log('📱 OTP SMS (Development Mode)');
      console.log('📱 ============================================');
      console.log(`📱 To: +91${mobile}`);
      console.log(`📱 OTP: ${otp}`);
      console.log('📱 ⚠️  Configure Twilio credentials in .env to send real SMS');
      console.log('📱 ============================================\n');
      return true; // Return true for development
    }

    // In production, use Twilio
    // Dynamic import to avoid errors if Twilio is not installed
    try {
      const twilio = require('twilio');
      const client = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
      );

      await client.messages.create({
        body: `Your MyGround OTP is ${otp}. Valid for 10 minutes.`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: `+91${mobile}`, // Assuming Indian numbers
      });

      console.log(`✅ OTP SMS sent to +91${mobile}`);
      return true;
    } catch (twilioError) {
      console.error('Twilio error:', twilioError);
      return false;
    }
  } catch (error) {
    console.error('Error sending OTP SMS:', error);
    // For development, still return true if SMS fails
    if (!process.env.TWILIO_ACCOUNT_SID) {
      return true;
    }
    return false;
  }
};

/**
 * Save OTP to database
 */
export const saveOTP = async (
  mobile: string | undefined,
  email: string | undefined,
  otp: string,
  type: 'REGISTRATION' | 'LOGIN' | 'PASSWORD_RESET' = 'REGISTRATION'
): Promise<void> => {
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 10); // OTP valid for 10 minutes

  await OTP.create({
    mobile,
    email,
    otp,
    type,
    expiresAt,
    verified: false,
  });
};

/**
 * Verify OTP
 */
export const verifyOTP = async (
  mobile: string | undefined,
  email: string | undefined,
  otp: string
): Promise<boolean> => {
  const otpRecord = await OTP.findOne({
    $or: [{ mobile }, { email }],
    otp,
    verified: false,
    expiresAt: { $gt: new Date() },
  });

  if (!otpRecord) {
    return false;
  }

  // Mark as verified
  otpRecord.verified = true;
  await otpRecord.save();

  return true;
};

