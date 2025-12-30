# Database Seeding Scripts

## Filter Options Seeding

### Description
This script seeds the database with all filter options including:
- Transaction Types (SELL, RENT, LEASE, etc.)
- Property Categories (RESIDENTIAL, COMMERCIAL, etc.)
- Property Sub-Types (organized by category)
- Ownership Types, Possession Statuses, Furnishing Types, etc.

### Usage

**Run the seed script:**
```bash
npm run seed-filters
```

Or directly with tsx:
```bash
tsx scripts/seedFilterOptions.ts
```

### What it does:
1. Connects to MongoDB using `MONGODB_URI` from environment variables
2. Clears existing filter options (optional - can be commented out)
3. Inserts all filter options into the `filteroptions` collection
4. Displays a summary of seeded options by type

### Important Notes:
- Make sure your `.env` file has `MONGODB_URI` configured
- The script will clear existing filter options before seeding
- All options are marked as `isActive: true` by default
- Options are ordered using the `order` field for consistent display

### After Seeding:
Once seeded, all filter options will be fetched from the database via:
- `GET /api/filters/options` - Get all filter options
- `GET /api/filters/options/:type` - Get options by type (e.g., TRANSACTION_TYPE)

The frontend will automatically fetch and use these options from the database.

