export const TRANSACTION_TYPES = ['SELL', 'RENT', 'LEASE', 'BUY', 'SUB_LEASE', 'FRACTIONAL'] as const
export const PROPERTY_CATEGORIES = ['RESIDENTIAL', 'COMMERCIAL', 'INDUSTRIAL', 'LAND', 'SPECIAL', 'ISLAND'] as const
export const OWNERSHIP_TYPES = ['FREEHOLD', 'LEASEHOLD', 'GOVERNMENT', 'TRUST'] as const
export const POSSESSION_STATUSES = ['READY', 'UNDER_CONSTRUCTION', 'PRE_LAUNCH'] as const
export const FURNISHING_TYPES = ['FULLY_FURNISHED', 'SEMI_FURNISHED', 'UNFURNISHED'] as const
export const PARKING_TYPES = ['OPEN', 'COVERED', 'NONE'] as const
export const AREA_UNITS = ['SQFT', 'SQMT', 'ACRE', 'HECTARE'] as const
export const LITIGATION_STATUSES = ['NONE', 'PENDING', 'RESOLVED'] as const
export const PROPERTY_STATUSES = ['DRAFT', 'PENDING', 'APPROVED', 'REJECTED', 'PAUSED', 'SOLD', 'RENTED'] as const
export const LEGAL_RISK_LEVELS = ['LOW', 'MEDIUM', 'HIGH'] as const

export const PROPERTY_SUBTYPES = {
  RESIDENTIAL: [
    'Apartment / Flat',
    'Builder Floor',
    'Independent House / Villa',
    'Studio Apartment',
    'Penthouse',
    'Duplex / Triplex',
    'Co-living',
    'Serviced Apartment',
  ],
  COMMERCIAL: [
    'Office (IT)',
    'Office (Non-IT)',
    'Co-working Space',
    'Retail Shop',
    'Showroom',
    'Mall Space',
    'Hotel / Hospitality',
    'Business Center',
  ],
  INDUSTRIAL: [
    'Warehouse',
    'Factory / Manufacturing Unit',
    'Logistics Park',
    'Cold Storage',
    'Industrial Shed',
  ],
  LAND: [
    'Residential Plot',
    'Commercial Plot',
    'Agricultural Land',
    'Farm Land',
    'Industrial Land',
    'SEZ Land',
    'Institutional Land',
  ],
  SPECIAL: [
    'Resort',
    'Heritage Property',
    'School / Hospital Property',
    'Data Center',
    'Airport / Port Asset',
  ],
  ISLAND: [
    'Private Island',
    'Resort Island',
    'Residential Island',
    'Commercial Island',
    'Mixed-Use Island',
  ],
} as const

export const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Delhi',
  'Puducherry',
] as const

export const CURRENCIES = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
] as const

