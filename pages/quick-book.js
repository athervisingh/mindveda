import Header from '../components/Header'
import Footer from '../components/Footer'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabaseClient'
import { allServices } from '../lib/siteContent'
import { CheckIcon } from '../components/Icons'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

const BOOKABLE = allServices.filter(s => s.slug !== 'anxiety-support-group')

const QUICK_CHAT_SERVICE = {
  slug: 'quick-chat',
  title: '⚡ Chat + Voice Call Bundle — First-time only',
  price: 99,
  duration: '5 min chat + 10 min call',
  isChat: true,
}

const ALL_SERVICES = [QUICK_CHAT_SERVICE, ...BOOKABLE]

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

function fmt12(t) {
  const [h, m] = t.split(':')
  const hr = parseInt(h)
  return `${hr % 12 || 12}:${m} ${hr < 12 ? 'AM' : 'PM'}`
}

function loadRazorpay() {
  return new Promise(resolve => {
    if (window.Razorpay) return resolve(true)
    const s = document.createElement('script')
    s.src = 'https://checkout.razorpay.com/v1/checkout.js'
    s.onload = () => resolve(true)
    s.onerror = () => resolve(false)
    document.body.appendChild(s)
  })
}

export default function QuickBook() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const days = getNext14Days()

  const [form, setForm]                 = useState({ name: '', email: '', phone: '' })
  const [serviceSlug, setServiceSlug]   = useState('quick-chat')
  const [selectedDay, setSelectedDay]   = useState(null)
  const [slots, setSlots]               = useState([])
  const [selectedTime, setSelectedTime] = useState(null)
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [slotsError, setSlotsError]     = useState('')
  const [paying, setPaying]             = useState(false)
  const [paid, setPaid]                 = useState(false)
  const [error, setError]               = useState('')
  const [isFirstTime, setIsFirstTime]   = useState(null)
  const [couponInput, setCouponInput]   = useState('')
  const [couponCode, setCouponCode]     = useState('')
  const [couponStatus, setCouponStatus] = useState(null) // null | 'loading' | 'valid' | 'invalid'
  const [couponFlatPrice, setCouponFlatPrice] = useState(0)
  const [couponError, setCouponError]   = useState('')

  const availableServices = isFirstTime === false ? BOOKABLE : ALL_SERVICES
  const service = availableServices.find(s => s.slug === serviceSlug)
  const isChat  = serviceSlug === 'quick-chat'

  useEffect(() => {
    if (!authLoading && !user) router.replace('/login?redirect=/quick-book')
  }, [authLoading, user])

  // Check if first-time user (no prior confirmed bookings)
  useEffect(() => {
    if (!user) return
    supabase
      .from('bookings')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('status', 'confirmed')
      .then(({ count }) => {
        const first = (count || 0) === 0
        setIsFirstTime(first)
        if (!first) setServiceSlug(BOOKABLE[0]?.slug || '')
      })
  }, [user])

  useEffect(() => {
    if (user) setForm(f => ({ ...f, email: user.email || '', name: user.user_metadata?.full_name || '' }))
  }, [user])

  useEffect(() => {
    setSelectedTime(null)
    setSlots([])
    setSlotsError('')
    if (isChat || !selectedDay || !serviceSlug) return
    setLoadingSlots(true)
    const dateStr = selectedDay.toISOString().split('T')[0]
    fetch(`/api/availability?date=${dateStr}&serviceSlug=${serviceSlug}`)
      .then(r => r.json())
      .then(d => { setSlots(d.slots || []); if (!d.slots?.length) setSlotsError('No slots for this date.') })
      .catch(() => setSlotsError('Failed to load slots.'))
      .finally(() => setLoadingSlots(false))
  }, [selectedDay, serviceSlug])

  async function handlePay() {
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) { setError('Please fill all fields.'); return }
    if (!/^[6-9]\d{9}$/.test(form.phone)) { setError('Enter a valid 10-digit mobile number.'); return }
    if (!isChat && (!selectedDay || !selectedTime)) { setError('Please select a date and time slot.'); return }
    setError('')
    setPaying(true)

    try {
      const ok = await loadRazorpay()
      if (!ok) throw new Error('Razorpay failed to load.')

      // ── QUICK CHAT FLOW ──────────────────────────────────────────
      if (isChat) {
        const orderRes = await fetch('/api/chat/create-order', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id, couponCode: couponStatus === 'valid' ? couponCode : undefined }),
        })
        const orderData = await orderRes.json()
        if (!orderRes.ok) throw new Error(orderData.error || 'Could not create order.')

        let sessionId = null
        await new Promise((resolve, reject) => {
          const rzp = new window.Razorpay({
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            amount: orderData.amount, currency: 'INR',
            name: 'Mind Veda', description: '5-Minute Wellness Chat',
            order_id: orderData.orderId,
            prefill: { name: form.name, email: form.email, contact: form.phone },
            theme: { color: '#1a3520' },
            handler: async response => {
              try {
                const vRes = await fetch('/api/chat/verify-order', {
                  method: 'POST', headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,
                    bookingId: orderData.bookingId,
                    userId: user.id,
                  }),
                })
                const vData = await vRes.json()
                if (!vRes.ok) throw new Error(vData.error)
                sessionId = vData.sessionId
                resolve()
              } catch (e) { reject(e) }
            },
            modal: { ondismiss: () => reject(new Error('Payment cancelled')) },
          })
          rzp.open()
        })
        router.push(`/chat/${sessionId}`)
        return
      }

      // ── REGULAR BOOKING FLOW ─────────────────────────────────────
      const orderRes = await fetch('/api/payments/create-order', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: [{ serviceSlug, bookingDate: selectedDay.toISOString().split('T')[0], bookingTime: selectedTime }],
          userId: user.id, couponCode: effectiveCouponCode,
        }),
      })
      const orderData = await orderRes.json()
      if (!orderRes.ok) throw new Error(orderData.error || 'Could not create order.')

      await new Promise((resolve, reject) => {
        const rzp = new window.Razorpay({
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: orderData.amount, currency: 'INR',
          name: 'Mind Veda', description: service.title,
          order_id: orderData.orderId,
          prefill: { name: form.name, email: form.email, contact: form.phone },
          theme: { color: '#1a3520' },
          handler: async response => {
            try {
              const vRes = await fetch('/api/payments/verify', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  bookingIds: orderData.bookingIds,
                  phone: form.phone,
                }),
              })
              const vData = await vRes.json()
              if (!vRes.ok) throw new Error(vData.error)
              resolve(vData.chatSessionId || null)
            } catch (e) { reject(e) }
          },
          modal: { ondismiss: () => reject(new Error('Payment cancelled')) },
        })
        rzp.open()
      }).then(chatSessionId => {
        if (chatSessionId) router.push(`/chat/${chatSessionId}`)
        else setPaid(true)
      })
    } catch (e) {
      if (e.message !== 'Payment cancelled') setError(e.message || 'Payment failed. Please try again.')
    } finally { setPaying(false) }
  }

  // ── Loading / auth guard ──────────────────────────────────────
  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex flex-col bg-[#fbfaf7]">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <svg className="w-8 h-8 animate-spin text-brand" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
        </main>
        <Footer />
      </div>
    )
  }

  // ── Success screen (regular bookings only) ────────────────────
  if (paid) {
    return (
      <div className="min-h-screen flex flex-col bg-[#fbfaf7]">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4 py-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 sm:p-10 max-w-sm w-full text-center"
          >
            <motion.div
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5 text-green-600"
            >
              <CheckIcon className="w-8 h-8" />
            </motion.div>
            <h2 className="text-2xl font-semibold text-[#1a3520] mb-2">Session Booked!</h2>
            <p className="text-gray-500 text-sm mb-1"><strong>{service.title}</strong> — booking confirmed</p>
            <p className="text-gray-400 text-xs mb-7">
              Confirmation sent to {form.email}.<br />
              Babita will share the session link before your appointment.
            </p>
            <div className="flex gap-3">
              <Link href="/services" className="flex-1 text-center rounded-full border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 hover:border-brand hover:text-brand transition-all">
                Browse More
              </Link>
              <Link href="/dashboard" className="flex-1 text-center rounded-full bg-brand px-4 py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity">
                My Bookings
              </Link>
            </div>
          </motion.div>
        </main>
        <Footer />
      </div>
    )
  }

  const canPay = form.name.trim() && form.email.trim() && /^[6-9]\d{9}$/.test(form.phone) &&
    (isChat || (selectedDay && selectedTime))

  const autoFirst10  = isFirstTime === true && !isChat && couponStatus !== 'valid'
  const effectiveCouponCode  = couponStatus === 'valid' ? couponCode : (autoFirst10 ? 'FIRST10' : null)
  const effectiveFlatPriceRs = couponStatus === 'valid' ? Math.round(couponFlatPrice / 100) : (autoFirst10 ? 99 : null)
  const chatBasePrice = 99
  const displayTotal = isChat
    ? (couponStatus === 'valid' ? Math.round(couponFlatPrice / 100) : chatBasePrice)
    : (effectiveFlatPriceRs !== null ? effectiveFlatPriceRs : (service?.price || 0))

  async function handleCouponApply() {
    const code = couponInput.trim()
    if (!code || !user) return
    setCouponStatus('loading')
    setCouponError('')
    try {
      const res = await fetch('/api/payments/validate-coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ couponCode: code, userId: user.id }),
      })
      const data = await res.json()
      if (res.ok && data.valid) {
        setCouponCode(code.toUpperCase())
        setCouponStatus('valid')
        setCouponFlatPrice(data.flat_price)
      } else {
        setCouponStatus('invalid')
        setCouponError(data.error || 'Invalid coupon code')
      }
    } catch {
      setCouponStatus('invalid')
      setCouponError('Could not apply coupon. Try again.')
    }
  }

  function handleCouponRemove() {
    setCouponInput('')
    setCouponCode('')
    setCouponStatus(null)
    setCouponFlatPrice(0)
    setCouponError('')
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfaf7] text-gray-900">
      <Header />

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 xl:px-8 py-6 sm:py-10 pb-28 xl:pb-10">

        {/* Page heading */}
        <div className="mb-6 sm:mb-8">
          {isFirstTime && (
            <span className="inline-flex items-center gap-1.5 bg-[#f5a623]/15 text-[#8a6914] text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider mb-2">
              🎁 First-Time Offer
            </span>
          )}
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-[#1a3520]">
            {isFirstTime ? 'Quick Book — ₹99 Session' : 'Book a Session'}
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-1">
            {isFirstTime
              ? 'Pick a service and pay just ₹99 — coupon applied automatically'
              : 'Select a service, choose your slot, and confirm your booking'}
          </p>
        </div>

        <div className="grid xl:grid-cols-[1fr_340px] gap-5 xl:gap-7 items-start">

          {/* LEFT COLUMN */}
          <div className="space-y-4 sm:space-y-5 min-w-0">

            {/* Your Details */}
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm p-4 sm:p-6">
              <h2 className="text-sm sm:text-base font-semibold text-[#1a3520] mb-3 sm:mb-4">Your Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Full Name</label>
                  <input
                    type="text" value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="e.g. Priya Sharma"
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Mobile Number</label>
                  <input
                    type="tel" value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    placeholder="10-digit mobile"
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Email Address</label>
                  <input
                    type="email" value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="you@example.com"
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Choose Service */}
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm p-4 sm:p-6">
              <h2 className="text-sm sm:text-base font-semibold text-[#1a3520] mb-3 sm:mb-4">Choose Service</h2>
              <div className="relative">
                <select
                  value={serviceSlug}
                  onChange={e => { setServiceSlug(e.target.value); setSelectedDay(null) }}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all bg-white appearance-none pr-10 text-gray-800"
                >
                  {availableServices.map(s => (
                    <option key={s.slug} value={s.slug}>
                      {s.slug === 'quick-chat'
                        ? '⚡ Chat + Voice Call — ₹99 (5 min AI + 10 min Babita)'
                        : `${s.title} — ₹${s.price.toLocaleString('en-IN')} / session`}
                    </option>
                  ))}
                </select>
                <svg className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6"/>
                </svg>
              </div>

              {/* Quick Chat info banner */}
              {isChat && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                  className="mt-3 bg-[#1a3520]/5 border border-[#1a3520]/10 rounded-2xl px-4 py-3 flex items-start gap-3"
                >
                  <span className="text-xl mt-0.5">💬</span>
                  <div>
                    <p className="text-xs font-semibold text-[#1a3520]">Instant — no scheduling needed</p>
                    <p className="text-xs text-gray-500 mt-0.5">Pay ₹99 → 5-min AI chat + 10-min voice call with Babita included · No extra payment</p>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Date Picker — hidden for quick-chat */}
            {!isChat && (
              <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm p-4 sm:p-6">
                <h2 className="text-sm sm:text-base font-semibold text-[#1a3520] mb-3 sm:mb-4">Pick a Date</h2>
                <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
                  {days.map((d, i) => {
                    const isSel = selectedDay?.toDateString() === d.toDateString()
                    return (
                      <button
                        key={i} onClick={() => setSelectedDay(d)}
                        className={`flex-shrink-0 w-[52px] sm:w-14 rounded-2xl py-3 flex flex-col items-center transition-all ${
                          isSel ? 'bg-[#1a3520] text-white shadow-md' : 'bg-gray-50 hover:bg-[#1a3520]/10 text-gray-700'
                        }`}
                      >
                        <span className="text-[9px] sm:text-[10px] font-medium opacity-80">
                          {d.toLocaleDateString('en-IN', { weekday: 'short' })}
                        </span>
                        <span className="text-sm sm:text-base font-bold mt-0.5">{d.getDate()}</span>
                        <span className="text-[9px] sm:text-[10px] opacity-70">
                          {d.toLocaleDateString('en-IN', { month: 'short' })}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Time Slots — hidden for quick-chat */}
            {!isChat && (
              <AnimatePresence>
                {selectedDay && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm p-4 sm:p-6"
                  >
                    <h2 className="text-sm sm:text-base font-semibold text-[#1a3520]">Available Times</h2>
                    <p className="text-xs text-gray-400 mt-0.5 mb-3 sm:mb-4">
                      {selectedDay.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </p>

                    {loadingSlots ? (
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {[1,2,3,4,5,6].map(i => <div key={i} className="h-12 sm:h-14 bg-gray-100 rounded-xl animate-pulse" />)}
                      </div>
                    ) : slotsError ? (
                      <p className="text-gray-400 text-sm text-center py-6">{slotsError}</p>
                    ) : slots.length === 0 ? (
                      <p className="text-gray-400 text-sm text-center py-6">No slots available. Try another date.</p>
                    ) : (
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {slots.map(slot => {
                          const isSel = selectedTime === slot.time
                          return (
                            <button
                              key={slot.time} disabled={!slot.available}
                              onClick={() => setSelectedTime(slot.time)}
                              className={`py-3 px-1 rounded-xl text-center text-xs sm:text-sm font-medium border transition-all ${
                                !slot.available
                                  ? 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed'
                                  : isSel
                                    ? 'bg-[#1a3520] text-white border-[#1a3520] shadow-md'
                                    : 'bg-gray-50 text-gray-700 border-gray-100 hover:border-[#1a3520]/50 hover:bg-[#1a3520]/5'
                              }`}
                            >
                              {fmt12(slot.time)}
                              {!slot.available && <div className="text-[9px] text-gray-300 mt-0.5">Booked</div>}
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            )}

            {error && (
              <div className="xl:hidden text-sm text-red-500 bg-red-50 border border-red-100 rounded-2xl px-4 py-3">
                {error}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN */}
          <div className="hidden xl:block sticky top-24 min-w-0">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="bg-[#1a3520] px-6 py-4">
                <h2 className="text-white font-semibold text-lg">Order Summary</h2>
              </div>
              <div className="p-5 space-y-4">

                {isChat ? (
                  <div className="flex items-center gap-3 bg-[#1a3520]/5 border border-[#1a3520]/10 rounded-2xl px-4 py-3">
                    <span className="text-2xl">💬</span>
                    <div>
                      <p className="text-xs font-semibold text-[#1a3520]">Quick Chat — 5 min Instant</p>
                      <p className="text-[11px] text-gray-500">AI wellness guide · No scheduling</p>
                    </div>
                  </div>
                ) : autoFirst10 ? (
                  <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-2xl px-4 py-3">
                    <CheckIcon className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-green-700">FIRST10 auto-applied</p>
                      <p className="text-[11px] text-green-600">First-time discount · New customers only</p>
                    </div>
                  </div>
                ) : null}

                {/* Service + price */}
                <div className="space-y-2 text-sm">
                  {isChat ? (
                    <>
                      <div className="flex justify-between text-gray-500">
                        <span>Chat + Voice Call Bundle</span>
                        {couponStatus === 'valid' ? (
                          <span className="flex items-center gap-1.5">
                            <span className="line-through text-gray-300 text-xs">₹99</span>
                            <span className="font-semibold text-green-600">₹{displayTotal}</span>
                          </span>
                        ) : (
                          <span className="font-semibold text-[#1a3520]">₹99</span>
                        )}
                      </div>
                      {couponStatus === 'valid' && (
                        <div className="flex justify-between text-green-600 font-medium">
                          <span>Discount ({couponCode})</span>
                          <span>−₹{chatBasePrice - displayTotal}</span>
                        </div>
                      )}
                    </>
                  ) : effectiveFlatPriceRs !== null ? (
                    <>
                      <div className="flex justify-between text-gray-500">
                        <span className="truncate pr-2">{service.title}</span>
                        <span className="line-through text-gray-300 flex-shrink-0">₹{service.price.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between text-green-600 font-medium">
                        <span>Discount ({effectiveCouponCode})</span>
                        <span>−₹{(service.price - effectiveFlatPriceRs).toLocaleString('en-IN')}</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex justify-between text-gray-500">
                      <span className="truncate pr-2">{service.title}</span>
                      <span className="font-semibold text-[#1a3520]">₹{service.price.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                </div>

                {/* Coupon Input */}
                <div className="border-t border-gray-100 pt-3">
                  {couponStatus === 'valid' ? (
                    <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <CheckIcon className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-semibold text-green-700">{couponCode} applied!</p>
                          <p className="text-[11px] text-green-600">
                            You save ₹{isChat ? chatBasePrice - displayTotal : (service.price - effectiveFlatPriceRs).toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>
                      <button onClick={handleCouponRemove} className="text-xs text-gray-400 hover:text-red-500 transition-colors ml-2">Remove</button>
                    </div>
                  ) : (
                    <>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={couponInput}
                          onChange={e => { setCouponInput(e.target.value.toUpperCase()); setCouponError('') }}
                          onKeyDown={e => e.key === 'Enter' && handleCouponApply()}
                          placeholder="Coupon code"
                          className={`flex-1 border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3520]/20 focus:border-[#1a3520] transition-all uppercase tracking-widest ${couponError ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                        />
                        <button
                          onClick={handleCouponApply}
                          disabled={!couponInput.trim() || couponStatus === 'loading'}
                          className="rounded-xl bg-[#1a3520]/10 text-[#1a3520] px-3 py-2 text-sm font-semibold hover:bg-[#1a3520] hover:text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
                        >
                          {couponStatus === 'loading' ? (
                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                            </svg>
                          ) : 'Apply'}
                        </button>
                      </div>
                      {couponError && <p className="text-red-500 text-xs mt-1.5">{couponError}</p>}
                    </>
                  )}
                </div>

                {/* Slot summary (regular only) */}
                {!isChat && (selectedDay || selectedTime) && (
                  <div className="bg-gray-50 rounded-2xl px-4 py-3 text-xs text-gray-500 space-y-1.5">
                    {selectedDay && (
                      <div className="flex items-center gap-2">
                        <svg className="w-3.5 h-3.5 text-brand flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
                        </svg>
                        {selectedDay.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    )}
                    {selectedTime && (
                      <div className="flex items-center gap-2">
                        <svg className="w-3.5 h-3.5 text-brand flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
                        </svg>
                        {fmt12(selectedTime)} IST · {service.duration}
                      </div>
                    )}
                  </div>
                )}

                {/* Total */}
                <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-[#1a3520]">
                  <span>Total</span>
                  <span className="text-2xl text-brand">₹{displayTotal.toLocaleString('en-IN')}</span>
                </div>

                {error && (
                  <div className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-2.5">
                    {error}
                  </div>
                )}

                <button
                  onClick={handlePay} disabled={!canPay || paying}
                  className="w-full rounded-full bg-brand py-4 text-white font-semibold text-sm hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {paying ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                      </svg>
                      {isChat ? 'Opening chat…' : 'Processing…'}
                    </>
                  ) : (
                    <>
                      {isChat ? '💬 Start Session — ₹99' : `Pay ₹${displayTotal.toLocaleString('en-IN')} — Book Now`}
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </>
                  )}
                </button>

                <div className="space-y-1.5 text-xs text-gray-400">
                  {[
                    '100% confidential sessions',
                    'Secure payment via Razorpay',
                    ...(autoFirst10 ? ['One-time offer · New customers only'] : []),
                  ].map(t => (
                    <div key={t} className="flex items-center gap-1.5">
                      <CheckIcon className="w-3.5 h-3.5 text-green-500 flex-shrink-0" /> {t}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* STICKY BOTTOM BAR — mobile */}
      <div className="xl:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 px-4 py-3 shadow-2xl">
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-400 truncate">{isChat ? 'Chat + Voice Call Bundle' : service.title}</p>
            <div className="flex items-baseline gap-2 mt-0.5">
              {!isChat && effectiveFlatPriceRs !== null && <span className="line-through text-gray-300 text-xs">₹{service.price.toLocaleString('en-IN')}</span>}
              <span className="text-lg font-bold text-[#1a3520]">₹{displayTotal.toLocaleString('en-IN')}</span>
              {!isChat && effectiveCouponCode && <span className="text-[10px] text-green-600 font-semibold">{effectiveCouponCode}</span>}
            </div>
          </div>
          <button
            onClick={handlePay} disabled={!canPay || paying}
            className="flex-shrink-0 rounded-full bg-brand text-white font-semibold px-6 py-3 text-sm hover:opacity-90 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {paying ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Processing…
              </>
            ) : (
              <>
                {isChat ? '💬 Start — ₹99' : `Pay ₹${displayTotal.toLocaleString('en-IN')}`}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </>
            )}
          </button>
        </div>
      </div>

      <Footer />
    </div>
  )
}
