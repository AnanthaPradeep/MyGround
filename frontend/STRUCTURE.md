# Frontend Structure Documentation

## 📁 Directory Structure

```
frontend/src/
├── types/              # TypeScript type definitions
│   ├── index.ts       # Re-exports all types
│   ├── property.ts    # Property-related types
│   ├── user.ts        # User-related types
│   └── common.ts      # Common/shared types
│
├── constants/         # Application constants
│   ├── index.ts       # Re-exports all constants
│   ├── propertyTypes.ts  # Property type constants
│   ├── routes.ts      # Route paths
│   └── api.ts         # API endpoints
│
├── hooks/             # Custom React hooks
│   ├── index.ts       # Re-exports all hooks
│   ├── useProperties.ts  # Property data fetching hook
│   ├── useAuth.ts     # Authentication hook
│   └── useLocalStorage.ts  # LocalStorage hook
│
├── utils/             # Utility functions
│   ├── index.ts       # Re-exports all utils
│   └── formatters.ts  # Formatting utilities
│
├── data/              # Static data files
│   └── sampleProperties.json  # Sample property data
│
├── components/        # React components
├── pages/            # Page components
├── services/         # API services
└── store/            # State management
```

## 🎯 Type Definitions

### Property Types (`types/property.ts`)
- `TransactionType` - SELL, RENT, LEASE, etc.
- `PropertyCategory` - RESIDENTIAL, COMMERCIAL, etc.
- `Property` - Complete property interface
- `PropertyFormData` - Form data structure
- `Location`, `Pricing`, `Media`, `Legal`, `AssetDNA` - Nested interfaces

### User Types (`types/user.ts`)
- `UserRole` - USER, OWNER, BROKER, etc.
- `User` - User interface
- `UserProfile` - Extended user profile
- `AuthState` - Authentication state

### Common Types (`types/common.ts`)
- `ApiResponse<T>` - Generic API response
- `PaginationParams` - Pagination data
- `FilterParams` - Filter parameters
- `Coordinates` - Geographic coordinates

## 📊 Constants

### Property Types (`constants/propertyTypes.ts`)
- `TRANSACTION_TYPES` - All transaction types
- `PROPERTY_CATEGORIES` - All property categories
- `PROPERTY_SUBTYPES` - Sub-types by category
- `INDIAN_STATES` - List of Indian states
- `CURRENCIES` - Currency options with symbols

### Routes (`constants/routes.ts`)
- `ROUTES` - All application routes
- Helper functions for dynamic routes

### API (`constants/api.ts`)
- `API_ENDPOINTS` - All API endpoint paths
- `API_BASE_URL` - Base API URL

## 🪝 Custom Hooks

### `useProperties(options)`
Fetches properties with options:
- `useSampleData: boolean` - Use JSON data or API
- `filters: object` - Filter parameters
- Returns: `{ properties, loading, error, refetch }`

### `useProperty(id, useSampleData)`
Fetches single property:
- Returns: `{ property, loading, error, refetch }`

### `useAuth()`
Authentication hook:
- Returns: `{ user, isAuthenticated, isLoading, login, register, logout, updateUser }`

### `useLocalStorage(key, initialValue)`
LocalStorage hook:
- Returns: `[value, setValue]` - Similar to useState but persists to localStorage

## 🛠️ Utilities

### Formatters (`utils/formatters.ts`)
- `formatPrice(amount, currency)` - Format price with currency symbol
- `formatDate(date)` - Format date to readable string
- `formatRelativeTime(date)` - Format as "2 days ago"
- `formatNumber(num)` - Format number with commas
- `formatArea(area, unit)` - Format area with unit

## 📄 Sample Data

### `data/sampleProperties.json`
Contains 6 sample properties with:
- Complete property information
- Asset DNA data
- Media URLs
- Location coordinates
- Pricing information

## 🔄 Usage Examples

### Using Hooks
```typescript
// Fetch properties
const { properties, loading } = useProperties({ useSampleData: true })

// Fetch single property
const { property, loading } = useProperty(id, true)

// Use auth
const { user, isAuthenticated, logout } = useAuth()
```

### Using Constants
```typescript
import { TRANSACTION_TYPES, PROPERTY_CATEGORIES } from '../constants/propertyTypes'
import { ROUTES } from '../constants/routes'
import { API_ENDPOINTS } from '../constants/api'
```

### Using Types
```typescript
import { Property, PropertyFormData } from '../types/property'
import { User, UserRole } from '../types/user'
```

### Using Utils
```typescript
import { formatPrice, formatDate } from '../utils/formatters'
```

## 🎨 Benefits

1. **Type Safety** - All types properly defined and exported
2. **Reusability** - Constants and hooks can be used across components
3. **Maintainability** - Centralized constants and types
4. **Testability** - Easy to mock with sample data
5. **Scalability** - Easy to extend with new types/constants



