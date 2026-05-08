import Link from 'next/link'
import { useRouter } from 'next/router'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { allServices, servicePackages } from '../lib/siteContent'

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

const dropdownData = {
  services: allServices.map(s => ({ label: s.title, href: `/book/${s.slug}` })),
  packages: servicePackages.map(p => ({ label: p.title, href: `/packages/${p.slug}` })),
}

function NavLink({ label, href, dropdown }) {
  const [open, setOpen] = useState(false)
  const { pathname } = useRouter()
  const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <div className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <Link
        href={href}
        className={`group relative text-sm transition-colors pb-1 flex items-center gap-1 ${isActive ? 'text-[#2d4f3a] font-semibold' : 'text-gray-700 hover:text-gray-900'}`}
        style={{ fontFamily: 'Lato, sans-serif' }}
      >
        {label}
        {dropdown && (
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
            <path d="M2 3.5 L5 6.5 L8 3.5"/>
          </svg>
        )}
        <span className={`absolute bottom-0 left-0 h-[1.5px] w-full bg-[#2d4f3a] transition-transform duration-300 origin-left rounded-full ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
      </Link>

      {dropdown && (
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.18 }}
              className="absolute top-full left-1/2 -translate-x-1/2 mt-3 bg-white rounded-2xl shadow-xl border border-gray-100 py-4 z-50"
              style={{ minWidth: dropdown === 'services' ? '460px' : '220px' }}
            >
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-l border-t border-gray-100 rotate-45" />
              <div className={`px-4 ${dropdown === 'services' ? 'grid grid-cols-2 gap-x-6 gap-y-1' : 'flex flex-col gap-1'}`}>
                {dropdownData[dropdown].map(({ label, href }) => (
                  <Link key={href} href={href} className="px-3 py-1.5 text-sm text-gray-700 hover:text-[#2d4f3a] hover:bg-[#f7f4eb] rounded-lg transition-colors" onClick={() => setOpen(false)}>
                    {label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  )
}

export default function Header() {
  const { user, logout } = useAuth()
  const cartCount = useCartCount()
  const [menuOpen, setMenuOpen] = useState(false)
  const { pathname } = useRouter()

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45 }}
      className="w-full bg-[#fcf8f5] sticky top-0 z-40 border-b border-[#ece8df]"
    >
      <div className="max-w-8xl mx-auto px-3 sm:px-5 lg:px-16 py-2.5 md:py-3 flex items-center justify-between gap-2">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-1.5 sm:gap-2 hover:opacity-80 transition-opacity flex-shrink-0">
          <div className="w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10 relative flex-shrink-0">
            <Image src="/lotus.webp" alt="MindVeda Logo" fill className="object-contain" />
          </div>
          <div className="leading-tight">
            <div className="text-[#2d4f3a] leading-none font-semibold" style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 'clamp(0.9rem, 2.5vw, 1.5rem)' }}>
              Mind Veda
            </div>
            <div className="mb-0.5" />
            <div className="text-[#8a6914] leading-none" style={{ fontFamily: 'Great Vibes, cursive', fontSize: 'clamp(0.75rem, 2.1vw, 1.35rem)' }}>
              by Babita
            </div>
          </div>
        </Link>

        {/* Desktop Nav — lg+ only */}
        <nav className="hidden lg:flex items-center gap-5 xl:gap-7">
          <NavLink label="Home"     href="/" />
          <NavLink label="Services" href="/services" dropdown="services" />
          <NavLink label="Expert"   href="/expert" />
          <NavLink label="Packages" href="/packages" dropdown="packages" />
          <NavLink label="Blog"     href="/blog" />
          <NavLink label="Contact"  href="/contact" />
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">

          {/* Cart — always visible */}
          <Link href="/cart" className="relative p-1.5 sm:p-2 rounded-full hover:bg-black/5 active:bg-black/10 transition-colors flex-shrink-0">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
            </svg>
            {cartCount > 0 && (
              <motion.span key={cartCount} initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#2d4f3a] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {cartCount > 9 ? '9+' : cartCount}
              </motion.span>
            )}
          </Link>

          {user ? (
            <>
              {/* Email — only xl+ */}
              <span className="hidden xl:block text-sm text-gray-600 truncate max-w-[130px]">{user.email}</span>
              {/* Logout — icon at md+, text added at lg+ */}
              <button
                onClick={logout}
                className="hidden md:flex items-center gap-1 text-red-500 hover:text-red-700 transition-colors p-1.5 rounded-full hover:bg-red-50 flex-shrink-0"
                title="Logout"
              >
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                <span className="hidden lg:inline text-sm font-medium">Logout</span>
              </button>
            </>
          ) : (
            <>
              {/* Login — icon at md+, text added at lg+ */}
              <Link
                href="/login"
                className="hidden md:flex items-center gap-1 text-gray-700 hover:text-[#2d4f3a] transition-colors p-1.5 rounded-full hover:bg-black/5 flex-shrink-0"
                title="Login"
              >
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                <span className="hidden lg:inline text-sm">Login</span>
              </Link>

              {/* Book button — icon+short text at md, full text at lg */}
              <Link
                href="/packages"
                className="hidden md:inline-flex items-center gap-1.5 bg-[#2d4f3a] text-white rounded-full font-medium hover:bg-[#1f3829] transition-colors flex-shrink-0"
                style={{ fontSize: 'clamp(0.7rem, 0.9vw, 0.875rem)', padding: 'clamp(0.3rem, 0.5vw, 0.5rem) clamp(0.6rem, 1vw, 1rem)' }}
              >
                {/* Calendar icon */}
                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                <span className="lg:hidden">Book</span>
                <span className="hidden lg:inline">Book a Session</span>
              </Link>
            </>
          )}

          {/* Mobile Book button — only < md */}
          {!user && (
            <Link href="/packages" className="md:hidden inline-flex items-center gap-1 bg-[#2d4f3a] text-white px-2.5 py-1.5 rounded-full text-xs font-semibold flex-shrink-0">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              Book
            </Link>
          )}

          {/* Hamburger — shows on < lg */}
          <button
            className="lg:hidden p-1.5 text-gray-700 rounded-lg hover:bg-black/5 active:bg-black/10 transition-colors flex-shrink-0"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {menuOpen
                ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
                : <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>
              }
            </svg>
          </button>
        </div>
      </div>

      {/* Drawer menu — < lg */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden bg-[#f7f4eb] border-t border-[#e8dfc0] overflow-hidden"
          >
            <nav className="px-4 py-3 flex flex-col gap-0.5">
              {[
                { label: 'Home',     href: '/' },
                { label: 'Services', href: '/services' },
                { label: 'Expert',   href: '/expert' },
                { label: 'Packages', href: '/packages' },
                { label: 'Blog',     href: '/blog' },
                { label: 'Contact',  href: '/contact' },
              ].map(({ label, href }) => {
                const active = href === '/' ? pathname === '/' : pathname.startsWith(href)
                return (
                  <Link
                    key={label}
                    href={href}
                    className={`text-sm py-3 px-3 rounded-xl flex items-center justify-between ${active ? 'text-[#2d4f3a] font-semibold bg-white shadow-sm' : 'text-gray-700'}`}
                    onClick={() => setMenuOpen(false)}
                  >
                    {label}
                    {active && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    )}
                  </Link>
                )
              })}

              {/* Login / Logout in drawer */}
              {user ? (
                <button
                  onClick={() => { logout(); setMenuOpen(false) }}
                  className="mt-1 text-sm py-3 px-3 rounded-xl flex items-center gap-2 text-red-500 hover:bg-red-50 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
                    <polyline points="16 17 21 12 16 7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                  Logout
                </button>
              ) : (
                <Link
                  href="/login"
                  className="mt-1 text-sm py-3 px-3 rounded-xl flex items-center gap-2 text-gray-700 hover:bg-white transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  Login
                </Link>
              )}

              <Link
                href="/packages"
                className="mt-2 flex items-center justify-center gap-2 bg-[#2d4f3a] text-white py-3 rounded-xl text-sm font-semibold"
                onClick={() => setMenuOpen(false)}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                Book a Session
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
