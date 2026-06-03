import Header from '../../components/Header'
import Footer from '../../components/Footer'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckIcon, RetreatActivityIcon, MapPinIcon } from '../../components/Icons'
import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { NextSeo } from 'next-seo'

function getNext60Days() {
  const days = []
  const today = new Date()
  for (let i = 3; i <= 90; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    days.push(d)
  }
  return days
}

const ITINERARY = [
  {
    day: 'Day 1',
    tag: 'Arrival',
    color: '#1a3520',
    activities: [
      { time: '12 PM – 5 PM',   icon: 'bell',        title: 'Check-in & Sacred Welcome',           desc: 'Registration with Retreat Essentials Kit' },
      { time: '5:30 – 6:00 PM', icon: 'tea',         title: 'High Tea',                             desc: null },
      { time: '6:00 – 7:00 PM', icon: 'namaste',     title: 'Orientation Session',                 desc: 'The story behind this retreat — what to expect & why' },
      { time: '7:30 – 8:30 PM', icon: 'bowl',        title: 'Sattvic Dinner',                       desc: null },
      { time: '9:00 – 9:30 PM', icon: 'soundwaves',  title: 'Sound Healing Session',               desc: 'End your first evening in pure stillness', highlight: true },
      { time: '10:00 PM',       icon: 'moon',        title: 'Rest',                                 desc: null },
    ],
  },
  {
    day: 'Day 2',
    tag: 'Immersion',
    color: '#2d4f3a',
    activities: [
      { time: '5:00 AM',          icon: 'conch',      title: 'Wake up to Holy Conch Sounds',         desc: null },
      { time: '5:15 AM',          icon: 'herb',       title: 'Morning Detox Drink',                  desc: null },
      { time: '6:00 – 7:00 AM',   icon: 'yoga',       title: 'Indoor / Outdoor Yoga',               desc: null },
      { time: '7:00 – 7:30 AM',   icon: 'sun',        title: 'Surya Tratak',                         desc: null },
      { time: '7:30 – 8:00 AM',   icon: 'wave',       title: 'Ganga Snan',                           desc: null, highlight: true },
      { time: '8:00 – 8:30 AM',   icon: 'bowl',       title: 'Sattvic Breakfast on the banks of Ganga', desc: 'Sprouts, fruits & herbal drink' },
      { time: '10:00 – 11:00 AM', icon: 'mic',        title: 'Special Lecture 1',                   desc: 'Lifestyle & Corporate Problems — What It\'s Doing to You' },
      { time: '11:30 – 12:30 PM', icon: 'mic',        title: 'Special Lecture 2',                   desc: 'How to Eat, What to Eat, When to Eat' },
      { time: '1:00 – 2:00 PM',   icon: 'rest',       title: 'Lunch & Rest',                         desc: null },
      { time: '3:00 – 5:00 PM',   icon: 'mind',       title: 'Yoga Nidra & Antar Mouna',             desc: 'Deep guided meditation & inner silence', highlight: true },
      { time: '5:30 – 8:00 PM',   icon: 'diya',       title: 'Ganga Aarti',                          desc: null, highlight: true },
      { time: '8:30 – 9:30 PM',   icon: 'bowl',       title: 'Dinner',                               desc: null },
      { time: '10:00 PM',         icon: 'moon',       title: 'Rest',                                 desc: null },
    ],
  },
  {
    day: 'Day 3',
    tag: 'Farewell',
    color: '#4a3520',
    activities: [
      { time: '5:00 AM',          icon: 'conch',      title: 'Wake up to Holy Conch Sounds',         desc: null },
      { time: '5:15 AM',          icon: 'herb',       title: 'Morning Detox Drink',                  desc: null },
      { time: '6:00 – 7:30 AM',   icon: 'yoga',       title: 'Indoor Yoga / Kriya Yoga / Karma Yoga', desc: null },
      { time: '8:00 AM',          icon: 'flame',      title: 'Vedic Agnihotra — Fire Ceremony',      desc: null, highlight: true },
      { time: '9:00 – 9:45 AM',   icon: 'bowl',       title: 'Sattvic Breakfast',                    desc: null },
      { time: '10:00 – 11:00 AM', icon: 'mic',        title: 'Guest Lecture',                        desc: 'De-stressing & Detox' },
      { time: '11:00 AM – 12 PM', icon: 'chat',       title: 'Q&A Session',                          desc: null },
      { time: '1:00 – 2:00 PM',   icon: 'rest',       title: 'Lunch & Rest',                         desc: null },
      { time: '3:00 – 5:00 PM',   icon: 'mala',       title: 'Mantra / Chakra Healing & Meditation', desc: null, highlight: true },
      { time: '5:30 PM',          icon: 'namaste',    title: 'Farewell',                             desc: null },
    ],
  },
]

