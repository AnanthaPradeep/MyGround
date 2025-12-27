import express, { Router } from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User';
import { generateToken } from '../utils/jwt';
import { authenticate, AuthRequest } from '../middleware/auth';
import { generateOTP, sendOTPEmail, sendOTPSMS, saveOTP, verifyOTP } from '../utils/otpService';

const router: Router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('mobile')
      .matches(/^[0-9]{10}$/)
      .withMessage('Mobile must be 10 digits'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
    body('firstName').notEmpty().withMessage('First name is required'),
    body('lastName').notEmpty().withMessage('Last name is required'),
    body('role')
      .optional()
      .isIn(['USER', 'OWNER', 'BROKER', 'DEVELOPER'])
      .withMessage('Invalid role'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, mobile, password, firstName, lastName, role = 'USER' } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({
        $or: [{ email }, { mobile }],
      });

      if (existingUser) {
        return res.status(400).json({
          error: 'User already exists',
          field: existingUser.email === email ? 'email' : 'mobile',
        });
      }

      // Create user
      const user = new User({
        email,
        mobile,
        password,
        firstName,
        lastName,
        role,
      });

      await user.save();

      // Generate token
      const token = generateToken({
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
      });

      res.status(201).json({
        success: true,
        token,
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
      });
    } catch (error: any) {
      console.error('Error registering user:', error);
      res.status(500).json({
        error: 'Failed to register user',
        message: error.message,
      });
    }
  }
);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      // Find user with password
      const user = await User.findOne({ email }).select('+password');

      if (!user || !user.password) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Check password
      const isMatch = await user.comparePassword(password);

      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Generate token
      const token = generateToken({
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
      });

      res.json({
        success: true,
        token,
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          isVerified: user.isVerified,
          trustScore: user.trustScore,
        },
      });
    } catch (error: any) {
      console.error('Error logging in:', error);
      res.status(500).json({
        error: 'Failed to login',
        message: error.message,
      });
    }
  }
);

/**
 * @route   GET /api/auth/me
 * @desc    Get current user
 * @access  Private
 */
router.get('/me', authenticate, async (req: AuthRequest, res) => {
  try {
    const user = await User.findById(req.user!.userId).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error: any) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      error: 'Failed to fetch user',
      message: error.message,
    });
  }
});

/**
 * @route   POST /api/auth/send-otp
 * @desc    Send OTP to mobile and email
 * @access  Public
 */
router.post(
  '/send-otp',
  [
    body('mobile').optional().matches(/^[0-9]{10}$/).withMessage('Mobile must be 10 digits'),
    body('email').optional().isEmail().withMessage('Please provide a valid email'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { mobile, email } = req.body;

      if (!mobile && !email) {
        return res.status(400).json({
          error: 'Either mobile or email is required',
        });
      }

      // Generate OTP
      const otp = generateOTP();

      // Save OTP to database
      await saveOTP(mobile, email, otp, 'REGISTRATION');

      // Send OTP via email
      if (email) {
        const emailSent = await sendOTPEmail(email, otp);
        if (!emailSent) {
          console.error('Failed to send OTP email');
        }
      }

      // Send OTP via SMS
      if (mobile) {
        const smsSent = await sendOTPSMS(mobile, otp);
        if (!smsSent) {
          console.error('Failed to send OTP SMS');
        }
      }

      res.json({
        success: true,
        message: 'OTP sent successfully',
        // In development, include OTP in response for testing
        // Remove this in production!
        ...(process.env.NODE_ENV === 'development' && { otp }),
      });
    } catch (error: any) {
      console.error('Error sending OTP:', error);
      res.status(500).json({
        error: 'Failed to send OTP',
        message: error.message,
      });
    }
  }
);

/**
 * @route   POST /api/auth/verify-otp
 * @desc    Verify OTP
 * @access  Public
 */
router.post(
  '/verify-otp',
  [
    body('mobile').optional().matches(/^[0-9]{10}$/).withMessage('Mobile must be 10 digits'),
    body('email').optional().isEmail().withMessage('Please provide a valid email'),
    body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { mobile, email, otp } = req.body;

      if (!mobile && !email) {
        return res.status(400).json({
          error: 'Either mobile or email is required',
        });
      }

      // Verify OTP
      const isValid = await verifyOTP(mobile, email, otp);

      if (!isValid) {
        return res.status(400).json({
          error: 'Invalid or expired OTP',
        });
      }

      res.json({
        success: true,
        message: 'OTP verified successfully',
      });
    } catch (error: any) {
      console.error('Error verifying OTP:', error);
      res.status(500).json({
        error: 'Failed to verify OTP',
        message: error.message,
      });
    }
  }
);

export default router;
