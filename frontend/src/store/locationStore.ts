import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface UserLocation {
  city: string
  state: string
  country: string
  area?: string
  locality?: string
  pincode?: string
  coordinates?: {
    lat: number
    lng: number
  }
  displayName: string
}

interface LocationState {
  userLocation: UserLocation | null
  isLocationSet: boolean
  setLocation: (location: UserLocation) => void
  clearLocation: () => void
}

export const useLocationStore = create<LocationState>()(
  persist(
    (set) => ({
      userLocation: null,
      isLocationSet: false,
      setLocation: (location) => set({ userLocation: location, isLocationSet: true }),
      clearLocation: () => set({ userLocation: null, isLocationSet: false }),
    }),
    {
      name: 'myground-location-storage',
    }
  )
)


