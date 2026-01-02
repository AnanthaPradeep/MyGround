/**
 * Seed Filter Options to Database
 * Run this script to populate filter options in the database
 * Usage: tsx scripts/seedFilterOptions.ts
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import FilterOption from '../src/models/FilterOption';

dotenv.config();

const filterOptionsData = [
  // Transaction Types
  { optionType: 'TRANSACTION_TYPE', value: 'SELL', label: 'Sell', order: 1, isActive: true },
  { optionType: 'TRANSACTION_TYPE', value: 'RENT', label: 'Rent', order: 2, isActive: true },
  { optionType: 'TRANSACTION_TYPE', value: 'LEASE', label: 'Lease', order: 3, isActive: true },
  { optionType: 'TRANSACTION_TYPE', value: 'SUB_LEASE', label: 'Sub Lease', order: 4, isActive: true },
  { optionType: 'TRANSACTION_TYPE', value: 'FRACTIONAL', label: 'Fractional Ownership', order: 5, isActive: true },

  // Property Categories
  { optionType: 'PROPERTY_CATEGORY', value: 'RESIDENTIAL', label: 'Residential', order: 1, isActive: true },
  { optionType: 'PROPERTY_CATEGORY', value: 'COMMERCIAL', label: 'Commercial', order: 2, isActive: true },
  { optionType: 'PROPERTY_CATEGORY', value: 'INDUSTRIAL', label: 'Industrial', order: 3, isActive: true },
  { optionType: 'PROPERTY_CATEGORY', value: 'LAND', label: 'Land', order: 4, isActive: true },
  { optionType: 'PROPERTY_CATEGORY', value: 'SPECIAL', label: 'Special Assets', order: 5, isActive: true },
  { optionType: 'PROPERTY_CATEGORY', value: 'ISLAND', label: 'Island', order: 6, isActive: true },

  // Property Sub-Types - RESIDENTIAL
  { optionType: 'PROPERTY_SUBTYPE', value: 'Apartment / Flat', label: 'Apartment / Flat', category: 'RESIDENTIAL', order: 1, isActive: true },
  { optionType: 'PROPERTY_SUBTYPE', value: 'Builder Floor', label: 'Builder Floor', category: 'RESIDENTIAL', order: 2, isActive: true },
  { optionType: 'PROPERTY_SUBTYPE', value: 'Independent House', label: 'Independent House', category: 'RESIDENTIAL', order: 3, isActive: true },
  { optionType: 'PROPERTY_SUBTYPE', value: 'Villa', label: 'Villa', category: 'RESIDENTIAL', order: 4, isActive: true },
  { optionType: 'PROPERTY_SUBTYPE', value: 'Studio Apartment', label: 'Studio Apartment', category: 'RESIDENTIAL', order: 5, isActive: true },
  { optionType: 'PROPERTY_SUBTYPE', value: 'Penthouse', label: 'Penthouse', category: 'RESIDENTIAL', order: 6, isActive: true },
  { optionType: 'PROPERTY_SUBTYPE', value: 'Duplex / Triplex', label: 'Duplex / Triplex', category: 'RESIDENTIAL', order: 7, isActive: true },
  { optionType: 'PROPERTY_SUBTYPE', value: 'Serviced Apartment', label: 'Serviced Apartment', category: 'RESIDENTIAL', order: 8, isActive: true },
  { optionType: 'PROPERTY_SUBTYPE', value: 'Co-Living Property', label: 'Co-Living Property', category: 'RESIDENTIAL', order: 9, isActive: true },
  { optionType: 'PROPERTY_SUBTYPE', value: 'PG / Shared Accommodation', label: 'PG / Shared Accommodation', category: 'RESIDENTIAL', order: 10, isActive: true },

  // Property Sub-Types - COMMERCIAL
  { optionType: 'PROPERTY_SUBTYPE', value: 'Office Space (IT / Non-IT)', label: 'Office Space (IT / Non-IT)', category: 'COMMERCIAL', order: 1, isActive: true },
  { optionType: 'PROPERTY_SUBTYPE', value: 'Co-Working Space', label: 'Co-Working Space', category: 'COMMERCIAL', order: 2, isActive: true },
  { optionType: 'PROPERTY_SUBTYPE', value: 'Business Center', label: 'Business Center', category: 'COMMERCIAL', order: 3, isActive: true },
  { optionType: 'PROPERTY_SUBTYPE', value: 'Retail Shop', label: 'Retail Shop', category: 'COMMERCIAL', order: 4, isActive: true },
  { optionType: 'PROPERTY_SUBTYPE', value: 'Showroom', label: 'Showroom', category: 'COMMERCIAL', order: 5, isActive: true },
  { optionType: 'PROPERTY_SUBTYPE', value: 'Mall Unit', label: 'Mall Unit', category: 'COMMERCIAL', order: 6, isActive: true },
  { optionType: 'PROPERTY_SUBTYPE', value: 'Hotel / Hospitality Property', label: 'Hotel / Hospitality Property', category: 'COMMERCIAL', order: 7, isActive: true },
  { optionType: 'PROPERTY_SUBTYPE', value: 'Restaurant / Café Space', label: 'Restaurant / Café Space', category: 'COMMERCIAL', order: 8, isActive: true },
  { optionType: 'PROPERTY_SUBTYPE', value: 'Medical / Clinic Space', label: 'Medical / Clinic Space', category: 'COMMERCIAL', order: 9, isActive: true },

  // Property Sub-Types - INDUSTRIAL
  { optionType: 'PROPERTY_SUBTYPE', value: 'Warehouse', label: 'Warehouse', category: 'INDUSTRIAL', order: 1, isActive: true },
  { optionType: 'PROPERTY_SUBTYPE', value: 'Factory', label: 'Factory', category: 'INDUSTRIAL', order: 2, isActive: true },
  { optionType: 'PROPERTY_SUBTYPE', value: 'Manufacturing Unit', label: 'Manufacturing Unit', category: 'INDUSTRIAL', order: 3, isActive: true },
  { optionType: 'PROPERTY_SUBTYPE', value: 'Industrial Shed', label: 'Industrial Shed', category: 'INDUSTRIAL', order: 4, isActive: true },
  { optionType: 'PROPERTY_SUBTYPE', value: 'Logistics Park', label: 'Logistics Park', category: 'INDUSTRIAL', order: 5, isActive: true },
  { optionType: 'PROPERTY_SUBTYPE', value: 'Cold Storage', label: 'Cold Storage', category: 'INDUSTRIAL', order: 6, isActive: true },
  { optionType: 'PROPERTY_SUBTYPE', value: 'Data Center', label: 'Data Center', category: 'INDUSTRIAL', order: 7, isActive: true },
  { optionType: 'PROPERTY_SUBTYPE', value: 'Power / Utility Facility', label: 'Power / Utility Facility', category: 'INDUSTRIAL', order: 8, isActive: true },

  // Property Sub-Types - LAND
  { optionType: 'PROPERTY_SUBTYPE', value: 'Residential Plot', label: 'Residential Plot', category: 'LAND', order: 1, isActive: true },
  { optionType: 'PROPERTY_SUBTYPE', value: 'Commercial Plot', label: 'Commercial Plot', category: 'LAND', order: 2, isActive: true },
  { optionType: 'PROPERTY_SUBTYPE', value: 'Industrial Plot', label: 'Industrial Plot', category: 'LAND', order: 3, isActive: true },
  { optionType: 'PROPERTY_SUBTYPE', value: 'Agricultural Land', label: 'Agricultural Land', category: 'LAND', order: 4, isActive: true },
  { optionType: 'PROPERTY_SUBTYPE', value: 'Farm Land', label: 'Farm Land', category: 'LAND', order: 5, isActive: true },
  { optionType: 'PROPERTY_SUBTYPE', value: 'SEZ Land', label: 'SEZ Land', category: 'LAND', order: 6, isActive: true },
  { optionType: 'PROPERTY_SUBTYPE', value: 'Institutional Land', label: 'Institutional Land', category: 'LAND', order: 7, isActive: true },
  { optionType: 'PROPERTY_SUBTYPE', value: 'Mixed-Use Land', label: 'Mixed-Use Land', category: 'LAND', order: 8, isActive: true },

  // Property Sub-Types - SPECIAL
  { optionType: 'PROPERTY_SUBTYPE', value: 'Resort', label: 'Resort', category: 'SPECIAL', order: 1, isActive: true },
  { optionType: 'PROPERTY_SUBTYPE', value: 'Heritage Property', label: 'Heritage Property', category: 'SPECIAL', order: 2, isActive: true },
  { optionType: 'PROPERTY_SUBTYPE', value: 'Hospital Property', label: 'Hospital Property', category: 'SPECIAL', order: 3, isActive: true },
  { optionType: 'PROPERTY_SUBTYPE', value: 'School / College Property', label: 'School / College Property', category: 'SPECIAL', order: 4, isActive: true },
  { optionType: 'PROPERTY_SUBTYPE', value: 'Stadium / Arena', label: 'Stadium / Arena', category: 'SPECIAL', order: 5, isActive: true },
  { optionType: 'PROPERTY_SUBTYPE', value: 'Convention Center', label: 'Convention Center', category: 'SPECIAL', order: 6, isActive: true },
  { optionType: 'PROPERTY_SUBTYPE', value: 'Airport Property', label: 'Airport Property', category: 'SPECIAL', order: 7, isActive: true },
  { optionType: 'PROPERTY_SUBTYPE', value: 'Port / Marine Property', label: 'Port / Marine Property', category: 'SPECIAL', order: 8, isActive: true },
  { optionType: 'PROPERTY_SUBTYPE', value: 'Renewable Energy Asset', label: 'Renewable Energy Asset', category: 'SPECIAL', order: 9, isActive: true },

  // Property Sub-Types - ISLAND
  { optionType: 'PROPERTY_SUBTYPE', value: 'Private Island', label: 'Private Island', category: 'ISLAND', order: 1, isActive: true },
  { optionType: 'PROPERTY_SUBTYPE', value: 'Resort Island', label: 'Resort Island', category: 'ISLAND', order: 2, isActive: true },
  { optionType: 'PROPERTY_SUBTYPE', value: 'Agricultural Island', label: 'Agricultural Island', category: 'ISLAND', order: 3, isActive: true },
  { optionType: 'PROPERTY_SUBTYPE', value: 'Conservation Island', label: 'Conservation Island', category: 'ISLAND', order: 4, isActive: true },
  { optionType: 'PROPERTY_SUBTYPE', value: 'Tourism Island', label: 'Tourism Island', category: 'ISLAND', order: 5, isActive: true },
  { optionType: 'PROPERTY_SUBTYPE', value: 'Institutional / Government Island', label: 'Institutional / Government Island', category: 'ISLAND', order: 6, isActive: true },

  // Ownership Types
  { optionType: 'OWNERSHIP_TYPE', value: 'FREEHOLD', label: 'Freehold', order: 1, isActive: true },
  { optionType: 'OWNERSHIP_TYPE', value: 'LEASEHOLD', label: 'Leasehold', order: 2, isActive: true },
  { optionType: 'OWNERSHIP_TYPE', value: 'GOVERNMENT', label: 'Government', order: 3, isActive: true },
  { optionType: 'OWNERSHIP_TYPE', value: 'TRUST', label: 'Trust', order: 4, isActive: true },

  // Possession Statuses
  { optionType: 'POSSESSION_STATUS', value: 'READY', label: 'Ready to Move', order: 1, isActive: true },
  { optionType: 'POSSESSION_STATUS', value: 'UNDER_CONSTRUCTION', label: 'Under Construction', order: 2, isActive: true },
  { optionType: 'POSSESSION_STATUS', value: 'PRE_LAUNCH', label: 'Pre Launch', order: 3, isActive: true },

  // Furnishing Types
  { optionType: 'FURNISHING_TYPE', value: 'FULLY_FURNISHED', label: 'Fully Furnished', order: 1, isActive: true },
  { optionType: 'FURNISHING_TYPE', value: 'SEMI_FURNISHED', label: 'Semi Furnished', order: 2, isActive: true },
  { optionType: 'FURNISHING_TYPE', value: 'UNFURNISHED', label: 'Unfurnished', order: 3, isActive: true },

  // Parking Types
  { optionType: 'PARKING_TYPE', value: 'OPEN', label: 'Open', order: 1, isActive: true },
  { optionType: 'PARKING_TYPE', value: 'COVERED', label: 'Covered', order: 2, isActive: true },
  { optionType: 'PARKING_TYPE', value: 'NONE', label: 'None', order: 3, isActive: true },

  // Area Units
  { optionType: 'AREA_UNIT', value: 'SQFT', label: 'Square Feet (sq ft)', order: 1, isActive: true },
  { optionType: 'AREA_UNIT', value: 'SQMT', label: 'Square Meters (sq m)', order: 2, isActive: true },
  { optionType: 'AREA_UNIT', value: 'ACRE', label: 'Acre', order: 3, isActive: true },
  { optionType: 'AREA_UNIT', value: 'HECTARE', label: 'Hectare', order: 4, isActive: true },

  // BHK Options
  { optionType: 'BHK_OPTION', value: '1', label: '1 BHK', order: 1, isActive: true },
  { optionType: 'BHK_OPTION', value: '2', label: '2 BHK', order: 2, isActive: true },
  { optionType: 'BHK_OPTION', value: '3', label: '3 BHK', order: 3, isActive: true },
  { optionType: 'BHK_OPTION', value: '4', label: '4 BHK', order: 4, isActive: true },
  { optionType: 'BHK_OPTION', value: '5', label: '5 BHK', order: 5, isActive: true },
  { optionType: 'BHK_OPTION', value: '6', label: '6 BHK', order: 6, isActive: true },
  { optionType: 'BHK_OPTION', value: '7+', label: '7+ BHK', order: 7, isActive: true },
];

async function seedFilterOptions() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/myground';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Clear existing filter options (optional - comment out if you want to keep existing data)
    await FilterOption.deleteMany({});
    console.log('✅ Cleared existing filter options');

    // Insert filter options
    const result = await FilterOption.insertMany(filterOptionsData);
    console.log(`✅ Successfully seeded ${result.length} filter options`);

    // Verify the data
    const counts = await FilterOption.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$optionType', count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    console.log('\n📊 Filter Options Summary:');
    counts.forEach((item) => {
      console.log(`   ${item._id}: ${item.count} options`);
    });

    await mongoose.disconnect();
    console.log('\n✅ Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding filter options:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seedFilterOptions();



