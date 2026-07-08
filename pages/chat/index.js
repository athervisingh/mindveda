import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '../../context/AuthContext'
import { NextSeo } from 'next-seo'

export default function ChatStart() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [error, setError] = useState('')

  useEffect(() => {
    if (authLoading) return
    if (!user) { router.replace('/login?redirect=/chat'); return }

    fetch('/api/chat/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id }),
    })
      .then(r => r.json())
      .then(data => {
        if (data.sessionId) router.replace(`/chat/${data.sessionId}`)
        else setError(data.error || 'Could not start chat.')
      })
      .catch(() => setError('Could not start chat.'))
  }, [authLoading, user, router])

  return (
    <>
      <NextSeo title="Chat — Mind Veda" noindex />
      <div className="min-h-screen bg-[#fbfaf7] flex items-center justify-center px-4">
        {error ? (
          <div className="text-center">
            <p className="text-gray-500 mb-4">{error}</p>
            <button onClick={() => router.push('/')} className="text-[#1a3520] font-medium underline">Go Home</button>
          </div>
        ) : (
          <div className="w-8 h-8 border-2 border-[#1a3520] border-t-transparent rounded-full animate-spin" />
        )}
      </div>
    </>
  )
}
