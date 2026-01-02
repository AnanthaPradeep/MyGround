import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Language from '../src/models/Language';

dotenv.config();

// Indian languages (Eighth Schedule) + Other major languages
const languages = [
  // Indian languages
  { languageCode: 'en', languageNameEnglish: 'English', languageNameNative: 'English', country: 'IN', direction: 'ltr', isDefault: true, order: 1 },
  { languageCode: 'hi', languageNameEnglish: 'Hindi', languageNameNative: 'हिंदी', country: 'IN', direction: 'ltr', order: 2 },
  { languageCode: 'bn', languageNameEnglish: 'Bengali', languageNameNative: 'বাংলা', country: 'IN', direction: 'ltr', order: 3 },
  { languageCode: 'te', languageNameEnglish: 'Telugu', languageNameNative: 'తెలుగు', country: 'IN', direction: 'ltr', order: 4 },
  { languageCode: 'mr', languageNameEnglish: 'Marathi', languageNameNative: 'मराठी', country: 'IN', direction: 'ltr', order: 5 },
  { languageCode: 'ta', languageNameEnglish: 'Tamil', languageNameNative: 'தமிழ்', country: 'IN', direction: 'ltr', order: 6 },
  { languageCode: 'ur', languageNameEnglish: 'Urdu', languageNameNative: 'اردو', country: 'IN', direction: 'rtl', order: 7 },
  { languageCode: 'gu', languageNameEnglish: 'Gujarati', languageNameNative: 'ગુજરાતી', country: 'IN', direction: 'ltr', order: 8 },
  { languageCode: 'kn', languageNameEnglish: 'Kannada', languageNameNative: 'ಕನ್ನಡ', country: 'IN', direction: 'ltr', order: 9 },
  { languageCode: 'or', languageNameEnglish: 'Odia', languageNameNative: 'ଓଡ଼ିଆ', country: 'IN', direction: 'ltr', order: 10 },
  { languageCode: 'pa', languageNameEnglish: 'Punjabi', languageNameNative: 'ਪੰਜਾਬੀ', country: 'IN', direction: 'ltr', order: 11 },
  { languageCode: 'as', languageNameEnglish: 'Assamese', languageNameNative: 'অসমীয়া', country: 'IN', direction: 'ltr', order: 12 },
  { languageCode: 'ml', languageNameEnglish: 'Malayalam', languageNameNative: 'മലയാളം', country: 'IN', direction: 'ltr', order: 13 },
  { languageCode: 'ne', languageNameEnglish: 'Nepali', languageNameNative: 'नेपाली', country: 'IN', direction: 'ltr', order: 14 },
  { languageCode: 'sa', languageNameEnglish: 'Sanskrit', languageNameNative: 'संस्कृतम्', country: 'IN', direction: 'ltr', order: 15 },
  { languageCode: 'ks', languageNameEnglish: 'Kashmiri', languageNameNative: 'کٲشُر', country: 'IN', direction: 'rtl', order: 16 },
  { languageCode: 'sd', languageNameEnglish: 'Sindhi', languageNameNative: 'सिन्धी', country: 'IN', direction: 'ltr', order: 17 },
  { languageCode: 'kok', languageNameEnglish: 'Konkani', languageNameNative: 'कोंकणी', country: 'IN', direction: 'ltr', order: 18 },
  { languageCode: 'mai', languageNameEnglish: 'Maithili', languageNameNative: 'मैथिली', country: 'IN', direction: 'ltr', order: 19 },
  { languageCode: 'doi', languageNameEnglish: 'Dogri', languageNameNative: 'डोगरी', country: 'IN', direction: 'ltr', order: 20 },
  { languageCode: 'mni', languageNameEnglish: 'Manipuri', languageNameNative: 'ꯃꯤꯇꯩ ꯂꯣꯟ', country: 'IN', direction: 'ltr', order: 21 },
  { languageCode: 'sat', languageNameEnglish: 'Santali', languageNameNative: 'ᱥᱟᱱᱛᱟᱲᱤ', country: 'IN', direction: 'ltr', order: 22 },
  { languageCode: 'bho', languageNameEnglish: 'Bhojpuri', languageNameNative: 'भोजपुरी', country: 'IN', direction: 'ltr', order: 23 },
  
  // Other country languages
  { languageCode: 'ar', languageNameEnglish: 'Arabic', languageNameNative: 'العربية', country: 'AE', direction: 'rtl', order: 1 },
  { languageCode: 'zh', languageNameEnglish: 'Chinese', languageNameNative: '中文', country: 'CN', direction: 'ltr', order: 1 },
  { languageCode: 'es', languageNameEnglish: 'Spanish', languageNameNative: 'Español', country: 'ES', direction: 'ltr', order: 1 },
  { languageCode: 'fr', languageNameEnglish: 'French', languageNameNative: 'Français', country: 'FR', direction: 'ltr', order: 1 },
  { languageCode: 'de', languageNameEnglish: 'German', languageNameNative: 'Deutsch', country: 'DE', direction: 'ltr', order: 1 },
  { languageCode: 'ja', languageNameEnglish: 'Japanese', languageNameNative: '日本語', country: 'JP', direction: 'ltr', order: 1 },
  { languageCode: 'ko', languageNameEnglish: 'Korean', languageNameNative: '한국어', country: 'KR', direction: 'ltr', order: 1 },
  { languageCode: 'pt', languageNameEnglish: 'Portuguese', languageNameNative: 'Português', country: 'PT', direction: 'ltr', order: 1 },
  { languageCode: 'ru', languageNameEnglish: 'Russian', languageNameNative: 'Русский', country: 'RU', direction: 'ltr', order: 1 },
  { languageCode: 'th', languageNameEnglish: 'Thai', languageNameNative: 'ไทย', country: 'TH', direction: 'ltr', order: 1 },
];

async function seedLanguages() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/myground';
    
    if (!process.env.MONGODB_URI) {
      console.warn('⚠️  WARNING: MONGODB_URI not set, using default localhost (development only)');
    }

    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Clear existing languages
    console.log('🔄 Clearing existing languages...');
    await Language.deleteMany({});
    console.log('✅ Cleared existing languages');

    // Insert languages
    console.log('🔄 Seeding languages...');
    const inserted = await Language.insertMany(languages);
    console.log(`✅ Inserted ${inserted.length} languages`);

    // Group by country
    const byCountry: Record<string, number> = {};
    languages.forEach((lang) => {
      byCountry[lang.country] = (byCountry[lang.country] || 0) + 1;
    });

    console.log('\n📊 Summary by country:');
    Object.entries(byCountry).forEach(([country, count]) => {
      console.log(`   ${country}: ${count} language(s)`);
    });

    console.log('\n✅ Language seeding completed successfully!');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding languages:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seedLanguages();

