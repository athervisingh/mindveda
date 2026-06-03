import { useState } from 'react'
import { CheckIcon, InfoIcon, CartIcon, ArrowLeftIcon, ServiceCategoryIcon } from '../../components/Icons'
import { useRouter } from 'next/router'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { allServices } from '../../lib/siteContent'
import { NextSeo } from 'next-seo'

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

function fmt12(time24) {
  if (!time24) return ''
  const [h, m] = time24.split(':')
  const hr = parseInt(h)
  return `${hr % 12 || 12}:${m} ${hr < 12 ? 'AM' : 'PM'}`
}

function SlotPicker({ service, selectedDay, onDaySelect, selectedTime, setSelectedTime, onAddToCart, days, slots, loadingSlots, slotsError }) {
  const selectedSlot = slots.find(s => s.time === selectedTime)

  return (
    <div className="card-anim bg-white rounded-3xl shadow-lg border border-gray-100">
      <div className="bg-[#2d4f3a] px-5 py-4">
        <h2 className="text-white font-semibold text-base sm:text-lg">Pick Your Session Slot</h2>
        <p className="text-white/70 text-xs sm:text-sm mt-0.5">All times in IST · Book your preferred slot</p>
      </div>
      <div className="p-4 sm:p-5">
        {/* Date Picker */}
        <p className="text-sm font-medium text-gray-700 mb-3">Choose a Date</p>
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
          {days.map((d, i) => {
            const isSelected = selectedDay && selectedDay.toDateString() === d.toDateString()
            return (
              <button
                key={i}
                onClick={() => onDaySelect(d)}
                className={`flex-shrink-0 w-14 rounded-2xl py-3 flex flex-col items-center transition-all ${
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
                <span className="text-gray-400 font-normal">
                  {selectedDay.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
                </span>
              </p>
              {loadingSlots ? (
                <div className="grid grid-cols-3 gap-2">
                  {[1,2,3,4,5,6].map(i => <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />)}
                </div>
              ) : slotsError ? (
                <div className="text-center py-6 text-red-400 text-sm">{slotsError}</div>
              ) : slots.length === 0 ? (
                <div className="text-center py-6 text-gray-400 text-sm">No slots available for this date. Ask admin to create slots.</div>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {slots.map(slot => {
                    const isSel = selectedTime === slot.time
                    const isGroup = slot.spotsLeft !== undefined && slot.spotsLeft !== null
                    return (
                      <button
                        key={slot.time}
                        disabled={!slot.available}
                        onClick={() => setSelectedTime(slot.time)}
                        className={`py-3 px-2 rounded-xl text-center transition-all border relative ${
                          !slot.available
                            ? 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed'
                            : isSel
                              ? 'bg-[#2d4f3a] text-white border-[#2d4f3a] shadow-md'
                              : 'bg-gray-50 text-gray-700 border-gray-100 hover:border-[#2d4f3a]/50 hover:bg-[#2d4f3a]/5'
                        }`}
                      >
                        <p className="text-sm font-semibold">{fmt12(slot.time)}</p>
                        {!slot.available && <p className="text-[10px] mt-0.5 text-gray-300">Booked</p>}
                        {slot.available && isGroup && (
                          <p className={`text-[10px] mt-0.5 font-medium ${isSel ? 'text-white/80' : 'text-[#2d4f3a]'}`}>
                            {slot.spotsLeft} left
                          </p>
                        )}
                      </button>
                    )
                  })}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Price summary */}
        {selectedDay && selectedTime && selectedSlot?.available && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 bg-[#2d4f3a]/5 border border-[#2d4f3a]/10 rounded-xl px-4 py-3 text-sm"
          >
            <div className="flex justify-between text-gray-600 mb-1">
              <span className="truncate pr-2">{service.title}</span>
              <span className="font-semibold text-[#2d4f3a] flex-shrink-0">₹{service.price.toLocaleString('en-IN')}</span>
            </div>
            <div className="text-xs text-gray-400">
              {selectedDay.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })} · {fmt12(selectedTime)} · {service.duration}
            </div>
          </motion.div>
        )}

        {/* CTA */}
        <button
          disabled={!selectedDay || !selectedTime || !selectedSlot?.available}
          onClick={onAddToCart}
          className="mt-4 w-full rounded-full bg-[#2d4f3a] py-3.5 text-white font-semibold text-sm disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#1f3829] active:scale-[0.98] transition-all"
        >
          {selectedDay && selectedTime && selectedSlot?.available ? 'Add to Cart' : 'Select a Date & Time'}
        </button>
        <p className="text-center text-xs text-gray-400 mt-3">No payment now · Review in cart</p>
      </div>
    </div>
  )
}

export default function BookingPage({ service }) {
  const router = useRouter()
  const days = getNext14Days()

  const [selectedDay, setSelectedDay] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)
  const [slots, setSlots] = useState([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [slotsError, setSlotsError] = useState(null)

  async function handleDaySelect(day) {
    setSelectedDay(day)
    setSelectedTime(null)
    setSlots([])
    setSlotsError(null)
    setLoadingSlots(true)
    const dateStr = day.toISOString().split('T')[0]
    try {
      const res = await fetch(`/api/availability?date=${dateStr}&serviceSlug=${service.slug}`)
      const data = await res.json()
      if (!res.ok) {
        setSlotsError(data.error || 'Failed to load slots.')
      } else {
        setSlots(data.slots || [])
      }
    } catch {
      setSlotsError('Network error. Please try again.')
    }
    setLoadingSlots(false)
  }

  function handleAddToCart() {
    if (!selectedDay || !selectedTime) return
    const slot = slots.find(s => s.time === selectedTime)
    if (!slot?.available) return

    const dateStr = selectedDay.toISOString().split('T')[0]
    const cart = JSON.parse(localStorage.getItem('mv_cart') || '[]')
    cart.push({
      cartId:             Date.now(),
      id:                 service.id,
      type:               'service',
      slug:               service.slug,
      title:              service.title,
      icon:               service.icon,
      price:              service.price,
      duration:           service.duration,
      serviceSlug:        service.slug,

      bookingDate:        dateStr,
      bookingTime:        selectedTime,
      bookingDateDisplay: selectedDay.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
      bookingTimeDisplay: fmt12(selectedTime),
      spotsLeft:          slot.spotsLeft ?? null,
    })
    localStorage.setItem('mv_cart', JSON.stringify(cart))
    window.dispatchEvent(new Event('cartUpdated'))
    router.push('/cart')
  }

  const selectedSlot = slots.find(s => s.time === selectedTime)

  if (!service) {
    return (
      <div className="min-h-screen flex flex-col bg-[#fbfaf7]">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <p className="text-xl font-semibold text-gray-700 mb-4">Service not found</p>
            <Link href="/services" className="text-[#2d4f3a] underline inline-flex items-center gap-1 text-sm">
              <ArrowLeftIcon className="w-3.5 h-3.5" /> Back to Services
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const slotPickerProps = {
    service, selectedDay, onDaySelect: handleDaySelect,
    selectedTime, setSelectedTime, onAddToCart: handleAddToCart,
    days, slots, loadingSlots, slotsError,
  }

  const pageUrl = `https://www.mindvedabybabita.com/book/${service.slug}`
  return (
    <div className="min-h-screen flex flex-col bg-[#fbfaf7] text-gray-900">
      <NextSeo
        title={`${service.title} Online India — Book Session with Certified Psychologist | MindVeda`}
        description={`Book ${service.title.toLowerCase()} online with certified psychologist Babita. ${service.shortDescription} ₹${service.price.toLocaleString('en-IN')}/session · ${service.duration} · Available across Delhi, Mumbai, Bangalore & all India.`}
        canonical={pageUrl}
        additionalMetaTags={[
          { name: 'keywords', content: `${service.title.toLowerCase()}, ${service.title.toLowerCase()} online india, ${service.title.toLowerCase()} near me, ${service.title.toLowerCase()} delhi, ${service.title.toLowerCase()} mumbai, ${service.title.toLowerCase()} bangalore, book ${service.title.toLowerCase()}, certified psychologist india, online therapy india, mindveda` },
        ]}
        openGraph={{
          url: pageUrl,
          title: `${service.title} Online India — Certified Psychologist | MindVeda`,
          description: `${service.shortDescription} Book online with certified psychologist Babita. Delhi, Mumbai, Bangalore & all India.`,
        }}
      />
      <Header />

      <main className="flex-1 pb-24 lg:pb-0">

        {/* Breadcrumb */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6">
          <nav className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-400 flex-wrap">
            <Link href="/" className="hover:text-[#2d4f3a]">Home</Link>
            <span>/</span>
            <Link href="/services" className="hover:text-[#2d4f3a]">Services</Link>
            <span>/</span>
            <span className="text-gray-700 font-medium truncate max-w-[160px] sm:max-w-none">{service.title}</span>
          </nav>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-5 sm:py-8">
          <div className="flex flex-col lg:grid lg:grid-cols-[1fr_380px] gap-6 lg:gap-8 lg:items-start">

            {/* LEFT — Service Details */}
            <div className="flex flex-col gap-4 sm:gap-5">

              {/* Service header card */}
              <div className={`bg-gradient-to-r ${service.color} rounded-2xl sm:rounded-3xl p-4 sm:p-6 flex gap-4 items-start`}>
                <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl bg-white/70 backdrop-blur-sm flex items-center justify-center text-[#2d4f3a] shadow-sm flex-shrink-0">
                  <ServiceCategoryIcon type={service.icon} className="w-8 h-8 sm:w-12 sm:h-12" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] sm:text-xs font-semibold text-[#2d4f3a] uppercase tracking-wider">{service.category}</span>
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-[#1a3520] mt-0.5 leading-snug">{service.title}</h1>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2">
                    <span className="text-xl sm:text-2xl font-bold text-[#2d4f3a]">₹{service.price.toLocaleString('en-IN')}</span>
                    <span className="text-gray-400 text-xs sm:text-sm">per session</span>
                    <span className="flex items-center gap-1 text-gray-400 text-xs sm:text-sm">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2"/>
                      </svg>
                      {service.duration}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="card-anim bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
                <h2 className="text-base sm:text-lg font-semibold text-[#1a3520] mb-2 sm:mb-3">About This Service</h2>
                <p className="text-gray-500 leading-relaxed text-sm sm:text-base">{service.description}</p>
              </div>

              {/* Benefits + What to Expect */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="card-anim bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
                  <h3 className="text-sm sm:text-base font-semibold text-[#1a3520] mb-3 sm:mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 sm:w-7 sm:h-7 bg-green-100 text-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </span>
                    Key Benefits
                  </h3>
                  <ul className="space-y-2 sm:space-y-2.5">
                    {service.benefits.map((b, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-gray-500">
                        <span className="w-4 h-4 mt-0.5 bg-[#2d4f3a]/10 text-[#2d4f3a] rounded-full flex items-center justify-center flex-shrink-0">
                          <CheckIcon className="w-2.5 h-2.5" />
                        </span>
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="card-anim bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
                  <h3 className="text-sm sm:text-base font-semibold text-[#1a3520] mb-3 sm:mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 sm:w-7 sm:h-7 bg-[#edf5ee] text-[#2d4f3a] rounded-full flex items-center justify-center flex-shrink-0">
                      <InfoIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </span>
                    What to Expect
                  </h3>
                  <ol className="space-y-2 sm:space-y-2.5">
                    {service.whatToExpect.map((w, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-gray-500">
                        <span className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 bg-[#2d4f3a] text-white rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold flex-shrink-0">{i + 1}</span>
                        {w}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap gap-2">
                {['100% Confidential', 'Certified Psychologists', 'Secure Video Sessions', 'Flexible Reschedule'].map(t => (
                  <span key={t} className="flex items-center gap-1.5 text-[10px] sm:text-xs text-gray-500 bg-white border border-gray-200 px-2.5 sm:px-3 py-1.5 rounded-full">
                    <CheckIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-green-500 flex-shrink-0" /> {t}
                  </span>
                ))}
              </div>

              {/* Slot picker — mobile only */}
              <div className="lg:hidden" id="slot-picker">
                <SlotPicker {...slotPickerProps} />
                <Link href="/cart" className="mt-3 flex items-center justify-center gap-2 text-sm text-[#2d4f3a] hover:underline">
                  <CartIcon className="w-4 h-4" /> View Cart
                </Link>
              </div>
            </div>

            {/* RIGHT — Desktop sticky sidebar */}
            <div className="hidden lg:block sticky top-24">
              <SlotPicker {...slotPickerProps} />
              <Link href="/cart" className="mt-3 flex items-center justify-center gap-2 text-sm text-[#2d4f3a] hover:underline">
                <CartIcon className="w-4 h-4" /> View Cart
              </Link>
            </div>

          </div>
        </div>
      </main>

      {/* Mobile sticky bottom bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-sm border-t border-gray-200 px-4 py-3 flex items-center gap-3 shadow-2xl">
        <div className="flex-1 min-w-0">
          <div className="text-[11px] text-gray-400 truncate">
            {selectedDay && selectedTime && selectedSlot?.available
              ? `${selectedDay.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })} · ${fmt12(selectedTime)}`
              : 'Select date & time below'}
          </div>
          <div className="font-bold text-[#1a3520] text-base">₹{service.price.toLocaleString('en-IN')} <span className="text-xs font-normal text-gray-400">/ session</span></div>
        </div>
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => {
            if (selectedDay && selectedTime && selectedSlot?.available) handleAddToCart()
            else document.getElementById('slot-picker')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }}
          className="flex-shrink-0 rounded-full bg-[#2d4f3a] text-white px-5 py-3 text-sm font-semibold shadow-lg hover:bg-[#1f3829] transition-colors"
        >
          {selectedDay && selectedTime && selectedSlot?.available ? 'Add to Cart' : 'Book Now'}
        </motion.button>
      </div>

      <Footer />
    </div>
  )
}

export async function getStaticPaths() {
  return {
    paths: allServices.map(s => ({ params: { slug: s.slug } })),
    fallback: false,
  }
}

export async function getStaticProps({ params }) {
  const service = allServices.find(s => s.slug === params.slug) || null
  if (!service) return { notFound: true }
  return { props: { service } }
}