const PACKAGES = [
  {
    id: 'quad-sharing',
    label: '4 SHARING ROOM',
    subtitle: '1 Room (4 Beds)',
    Icon: QuadIcon,
    originalPrice: 12500,
    price: 10000,
    soldOut: true,
    features: ['4 Sharing Room', 'Sattvic Meals', 'All Retreat Sessions', 'Temple Visits', 'Nature Activities', 'Ganga Aarti'],
  },
  {
    id: 'twin-sharing',
    label: 'TWIN SHARING ROOM',
    subtitle: '1 Room (2 Beds)',
    Icon: BedIcon,
    originalPrice: 18750,
    price: 15000,
    features: ['Twin Sharing Room', 'Sattvic Meals', 'All Retreat Sessions', 'Temple Visits', 'Nature Activities', 'Ganga Aarti'],
  },
  {
    id: 'single-stay',
    label: 'SINGLE STAY',
    subtitle: 'Private Room',
    Icon: PersonIcon,
    originalPrice: 22500,
    price: 18000,
    features: ['Private Room', 'Sattvic Meals', 'All Retreat Sessions', 'Temple Visits', 'Nature Activities', 'Ganga Aarti'],
  },
]

function QuadIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 96 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="11" r="6"/>
      <path d="M3 44c0-8 4-13 9-13s9 5 9 13"/>
      <circle cx="36" cy="11" r="6"/>
      <path d="M27 44c0-8 4-13 9-13s9 5 9 13"/>
      <circle cx="60" cy="11" r="6"/>
      <path d="M51 44c0-8 4-13 9-13s9 5 9 13"/>
      <circle cx="84" cy="11" r="6"/>
      <path d="M75 44c0-8 4-13 9-13s9 5 9 13"/>
    </svg>
  )
}

function GroupIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 72 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="13" r="6"/>
      <path d="M1 44c0-9 5-14 11-14s11 5 11 14"/>
      <circle cx="60" cy="13" r="6"/>
      <path d="M49 44c0-9 5-14 11-14s11 5 11 14"/>
      <circle cx="36" cy="10" r="7.5"/>
      <path d="M22 44c0-10 6-16 14-16s14 6 14 16"/>
    </svg>
  )
}

function BedIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 80 56" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 36V16a4 4 0 014-4h60a4 4 0 014 4v20"/>
      <rect x="4" y="36" width="72" height="12" rx="3"/>
      <rect x="12" y="20" width="22" height="10" rx="2.5"/>
      <rect x="46" y="20" width="22" height="10" rx="2.5"/>
      <path d="M6 48v5M74 48v5"/>
      <path d="M4 36h72"/>
    </svg>
  )
}

function PersonIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 56 72" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="28" cy="18" r="13"/>
      <path d="M4 68c0-14 11-24 24-24s24 10 24 24"/>
    </svg>
  )
}

const PROPERTY_SECTIONS = [
  {
    title: 'Your Private Suite',
    image: '/r1.webp',
    imgW: 1376, imgH: 768,
    position: 'left',
    paragraphs: [
      'Experience refined comfort in our elegantly designed suites, where modern luxury meets a peaceful retreat. Spacious interiors, soothing natural light, and stylish décor create a warm and relaxing atmosphere for an unforgettable stay.',
      'Each suite features a plush king-size bed with premium linens, thoughtfully selected amenities, and contemporary touches crafted for complete comfort. Whether you are unwinding indoors or enjoying the serene views outside, every moment is designed to feel effortless and special.',
      'From personalized hospitality to carefully curated refreshments, every detail is arranged to provide a relaxing and memorable experience throughout your stay.',
    ],
  },
  {
    title: 'Rest & Rejuvenate',
    image: '/r2.webp',
    imgW: 1376, imgH: 768,
    position: 'right',
    paragraphs: [
      "Get a full night's rest, wake up to birds chirping, grab a book from your personal library and be engulfed in a tranquil atmosphere, with exceptional hospitality.",
      "Each of our spacious spa-suites have an integral, private spa area or treatment room, from where you can indulge in unlimited therapies. Studies have shown that getting good sleep immediately after your therapies allows a much longer term effect — our suites have been built to offer a calm and relaxing space for you to continue to rejuvenate following your treatments.",
      "Beyond your in-suite spa, your balcony overlooks the pool, is shaded by foliage and is positioned so you can take in delightful river views.",
    ],
  },
  {
    title: 'Mindful Design',
    image: '/r3.webp',
    imgW: 1376, imgH: 768,
    position: 'left',
    paragraphs: [
      'MindVeda has a minimalist and eco-friendly design to resonate with your mind. To keep your doshas in balance, and to propagate sattva guna, our property has been made with uncluttered open spaces that instil a feeling of peace and relaxation.',
      "The entire property's wood is handcrafted teak made by local artisans, with handpicked art and decor. Being a boutique property allows us to give our guests personalised care & attention.",
      'For treatments that require heavy oil, we have provisioned a rooftop spa right above your suite — our spa-to-suite ratio ensures we leave no stone unturned in giving you the comfort & privacy you need.',
    ],
  },
  {
    title: 'Nature & Tranquility',
    image: '/r4.webp',
    imgW: 1376, imgH: 768,
    position: 'right',
    paragraphs: [
      'Surrounded by lush greenery, fresh air, and peaceful surroundings, this tranquil retreat offers the perfect escape from the rush of everyday life. Every corner is thoughtfully designed to create a sense of calm, comfort, and connection with nature.',
      'Wake up to soft sunlight, gentle breezes, and the soothing sounds of nature that make each moment feel refreshing and unforgettable. The serene atmosphere allows you to slow down, relax completely, and embrace a more peaceful way of living.',
      'Whether you seek quiet reflection, wellness experiences, or simple relaxation, the retreat provides inviting spaces to unwind and reconnect with yourself. Blending natural beauty with modern comfort, every stay is designed to leave you feeling renewed and refreshed.',
    ],
  },
]

