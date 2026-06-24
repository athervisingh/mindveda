import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { NextSeo } from 'next-seo'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { supabase } from '../lib/supabaseClient'

export default function ResetPassword() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const [ready, setReady] = useState(false)

  useEffect(() => {
    // Supabase puts the session in the URL hash after the user clicks the email link.
    // onAuthStateChange fires with event=PASSWORD_RECOVERY when the hash is processed.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setReady(true)
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    try {
      const { error: err } = await supabase.auth.updateUser({ password })
      if (err) throw err
      setDone(true)
      setTimeout(() => router.push('/login'), 3000)
    } catch (err) {
      setError(err.message || 'Could not update password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const EyeIcon = ({ open }) => open
    ? <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
    : <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfaf7]">
      <NextSeo noindex={true} nofollow={true} title="Reset Password — MindVeda" />
      <Header />

      <main className="flex-1 flex flex-col">
        <div className="lg:hidden bg-[#1a3520] px-5 pt-6 pb-5">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-white/70 font-semibold mb-3">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
            New Password
          </span>
          <h1 className="text-xl font-semibold text-white leading-snug">Set a new password</h1>
        </div>

        <div className="flex-1 flex items-stretch">
          <div className="hidden lg:flex lg:w-[48%] xl:w-[45%] flex-col bg-[#1a3520] p-10 xl:p-14">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/70 font-semibold self-start">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
              New Password
            </span>
            <h1 className="mt-6 text-4xl xl:text-5xl font-semibold leading-tight text-white">
              Create a new password
            </h1>
            <p className="mt-4 text-white/70 leading-7 text-sm xl:text-base">
              Choose a strong password to keep your wellness journey secure.
            </p>
            <div className="mt-8 flex flex-col gap-3">
              {[
                { text: 'At least 6 characters', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg> },
                { text: 'Use letters, numbers & symbols', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> },
                { text: 'Do not reuse old passwords', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg> },
              ].map(f => (
                <div key={f.text} className="flex items-center gap-3 rounded-2xl bg-white/10 px-5 py-4 text-sm text-white/85">
                  <span className="text-white/60">{f.icon}</span>
                  {f.text}
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center px-4 sm:px-8 py-8 lg:py-12 lg:px-12 xl:px-16">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="w-full max-w-md"
            >
              <div className="bg-white rounded-3xl shadow-xl shadow-black/6 border border-gray-100 p-6 sm:p-8">

                {done ? (
                  <div className="text-center py-4">
                    <div className="w-14 h-14 rounded-full bg-[#eef4f0] flex items-center justify-center mx-auto mb-4">
                      <svg className="w-7 h-7 text-[#2d4f3a]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                    <h2 className="text-2xl font-semibold text-[#1a3520] mb-2">Password updated!</h2>
                    <p className="text-gray-500 text-sm">Redirecting you to login…</p>
                    <Link href="/login" className="mt-4 inline-block text-sm font-semibold text-[#2d4f3a] hover:underline">
                      Go to login now
                    </Link>
                  </div>
                ) : !ready ? (
                  <div className="text-center py-8">
                    <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-4">
                      <svg className="w-7 h-7 text-amber-500" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    </div>
                    <h2 className="text-xl font-semibold text-[#1a3520] mb-2">Invalid or expired link</h2>
                    <p className="text-gray-500 text-sm mb-5">Please request a new password reset link.</p>
                    <Link href="/forgot-password" className="inline-block rounded-full bg-[#2d4f3a] px-6 py-3 text-sm font-semibold text-white hover:bg-[#1f3829] transition-colors">
                      Request new link
                    </Link>
                  </div>
                ) : (
                  <>
                    <div className="mb-6">
                      <p className="text-[#2d4f3a] text-xs uppercase tracking-[0.24em] font-semibold mb-2">New Password</p>
                      <h2 className="text-2xl sm:text-3xl font-semibold text-[#1a3520]">Set a new password</h2>
                      <p className="mt-1.5 text-gray-500 text-sm">Choose a strong password for your account.</p>
                    </div>

                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-4 flex items-center gap-2 rounded-2xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600"
                      >
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                        {error}
                      </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1.5 text-gray-700">New password</label>
                        <div className="relative">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                          </span>
                          <input
                            type={showPass ? 'text' : 'password'}
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full rounded-2xl border border-gray-200 bg-[#fbfaf7] pl-10 pr-11 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d4f3a]/25 focus:border-[#2d4f3a]/40 transition-all"
                            required
                            minLength={6}
                          />
                          <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                            <EyeIcon open={showPass} />
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1.5 text-gray-700">Confirm password</label>
                        <div className="relative">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                          </span>
                          <input
                            type={showConfirm ? 'text' : 'password'}
                            value={confirm}
                            onChange={e => setConfirm(e.target.value)}
                            placeholder="••••••••"
                            className="w-full rounded-2xl border border-gray-200 bg-[#fbfaf7] pl-10 pr-11 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d4f3a]/25 focus:border-[#2d4f3a]/40 transition-all"
                            required
                            minLength={6}
                          />
                          <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                            <EyeIcon open={showConfirm} />
                          </button>
                        </div>
                      </div>

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
                            Updating…
                          </>
                        ) : 'Update password'}
                      </motion.button>
                    </form>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
