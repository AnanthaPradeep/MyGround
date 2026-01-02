import { useState, useEffect, useCallback } from 'react'
import api from '../services/api'

export interface Draft {
  draftId: string
  propertyData: any
  currentStep: number
  lastSaved: string
  updatedAt: string
}

interface UseDraftsOptions {
  userId?: string
}

export const useDrafts = (options: UseDraftsOptions = {}) => {
  const { userId } = options
  const [drafts, setDrafts] = useState<Draft[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchDrafts = useCallback(async () => {
    if (!userId) return

    setLoading(true)
    setError(null)

    try {
      const response = await api.get('/drafts')
      setDrafts(response.data.drafts || [])
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch drafts')
      setDrafts([])
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    fetchDrafts()
  }, [fetchDrafts])

  const getDraft = useCallback(async (draftId: string): Promise<Draft | null> => {
    try {
      const response = await api.get(`/drafts/${draftId}`)
      return response.data.draft || null
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch draft')
      return null
    }
  }, [])

  const saveDraft = useCallback(async (
    draftId: string | null,
    propertyData: any,
    currentStep: number
  ): Promise<Draft | null> => {
    try {
      const response = await api.post('/drafts', {
        draftId,
        propertyData,
        currentStep,
      })
      return response.data.draft || null
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save draft')
      return null
    }
  }, [])

  const deleteDraft = useCallback(async (draftId: string): Promise<boolean> => {
    try {
      await api.delete(`/drafts/${draftId}`)
      await fetchDrafts() // Refresh list
      return true
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete draft')
      return false
    }
  }, [fetchDrafts])

  const submitDraft = useCallback(async (draftId: string): Promise<any> => {
    try {
      const response = await api.post(`/drafts/${draftId}/submit`)
      await fetchDrafts() // Refresh list
      return response.data
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to submit draft')
      throw err
    }
  }, [fetchDrafts])

  const getDraftCount = useCallback(async (): Promise<number> => {
    try {
      const response = await api.get('/drafts/count/total')
      return response.data.count || 0
    } catch (err: any) {
      return 0
    }
  }, [])

  return {
    drafts,
    loading,
    error,
    refetch: fetchDrafts,
    getDraft,
    saveDraft,
    deleteDraft,
    submitDraft,
    getDraftCount,
  }
}


