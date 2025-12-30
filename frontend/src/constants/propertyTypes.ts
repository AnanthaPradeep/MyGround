export const TRANSACTION_TYPES = ['SELL', 'RENT', 'LEASE', 'SUB_LEASE', 'FRACTIONAL'] as const
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
    'Independent House',
    'Villa',
    'Studio Apartment',
    'Penthouse',
    'Duplex / Triplex',
    'Serviced Apartment',
    'Co-Living Property',
    'PG / Shared Accommodation',
  ],
  COMMERCIAL: [
    'Office Space (IT / Non-IT)',
    'Co-Working Space',
    'Business Center',
    'Retail Shop',
    'Showroom',
    'Mall Unit',
    'Hotel / Hospitality Property',
    'Restaurant / Café Space',
    'Medical / Clinic Space',
  ],
  INDUSTRIAL: [
    'Warehouse',
    'Factory',
    'Manufacturing Unit',
    'Industrial Shed',
    'Logistics Park',
    'Cold Storage',
    'Data Center',
    'Power / Utility Facility',
  ],
  LAND: [
    'Residential Plot',
    'Commercial Plot',
    'Industrial Plot',
    'Agricultural Land',
    'Farm Land',
    'SEZ Land',
    'Institutional Land',
    'Mixed-Use Land',
  ],
  SPECIAL: [
    'Resort',
    'Heritage Property',
    'Hospital Property',
    'School / College Property',
    'Stadium / Arena',
    'Convention Center',
    'Airport Property',
    'Port / Marine Property',
    'Renewable Energy Asset',
  ],
  ISLAND: [
    'Private Island',
    'Resort Island',
    'Agricultural Island',
    'Conservation Island',
    'Tourism Island',
    'Institutional / Government Island',
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

