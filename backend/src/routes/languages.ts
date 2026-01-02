import express, { Router, Response } from 'express';
import Language from '../models/Language';
import Translation from '../models/Translation';

const router: Router = express.Router();

/**
 * @route   GET /api/languages
 * @desc    Get all active languages, grouped by country
 * @access  Public
 */
router.get('/', async (req: express.Request, res: Response) => {
  try {
    const languages = await Language.find({ isActive: true })
      .sort({ country: 1, order: 1, languageNameEnglish: 1 })
      .select('languageCode languageNameEnglish languageNameNative country direction isDefault order')
      .lean();

    // Group languages by country
    const languagesByCountry: Record<string, typeof languages> = {};
    languages.forEach((lang) => {
      if (!languagesByCountry[lang.country]) {
        languagesByCountry[lang.country] = [];
      }
      languagesByCountry[lang.country].push(lang);
    });

    // Get default language
    const defaultLanguage = languages.find((lang) => lang.isDefault) || languages[0];

    res.json({
      success: true,
      data: {
        languages,
        languagesByCountry,
        defaultLanguage: defaultLanguage
          ? {
              languageCode: defaultLanguage.languageCode,
              languageNameEnglish: defaultLanguage.languageNameEnglish,
              languageNameNative: defaultLanguage.languageNameNative,
              country: defaultLanguage.country,
              direction: defaultLanguage.direction,
            }
          : null,
      },
    });
  } catch (error: any) {
    console.error('Error fetching languages:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch languages',
      message: error.message,
    });
  }
});

/**
 * @route   GET /api/languages/:languageCode
 * @desc    Get specific language by code
 * @access  Public
 */
router.get('/:languageCode', async (req: express.Request, res: Response) => {
  try {
    const { languageCode } = req.params;
    const language = await Language.findOne({
      languageCode: languageCode.toLowerCase(),
      isActive: true,
    })
      .select('languageCode languageNameEnglish languageNameNative country direction isDefault')
      .lean();

    if (!language) {
      return res.status(404).json({
        success: false,
        error: 'Language not found',
      });
    }

    res.json({
      success: true,
      data: language,
    });
  } catch (error: any) {
    console.error('Error fetching language:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch language',
      message: error.message,
    });
  }
});

/**
 * @route   GET /api/languages/:languageCode/translations
 * @desc    Get all translations for a specific language code
 * @access  Public
 */
router.get('/:languageCode/translations', async (req: express.Request, res: Response) => {
  try {
    const { languageCode } = req.params;
    const { namespace } = req.query;

    const query: any = {
      languageCode: languageCode.toLowerCase(),
    };

    // Optionally filter by namespace
    if (namespace && typeof namespace === 'string') {
      query.namespace = namespace;
    }

    const translations = await Translation.find(query)
      .select('namespace key value')
      .lean();

    // Transform translations into nested object structure for i18next
    // Format: { namespace: { key: value } }
    const resources: Record<string, Record<string, string>> = {};

    translations.forEach((trans) => {
      if (!resources[trans.namespace]) {
        resources[trans.namespace] = {};
      }
      // Support both simple keys and nested keys
      // Simple key: "welcome" -> { common: { welcome: "..." } }
      // Nested key: "button.save" -> { common: { button: { save: "..." } } }
      const keys = trans.key.split('.');
      let current = resources[trans.namespace];
      
      if (keys.length === 1) {
        // Simple key
        current[trans.key] = trans.value;
      } else {
        // Nested key - create nested structure
        for (let i = 0; i < keys.length - 1; i++) {
          if (!current[keys[i]] || typeof current[keys[i]] !== 'object') {
            current[keys[i]] = {};
          }
          current = current[keys[i]] as any;
        }
        current[keys[keys.length - 1]] = trans.value;
      }
    });

    res.json({
      success: true,
      data: {
        languageCode: languageCode.toLowerCase(),
        resources,
      },
    });
  } catch (error: any) {
    console.error('Error fetching translations:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch translations',
      message: error.message,
    });
  }
});

export default router;

