export interface Language {
  languageCode: string; // ISO 639 compliant (e.g., 'en', 'hi', 'ta')
  languageNameEnglish: string; // English name (e.g., 'Hindi', 'Tamil')
  languageNameNative: string; // Native script name (e.g., 'हिंदी', 'தமிழ்')
  country: string; // ISO 3166 country code (e.g., 'IN', 'US', 'AE')
  direction: 'ltr' | 'rtl'; // Text direction
  isDefault?: boolean; // Whether this is the default language
  order?: number; // Display order
}

export interface LanguagesResponse {
  languages: Language[];
  languagesByCountry: Record<string, Language[]>;
  defaultLanguage: Language | null;
}


