import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Callback() {
  const navigate = useNavigate()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get('token')
    if (token) {
      localStorage.setItem('gh_token', token)
    }
    navigate('/')
  }, [])

  return (
    <div style={{ color: 'var(--muted)', fontFamily: 'JetBrains Mono', fontSize: 13, padding: 64 }}>
      signing in...
    </div>
  )
}