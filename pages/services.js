import Header from '../components/Header'
import Footer from '../components/Footer'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { orderedAllServices as allServices } from '../lib/siteContent'
import { useState } from 'react'
import SlotPickerModal from '../components/SlotPickerModal'
import { ServiceCategoryIcon, ArrowRightIcon, PhoneIcon } from '../components/Icons'

const categories = ['All', 'Personal', 'Children', 'Family', 'Career', 'Relationships', 'Performance', 'Group']

export default function Services() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [modalItem, setModalItem] = useState(null)

  const filtered = activeCategory === 'All'
    ? allServices
    : allServices.filter(s => s.category === activeCategory)

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfaf7] text-gray-900">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <Image
            src="/service.webp"
            alt="Online Counselling Services"
            width={1376}
            height={668}
            className="w-full h-auto block"
            style={{}}
            priority
          />
          {/* Left dark gradient — same as expert */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/35 to-transparent" />
          {/* Content */}
          <div className="absolute inset-0 flex items-center">
            <div className="w-full px-5 sm:px-10 md:px-16 lg:px-20">
              <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
                <span className="hidden md:inline-flex items-center px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/90 text-xs font-semibold tracking-widest uppercase mb-4">
                  Online Counselling Services
                </span>
                <h1 className="text-lg sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight mb-1.5 sm:mb-3 md:mb-4 drop-shadow-lg">
                  Every Mind Deserves<br />
                  <span className="text-[#f5a623]">Expert Care</span>
                </h1>
                <p className="hidden md:block text-white/75 text-sm lg:text-base xl:text-lg leading-7 mb-6 max-w-lg">
                  From individual therapy to group support, our certified psychologists offer evidence-based counseling for every stage of your mental wellness journey.
                </p>
                <div className="hidden md:flex gap-8 lg:gap-12">
                  {[
                    { label: '100%\nConfidential', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-6 h-6 sm:w-7 sm:h-7"><rect x="3" y="11" width="18" height="11" rx="2" strokeLinecap="round" strokeLinejoin="round"/><path strokeLinecap="round" strokeLinejoin="round" d="M7 11V7a5 5 0 0110 0v4"/></svg> },
                    { label: 'Certified\nPsychologists', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-6 h-6 sm:w-7 sm:h-7"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/></svg> },
                    { label: 'Flexible\nOnline Sessions', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-6 h-6 sm:w-7 sm:h-7"><rect x="3" y="4" width="18" height="18" rx="2" strokeLinecap="round" strokeLinejoin="round"/><path strokeLinecap="round" strokeLinejoin="round" d="M16 2v4M8 2v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"/></svg> },
                    { label: 'Multi-lingual\nSupport', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-6 h-6 sm:w-7 sm:h-7"><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"/></svg> },
                  ].map(({ label, icon }) => (
                    <div key={label} className="flex flex-col items-start text-left gap-2">
                      <div className="text-[#f5a623]">{icon}</div>
                      <span className="text-white/75 text-[11px] sm:text-xs leading-tight whitespace-pre-line">{label}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stats bar */}
        <section className="bg-white border-b border-gray-100">
          <div className="max-w-5xl mx-auto px-6 py-5 grid grid-cols-3 gap-4 text-center">
            {[
              { val: '1000+', label: 'Clients Helped' },
              { val: '14+', label: 'Specialisations' },
              { val: '₹500', label: 'Starting Price' },
            ].map(s => (
              <div key={s.label}>
                <div className="bold-hover text-2xl font-bold text-brand">{s.val}</div>
                <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Category filter */}
        <section className="max-w-6xl mx-auto px-6 pt-12">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? 'bg-brand text-white shadow-md'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-brand hover:text-brand'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* Services Grid */}
        <section className="max-w-6xl mx-auto px-6 py-10 pb-20">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5, scale: 1.01 }}
                transition={{ duration: 0.45, delay: (index % 6) * 0.07 }}
                viewport={{ once: true }}
                className="card-anim group bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col"
              >
                {/* Top gradient band with SVG icon */}
                <div className={`bg-gradient-to-r ${service.color} px-6 pt-6 pb-4 flex items-start justify-between`}>
                  <div className="w-14 h-14 rounded-2xl bg-white/60 backdrop-blur-sm flex items-center justify-center text-brand shadow-sm">
                    <ServiceCategoryIcon type={service.icon} className="w-8 h-8" />
                  </div>
                  {service.badge && (
                    <span className="text-xs font-semibold bg-brand text-white px-2.5 py-1 rounded-full">
                      {service.badge}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="px-6 py-5 flex flex-col flex-1">
                  <span className="text-xs font-medium text-brand/60 uppercase tracking-wider mb-1">{service.category}</span>
                  <h3 className="text-xl font-semibold text-[#1a3520] mb-2 leading-snug group-hover:text-brand transition-colors">{service.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed flex-1">{service.shortDescription}</p>

                  <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
                    <div>
                      <span className="bold-hover text-2xl font-bold text-brand">₹{service.price.toLocaleString('en-IN')}</span>
                      <span className="text-gray-400 text-sm ml-1">/ session</span>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <div className="text-sm text-gray-500 flex items-center gap-1.5">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6l4 2"/>
                        </svg>
                        {service.duration}
                      </div>
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand bg-[#edf6ef] px-2 py-0.5 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse inline-block" />
                        Online
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={() => setModalItem({ ...service, type: 'service' })}
                      className="flex-1 text-center rounded-full bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
                    >
                      Book Now
                    </button>
                    <Link
                      href={`/book/${service.slug}`}
                      className="flex-1 text-center rounded-full border border-brand px-4 py-2.5 text-sm font-semibold text-brand hover:bg-brand hover:text-white transition-all"
                    >
                      Learn More
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16 text-gray-400">No services found for this category.</div>
          )}
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-brand to-[#1a3520] py-16 md:py-20 text-white">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-4xl md:text-5xl font-semibold mb-4">Not Sure Where to Start?</h2>
            <p className="text-lg mb-8 text-white/80 max-w-xl mx-auto">
              Book a free 15-minute discovery call and we'll help you find the right service for your needs.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-base font-semibold text-brand shadow-lg hover:shadow-xl transition-shadow"
              >
                Get Free Consultation <ArrowRightIcon className="w-4 h-4" />
              </Link>
              <a
                href="tel:+917980925582"
                className="inline-flex items-center gap-2 rounded-full border-2 border-white/40 px-8 py-4 text-base font-semibold text-white hover:bg-white/10 transition-all"
              >
                <PhoneIcon className="w-4 h-4" /> Call Us
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <SlotPickerModal
        isOpen={!!modalItem}
        onClose={() => setModalItem(null)}
        item={modalItem}
      />
    </div>
  )
}
