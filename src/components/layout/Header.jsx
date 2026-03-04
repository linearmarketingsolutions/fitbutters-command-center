import logo from '../../assets/logo.svg'

export function Header() {
  return (
    <header style={{
      padding: '0.75rem 1.5rem',
      background: 'var(--color-navy)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}>
      <img src={logo} alt="Fit Butters" height={32} style={{ filter: 'brightness(0) invert(1)' }} />
      <span style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.75rem',
        color: 'var(--color-cream)',
        opacity: 0.9,
      }}>
        AI Command Center
      </span>
    </header>
  )
}
