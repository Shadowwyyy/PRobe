export default function PRMeta({ meta }) {
  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 11,
      padding: '16px 20px',
      marginBottom: 28,
      display: 'flex',
      alignItems: 'center',
      gap: 14,
    }}>
      <img
        src={meta.avatar}
        alt={meta.author}
        style={{ width: 38, height: 38, borderRadius: 9, flexShrink: 0 }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          fontWeight: 700,
          fontSize: 14,
          marginBottom: 3,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {meta.title}
        </p>
        <p style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'JetBrains Mono' }}>
          {meta.repo} · #{meta.num} by {meta.author}
        </p>
      </div>
      <div style={{ display: 'flex', gap: 16, flexShrink: 0 }}>
        <Stat label="files" val={meta.changed_files} color="var(--text)" />
        <Stat label="+" val={meta.additions} color="var(--approve)" />
        <Stat label="-" val={meta.deletions} color="var(--high)" />
      </div>
    </div>
  )
}

function Stat({ label, val, color }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <p style={{ fontSize: 15, fontWeight: 700, color, fontFamily: 'JetBrains Mono' }}>{val}</p>
      <p style={{ fontSize: 11, color: 'var(--muted)' }}>{label}</p>
    </div>
  )
}