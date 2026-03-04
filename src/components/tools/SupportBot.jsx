import { useState, useRef, useEffect } from 'react'
import { ErrorBoundary } from '../ErrorBoundary'
import { callClaude } from '../../lib/claude'
import { supportBotSystemPrompt } from '../../config/prompts'
import { Button } from '../ui/Button'
import { Loader } from '../ui/Loader'

const QUICK_REPLIES = [
  'Where can I buy Fit Butters?',
  'How much protein per serving?',
  'What flavors do you have?',
  'Tell me about the influencer program',
  'Shipping and delivery info',
]

function SupportBotInner() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const scrollRef = useRef(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (text) => {
    const sanitized = String(text).trim().slice(0, 500).replace(/[<>\"'`]/g, '')
    if (!sanitized) return
    setInput('')
    const userMsg = { role: 'user', content: sanitized }
    setMessages((m) => [...m, userMsg])
    setLoading(true)
    setError(null)

    let botContent = ''
    const botMsg = { role: 'assistant', content: '', streaming: true }
    setMessages((m) => [...m, botMsg])

    try {
      await callClaude({
        system: supportBotSystemPrompt(),
        prompt: [...messages, userMsg].map((x) => `${x.role}: ${x.content}`).join('\n\n'),
        onStream: (chunk) => {
          botContent += chunk
          setMessages((m) => {
            const copy = [...m]
            const last = copy[copy.length - 1]
            if (last?.role === 'assistant') {
              copy[copy.length - 1] = { ...last, content: botContent }
            }
            return copy
          })
        },
      })
      setMessages((m) => {
        const copy = [...m]
        const last = copy[copy.length - 1]
        if (last?.role === 'assistant') {
          copy[copy.length - 1] = { ...last, streaming: false }
        }
        return copy
      })
    } catch (err) {
      setError(err.message || 'Request failed')
      setMessages((m) => m.filter((x) => x !== botMsg))
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    sendMessage(input)
  }

  const clearChat = () => {
    setMessages([])
    setError(null)
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: 'calc(100vh - 180px)',
      minHeight: 320,
    }}>
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }} ref={scrollRef}>
        {messages.length === 0 && !loading && (
          <div style={{
            textAlign: 'center',
            color: 'rgba(26, 31, 94, 0.5)',
            padding: '2rem',
          }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem' }}>Ask anything about Fit Butters.</p>
          </div>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              animation: 'fadeUp 0.3s ease both',
            }}
          >
            <div style={{
              maxWidth: '85%',
              display: 'flex',
              gap: '0.5rem',
              alignItems: 'flex-end',
              flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
            }}>
              {msg.role === 'assistant' && (
                <div style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: 'var(--color-navy)',
                  flexShrink: 0,
                }} />
              )}
              <div style={{
                background: msg.role === 'user' ? 'var(--color-navy)' : 'var(--color-white)',
                color: msg.role === 'user' ? 'var(--color-white)' : 'var(--color-navy)',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-card)',
                fontFamily: 'var(--font-body)',
                fontSize: '0.95rem',
              }}>
                <div style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</div>
                {msg.streaming && <span style={{ opacity: 0.7 }}>|</span>}
              </div>
            </div>
          </div>
        ))}
        {loading && messages[messages.length - 1]?.role === 'user' && (
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end' }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: 'var(--color-navy)',
            }} />
            <div style={{
              padding: '0.75rem 1rem',
              background: 'var(--color-white)',
              borderRadius: 'var(--radius-lg)',
            }}>
              <Loader />
            </div>
          </div>
        )}
      </div>
      {error && <p style={{ padding: '0 1rem', color: 'var(--color-red)', fontSize: '0.85rem' }}>{error}</p>}
      <div style={{
        padding: '1rem',
        borderTop: '1px solid var(--color-navy-muted)',
        background: 'var(--color-cream)',
      }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
          {QUICK_REPLIES.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => sendMessage(q)}
              disabled={loading}
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.8rem',
                padding: '0.4rem 0.75rem',
                borderRadius: '9999px',
                border: '2px solid var(--color-navy-muted)',
                background: 'var(--color-white)',
                color: 'var(--color-navy)',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {q}
            </button>
          ))}
        </div>
        <div className="support-input-row" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <form onSubmit={handleSubmit} style={{ flex: 1, minWidth: 0 }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question..."
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                fontFamily: 'var(--font-body)',
                fontSize: '0.95rem',
                border: '2px solid var(--color-navy-muted)',
                borderRadius: 'var(--radius-md)',
                background: 'var(--color-white)',
              }}
            />
          </form>
          <Button onClick={() => sendMessage(input)} disabled={loading || !input.trim()}>
            Send
          </Button>
          <Button variant="ghost" onClick={clearChat} disabled={loading}>
            Clear
          </Button>
        </div>
      </div>
      <style>{`
        @media (max-width: 375px) {
          .support-input-row { flex-direction: column; align-items: stretch; }
        }
      `}</style>
    </div>
  )
}

function ToolErrorFallback() {
  return (
    <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-red)' }}>
      Something went wrong. Refresh to try again.
    </div>
  )
}

export function SupportBot() {
  return (
    <ErrorBoundary fallback={<ToolErrorFallback />}>
      <SupportBotInner />
    </ErrorBoundary>
  )
}
