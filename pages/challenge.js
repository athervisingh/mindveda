import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { NextSeo } from 'next-seo'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { loadRazorpay } from '../lib/loadRazorpay'
import { INTRO, EXAMPLES, ITEMS, TOTAL_ITEMS, CHALLENGE_PRICE_PAISE } from '../lib/pf16'

const PER_PAGE  = 10
const PAGES     = Math.ceil(TOTAL_ITEMS / PER_PAGE)
const STORE_KEY = 'mv16pf'
const LETTER    = ['a', 'b', 'c']
const PRICE     = Math.round(CHALLENGE_PRICE_PAISE / 100)

function readStore() {
  try { return JSON.parse(localStorage.getItem(STORE_KEY) || 'null') } catch { return null }
}
function writeStore(v) {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(v)) } catch { /* private mode */ }
}

export default function ChallengePage() {
  const [phase, setPhase]     = useState('gate')      // gate | intro | test | done
  const [form, setForm]       = useState({ full_name: '', email: '', mobile: '' })
  const [paying, setPaying]   = useState(false)
  const [error, setError]     = useState('')
  const [access, setAccess]   = useState(null)        // { attemptId, accessToken }
  const [answers, setAnswers] = useState(() => Array(TOTAL_ITEMS).fill(null))
  const [page, setPage]       = useState(0)
  const [startedAt, setStartedAt] = useState(null)
  const [elapsed, setElapsed] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult]   = useState(null)
  const [ready, setReady]     = useState(false)
  const topRef = useRef(null)

  // ── Paid attempt + draft ko wapas uthao (refresh ya band ho jaane par) ──
  useEffect(() => {
    const s = readStore()
    if (s?.attemptId && s?.accessToken) {
      setAccess({ attemptId: s.attemptId, accessToken: s.accessToken })
      if (Array.isArray(s.answers) && s.answers.length === TOTAL_ITEMS) setAnswers(s.answers)
      setStartedAt(s.startedAt || Date.now())
      setPage(s.page || 0)
      setPhase(s.answers ? 'test' : 'intro')
    }
    setReady(true)
  }, [])

  // ── Elapsed timer (koi limit nahi — sirf guide, ~35 min expected) ──
  useEffect(() => {
    if (phase !== 'test' || !startedAt) return
    const id = setInterval(() => setElapsed(Math.floor((Date.now() - startedAt) / 1000)), 1000)
    return () => clearInterval(id)
  }, [phase, startedAt])

  const answeredCount = useMemo(() => answers.filter(a => a !== null).length, [answers])
  const firstUnanswered = useMemo(() => answers.findIndex(a => a === null), [answers])

  const persist = useCallback((patch) => {
    writeStore({ ...(readStore() || {}), ...access, ...patch })
  }, [access])

  // ── Payment ──
  async function handlePay(e) {
    e.preventDefault()
    setError('')
    setPaying(true)
    try {
      const ok = await loadRazorpay()
      if (!ok) throw new Error('Could not load the payment window. Check your connection and try again.')

      const res  = await fetch('/api/challenge/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Could not start the payment.')

      const rzp = new window.Razorpay({
        key:         data.keyId,
        amount:      data.amount,
        currency:    'INR',
        name:        'Mind Veda by Babita',
        description: '16 PF Mind Challenge',
        order_id:    data.orderId,
        prefill:     { name: form.full_name, email: form.email, contact: form.mobile },
        theme:       { color: '#1a3520' },
        modal:       { ondismiss: () => setPaying(false) },
        handler: async (r) => {
          try {
            const vr = await fetch('/api/challenge/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ ...r, attemptId: data.attemptId }),
            })
            const vd = await vr.json()
            if (!vr.ok) throw new Error(vd.error || 'Payment could not be verified.')

            const acc = { attemptId: vd.attemptId, accessToken: vd.accessToken }
            setAccess(acc)
            writeStore(acc)
            setPhase('intro')
            setPaying(false)
          } catch (err) {
            setError(err.message + ' If money was deducted, please WhatsApp us — we will sort it out.')
            setPaying(false)
          }
        },
      })
      rzp.on('payment.failed', (r) => {
        setError(r?.error?.description || 'Payment failed. Please try again.')
        setPaying(false)
      })
      rzp.open()
    } catch (err) {
      setError(err.message)
      setPaying(false)
    }
  }

  function beginTest() {
    const now = Date.now()
    setStartedAt(now)
    setPhase('test')
    persist({ answers, page: 0, startedAt: now })
  }

  function pick(qIndex, optIndex) {
    setAnswers(prev => {
      const next = [...prev]
      next[qIndex] = optIndex
      persist({ answers: next, page, startedAt })
      return next
    })
  }

  function goPage(p) {
    const next = Math.max(0, Math.min(PAGES - 1, p))
    setPage(next)
    persist({ answers, page: next, startedAt })
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function jumpToUnanswered() {
    if (firstUnanswered < 0) return
    goPage(Math.floor(firstUnanswered / PER_PAGE))
  }

  async function handleSubmit() {
    if (answeredCount < TOTAL_ITEMS) {
      const left = TOTAL_ITEMS - answeredCount
      if (!confirm(`${left} question${left > 1 ? 's are' : ' is'} still unanswered. Submit anyway?`)) {
        jumpToUnanswered()
        return
      }
    }
    setError('')
    setSubmitting(true)
    try {
      const res = await fetch('/api/challenge/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...access,
          answers,
          durationSeconds: startedAt ? Math.floor((Date.now() - startedAt) / 1000) : null,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Could not submit your answers.')
      setResult(data)
      setPhase('done')
      try { localStorage.removeItem(STORE_KEY) } catch { /* ignore */ }
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const pageItems = ITEMS.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE)
  const mm = String(Math.floor(elapsed / 60)).padStart(2, '0')
  const ss = String(elapsed % 60).padStart(2, '0')

  return (
    <div className="min-h-screen flex flex-col bg-[#fdf8ec]">
      <NextSeo
        title="Mind Challenge (16 PF) — Mind Veda by Babita"
        description="The full 16 PF Mind Challenge — 187 questions, personally scored by Babita. Unlock for ₹300."
        canonical="https://www.mindvedabybabita.com/challenge"
      />
      <Header />

      <main className="flex-1">
        <div ref={topRef} className="bg-gradient-to-br from-[#1a3520] via-[#24492c] to-[#12271a] px-4 sm:px-6 py-10 sm:py-14 border-b-4 border-[#f5a623]">
          <div className="max-w-2xl mx-auto text-center">
            <p className="inline-block bg-[#f5a623] text-[#1a3520] text-[11px] font-extrabold uppercase tracking-[0.25em] rounded-full px-4 py-1.5 mb-5">
              Mind Challenge
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
              {INTRO.title}
            </h1>
            {phase === 'gate' && (
              <p className="text-white/80 text-[15px] font-medium leading-7 mt-4 max-w-lg mx-auto">
                {TOTAL_ITEMS} questions · about 35 minutes · scored personally by Babita
              </p>
            )}
          </div>
        </div>

        {!ready ? (
          <div className="max-w-xl mx-auto px-6 py-24 text-center text-[#4f6354] font-semibold">Loading…</div>
        ) : (
          <>
            {/* ══════════ GATE — ₹300 ══════════ */}
            {phase === 'gate' && (
              <div className="max-w-xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
                <div className="bg-white rounded-2xl border-2 border-[#dcd3ba] shadow-[0_6px_24px_-10px_rgba(26,53,32,0.3)] overflow-hidden">
                  <div className="bg-[#fff8e8] border-b-2 border-[#f0dfae] px-6 py-6 text-center">
                    <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#8a6914]">Unlock the full test</p>
                    <p className="text-4xl font-extrabold text-[#1a3520] mt-2" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>₹{PRICE}</p>
                    <p className="text-[13px] font-semibold text-[#4f6354] mt-1">one-time · includes your personal report</p>
                  </div>

                  <div className="px-6 py-6">
                    <ul className="space-y-2.5 mb-6">
                      {[
                        `All ${TOTAL_ITEMS} questions of the 16 PF form`,
                        'Save as you go — close and come back anytime',
                        'Your answer sheet goes straight to Babita',
                        'A personal report, sent to your email',
                      ].map(line => (
                        <li key={line} className="flex items-start gap-2.5 text-[14px] text-[#3d4f42] font-medium">
                          <span className="text-[#f5a623] font-extrabold mt-0.5">✓</span>{line}
                        </li>
                      ))}
                    </ul>

                    <form onSubmit={handlePay} className="space-y-3">
                      <input
                        type="text" required value={form.full_name}
                        onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
                        placeholder="Your full name"
                        className="w-full bg-white border-2 border-[#c7d3c6] rounded-xl px-4 py-3.5 text-[16px] font-medium text-[#12251a] placeholder-[#93a394] focus:outline-none focus:ring-4 focus:ring-[#f5a623]/35 focus:border-[#f5a623] transition-all"
                      />
                      <input
                        type="email" required value={form.email}
                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        placeholder="Email ID — your report comes here"
                        className="w-full bg-white border-2 border-[#c7d3c6] rounded-xl px-4 py-3.5 text-[16px] font-medium text-[#12251a] placeholder-[#93a394] focus:outline-none focus:ring-4 focus:ring-[#f5a623]/35 focus:border-[#f5a623] transition-all"
                      />
                      <input
                        type="tel" value={form.mobile}
                        onChange={e => setForm(f => ({ ...f, mobile: e.target.value }))}
                        placeholder="Mobile number (optional)"
                        className="w-full bg-white border-2 border-[#c7d3c6] rounded-xl px-4 py-3.5 text-[16px] font-medium text-[#12251a] placeholder-[#93a394] focus:outline-none focus:ring-4 focus:ring-[#f5a623]/35 focus:border-[#f5a623] transition-all"
                      />

                      {error && (
                        <div className="rounded-xl bg-[#fdeeee] border-2 border-[#f3c9c9] px-4 py-3 text-[13.5px] font-semibold text-[#a02020]">{error}</div>
                      )}

                      <button
                        type="submit" disabled={paying}
                        className="w-full bg-gradient-to-r from-[#f5a623] to-[#f0901c] text-[#1a3520] rounded-xl py-4 text-lg font-extrabold tracking-wide shadow-[0_8px_24px_-6px_rgba(245,166,35,0.75)] hover:brightness-105 disabled:opacity-60 transition-all"
                      >
                        {paying ? 'Opening payment…' : `Pay ₹${PRICE} & Start`}
                      </button>
                      <p className="text-center text-[12.5px] font-semibold text-[#4f6354]">
                        🔒 Secure payment by Razorpay · answers stay confidential
                      </p>
                    </form>
                  </div>
                </div>

                <p className="text-center mt-6">
                  <Link href="/test" className="text-[13px] font-bold text-[#4f6354] underline underline-offset-2 hover:text-[#1a3520]">
                    ← Back to the free Mind Check
                  </Link>
                </p>
              </div>
            )}

            {/* ══════════ INTRO ══════════ */}
            {phase === 'intro' && (
              <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-5">
                <div className="rounded-2xl bg-[#eaf4ec] border-2 border-[#1a3520]/15 px-5 py-4 text-center">
                  <p className="text-[#1a3520] font-bold text-sm">Payment received ✓ Your test is unlocked.</p>
                </div>

                <Card title="What to do">
                  <p className="text-[15px] text-[#3d4f42] font-medium leading-7">{INTRO.whatToDo}</p>
                  <p className="text-[15px] text-[#3d4f42] font-medium leading-7 mt-4">{INTRO.beforeYouStart}</p>
                </Card>

                <Card title="Examples">
                  <div className="space-y-5">
                    {EXAMPLES.map(([q, ...opts], i) => (
                      <div key={i}>
                        <p className="text-[15px] font-bold text-[#1a3520] mb-2">{i + 1}. {q}</p>
                        <div className="flex flex-wrap gap-2">
                          {opts.map((o, j) => (
                            <span key={j} className="text-[13px] font-semibold text-[#4f6354] bg-[#fffdf7] border border-[#e0d8c2] rounded-lg px-3 py-1.5">
                              {LETTER[j]}) {o}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-[13px] font-semibold text-[#8a6914] mt-5 bg-[#fff8e8] border border-[#f0dfae] rounded-xl px-4 py-3">
                    {INTRO.examplesNote}
                  </p>
                </Card>

                <Card title="Keep these points in mind">
                  <ul className="space-y-4">
                    {INTRO.points.map((p, i) => (
                      <li key={i} className="flex gap-3 text-[14.5px] text-[#3d4f42] font-medium leading-7">
                        <span className="text-[#f5a623] font-extrabold flex-shrink-0">•</span>{p}
                      </li>
                    ))}
                  </ul>
                </Card>

                <button
                  onClick={beginTest}
                  className="w-full bg-gradient-to-r from-[#f5a623] to-[#f0901c] text-[#1a3520] rounded-xl py-4 text-lg font-extrabold tracking-wide shadow-[0_8px_24px_-6px_rgba(245,166,35,0.75)] hover:brightness-105 transition-all"
                >
                  Start the test →
                </button>
              </div>
            )}

            {/* ══════════ TEST ══════════ */}
            {phase === 'test' && (
              <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
                {/* Sticky progress */}
                <div className="sticky top-[68px] z-30 -mx-4 sm:-mx-6 px-4 sm:px-6 py-3 bg-[#fdf8ec]/95 backdrop-blur border-b border-[#e6dcc4] mb-6">
                  <div className="flex items-center justify-between text-[12px] font-extrabold mb-2">
                    <span className="text-[#1a3520]">{answeredCount} / {TOTAL_ITEMS} answered</span>
                    <span className="text-[#4f6354]">⏱ {mm}:{ss} · page {page + 1}/{PAGES}</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-[#e6dcc4] overflow-hidden">
                    <div className="h-full rounded-full bg-[#f5a623] transition-[width] duration-300"
                      style={{ width: `${(answeredCount / TOTAL_ITEMS) * 100}%` }} />
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={page}
                    initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.16 }}
                    className="space-y-4"
                  >
                    {pageItems.map((item, k) => {
                      const qIndex = page * PER_PAGE + k
                      const [q, ...opts] = item
                      return (
                        <div key={qIndex} className="bg-white rounded-2xl border-2 border-[#dcd3ba] p-5 sm:p-6 shadow-[0_4px_16px_-10px_rgba(26,53,32,0.3)]">
                          <p className="text-[15.5px] font-bold text-[#1a3520] leading-6 mb-4">
                            <span className="text-[#8a6914]">{qIndex + 1}.</span> {q}
                          </p>
                          <div className="space-y-2.5">
                            {opts.map((o, j) => {
                              const picked = answers[qIndex] === j
                              return (
                                <button
                                  key={j} type="button" onClick={() => pick(qIndex, j)}
                                  className={`w-full text-left rounded-xl border-2 px-4 py-3 flex items-start gap-3 transition-all active:scale-[0.995] ${
                                    picked
                                      ? 'border-[#1a3520] bg-[#1a3520] text-white shadow-md'
                                      : 'border-[#e0d8c2] bg-[#fffdf7] text-[#1a3520] hover:border-[#f5a623] hover:bg-[#fff8e8]'
                                  }`}
                                >
                                  <span className={`font-extrabold text-[13px] mt-0.5 ${picked ? 'text-[#ffd27a]' : 'text-[#8a6914]'}`}>
                                    {LETTER[j]})
                                  </span>
                                  <span className="font-semibold text-[14.5px] leading-6">{o}</span>
                                </button>
                              )
                            })}
                          </div>
                        </div>
                      )
                    })}
                  </motion.div>
                </AnimatePresence>

                {error && (
                  <div className="mt-5 rounded-xl bg-[#fdeeee] border-2 border-[#f3c9c9] px-4 py-3 text-[13.5px] font-semibold text-[#a02020]">{error}</div>
                )}

                <div className="flex items-center justify-between gap-3 mt-6">
                  <button
                    onClick={() => goPage(page - 1)} disabled={page === 0}
                    className="text-sm font-bold text-[#4f6354] px-5 py-3 rounded-full border-2 border-[#dcd3ba] hover:bg-white disabled:opacity-35"
                  >
                    ← Previous
                  </button>
                  {page + 1 < PAGES ? (
                    <button
                      onClick={() => goPage(page + 1)}
                      className="text-sm font-extrabold text-[#1a3520] bg-[#f5a623] rounded-full px-8 py-3 shadow-md hover:brightness-105"
                    >
                      Next →
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit} disabled={submitting}
                      className="text-sm font-extrabold text-[#1a3520] bg-[#f5a623] rounded-full px-8 py-3 shadow-md hover:brightness-105 disabled:opacity-60"
                    >
                      {submitting ? 'Submitting…' : 'Submit answer sheet'}
                    </button>
                  )}
                </div>

                {firstUnanswered >= 0 && (
                  <p className="text-center mt-4">
                    <button onClick={jumpToUnanswered} className="text-[13px] font-bold text-[#8a6914] underline underline-offset-2">
                      Jump to first unanswered (Q{firstUnanswered + 1})
                    </button>
                  </p>
                )}

                <p className="text-center text-[12px] text-[#6b7a6f] font-medium mt-6">
                  Your answers are saved on this device as you go — you can close this page and come back.
                </p>
              </div>
            )}

            {/* ══════════ DONE ══════════ */}
            {phase === 'done' && result && (
              <div className="max-w-xl mx-auto px-4 sm:px-6 py-14 text-center">
                <motion.div
                  initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                  className="w-20 h-20 rounded-full bg-[#f5a623] flex items-center justify-center mx-auto mb-6 text-[#1a3520] shadow-lg text-4xl"
                >
                  ✓
                </motion.div>
                <h2 className="text-3xl font-bold text-[#1a3520] mb-3" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
                  Answer sheet received
                </h2>
                <p className="text-[#3d4f42] text-[15px] font-medium leading-8">
                  You answered <b>{result.answered} of {result.total}</b> questions. Babita will score your sheet personally
                  and email your detailed 16 PF report. Everything you shared stays strictly confidential.
                </p>
                <div className="grid sm:grid-cols-2 gap-3 mt-8">
                  <Link href="/contact" className="rounded-full bg-[#f5a623] text-[#1a3520] font-extrabold text-sm py-3.5 shadow-md hover:brightness-105 transition-all">
                    Talk to Babita
                  </Link>
                  <Link href="/" className="rounded-full bg-[#1a3520] text-white font-bold text-sm py-3.5 hover:opacity-90 transition-all">
                    Back to home
                  </Link>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}

function Card({ title, children }) {
  return (
    <div className="bg-white rounded-2xl border-2 border-[#dcd3ba] shadow-[0_6px_24px_-10px_rgba(26,53,32,0.3)] overflow-hidden">
      <div className="bg-[#f7f4eb] border-b-2 border-[#e6dcc4] px-6 py-3.5">
        <h2 className="text-lg font-bold text-[#1a3520]" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>{title}</h2>
      </div>
      <div className="px-6 py-6">{children}</div>
    </div>
  )
}
