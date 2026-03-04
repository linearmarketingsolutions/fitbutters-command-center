import { useState } from 'react'
import { ErrorBoundary } from '../ErrorBoundary'
import { useClaude } from '../../hooks/useClaude'
import { influencerOutreachPrompt } from '../../config/prompts'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { Loader } from '../ui/Loader'

const PLATFORMS = ['TikTok', 'Instagram', 'YouTube', 'Both']
const NICHES = ['Fitness', 'Recipes', 'Weight Loss', 'Lifestyle', 'Macro Tracking', 'Gym Motivation']
const FLAVOR_TAGS = ['Reese\'s', 'Oreo', 'Twix', 'Fruity PEBBLES', 'Cocoa PEBBLES', 'M&Ms', 'Ghirardelli', 'Jet-Puffed', 'Birthday Cake', 'Peanut', 'Almond', 'Cashew']

function InfluencerToolInner() {
  const { execute, loading, error } = useClaude()
  const [creatorName, setCreatorName] = useState('')
  const [platform, setPlatform] = useState('TikTok')
  const [followerCount, setFollowerCount] = useState('')
  const [niche, setNiche] = useState('Fitness')
  const [flavorTags, setFlavorTags] = useState([])
  const [output, setOutput] = useState(null)

  const toggleFlavor = (tag) => {
    setFlavorTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  const handleGenerate = async () => {
    setOutput(null)
    const prompt = influencerOutreachPrompt({
      creatorName: creatorName.trim(),
      platform,
      followerCount: followerCount.trim(),
      niche,
      flavorTags,
    })
    try {
      const text = await execute({ prompt })
      const json = extractJSON(text)
      if (json) setOutput(json)
    } catch (_) {}
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div style={{ padding: '1.5rem', maxWidth: 720, margin: '0 auto' }}>
      <div style={{ animation: 'fadeUp 0.5s ease both', animationDelay: '0.05s', animationFillMode: 'both' }}>
        <Input
          label="Creator name"
          value={creatorName}
          onChange={(e) => setCreatorName(e.target.value)}
          placeholder="e.g. Sarah Johnson"
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
          <Input
            label="Follower count"
            value={followerCount}
            onChange={(e) => setFollowerCount(e.target.value)}
            placeholder="e.g. 50K"
            disabled={loading}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', marginBottom: '0.35rem', display: 'block' }}>Niche</label>
          <select
            value={niche}
            onChange={(e) => setNiche(e.target.value)}
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
            {NICHES.map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', marginBottom: '0.5rem', display: 'block' }}>Flavor tags (multi-select)</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {FLAVOR_TAGS.map((tag) => (
              <Badge key={tag} selected={flavorTags.includes(tag)} onClick={() => toggleFlavor(tag)}>
                {tag}
              </Badge>
            ))}
          </div>
        </div>
        {error && <p style={{ color: 'var(--color-red)', fontSize: '0.9rem', marginBottom: '1rem' }}>{error}</p>}
        <Button onClick={handleGenerate} disabled={loading}>
          {loading ? <Loader /> : 'Generate'}
        </Button>
      </div>

      {output && (
        <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <Card style={{ animation: 'fadeUp 0.4s ease both', animationDelay: '0.1s', animationFillMode: 'both' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', marginBottom: '0.5rem' }}>Discount Code</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.5rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {output.discountCode || 'N/A'}
              <Button variant="ghost" onClick={() => copyToClipboard(output.discountCode)}>Copy</Button>
            </div>
          </Card>
          <Card style={{ animation: 'fadeUp 0.4s ease both', animationDelay: '0.2s', animationFillMode: 'both' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', marginBottom: '0.5rem' }}>Outreach Email</div>
            <div style={{ fontWeight: 600, marginBottom: '0.75rem' }}>{output.emailSubject || ''}</div>
            <div style={{ whiteSpace: 'pre-wrap', fontSize: '0.95rem', marginBottom: '0.75rem' }}>{output.emailBody || ''}</div>
            <Button variant="secondary" onClick={() => copyToClipboard(`${output.emailSubject}\n\n${output.emailBody}`)}>Copy Email</Button>
          </Card>
          <Card style={{ animation: 'fadeUp 0.4s ease both', animationDelay: '0.3s', animationFillMode: 'both' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', marginBottom: '0.75rem' }}>Content Brief</div>
            <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
              {(output.contentBrief || []).map((bullet, i) => (
                <li key={i} style={{ marginBottom: '0.4rem' }}>{bullet}</li>
              ))}
            </ul>
          </Card>
        </div>
      )}
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

export function InfluencerTool() {
  return (
    <ErrorBoundary fallback={<ToolErrorFallback />}>
      <InfluencerToolInner />
    </ErrorBoundary>
  )
}


function ToolErrorFallback() {
  return (
    <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-red)' }}>
      Something went wrong. Refresh to try again.
    </div>
  )
}
