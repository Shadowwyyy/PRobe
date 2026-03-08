const sevColor = {
  high: 'var(--high)',
  medium: 'var(--med)',
  low: 'var(--low)'
}

const catIcon = {
  bug: '🐛',
  security: '🔒',
  performance: '⚡',
  style: '✦'
}

export default function ReviewCard({ finding: f }) {
  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderLeft: `3px solid ${sevColor[f.severity] || 'var(--border)'}`,
      borderRadius: 11,
      padding: '16px 18px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <span style={{ fontSize: 14 }}>{catIcon[f.category] || '•'}</span>
        <span style={{
          fontFamily: 'JetBrains Mono',
          fontSize: 11,
          color: sevColor[f.severity],
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>{f.severity}</span>
        <span style={{ color: 'var(--border)', fontSize: 11 }}>·</span>
        <span style={{
          fontFamily: 'JetBrains Mono',
          fontSize: 11,
          color: 'var(--muted)'
        }}>{f.category}</span>
        {f.file && (
          <>
            <span style={{ color: 'var(--border)', fontSize: 11 }}>·</span>
            <span style={{
              fontFamily: 'JetBrains Mono',
              fontSize: 11,
              color: 'var(--muted)'
            }}>{f.file}{f.line ? `:${f.line}` : ''}</span>
          </>
        )}
      </div>

      <p style={{ fontSize: 14, marginBottom: 10, lineHeight: 1.55 }}>{f.issue}</p>

      <div style={{
        background: 'var(--accent-dim)',
        borderRadius: 7,
        padding: '9px 12px',
      }}>
        <p style={{
          fontFamily: 'JetBrains Mono',
          fontSize: 12,
          color: 'var(--accent)',
          lineHeight: 1.6
        }}>→ {f.suggestion}</p>
      </div>
    </div>
  )
}