import { useState, useEffect } from 'react'
import api from '../services/api'
import transactionTypesData from '../data/transactionTypes.json'

export interface TransactionType {
  value: string
  label: string
}

interface UseTransactionTypesOptions {
  useSampleData?: boolean
}

export const useTransactionTypes = (options: UseTransactionTypesOptions = {}) => {
  const { useSampleData = true } = options
  const [transactionTypes, setTransactionTypes] = useState<TransactionType[]>(transactionTypesData as TransactionType[])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchTransactionTypes()
  }, [useSampleData])

  const fetchTransactionTypes = async () => {
    setLoading(true)
    setError(null)

    try {
      if (useSampleData) {
        // Use sample data from JSON
        await new Promise((resolve) => setTimeout(resolve, 300))
        setTransactionTypes(transactionTypesData as TransactionType[])
      } else {
        // Fetch from API
        const response = await api.get('/config/transaction-types')
        setTransactionTypes(response.data.transactionTypes || transactionTypesData)
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch transaction types')
      // Fallback to sample data on error
      setTransactionTypes(transactionTypesData as TransactionType[])
    } finally {
      setLoading(false)
    }
  }

  return { transactionTypes, loading, error, refetch: fetchTransactionTypes }
}




