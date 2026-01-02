/**
 * Seed Translations to Database
 * Run this script to populate translations in the database
 * Usage: npm run seed-translations
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Translation from '../src/models/Translation';

dotenv.config();

// Helper function to create translation objects
const createTranslations = (languageCode: string, translations: Record<string, string>, namespace: string = 'common') => {
  return Object.entries(translations).map(([key, value]) => ({
    languageCode,
    namespace,
    key,
    value,
  }));
};

// English translations (comprehensive)
const englishTranslations = createTranslations('en', {
  // Common actions
  welcome: 'Welcome',
  loading: 'Loading...',
  error: 'An error occurred',
  retry: 'Retry',
  save: 'Save',
  cancel: 'Cancel',
  delete: 'Delete',
  edit: 'Edit',
  search: 'Search',
  filter: 'Filter',
  sort: 'Sort',
  close: 'Close',
  next: 'Next',
  previous: 'Previous',
  submit: 'Submit',
  back: 'Back',
  home: 'Home',
  settings: 'Settings',
  profile: 'Profile',
  logout: 'Logout',
  login: 'Login',
  register: 'Register',
  language: 'Language',
  selectLanguage: 'Select Language',
  
  // Navigation
  dashboard: 'Dashboard',
  properties: 'Properties',
  browseProperties: 'Browse Properties',
  listYourProperty: 'List Your Property',
  draftProperties: 'Draft Properties',
  notifications: 'Notifications',
  wishlist: 'Wishlist',
  location: 'Location',
  selectLocation: 'Select Location',
  changeLocation: 'Change Location',
  tapToChange: 'Tap to change',
  
  // User actions
  signIn: 'Sign In',
  signUp: 'Sign Up',
  signOut: 'Sign Out',
  
  // Common labels
  email: 'Email',
  password: 'Password',
  firstName: 'First Name',
  lastName: 'Last Name',
  phone: 'Phone',
  mobile: 'Mobile',
  
  // Messages
  seeMore: 'See More',
  noResults: 'No results found',
  noItems: 'No items',
  
  // Property related
  property: 'Property',
  propertiesCount: 'Properties',
  price: 'Price',
  area: 'Area',
  bhk: 'BHK',
  view: 'View',
  views: 'Views',
  saveProperty: 'Save',
  saved: 'Saved',
  
  // Filters
  showFilters: 'Show Filters',
  clearAll: 'Clear All',
  apply: 'Apply',
  
  // Status
  active: 'Active',
  inactive: 'Inactive',
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
});

// Hindi translations
const hindiTranslations = createTranslations('hi', {
  // Common actions
  welcome: 'स्वागत है',
  loading: 'लोड हो रहा है...',
  error: 'एक त्रुटि हुई',
  retry: 'पुनः प्रयास करें',
  save: 'सहेजें',
  cancel: 'रद्द करें',
  delete: 'हटाएं',
  edit: 'संपादित करें',
  search: 'खोजें',
  filter: 'फ़िल्टर',
  sort: 'क्रमबद्ध करें',
  close: 'बंद करें',
  next: 'अगला',
  previous: 'पिछला',
  submit: 'सबमिट करें',
  back: 'वापस',
  home: 'होम',
  settings: 'सेटिंग्स',
  profile: 'प्रोफ़ाइल',
  logout: 'लॉगआउट',
  login: 'लॉगइन',
  register: 'रजिस्टर करें',
  language: 'भाषा',
  selectLanguage: 'भाषा चुनें',
  
  // Navigation
  dashboard: 'डैशबोर्ड',
  properties: 'संपत्तियां',
  browseProperties: 'संपत्तियां ब्राउज़ करें',
  listYourProperty: 'अपनी संपत्ति सूचीबद्ध करें',
  draftProperties: 'ड्राफ्ट संपत्तियां',
  notifications: 'सूचनाएं',
  wishlist: 'इच्छा सूची',
  location: 'स्थान',
  selectLocation: 'स्थान चुनें',
  changeLocation: 'स्थान बदलें',
  tapToChange: 'बदलने के लिए टैप करें',
  
  // User actions
  signIn: 'साइन इन',
  signUp: 'साइन अप',
  signOut: 'साइन आउट',
  
  // Common labels
  email: 'ईमेल',
  password: 'पासवर्ड',
  firstName: 'पहला नाम',
  lastName: 'अंतिम नाम',
  phone: 'फोन',
  mobile: 'मोबाइल',
  
  // Messages
  seeMore: 'और देखें',
  noResults: 'कोई परिणाम नहीं मिला',
  noItems: 'कोई आइटम नहीं',
  
  // Property related
  property: 'संपत्ति',
  propertiesCount: 'संपत्तियां',
  price: 'कीमत',
  area: 'क्षेत्र',
  bhk: 'बीएचके',
  view: 'देखें',
  views: 'व्यूज',
  saveProperty: 'सहेजें',
  saved: 'सहेजा गया',
  
  // Filters
  showFilters: 'फ़िल्टर दिखाएं',
  clearAll: 'सभी साफ़ करें',
  apply: 'लागू करें',
  
  // Status
  active: 'सक्रिय',
  inactive: 'निष्क्रिय',
  pending: 'लंबित',
  approved: 'अनुमोदित',
  rejected: 'अस्वीकृत',
});

// Combine all translations
const allTranslations = [
  ...englishTranslations,
  ...hindiTranslations,
];

async function seedTranslations() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/myground';
    
    if (!process.env.MONGODB_URI) {
      console.warn('⚠️  WARNING: MONGODB_URI not set, using default localhost (development only)');
    }

    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Clear existing translations
    console.log('🔄 Clearing existing translations...');
    await Translation.deleteMany({});
    console.log('✅ Cleared existing translations');

    // Insert translations
    console.log('🔄 Seeding translations...');
    const inserted = await Translation.insertMany(allTranslations);
    console.log(`✅ Inserted ${inserted.length} translations`);

    // Group by language
    const byLanguage: Record<string, number> = {};
    allTranslations.forEach((trans) => {
      byLanguage[trans.languageCode] = (byLanguage[trans.languageCode] || 0) + 1;
    });

    console.log('\n📊 Summary by language:');
    Object.entries(byLanguage).forEach(([lang, count]) => {
      console.log(`   ${lang}: ${count} translation(s)`);
    });

    console.log('\n✅ Translation seeding completed successfully!');
    console.log('💡 Tip: You can add more translations by modifying this script or using the API.');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding translations:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seedTranslations();
