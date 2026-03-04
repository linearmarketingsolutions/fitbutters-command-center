export function Badge({ children, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.8125rem',
        padding: '0.4rem 0.85rem',
        borderRadius: '9999px',
        border: `2px solid ${selected ? 'var(--color-navy)' : 'var(--color-navy-muted)'}`,
        background: selected ? 'var(--color-navy)' : 'transparent',
        color: selected ? 'var(--color-white)' : 'var(--color-navy)',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
      }}
    >
      {children}
    </button>
  )
}
