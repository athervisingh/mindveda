import Header from '../components/Header'
import Footer from '../components/Footer'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { CartIcon, LotusIcon, CalendarIcon, ClockIcon, CheckIcon, ArrowRightIcon, ArrowLeftIcon } from '../components/Icons'
import { useAuth } from '../context/AuthContext'

export default function Cart() {
  const { user } = useAuth()
  const [cart, setCart] = useState([])
  const [mounted, setMounted] = useState(false)
  const [couponInput, setCouponInput] = useState('')
  const [couponCode, setCouponCode] = useState('')
  const [couponStatus, setCouponStatus] = useState(null)
  const [couponFlatPrice, setCouponFlatPrice] = useState(0)
  const [couponError, setCouponError] = useState('')
  const [pkgDiscount, setPkgDiscount] = useState(null)

  useEffect(() => {
    setMounted(true)
    setCart(JSON.parse(localStorage.getItem('mv_cart') || '[]'))
    const saved = JSON.parse(localStorage.getItem('mv_package_discount') || 'null')
    if (saved?.amount) setPkgDiscount(saved)
  }, [])

  function removeItem(cartId) {
    const updated = cart.filter(c => c.cartId !== cartId)
    setCart(updated)
    localStorage.setItem('mv_cart', JSON.stringify(updated))
    window.dispatchEvent(new Event('cartUpdated'))
  }

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
      if (data.valid) {
        setCouponCode(code)
        setCouponFlatPrice(data.flat_price)
        setCouponStatus('valid')
        localStorage.setItem('mv_coupon', JSON.stringify({ code, flat_price: data.flat_price }))
      } else {
        setCouponStatus('invalid')
        setCouponError(data.error || 'Invalid coupon code')
      }
    } catch {
      setCouponStatus(null)
      setCouponError('Could not apply coupon. Try again.')
    }
  }

  function handleCouponRemove() {
    setCouponInput('')
    setCouponCode('')
    setCouponStatus(null)
    setCouponFlatPrice(0)
    setCouponError('')
    localStorage.removeItem('mv_coupon')
  }

  function removePkgDiscount() {
    setPkgDiscount(null)
    localStorage.removeItem('mv_package_discount')
  }

  const total = cart.reduce((s, p) => s + (p.price || 0), 0)
  const couponPriceRs = Math.round(couponFlatPrice / 100)
  const afterCoupon = couponStatus === 'valid'
    ? couponPriceRs + cart.slice(1).reduce((s, p) => s + (p.price || 0), 0)
    : total
  const pkgDiscountAmt = pkgDiscount?.amount || 0
  const discountedTotal = Math.max(0, afterCoupon - pkgDiscountAmt)
  const couponSavings = total - afterCoupon

  if (!mounted) return null

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfaf7] text-gray-900">
      <Header />

      <main className="flex-1 max-w-5xl mx-auto px-6 py-12 w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-semibold text-[#1a3520]">Your Cart</h1>
            <p className="text-gray-500 text-sm mt-1">
              {cart.length === 0 ? 'No items yet' : `${cart.length} item${cart.length > 1 ? 's' : ''} — review before checkout`}
            </p>
          </div>
          <Link href="/services" className="text-sm text-brand hover:underline inline-flex items-center gap-1">
            + Add More Services
          </Link>
        </div>

        {cart.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm"
          >
            <div className="w-16 h-16 mx-auto mb-4 text-gray-300 flex items-center justify-center">
              <CartIcon className="w-14 h-14" />
            </div>
            <h2 className="text-xl font-semibold text-[#1a3520] mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">Add a service or package to get started with your healing journey.</p>
            <div className="flex gap-3 justify-center">
              <Link href="/services" className="rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity">
                Browse Services
              </Link>
              <Link href="/yoga" className="rounded-full border border-brand px-6 py-3 text-sm font-semibold text-brand hover:bg-brand hover:text-white transition-all">
                View Packages
              </Link>
            </div>
          </motion.div>
        ) : (
          <div className="grid lg:grid-cols-[1fr_340px] gap-6 items-start">
            <div className="space-y-4">
              <AnimatePresence>
                {cart.map((item) => (
                  <motion.div
                    key={item.cartId}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -40, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex gap-4"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-brand/10 flex items-center justify-center text-brand flex-shrink-0">
                      <LotusIcon className="w-7 h-7" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-xs font-medium text-brand/60 uppercase tracking-wider">
                            {item.type === 'package' ? 'Package' : 'Service'}
                          </span>
                          <h3 className="text-base font-semibold text-[#1a3520] mt-0.5">{item.title}</h3>
                        </div>
                        <span className="text-lg font-bold text-brand flex-shrink-0">
                          ₹{item.price.toLocaleString('en-IN')}
                        </span>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {item.bookingDate && (
                          <span className="flex items-center gap-1.5 bg-brand/5 border border-brand/10 text-brand text-xs font-medium px-3 py-1.5 rounded-full">
                            <CalendarIcon className="w-3 h-3" /> {item.bookingDateDisplay || item.bookingDate}
                          </span>
                        )}
                        {item.bookingTime && (
                          <span className="flex items-center gap-1.5 bg-brand/5 border border-brand/10 text-brand text-xs font-medium px-3 py-1.5 rounded-full">
                            <ClockIcon className="w-3 h-3" /> {item.bookingTimeDisplay || item.bookingTime} IST
                          </span>
                        )}
                        {item.duration && (
                          <span className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 text-gray-500 text-xs font-medium px-3 py-1.5 rounded-full">
                            <ClockIcon className="w-3 h-3" /> {item.duration}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => removeItem(item.cartId)}
                        className="mt-3 text-xs text-red-400 hover:text-red-600 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              <div className="flex gap-3 pt-2">
                <Link href="/services" className="text-sm text-brand hover:underline flex items-center gap-1">
                  <ArrowLeftIcon className="w-3.5 h-3.5" /> Browse more services
                </Link>
                <span className="text-gray-300">·</span>
                <Link href="/yoga" className="text-sm text-brand hover:underline">View packages</Link>
              </div>
            </div>

            {/* Order Summary */}
            <div className="sticky top-24">
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="bg-[#1a3520] px-6 py-4">
                  <h2 className="text-white font-semibold text-lg">Order Summary</h2>
                </div>

                <div className="p-5 space-y-3">
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

                  {/* Coupon Input */}
                  <div className="border-t border-gray-100 pt-3">
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
                            className={`flex-1 border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3520]/20 focus:border-[#1a3520] transition-all uppercase tracking-widest ${couponError ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                          />
                          <button
                            onClick={handleCouponApply}
                            disabled={!couponInput.trim() || couponStatus === 'loading' || !user}
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
                        {!user && <p className="text-xs text-gray-400 mt-1.5">Login to use coupon codes</p>}
                      </>
                    )}
                  </div>

                  {couponStatus === 'valid' && couponSavings > 0 && (
                    <div className="flex justify-between text-sm text-green-600 font-medium">
                      <span>Coupon Discount</span>
                      <span>−₹{couponSavings.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  {pkgDiscount && (
                    <div className="flex items-center justify-between text-sm text-green-600 font-medium">
                      <div className="flex items-center gap-1.5">
                        <span>{pkgDiscount.label}</span>
                        <button onClick={removePkgDiscount} className="text-gray-300 hover:text-red-400 transition-colors text-xs ml-1">✕</button>
                      </div>
                      <span>−₹{pkgDiscount.amount.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-[#1a3520]">
                    <span>Total</span>
                    <div className="text-right">
                      {(couponStatus === 'valid' || pkgDiscount) && (
                        <div className="line-through text-gray-300 text-sm font-normal">₹{total.toLocaleString('en-IN')}</div>
                      )}
                      <span className="text-brand text-xl">₹{discountedTotal.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <div className="pt-1 space-y-2 text-xs text-gray-400">
                    {['All sessions are 100% confidential', 'Flexible rescheduling available', 'Secure payment checkout'].map(t => (
                      <div key={t} className="flex items-center gap-1.5">
                        <CheckIcon className="w-3.5 h-3.5 text-green-500 flex-shrink-0" /> {t}
                      </div>
                    ))}
                  </div>

                  <Link
                    href="/checkout"
                    className="mt-2 flex items-center justify-center gap-2 w-full rounded-full bg-brand py-3.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
                  >
                    Proceed to Checkout <ArrowRightIcon className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              <div className="mt-4 text-center text-sm text-gray-500">
                Need help?{' '}
                <Link href="/contact" className="text-brand hover:underline">Contact us</Link>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
