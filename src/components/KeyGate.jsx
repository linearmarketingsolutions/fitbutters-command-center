import { useState } from 'react'
import { Input } from './ui/Input'
import { Button } from './ui/Button'

export function KeyGate({ onUnlock }) {
  const [key, setKey] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmed = key.trim()
    if (!trimmed) {
      setError('Enter your API key to continue')
      return
    }
    sessionStorage.setItem('fb_api_key', trimmed)
    setError('')
    onUnlock()
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
      background: 'var(--color-cream)',
    }}>
      <div style={{
        width: '100%',
        maxWidth: 420,
        textAlign: 'center',
        animation: 'fadeUp 0.5s ease both',
      }}>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.75rem, 5vw, 2.25rem)',
          color: 'var(--color-navy)',
          marginBottom: '0.5rem',
        }}>
          Fit Butters
        </h1>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.95rem',
          color: 'rgba(26, 31, 94, 0.7)',
          marginBottom: '1.5rem',
        }}>
          AI Command Center
        </p>
        <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
          <Input
            label="Anthropic API Key"
            type="password"
            value={key}
            onChange={(e) => { setKey(e.target.value); setError('') }}
            placeholder="sk-ant-..."
            error={error}
            autoComplete="off"
          />
          <div style={{ width: '100%', marginTop: '0.5rem' }}>
            <Button type="submit" variant="primary" style={{ width: '100%' }}>
              Continue
            </Button>
          </div>
        </form>
      </div>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
