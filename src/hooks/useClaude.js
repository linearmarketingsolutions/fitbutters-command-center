import { useState, useCallback } from 'react'
import { callClaude } from '../lib/claude'

export function useClaude() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const execute = useCallback(async ({ system, prompt, onStream }) => {
    setLoading(true)
    setError(null)
    try {
      const result = await callClaude({ system, prompt, onStream })
      return result
    } catch (err) {
      setError(err.message || 'Request failed')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return { execute, loading, error, setError }
}
