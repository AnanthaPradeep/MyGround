import { create } from 'zustand'

interface WishlistStore {
  lastUpdate: number
  triggerRefetch: () => void
}

export const useWishlistStore = create<WishlistStore>((set) => ({
  lastUpdate: Date.now(),
  triggerRefetch: () => set({ lastUpdate: Date.now() }),
}))