function loadRazorpay() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true)
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

function RetreatBookingModal({ isOpen, onClose, pkg }) {
  const { user } = useAuth()
  const days = getNext60Days()
  const [checkIn, setCheckIn] = useState(null)
  const [form, setForm] = useState({ name: '', email: '', phone: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [couponInput, setCouponInput]   = useState('')
  const [couponCode, setCouponCode]     = useState('')
  const [couponStatus, setCouponStatus] = useState(null)
  const [couponFlatPrice, setCouponFlatPrice] = useState(0)
  const [couponError, setCouponError]   = useState('')

  useEffect(() => {
    if (!isOpen) {
      setCheckIn(null); setForm({ name: '', email: '', phone: '' }); setErrors({}); setDone(false)
      setCouponInput(''); setCouponCode(''); setCouponStatus(null); setCouponFlatPrice(0); setCouponError('')
    }
  }, [isOpen])

  const displayPrice = couponStatus === 'valid' ? Math.round(couponFlatPrice / 100) : pkg?.price

  async function handleCouponApply() {
    const code = couponInput.trim()
    if (!code) return
    setCouponStatus('loading')
    setCouponError('')
    try {
      const res = await fetch('/api/payments/validate-coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ couponCode: code, userId: user?.id || 'guest' }),
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
    setCouponInput(''); setCouponCode(''); setCouponStatus(null); setCouponFlatPrice(0); setCouponError('')
  }

  useEffect(() => {
    if (user?.email) {
      setForm(f => ({ ...f, email: user.email, name: user.user_metadata?.full_name || '' }))
    }
  }, [user, isOpen])

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    if (isOpen) {
      document.addEventListener('keydown', onKey)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  function validate() {
    const e = {}
    if (!checkIn) e.checkIn = 'Please select a check-in date'
    if (!form.name.trim()) e.name = 'Required'
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required'
    if (!form.phone.trim() || !/^[6-9]\d{9}$/.test(form.phone)) e.phone = 'Valid 10-digit mobile required'
    return e
  }

  async function handlePay() {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setErrors({})
    setLoading(true)

    const checkInDate  = checkIn.toISOString().split('T')[0]
    const checkOutObj  = new Date(checkIn); checkOutObj.setDate(checkOutObj.getDate() + 2)
    const checkOutDate = checkOutObj.toISOString().split('T')[0]

    try {
      const ok = await loadRazorpay()
      if (!ok) throw new Error('Razorpay load failed. Check your internet.')

      const orderRes = await fetch('/api/retreat/create-order', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageId:  pkg.id,
          checkInDate,
          name:       form.name,
          email:      form.email,
          phone:      form.phone,
          couponCode: couponStatus === 'valid' ? couponCode : undefined,
          userId:     user?.id || null,
        }),
      })
      const orderData = await orderRes.json()
      if (!orderRes.ok) throw new Error(orderData.error || 'Order creation failed')

      await new Promise((resolve, reject) => {
        const rzp = new window.Razorpay({
          key:         process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount:      orderData.amount,
          currency:    'INR',
          name:        'Mind Veda',
          description: `Retreat — ${pkg.label}`,
          order_id:    orderData.orderId,
          prefill:     { name: form.name, email: form.email, contact: form.phone },
          theme:       { color: '#1a3520' },
          handler: async (response) => {
            try {
              const verifyRes = await fetch('/api/retreat/verify', {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  razorpay_order_id:   response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature:  response.razorpay_signature,
                  packageId:    pkg.id,
                  packageLabel: pkg.label,
                  price:        pkg.price,
                  checkInDate,
                  checkOutDate,
                  name:   form.name,
                  email:  form.email,
                  phone:  form.phone,
                  userId: user?.id || null,
                }),
              })
              const verifyData = await verifyRes.json()
              if (!verifyRes.ok) throw new Error(verifyData.error)
              resolve()
            } catch (err) { reject(err) }
          },
          modal: { ondismiss: () => reject(new Error('Payment cancelled')) },
        })
        rzp.open()
      })

      localStorage.setItem('mv_has_purchased', '1')
      setDone(true)
    } catch (err) {
      if (err.message !== 'Payment cancelled') {
        alert(err.message || 'Payment failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen || !pkg) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 24 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="bg-[#1a3520] px-6 py-5 flex items-start justify-between flex-shrink-0">
              <div>
                <p className="text-white/60 text-xs uppercase tracking-widest mb-1">Booking Retreat</p>
                <h3 className="text-white font-semibold text-xl">{pkg.label}</h3>
                <div className="flex items-center gap-2 mt-1.5 text-sm">
                  <span className="font-bold text-white text-lg">₹{pkg.price.toLocaleString('en-IN')}</span>
                  <span className="text-white/40">·</span>
                  <span className="line-through text-white/40 text-xs">₹{pkg.originalPrice.toLocaleString('en-IN')}</span>
                  <span className="text-white/60 text-xs">per person</span>
                </div>
              </div>
              <button onClick={onClose} className="text-white/60 hover:text-white text-3xl leading-none ml-4 mt-0.5 transition-colors">×</button>
            </div>

            {done ? (
              <div className="p-8 text-center flex-1 flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <CheckIcon className="w-8 h-8 text-green-600" />
                </div>
                <h4 className="text-xl font-semibold text-[#1a3520] mb-2">Booking Confirmed!</h4>
                <p className="text-gray-500 text-sm mb-1">
                  A confirmation has been sent to <span className="font-medium text-gray-700">{form.email}</span>.
                </p>
                <p className="text-gray-500 text-sm mb-6">Babita will share the itinerary and arrival details before your retreat date.</p>
                <p className="text-gray-400 text-xs mb-6">WhatsApp: <b className="text-gray-600">+91 79809 25582</b></p>
                <button onClick={onClose} className="rounded-full bg-[#1a3520] text-white px-8 py-3 text-sm font-semibold hover:opacity-90 transition-opacity">
                  Done
                </button>
              </div>
            ) : (
              <div className="overflow-y-auto flex-1 p-5">
                {/* Check-in date */}
                <p className="text-sm font-semibold text-gray-700 mb-1">Select Check-in Date <span className="text-red-400">*</span></p>
                <p className="text-xs text-gray-400 mb-3">3-day / 2-night retreat · Check-out is Day 3</p>
                <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
                  {days.map((d, i) => {
                    const isSelected = checkIn?.toDateString() === d.toDateString()
                    return (
                      <button
                        key={i}
                        onClick={() => { setCheckIn(d); setErrors(p => ({ ...p, checkIn: undefined })) }}
                        className={`flex-shrink-0 w-14 rounded-2xl py-3 flex flex-col items-center transition-all ${
                          isSelected ? 'bg-[#1a3520] text-white shadow-md' : 'bg-gray-50 hover:bg-[#1a3520]/10 text-gray-700'
                        }`}
                      >
                        <span className="text-xs font-medium opacity-80">{d.toLocaleDateString('en-IN', { weekday: 'short' })}</span>
                        <span className="text-base font-bold mt-0.5">{d.getDate()}</span>
                        <span className="text-xs opacity-70">{d.toLocaleDateString('en-IN', { month: 'short' })}</span>
                      </button>
                    )
                  })}
                </div>
                {errors.checkIn && <p className="text-red-500 text-xs mt-1">{errors.checkIn}</p>}

                {checkIn && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-3 bg-[#edf6ef] rounded-xl px-4 py-3 text-sm text-[#1a3520]"
                  >
                    <span className="font-semibold">Check-in:</span>{' '}
                    {checkIn.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    <span className="text-gray-500 mx-2">→</span>
                    <span className="font-semibold">Check-out:</span>{' '}
                    {(() => { const d = new Date(checkIn); d.setDate(d.getDate() + 2); return d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' }) })()}
                  </motion.div>
                )}

                {/* Contact form */}
                <div className="mt-5 space-y-3.5">
                  <p className="text-sm font-semibold text-gray-700">Your Details</p>
                  {[
                    { field: 'name',  label: 'Full Name',      type: 'text',  placeholder: 'e.g. Priya Sharma' },
                    { field: 'email', label: 'Email Address',  type: 'email', placeholder: 'you@example.com' },
                    { field: 'phone', label: 'Mobile Number',  type: 'tel',   placeholder: '10-digit mobile number' },
                  ].map(({ field, label, type, placeholder }) => (
                    <div key={field}>
                      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
                      <input
                        type={type}
                        value={form[field]}
                        onChange={e => setForm(p => ({ ...p, [field]: e.target.value }))}
                        placeholder={placeholder}
                        className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3520]/20 focus:border-[#1a3520] transition-all ${errors[field] ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                      />
                      {errors[field] && <p className="text-red-500 text-xs mt-1">{errors[field]}</p>}
                    </div>
                  ))}
                </div>

                {/* Coupon Input */}
                <div className="mt-5 border-t border-gray-100 pt-4">
                  {couponStatus === 'valid' ? (
                    <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-3 py-2.5 mb-4">
                      <div className="flex items-center gap-2">
                        <CheckIcon className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-semibold text-green-700">{couponCode} applied!</p>
                          <p className="text-[11px] text-green-600">You save ₹{(pkg.price - displayPrice).toLocaleString('en-IN')}</p>
                        </div>
                      </div>
                      <button onClick={handleCouponRemove} className="text-xs text-gray-400 hover:text-red-500 transition-colors ml-2">Remove</button>
                    </div>
                  ) : (
                    <div className="mb-4">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={couponInput}
                          onChange={e => { setCouponInput(e.target.value.toUpperCase()); setCouponError('') }}
                          onKeyDown={e => e.key === 'Enter' && handleCouponApply()}
                          placeholder="Coupon code (optional)"
                          className={`flex-1 border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3520]/20 focus:border-[#1a3520] uppercase tracking-widest transition-all ${couponError ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                        />
                        <button
                          onClick={handleCouponApply}
                          disabled={!couponInput.trim() || couponStatus === 'loading'}
                          className="rounded-xl bg-[#1a3520]/10 text-[#1a3520] px-4 py-2 text-sm font-semibold hover:bg-[#1a3520] hover:text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
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
                    </div>
                  )}
                </div>

                <button
                  onClick={handlePay}
                  disabled={loading}
                  className="w-full rounded-full bg-[#1a3520] py-4 text-white font-semibold text-sm disabled:opacity-60 disabled:cursor-not-allowed hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                      </svg>
                      Processing…
                    </>
                  ) : (
                    <span className="flex items-center gap-2">
                      {couponStatus === 'valid' && <span className="line-through text-white/40 text-xs">₹{pkg.price.toLocaleString('en-IN')}</span>}
                      Pay ₹{displayPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                </button>
                <p className="text-center text-xs text-gray-400 mt-3">Secure payment via Razorpay</p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function ItinerarySection() {
  const [activeDay, setActiveDay] = useState(0)
  const day = ITINERARY[activeDay]

  return (
    <section className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-6">

        {/* Heading */}
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
          <p className="text-brand text-xs uppercase tracking-[0.24em] font-semibold mb-2">3 Days · 2 Nights</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-[#1a3520]">Your Day-by-Day Journey</h2>
          <p className="mt-2 text-gray-400 text-sm">Every moment of your retreat, thoughtfully planned</p>
        </motion.div>

        {/* Day Tabs */}
        <div className="flex gap-3 justify-center mb-8 flex-wrap">
          {ITINERARY.map((d, i) => (
            <button
              key={i}
              onClick={() => setActiveDay(i)}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all border ${
                activeDay === i
                  ? 'bg-[#1a3520] text-white border-[#1a3520] shadow-md'
                  : 'bg-white text-gray-500 border-gray-200 hover:border-[#1a3520] hover:text-[#1a3520]'
              }`}
            >
              {d.day}
              <span className={`ml-2 text-xs font-normal ${activeDay === i ? 'text-white/70' : 'text-gray-400'}`}>
                · {d.tag}
              </span>
            </button>
          ))}
        </div>

        {/* Timeline */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeDay}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="rounded-2xl border border-gray-100 overflow-hidden shadow-sm"
          >
            {/* Day header */}
            <div className="bg-[#1a3520] px-6 py-4 flex items-center gap-3">
              <div>
                <p className="text-white font-bold text-lg">{day.day} — {day.tag}</p>
                <p className="text-white/50 text-xs">{day.activities.length} activities · Mind Veda Retreat, Rishikesh</p>
              </div>
            </div>

            {/* Activities */}
            <div className="divide-y divide-gray-50">
              {day.activities.map((act, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-4 px-6 py-4 transition-colors ${
                    act.highlight ? 'bg-[#f5faf5]' : 'bg-white hover:bg-gray-50/60'
                  }`}
                >
                  {/* Time */}
                  <div className="w-28 sm:w-36 flex-shrink-0 pt-0.5">
                    <p className="text-xs text-gray-400 font-mono leading-snug">{act.time}</p>
                  </div>

                  {/* Icon */}
                  <div className="flex-shrink-0 w-7 flex items-center justify-center">
                    <RetreatActivityIcon type={act.icon} className={`w-5 h-5 ${act.highlight ? 'text-[#1a3520]' : 'text-gray-400'}`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold leading-snug ${act.highlight ? 'text-[#1a3520]' : 'text-gray-800'}`}>
                      {act.title}
                    </p>
                    {act.desc && (
                      <p className="text-xs text-gray-400 mt-0.5 italic">{act.desc}</p>
                    )}
                  </div>

                  {/* Highlight pill */}
                  {act.highlight && (
                    <div className="flex-shrink-0 hidden sm:block">
                      <span className="text-[10px] font-semibold bg-[#1a3520]/10 text-[#1a3520] px-2.5 py-1 rounded-full">
                        Highlight
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Day nav dots */}
        <div className="flex justify-center gap-2 mt-5">
          {ITINERARY.map((_, i) => (
            <button key={i} onClick={() => setActiveDay(i)}
              className={`rounded-full transition-all ${activeDay === i ? 'w-6 h-2 bg-[#1a3520]' : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'}`}
            />
          ))}
        </div>

        {/* Important Notes */}
        <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="mt-10 bg-[#fffaf0] border border-[#e8d9a0] rounded-2xl p-6">
          <p className="text-sm font-bold text-[#7a5c14] mb-3 flex items-center gap-2">
            <RetreatActivityIcon type="notes" className="w-4 h-4" /> Important Notes
          </p>
          <ul className="space-y-2">
            {[
              'During Ganga Snan, carry decent full-body covering clothes (females especially) and a body towel.',
              'Carry your own handkerchief, towel, and paper napkins.',
              'During outdoor yoga, bring your own water bottle, hand towel, and suitable clothing.',
              'Less luggage, more comfort — makes the journey a pleasure.',
              'For any queries, feel free to reach out to our team before arrival.',
            ].map((note, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600">
                <span className="text-[#7a5c14] mt-0.5 flex-shrink-0">•</span>
                {note}
              </li>
            ))}
          </ul>
        </motion.div>

      </div>
    </section>
  )
}

export default function Retreat() {
  const [modalPkg, setModalPkg] = useState(null)

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfaf7]">
      <NextSeo
        title="Spiritual Healing Retreat Rishikesh — Yoga, Meditation & Sound Healing | MindVeda"
        description="Join MindVeda's 3-day spiritual healing retreat in Rishikesh. Yoga, Ganga Aarti, sound healing, Yoga Nidra & sattvic meals. Best wellness retreat India 2025. Limited seats — book now."
        canonical="https://www.mindvedabybabita.com/retreat"
        additionalMetaTags={[
          { name: 'keywords', content: 'spiritual retreat india, healing retreat rishikesh, yoga retreat india, meditation retreat rishikesh, wellness retreat india, sound healing retreat, yoga nidra retreat, best retreat india 2025, mental wellness retreat india, rishikesh retreat package, retreat near delhi, yoga retreat delhi, spiritual healing india' },
        ]}
        openGraph={{
          url: 'https://www.mindvedabybabita.com/retreat',
          title: 'Spiritual Healing Retreat Rishikesh — Yoga, Meditation & Sound Healing | MindVeda',
          description: '3-day spiritual retreat in Rishikesh. Yoga, meditation, Ganga Aarti & sound healing. Best wellness retreat India. Limited seats.',
          images: [{ url: 'https://www.mindvedabybabita.com/retreat.webp', width: 1200, height: 630, alt: 'MindVeda Retreat Rishikesh' }],
        }}
      />
      <Header />

      <RetreatBookingModal
        isOpen={!!modalPkg}
        onClose={() => setModalPkg(null)}
        pkg={modalPkg}
      />

      <main className="flex-1">

        {/* ── HERO ── */}
        <section className="flex flex-col md:flex-row min-h-[420px] md:min-h-[560px]">
          <div className="w-full md:w-[32%] bg-gradient-to-br from-[#0d1f12] via-[#1a3520] to-[#2d4f3a] flex items-center px-7 sm:px-10 md:px-8 lg:px-12 py-12 md:py-16 order-2 md:order-1 flex-shrink-0">
            <motion.div initial={{ opacity: 0, x: -28 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 mb-5">
                <span className="w-2 h-2 rounded-full bg-[#c9daa0] animate-pulse" />
                <span className="text-white text-xs font-semibold tracking-widest uppercase">Rishikesh Experience</span>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-white/10 border border-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-full">3 DAYS</span>
                <span className="text-white/40">·</span>
                <span className="bg-white/10 border border-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-full">2 NIGHTS</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4"
                style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
                Spiritual Wellness<br />
                <span className="text-[#c9daa0]">Retreat</span>
              </h1>
              <p className="text-white/70 text-sm italic mb-6" style={{ fontFamily: 'Georgia, serif' }}>
                Where Healing Meets the Himalayas
              </p>
              <div className="flex flex-col gap-2 text-xs text-white/60">
                {['In-Person · Rishikesh, Uttarakhand', 'Group & Individual Sessions', 'All Meals & Accommodation Included'].map(t => (
                  <span key={t} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#c9daa0] flex-shrink-0" />{t}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
          <div className="w-full md:w-[68%] order-1 md:order-2 flex-shrink-0 relative">
            <Image src="/retreat-hero.webp" alt="Spiritual Wellness Retreat Rishikesh" width={1672} height={941} className="w-full h-full object-cover block" priority />
            <div className="hidden md:block absolute inset-y-0 left-0 w-64 bg-gradient-to-r from-[#2d4f3a] via-[#2d4f3a]/50 to-transparent" />
          </div>
        </section>

        {/* ── PRICING ── */}
        <section className="max-w-6xl mx-auto px-6 py-16" id="pricing">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
            <p className="text-brand text-xs uppercase tracking-[0.24em] font-semibold mb-2">Retreat Pricing</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-[#1a3520]">Choose Your Experience</h2>
            <p className="mt-2 text-gray-500 text-sm">All packages include meals, all activities & accommodation</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PACKAGES.map((plan, i) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className={`rounded-3xl shadow-sm border flex flex-col transition-shadow duration-300 ${plan.soldOut ? 'bg-white border-gray-100' : 'bg-white border-gray-100 hover:shadow-lg'}`}
              >
                {plan.soldOut ? (
                  <div className="bg-red-500 px-5 py-1.5 text-xs font-semibold text-white text-center tracking-wide rounded-t-3xl">
                    Fully Booked
                  </div>
                ) : (
                  <div className="bg-[#1a3520] px-5 py-1.5 text-xs font-semibold text-[#c9daa0] text-center tracking-wide rounded-t-3xl flex items-center justify-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#c9daa0] animate-pulse" />
                    Available
                  </div>
                )}
                <div className="p-6 sm:p-8 flex flex-col items-center text-center flex-1">
                  <p className="text-sm font-bold tracking-[0.16em] text-[#1a3520] mb-1">{plan.label}</p>
                  <p className="text-xs text-gray-400 mb-5">{plan.subtitle}</p>
                  <div className="w-full border-t border-gray-100 mb-6" />
                  <div className="mb-6 flex items-center justify-center" style={{ height: '56px' }}>
                    <plan.Icon className={`text-[#7a5c14] ${plan.id === 'single-stay' ? 'w-10 h-14' : plan.id === 'quad-sharing' ? 'w-24 h-10' : 'w-20 h-12'}`} />
                  </div>
                  <p className="text-sm text-gray-400 line-through mb-1">₹{plan.originalPrice.toLocaleString('en-IN')}/-</p>
                  <p className="text-4xl font-bold text-[#1a1a1a] leading-tight mb-1">₹ {plan.price.toLocaleString('en-IN')}/-</p>
                  <p className="text-xs text-gray-400 mb-6">Per Person</p>
                  <ul className="w-full space-y-2.5 text-left mb-6">
                    {plan.features.map((feat) => (
                      <li key={feat} className="flex items-center gap-3 text-sm text-gray-600">
                        <CheckIcon className="w-4 h-4 text-[#7a5c14] flex-shrink-0" />
                        {feat}
                      </li>
                    ))}
                  </ul>
                  {plan.soldOut ? (
                    <div className="mt-auto w-full rounded-full bg-gray-200 py-3.5 text-gray-400 font-semibold text-sm text-center cursor-not-allowed select-none">
                      Fully Booked
                    </div>
                  ) : (
                    <button
                      onClick={() => setModalPkg(plan)}
                      className="mt-auto w-full rounded-full bg-[#1a3520] py-3.5 text-white font-semibold text-sm hover:bg-[#2d4f3a] active:scale-[0.98] transition-all"
                    >
                      Book Now
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
          <p className="text-center text-xs text-gray-400 mt-4">* All prices per person · GST applicable · 3 days / 2 nights</p>
        </section>

        {/* ── TRANSFORMATION STATEMENT ── */}
        <section className="bg-[#fffaf0] border-y border-[#e8d9a0]">
          <div className="max-w-5xl mx-auto px-6 py-14 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
              <p className="text-[#7a5c14] text-sm sm:text-base italic mb-1" style={{ fontFamily: 'Georgia, serif' }}>This is not a trip...</p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#1a3520] mb-6 sm:mb-10">
                It's a <span className="text-[#2d4f3a]">transformation.</span>
              </h2>
              <div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-lg mx-auto">
                {[{ icon: 'yoga', label: 'Heal Within' }, { icon: 'handshake', label: 'Connect Deeply' }, { icon: 'seedling', label: 'Transform Forever' }].map((item, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.12 }} viewport={{ once: true }} className="flex flex-col items-center gap-2">
                    <RetreatActivityIcon type={item.icon} className="w-8 h-8 sm:w-12 sm:h-12 text-[#1a3520]" />
                    <span className="text-xs sm:text-sm font-semibold text-[#1a3520]">{item.label}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── ITINERARY ── */}
        <ItinerarySection />

        {/* ── PROPERTY SECTIONS ── */}
        <section className="py-16">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12 px-6">
            <p className="text-brand text-xs uppercase tracking-[0.24em] font-semibold mb-2">The Experience</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-[#1a3520]">Your Retreat, Your Sanctuary</h2>
          </motion.div>
          <div className="divide-y divide-gray-100">
            {PROPERTY_SECTIONS.map((section, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className={`flex flex-col ${section.position === 'right' ? 'lg:flex-row-reverse' : 'lg:flex-row'}`}
              >
                <div className="w-full lg:w-1/2 flex-shrink-0">
                  <Image src={section.image} alt={section.title} width={section.imgW} height={section.imgH} className="w-full h-auto block" />
                </div>
                <div className="w-full lg:w-1/2 bg-white flex flex-col justify-center px-6 py-8 sm:px-10 sm:py-10 lg:px-12 xl:px-16">
                  <h3
                    className="font-semibold text-[#1a3520] leading-tight mb-4 text-2xl sm:text-3xl"
                    style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
                  >
                    {section.title}
                  </h3>
                  <div className="space-y-3">
                    {section.paragraphs.map((para, i) => (
                      <p key={i} className="text-gray-600 text-sm leading-relaxed">{para}</p>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── WHAT'S INCLUDED ── */}
        <section className="bg-[#edf6ef] py-16">
          <div className="max-w-6xl mx-auto px-6">
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
              <p className="text-brand text-xs uppercase tracking-[0.24em] font-semibold mb-2">Everything Included</p>
              <h2 className="text-2xl sm:text-3xl font-semibold text-[#1a3520]">What's in Your Retreat</h2>
            </motion.div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { icon: 'yoga',       text: 'Yoga & Meditation Sessions' },
                { icon: 'flame',      text: 'Agnihotra Fire Healing' },
                { icon: 'soundwaves', text: 'Sound & Mantra Healing' },
                { icon: 'swim',       text: 'Ganga Snan — Holy Dip' },
                { icon: 'bowl',       text: 'All Sattvic Meals Included' },
                { icon: 'temple',     text: 'Temple Darshan & Sacred Sites' },
                { icon: 'herb',       text: 'Nature Walks & Adventure' },
                { icon: 'mic',        text: 'Expert Lectures & Workshops' },
                { icon: 'namaste',    text: 'Farewell Blessings Ceremony' },
                { icon: 'sleep',      text: 'Accommodation (2 Nights)' },
                { icon: 'mind',       text: 'Chakra & Counseling Sessions' },
                { icon: 'mala',       text: 'Rudraksh Mala Gift' },
              ].map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} viewport={{ once: true }}
                  className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-sm border border-[#c5ddc8]">
                  <RetreatActivityIcon type={item.icon} className="w-5 h-5 flex-shrink-0 text-[#1a3520]" />
                  <span className="text-sm text-gray-700 font-medium">{item.text}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── LOCATION ── */}
        <section className="bg-gradient-to-br from-[#1a3520] to-[#2d4f3a] py-14">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <MapPinIcon className="w-8 h-8 text-[#c9daa0] mx-auto mb-3" />
              <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-white mb-2">Retreat Location</h2>
              <p className="text-[#c9daa0] text-sm sm:text-base font-medium mb-1">Rishikesh, Uttarakhand, India</p>
              <p className="text-white/60 text-xs sm:text-sm">Tehri Farm, Gohri Mafi, Rishikesh — 249205</p>
              <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm text-white/70">
                {['Himalayan Foothills', 'Ganga Riverside', 'Triveni Ghat', 'Sacred Temples Nearby'].map(t => (
                  <span key={t} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#c9daa0]" />{t}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── WHY CHOOSE ── */}
        <section className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <p className="text-brand text-xs uppercase tracking-[0.24em] font-semibold mb-2">Why Choose This Retreat?</p>
              <h2 className="text-2xl sm:text-3xl font-semibold text-[#1a3520] mb-6">An Experience You'll Carry Forever</h2>
              <ul className="space-y-3">
                {[
                  '3 full days of immersive healing in Rishikesh',
                  'Expert-led yoga, counseling & meditation',
                  'Authentic Vedic ceremonies & fire rituals',
                  'Sattvic meals — pure, nourishing, healing',
                  'Small group — personal attention guaranteed',
                  'Post-retreat follow-up support from Babita',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600">
                    <span className="w-5 h-5 rounded-full bg-[#edf6ef] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckIcon className="w-3 h-3 text-brand" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} viewport={{ once: true }}
              className="grid grid-cols-3 gap-4">
              {[
                { v: '3', l: 'Days' },
                { v: '2', l: 'Nights' },
                { v: '12+', l: 'Yrs Experience' },
                { v: '50+', l: 'Past Retreats' },
                { v: '100%', l: 'Vegetarian' },
                { v: '★ 4.9', l: 'Rated' },
              ].map(s => (
                <div key={s.l} className="bg-white rounded-2xl p-4 text-center border border-gray-100 shadow-sm">
                  <div className="text-xl sm:text-2xl font-bold text-[#2d4f3a]">{s.v}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{s.l}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="bg-gradient-to-r from-[#1a3520] to-[#2d4f3a] py-16 md:py-20 text-white">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-4">Ready to transform your life?</h2>
              <p className="text-lg mb-8 text-white/80 max-w-xl mx-auto">
                Limited spots available for our next retreat. Book your place before they fill up.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <button
                  onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                  className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-base font-semibold text-[#1a3520] shadow-lg hover:shadow-xl transition-shadow"
                >
                  View Packages
                </button>
                <a
                  href="tel:+917980925582"
                  className="inline-flex items-center gap-2 rounded-full border-2 border-white/40 px-8 py-4 text-base font-semibold text-white hover:bg-white/10 transition-all"
                >
                  Call Us
                </a>
              </div>
            </motion.div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  )
}
