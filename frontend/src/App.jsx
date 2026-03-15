import { useState } from 'react'
import ReviewCard from './ReviewCard'
import PRMeta from './PRMeta'
import Skeleton from './Skeleton'

export default function App() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [err, setErr] = useState(null)

  async function submit() {
    if (!url.trim()) return
    setLoading(true)
    setResult(null)
    setErr(null)
    try {
      const res = await fetch('http://localhost:8000/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pr_url: url.trim() })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail)
      setResult(data)
    } catch (e) {
      setErr(e.message)
    } finally {
      setLoading(false)
    }
  }

  const verdictColor = {
    approve: 'var(--approve)',
    request_changes: 'var(--high)',
    needs_discussion: 'var(--med)'
  }

  return (
    <div>
      <header style={{ marginBottom: 52 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 8 }}>
          <div style={{
            width: 31, height: 31, borderRadius: 7,
            background: 'var(--accent)', display: 'grid', placeItems: 'center',
            fontSize: 16, fontWeight: 800
          }}>P</div>
          <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.5px' }}>PRobe</h1>
        </div>
        <p style={{ color: 'var(--muted)', fontSize: 14, fontFamily: 'JetBrains Mono' }}>
          drop a pr url. get a real review.
        </p>
      </header>

      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 13,
        padding: '18px 20px',
        display: 'flex',
        gap: 12,
        marginBottom: 36
      }}>
        <input
          value={url}
          onChange={e => setUrl(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && submit()}
          placeholder="https://github.com/owner/repo/pull/123"
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: 'var(--text)',
            fontFamily: 'JetBrains Mono',
            fontSize: 13,
          }}
        />
        <button
          onClick={submit}
          disabled={loading}
          style={{
            background: loading ? 'var(--border)' : 'var(--accent)',
            color: loading ? 'var(--muted)' : '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '8px 18px',
            fontFamily: 'Syne',
            fontWeight: 700,
            fontSize: 13,
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'background 0.15s'
          }}
        >
          {loading ? 'analyzing...' : 'review'}
        </button>
      </div>

      {err && (
        <div style={{
          background: 'rgba(249,117,131,0.08)',
          border: '1px solid rgba(249,117,131,0.3)',
          borderRadius: 9,
          padding: '13px 16px',
          color: 'var(--high)',
          fontFamily: 'JetBrains Mono',
          fontSize: 13,
          marginBottom: 24
        }}>
          {err}
        </div>
      )}

      {loading && <Skeleton />}

      {result && (
        <div>
          <PRMeta meta={result.meta} />
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 24
          }}>
            <p style={{ color: 'var(--muted)', fontSize: 13 }}>{result.summary}</p>
            <span style={{
              fontFamily: 'JetBrains Mono',
              fontSize: 11,
              fontWeight: 600,
              color: verdictColor[result.verdict] || 'var(--muted)',
              background: 'var(--surface)',
              border: `1px solid ${verdictColor[result.verdict] || 'var(--border)'}`,
              borderRadius: 6,
              padding: '4px 10px',
              whiteSpace: 'nowrap',
              marginLeft: 16
            }}>
              {result.verdict.replace('_', ' ')}
            </span>
          </div>

          {result.findings.length === 0 ? (
            <p style={{ color: 'var(--approve)', fontFamily: 'JetBrains Mono', fontSize: 13 }}>
              ✓ no issues found
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {result.findings.map((f, i) => <ReviewCard key={i} finding={f} />)}
            </div>
          )}
        </div>
      )}
    </div>
  )
}