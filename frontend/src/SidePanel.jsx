const verdictColor = {
  approve: 'var(--approve)',
  request_changes: 'var(--high)',
  needs_discussion: 'var(--med)'
}

function timeAgo(ts) {
  const diff = Math.floor((Date.now() - new Date(ts)) / 1000)
  if (diff < 60) return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

export default function SidePanel({ history, onSelect, onRemove, open, onClose }) {
  return (
    <>
      {open && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 9
          }}
        />
      )}
      <div style={{
        position: 'fixed',
        top: 0, right: 0,
        width: 317,
        height: '100vh',
        background: 'var(--surface)',
        borderLeft: '1px solid var(--border)',
        zIndex: 10,
        transform: open ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.22s ease',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        <div style={{
          padding: '18px 18px 14px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <p style={{ fontWeight: 700, fontSize: 14 }}>review history</p>
          <button onClick={onClose} style={{
            background: 'none', border: 'none',
            color: 'var(--muted)', cursor: 'pointer',
            fontSize: 18, lineHeight: 1, padding: 2
          }}>×</button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '10px 10px' }}>
          {history.length === 0 ? (
            <p style={{
              color: 'var(--muted)', fontSize: 13,
              fontFamily: 'JetBrains Mono',
              padding: '16px 8px'
            }}>no reviews yet</p>
          ) : (
            history.map(h => (
              <div
                key={h.id}
                onClick={() => { onSelect(h); onClose() }}
                style={{
                  padding: '11px 12px',
                  borderRadius: 9,
                  marginBottom: 6,
                  cursor: 'pointer',
                  border: '1px solid var(--border)',
                  position: 'relative',
                  transition: 'background 0.1s'
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <p style={{
                  fontSize: 13, fontWeight: 600,
                  marginBottom: 4,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  paddingRight: 20
                }}>{h.title}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <span style={{
                    fontFamily: 'JetBrains Mono',
                    fontSize: 10,
                    color: verdictColor[h.verdict] || 'var(--muted)',
                  }}>{h.verdict.replace('_', ' ')}</span>
                  <span style={{ color: 'var(--border)', fontSize: 10 }}>·</span>
                  <span style={{
                    fontFamily: 'JetBrains Mono',
                    fontSize: 10, color: 'var(--muted)'
                  }}>{h.repo}</span>
                  <span style={{ color: 'var(--border)', fontSize: 10 }}>·</span>
                  <span style={{
                    fontFamily: 'JetBrains Mono',
                    fontSize: 10, color: 'var(--muted)'
                  }}>{timeAgo(h.ts)}</span>
                </div>
                <button
                  onClick={e => { e.stopPropagation(); onRemove(h.id) }}
                  style={{
                    position: 'absolute', top: 9, right: 9,
                    background: 'none', border: 'none',
                    color: 'var(--muted)', cursor: 'pointer',
                    fontSize: 14, lineHeight: 1, padding: 2,
                    opacity: 0.6
                  }}
                >×</button>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  )
}