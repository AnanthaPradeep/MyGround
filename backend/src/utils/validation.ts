import { body, ValidationChain } from 'express-validator';

export const validatePropertyListing = (): ValidationChain[] => {
  return [
    body('transactionType')
      .isIn(['SELL', 'RENT', 'LEASE', 'SUB_LEASE', 'FRACTIONAL'])
      .withMessage('Invalid transaction type'),
    
    body('propertyCategory')
      .isIn(['RESIDENTIAL', 'COMMERCIAL', 'INDUSTRIAL', 'LAND', 'SPECIAL'])
      .withMessage('Invalid property category'),
    
    body('propertySubType')
      .notEmpty()
      .withMessage('Property sub-type is required'),
    
    body('location.country')
      .notEmpty()
      .withMessage('Country is required'),
    
    body('location.state')
      .notEmpty()
      .withMessage('State is required'),
    
    body('location.city')
      .notEmpty()
      .withMessage('City is required'),
    
    body('location.area')
      .notEmpty()
      .withMessage('Area is required'),
    
    body('location.pincode')
      .notEmpty()
      .withMessage('Pincode is required'),
    
    body('location.coordinates.coordinates')
      .isArray({ min: 2, max: 2 })
      .withMessage('Coordinates must be [longitude, latitude]'),
    
    body('location.coordinates.coordinates.*')
      .isFloat()
      .withMessage('Coordinates must be valid numbers'),
    
    body('title')
      .trim()
      .notEmpty()
      .isLength({ min: 10, max: 200 })
      .withMessage('Title must be between 10 and 200 characters'),
    
    body('description')
      .trim()
      .notEmpty()
      .isLength({ min: 50, max: 5000 })
      .withMessage('Description must be between 50 and 5000 characters'),
    
    body('ownershipType')
      .isIn(['FREEHOLD', 'LEASEHOLD', 'GOVERNMENT', 'TRUST'])
      .withMessage('Invalid ownership type'),
    
    body('possessionStatus')
      .isIn(['READY', 'UNDER_CONSTRUCTION', 'PRE_LAUNCH'])
      .withMessage('Invalid possession status'),
    
    body('pricing.currency')
      .optional()
      .isLength({ min: 3, max: 3 })
      .withMessage('Currency must be 3 characters (e.g., INR, USD)'),
  ];
};

export const validateResidentialProperty = (): ValidationChain[] => {
  return [
    body('residential.bhk')
      .optional()
      .isInt({ min: 1, max: 10 })
      .withMessage('BHK must be between 1 and 10'),
    
    body('residential.bathrooms')
      .optional()
      .isInt({ min: 1, max: 20 })
      .withMessage('Bathrooms must be between 1 and 20'),
  ];
};

export const validateLandProperty = (): ValidationChain[] => {
  return [
    body('land.plotArea')
      .notEmpty()
      .isFloat({ min: 0.01 })
      .withMessage('Plot area must be greater than 0'),
    
    body('land.areaUnit')
      .optional()
      .isIn(['SQFT', 'SQMT', 'ACRE', 'HECTARE'])
      .withMessage('Invalid area unit'),
  ];
};

export const validateCommercialProperty = (): ValidationChain[] => {
  return [
    body('commercial.builtUpArea')
      .notEmpty()
      .isFloat({ min: 1 })
      .withMessage('Built-up area is required and must be greater than 0'),
  ];
};

