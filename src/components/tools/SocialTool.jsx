import { useState } from 'react'
import { ErrorBoundary } from '../ErrorBoundary'
import { useClaude } from '../../hooks/useClaude'
import { socialCaptionPrompt } from '../../config/prompts'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Card } from '../ui/Card'
import { Loader } from '../ui/Loader'

const PLATFORMS = ['TikTok', 'Instagram']
const VIBES = ['Energetic', 'Casual', 'Premium', 'Playful', 'Bold', 'Wholesome']

function SocialToolInner() {
  const { execute, loading, error } = useClaude()
  const [topic, setTopic] = useState('')
  const [platform, setPlatform] = useState('TikTok')
  const [vibe, setVibe] = useState('Energetic')
  const [captions, setCaptions] = useState([])

  const handleGenerate = async () => {
    setCaptions([])
    const prompt = socialCaptionPrompt({
      topic: topic.trim(),
      platform,
      vibe,
    })
    try {
      const text = await execute({ prompt })
      const json = extractJSON(text)
      if (json?.captions) setCaptions(json.captions)
    } catch (_) {}
  }

  const copyCaption = (c) => {
    const full = `${c.text}\n\n${(c.hashtags || []).join(' ')}`
    navigator.clipboard.writeText(full)
  }

  return (
    <div style={{ padding: '1.5rem', maxWidth: 720, margin: '0 auto' }}>
      <div style={{ animation: 'fadeUp 0.5s ease both', animationDelay: '0.05s', animationFillMode: 'both' }}>
        <Input
          label="Topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g. New Reese's flavor launch"
          disabled={loading}
        />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', marginBottom: '0.35rem', display: 'block' }}>Platform</label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                fontFamily: 'var(--font-body)',
                border: '2px solid var(--color-navy-muted)',
                borderRadius: 'var(--radius-md)',
                background: 'var(--color-white)',
              }}
            >
              {PLATFORMS.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', marginBottom: '0.35rem', display: 'block' }}>Vibe</label>
            <select
              value={vibe}
              onChange={(e) => setVibe(e.target.value)}
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                fontFamily: 'var(--font-body)',
                border: '2px solid var(--color-navy-muted)',
                borderRadius: 'var(--radius-md)',
                background: 'var(--color-white)',
              }}
            >
              {VIBES.map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>
        </div>
        {error && <p style={{ color: 'var(--color-red)', fontSize: '0.9rem', marginBottom: '1rem' }}>{error}</p>}
        <Button onClick={handleGenerate} disabled={loading}>
          {loading ? <Loader /> : 'Generate Captions'}
        </Button>
      </div>

      {captions.length > 0 && (
        <div style={{
          marginTop: '2rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '1rem',
        }} className="social-captions-grid">
          {captions.map((c, i) => (
            <Card
              key={i}
              style={{
                animation: 'fadeUp 0.4s ease both',
                animationDelay: `${0.1 + i * 0.08}s`,
                animationFillMode: 'both',
              }}
            >
              <p style={{ margin: '0 0 0.75rem', whiteSpace: 'pre-wrap', fontSize: '0.95rem' }}>{c.text}</p>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-navy)', opacity: 0.8, marginBottom: '0.75rem' }}>
                {(c.hashtags || []).join(' ')}
              </div>
              <Button variant="secondary" onClick={() => copyCaption(c)}>Copy</Button>
            </Card>
          ))}
        </div>
      )}
      <style>{`
        @media (max-width: 480px) {
          .social-captions-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  )
}

function extractJSON(text) {
  const match = text.match(/\{[\s\S]*\}/)
  if (!match) return null
  try {
    return JSON.parse(match[0])
  } catch {
    return null
  }
}

function ToolErrorFallback() {
  return (
    <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-red)' }}>
      Something went wrong. Refresh to try again.
    </div>
  )
}

export function SocialTool() {
  return (
    <ErrorBoundary fallback={<ToolErrorFallback />}>
      <SocialToolInner />
    </ErrorBoundary>
  )
}
