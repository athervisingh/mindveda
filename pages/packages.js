import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { motion, AnimatePresence } from 'framer-motion'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useAuth } from '../context/AuthContext'
import { orderedAllServices } from '../lib/siteContent'
import { CheckIcon, CalendarIcon, ClockIcon, ArrowRightIcon, ArrowLeftIcon, LotusIcon } from '../components/Icons'

const PACKAGE_TIERS = [
  { sessions: 4,  discount: 301,  label: 'Starter',   popular: false },
  { sessions: 8,  discount: 701,  label: 'Growth',    popular: true  },
  { sessions: 12, discount: 1001, label: 'Transform', popular: false },
]

const BOOKABLE = orderedAllServices.filter(
  s => !['anxiety-support-group', 'employee-assistance-program'].includes(s.slug)
)

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
  if (!t) return ''
  const [h, m] = t.split(':')
  const hr = parseInt(h)
  return `${hr % 12 || 12}:${m} ${hr < 12 ? 'AM' : 'PM'}`
}

const DAYS = getNext14Days()

function Spinner() {
  return (
    <svg className="w-8 h-8 animate-spin text-brand" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
    </svg>
  )
}

export default function Packages() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()

  const [step, setStep]               = useState(1)
  const [service, setService]         = useState(null)
  const [pkg, setPkg]                 = useState(null)
  const [pickedSlots, setPickedSlots] = useState([])
  const [sessionIdx, setSessionIdx]   = useState(0)

  const [selectedDay,  setSelectedDay]  = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)
  const [slots,        setSlots]        = useState([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [slotsError,   setSlotsError]   = useState(null)

  useEffect(() => {
    if (!authLoading && !user) router.replace('/login?redirect=/packages')
  }, [authLoading, user])

  function resetPicker() {
    setSelectedDay(null)
    setSelectedTime(null)
    setSlots([])
    setSlotsError(null)
  }

  async function loadSlots(day) {
    setSelectedDay(day)
    setSelectedTime(null)
    setSlots([])
    setSlotsError(null)
    setLoadingSlots(true)
    const dateStr = day.toISOString().split('T')[0]
    try {
      const res  = await fetch(`/api/availability?date=${dateStr}&serviceSlug=${service.slug}`)
      const data = await res.json()
      if (!res.ok) {
        setSlotsError(data.error || 'Failed to load slots.')
      } else {
        const takenThisDay = pickedSlots.filter(s => s.date === dateStr).map(s => s.time)
        setSlots((data.slots || []).map(sl =>
          takenThisDay.includes(sl.time) ? { ...sl, available: false, taken: true } : sl
        ))
      }
    } catch {
      setSlotsError('Network error. Please try again.')
    }
    setLoadingSlots(false)
  }

  function confirmSlot() {
    if (!selectedDay || !selectedTime) return
    const dateStr = selectedDay.toISOString().split('T')[0]
    const newPicked = [...pickedSlots, {
      date:        dateStr,
      time:        selectedTime,
      dateDisplay: selectedDay.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'long' }),
      timeDisplay: fmt12(selectedTime),
    }]
    setPickedSlots(newPicked)

    if (sessionIdx + 1 < pkg.sessions) {
      setSessionIdx(i => i + 1)
      resetPicker()
    } else {
      setStep(4)
    }
  }

  function addToCart() {
    const existing = JSON.parse(localStorage.getItem('mv_cart') || '[]')
    const ts = Date.now()
    pickedSlots.forEach((slot, i) => {
      existing.push({
        cartId:             `pkg_${ts}_${i}`,
        id:                 service.id,
        type:               'service',
        slug:               service.slug,
        title:              service.title,
        price:              service.price,
        duration:           service.duration,
        serviceSlug:        service.slug,
        bookingDate:        slot.date,
        bookingTime:        slot.time,
        bookingDateDisplay: slot.dateDisplay,
        bookingTimeDisplay: slot.timeDisplay,
      })
    })
    localStorage.setItem('mv_cart', JSON.stringify(existing))
    localStorage.setItem('mv_package_discount', JSON.stringify({
      amount:   pkg.discount,
      label:    `${pkg.sessions}-Session ${pkg.label} Bundle`,
      sessions: pkg.sessions,
    }))
    window.dispatchEvent(new Event('cartUpdated'))
    router.push('/cart')
  }

  function goBackFromSlots() {
    if (sessionIdx === 0) {
      setStep(2)
      setPickedSlots([])
      resetPicker()
    } else {
      setSessionIdx(i => i - 1)
      setPickedSlots(s => s.slice(0, -1))
      resetPicker()
    }
  }

  const total      = service && pkg ? service.price * pkg.sessions : 0
  const finalTotal = total - (pkg?.discount || 0)

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex flex-col bg-[#fbfaf7]">
        <Header />
        <main className="flex-1 flex items-center justify-center"><Spinner /></main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfaf7] text-gray-900">
      <Header />

      <main className="flex-1 w-full px-6 py-10">

        {/* Heading */}
        <div className="mb-8 text-center">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-brand/10 text-brand text-xs font-semibold tracking-wider uppercase mb-3">
            Bundle &amp; Save
          </span>
          <h1 className="text-3xl font-bold text-[#1a3520]">Session Packages</h1>
          <p className="text-gray-500 mt-2 text-sm">
            Book 4, 8, or 12 sessions together and save more on every package.
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {['Service', 'Package', 'Slots', 'Review'].map((label, i) => {
            const n    = i + 1
            const done = step > n
            const active = step === n
            return (
              <div key={n} className="flex items-center gap-2">
                <div className={`flex items-center gap-1.5 ${active ? 'text-brand' : done ? 'text-green-600' : 'text-gray-300'}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                    done   ? 'bg-green-500 border-green-500 text-white' :
                    active ? 'bg-brand border-brand text-white' :
                             'bg-white border-gray-200 text-gray-300'
                  }`}>
                    {done ? <CheckIcon className="w-3.5 h-3.5" /> : n}
                  </div>
                  <span className={`hidden sm:block text-xs font-medium`}>{label}</span>
                </div>
                {i < 3 && <div className={`w-8 h-0.5 ${step > n ? 'bg-green-400' : 'bg-gray-200'}`} />}
              </div>
            )
          })}
        </div>

        <AnimatePresence mode="wait">

          {/* ──────── STEP 1: Choose Service ──────── */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-lg font-semibold text-[#1a3520] mb-4">Choose a Service</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {BOOKABLE.map(s => (
                  <button
                    key={s.slug}
                    onClick={() => { setService(s); setStep(2) }}
                    className={`text-left p-4 rounded-2xl border-2 transition-all hover:border-brand/50 hover:bg-brand/5 ${
                      service?.slug === s.slug ? 'border-brand bg-brand/5' : 'border-gray-100 bg-white'
                    }`}
                  >
                    <div className="flex flex-col gap-2">
                      <p className="font-semibold text-[#1a3520] text-sm leading-snug">{s.title}</p>
                      <p className="text-xs text-gray-400">{s.duration} · {s.category}</p>
                      <p className="text-brand font-bold text-base">₹{s.price.toLocaleString('en-IN')}<span className="text-gray-400 font-normal text-xs ml-1">/session</span></p>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* ──────── STEP 2: Choose Package ──────── */}
          {step === 2 && service && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="flex items-center gap-2 mb-1">
                <button onClick={() => setStep(1)} className="text-gray-400 hover:text-brand transition-colors">
                  <ArrowLeftIcon className="w-4 h-4" />
                </button>
                <h2 className="text-lg font-semibold text-[#1a3520]">Choose Your Package</h2>
              </div>
              <p className="text-sm text-gray-500 mb-6 ml-6">
                {service.title} — ₹{service.price.toLocaleString('en-IN')} / session
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {PACKAGE_TIERS.map(tier => {
                  const subtotal = service.price * tier.sessions
                  const final    = subtotal - tier.discount
                  return (
                    <button
                      key={tier.sessions}
                      onClick={() => {
                        setPkg(tier)
                        setPickedSlots([])
                        setSessionIdx(0)
                        resetPicker()
                        setStep(3)
                      }}
                      className={`relative text-left p-5 rounded-3xl border-2 transition-all hover:scale-[1.02] hover:shadow-md ${
                        tier.popular
                          ? 'border-brand bg-brand/5 shadow-sm'
                          : 'border-gray-100 bg-white hover:border-brand/40'
                      }`}
                    >
                      {tier.popular && (
                        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand text-white text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap">
                          ⭐ Most Popular
                        </span>
                      )}

                      <p className="text-4xl font-black text-[#1a3520] leading-none">{tier.sessions}</p>
                      <p className="text-sm text-gray-500 mt-0.5 mb-4">sessions</p>

                      <p className="text-xs text-gray-400 line-through">₹{subtotal.toLocaleString('en-IN')}</p>
                      <p className="text-xl font-bold text-brand">₹{final.toLocaleString('en-IN')}</p>

                      <div className="mt-3 inline-flex items-center gap-1 bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                        <CheckIcon className="w-3 h-3" /> Save ₹{tier.discount}
                      </div>

                      <p className="text-xs text-gray-400 mt-3">{tier.label} Bundle</p>
                    </button>
                  )
                })}
              </div>
            </motion.div>
          )}

          {/* ──────── STEP 3: Pick Slots ──────── */}
          {step === 3 && service && pkg && (
            <motion.div
              key={`step3_${sessionIdx}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="flex items-center gap-2 mb-5">
                <button onClick={goBackFromSlots} className="text-gray-400 hover:text-brand transition-colors">
                  <ArrowLeftIcon className="w-4 h-4" />
                </button>
                <div>
                  <h2 className="text-lg font-semibold text-[#1a3520]">
                    Session {sessionIdx + 1} of {pkg.sessions}
                  </h2>
                  <p className="text-xs text-gray-500">{service.title} · Pick a slot</p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="flex gap-1.5 mb-5">
                {Array.from({ length: pkg.sessions }).map((_, i) => (
                  <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${
                    i < sessionIdx ? 'bg-green-500' : i === sessionIdx ? 'bg-brand' : 'bg-gray-200'
                  }`} />
                ))}
              </div>

              {/* Already confirmed sessions */}
              {pickedSlots.length > 0 && (
                <div className="mb-5 space-y-1.5 bg-green-50 border border-green-100 rounded-2xl p-3">
                  {pickedSlots.map((s, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-gray-600">
                      <CheckIcon className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                      <span className="font-medium">Session {i + 1}:</span>
                      <span>{s.dateDisplay}, {s.timeDisplay}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Date picker */}
              <p className="text-sm font-semibold text-gray-700 mb-3">Select Date</p>
              <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
                {DAYS.map((d, i) => {
                  const isSelected = selectedDay?.toDateString() === d.toDateString()
                  return (
                    <button
                      key={i}
                      onClick={() => loadSlots(d)}
                      className={`flex-shrink-0 w-14 rounded-2xl py-3 flex flex-col items-center transition-all ${
                        isSelected ? 'bg-brand text-white shadow-md' : 'bg-gray-50 hover:bg-brand/10 text-gray-700'
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

              {/* Time slots */}
              <AnimatePresence>
                {selectedDay && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="overflow-hidden mt-5"
                  >
                    <p className="text-sm font-semibold text-gray-700 mb-3">
                      Available Times —{' '}
                      <span className="font-normal text-gray-500">
                        {selectedDay.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
                      </span>
                    </p>

                    {loadingSlots ? (
                      <div className="grid grid-cols-3 gap-2">
                        {[1,2,3,4,5,6].map(i => <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />)}
                      </div>
                    ) : slotsError ? (
                      <p className="text-red-400 text-sm py-4 text-center">{slotsError}</p>
                    ) : slots.length === 0 ? (
                      <p className="text-gray-400 text-sm py-4 text-center">No slots available. Try another date.</p>
                    ) : (
                      <div className="grid grid-cols-3 gap-2">
                        {slots.map(slot => {
                          const isSel = selectedTime === slot.time
                          return (
                            <button
                              key={slot.time}
                              disabled={!slot.available}
                              onClick={() => setSelectedTime(slot.time)}
                              className={`py-3 px-2 rounded-xl text-center transition-all border ${
                                !slot.available
                                  ? 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed'
                                  : isSel
                                    ? 'bg-brand text-white border-brand shadow-md'
                                    : 'bg-gray-50 text-gray-700 border-gray-100 hover:border-brand/50 hover:bg-brand/5'
                              }`}
                            >
                              <p className="text-sm font-semibold">{fmt12(slot.time)}</p>
                              {!slot.available && (
                                <p className="text-[10px] mt-0.5">
                                  {slot.taken ? 'Already picked' : 'Booked'}
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

              <button
                disabled={!selectedDay || !selectedTime}
                onClick={confirmSlot}
                className="mt-6 w-full rounded-full bg-brand py-4 text-white font-semibold text-sm disabled:opacity-35 disabled:cursor-not-allowed hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                {sessionIdx + 1 < pkg.sessions
                  ? <>Confirm &amp; Pick Session {sessionIdx + 2} <ArrowRightIcon className="w-4 h-4" /></>
                  : <>Confirm Last Session <ArrowRightIcon className="w-4 h-4" /></>
                }
              </button>
            </motion.div>
          )}

          {/* ──────── STEP 4: Review ──────── */}
          {step === 4 && service && pkg && (
            <motion.div key="step4" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}>
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Header */}
                <div className="bg-[#1a3520] px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                      <LotusIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-white/60 text-xs uppercase tracking-wider">Package Ready</p>
                      <h2 className="text-white font-semibold text-lg">{service.title}</h2>
                    </div>
                  </div>
                </div>

                {/* Sessions list */}
                <div className="p-6">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
                    Your {pkg.sessions} Sessions
                  </p>
                  <div className="space-y-0">
                    {pickedSlots.map((slot, i) => (
                      <div key={i} className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0">
                        <div className="w-7 h-7 rounded-full bg-brand/10 text-brand text-xs font-bold flex items-center justify-center flex-shrink-0">
                          {i + 1}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">Session {i + 1}</p>
                          <div className="flex gap-3 mt-0.5 flex-wrap">
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <CalendarIcon className="w-3 h-3" /> {slot.dateDisplay}
                            </span>
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <ClockIcon className="w-3 h-3" /> {slot.timeDisplay}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pricing + CTA */}
                <div className="px-6 pb-6">
                  <div className="bg-gray-50 rounded-2xl p-4 space-y-2.5 text-sm mb-5">
                    <div className="flex justify-between text-gray-600">
                      <span>{pkg.sessions} sessions × ₹{service.price.toLocaleString('en-IN')}</span>
                      <span>₹{total.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-green-600 font-medium">
                      <span>{pkg.label} Bundle Discount</span>
                      <span>−₹{pkg.discount.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between font-bold text-[#1a3520] pt-2 border-t border-gray-200">
                      <span>Total Payable</span>
                      <span className="text-brand text-lg">₹{finalTotal.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <button
                    onClick={addToCart}
                    className="w-full rounded-full bg-brand py-4 text-white font-semibold text-sm hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                  >
                    Add to Cart &amp; Checkout <ArrowRightIcon className="w-4 h-4" />
                  </button>
                  <p className="text-center text-xs text-gray-400 mt-3">
                    Review your cart before payment
                  </p>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      <Footer />
    </div>
  )
}
