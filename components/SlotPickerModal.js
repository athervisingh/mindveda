import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { motion, AnimatePresence } from 'framer-motion'

const TIME_SLOTS = [
  '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM',
]

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

export default function SlotPickerModal({ isOpen, onClose, item }) {
  const router = useRouter()
  const [selectedDay, setSelectedDay] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)
  const days = getNext14Days()

  useEffect(() => {
    if (!isOpen) { setSelectedDay(null); setSelectedTime(null) }
  }, [isOpen])

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

  function handleAddToCart() {
    if (!selectedDay || !selectedTime) return
    const cart = JSON.parse(localStorage.getItem('mv_cart') || '[]')
    cart.push({
      cartId: Date.now(),
      id: item.id,
      type: item.type || 'service',
      slug: item.slug,
      title: item.title,
      icon: item.icon || '🧠',
      price: item.price,
      duration: item.duration,
      bookingDate: selectedDay.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
      bookingTime: selectedTime,
    })
    localStorage.setItem('mv_cart', JSON.stringify(cart))
    window.dispatchEvent(new Event('cartUpdated'))
    onClose()
    router.push('/cart')
  }

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
            className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
          >
            {/* Header */}
            <div className="bg-brand px-6 py-5 flex items-start justify-between">
              <div>
                <p className="text-white/70 text-xs uppercase tracking-wider mb-1">Booking slot for</p>
                <h3 className="text-white font-semibold text-xl leading-snug">{item?.title}</h3>
                <div className="flex items-center gap-3 mt-2 text-white/80 text-sm">
                  <span className="font-bold text-white">₹{item?.price?.toLocaleString('en-IN')}</span>
                  <span>·</span>
                  <span>{item?.duration}</span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-white/60 hover:text-white text-3xl leading-none ml-4 mt-0.5 transition-colors"
              >
                ×
              </button>
            </div>

            <div className="p-5">
              {/* Date picker */}
              <p className="text-sm font-semibold text-gray-700 mb-3">Select Date <span className="text-gray-400 font-normal">(Sundays off)</span></p>
              <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
                {days.map((d, i) => {
                  const isSelected = selectedDay && selectedDay.toDateString() === d.toDateString()
                  const isSunday = d.getDay() === 0
                  return (
                    <button
                      key={i}
                      disabled={isSunday}
                      onClick={() => { setSelectedDay(d); setSelectedTime(null) }}
                      className={`flex-shrink-0 w-14 rounded-2xl py-3 flex flex-col items-center transition-all ${
                        isSunday
                          ? 'opacity-25 cursor-not-allowed bg-gray-50'
                          : isSelected
                          ? 'bg-brand text-white shadow-md'
                          : 'bg-gray-50 hover:bg-brand/10 text-gray-700'
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
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <p className="text-sm font-semibold text-gray-700 mt-4 mb-3">
                      Available Times —{' '}
                      <span className="font-normal text-gray-500">
                        {selectedDay.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
                      </span>
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {TIME_SLOTS.map((t) => (
                        <button
                          key={t}
                          onClick={() => setSelectedTime(t)}
                          className={`py-2.5 rounded-xl text-sm font-medium transition-all ${
                            selectedTime === t
                              ? 'bg-brand text-white shadow-md'
                              : 'bg-gray-50 text-gray-700 hover:bg-brand/10 border border-gray-100'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Add to Cart CTA */}
              <button
                disabled={!selectedDay || !selectedTime}
                onClick={handleAddToCart}
                className="mt-5 w-full rounded-full bg-brand py-4 text-white font-semibold text-sm disabled:opacity-35 disabled:cursor-not-allowed hover:opacity-90 active:scale-[0.98] transition-all"
              >
                {selectedDay && selectedTime
                  ? `Add to Cart — ${selectedDay.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}, ${selectedTime}`
                  : 'Select a Date & Time to Continue'}
              </button>

              <p className="text-center text-xs text-gray-400 mt-3">
                You can review or remove items in your cart before checkout
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
