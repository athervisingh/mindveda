import { useRouter } from 'next/router'
import { CheckIcon, StarIcon, CartIcon } from '../../components/Icons'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { servicePackages } from '../../lib/siteContent'
import { useState } from 'react'

const TIME_SLOTS = [
  '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM',
]

function getNext14Days() {
  const days = []
  const today = new Date()
  for (let i = 1; i <= 14; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    days.push(d)
  }
  return days
}

function SlotPicker({ pkg, days, selectedDay, setSelectedDay, selectedTime, setSelectedTime, onAddToCart }) {
  return (
    <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="bg-[#2d4f3a] px-5 py-4">
        <h2 className="text-white font-semibold text-base sm:text-lg">Pick Your Session Slot</h2>
        <p className="text-white/70 text-xs sm:text-sm mt-0.5">All times in IST · Sundays off</p>
      </div>

      <div className="p-4 sm:p-5">
        <p className="text-sm font-medium text-gray-700 mb-3">Choose a Date</p>
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
          {days.map((d, i) => {
            const isSelected = selectedDay && selectedDay.toDateString() === d.toDateString()
            const isSunday = d.getDay() === 0
            return (
              <button
                key={i}
                disabled={isSunday}
                onClick={() => { setSelectedDay(d); setSelectedTime(null) }}
                className={`flex-shrink-0 w-14 rounded-2xl py-3 flex flex-col items-center transition-all ${
                  isSunday ? 'opacity-25 cursor-not-allowed bg-gray-50' :
                  isSelected ? 'bg-[#2d4f3a] text-white shadow-md' :
                  'bg-gray-50 hover:bg-[#2d4f3a]/10 text-gray-700'
                }`}
              >
                <span className="text-[10px] font-medium opacity-80">{d.toLocaleDateString('en-IN', { weekday: 'short' })}</span>
                <span className="text-base font-bold mt-0.5">{d.getDate()}</span>
                <span className="text-[10px] opacity-70">{d.toLocaleDateString('en-IN', { month: 'short' })}</span>
              </button>
            )
          })}
        </div>

        <AnimatePresence>
          {selectedDay && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <p className="text-sm font-medium text-gray-700 mt-4 mb-3">
                Times for{' '}
                <span className="text-gray-400 font-normal">
                  {selectedDay.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
                </span>
              </p>
              <div className="grid grid-cols-3 gap-2">
                {TIME_SLOTS.map(t => (
                  <button
                    key={t}
                    onClick={() => setSelectedTime(t)}
                    className={`py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                      selectedTime === t
                        ? 'bg-[#2d4f3a] text-white shadow-md'
                        : 'bg-gray-50 text-gray-700 hover:bg-[#2d4f3a]/10 border border-gray-100'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {selectedDay && selectedTime && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 bg-[#2d4f3a]/5 border border-[#2d4f3a]/10 rounded-xl px-4 py-3 text-sm"
          >
            <div className="flex justify-between text-gray-600 mb-1">
              <span className="truncate pr-2">{pkg.title}</span>
              <span className="font-semibold text-[#2d4f3a] flex-shrink-0">₹{pkg.price.toLocaleString('en-IN')}</span>
            </div>
            <div className="text-xs text-gray-400">
              {selectedDay.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })} · {selectedTime} · {pkg.duration}
            </div>
          </motion.div>
        )}

        <button
          disabled={!selectedDay || !selectedTime}
          onClick={onAddToCart}
          className="mt-4 w-full rounded-full bg-[#2d4f3a] py-3.5 text-white font-semibold text-sm disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#1f3829] active:scale-[0.98] transition-all"
        >
          {selectedDay && selectedTime ? 'Add to Cart' : 'Select a Date & Time'}
        </button>
        <p className="text-center text-xs text-gray-400 mt-3">No payment now · Review in cart</p>
      </div>
    </div>
  )
}

export default function PackageDetail() {
  const router = useRouter()
  const { slug } = router.query
  const pkg = servicePackages.find((p) => p.slug === slug) || servicePackages[0]

  const days = getNext14Days()
  const [selectedDay, setSelectedDay] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)

  function handleAddToCart() {
    if (!selectedDay || !selectedTime) return
    const cart = JSON.parse(localStorage.getItem('mv_cart') || '[]')
    cart.push({
      cartId: Date.now(),
      id: pkg.id,
      type: 'package',
      slug: pkg.slug,
      title: pkg.title,
      icon: 'lotus',
      price: pkg.price,
      duration: pkg.duration,
      bookingDate: selectedDay.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
      bookingTime: selectedTime,
    })
    localStorage.setItem('mv_cart', JSON.stringify(cart))
    window.dispatchEvent(new Event('cartUpdated'))
    router.push('/cart')
  }

  const slotPickerProps = { pkg, days, selectedDay, setSelectedDay, selectedTime, setSelectedTime, onAddToCart: handleAddToCart }

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfaf7]">
      <Header />

      <main className="flex-1 pb-24 lg:pb-0">

        {/* Breadcrumb */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6">
          <nav className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-400 flex-wrap">
            <Link href="/" className="hover:text-[#2d4f3a]">Home</Link>
            <span>/</span>
            <Link href="/packages" className="hover:text-[#2d4f3a]">Packages</Link>
            <span>/</span>
            <span className="text-gray-700 font-medium truncate max-w-[160px] sm:max-w-none">{pkg.title}</span>
          </nav>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-5 sm:py-8">
          <div className="flex flex-col lg:grid lg:grid-cols-[1fr_380px] gap-6 lg:gap-8 lg:items-start">

            {/* ── LEFT / TOP — Package Details ── */}
            <div className="flex flex-col gap-4 sm:gap-5">

              {/* Package header card */}
              <div className="bg-gradient-to-r from-[#edf5ee] to-[#f5f0e8] rounded-2xl sm:rounded-3xl p-4 sm:p-6 flex gap-4 items-start">
                <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl bg-white/80 flex items-center justify-center flex-shrink-0 shadow-sm">
                  {pkg.featured ? (
                    <svg className="w-8 h-8 sm:w-11 sm:h-11 text-[#2d4f3a]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                  ) : (
                    <svg className="w-8 h-8 sm:w-11 sm:h-11 text-[#2d4f3a]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    </svg>
                  )}
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] sm:text-xs font-semibold text-[#2d4f3a] uppercase tracking-wider">
                    {pkg.featured ? 'Most Popular Package' : 'Healing Package'}
                  </span>
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-[#1a3520] mt-0.5 leading-snug">{pkg.title}</h1>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2">
                    <span className="text-xl sm:text-2xl font-bold text-[#2d4f3a]">₹{pkg.price.toLocaleString('en-IN')}</span>
                    <span className="text-gray-400 text-xs sm:text-sm">per session</span>
                    <span className="flex items-center gap-1 text-gray-400 text-xs sm:text-sm">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2"/>
                      </svg>
                      {pkg.duration}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
                <h2 className="text-base sm:text-lg font-semibold text-[#1a3520] mb-2 sm:mb-3">About This Package</h2>
                <p className="text-gray-500 leading-relaxed text-sm sm:text-base">{pkg.excerpt}</p>
              </div>

              {/* What's Included + How it works */}
              <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
                <h3 className="text-sm sm:text-base font-semibold text-[#1a3520] mb-3 sm:mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 sm:w-7 sm:h-7 bg-green-100 text-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </span>
                  What&apos;s Included
                </h3>
                <ul className="space-y-2 sm:space-y-2.5">
                  {[
                    'Initial assessment and personalised support plan',
                    'Secure session booking with calendar reminders',
                    'Session notes and progress tracking',
                    'Flexible rescheduling up to 24 hours before',
                    'Follow-up resources between sessions',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-xs sm:text-sm text-gray-500">
                      <span className="w-4 h-4 mt-0.5 bg-[#2d4f3a]/10 text-[#2d4f3a] rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckIcon className="w-2.5 h-2.5" />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* How it works */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                {[
                  ['1. Discover', 'Pick the right package for your needs.'],
                  ['2. Book a Slot', 'Add to cart with your chosen time.'],
                  ['3. Start Healing', 'Checkout and join your session.'],
                ].map(([title, desc], i) => (
                  <div key={title} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex sm:flex-col items-start gap-3 sm:gap-0">
                    <span className="w-7 h-7 bg-[#2d4f3a] text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 sm:mb-2">{i + 1}</span>
                    <div>
                      <p className="text-sm font-semibold text-[#1a3520]">{title.replace(/^\d+\. /, '')}</p>
                      <p className="mt-0.5 sm:mt-1 text-xs text-gray-500 leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap gap-2">
                {['100% Confidential', 'Certified Psychologists', 'Secure Sessions', 'Flexible Reschedule'].map(t => (
                  <span key={t} className="flex items-center gap-1.5 text-[10px] sm:text-xs text-gray-500 bg-white border border-gray-200 px-2.5 sm:px-3 py-1.5 rounded-full">
                    <CheckIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-green-500 flex-shrink-0" /> {t}
                  </span>
                ))}
              </div>

              {/* Slot picker — mobile only (inline) */}
              <div className="lg:hidden" id="slot-picker">
                <SlotPicker {...slotPickerProps} />
                <Link href="/cart" className="mt-3 flex items-center justify-center gap-2 text-sm text-[#2d4f3a] hover:underline">
                  <CartIcon className="w-4 h-4" /> View Cart
                </Link>
              </div>
            </div>

            {/* ── RIGHT — Desktop sticky slot picker ── */}
            <div className="hidden lg:block sticky top-24">
              <SlotPicker {...slotPickerProps} />
              <Link href="/cart" className="mt-3 flex items-center justify-center gap-2 text-sm text-[#2d4f3a] hover:underline">
                <CartIcon className="w-4 h-4" /> View Cart
              </Link>
            </div>

          </div>
        </div>
      </main>

      {/* ── Mobile sticky bottom bar ── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-sm border-t border-gray-200 px-4 py-3 flex items-center gap-3 shadow-2xl">
        <div className="flex-1 min-w-0">
          <div className="text-[11px] text-gray-400 truncate">
            {selectedDay && selectedTime
              ? `${selectedDay.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })} · ${selectedTime}`
              : 'Select date & time below'}
          </div>
          <div className="font-bold text-[#1a3520] text-base">
            ₹{pkg.price.toLocaleString('en-IN')} <span className="text-xs font-normal text-gray-400">/ session</span>
          </div>
        </div>
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => {
            if (selectedDay && selectedTime) handleAddToCart()
            else document.getElementById('slot-picker')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }}
          className="flex-shrink-0 rounded-full bg-[#2d4f3a] text-white px-5 py-3 text-sm font-semibold shadow-lg hover:bg-[#1f3829] transition-colors"
        >
          {selectedDay && selectedTime ? 'Add to Cart' : 'Book Now'}
        </motion.button>
      </div>

      <Footer />
    </div>
  )
}
