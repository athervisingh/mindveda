import Header from '../components/Header'
import Footer from '../components/Footer'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { CartIcon, LotusIcon, CalendarIcon, ClockIcon, CheckIcon, ArrowLeftIcon, ArrowRightIcon } from '../components/Icons'

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

export default function Checkout() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [cart, setCart] = useState([])
  const [mounted, setMounted] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [paid, setPaid] = useState(false)
  const [paidEmail, setPaidEmail] = useState('')
  const [couponInput, setCouponInput] = useState('')
  const [couponCode, setCouponCode] = useState('')
  const [couponStatus, setCouponStatus] = useState(null)  // null | 'loading' | 'valid' | 'invalid'
  const [couponError, setCouponError] = useState('')
  const [couponFlatPrice, setCouponFlatPrice] = useState(0) // paise from DB

  useEffect(() => {
    setMounted(true)
    setCart(JSON.parse(localStorage.getItem('mv_cart') || '[]'))
  }, [])

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login?redirect=/checkout')
    }
    if (user?.email) {
      setForm(f => ({
        ...f,
        email: user.email,
        name:  user.user_metadata?.full_name || '',
      }))
    }
  }, [authLoading, user])

  const total = cart.reduce((s, p) => s + (p.price || 0), 0)
  const couponPriceRs = Math.round(couponFlatPrice / 100)
  const discountedTotal = couponStatus === 'valid'
    ? couponPriceRs + cart.slice(1).reduce((s, p) => s + (p.price || 0), 0)
    : total
  const couponSavings = total - discountedTotal

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
    setCouponError('')
    setCouponFlatPrice(0)
  }

  function validate() {
    const e = {}
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
    try {
      const ok = await loadRazorpay()
      if (!ok) throw new Error('Razorpay load failed. Check your internet.')

      // One order for all items
      const orderRes = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.map(item => ({
            serviceSlug: item.serviceSlug || item.slug,
            bookingDate: item.bookingDate,
            bookingTime: item.bookingTime,
          })),
          userId:     user.id,
          couponCode: couponStatus === 'valid' ? couponCode : undefined,
        }),
      })
      const orderData = await orderRes.json()
      if (!orderRes.ok) throw new Error(orderData.error || 'Order creation failed')

      // One Razorpay popup for the full total
      await new Promise((resolve, reject) => {
        const rzp = new window.Razorpay({
          key:         process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount:      orderData.amount,
          currency:    'INR',
          name:        'Mind Veda',
          description: cart.length === 1 ? cart[0].title : `${cart.length} Sessions`,
          order_id:    orderData.orderId,
          prefill:     { name: form.name, email: form.email, contact: form.phone },
          theme:       { color: '#1a3520' },
          handler: async (response) => {
            try {
              const verifyRes = await fetch('/api/payments/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  razorpay_order_id:   response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature:  response.razorpay_signature,
                  bookingIds:          orderData.bookingIds,
                }),
              })
              const verifyData = await verifyRes.json()
              if (!verifyRes.ok) throw new Error(verifyData.error)
              resolve()
            } catch (err) {
              reject(err)
            }
          },
          modal: { ondismiss: () => reject(new Error('Payment cancelled')) },
        })
        rzp.open()
      })

      localStorage.setItem('mv_cart', '[]')
      window.dispatchEvent(new Event('cartUpdated'))
      setPaidEmail(form.email)
      setPaid(true)
    } catch (err) {
      if (err.message !== 'Payment cancelled') {
        alert(err.message || 'Payment failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  if (!mounted || authLoading || !user) {
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

  if (paid) {
    return (
      <div className="min-h-screen flex flex-col bg-[#fbfaf7]">
        <Header />
        <main className="flex-1 flex items-center justify-center px-6 py-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-lg border border-gray-100 p-10 max-w-md w-full text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600"
            >
              <CheckIcon className="w-10 h-10" />
            </motion.div>
            <h2 className="text-3xl font-semibold text-[#1a3520] mb-2">Booking Confirmed!</h2>
            <p className="text-gray-500 mb-2">Your session has been booked successfully.</p>
            <p className="text-gray-500 text-sm mb-8">
              A confirmation email has been sent to{' '}
              <span className="font-medium text-gray-700">{paidEmail}</span>.
              Babita will share the session link before your appointment.
            </p>
            <div className="flex gap-3">
              <Link href="/services" className="flex-1 text-center rounded-full border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 hover:border-brand hover:text-brand transition-all">
                Book More
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

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-[#fbfaf7]">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 text-gray-300 flex items-center justify-center">
              <CartIcon className="w-14 h-14" />
            </div>
            <p className="text-xl font-semibold text-gray-700 mb-4">Your cart is empty</p>
            <Link href="/services" className="text-brand underline">Browse services</Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfaf7] text-gray-900">
      <Header />
      <main className="flex-1 max-w-5xl mx-auto px-6 py-12 w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-[#1a3520]">Checkout</h1>
          <p className="text-gray-500 text-sm mt-1">Review your sessions and complete payment</p>
        </div>


        <div className="grid lg:grid-cols-[1fr_380px] gap-6 items-start">
          <div className="space-y-5">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-[#1a3520] mb-5">Your Details</h2>
              <div className="space-y-4">
                {[
                  { field: 'name', label: 'Full Name', type: 'text', placeholder: 'e.g. Priya Sharma' },
                  { field: 'email', label: 'Email Address', type: 'email', placeholder: 'you@example.com' },
                  { field: 'phone', label: 'Mobile Number', type: 'tel', placeholder: '10-digit mobile' },
                ].map(({ field, label, type, placeholder }) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
                    <input
                      type={type}
                      value={form[field]}
                      onChange={e => setForm(p => ({ ...p, [field]: e.target.value }))}
                      placeholder={placeholder}
                      className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all ${errors[field] ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                    />
                    {errors[field] && <p className="text-red-500 text-xs mt-1">{errors[field]}</p>}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-[#1a3520] mb-4">Your Booked Sessions</h2>
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.cartId} className="flex gap-4 pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                    <div className="w-11 h-11 rounded-xl bg-brand/10 flex items-center justify-center text-brand flex-shrink-0">
                      <LotusIcon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start gap-2">
                        <p className="text-sm font-semibold text-[#1a3520]">{item.title}</p>
                        <span className="text-sm font-bold text-brand">₹{item.price.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        {item.bookingDate && (
                          <span className="flex items-center gap-1 text-xs bg-brand/5 text-brand border border-brand/10 px-2.5 py-1 rounded-full">
                            <CalendarIcon className="w-3 h-3" /> {item.bookingDateDisplay || item.bookingDate}
                          </span>
                        )}
                        {item.bookingTime && (
                          <span className="flex items-center gap-1 text-xs bg-brand/5 text-brand border border-brand/10 px-2.5 py-1 rounded-full">
                            <ClockIcon className="w-3 h-3" /> {item.bookingTimeDisplay || item.bookingTime}
                          </span>
                        )}
                        {item.duration && (
                          <span className="flex items-center gap-1 text-xs bg-gray-50 text-gray-500 border border-gray-200 px-2.5 py-1 rounded-full">
                            <ClockIcon className="w-3 h-3" /> {item.duration}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Link href="/cart" className="flex items-center gap-1 text-sm text-brand hover:underline">
              <ArrowLeftIcon className="w-3.5 h-3.5" /> Edit Cart
            </Link>
          </div>

          <div className="sticky top-24">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="bg-[#1a3520] px-6 py-4">
                <h2 className="text-white font-semibold text-lg">Payment Summary</h2>
              </div>
              <div className="p-5">
                <div className="space-y-2.5 mb-4">
                  {cart.map((item, idx) => (
                    <div key={item.cartId} className="flex justify-between text-sm text-gray-600">
                      <span className="truncate max-w-[180px]">{item.title}</span>
                      {couponStatus === 'valid' && idx === 0 ? (
                        <span className="font-medium ml-2 flex items-center gap-1.5">
                          <span className="line-through text-gray-300 text-xs">₹{item.price.toLocaleString('en-IN')}</span>
                          <span className="text-green-600 font-semibold">₹{couponPriceRs}</span>
                        </span>
                      ) : (
                        <span className="font-medium ml-2">₹{item.price.toLocaleString('en-IN')}</span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Coupon Input */}
                <div className="border-t border-gray-100 pt-3 mb-3">
                  {couponStatus === 'valid' ? (
                    <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <CheckIcon className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-semibold text-green-700">{couponCode} applied!</p>
                          <p className="text-[11px] text-green-600">You save ₹{couponSavings.toLocaleString('en-IN')}</p>
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
                          className={`flex-1 border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all uppercase tracking-widest ${couponError ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                        />
                        <button
                          onClick={handleCouponApply}
                          disabled={!couponInput.trim() || couponStatus === 'loading' || !user}
                          className="rounded-xl bg-brand/10 text-brand px-3 py-2 text-sm font-semibold hover:bg-brand hover:text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
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
                      {!user && <p className="text-xs text-gray-400 mt-1.5">Login to use coupon codes</p>}
                    </>
                  )}
                </div>

                {couponStatus === 'valid' && (
                  <div className="flex justify-between text-sm text-green-600 font-medium mb-2">
                    <span>Discount</span>
                    <span>−₹{couponSavings.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-[#1a3520] mb-5">
                  <span>Total</span>
                  <div className="text-right">
                    {couponStatus === 'valid' && (
                      <div className="line-through text-gray-300 text-sm font-normal">₹{total.toLocaleString('en-IN')}</div>
                    )}
                    <span className="text-brand text-2xl">₹{discountedTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <button
                  onClick={handlePay}
                  disabled={loading}
                  className="w-full rounded-full bg-brand py-4 text-white font-semibold text-sm hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
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
                    <>Pay ₹{discountedTotal.toLocaleString('en-IN')} <ArrowRightIcon className="w-4 h-4" /></>
                  )}
                </button>

                <div className="mt-4 space-y-2 text-xs text-gray-400">
                  {['100% confidential sessions', 'Flexible rescheduling up to 24hrs before', 'Certified psychologists'].map(t => (
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
      <Footer />
    </div>
  )
}
