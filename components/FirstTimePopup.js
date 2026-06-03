import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { motion, AnimatePresence } from 'framer-motion'

const PURCHASED_KEY = 'mv_has_purchased'
const SESSION_KEY   = 'mv_popup_dismissed'

// Pages where popup should NOT appear
const EXCLUDED_PATHS = ['/quick-book', '/checkout', '/cart', '/login', '/signup', '/admin', '/join']

export default function FirstTimePopup() {
  const router = useRouter()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Don't show on excluded pages
    const path = router.pathname
    if (EXCLUDED_PATHS.some(p => path.startsWith(p))) return

    // Don't show if user has already purchased anything
    if (localStorage.getItem(PURCHASED_KEY)) return

    // Don't show again in the same browser session after dismissing
    if (sessionStorage.getItem(SESSION_KEY)) return

    // Show after 2 seconds
    const timer = setTimeout(() => setVisible(true), 2000)
    return () => clearTimeout(timer)
  }, [router.pathname])

  function close() {
    setVisible(false)
    // Only dismiss for this session — popup returns on next visit until purchase happens
    sessionStorage.setItem(SESSION_KEY, '1')
  }

  function goBook() {
    close()
    router.push('/quick-book')
  }

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Blur overlay */}
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[9998] bg-black/50 backdrop-blur-sm"
            onClick={close}
          />

          {/* Popup card */}
          <motion.div
            key="popup"
            initial={{ opacity: 0, scale: 0.88, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[9999] flex items-center justify-center px-4 pointer-events-none"
          >
            <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden pointer-events-auto">

              {/* Close button */}
              <button
                onClick={close}
                className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 transition-all"
                aria-label="Close"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>

              {/* Green top banner */}
              <div className="bg-[#1a3520] px-6 pt-8 pb-6 text-center">
                <span className="inline-block bg-[#f5a623] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4">
                  🎁 First-Time Offer
                </span>
                <div className="text-white text-5xl font-bold leading-none mb-1">₹99</div>
                <p className="text-white/60 text-xs mt-1">One-time introductory price</p>
              </div>

              {/* Body */}
              <div className="px-6 py-6 text-center">
                <h2 className="text-xl font-semibold text-[#1a3520] leading-snug mb-2">
                  Chat + Voice Call with Babita
                </h2>
                <p className="text-gray-500 text-sm leading-relaxed mb-6">
                  5-min AI wellness chat <span className="text-gray-300">·</span> 10-min personal voice call with Babita. Just for you — as a first-time visitor.
                </p>

                <button
                  onClick={goBook}
                  className="w-full rounded-full bg-[#1a3520] text-white font-semibold py-3.5 text-sm hover:opacity-90 active:scale-[0.98] transition-all mb-3"
                >
                  Book Now for ₹99 →
                </button>

                <button
                  onClick={close}
                  className="w-full text-xs text-gray-400 hover:text-gray-600 transition-colors py-1"
                >
                  No thanks, maybe later
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
