import Header from '../../components/Header'
import { LotusIcon, StarIcon, ArrowRightIcon } from '../../components/Icons'
import Footer from '../../components/Footer'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { yogaPackages } from '../../lib/siteContent'
import { useState } from 'react'
import SlotPickerModal from '../../components/SlotPickerModal'

export default function Yoga() {
  const [modalItem, setModalItem] = useState(null)

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfaf7]">
      <Header />
      <main className="flex-1">

        {/* Hero */}
        <section className="relative overflow-hidden">
          <Image
            src="/yoga.webp"
            alt="Yoga & Wellness – Mind Veda"
            width={1920}
            height={972}
            className="w-full h-auto block"
            priority
          />
          {/* Right dark gradient */}
          <div className="absolute inset-0 bg-gradient-to-l from-black/80 via-black/35 to-transparent" />

          {/* Content – right side */}
          <div className="absolute inset-0 flex items-center justify-end">
            <div className="w-full sm:w-1/2 px-5 sm:px-8 md:px-12 lg:px-16 text-right">
              <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
                <div className="hidden md:flex justify-end mb-4">
                  <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/90 text-xs font-semibold tracking-widest uppercase backdrop-blur-sm">
                    Yoga & Wellness
                  </span>
                </div>
                <h1 className="text-base sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white leading-tight mb-1.5 sm:mb-3 md:mb-4 drop-shadow-lg">
                  <span className="whitespace-nowrap">Find Balance</span><br />
                  <span className="text-[#f5a623]">Through Yoga</span>
                </h1>
                <p className="hidden md:block text-white/75 text-sm lg:text-base xl:text-lg leading-7 mb-6 ml-auto max-w-lg">
                  Online yoga sessions designed to restore emotional balance, build inner strength, and nurture lasting well-being — guided by 12+ years of experience.
                </p>
                <div className="hidden md:flex gap-8 lg:gap-12 justify-end">
                  {[
                    {
                      label: '12+\nYears Exp.',
                      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-6 h-6 sm:w-7 sm:h-7"><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"/></svg>,
                    },
                    {
                      label: 'Online\nSessions',
                      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-6 h-6 sm:w-7 sm:h-7"><rect x="3" y="4" width="18" height="18" rx="2" strokeLinecap="round" strokeLinejoin="round"/><path strokeLinecap="round" strokeLinejoin="round" d="M16 2v4M8 2v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"/></svg>,
                    },
                    {
                      label: 'Holistic\nWellness',
                      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-6 h-6 sm:w-7 sm:h-7"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3c-1.2 5.4-6 7.8-6 12a6 6 0 0012 0c0-4.2-4.8-6.6-6-12z"/><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18"/></svg>,
                    },
                    {
                      label: 'Mind &\nBody',
                      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-6 h-6 sm:w-7 sm:h-7"><circle cx="12" cy="5" r="2"/><path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5m0 0l-3 4m3-4l3 4M9 11H6m9 0h3"/></svg>,
                    },
                  ].map(({ label, icon }) => (
                    <div key={label} className="flex flex-col items-end text-right gap-2">
                      <div className="text-[#f5a623]">{icon}</div>
                      <span className="text-white/75 text-[11px] sm:text-xs leading-tight whitespace-pre-line">{label}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Yoga packages grid */}
        <section className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-2 gap-6">
            {yogaPackages.map((pkg, index) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5, scale: 1.012 }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                viewport={{ once: true }}
                className="card-anim group bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col"
              >
                {pkg.featured && (
                  <div className="bg-brand px-5 py-1.5 text-xs font-semibold text-white text-center tracking-wide flex items-center justify-center gap-1.5">
                    <StarIcon className="w-3.5 h-3.5" /> Most Popular
                  </div>
                )}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-brand/10 flex items-center justify-center text-brand flex-shrink-0">
                      <LotusIcon className="w-8 h-8" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-xl font-semibold text-[#1a3520] group-hover:text-brand transition-colors">{pkg.title}</h3>
                        {pkg.mode && (
                          <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${
                            pkg.mode.includes('Group')
                              ? 'bg-[#fffbe8] text-[#8a6914] border border-[#e8d090]'
                              : 'bg-[#edf6ef] text-brand border border-[#b7d9c0]'
                          }`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                            {pkg.mode}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{pkg.excerpt}</p>
                    </div>
                  </div>

                  {pkg.sessionsLabel && (
                    <div className="mb-4 flex items-center gap-2 bg-[#f7fbf8] rounded-xl px-4 py-2.5 border border-[#d4eada]">
                      <svg className="w-4 h-4 text-brand flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round">
                        <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                      </svg>
                      <span className="text-sm font-semibold text-brand">{pkg.sessionsLabel}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-4 mt-auto pt-4 border-t border-gray-100">
                    <div>
                      <span className="bold-hover text-2xl font-bold text-brand">₹{pkg.price.toLocaleString('en-IN')}</span>
                      <span className="text-gray-400 text-sm ml-1">/ session</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6l4 2"/>
                      </svg>
                      {pkg.duration}
                    </div>
                  </div>

                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={() => setModalItem({ ...pkg, type: 'package' })}
                      className="flex-1 rounded-full bg-brand py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
                    >
                      Book Now
                    </button>
                    <Link
                      href={`/yoga/${pkg.slug}`}
                      className="flex-1 text-center rounded-full border border-brand py-2.5 text-sm font-semibold text-brand hover:bg-brand hover:text-white transition-all"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="max-w-6xl mx-auto px-6 pb-20">
          <div className="grid lg:grid-cols-3 gap-6">
            {[
              ['1. Choose', 'Pick the yoga session that matches your goals.'],
              ['2. Pick a Slot', 'Choose your preferred date and time — add to cart.'],
              ['3. Join Online', 'Review your cart, pay securely, and join your session.'],
            ].map(([title, desc]) => (
              <div key={title} className="rounded-[28px] bg-white p-6 shadow-soft border border-gray-100">
                <h3 className="text-lg font-semibold text-[#1a3520]">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-gray-600">{desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />

      <SlotPickerModal isOpen={!!modalItem} onClose={() => setModalItem(null)} item={modalItem} />
    </div>
  )
}
