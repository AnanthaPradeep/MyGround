export interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error' | 'property' | 'message'
  read: boolean
  timestamp: Date
  link?: string
  icon?: string
}

export type NotificationType = Notification['type']

