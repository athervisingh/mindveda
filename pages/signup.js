import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useAuth } from '../context/AuthContext'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ImagePlaceholder from '../components/ImagePlaceholder'
import { motion } from 'framer-motion'

export default function Signup() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
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

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfaf7]">
      <Header />
      <main className="flex-1 max-w-6xl mx-auto px-6 py-16 w-full">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-10 items-stretch">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[34px] bg-white p-8 shadow-soft border border-gray-100"
          >
            <p className="text-brand text-sm uppercase tracking-[0.24em] font-semibold">Create account</p>
            <h1 className="mt-3 text-3xl font-semibold text-[#1a3520]">Start your healing journey</h1>
            <p className="mt-2 text-gray-600">Create your account to save packages, book sessions, and get personalized support.</p>
            {error && <div className="mt-5 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-2xl border border-gray-200 bg-[#fbfaf7] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand/30"
                  required
                />
              </div>
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
                {loading ? 'Creating account...' : 'Sign Up'}
              </motion.button>
            </form>
            <p className="mt-6 text-center text-sm text-gray-600">
              Already have an account? <Link href="/login" className="font-medium text-brand">Login</Link>
            </p>
          </motion.div>

          <div className="rounded-[34px] bg-[#1a3520] p-8 text-white shadow-2xl shadow-[#1a3520]/20">
            <div className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.24em] text-white/70">Why sign up</div>
            <h2 className="mt-5 text-4xl font-semibold leading-tight">Keep your packages, sessions, and booking flow in one place.</h2>
            <p className="mt-5 text-white/75 leading-8">This panel keeps the premium visual language consistent while giving users a clear reason to create an account.</p>
            <div className="mt-8 grid gap-4">
              {['Save your favorite packages', 'Access booking history', 'Get a personalized journey'].map((item) => (
                <div key={item} className="rounded-2xl bg-white/10 px-4 py-4 text-sm text-white/80">{item}</div>
              ))}
            </div>
            <div className="mt-8 overflow-hidden rounded-[28px] border border-white/10">
              <ImagePlaceholder width="w-full" height="h-72" label="Signup image placeholder" />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
