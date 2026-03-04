export function Card({ children, style = {} }) {
  return (
    <div
      style={{
        background: 'var(--color-white)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.25rem 1.5rem',
        boxShadow: 'var(--shadow-card)',
        transition: 'box-shadow 0.2s ease',
        ...style,
      }}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = 'var(--shadow-card-hover)')}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'var(--shadow-card)')}
    >
      {children}
    </div>
  )
}
