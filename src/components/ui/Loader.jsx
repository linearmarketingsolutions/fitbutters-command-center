export function Loader() {
  return (
    <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', alignItems: 'center' }}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: 'var(--color-navy)',
            animation: `loaderDot 0.6s ease-in-out ${i * 0.1}s infinite both`,
          }}
        />
      ))}
      <style>{`
        @keyframes loaderDot {
          0%, 80%, 100% { opacity: 0.4; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  )
}
