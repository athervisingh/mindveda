import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { motion, AnimatePresence } from 'framer-motion'
import { NextSeo } from 'next-seo'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { TESTS as STATIC_TESTS, UI, TEST_SECONDS, bandFor } from '../lib/mindTest'
import { supabase } from '../lib/supabaseClient'
import { fetchMindTest } from '../lib/testContent'

const GREEN = '#1a3520'
const GOLD  = '#f5a623'

export default function TestPage() {
  const router = useRouter()
  const [lang, setLang]       = useState('en')
  const [tests, setTests]     = useState(STATIC_TESTS)   // DB aane tak defaults
  const [phase, setPhase]     = useState('choose')   // choose | quiz | result
  const [groupId, setGroupId] = useState(null)
  const [answers, setAnswers] = useState({})         // { [qid]: optionIndex }
  const [index, setIndex]     = useState(0)
  const [left, setLeft]       = useState(TEST_SECONDS)
  const [timedOut, setTimedOut] = useState(false)
  const advanceRef = useRef(null)
  const savedRef   = useRef(false)
  const startedRef = useRef(null)
  const phaseRef   = useRef('choose')

  const test = groupId ? tests[groupId] : null
  const t    = (obj) => (obj ? obj[lang] : '')
  const fromRegistration = router.query.from === 'registration'

  useEffect(() => { phaseRef.current = phase }, [phase])

  // ── Admin ke edit kiye hue sawal DB se — na milen to defaults chalte rehte hain ──
  useEffect(() => {
    let cancelled = false
    Promise.all(Object.keys(STATIC_TESTS).map(id => fetchMindTest(supabase, id)))
      .then(list => {
        if (cancelled) return
        const next = {}
        list.forEach(t => { if (t) next[t.id] = t })
        if (!Object.keys(next).length) return
        // Quiz shuru ho chuka ho to sawal beech me na badlein — agli baar lagenge.
        setTests(prev => (phaseRef.current === 'choose' ? next : prev))
      })
      .catch(() => { /* defaults hi rahenge */ })
    return () => { cancelled = true }
  }, [])

  // ── Countdown — sirf quiz ke dauraan chalta hai ──
  useEffect(() => {
    if (phase !== 'quiz') return
    const id = setInterval(() => {
      setLeft(s => {
        if (s <= 1) {
          clearInterval(id)
          setTimedOut(true)
          setPhase('result')
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [phase])

  useEffect(() => () => clearTimeout(advanceRef.current), [])

  function startTest(id) {
    clearTimeout(advanceRef.current)
    savedRef.current   = false
    startedRef.current = Date.now()
    setGroupId(id)
    setAnswers({})
    setIndex(0)
    setLeft(TEST_SECONDS)
    setTimedOut(false)
    setPhase('quiz')
  }

  function reset() {
    clearTimeout(advanceRef.current)
    setPhase('choose')
    setGroupId(null)
    setAnswers({})
    setIndex(0)
    setLeft(TEST_SECONDS)
    setTimedOut(false)
  }

  const goNext = useCallback(() => {
    setIndex(i => {
      if (i + 1 >= test.questions.length) { setPhase('result'); return i }
      return i + 1
    })
  }, [test])

  function choose(qid, optIdx) {
    setAnswers(a => ({ ...a, [qid]: optIdx }))
    clearTimeout(advanceRef.current)
    advanceRef.current = setTimeout(goNext, 200)   // select karte hi agla sawaal
  }

  // ── Scoring ──
  const { score, attempted } = useMemo(() => {
    if (!test) return { score: 0, attempted: 0 }
    let s = 0, n = 0
    for (const q of test.questions) {
      const a = answers[q.id]
      if (a === undefined) continue
      n++
      if (q.scored) s += q.options[a].score
    }
    return { score: s, attempted: n }
  }, [test, answers])

  // ── Result bante hi ek baar server par save — admin panel ke liye ──
  useEffect(() => {
    if (phase !== 'result' || !test || savedRef.current) return
    savedRef.current = true
    fetch('/api/mindcheck/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        groupId: test.id,
        lang,
        answers,
        timedOut,
        durationSeconds: startedRef.current ? Math.floor((Date.now() - startedRef.current) / 1000) : null,
        registrationId: typeof router.query.r === 'string' ? router.query.r : null,
      }),
    }).catch(() => { /* result user ko phir bhi dikhta hai */ })
  }, [phase, test, lang, answers, timedOut, router.query.r])

  const band    = test ? bandFor(test, score) : null
  const funQ    = test?.questions.find(q => !q.scored)
  const funPick = funQ && answers[funQ.id] !== undefined ? funQ.options[answers[funQ.id]] : null

  return (
    <div className="min-h-screen flex flex-col bg-[#fdf8ec]">
      <NextSeo
        title="Mind Check — Mind Veda by Babita"
        description="A free 60-second Mind Check from Mind Veda. Separate tests for under 20 and 20+, available in English and Hindi."
        canonical="https://www.mindvedabybabita.com/test"
      />
      <Header />

      <main className="flex-1">
        {/* ── Page header + language tabs ── */}
        <div className="bg-gradient-to-br from-[#1a3520] via-[#24492c] to-[#12271a] px-4 sm:px-6 py-10 sm:py-14 border-b-4 border-[#f5a623]">
          <div className="max-w-2xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <LangTabs lang={lang} setLang={setLang} />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
              {t(UI.pageTitle)}
            </h1>
            {phase === 'choose' && (
              <p className="text-white/80 text-[15px] font-medium leading-7 mt-3 max-w-md mx-auto">{t(UI.chooseSub)}</p>
            )}
          </div>
        </div>

        {/* ══════════ CHOOSE ══════════ */}
        {phase === 'choose' && (
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
            {fromRegistration && (
              <div className="mb-8 rounded-2xl bg-[#eaf4ec] border-2 border-[#1a3520]/15 px-5 py-4 text-center">
                <p className="text-[#1a3520] font-bold text-sm">{t(UI.registered)}</p>
              </div>
            )}
            <h2 className="text-center text-xl font-bold text-[#1a3520] mb-7" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
              {t(UI.chooseTitle)}
            </h2>
            <div className="grid sm:grid-cols-2 gap-5">
              {Object.values(tests).map(item => (
                <motion.button
                  key={item.id}
                  onClick={() => startTest(item.id)}
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  className="text-left bg-white rounded-2xl border-2 border-[#dcd3ba] p-5 sm:p-6 shadow-[0_6px_24px_-10px_rgba(26,53,32,0.3)] hover:border-[#f5a623] transition-colors"
                >
                  <span className="text-3xl">{item.emoji}</span>
                  <p className="mt-3 inline-block bg-[#1a3520] text-[#ffd27a] text-[11px] font-extrabold uppercase tracking-[0.18em] rounded-full px-3 py-1">
                    {t(item.label)}
                  </p>
                  <h3 className="text-xl font-bold text-[#1a3520] mt-3" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
                    {t(item.title)}
                  </h3>
                  <p className="text-[#4f6354] text-[13.5px] font-medium leading-6 mt-2">{t(item.blurb)}</p>
                  <p className="text-[#8a6914] text-[12px] font-bold mt-4">⏱ {t(UI.questions)}</p>
                  <span className="mt-4 inline-flex items-center gap-2 bg-[#f5a623] text-[#1a3520] font-extrabold rounded-full px-5 py-2.5 text-sm">
                    {t(UI.start)}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </span>
                </motion.button>
              ))}
            </div>
            <p className="text-center text-[12px] text-[#6b7a6f] font-medium mt-8 max-w-md mx-auto leading-5">{t(UI.disclaimer)}</p>
          </div>
        )}

        {/* ══════════ QUIZ ══════════ */}
        {phase === 'quiz' && test && (
          <div className="max-w-xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
            {/* Timer */}
            <div className="mb-6">
              <div className="flex items-center justify-between gap-2 text-[11px] sm:text-[12px] font-extrabold mb-2">
                <span className="text-[#4f6354] truncate">
                  {t(UI.question)} {index + 1} {t(UI.of)} {test.questions.length}
                </span>
                <span className={`flex-shrink-0 ${left <= 15 ? 'text-red-600' : 'text-[#1a3520]'}`}>
                  ⏱ {t(UI.timeLeft)}: {left}s
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-[#e6dcc4] overflow-hidden">
                <div
                  className={`h-full rounded-full transition-[width] duration-1000 ease-linear ${left <= 15 ? 'bg-red-500' : 'bg-[#f5a623]'}`}
                  style={{ width: `${(left / TEST_SECONDS) * 100}%` }}
                />
              </div>
            </div>

            {/* Progress dots */}
            <div className="flex justify-center gap-1.5 mb-6">
              {test.questions.map((q, i) => (
                <span
                  key={q.id}
                  className={`h-1.5 rounded-full transition-all ${
                    i === index ? 'w-6 bg-[#1a3520]'
                      : answers[q.id] !== undefined ? 'w-1.5 bg-[#f5a623]' : 'w-1.5 bg-[#dcd3ba]'
                  }`}
                />
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={test.questions[index].id}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.18 }}
                className="bg-white rounded-2xl border-2 border-[#dcd3ba] shadow-[0_6px_24px_-10px_rgba(26,53,32,0.3)] p-6 sm:p-8"
              >
                {(() => {
                  const q = test.questions[index]
                  return (
                    <>
                      <div className="flex items-start gap-3 mb-6">
                        <span className="text-2xl flex-shrink-0">{q.emoji}</span>
                        <div>
                          <h2 className="text-lg sm:text-xl font-bold text-[#1a3520] leading-snug" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
                            {t(q.text)}
                          </h2>
                          {q.note && <p className="text-[12px] font-semibold text-[#8a6914] mt-1.5">{t(q.note)}</p>}
                        </div>
                      </div>

                      <div className="space-y-3">
                        {q.options.map((opt, i) => {
                          const picked = answers[q.id] === i
                          return (
                            <button
                              key={i}
                              type="button"
                              onClick={() => choose(q.id, i)}
                              className={`w-full text-left rounded-xl border-2 px-4 py-3.5 flex items-center gap-3 transition-all active:scale-[0.99] ${
                                picked
                                  ? 'border-[#1a3520] bg-[#1a3520] text-white shadow-md'
                                  : 'border-[#e0d8c2] bg-[#fffdf7] text-[#1a3520] hover:border-[#f5a623] hover:bg-[#fff8e8]'
                              }`}
                            >
                              {opt.emoji && <span className="text-xl flex-shrink-0">{opt.emoji}</span>}
                              <span className="font-semibold text-[15px] leading-6">{t(opt.label)}</span>
                            </button>
                          )
                        })}
                      </div>
                    </>
                  )
                })()}
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center justify-between mt-5">
              <button
                type="button"
                onClick={() => setIndex(i => Math.max(0, i - 1))}
                disabled={index === 0}
                className="text-sm font-bold text-[#4f6354] px-4 py-2 rounded-full hover:bg-black/5 disabled:opacity-35 disabled:hover:bg-transparent"
              >
                ← {t(UI.back)}
              </button>
              {index + 1 < test.questions.length ? (
                <button type="button" onClick={goNext} className="text-sm font-bold text-[#4f6354] px-4 py-2 rounded-full hover:bg-black/5">
                  {t(UI.skip)} →
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setPhase('result')}
                  className="text-sm font-extrabold text-[#1a3520] bg-[#f5a623] rounded-full px-6 py-2.5 shadow-md hover:brightness-105"
                >
                  {t(UI.finish)}
                </button>
              )}
            </div>
          </div>
        )}

        {/* ══════════ RESULT ══════════ */}
        {phase === 'result' && test && band && (
          <div className="max-w-xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
            {timedOut && (
              <p className="text-center text-red-600 font-extrabold text-sm mb-4">⏱ {t(UI.timeUp)}</p>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border-2 border-[#dcd3ba] shadow-[0_10px_30px_-12px_rgba(26,53,32,0.4)] overflow-hidden"
            >
              <div className="bg-gradient-to-br from-[#1a3520] to-[#24492c] px-6 py-8 text-center">
                <motion.div
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                  className="text-5xl mb-3"
                >
                  {band.emoji}
                </motion.div>
                <h2 className="text-[22px] sm:text-3xl font-bold text-white leading-tight break-words" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
                  {t(band.title)}
                </h2>
                <p className="text-[#ffd27a] font-extrabold text-sm mt-3">
                  {t(UI.yourScore)}: {score} / {test.maxScore}
                </p>
                <p className="text-white/60 text-[12px] font-semibold mt-1">
                  {attempted} / {test.questions.length} {t(UI.attempted)}
                </p>
              </div>

              <div className="px-6 py-7">
                {/* Score bar */}
                <div className="h-2.5 w-full rounded-full bg-[#e6dcc4] overflow-hidden mb-6">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(score / test.maxScore) * 100}%` }}
                    transition={{ duration: 0.7, ease: 'easeOut' }}
                    className="h-full rounded-full bg-gradient-to-r from-[#f5a623] to-[#f0901c]"
                  />
                </div>

                <p className="text-[#3d4f42] text-[15px] font-medium leading-7">{t(band.body)}</p>

                {funPick && (
                  <div className="mt-6 rounded-xl bg-[#fff8e8] border border-[#f0dfae] px-4 py-3">
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#8a6914]">{t(UI.funAnswer)}</p>
                    <p className="text-[#1a3520] font-bold text-sm mt-1">
                      {funPick.emoji} {t(funPick.label)}
                    </p>
                  </div>
                )}

                {attempted < test.questions.length && (
                  <p className="text-[12px] font-semibold text-[#8a6914] mt-4">ℹ️ {t(UI.unanswered)}</p>
                )}

                {/* Answer review */}
                <div className="mt-7 border-t border-[#eee6d2] pt-5 space-y-3">
                  {test.questions.map((q, i) => {
                    const a = answers[q.id]
                    return (
                      <div key={q.id} className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-3">
                        <p className="text-[13px] text-[#4f6354] font-medium leading-5 sm:flex-1 min-w-0">
                          <span className="font-extrabold text-[#1a3520]">{i + 1}.</span> {t(q.text)}
                        </p>
                        <span className={`text-[12px] font-bold break-words sm:text-right sm:max-w-[45%] sm:flex-shrink-0 ${a === undefined ? 'text-gray-400' : 'text-[#1a3520]'}`}>
                          {a === undefined
                            ? t(UI.notAnswered)
                            : `${t(q.options[a].label)}${q.scored ? ` · ${q.options[a].score}` : ''}`}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </motion.div>

            {/* ── Paid 16 PF upsell ── */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="mt-6 rounded-2xl bg-gradient-to-br from-[#1a3520] to-[#24492c] border-2 border-[#f5a623]/40 p-6 text-center shadow-[0_10px_30px_-14px_rgba(26,53,32,0.6)]"
            >
              <p className="inline-block bg-[#f5a623] text-[#1a3520] text-[10px] font-extrabold uppercase tracking-[0.22em] rounded-full px-3 py-1">
                {t(UI.challengeTag)}
              </p>
              <h3 className="text-xl sm:text-2xl font-bold text-white mt-3" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
                {t(UI.challengeTitle)}
              </h3>
              <p className="text-white/80 text-[14px] font-medium leading-7 mt-2.5 max-w-md mx-auto">
                {t(UI.challengeBody)}
              </p>
              <Link
                href="/challenge"
                className="inline-flex items-center gap-2 mt-5 bg-[#f5a623] text-[#1a3520] font-extrabold rounded-full px-7 py-3 text-sm shadow-lg hover:brightness-105 active:scale-95 transition-all"
              >
                {t(UI.challengeCta)}
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </motion.div>

            <div className="grid sm:grid-cols-2 gap-3 mt-6">
              <button
                onClick={() => startTest(test.id)}
                className="rounded-full border-2 border-[#1a3520]/25 text-[#1a3520] font-bold text-sm py-3 hover:bg-[#1a3520] hover:text-white transition-all"
              >
                {t(UI.retake)}
              </button>
              <button
                onClick={reset}
                className="rounded-full border-2 border-[#1a3520]/25 text-[#1a3520] font-bold text-sm py-3 hover:bg-[#1a3520] hover:text-white transition-all"
              >
                {t(UI.otherTest)}
              </button>
            </div>

            <div className="grid sm:grid-cols-2 gap-3 mt-3">
              <Link href="/contact" className="text-center rounded-full bg-[#f5a623] text-[#1a3520] font-extrabold text-sm py-3.5 shadow-md hover:brightness-105 transition-all">
                {t(UI.talk)}
              </Link>
              <Link href="/" className="text-center rounded-full bg-[#1a3520] text-white font-bold text-sm py-3.5 hover:opacity-90 transition-all">
                {t(UI.home)}
              </Link>
            </div>

            <p className="text-center text-[12px] text-[#6b7a6f] font-medium mt-7 leading-5">{t(UI.disclaimer)}</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}

function LangTabs({ lang, setLang }) {
  const TABS = [['en', 'English'], ['hi', 'हिंदी']]
  return (
    <div className="inline-flex bg-white/10 rounded-full p-1 border border-white/20">
      {TABS.map(([code, label]) => (
        <button
          key={code}
          type="button"
          onClick={() => setLang(code)}
          className={`px-4 py-1.5 rounded-full text-[12.5px] font-extrabold transition-all ${
            lang === code ? 'bg-[#f5a623] text-[#1a3520] shadow' : 'text-white/70 hover:text-white'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
