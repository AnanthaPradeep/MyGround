import express, { Router, Response } from 'express';
import FilterOption from '../models/FilterOption';

const router: Router = express.Router();

/**
 * @route   GET /api/filters/options
 * @desc    Get all filter options from database (transaction types, categories, sub-types, etc.)
 * @access  Public
 */
router.get('/options', async (req, res: Response) => {
  try {
    // Fetch all active filter options from database
    const allOptions = await FilterOption.find({ isActive: true })
      .sort({ optionType: 1, order: 1, category: 1 })
      .lean();

    // Group options by type
    const transactionTypes = allOptions
      .filter((opt) => opt.optionType === 'TRANSACTION_TYPE')
      .map((opt) => ({ value: opt.value, label: opt.label }));

    const propertyCategories = allOptions
      .filter((opt) => opt.optionType === 'PROPERTY_CATEGORY')
      .map((opt) => ({ value: opt.value, label: opt.label }));

    // Group property sub-types by category
    const propertySubTypes: Record<string, string[]> = {};
    allOptions
      .filter((opt) => opt.optionType === 'PROPERTY_SUBTYPE' && opt.category)
      .forEach((opt) => {
        if (!propertySubTypes[opt.category!]) {
          propertySubTypes[opt.category!] = [];
        }
        propertySubTypes[opt.category!].push(opt.value);
      });

    const ownershipTypes = allOptions
      .filter((opt) => opt.optionType === 'OWNERSHIP_TYPE')
      .map((opt) => ({ value: opt.value, label: opt.label }));

    const possessionStatuses = allOptions
      .filter((opt) => opt.optionType === 'POSSESSION_STATUS')
      .map((opt) => ({ value: opt.value, label: opt.label }));

    const furnishingTypes = allOptions
      .filter((opt) => opt.optionType === 'FURNISHING_TYPE')
      .map((opt) => ({ value: opt.value, label: opt.label }));

    const parkingTypes = allOptions
      .filter((opt) => opt.optionType === 'PARKING_TYPE')
      .map((opt) => ({ value: opt.value, label: opt.label }));

    const areaUnits = allOptions
      .filter((opt) => opt.optionType === 'AREA_UNIT')
      .map((opt) => ({ value: opt.value, label: opt.label }));

    // Extract BHK options and convert to numbers
    const bhkOptions = allOptions
      .filter((opt) => opt.optionType === 'BHK_OPTION')
      .map((opt) => {
        const num = parseInt(opt.value);
        return isNaN(num) ? 7 : num; // Handle "7+" as 7
      })
      .filter((num, index, arr) => arr.indexOf(num) === index) // Remove duplicates
      .sort((a, b) => a - b);

    const filterOptions = {
      transactionTypes,
      propertyCategories,
      propertySubTypes,
      ownershipTypes,
      possessionStatuses,
      furnishingTypes,
      parkingTypes,
      areaUnits,
      bhkOptions,
    };

    // Log if no data found (database not seeded)
    if (allOptions.length === 0) {
      console.warn('⚠️  No filter options found in database. Please run: npm run seed-filters');
    }

    res.json({
      success: true,
      data: filterOptions,
    });
  } catch (error: any) {
    console.error('Error fetching filter options from database:', error);
    res.status(500).json({
      error: 'Failed to fetch filter options',
      message: error.message,
    });
  }
});

/**
 * @route   GET /api/filters/options/:type
 * @desc    Get filter options by type (e.g., TRANSACTION_TYPE, PROPERTY_CATEGORY)
 * @access  Public
 */
router.get('/options/:type', async (req, res: Response) => {
  try {
    const { type } = req.params;
    const { category } = req.query;

    const query: any = {
      optionType: type.toUpperCase(),
      isActive: true,
    };

    if (category) {
      query.category = category;
    }

    const options = await FilterOption.find(query)
      .sort({ order: 1 })
      .select('value label category order metadata')
      .lean();

    res.json({
      success: true,
      data: options,
    });
  } catch (error: any) {
    console.error('Error fetching filter options by type:', error);
    res.status(500).json({
      error: 'Failed to fetch filter options',
      message: error.message,
    });
  }
});

export default router;

