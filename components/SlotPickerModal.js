import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { motion, AnimatePresence } from 'framer-motion'
import { LotusIcon } from './Icons'

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

function fmt12(time24) {
  if (!time24) return ''
  const [h, m] = time24.split(':')
  const hr = parseInt(h)
  return `${hr % 12 || 12}:${m} ${hr < 12 ? 'AM' : 'PM'}`
}

export default function SlotPickerModal({ isOpen, onClose, item }) {
  const router = useRouter()
  const [selectedDay, setSelectedDay] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)
  const [slots, setSlots] = useState([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const days = getNext14Days()

  useEffect(() => {
    if (!isOpen) { setSelectedDay(null); setSelectedTime(null); setSlots([]) }
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

  async function handleDaySelect(day) {
    setSelectedDay(day)
    setSelectedTime(null)
    setSlots([])
    if (!item?.slug) return

    setLoadingSlots(true)
    const dateStr = day.toISOString().split('T')[0]
    try {
      const res = await fetch(`/api/availability?date=${dateStr}&serviceSlug=${item.slug}`)
      const data = await res.json()
      setSlots(data.slots || [])
    } catch {
      setSlots([])
    }
    setLoadingSlots(false)
  }

  function handleAddToCart() {
    if (!selectedDay || !selectedTime) return
    const slot = slots.find(s => s.time === selectedTime)
    if (!slot?.available) return

    const dateStr = selectedDay.toISOString().split('T')[0]
    const cart = JSON.parse(localStorage.getItem('mv_cart') || '[]')
    cart.push({
      cartId:      Date.now(),
      id:          item.id,
      type:        item.type || 'service',
      slug:        item.slug,
      title:       item.title,
      price:       item.price,
      duration:    item.duration,
      serviceSlug: item.slug,
      bookingDate: dateStr,
      bookingTime: selectedTime,
      bookingDateDisplay: selectedDay.toLocaleDateString('en-IN', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
      }),
      bookingTimeDisplay: fmt12(selectedTime),
      spotsLeft:   slot.spotsLeft ?? null,
    })
    localStorage.setItem('mv_cart', JSON.stringify(cart))
    window.dispatchEvent(new Event('cartUpdated'))
    onClose()
    router.push('/cart')
  }

  const selectedSlot = slots.find(s => s.time === selectedTime)

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
                <div className="flex items-center gap-2 mb-1">
                  <LotusIcon className="w-4 h-4 text-white/70" />
                  <p className="text-white/70 text-xs uppercase tracking-wider">Booking slot for</p>
                </div>
                <h3 className="text-white font-semibold text-xl leading-snug">{item?.title}</h3>
                <div className="flex items-center gap-3 mt-2 text-white/80 text-sm">
                  <span className="font-bold text-white">₹{item?.price?.toLocaleString('en-IN')}</span>
                  <span>·</span>
                  <span>{item?.duration}</span>
                </div>
              </div>
              <button onClick={onClose} className="text-white/60 hover:text-white text-3xl leading-none ml-4 mt-0.5 transition-colors">×</button>
            </div>

            <div className="p-5">
              {/* Date picker */}
              <p className="text-sm font-semibold text-gray-700 mb-3">Select Date</p>
              <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
                {days.map((d, i) => {
                  const isSelected = selectedDay?.toDateString() === d.toDateString()
                  return (
                    <button
                      key={i}
                      onClick={() => handleDaySelect(d)}
                      className={`flex-shrink-0 w-14 rounded-2xl py-3 flex flex-col items-center transition-all ${
                        isSelected
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

                    {loadingSlots ? (
                      <div className="grid grid-cols-3 gap-2">
                        {[1,2,3,4,5,6].map(i => <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />)}
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 gap-2">
                        {slots.map((slot) => {
                          const isSelected = selectedTime === slot.time
                          const isGroup = slot.spotsLeft !== undefined && slot.spotsLeft !== null

                          return (
                            <button
                              key={slot.time}
                              disabled={!slot.available}
                              onClick={() => setSelectedTime(slot.time)}
                              className={`py-3 px-2 rounded-xl text-center transition-all border relative ${
                                !slot.available
                                  ? 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed'
                                  : isSelected
                                    ? 'bg-brand text-white border-brand shadow-md'
                                    : 'bg-gray-50 text-gray-700 border-gray-100 hover:border-brand/50 hover:bg-brand/5'
                              }`}
                            >
                              <p className="text-sm font-semibold">{fmt12(slot.time)}</p>
                              {!slot.available && (
                                <p className="text-[10px] mt-0.5 text-gray-300">Booked</p>
                              )}
                              {slot.available && isGroup && (
                                <p className={`text-[10px] mt-0.5 font-medium ${isSelected ? 'text-white/80' : 'text-brand'}`}>
                                  {slot.spotsLeft} left
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

              {/* CTA */}
              <button
                disabled={!selectedDay || !selectedTime || !selectedSlot?.available}
                onClick={handleAddToCart}
                className="mt-5 w-full rounded-full bg-brand py-4 text-white font-semibold text-sm disabled:opacity-35 disabled:cursor-not-allowed hover:opacity-90 active:scale-[0.98] transition-all"
              >
                {selectedTime && selectedSlot?.available
                  ? `Continue — ${selectedDay.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}, ${fmt12(selectedTime)}`
                  : 'Select a Date & Time'}
              </button>

              <p className="text-center text-xs text-gray-400 mt-3">Review your cart before checkout</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
