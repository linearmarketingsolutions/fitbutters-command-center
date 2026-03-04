import { useState, useEffect } from 'react'
import { KeyGate } from './components/KeyGate'
import { Header } from './components/layout/Header'
import { TabNav } from './components/layout/TabNav'
import { InfluencerTool } from './components/tools/InfluencerTool'
import { SocialTool } from './components/tools/SocialTool'
import { SupportBot } from './components/tools/SupportBot'

const TABS = [
  { id: 'influencer', label: 'Influencer Outreach' },
  { id: 'social', label: 'Social Captions' },
  { id: 'support', label: 'Support Bot' },
]

export default function App() {
  const [hasKey, setHasKey] = useState(false)
  const [activeTab, setActiveTab] = useState(0)

  useEffect(() => {
    setHasKey(!!sessionStorage.getItem('fb_api_key'))
  }, [])

  const handleUnlock = () => setHasKey(true)

  if (!hasKey) {
    return <KeyGate onUnlock={handleUnlock} />
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--color-cream)',
    }}>
      <Header />
      <TabNav tabs={TABS} active={activeTab} onChange={setActiveTab} />
      <main style={{
        flex: 1,
        overflow: 'auto',
        animation: 'fadeUp 0.5s ease both',
      }}>
        {activeTab === 0 && <InfluencerTool />}
        {activeTab === 1 && <SocialTool />}
        {activeTab === 2 && <SupportBot />}
      </main>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
