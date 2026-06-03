import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function FaqSection({ faqs, title = 'Frequently Asked Questions', subtitle = 'Common Questions' }) {
  const [openIndex, setOpenIndex] = useState(null)

  return (
    <section className="bg-[#f5f3ee] py-10 sm:py-14 md:py-20 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-7 sm:mb-10 text-center">
          <div className="inline-flex items-center gap-2 mb-2.5">
            <div className="h-px w-6 bg-brand/40" />
            <p className="text-brand text-[10px] sm:text-xs uppercase tracking-[0.2em] font-semibold">{subtitle}</p>
            <div className="h-px w-6 bg-brand/40" />
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-[#1a3520] leading-snug px-2">{title}</h2>
        </div>

        {/* FAQ Items */}
        <div className="space-y-2.5">
          {faqs.map(({ q, a }, i) => {
            const isOpen = openIndex === i
            return (
              <div
                key={i}
                className={`rounded-xl sm:rounded-2xl border overflow-hidden transition-all duration-200 ${
                  isOpen
                    ? 'bg-white border-brand/20 shadow-md shadow-brand/5'
                    : 'bg-white/80 border-gray-100 hover:border-brand/15 hover:bg-white hover:shadow-sm'
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-start justify-between gap-3 px-4 sm:px-5 py-4 text-left focus:outline-none"
                >
                  <span className={`font-semibold text-[0.8rem] sm:text-sm leading-snug transition-colors duration-200 ${
                    isOpen ? 'text-brand' : 'text-[#1a3520]'
                  }`}>
                    {q}
                  </span>
                  <span className={`flex-shrink-0 mt-0.5 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isOpen ? 'bg-brand text-white' : 'bg-[#e8efe9] text-brand'
                  }`}>
                    <motion.svg
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.25 }}
                      className="w-3 h-3 sm:w-3.5 sm:h-3.5"
                      viewBox="0 0 14 14"
                      fill="none"
                    >
                      <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </motion.svg>
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="answer"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 sm:px-5 pb-4">
                        <div className="h-px bg-gradient-to-r from-brand/20 via-brand/10 to-transparent mb-3" />
                        <p className="text-gray-600 text-xs sm:text-sm leading-6 sm:leading-7">{a}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
