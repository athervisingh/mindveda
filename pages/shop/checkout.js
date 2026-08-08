import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { CartIcon, CheckIcon, ArrowLeftIcon, ArrowRightIcon } from '../../components/Icons'
import { loadRazorpay } from '../../lib/loadRazorpay'

const INDIAN_STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Delhi','Goa','Gujarat',
  'Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra',
  'Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu',
  'Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal',
]

export default function ShopCheckout() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [cart, setCart] = useState([])
  const [mounted, setMounted] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', email: '', line1: '', line2: '', city: '', state: '', pincode: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [paid, setPaid] = useState(false)

  useEffect(() => {
    setMounted(true)
    setCart(JSON.parse(localStorage.getItem('mv_cart') || '[]').filter(i => i.type === 'product'))
  }, [])

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login?redirect=/shop/checkout')
    }
    if (user?.email) {
      setForm(f => ({ ...f, email: user.email, name: f.name || user.user_metadata?.full_name || '' }))
    }
  }, [authLoading, user])

  const total = cart.reduce((s, p) => s + (p.price || 0) * (p.quantity || 1), 0)

  function validate() {
    const e = {}
    if (!form.name.trim()) e.name = 'Required'
    if (!form.phone.trim() || !/^[6-9]\d{9}$/.test(form.phone)) e.phone = 'Valid 10-digit mobile required'
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required'
    if (!form.line1.trim()) e.line1 = 'Required'
    if (!form.city.trim()) e.city = 'Required'
    if (!form.state.trim()) e.state = 'Required'
    if (!form.pincode.trim() || !/^\d{6}$/.test(form.pincode)) e.pincode = 'Valid 6-digit pincode required'
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

      const orderRes = await fetch('/api/shop/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.map(item => ({ productId: item.productId, quantity: item.quantity })),
          userId: user.id,
          shipping: form,
        }),
      })
      const orderData = await orderRes.json()
      if (!orderRes.ok) throw new Error(orderData.error || 'Order creation failed')

      await new Promise((resolve, reject) => {
        const rzp = new window.Razorpay({
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: orderData.amount,
          currency: 'INR',
          name: 'Mind Veda Shop',
          description: cart.length === 1 ? cart[0].title : `${cart.length} products`,
          order_id: orderData.orderId,
          prefill: { name: form.name, email: form.email, contact: form.phone },
          theme: { color: '#1a3520' },
          handler: async (response) => {
            try {
              const verifyRes = await fetch('/api/shop/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  shopOrderId: orderData.shopOrderId,
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

      const fullCart = JSON.parse(localStorage.getItem('mv_cart') || '[]').filter(i => i.type !== 'product')
      localStorage.setItem('mv_cart', JSON.stringify(fullCart))
      window.dispatchEvent(new Event('cartUpdated'))
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
          <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-lg border border-gray-100 p-10 max-w-md w-full text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
              <CheckIcon className="w-10 h-10" />
            </motion.div>
            <h2 className="text-3xl font-semibold text-[#1a3520] mb-2">Order Placed!</h2>
            <p className="text-gray-500 mb-8">A confirmation email is on its way. We'll notify you once it ships.</p>
            <div className="flex gap-3">
              <Link href="/shop" className="flex-1 text-center rounded-full border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 hover:border-brand hover:text-brand transition-all">
                Continue Shopping
              </Link>
              <Link href="/orders" className="flex-1 text-center rounded-full bg-brand px-4 py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity">
                My Orders
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
            <p className="text-xl font-semibold text-gray-700 mb-4">No products in cart</p>
            <Link href="/shop" className="text-brand underline">Browse Shop</Link>
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
          <h1 className="text-3xl font-semibold text-[#1a3520]">Shop Checkout</h1>
          <p className="text-gray-500 text-sm mt-1">Enter your shipping details and complete payment</p>
        </div>

        <div className="grid lg:grid-cols-[1fr_380px] gap-6 items-start">
          <div className="space-y-5">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-[#1a3520] mb-5">Shipping Address</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { field: 'name', label: 'Full Name', type: 'text', span: 2 },
                  { field: 'phone', label: 'Mobile Number', type: 'tel' },
                  { field: 'email', label: 'Email Address', type: 'email' },
                  { field: 'line1', label: 'Address Line 1', type: 'text', span: 2 },
                  { field: 'line2', label: 'Address Line 2 (optional)', type: 'text', span: 2 },
                  { field: 'city', label: 'City', type: 'text' },
                  { field: 'pincode', label: 'Pincode', type: 'text' },
                ].map(({ field, label, type, span }) => (
                  <div key={field} className={span === 2 ? 'sm:col-span-2' : ''}>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
                    <input
                      type={type}
                      value={form[field]}
                      onChange={e => setForm(p => ({ ...p, [field]: e.target.value }))}
                      className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all ${errors[field] ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                    />
                    {errors[field] && <p className="text-red-500 text-xs mt-1">{errors[field]}</p>}
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">State</label>
                  <select value={form.state} onChange={e => setForm(p => ({ ...p, state: e.target.value }))}
                    className={`w-full border rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all ${errors.state ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}>
                    <option value="">Select state</option>
                    {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-[#1a3520] mb-4">Your Items</h2>
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.cartId} className="flex gap-4 pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                    <div className="w-11 h-11 rounded-xl bg-brand/10 flex-shrink-0 overflow-hidden">
                      {item.image ? <img src={item.image} alt="" className="w-full h-full object-cover" /> : (
                        <div className="w-full h-full flex items-center justify-center text-brand"><CartIcon className="w-5 h-5" /></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start gap-2">
                        <p className="text-sm font-semibold text-[#1a3520]">{item.title} × {item.quantity}</p>
                        <span className="text-sm font-bold text-brand">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
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
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-medium">₹{total.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Shipping</span>
                    <span className="font-medium text-green-600">Free</span>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-[#1a3520] mb-5">
                  <span>Total</span>
                  <span className="text-brand text-2xl">₹{total.toLocaleString('en-IN')}</span>
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
                    <>Pay ₹{total.toLocaleString('en-IN')} <ArrowRightIcon className="w-4 h-4" /></>
                  )}
                </button>

                <div className="mt-4 space-y-2 text-xs text-gray-400">
                  {['Secure payment via Razorpay', 'Delivered across India', 'Order tracking in My Orders'].map(t => (
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
