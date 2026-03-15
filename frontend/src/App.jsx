import { useState } from 'react'
import ReviewCard from './ReviewCard'
import PRMeta from './PRMeta'
import Skeleton from './Skeleton'
import SidePanel from './SidePanel'
import useHistory from './useHistory'

export default function App() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [err, setErr] = useState(null)
  const [panelOpen, setPanelOpen] = useState(false)
  const [filters, setFilters] = useState({ high: true, medium: true, low: true })
  const { history, save, remove } = useHistory()

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
      save(url.trim(), data)
    } catch (e) {
      setErr(e.message)
    } finally {
      setLoading(false)
    }
  }

  function loadFromHistory(entry) {
    setUrl(entry.url)
    setResult(entry.result)
    setErr(null)
  }

  function toggleFilter(sev) {
    setFilters(f => ({ ...f, [sev]: !f[sev] }))
  }

  function exportMd() {
    if (!result) return
    const { meta, verdict, summary, findings } = result
    let md = `# PRobe Review: ${meta.title}\n\n`
    md += `**Repo:** ${meta.repo} · **PR:** #${meta.num} · **Author:** ${meta.author}\n`
    md += `**Files:** ${meta.changed_files} · **+${meta.additions}** / **-${meta.deletions}**\n\n`
    md += `## Verdict: ${verdict.replace('_', ' ')}\n\n${summary}\n\n`
    if (findings.length === 0) {
      md += `_No issues found._\n`
    } else {
      md += `## Findings\n\n`
      findings.forEach(f => {
        md += `### [${f.severity.toUpperCase()}] ${f.category} — ${f.file || ''}${f.line ? `:${f.line}` : ''}\n\n`
        md += `${f.issue}\n\n`
        md += `**Fix:** ${f.suggestion}\n\n---\n\n`
      })
    }
    const blob = new Blob([md], { type: 'text/markdown' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `probe-review-${meta.repo.replace('/', '-')}-${meta.num}.md`
    a.click()
  }

  const verdictColor = {
    approve: 'var(--approve)',
    request_changes: 'var(--high)',
    needs_discussion: 'var(--med)'
  }

  const sevColor = { high: 'var(--high)', medium: 'var(--med)', low: 'var(--low)' }

  const filtered = result?.findings.filter(f => filters[f.severity]) || []

  return (
    <>
      <SidePanel
        history={history}
        onSelect={loadFromHistory}
        onRemove={remove}
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
      />

      <div>
        <header style={{ marginBottom: 52, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
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
          </div>
          <button
            onClick={() => setPanelOpen(true)}
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              padding: '8px 14px',
              color: 'var(--muted)',
              fontFamily: 'JetBrains Mono',
              fontSize: 12,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 7
            }}
          >
            history {history.length > 0 && (
              <span style={{
                background: 'var(--accent)',
                color: '#fff',
                borderRadius: 4,
                padding: '1px 6px',
                fontSize: 11,
                fontWeight: 700
              }}>{history.length}</span>
            )}
          </button>
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
              marginBottom: 20
            }}>
              <p style={{ color: 'var(--muted)', fontSize: 13, flex: 1, marginRight: 16 }}>{result.summary}</p>
              <span style={{
                fontFamily: 'JetBrains Mono',
                fontSize: 11,
                fontWeight: 600,
                color: verdictColor[result.verdict] || 'var(--muted)',
                background: 'var(--surface)',
                border: `1px solid ${verdictColor[result.verdict] || 'var(--border)'}`,
                borderRadius: 6,
                padding: '4px 10px',
                whiteSpace: 'nowrap'
              }}>
                {result.verdict.replace('_', ' ')}
              </span>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 16
            }}>
              <div style={{ display: 'flex', gap: 7 }}>
                {['high', 'medium', 'low'].map(sev => (
                  <button
                    key={sev}
                    onClick={() => toggleFilter(sev)}
                    style={{
                      background: filters[sev] ? 'rgba(255,255,255,0.05)' : 'transparent',
                      border: `1px solid ${filters[sev] ? sevColor[sev] : 'var(--border)'}`,
                      borderRadius: 6,
                      padding: '4px 11px',
                      color: filters[sev] ? sevColor[sev] : 'var(--muted)',
                      fontFamily: 'JetBrains Mono',
                      fontSize: 11,
                      fontWeight: 600,
                      cursor: 'pointer',
                      opacity: filters[sev] ? 1 : 0.5,
                      transition: 'all 0.12s'
                    }}
                  >
                    {sev}
                  </button>
                ))}
              </div>

              <button
                onClick={exportMd}
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 6,
                  padding: '4px 12px',
                  color: 'var(--muted)',
                  fontFamily: 'JetBrains Mono',
                  fontSize: 11,
                  cursor: 'pointer',
                  transition: 'color 0.12s'
                }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}
              >
                export .md
              </button>
            </div>

            {filtered.length === 0 ? (
              <p style={{ color: 'var(--approve)', fontFamily: 'JetBrains Mono', fontSize: 13 }}>
                ✓ no issues found
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {filtered.map((f, i) => <ReviewCard key={i} finding={f} />)}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}