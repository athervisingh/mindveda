import Header from '../components/Header'
import Footer from '../components/Footer'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function Checkout() {
  const [cart, setCart] = useState([])
  const [mounted, setMounted] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '' })
  const [errors, setErrors] = useState({})
  const [paid, setPaid] = useState(false)

  useEffect(() => {
    setMounted(true)
    setCart(JSON.parse(localStorage.getItem('mv_cart') || '[]'))
  }, [])

  const total = cart.reduce((s, p) => s + (p.price || 0), 0)

  function validate() {
    const e = {}
    if (!form.name.trim()) e.name = 'Required'
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required'
    if (!form.phone.trim() || !/^[6-9]\d{9}$/.test(form.phone)) e.phone = 'Valid 10-digit mobile required'
    return e
  }

  function handlePay() {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setErrors({})
    // Mock: clear cart and show success
    localStorage.setItem('mv_cart', '[]')
    window.dispatchEvent(new Event('cartUpdated'))
    setPaid(true)
  }

  if (!mounted) return null

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
              className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl"
            >
              ✓
            </motion.div>
            <h2 className="text-3xl font-semibold text-[#2d2343] mb-2">Payment Confirmed!</h2>
            <p className="text-gray-500 mb-2">Your sessions have been booked successfully.</p>
            <p className="text-gray-500 text-sm mb-8">
              A confirmation will be sent to <span className="font-medium text-gray-700">{form.email}</span>. Our team will share the video call link before each session.
            </p>
            <div className="flex gap-3">
              <Link href="/services" className="flex-1 text-center rounded-full border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 hover:border-brand hover:text-brand transition-all">
                Book More
              </Link>
              <Link href="/" className="flex-1 text-center rounded-full bg-brand px-4 py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity">
                Go Home
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
            <div className="text-5xl mb-4">🛒</div>
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
          <h1 className="text-3xl font-semibold text-[#2d2343]">Checkout</h1>
          <p className="text-gray-500 text-sm mt-1">Review your sessions and complete payment</p>
        </div>

        <div className="grid lg:grid-cols-[1fr_380px] gap-6 items-start">
          {/* Left — Billing Details */}
          <div className="space-y-5">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-[#2d2343] mb-5">Your Details</h2>
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

            {/* Booked sessions */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-[#2d2343] mb-4">Your Booked Sessions</h2>
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.cartId} className="flex gap-4 pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                    <div className="w-11 h-11 rounded-xl bg-brand/10 flex items-center justify-center text-xl flex-shrink-0">
                      {item.icon || '🧠'}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start gap-2">
                        <p className="text-sm font-semibold text-[#2d2343]">{item.title}</p>
                        <span className="text-sm font-bold text-brand">₹{item.price.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        {item.bookingDate && (
                          <span className="text-xs bg-brand/5 text-brand border border-brand/10 px-2.5 py-1 rounded-full">
                            📅 {item.bookingDate}
                          </span>
                        )}
                        {item.bookingTime && (
                          <span className="text-xs bg-brand/5 text-brand border border-brand/10 px-2.5 py-1 rounded-full">
                            🕐 {item.bookingTime}
                          </span>
                        )}
                        {item.duration && (
                          <span className="text-xs bg-gray-50 text-gray-500 border border-gray-200 px-2.5 py-1 rounded-full">
                            ⏱ {item.duration}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Link href="/cart" className="flex items-center gap-1 text-sm text-brand hover:underline">
              ← Edit Cart
            </Link>
          </div>

          {/* Right — Payment Summary */}
          <div className="sticky top-24">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="bg-[#2d2343] px-6 py-4">
                <h2 className="text-white font-semibold text-lg">Payment Summary</h2>
              </div>
              <div className="p-5">
                <div className="space-y-2.5 mb-4">
                  {cart.map((item) => (
                    <div key={item.cartId} className="flex justify-between text-sm text-gray-600">
                      <span className="truncate max-w-[180px]">{item.title}</span>
                      <span className="font-medium ml-2">₹{item.price.toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-[#2d2343] mb-5">
                  <span>Total</span>
                  <span className="text-brand text-2xl">₹{total.toLocaleString('en-IN')}</span>
                </div>

                <button
                  onClick={handlePay}
                  className="w-full rounded-full bg-brand py-4 text-white font-semibold text-sm hover:opacity-90 active:scale-[0.98] transition-all"
                >
                  Pay ₹{total.toLocaleString('en-IN')} →
                </button>

                <p className="text-center text-xs text-gray-400 mt-3">
                  Razorpay integration to be added · Mock UI for now
                </p>

                <div className="mt-4 space-y-2 text-xs text-gray-400">
                  <div className="flex items-center gap-1.5"><span className="text-green-500">✓</span> 100% confidential sessions</div>
                  <div className="flex items-center gap-1.5"><span className="text-green-500">✓</span> Flexible rescheduling up to 24hrs before</div>
                  <div className="flex items-center gap-1.5"><span className="text-green-500">✓</span> Certified psychologists</div>
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
