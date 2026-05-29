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
  const [paying, setPaying] = useState(false)
  const [error, setError] = useState('')

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
        body: JSON.stringify({ userId: user.id }),
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
                <h1 className="text-2xl font-semibold text-white">Quick Chat with Veda</h1>
                <p className="text-white/70 text-sm mt-2">Your 5-minute wellness check-in</p>
              </div>

              {/* Body */}
              <div className="px-5 sm:px-8 py-5 sm:py-7">
                <ul className="space-y-3 mb-7">
                  {[
                    '5-minute private chat session',
                    'AI wellness guide — instant replies',
                    'Share what\'s on your mind freely',
                    'Option to upgrade to voice call with counselor',
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

                <div className="flex items-center justify-between mb-6 py-4 border-y border-gray-100">
                  <span className="text-gray-500 text-sm">Total</span>
                  <span className="text-2xl font-bold text-[#1a3520]">₹10</span>
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
                  ) : (
                    'Start Chat — ₹10'
                  )}
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
