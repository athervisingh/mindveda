import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { motion, AnimatePresence } from 'framer-motion'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useAuth } from '../context/AuthContext'
import { NextSeo } from 'next-seo'

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

export default function QuickChat() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [paying, setPaying]             = useState(false)
  const [error, setError]               = useState('')
  const [couponInput, setCouponInput]   = useState('')
  const [couponCode, setCouponCode]     = useState('')
  const [couponStatus, setCouponStatus] = useState(null)
  const [couponFlatPrice, setCouponFlatPrice] = useState(0)
  const [couponError, setCouponError]   = useState('')

  const displayTotal = couponStatus === 'valid' ? Math.round(couponFlatPrice / 100) : 99

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
    setCouponInput(''); setCouponCode(''); setCouponStatus(null); setCouponFlatPrice(0); setCouponError('')
  }

  useEffect(() => {
    if (!authLoading && !user) router.replace('/login?redirect=/quick-chat')
  }, [authLoading, user, router])

  async function handleBook() {
    setError('')
    setPaying(true)
    try {
      const ok = await loadRazorpay()
      if (!ok) throw new Error('Payment gateway failed to load.')

      const orderRes = await fetch('/api/chat/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId:     user.id,
          couponCode: couponStatus === 'valid' ? couponCode : undefined,
        }),
      })
      const orderData = await orderRes.json()
      if (!orderRes.ok) throw new Error(orderData.error || 'Could not create order.')

      await new Promise((resolve, reject) => {
        const rzp = new window.Razorpay({
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: orderData.amount,
          currency: 'INR',
          name: 'Mind Veda',
          description: '5-Minute Wellness Chat',
          order_id: orderData.orderId,
          prefill: {
            name: user.user_metadata?.full_name || '',
            email: user.email || '',
          },
          theme: { color: '#1a3520' },
          handler: async response => {
            try {
              const vRes = await fetch('/api/chat/verify-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
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
              resolve(vData.sessionId)
            } catch (e) { reject(e) }
          },
          modal: { ondismiss: () => reject(new Error('cancelled')) },
        })
        rzp.open()
      }).then(sessionId => {
        localStorage.setItem('mv_has_purchased', '1')
        router.push(`/chat/${sessionId}`)
      })
    } catch (e) {
      if (e.message !== 'cancelled') setError(e.message || 'Payment failed. Please try again.')
    } finally {
      setPaying(false)
    }
  }

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex flex-col bg-[#fbfaf7]">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#1a3520] border-t-transparent rounded-full animate-spin" />
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <>
      <NextSeo title="Quick Chat — Mind Veda" description="5-minute intro chat with our wellness guide for just ₹10." noindex />
      <div className="min-h-screen flex flex-col bg-[#fbfaf7]">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4 py-8 sm:py-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
          >
            {/* Card */}
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
              {/* Header */}
              <div className="bg-[#1a3520] px-5 sm:px-8 py-6 sm:py-8 text-center">
                <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 text-[#f5a623]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h1 className="text-2xl font-semibold text-white">Chat + Voice Call Bundle</h1>
                <p className="text-white/70 text-sm mt-2">5-min AI chat + 10-min call with Babita</p>
              </div>

              {/* Body */}
              <div className="px-5 sm:px-8 py-5 sm:py-7">
                <ul className="space-y-3 mb-7">
                  {[
                    '5-minute private AI chat with Veda',
                    '10-minute voice call with Babita (real counselor)',
                    'Both included — one payment only',
                    'First-time clients only · One-time offer',
                  ].map(f => (
                    <li key={f} className="flex items-start gap-3 text-sm text-gray-600">
                      <span className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>

                <div className="flex items-center justify-between mb-4 py-4 border-y border-gray-100">
                  <span className="text-gray-500 text-sm">Total (chat + voice call)</span>
                  <div className="text-right">
                    {couponStatus === 'valid' && (
                      <span className="line-through text-gray-300 text-sm mr-2">₹99</span>
                    )}
                    <span className="text-2xl font-bold text-[#1a3520]">₹{displayTotal}</span>
                  </div>
                </div>

                {/* Coupon Input */}
                <div className="mb-5">
                  {couponStatus === 'valid' ? (
                    <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        <div>
                          <p className="text-xs font-semibold text-green-700">{couponCode} applied!</p>
                          <p className="text-[11px] text-green-600">You save ₹{99 - displayTotal}</p>
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
                          placeholder="Coupon code (optional)"
                          className={`flex-1 border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3520]/20 focus:border-[#1a3520] uppercase tracking-widest transition-all ${couponError ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                        />
                        <button
                          onClick={handleCouponApply}
                          disabled={!couponInput.trim() || couponStatus === 'loading' || !user}
                          className="rounded-xl bg-[#1a3520]/10 text-[#1a3520] px-4 py-2 text-sm font-semibold hover:bg-[#1a3520] hover:text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
                        >
                          {couponStatus === 'loading' ? (
                            <div className="w-4 h-4 border-2 border-[#1a3520] border-t-transparent rounded-full animate-spin" />
                          ) : 'Apply'}
                        </button>
                      </div>
                      {couponError && <p className="text-red-500 text-xs mt-1.5">{couponError}</p>}
                    </>
                  )}
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-red-500 text-sm text-center mb-4"
                    >
                      {error}
                    </motion.p>
                  )}
                </AnimatePresence>

                <button
                  onClick={handleBook}
                  disabled={paying}
                  className="w-full bg-[#1a3520] text-white rounded-full py-3.5 font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {paying ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Opening payment…
                    </>
                  ) : `Start Session — ₹${displayTotal}`}
                </button>
                <p className="text-center text-xs text-gray-400 mt-3">Secure payment via Razorpay</p>
              </div>
            </div>
          </motion.div>
        </main>
        <Footer />
      </div>
    </>
  )
}
