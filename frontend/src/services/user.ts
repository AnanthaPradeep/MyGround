export type UserRole = 'USER' | 'OWNER' | 'BROKER' | 'DEVELOPER' | 'ADMIN'

export type KYCStatus = 'PENDING' | 'VERIFIED' | 'REJECTED'

export interface User {
  id: string
  email: string
  mobile: string
  firstName: string
  lastName: string
  role: UserRole
  isVerified: boolean
  isEmailVerified: boolean
  isMobileVerified: boolean
  kycStatus: KYCStatus
  trustScore: number
  profilePicture?: string
  createdAt?: string
  updatedAt?: string
}

export interface UserProfile extends User {
  kycDocuments?: {
    pan?: string
    aadhaar?: string
    passport?: string
    reraId?: string
    businessRegistration?: string
  }
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

