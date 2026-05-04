import Link from 'next/link'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

export default function Header() {
  const { user, logout } = useAuth()

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full bg-white shadow-sm sticky top-0 z-40"
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand to-brand-light flex items-center justify-center text-white font-semibold text-sm">MV</div>
          <div>
            <div className="font-semibold text-sm">MindVeda</div>
            <div className="text-xs text-gray-500">by Babita</div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/packages" className="text-sm hover:text-brand transition-colors">Packages</Link>
          <Link href="/blog" className="text-sm hover:text-brand transition-colors">Blog</Link>
          <Link href="/resources" className="text-sm hover:text-brand transition-colors">Resources</Link>
          <Link href="/about" className="text-sm hover:text-brand transition-colors">About</Link>
          <Link href="/contact" className="text-sm hover:text-brand transition-colors">Contact</Link>
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="text-sm text-gray-600">{user.email}</span>
              <button onClick={logout} className="text-sm text-red-500 hover:text-red-700">Logout</button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm hover:text-brand">Login</Link>
              <Link href="/signup" className="px-4 py-2 rounded-md bg-brand text-white text-sm hover:opacity-90 transition-opacity">Book a Session</Link>
            </>
          )}
        </div>
      </div>
    </motion.header>
  )
}
