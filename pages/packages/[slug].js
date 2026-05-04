import { useRouter } from 'next/router'
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
      icon: '🧠',
      price: pkg.price,
      duration: pkg.duration,
      bookingDate: selectedDay.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
      bookingTime: selectedTime,
    })
    localStorage.setItem('mv_cart', JSON.stringify(cart))
    window.dispatchEvent(new Event('cartUpdated'))
    router.push('/cart')
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfaf7]">
      <Header />
      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="max-w-5xl mx-auto px-6 pt-6">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-brand">Home</Link>
            <span>/</span>
            <Link href="/packages" className="hover:text-brand">Packages</Link>
            <span>/</span>
            <span className="text-gray-800 font-medium">{pkg.title}</span>
          </nav>
        </div>

        <section className="max-w-5xl mx-auto px-6 py-10">
          <div className="grid lg:grid-cols-[1fr_380px] gap-8 items-start">
            {/* Left — Package Details */}
            <div>
              <div className="inline-flex rounded-full bg-brand/10 px-3 py-1 text-xs font-medium text-brand mb-4">
                {pkg.featured ? '⭐ Most Popular Package' : 'Healing Package'}
              </div>
              <h1 className="text-4xl md:text-5xl font-semibold leading-tight text-[#2d2343]">{pkg.title}</h1>
              <p className="mt-4 text-gray-600 leading-8">{pkg.excerpt}</p>

              <div className="mt-8 grid grid-cols-2 gap-4 max-w-md">
                <div className="rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
                  <div className="text-xs uppercase tracking-[0.2em] text-gray-400">Price</div>
                  <div className="mt-2 text-3xl font-semibold text-brand">₹{pkg.price.toLocaleString('en-IN')}</div>
                  <div className="text-xs text-gray-400 mt-1">per session</div>
                </div>
                <div className="rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
                  <div className="text-xs uppercase tracking-[0.2em] text-gray-400">Duration</div>
                  <div className="mt-2 text-2xl font-semibold text-[#2d2343]">{pkg.duration}</div>
                  <div className="text-xs text-gray-400 mt-1">per session</div>
                </div>
              </div>

              <div className="mt-8 rounded-[28px] bg-white p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold text-[#2d2343]">What's Included</h2>
                <ul className="mt-4 space-y-3 text-sm text-gray-600">
                  {[
                    'Initial assessment and personalised support plan',
                    'Secure session booking with calendar reminders',
                    'Session notes and progress tracking',
                    'Flexible rescheduling up to 24 hours before',
                    'Follow-up resources between sessions',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="text-brand mt-0.5 flex-shrink-0">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* How it works */}
              <div className="mt-6 grid grid-cols-3 gap-4">
                {[
                  ['1. Discover', 'Pick the right package.'],
                  ['2. Book a Slot', 'Add to cart with your chosen time.'],
                  ['3. Start Healing', 'Checkout and join your session.'],
                ].map(([title, desc]) => (
                  <div key={title} className="rounded-2xl bg-white p-4 shadow-sm border border-gray-100 text-center">
                    <p className="text-sm font-semibold text-[#2d2343]">{title}</p>
                    <p className="mt-1.5 text-xs text-gray-500 leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Slot Picker */}
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
                          className={`flex-shrink-0 w-14 rounded-2xl py-3 flex flex-col items-center transition-all ${
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
                          {TIME_SLOTS.map((t) => (
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
                        <span>{pkg.title}</span>
                        <span className="font-semibold text-brand">₹{pkg.price.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="text-xs text-gray-400">
                        {selectedDay.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })} · {selectedTime} · {pkg.duration}
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

              <Link href="/cart" className="mt-3 flex items-center justify-center gap-2 text-sm text-brand hover:underline">
                🛒 View Cart
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
