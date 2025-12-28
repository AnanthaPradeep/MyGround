export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginationParams {
  page: number
  limit: number
  total?: number
  pages?: number
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: PaginationParams
}

export interface FilterParams {
  [key: string]: string | number | boolean | undefined
}

export interface SelectOption {
  label: string
  value: string | number
}

export interface Coordinates {
  latitude: number
  longitude: number
}

export interface GeoLocation {
  type: 'Point'
  coordinates: [number, number] // [longitude, latitude]
}



