import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const testimonials = [
  { id: 1, name: 'Priya S.', role: 'Anxiety support', initials: 'PS', color: 'bg-rose-100 text-rose-600', text: 'I was hesitant about therapy. She made me feel heard and supported from the very first session.' },
  { id: 2, name: 'Rahul & Anjali D.', role: 'Couples counseling', initials: 'RA', color: 'bg-blue-100 text-blue-600', text: 'Couples counseling at MindVeda saved our marriage. We learned how to actually listen to each other again.' },
  { id: 3, name: 'Sandra K.', role: 'Burnout recovery', initials: 'SK', color: 'bg-emerald-100 text-emerald-700', text: 'The combination of yoga and counseling was exactly what I needed. I feel like a completely new person.' },
]

export default function TestimonialCarousel() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => setCurrent(c => (c + 1) % testimonials.length), 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="bg-[#f7f4eb] py-12 md:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-8 md:mb-10">
          <div>
            <p className="text-brand text-xs sm:text-sm uppercase tracking-[0.2em] font-semibold">What clients say</p>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold mt-1.5 md:mt-2 text-[#1a3520] leading-tight">
              Trusted by people who wanted real change
            </h2>
          </div>
          <div className="flex gap-2">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${idx === current ? 'w-8 bg-brand' : 'w-2 bg-[#c9b97a]/50'}`}
              />
            ))}
          </div>
        </div>

        {/* Mobile: single card swipe */}
        <div className="md:hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl p-5 shadow-soft border border-gray-100"
            >
              <div className="flex gap-1 text-yellow-400 text-sm mb-3">★★★★★</div>
              <p className="text-gray-600 italic leading-7 text-sm mb-4">"{testimonials[current].text}"</p>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm flex-shrink-0 ${testimonials[current].color}`}>
                  {testimonials[current].initials}
                </div>
                <div>
                  <div className="font-semibold text-sm text-gray-800">{testimonials[current].name}</div>
                  <div className="text-xs text-gray-400">{testimonials[current].role}</div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Swipe hint dots */}
          <div className="flex justify-center gap-2 mt-4">
            {testimonials.map((_, idx) => (
              <button key={idx} onClick={() => setCurrent(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${idx === current ? 'w-6 bg-brand' : 'w-1.5 bg-gray-300'}`}
              />
            ))}
          </div>
        </div>

        {/* Tablet/Desktop: grid */}
        <div className="hidden md:grid md:grid-cols-3 gap-5 md:gap-6">
          {testimonials.map((t, idx) => (
            <motion.div
              key={t.id}
              animate={{ opacity: idx === current ? 1 : 0.55, y: idx === current ? 0 : 6, scale: idx === current ? 1 : 0.98 }}
              transition={{ duration: 0.35 }}
              onClick={() => setCurrent(idx)}
              className="bg-white rounded-2xl p-5 md:p-6 shadow-soft border border-gray-100 hover:shadow-xl transition-shadow cursor-pointer"
            >
              <div className="flex gap-1 text-yellow-400 mb-3">★★★★★</div>
              <p className="text-gray-600 italic mb-5 leading-relaxed text-sm md:text-base">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm flex-shrink-0 ${t.color}`}>
                  {t.initials}
                </div>
                <div>
                  <div className="font-semibold text-sm">{t.name}</div>
                  <div className="text-xs text-gray-400">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
