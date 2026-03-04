export function TabNav({ tabs, active, onChange }) {
  return (
    <nav style={{
      display: 'flex',
      gap: 0,
      borderBottom: '2px solid var(--color-navy-muted)',
      position: 'relative',
    }}>
      <div style={{
        position: 'absolute',
        bottom: -2,
        left: 0,
        height: 2,
        background: 'var(--color-navy)',
        transition: 'transform 0.25s ease, width 0.25s ease',
        width: `calc(100% / ${tabs.length})`,
        transform: `translateX(${active * 100}%)`,
      }} />
      {tabs.map((tab, i) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(i)}
          style={{
            flex: 1,
            padding: '0.875rem 1rem',
            fontFamily: 'var(--font-body)',
            fontWeight: active === i ? 600 : 500,
            fontSize: '0.9rem',
            color: active === i ? 'var(--color-navy)' : 'rgba(26, 31, 94, 0.6)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            transition: 'color 0.2s ease',
          }}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  )
}
