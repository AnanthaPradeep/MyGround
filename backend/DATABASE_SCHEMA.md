# Property Database Schema Confirmation

## Database: MongoDB
The application uses MongoDB with Mongoose ODM for property data storage.

## Property Model Structure

### Core Fields
- **assetId** (String, required, unique, immutable) - MG Asset DNA™ ID
- **listedBy** (ObjectId, ref: 'User', required) - Property owner/creator
- **transactionType** (Enum: SELL, RENT, LEASE, SUB_LEASE, FRACTIONAL, required)
- **propertyCategory** (Enum: RESIDENTIAL, COMMERCIAL, INDUSTRIAL, LAND, SPECIAL, required)
- **propertySubType** (String, required)

### Location & Geo
- **location** (Object, required)
  - country, state, city, area, locality (all String, required)
  - landmark (String, optional)
  - pincode (String, required)
  - coordinates (GeoJSON Point: [longitude, latitude], required)
  - address (String, required)

### Property Details
- **title** (String, required, trimmed)
- **description** (String, required)
- **ownershipType** (Enum: FREEHOLD, LEASEHOLD, GOVERNMENT, TRUST, required)
- **propertyAge** (Number, optional)
- **possessionStatus** (Enum: READY, UNDER_CONSTRUCTION, PRE_LAUNCH, required)

### Category-Specific Fields

#### Residential
- bhk, bathrooms, balconies, floor, totalFloors (Numbers)
- furnishing (Enum: FULLY_FURNISHED, SEMI_FURNISHED, UNFURNISHED)
- parking (Enum: OPEN, COVERED, NONE)

#### Commercial/Industrial
- builtUpArea, carpetArea, powerLoad, floorLoadCapacity, ceilingHeight (Numbers)
- dockAvailable, freightElevator (Booleans)

#### Land
- plotArea (Number, required)
- areaUnit (Enum: SQFT, SQMT, ACRE, HECTARE, default: SQFT)
- frontage, depth, roadAccessWidth, fsi, heightLimit (Numbers)
- zoningType (String)
- waterAvailable, electricityAvailable (Booleans)

### Pricing
- **pricing** (Object, required)
  - expectedPrice, rentAmount, leaseValue (Numbers, optional)
  - priceNegotiable (Boolean, default: true)
  - maintenanceCharges, securityDeposit, bookingAmount (Numbers, optional)
  - currency (String, default: 'INR')

### Media
- **media** (Object, required)
  - images (Array of Strings, required) - Can store base64 or URLs
  - videos, droneFootage, floorPlans (Arrays of Strings, optional)
  - virtualTour (String, optional)

### Legal & Compliance
- **legal** (Object, required)
  - reraNumber, titleDeed, landUseCertificate, encumbranceCertificate, occupancyCertificate, completionCertificate (Strings, optional)
  - titleClear, encumbranceFree (Booleans, default: false)
  - litigationStatus (Enum: NONE, PENDING, RESOLVED, default: 'NONE')

### MG Asset DNA™
- **assetDNA** (Object, required)
  - verificationScore (Number, 0-100, default: 0)
  - geoVerified (Boolean, default: false)
  - legalRisk (Enum: LOW, MEDIUM, HIGH, default: 'MEDIUM')
  - marketActivityScore, assetTrustScore, priceVsLocalAverage (Numbers)
  - ownershipHistory (Array of Objects: date, owner, price)

### Status & Metadata
- **status** (Enum: DRAFT, PENDING, APPROVED, REJECTED, PAUSED, SOLD, RENTED, default: 'DRAFT')
- **isVerified** (Boolean, default: false)
- **isFeatured** (Boolean, default: false)
- **views, saves, inquiries** (Numbers, default: 0)
- **publishedAt, expiresAt** (Dates, optional)
- **createdAt, updatedAt** (Auto-generated timestamps)

## Database Indexes

1. **Geo-spatial Index**: `location.coordinates` (2dsphere) - For location-based queries
2. **Text Search Index**: `title`, `description` - For full-text search
3. **Query Indexes**:
   - `transactionType` + `propertyCategory`
   - `status` + `isVerified`
   - `listedBy`
   - `pricing.expectedPrice`
   - `pricing.rentAmount`
   - `createdAt` (descending)

## API Payload Limit

- **Current Limit**: 50MB (increased from default 100KB)
- **Configuration**: `backend/src/server.ts`
- **Reason**: Property listings with base64-encoded images can exceed default limit

## Collection Name
- **Collection**: `properties`
- **Model**: `Property`

## Notes
- All images are stored as strings (base64 encoded or URLs)
- Asset DNA is automatically generated/updated when property is created/updated
- Geo-spatial queries are supported via MongoDB 2dsphere index
- Full-text search is available on title and description fields

