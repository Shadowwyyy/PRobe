import { useState } from 'react'

const KEY = 'probe_history'

function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || []
  } catch {
    return []
  }
}

export default function useHistory() {
  const [history, setHistory] = useState(load)

  function save(url, result) {
    const entry = {
      id: Date.now(),
      url,
      title: result.meta.title,
      repo: result.meta.repo,
      verdict: result.verdict,
      ts: new Date().toISOString(),
      result
    }
    const updated = [entry, ...history].slice(0, 20)
    setHistory(updated)
    localStorage.setItem(KEY, JSON.stringify(updated))
  }

  function remove(id) {
    const updated = history.filter(h => h.id !== id)
    setHistory(updated)
    localStorage.setItem(KEY, JSON.stringify(updated))
  }

  return { history, save, remove }
}