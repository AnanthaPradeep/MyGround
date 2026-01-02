import mongoose, { Document, Schema } from 'mongoose';

export interface ILanguage extends Document {
  languageCode: string; // ISO 639 compliant (e.g., 'en', 'hi', 'ta')
  languageNameEnglish: string; // English name (e.g., 'Hindi', 'Tamil')
  languageNameNative: string; // Native script name (e.g., 'हिंदी', 'தமிழ்')
  country: string; // ISO 3166 country code (e.g., 'IN', 'US', 'AE')
  direction: 'ltr' | 'rtl'; // Text direction
  isDefault: boolean; // Whether this is the default language
  isActive: boolean; // Whether this language is active/enabled
  order: number; // Display order
  createdAt: Date;
  updatedAt: Date;
}

const LanguageSchema = new Schema<ILanguage>(
  {
    languageCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    languageNameEnglish: {
      type: String,
      required: true,
      trim: true,
    },
    languageNameNative: {
      type: String,
      required: true,
      trim: true,
    },
    country: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      index: true,
    },
    direction: {
      type: String,
      enum: ['ltr', 'rtl'],
      required: true,
      default: 'ltr',
    },
    isDefault: {
      type: Boolean,
      default: false,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure only one default language
LanguageSchema.pre('save', async function (next) {
  if (this.isDefault && this.isModified('isDefault')) {
    await Language.updateMany(
      { _id: { $ne: this._id } },
      { $set: { isDefault: false } }
    );
  }
  next();
});

// Index for efficient querying
LanguageSchema.index({ country: 1, isActive: 1, order: 1 });
LanguageSchema.index({ isDefault: 1, isActive: 1 });

const Language = mongoose.model<ILanguage>('Language', LanguageSchema);

export default Language;


