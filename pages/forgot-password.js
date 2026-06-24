import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { NextSeo } from 'next-seo'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { supabase } from '../lib/supabaseClient'

export default function ForgotPassword() {
  const [step, setStep] = useState('email') // 'email' | 'sent'
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const sendResetLink = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      if (err) throw err
      setStep('sent')
    } catch (err) {
      setError(err.message || 'Could not send reset link. Check the email and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfaf7]">
      <NextSeo noindex={true} nofollow={true} title="Forgot Password — MindVeda" />
      <Header />

      <main className="flex-1 flex flex-col">
        {/* Mobile top bar */}
        <div className="lg:hidden bg-[#1a3520] px-5 pt-6 pb-5">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-white/70 font-semibold mb-3">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
            Reset Password
          </span>
          <h1 className="text-xl font-semibold text-white leading-snug">Reset your password</h1>
          <p className="mt-1 text-white/60 text-sm">
            {step === 'email' && 'Enter your email to receive a reset link.'}
            {step === 'sent' && `Reset link sent to ${email}`}
          </p>
        </div>

        <div className="flex-1 flex items-stretch">
          {/* Desktop left panel */}
          <div className="hidden lg:flex lg:w-[48%] xl:w-[45%] flex-col bg-[#1a3520] p-10 xl:p-14">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/70 font-semibold self-start">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
              Reset Password
            </span>
            <h1 className="mt-6 text-4xl xl:text-5xl font-semibold leading-tight text-white">
              Forgot your password?
            </h1>
            <p className="mt-4 text-white/70 leading-7 text-sm xl:text-base">
              Enter your email and we&apos;ll send you a secure link to reset your password. No OTP needed — just click the link and set a new password.
            </p>

            <div className="mt-10 flex flex-col gap-3">
              {[
                { n: 1, label: 'Enter your email' },
                { n: 2, label: 'Click the reset link' },
                { n: 3, label: 'Set new password' },
              ].map(({ n, label }) => (
                <div key={n} className={`flex items-center gap-3 rounded-2xl px-5 py-4 text-sm transition-all ${step === 'sent' || n === 1 ? 'bg-white/20 text-white' : 'bg-white/8 text-white/40'}`}>
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${step === 'sent' && n === 1 ? 'bg-white text-[#1a3520]' : n === 1 ? 'bg-white/30 text-white' : 'bg-white/10 text-white/40'}`}>
                    {step === 'sent' && n === 1
                      ? <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                      : n}
                  </span>
                  {label}
                </div>
              ))}
            </div>
          </div>

          {/* Form panel */}
          <div className="flex-1 flex items-center justify-center px-4 sm:px-8 py-8 lg:py-12 lg:px-12 xl:px-16">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="w-full max-w-md"
            >
              <div className="bg-white rounded-3xl shadow-xl shadow-black/6 border border-gray-100 p-6 sm:p-8">

                <AnimatePresence mode="wait">

                  {/* ── Email step ── */}
                  {step === 'email' && (
                    <motion.div key="email" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                      <div className="mb-6">
                        <p className="text-[#2d4f3a] text-xs uppercase tracking-[0.24em] font-semibold mb-2">Step 1 of 2</p>
                        <h2 className="text-2xl sm:text-3xl font-semibold text-[#1a3520]">Enter your email</h2>
                        <p className="mt-1.5 text-gray-500 text-sm">We&apos;ll send a secure link to reset your password.</p>
                      </div>

                      {error && <ErrorBox msg={error} />}

                      <form onSubmit={sendResetLink} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-1.5 text-gray-700">Email address</label>
                          <div className="relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                            </span>
                            <input
                              type="email"
                              value={email}
                              onChange={e => setEmail(e.target.value)}
                              placeholder="you@example.com"
                              className="w-full rounded-2xl border border-gray-200 bg-[#fbfaf7] pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d4f3a]/25 focus:border-[#2d4f3a]/40 transition-all"
                              required
                            />
                          </div>
                        </div>
                        <SubmitBtn loading={loading} label="Send reset link" loadingLabel="Sending…" />
                      </form>

                      <p className="mt-5 text-center text-sm text-gray-500">
                        Remember your password?{' '}
                        <Link href="/login" className="font-semibold text-[#2d4f3a] hover:underline">Back to login</Link>
                      </p>
                    </motion.div>
                  )}

                  {/* ── Sent confirmation ── */}
                  {step === 'sent' && (
                    <motion.div key="sent" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.35 }} className="text-center py-4">
                      <div className="w-16 h-16 rounded-full bg-[#eef4f0] flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-[#2d4f3a]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                          <polyline points="22,6 12,13 2,6"/>
                        </svg>
                      </div>
                      <h2 className="text-2xl font-semibold text-[#1a3520] mb-2">Check your inbox</h2>
                      <p className="text-gray-500 text-sm mb-1">
                        We sent a reset link to
                      </p>
                      <p className="font-semibold text-gray-700 text-sm mb-5">{email}</p>
                      <p className="text-gray-400 text-xs mb-6">Click the link in the email to set a new password. Check spam if you don&apos;t see it.</p>

                      <button
                        onClick={() => { setStep('email'); setError('') }}
                        className="text-sm text-[#2d4f3a] font-medium hover:underline"
                      >
                        ← Use a different email
                      </button>
                    </motion.div>
                  )}

                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

function ErrorBox({ msg }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-4 flex items-center gap-2 rounded-2xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600"
    >
      <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      {msg}
    </motion.div>
  )
}

function SubmitBtn({ loading, label, loadingLabel }) {
  return (
    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      type="submit"
      disabled={loading}
      className="w-full rounded-full bg-[#2d4f3a] px-6 py-3.5 font-semibold text-white shadow-lg shadow-[#2d4f3a]/20 hover:bg-[#1f3829] transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
    >
      {loading ? (
        <>
          <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
          {loadingLabel}
        </>
      ) : label}
    </motion.button>
  )
}
