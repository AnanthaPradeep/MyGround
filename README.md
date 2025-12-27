# MyGround (MG) - Real Estate Platform

A comprehensive, production-ready real estate marketplace platform built with React, Node.js, and MongoDB. Supports all property types including residential, commercial, industrial, land, and special assets.

## 🚀 Features

### Core Features
- **Multi-step Property Listing**: Comprehensive 7-step form with validation
- **MG Asset DNA™**: Unique asset verification and intelligence system
- **Role-based Access Control**: Support for Owners, Brokers, Developers, and Admins
- **Geo-verification**: Mandatory location verification with map integration
- **Fraud Detection**: Duplicate listing detection and price anomaly checks
- **Dynamic Property Schemas**: Category-specific fields for all property types
- **Media Management**: Image, video, and document upload support
- **Legal Compliance**: RERA, title verification, and compliance tracking

### Property Types Supported
- **Residential**: Flats, Villas, Independent Houses, Co-living, etc.
- **Commercial**: Offices, Retail, Malls, Hotels, Co-working spaces
- **Industrial**: Warehouses, Factories, Logistics Parks
- **Land**: Residential Plots, Commercial Plots, Agricultural Land, SEZ Land
- **Special Assets**: Islands, Resorts, Heritage Properties, Data Centers

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB (v6 or higher)
- npm or yarn

## 🛠️ Installation

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Update `.env` with your configuration:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/myground
JWT_SECRET=your-super-secret-jwt-key-change-in-production
```

5. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## 📁 Project Structure

```
MyGround/
├── backend/
│   ├── src/
│   │   ├── config/          # Database configuration
│   │   ├── models/           # MongoDB models (User, Property, AssetDNA)
│   │   ├── routes/           # API routes (auth, properties)
│   │   ├── middleware/       # Authentication & authorization
│   │   ├── utils/            # Utilities (JWT, validation, fraud detection)
│   │   └── server.ts         # Express server entry point
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── components/       # React components
│   │   │   └── property/     # Property listing step components
│   │   ├── pages/            # Page components
│   │   ├── services/         # API service layer
│   │   ├── types/            # TypeScript type definitions
│   │   └── App.tsx           # Main app component
│   ├── package.json
│   └── vite.config.ts
│
└── README.md
```

## 🔐 Authentication

### User Registration
```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "mobile": "9876543210",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "OWNER"
}
```

### User Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

## 📝 API Endpoints

### Properties

- `POST /api/properties` - Create new property listing (requires auth)
- `GET /api/properties` - Get all properties with filters
- `GET /api/properties/:id` - Get property by ID
- `PUT /api/properties/:id` - Update property (owner/admin only)
- `POST /api/properties/:id/submit` - Submit property for review
- `DELETE /api/properties/:id` - Delete property (owner/admin only)

### Query Parameters for GET /api/properties

- `transactionType`: SELL, RENT, LEASE, etc.
- `propertyCategory`: RESIDENTIAL, COMMERCIAL, INDUSTRIAL, LAND, SPECIAL
- `city`: Filter by city
- `state`: Filter by state
- `minPrice`: Minimum price filter
- `maxPrice`: Maximum price filter
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)

## 🧬 MG Asset DNA™ System

Every property receives a unique Asset DNA ID with:
- **Verification Score**: Based on documents, media, and KYC
- **Legal Risk Assessment**: LOW, MEDIUM, or HIGH
- **Geo-Verification**: Location accuracy and verification
- **Trust Score**: Overall property trustworthiness
- **Market Intelligence**: Price comparison and market metrics

## 🛡️ Security Features

- JWT-based authentication
- Role-based access control (RBAC)
- Input validation and sanitization
- Rate limiting for listings
- Duplicate listing detection
- Price anomaly detection
- Fraud prevention mechanisms

## 🎨 Frontend Features

### Multi-Step Form
1. **Step 1**: Property Category & Transaction Type
2. **Step 2**: Location & Geo-Verification
3. **Step 3**: Property Details (category-specific)
4. **Step 4**: Pricing & Financial Terms
5. **Step 5**: Media Upload (images, videos, floor plans)
6. **Step 6**: Legal & Compliance Documents
7. **Step 7**: Review & Submit

### UI/UX Features
- Progress indicator
- Real-time validation
- Responsive design
- Error handling
- Toast notifications
- Form autosave (can be implemented)

## 🔄 Next Steps / Future Enhancements

1. **Media Upload**: Integrate cloud storage (AWS S3, Cloudinary)
2. **Map Integration**: Add Google Maps/Mapbox for location picker
3. **Payment Integration**: Razorpay (India) and Stripe (International)
4. **Real-time Messaging**: Socket.IO for buyer-seller communication
5. **Search & Filters**: Advanced search with geo-radius and polygon selection
6. **Admin Panel**: Property approval and moderation dashboard
7. **Email Notifications**: Send emails on listing status changes
8. **Analytics Dashboard**: Property views, saves, inquiries tracking

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `mongod`
- Check connection string in `.env`
- Verify MongoDB is accessible on default port 27017

### Port Already in Use
- Backend: Change `PORT` in `.env`
- Frontend: Change port in `vite.config.ts`

### CORS Issues
- Backend CORS is configured for `localhost:5173`
- Update CORS settings in `backend/src/server.ts` if needed

## 📄 License

This project is proprietary software for MyGround (MG) platform.

## 👥 Support

For issues and questions, please contact the development team.

---

**Built with ❤️ for MyGround**

