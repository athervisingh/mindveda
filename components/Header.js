import Link from 'next/link'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import Image from 'next/image'
import { useEffect, useState } from 'react'

function useCartCount() {
  const [count, setCount] = useState(0)

  function sync() {
    const cart = JSON.parse(localStorage.getItem('mv_cart') || '[]')
    setCount(cart.length)
  }

  useEffect(() => {
    sync()
    window.addEventListener('cartUpdated', sync)
    return () => window.removeEventListener('cartUpdated', sync)
  }, [])

  return count
}

export default function Header() {
  const { user, logout } = useAuth()
  const cartCount = useCartCount()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full bg-white shadow-sm sticky top-0 z-40"
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="w-12 h-12 relative">
            <Image src="/logo.jpeg" alt="MindVeda Logo" fill className="object-contain" />
          </div>
          <div>
            <div className="font-semibold text-sm">MindVeda</div>
            <div className="text-xs text-gray-500">by Babita</div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm hover:text-brand transition-colors">Home</Link>
          <Link href="/services" className="text-sm hover:text-brand transition-colors">Services</Link>
          <Link href="/expert" className="text-sm hover:text-brand transition-colors">Expert</Link>
          <Link href="/packages" className="text-sm hover:text-brand transition-colors">Packages</Link>
          <Link href="/blog" className="text-sm hover:text-brand transition-colors">Blog</Link>
          <Link href="/contact" className="text-sm hover:text-brand transition-colors">Contact</Link>
        </nav>

        <div className="flex items-center gap-3">
          {/* Cart icon with badge */}
          <Link href="/cart" className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
            </svg>
            {cartCount > 0 && (
              <motion.span
                key={cartCount}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-brand text-white text-[10px] font-bold rounded-full flex items-center justify-center"
              >
                {cartCount > 9 ? '9+' : cartCount}
              </motion.span>
            )}
          </Link>

          {user ? (
            <>
              <span className="text-sm text-gray-600 hidden md:block">{user.email}</span>
              <button onClick={logout} className="text-sm text-red-500 hover:text-red-700">Logout</button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm hover:text-brand hidden md:block">Login</Link>
              <Link href="/packages" className="px-4 py-2 rounded-md bg-brand text-white text-sm hover:opacity-90 transition-opacity">
                Book a Session
              </Link>
            </>
          )}
        </div>
      </div>
    </motion.header>
  )
}
