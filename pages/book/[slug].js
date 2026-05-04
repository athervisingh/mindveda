import { useState } from 'react'
import { useRouter } from 'next/router'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { allServices } from '../../lib/siteContent'

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

function formatFullDate(date) {
  return date.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

export default function BookingPage() {
  const router = useRouter()
  const { slug } = router.query
  const service = allServices.find(s => s.slug === slug)

  const days = getNext14Days()
  const [selectedDay, setSelectedDay] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)

  if (!service && slug) {
    return (
      <div className="min-h-screen flex flex-col bg-[#fbfaf7]">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-2xl font-semibold text-gray-700 mb-4">Service not found</p>
            <Link href="/services" className="text-brand underline">← Back to Services</Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!service) return null

  function handleAddToCart() {
    if (!selectedDay || !selectedTime) return
    const cart = JSON.parse(localStorage.getItem('mv_cart') || '[]')
    cart.push({
      cartId: Date.now(),
      id: service.id,
      type: 'service',
      slug: service.slug,
      title: service.title,
      icon: service.icon,
      price: service.price,
      duration: service.duration,
      bookingDate: formatFullDate(selectedDay),
      bookingTime: selectedTime,
    })
    localStorage.setItem('mv_cart', JSON.stringify(cart))
    window.dispatchEvent(new Event('cartUpdated'))
    router.push('/cart')
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfaf7] text-gray-900">
      <Header />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="max-w-5xl mx-auto px-6 pt-6">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-brand">Home</Link>
            <span>/</span>
            <Link href="/services" className="hover:text-brand">Services</Link>
            <span>/</span>
            <span className="text-gray-800 font-medium">{service.title}</span>
          </nav>
        </div>

        <div className="max-w-5xl mx-auto px-6 py-8 grid lg:grid-cols-[1fr_380px] gap-8 items-start" id="details">
          {/* Left — Service Details */}
          <div>
            {/* Service header */}
            <div className={`bg-gradient-to-r ${service.color} rounded-3xl p-6 mb-6 flex items-start gap-5`}>
              <span className="text-6xl">{service.icon}</span>
              <div>
                <span className="text-xs font-semibold text-brand uppercase tracking-wider">{service.category}</span>
                <h1 className="text-3xl font-semibold text-[#2d2343] mt-1 leading-snug">{service.title}</h1>
                <div className="flex items-center gap-4 mt-3">
                  <span className="text-2xl font-bold text-brand">₹{service.price.toLocaleString('en-IN')}</span>
                  <span className="text-gray-500 text-sm">per session</span>
                  <span className="flex items-center gap-1 text-gray-500 text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6l4 2"/>
                    </svg>
                    {service.duration}
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl p-6 mb-5 shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-[#2d2343] mb-3">About This Service</h2>
              <p className="text-gray-600 leading-relaxed">{service.description}</p>
            </div>

            {/* Benefits + What to Expect */}
            <div className="grid sm:grid-cols-2 gap-5">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-base font-semibold text-[#2d2343] mb-4 flex items-center gap-2">
                  <span className="w-7 h-7 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm">✓</span>
                  Key Benefits
                </h3>
                <ul className="space-y-2.5">
                  {service.benefits.map((b, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600">
                      <span className="w-4 h-4 mt-0.5 bg-brand/10 text-brand rounded-full flex items-center justify-center text-xs flex-shrink-0">✓</span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-base font-semibold text-[#2d2343] mb-4 flex items-center gap-2">
                  <span className="w-7 h-7 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm">ℹ</span>
                  What to Expect
                </h3>
                <ol className="space-y-2.5">
                  {service.whatToExpect.map((w, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600">
                      <span className="w-5 h-5 mt-0.5 bg-brand text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">{i + 1}</span>
                      {w}
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            {/* Trust badges */}
            <div className="mt-5 flex flex-wrap gap-3">
              {['100% Confidential', 'Certified Psychologists', 'Secure Video Sessions', 'Flexible Reschedule'].map(t => (
                <span key={t} className="flex items-center gap-1.5 text-xs text-gray-600 bg-white border border-gray-200 px-3 py-1.5 rounded-full">
                  <span className="text-green-500">✓</span> {t}
                </span>
              ))}
            </div>
          </div>

          {/* Right — Slot Picker + Add to Cart */}
          <div className="sticky top-24">
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-brand px-6 py-4">
                <h2 className="text-white font-semibold text-lg">Pick Your Session Slot</h2>
                <p className="text-white/70 text-sm mt-0.5">All times in IST · Sundays off</p>
              </div>

              <div className="p-5">
                {/* Date Picker */}
                <p className="text-sm font-medium text-gray-700 mb-3">Choose a Date</p>
                <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
                  {days.map((d, i) => {
                    const isSelected = selectedDay && selectedDay.toDateString() === d.toDateString()
                    const isSunday = d.getDay() === 0
                    return (
                      <button
                        key={i}
                        disabled={isSunday}
                        onClick={() => { setSelectedDay(d); setSelectedTime(null) }}
                        className={`flex-shrink-0 w-14 rounded-2xl py-3 flex flex-col items-center transition-all text-sm ${
                          isSunday ? 'opacity-25 cursor-not-allowed bg-gray-50' :
                          isSelected ? 'bg-brand text-white shadow-md' :
                          'bg-gray-50 hover:bg-brand/10 text-gray-700'
                        }`}
                      >
                        <span className="text-xs font-medium opacity-80">
                          {d.toLocaleDateString('en-IN', { weekday: 'short' })}
                        </span>
                        <span className="text-base font-bold mt-0.5">{d.getDate()}</span>
                        <span className="text-xs opacity-70">
                          {d.toLocaleDateString('en-IN', { month: 'short' })}
                        </span>
                      </button>
                    )
                  })}
                </div>

                {/* Time Slots */}
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
                        <span className="text-gray-500 font-normal">
                          {selectedDay.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
                        </span>
                      </p>
                      <div className="grid grid-cols-3 gap-2">
                        {TIME_SLOTS.map(t => (
                          <button
                            key={t}
                            onClick={() => setSelectedTime(t)}
                            className={`py-2.5 rounded-xl text-sm font-medium transition-all ${
                              selectedTime === t
                                ? 'bg-brand text-white shadow-md'
                                : 'bg-gray-50 text-gray-700 hover:bg-brand/10 border border-gray-100'
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Price summary */}
                {selectedDay && selectedTime && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4 bg-brand/5 border border-brand/10 rounded-xl px-4 py-3 text-sm"
                  >
                    <div className="flex justify-between text-gray-600 mb-1">
                      <span>{service.title}</span>
                      <span className="font-semibold text-brand">₹{service.price.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="text-xs text-gray-400">
                      {selectedDay.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })} · {selectedTime} · {service.duration}
                    </div>
                  </motion.div>
                )}

                <button
                  disabled={!selectedDay || !selectedTime}
                  onClick={handleAddToCart}
                  className="mt-4 w-full rounded-full bg-brand py-3.5 text-white font-semibold text-sm disabled:opacity-35 disabled:cursor-not-allowed hover:opacity-90 active:scale-[0.98] transition-all"
                >
                  {selectedDay && selectedTime ? 'Add to Cart →' : 'Select a Date & Time'}
                </button>

                <p className="text-center text-xs text-gray-400 mt-3">
                  Review & checkout from your cart · No payment now
                </p>
              </div>
            </div>

            {/* View Cart shortcut */}
            <Link
              href="/cart"
              className="mt-3 flex items-center justify-center gap-2 text-sm text-brand hover:underline"
            >
              🛒 View Cart
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export async function getStaticPaths() {
  return {
    paths: allServices.map(s => ({ params: { slug: s.slug } })),
    fallback: true,
  }
}

export async function getStaticProps({ params }) {
  const service = allServices.find(s => s.slug === params.slug) || null
  if (!service) return { notFound: true }
  return { props: {} }
}
