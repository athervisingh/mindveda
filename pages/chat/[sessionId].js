import { useEffect, useRef, useState, useCallback } from 'react'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import { supabase } from '../../lib/supabaseClient'
import { useAuth } from '../../context/AuthContext'
import { NextSeo } from 'next-seo'

export default function ChatRoom() {
  const router = useRouter()
  const { sessionId } = router.query
  const { user, loading: authLoading } = useAuth()

  const [session, setSession] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [loadingSession, setLoadingSession] = useState(true)
  const [sessionError, setSessionError] = useState('')

  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (!authLoading && !user) router.replace('/login')
  }, [authLoading, user, router])

  useEffect(() => {
    if (!sessionId || !user) return
    async function load() {
      setLoadingSession(true)

      const { data: sess } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('id', sessionId)
        .single()

      if (!sess || sess.user_id !== user.id) {
        setSessionError('Session not found or access denied.')
        setLoadingSession(false)
        return
      }

      setSession(sess)

      const { data: msgs } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true })

      setMessages(msgs || [])
      setLoadingSession(false)
    }
    load()
  }, [sessionId, user])

  useEffect(() => {
    if (!sessionId) return

    const channel = supabase
      .channel(`chat-messages-${sessionId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `session_id=eq.${sessionId}` },
        payload => {
          setMessages(prev => {
            const exists = prev.some(m => m.id === payload.new.id)
            return exists ? prev : [...prev, payload.new]
          })
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [sessionId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = useCallback(async () => {
    if (!input.trim() || sending) return
    const text = input.trim()
    setInput('')
    setSending(true)

    try {
      await fetch('/api/chat/bot-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, message: text, userId: user.id }),
      })
    } catch {
      // message already saved by API even if response fails
    } finally {
      setSending(false)
      inputRef.current?.focus()
    }
  }, [input, sending, sessionId, user])

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  // ── Loading states ──────────────────────────────────────────────
  if (authLoading || loadingSession) {
    return (
      <div className="min-h-screen bg-[#fbfaf7] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#1a3520] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (sessionError) {
    return (
      <div className="min-h-screen bg-[#fbfaf7] flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-gray-500 mb-4">{sessionError}</p>
          <button onClick={() => router.push('/dashboard')} className="text-[#1a3520] font-medium underline">Go to Dashboard</button>
        </div>
      </div>
    )
  }

  return (
    <>
      <NextSeo title="Chat Session — Mind Veda" noindex />

      {/* ── Outer shell ── mobile: full screen  tablet: padded  desktop: centered card ── */}
      <div className="min-h-screen bg-[#fbfaf7] md:bg-[#ede9e2] flex flex-col md:items-center md:justify-start md:py-4 lg:py-8 md:px-4">

        {/* ── Chat panel ── */}
        <div className="
          flex flex-col flex-1 w-full bg-[#fbfaf7]
          md:max-w-[640px] md:flex-none md:rounded-2xl md:shadow-2xl md:border md:border-white/60
          md:overflow-hidden md:h-[calc(100dvh-2rem)] lg:h-[min(calc(100dvh-4rem),820px)]
          lg:max-w-[700px]
        ">

          {/* ── Top bar ── */}
          <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between sticky top-0 md:static z-10 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-[#1a3520] rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-semibold">V</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-[#1a3520]">
                  {session?.type === 'staff' ? 'Mind Veda Counselor' : 'Veda — Wellness Guide'}
                </p>
                <p className="text-xs text-gray-400">
                  {session?.type === 'staff' ? '🟢 Staff is with you' : '🤖 AI Assistant'}
                </p>
              </div>
            </div>
          </div>

          {/* ── Messages ── */}
          <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-4 space-y-3 pb-28 md:pb-4">
            {messages.map((m, i) => (
              <motion.div
                key={m.id || i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex ${m.sender_type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender_type !== 'user' && (
                  <div className="w-7 h-7 rounded-full bg-[#1a3520] flex items-center justify-center mr-2 flex-shrink-0 mt-auto mb-1">
                    <span className="text-white text-xs font-bold">
                      {m.sender_type === 'staff' ? 'B' : 'V'}
                    </span>
                  </div>
                )}
                <div
                  className={`max-w-[78%] sm:max-w-[72%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    m.sender_type === 'user'
                      ? 'bg-[#1a3520] text-white rounded-br-sm'
                      : 'bg-white text-gray-800 border border-gray-100 rounded-bl-sm shadow-sm'
                  }`}
                >
                  {m.content}
                </div>
              </motion.div>
            ))}

            {sending && (
              <div className="flex justify-start">
                <div className="w-7 h-7 rounded-full bg-[#1a3520] flex items-center justify-center mr-2 flex-shrink-0">
                  <span className="text-white text-xs font-bold">V</span>
                </div>
                <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                  <div className="flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* ── Input ── fixed on mobile, static at bottom on tablet/desktop ── */}
          <div className="
            fixed bottom-0 left-0 right-0
            md:relative md:bottom-auto md:left-auto md:right-auto
            bg-white border-t border-gray-100 px-3 sm:px-4 py-3 flex-shrink-0
          ">
            <div className="flex gap-2 max-w-2xl md:max-w-none mx-auto">
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message…"
                rows={1}
                disabled={sending}
                className="flex-1 resize-none rounded-2xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:border-[#1a3520] bg-[#fbfaf7] placeholder-gray-400 disabled:opacity-60"
                style={{ maxHeight: '100px', overflowY: 'auto' }}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || sending}
                className="w-10 h-10 bg-[#1a3520] rounded-full flex items-center justify-center flex-shrink-0 self-end disabled:opacity-40 hover:opacity-90 transition-opacity"
              >
                <svg className="w-4 h-4 text-white rotate-90" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              </button>
            </div>
            <p className="text-center text-xs text-gray-400 mt-1">Press Enter to send</p>
          </div>

        </div>{/* end chat panel */}
      </div>{/* end outer shell */}
    </>
  )
}
