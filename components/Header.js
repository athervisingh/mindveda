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
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <Link
        href={href}
        className={`group relative text-sm transition-colors pb-1 flex items-center gap-1 ${isActive ? 'text-[#2d4f3a] font-semibold' : 'text-gray-700 hover:text-gray-900'}`}
        style={{ fontFamily: 'Lato, sans-serif' }}
      >
        {label}
        {dropdown && (
          <svg
            width="10" height="10" viewBox="0 0 10 10" fill="none"
            stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"
            className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          >
            <path d="M2 3.5 L5 6.5 L8 3.5"/>
          </svg>
        )}
        {/* underline — always visible when active, animated on hover otherwise */}
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
              {/* small arrow */}
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-l border-t border-gray-100 rotate-45" />

              <div className={`px-4 ${dropdown === 'services' ? 'grid grid-cols-2 gap-x-6 gap-y-1' : 'flex flex-col gap-1'}`}>
                {dropdownData[dropdown].map(({ label, href }) => (
                  <Link
                    key={href}
                    href={href}
                    className="px-3 py-1.5 text-sm text-gray-700 hover:text-[#2d4f3a] hover:bg-[#f7f4eb] rounded-lg transition-colors"
                    style={{ fontFamily: 'Lato, sans-serif' }}
                    onClick={() => setOpen(false)}
                  >
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
      transition={{ duration: 0.5 }}
      className="w-full bg-[#fcf8f5] sticky top-0 z-40"
    >
      <div className="max-w-8xl mx-auto px-16 py-3 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="w-12 h-12 relative">
            <Image src="/lotus.png" alt="MindVeda Logo" fill className="object-contain" />
          </div>
          <div className="leading-tight">
            <div className="text-[#2d4f3a]
            " style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '1.7rem', fontWeight: 600 }}>
              Mind Veda
            </div>
            <div className="text-[#8a6914]" style={{ fontFamily: 'Great Vibes, cursive', fontSize: '1.6rem' }}>
              by Babita
            </div>
          </div>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-7">
          <NavLink label="Home"     href="/"         />
          <NavLink label="Services" href="/services"  dropdown="services" />
          <NavLink label="Expert"   href="/expert"    />
          <NavLink label="Packages" href="/packages"  dropdown="packages" />
          <NavLink label="Blog"     href="/blog"      />
          <NavLink label="Contact"  href="/contact"   />
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">

          {/* Cart */}
          <Link href="/cart" className="relative p-2 rounded-full hover:bg-black/5 transition-colors">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
            </svg>
            {cartCount > 0 && (
              <motion.span
                key={cartCount}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#2d4f3a] text-white text-[10px] font-bold rounded-full flex items-center justify-center"
              >
                {cartCount > 9 ? '9+' : cartCount}
              </motion.span>
            )}
          </Link>

          {user ? (
            <>
              <span className="text-sm text-gray-600 hidden md:block" style={{ fontFamily: 'Lato, sans-serif' }}>{user.email}</span>
              <button onClick={logout} className="text-sm text-red-500 hover:text-red-700 transition-colors" style={{ fontFamily: 'Lato, sans-serif' }}>Logout</button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm text-gray-700 hover:text-gray-900 hidden md:block transition-colors" style={{ fontFamily: 'Lato, sans-serif' }}>Login</Link>
              <Link
                href="/packages"
                className="hidden md:inline-flex items-center gap-2 bg-[#2d4f3a] text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-[#1f3829] transition-colors"
                style={{ fontFamily: 'Lato, sans-serif' }}
              >
                <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="16" height="15" rx="2"/>
                  <path d="M2 8 L18 8"/>
                  <path d="M6 1 L6 5"/>
                  <path d="M14 1 L14 5"/>
                </svg>
                Book a Session
              </Link>
            </>
          )}

          {/* Mobile toggle */}
          <button className="md:hidden p-2 text-gray-700" onClick={() => setMenuOpen(!menuOpen)}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              {menuOpen
                ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
                : <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>
              }
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#f7f4eb] border-t border-gray-200 px-8 py-4 flex flex-col gap-3">
          {[
            { label: 'Home', href: '/' },
            { label: 'Services', href: '/services' },
            { label: 'Expert', href: '/expert' },
            { label: 'Packages', href: '/packages' },
            { label: 'Blog', href: '/blog' },
            { label: 'Contact', href: '/contact' },
          ].map(({ label, href }) => {
            const active = href === '/' ? pathname === '/' : pathname.startsWith(href)
            return (
              <Link
                key={label}
                href={href}
                className={`text-sm py-1 ${active ? 'text-[#2d4f3a] font-semibold border-l-2 border-[#2d4f3a] pl-2' : 'text-gray-700'}`}
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </Link>
            )
          })}
          <Link href="/packages" className="inline-flex items-center gap-2 bg-[#2d4f3a] text-white px-5 py-2.5 rounded-full text-sm font-medium w-fit mt-2" onClick={() => setMenuOpen(false)}>
            Book a Session
          </Link>
        </div>
      )}
    </motion.header>
  )
}
