import Header from '../components/Header'
import Footer from '../components/Footer'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { CartIcon, LotusIcon, CalendarIcon, ClockIcon, CheckIcon, ArrowRightIcon, ArrowLeftIcon } from '../components/Icons'

export default function Cart() {
  const [cart, setCart] = useState([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setCart(JSON.parse(localStorage.getItem('mv_cart') || '[]'))
  }, [])

  function removeItem(cartId) {
    const updated = cart.filter(c => c.cartId !== cartId)
    setCart(updated)
    localStorage.setItem('mv_cart', JSON.stringify(updated))
    window.dispatchEvent(new Event('cartUpdated'))
  }

  const total = cart.reduce((s, p) => s + (p.price || 0), 0)

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
                            <CalendarIcon className="w-3 h-3" /> {item.bookingDate}
                          </span>
                        )}
                        {item.bookingTime && (
                          <span className="flex items-center gap-1.5 bg-brand/5 border border-brand/10 text-brand text-xs font-medium px-3 py-1.5 rounded-full">
                            <ClockIcon className="w-3 h-3" /> {item.bookingTime} IST
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
                  {cart.map((item) => (
                    <div key={item.cartId} className="flex justify-between text-sm text-gray-600">
                      <span className="truncate max-w-[180px]">{item.title}</span>
                      <span className="font-medium ml-2">₹{item.price.toLocaleString('en-IN')}</span>
                    </div>
                  ))}

                  <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-[#1a3520]">
                    <span>Total</span>
                    <span className="text-brand text-xl">₹{total.toLocaleString('en-IN')}</span>
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
