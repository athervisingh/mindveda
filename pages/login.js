import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useAuth } from '../context/AuthContext'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ImagePlaceholder from '../components/ImagePlaceholder'
import { motion } from 'framer-motion'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      router.push('/')
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfaf7]">
      <Header />
      <main className="flex-1 max-w-6xl mx-auto px-6 py-16 w-full">
        <div className="grid lg:grid-cols-[0.95fr_1.05fr] gap-10 items-stretch">
          <div className="rounded-[34px] bg-[#221c33] p-8 text-white shadow-2xl shadow-[#221c33]/20">
            <div className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.24em] text-white/70">Secure login</div>
            <h1 className="mt-5 text-4xl md:text-6xl font-semibold leading-tight">Welcome back to your healing space.</h1>
            <p className="mt-5 text-white/75 leading-8">Sign in to manage packages, bookings, and support messages. The auth flow already works with mock mode and is ready for Supabase credentials.</p>
            <div className="mt-8 grid gap-4">
              {['Private session history', 'Saved packages and cart', 'Faster checkout flow'].map((item) => (
                <div key={item} className="rounded-2xl bg-white/10 px-4 py-4 text-sm text-white/80">{item}</div>
              ))}
            </div>
            <div className="mt-8 overflow-hidden rounded-[28px] border border-white/10">
              <ImagePlaceholder width="w-full" height="h-72" label="Auth image placeholder" />
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[34px] bg-white p-8 shadow-soft border border-gray-100"
          >
            <p className="text-brand text-sm uppercase tracking-[0.24em] font-semibold">Login</p>
            <h2 className="mt-3 text-3xl font-semibold text-[#2d2343]">Good to see you again</h2>
            <p className="mt-2 text-gray-600">Sign in to continue your session.</p>
            {error && <div className="mt-5 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-2xl border border-gray-200 bg-[#fbfaf7] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand/30"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-2xl border border-gray-200 bg-[#fbfaf7] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand/30"
                  required
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-brand px-6 py-3 font-semibold text-white shadow-lg shadow-brand/20 disabled:opacity-50"
              >
                {loading ? 'Logging in...' : 'Login'}
              </motion.button>
            </form>
            <p className="mt-6 text-center text-sm text-gray-600">
              Don&apos;t have an account? <Link href="/signup" className="font-medium text-brand">Sign up</Link>
            </p>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
