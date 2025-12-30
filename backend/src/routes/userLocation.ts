import express, { Router, Response } from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User';
import { authenticate, AuthRequest } from '../middleware/auth';

const router: Router = express.Router();

/**
 * @route   GET /api/user/location
 * @desc    Get user's saved location
 * @access  Private
 */
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user!.userId).select('location');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      success: true,
      location: user.location || null,
    });
  } catch (error: any) {
    console.error('Error fetching user location:', error);
    res.status(500).json({
      error: 'Failed to fetch user location',
      message: error.message,
    });
  }
});

/**
 * @route   POST /api/user/location
 * @desc    Save or update user's location
 * @access  Private
 */
router.post(
  '/',
  authenticate,
  [
    body('coordinates')
      .isArray({ min: 2, max: 2 })
      .withMessage('Coordinates must be an array of [longitude, latitude]'),
    body('coordinates.*').isFloat().withMessage('Coordinates must be valid numbers'),
    body('city').optional().isString().trim(),
    body('state').optional().isString().trim(),
    body('country').optional().isString().trim(),
    body('area').optional().isString().trim(),
    body('locality').optional().isString().trim(),
    body('pincode').optional().isString().trim(),
    body('address').optional().isString().trim(),
    body('displayName').optional().isString().trim(),
    body('source').optional().isIn(['GPS', 'MANUAL', 'SEARCH']),
    body('accuracy').optional().isFloat({ min: 0 }),
    body('regionalNames').optional().isObject(),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const {
        coordinates,
        city,
        state,
        country = 'India',
        area,
        locality,
        pincode,
        address,
        displayName,
        source = 'MANUAL',
        accuracy,
        regionalNames,
      } = req.body;

      // Validate coordinates format [longitude, latitude]
      if (!Array.isArray(coordinates) || coordinates.length !== 2) {
        return res.status(400).json({
          error: 'Invalid coordinates format. Expected [longitude, latitude]',
        });
      }

      const [longitude, latitude] = coordinates;

      // Validate coordinate ranges
      if (longitude < -180 || longitude > 180 || latitude < -90 || latitude > 90) {
        return res.status(400).json({
          error: 'Invalid coordinate values. Longitude must be between -180 and 180, latitude between -90 and 90',
        });
      }

      // Update user location
      const user = await User.findByIdAndUpdate(
        req.user!.userId,
        {
          location: {
            coordinates: {
              type: 'Point',
              coordinates: [longitude, latitude],
            },
            city: city || '',
            state: state || '',
            country: country || 'India',
            area: area || undefined,
            locality: locality || undefined,
            pincode: pincode || undefined,
            address: address || undefined,
            displayName: displayName || `${city || ''}, ${state || ''}`.trim() || 'Unknown Location',
            regionalNames: regionalNames || undefined,
            source: source,
            accuracy: accuracy || undefined,
            lastUpdated: new Date(),
          },
        },
        { new: true, runValidators: true }
      ).select('location');

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({
        success: true,
        message: 'Location saved successfully',
        location: user.location,
      });
    } catch (error: any) {
      console.error('Error saving user location:', error);
      res.status(500).json({
        error: 'Failed to save user location',
        message: error.message,
      });
    }
  }
);

/**
 * @route   DELETE /api/user/location
 * @desc    Clear user's saved location
 * @access  Private
 */
router.delete('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user!.userId,
      {
        $unset: { location: 1 },
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      success: true,
      message: 'Location cleared successfully',
    });
  } catch (error: any) {
    console.error('Error clearing user location:', error);
    res.status(500).json({
      error: 'Failed to clear user location',
      message: error.message,
    });
  }
});

export default router;

