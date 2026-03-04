export function Button({ children, variant = 'primary', disabled, onClick, type = 'button', className = '', ...props }) {
  const base = {
    fontFamily: 'var(--font-body)',
    fontWeight: 600,
    fontSize: '0.9375rem',
    padding: '0.75rem 1.5rem',
    borderRadius: 'var(--radius-md)',
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
    opacity: disabled ? 0.6 : 1,
  }
  const variants = {
    primary: {
      background: 'var(--color-navy)',
      color: 'var(--color-white)',
    },
    secondary: {
      background: 'var(--color-white)',
      color: 'var(--color-navy)',
      border: '2px solid var(--color-navy)',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--color-navy)',
    },
  }
  const style = { ...base, ...variants[variant] }
  return (
    <button
      type={type}
      style={{ ...style, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
      disabled={disabled}
      onClick={onClick}
      className={className}
      onMouseEnter={(e) => !disabled && (e.currentTarget.style.transform = 'translateY(-1px)')}
      onMouseLeave={(e) => (e.currentTarget.style.transform = '')}
      {...props}
    >
      {children}
    </button>
  )
}
