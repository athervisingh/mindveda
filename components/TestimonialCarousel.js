import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ImagePlaceholder from './ImagePlaceholder'

const testimonials = [
  { id: 1, name: 'Priya S.', text: 'I was hesitant about therapy. She made me feel heard and supported.' },
  { id: 2, name: 'Rahul & Anjali D.', text: 'Couples counseling at MindVeda saved our marriage. We learned how to actually listen to each other again.' },
  { id: 3, name: 'Sandra K.', text: 'The combination of yoga and counseling was exactly what I needed for my burnout. I feel like a total new person.' }
]

export default function TestimonialCarousel() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="text-brand text-sm uppercase tracking-[0.2em] font-semibold">What clients say</p>
          <h2 className="text-3xl font-semibold mt-2">Trusted by people who wanted real change</h2>
        </div>
        <div className="hidden md:flex gap-2">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`h-2 rounded-full transition-all ${idx === current ? 'w-10 bg-brand' : 'w-2 bg-gray-300'}`}
            />
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {testimonials.map((t, idx) => {
          const isActive = idx === current
          return (
            <motion.div
              key={t.id}
              animate={{
                opacity: isActive ? 1 : 0.55,
                y: isActive ? 0 : 8,
                scale: isActive ? 1 : 0.98,
              }}
              transition={{ duration: 0.35 }}
              className="bg-white rounded-2xl p-6 shadow-soft border border-gray-100 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center gap-4 mb-5 text-yellow-400 text-lg">★★★★★</div>
              <p className="text-gray-600 italic mb-5 leading-relaxed">“{t.text}”</p>
              <div className="flex items-center gap-3">
                <ImagePlaceholder width="w-12" height="h-12" label="" />
                <div>
                  <div className="font-medium text-sm">{t.name}</div>
                  <div className="text-xs text-gray-500">Client story</div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      <div className="flex justify-center gap-2 mt-8">
        {testimonials.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`w-2 h-2 rounded-full transition-all ${idx === current ? 'bg-brand w-8' : 'bg-gray-300'}`}
          />
        ))}
      </div>
    </section>
  )
}
