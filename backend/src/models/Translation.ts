import mongoose, { Document, Schema } from 'mongoose';

export interface ITranslation extends Document {
  languageCode: string;
  namespace: string;
  key: string;
  value: string;
  createdAt: Date;
  updatedAt: Date;
}

const TranslationSchema = new Schema<ITranslation>(
  {
    languageCode: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    namespace: {
      type: String,
      required: true,
      default: 'common',
      trim: true,
      index: true,
    },
    key: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    value: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient lookups
TranslationSchema.index({ languageCode: 1, namespace: 1, key: 1 }, { unique: true });

// Index for fetching all translations for a language/namespace
TranslationSchema.index({ languageCode: 1, namespace: 1 });

const Translation = mongoose.model<ITranslation>('Translation', TranslationSchema);

export default Translation;

