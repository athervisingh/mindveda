import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useAuth } from '../context/AuthContext'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Image from 'next/image'
import { motion } from 'framer-motion'

export default function Signup() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signup } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signup(email, password, fullName)
      router.push('/')
    } catch (err) {
      setError(err.message || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  const features = [
    { icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>, text: 'Save your favourite packages' },
    { icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>, text: 'Access booking history' },
    { icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>, text: 'Get a personalised journey' },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfaf7]">
      <Header />

      <main className="flex-1 flex flex-col">

        {/* ── Mobile top accent bar ── */}
        <div className="lg:hidden bg-[#1a3520] px-5 pt-6 pb-5">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-white/70 font-semibold mb-3">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            Why Sign Up
          </span>
          <h1 className="text-xl font-semibold text-white leading-snug">Start your healing<br />journey today.</h1>
          <div className="mt-3 flex flex-wrap gap-2">
            {features.map(f => (
              <div key={f.text} className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-white/80 text-xs">
                {f.icon}{f.text}
              </div>
            ))}
          </div>
        </div>

        {/* ── Page body ── */}
        <div className="flex-1 flex items-stretch">

          {/* ── Form panel ── */}
          <div className="flex-1 flex items-center justify-center px-4 sm:px-8 py-8 lg:py-12 lg:px-12 xl:px-16 order-first">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="w-full max-w-md"
            >
              <div className="bg-white rounded-3xl shadow-xl shadow-black/6 border border-gray-100 p-6 sm:p-8">

                {/* Header */}
                <div className="mb-6">
                  <p className="text-[#2d4f3a] text-xs uppercase tracking-[0.24em] font-semibold mb-2">Create account</p>
                  <h2 className="text-2xl sm:text-3xl font-semibold text-[#1a3520]">Start your healing journey</h2>
                  <p className="mt-1.5 text-gray-500 text-sm">Create your account to save packages and book sessions.</p>
                </div>

                {/* Error */}
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

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-gray-700">Full Name</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                      </span>
                      <input
                        type="text"
                        value={fullName}
                        onChange={e => setFullName(e.target.value)}
                        placeholder="Your full name"
                        className="w-full rounded-2xl border border-gray-200 bg-[#fbfaf7] pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d4f3a]/25 focus:border-[#2d4f3a]/40 transition-all"
                        required
                      />
                    </div>
                  </div>

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

                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-gray-700">Password</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                      </span>
                      <input
                        type={showPass ? 'text' : 'password'}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Min. 8 characters"
                        className="w-full rounded-2xl border border-gray-200 bg-[#fbfaf7] pl-10 pr-11 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d4f3a]/25 focus:border-[#2d4f3a]/40 transition-all"
                        required
                        minLength={8}
                      />
                      <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showPass
                          ? <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                          : <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        }
                      </button>
                    </div>
                    <p className="mt-1.5 text-xs text-gray-400">Use at least 8 characters with a mix of letters and numbers.</p>
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
                        Creating account…
                      </>
                    ) : 'Create my account'}
                  </motion.button>
                </form>

                {/* Divider */}
                <div className="my-5 flex items-center gap-3">
                  <div className="flex-1 h-px bg-gray-100" />
                  <span className="text-xs text-gray-400">or</span>
                  <div className="flex-1 h-px bg-gray-100" />
                </div>

                {/* Google placeholder */}
                <button className="w-full flex items-center justify-center gap-2.5 rounded-2xl border border-gray-200 py-3 text-sm text-gray-600 hover:bg-gray-50 transition-colors font-medium">
                  <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                  Continue with Google
                </button>

                <p className="mt-5 text-center text-sm text-gray-500">
                  Already have an account?{' '}
                  <Link href="/login" className="font-semibold text-[#2d4f3a] hover:underline">Login</Link>
                </p>

                <p className="mt-4 text-center text-[11px] text-gray-400 leading-relaxed">
                  By signing up, you agree to our{' '}
                  <Link href="/terms" className="underline hover:text-gray-600">Terms</Link>{' '}and{' '}
                  <Link href="/privacy" className="underline hover:text-gray-600">Privacy Policy</Link>.
                </p>
              </div>
            </motion.div>
          </div>

          {/* ── Desktop right panel ── */}
          <div className="hidden lg:flex lg:w-[48%] xl:w-[45%] flex-col bg-[#1a3520] p-10 xl:p-14">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/70 font-semibold self-start">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              Why Sign Up
            </span>
            <h2 className="mt-6 text-4xl xl:text-5xl font-semibold leading-tight text-white">
              Keep your packages, sessions, and booking flow in one place.
            </h2>
            <p className="mt-4 text-white/70 leading-7 text-sm xl:text-base">
              A personalized wellness dashboard waiting for you — track progress, manage bookings, and grow every day.
            </p>
            <div className="mt-8 flex flex-col gap-3">
              {features.map(f => (
                <div key={f.text} className="flex items-center gap-3 rounded-2xl bg-white/10 px-5 py-4 text-sm text-white/85">
                  <span className="text-white/60">{f.icon}</span>
                  {f.text}
                </div>
              ))}
            </div>
            <div className="mt-auto pt-8 relative h-52 xl:h-64 rounded-3xl overflow-hidden border border-white/10">
              <Image src="/yoga.webp" alt="Mind Veda Wellness" fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a3520]/60 to-transparent" />
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  )
}
