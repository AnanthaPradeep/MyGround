import { create } from 'zustand'

interface NotificationStore {
  lastUpdate: number
  triggerRefetch: () => void
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  lastUpdate: Date.now(),
  triggerRefetch: () => set({ lastUpdate: Date.now() }),
}))



