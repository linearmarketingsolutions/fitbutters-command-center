export function Input({ label, type = 'text', value, onChange, placeholder, disabled, error, ...props }) {
  return (
    <div style={{ marginBottom: '1rem' }}>
      {label && (
        <label style={{
          display: 'block',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.75rem',
          fontWeight: 500,
          color: 'var(--color-navy)',
          marginBottom: '0.35rem',
        }}>
          {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        style={{
          width: '100%',
          padding: '0.75rem 1rem',
          fontFamily: 'var(--font-body)',
          fontSize: '1rem',
          color: 'var(--color-navy)',
          background: 'var(--color-white)',
          border: `2px solid ${error ? 'var(--color-red)' : 'var(--color-navy-muted)'}`,
          borderRadius: 'var(--radius-md)',
          outline: 'none',
          transition: 'border-color 0.15s ease',
        }}
        onFocus={(e) => !error && (e.target.style.borderColor = 'var(--color-navy)')}
        onBlur={(e) => (e.target.style.borderColor = '')}
        {...props}
      />
      {error && (
        <span style={{ fontSize: '0.8rem', color: 'var(--color-red)', marginTop: '0.25rem', display: 'block' }}>
          {error}
        </span>
      )}
    </div>
  )
}
