const pulse = `
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }
`

function Bar({ w, h = 13, mb = 0 }) {
  return (
    <div style={{
      width: w,
      height: h,
      borderRadius: 5,
      background: 'var(--border)',
      marginBottom: mb,
      animation: 'pulse 1.6s ease-in-out infinite',
    }} />
  )
}

export default function Skeleton() {
  return (
    <>
      <style>{pulse}</style>
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
        <div style={{ width: 38, height: 38, borderRadius: 9, background: 'var(--border)', animation: 'pulse 1.6s ease-in-out infinite', flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <Bar w="62%" mb={7} />
          <Bar w="38%" h={11} />
        </div>
        <div style={{ display: 'flex', gap: 16 }}>
          {[0,1,2].map(i => (
            <div key={i} style={{ textAlign: 'center' }}>
              <Bar w={31} h={17} mb={4} />
              <Bar w={31} h={10} />
            </div>
          ))}
        </div>
      </div>

      {[0,1,2].map(i => (
        <div key={i} style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderLeft: '3px solid var(--border)',
          borderRadius: 11,
          padding: '16px 18px',
          marginBottom: 12,
          animationDelay: `${i * 0.15}s`
        }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <Bar w={42} h={11} />
            <Bar w={31} h={11} />
            <Bar w={118} h={11} />
          </div>
          <Bar w="88%" mb={7} />
          <Bar w="66%" mb={12} />
          <div style={{ background: 'var(--accent-dim)', borderRadius: 7, padding: '9px 12px' }}>
            <Bar w="74%" h={11} />
          </div>
        </div>
      ))}
    </>
  )
}