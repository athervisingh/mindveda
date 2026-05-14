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
          {/* Background image — full natural size */}
          <Image
            src="/service.webp"
            alt="Online Counselling Services"
            width={1536}
            height={1024}
            className="w-full h-auto block"
            priority
          />
          {/* Overlay + content */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a3520]/85 via-[#2d4f3a]/80 to-[#1a3520]/75 flex items-center">
            <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 text-center">
              <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
                <span className="hidden sm:inline-block px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-white/10 text-white/80 text-xs sm:text-sm font-medium mb-3 sm:mb-6 border border-white/20">
                  Online Counselling Services
                </span>
                <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-white mb-2 sm:mb-4 md:mb-6 leading-tight">
                  Every Mind Deserves<br />
                  <span className="text-brand-accent">Expert Care</span>
                </h1>
                <p className="hidden sm:block text-sm sm:text-base md:text-lg text-white/75 max-w-2xl mx-auto leading-relaxed px-2">
                  From individual therapy to group support, our certified psychologists offer evidence-based counseling for every stage of your mental wellness journey.
                </p>
                <div className="hidden sm:flex mt-6 sm:mt-8 flex-wrap justify-center gap-3 sm:gap-6 text-xs sm:text-sm text-white/70">
                  {['100% Confidential', 'Certified Psychologists', 'Flexible Online Sessions', 'Multi-lingual Support'].map(t => (
                    <div key={t} className="flex items-center gap-1.5 sm:gap-2">
                      <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-brand-accent rounded-full flex-shrink-0" />
                      {t}
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
