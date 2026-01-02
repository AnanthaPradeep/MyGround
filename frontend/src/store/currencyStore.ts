import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Currency {
  code: string // e.g., 'INR', 'USD', 'EUR'
  symbol: string // e.g., '₹', '$', '€'
  name: string // e.g., 'Indian Rupee', 'US Dollar'
  exchangeRate?: number // Exchange rate to base currency
}

interface CurrencyState {
  selectedCurrency: Currency | null
  isCurrencySet: boolean
  setCurrency: (currency: Currency) => void
  clearCurrency: () => void
}

const defaultCurrency: Currency = {
  code: 'INR',
  symbol: '₹',
  name: 'Indian Rupee',
  exchangeRate: 1,
}

export const useCurrencyStore = create<CurrencyState>()(
  persist(
    (set) => ({
      selectedCurrency: defaultCurrency,
      isCurrencySet: true,
      setCurrency: (currency) => set({ selectedCurrency: currency, isCurrencySet: true }),
      clearCurrency: () => set({ selectedCurrency: defaultCurrency, isCurrencySet: true }),
    }),
    {
      name: 'myground-currency-storage',
    }
  )
)




