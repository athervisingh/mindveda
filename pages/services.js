import Header from '../components/Header'
import Footer from '../components/Footer'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { allServices } from '../lib/siteContent'
import { useState } from 'react'
import SlotPickerModal from '../components/SlotPickerModal'

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
        <section className="bg-gradient-to-br from-[#2d2343] to-brand py-20 md:py-28 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-white blur-3xl" />
            <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-brand-accent blur-3xl" />
          </div>
          <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-white/80 text-sm font-medium mb-6 border border-white/20">
                Online Counselling Services
              </span>
              <h1 className="text-5xl md:text-6xl font-semibold text-white mb-6 leading-tight">
                Every Mind Deserves<br />
                <span className="text-brand-accent">Expert Care</span>
              </h1>
              <p className="text-lg text-white/75 max-w-2xl mx-auto leading-relaxed">
                From individual therapy to group support, our certified psychologists offer evidence-based counseling for every stage of your mental wellness journey.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-white/70">
                <div className="flex items-center gap-2"><span className="w-2 h-2 bg-green-400 rounded-full" /> 100% Confidential</div>
                <div className="flex items-center gap-2"><span className="w-2 h-2 bg-green-400 rounded-full" /> Certified Psychologists</div>
                <div className="flex items-center gap-2"><span className="w-2 h-2 bg-green-400 rounded-full" /> Flexible Online Sessions</div>
                <div className="flex items-center gap-2"><span className="w-2 h-2 bg-green-400 rounded-full" /> Multi-lingual Support</div>
              </div>
            </motion.div>
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
                <div className="text-2xl font-bold text-brand">{s.val}</div>
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
                transition={{ duration: 0.45, delay: (index % 6) * 0.07 }}
                viewport={{ once: true }}
                className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-gray-100 flex flex-col"
              >
                {/* Top gradient band */}
                <div className={`bg-gradient-to-r ${service.color} px-6 pt-6 pb-4 flex items-start justify-between`}>
                  <span className="text-4xl">{service.icon}</span>
                  {service.badge && (
                    <span className="text-xs font-semibold bg-brand text-white px-2.5 py-1 rounded-full">
                      {service.badge}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="px-6 py-5 flex flex-col flex-1">
                  <span className="text-xs font-medium text-brand/60 uppercase tracking-wider mb-1">{service.category}</span>
                  <h3 className="text-xl font-semibold text-[#2d2343] mb-2 leading-snug">{service.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed flex-1">{service.shortDescription}</p>

                  {/* Price & Duration */}
                  <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
                    <div>
                      <span className="text-2xl font-bold text-brand">₹{service.price.toLocaleString('en-IN')}</span>
                      <span className="text-gray-400 text-sm ml-1">/ session</span>
                    </div>
                    <div className="text-sm text-gray-500 flex items-center gap-1.5">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6l4 2"/>
                      </svg>
                      {service.duration}
                    </div>
                  </div>

                  {/* CTAs */}
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
        <section className="bg-gradient-to-r from-brand to-[#2d2343] py-16 md:py-20 text-white">
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
                Get Free Consultation <span>→</span>
              </Link>
              <a
                href="tel:+917980925582"
                className="inline-flex items-center gap-2 rounded-full border-2 border-white/40 px-8 py-4 text-base font-semibold text-white hover:bg-white/10 transition-all"
              >
                📞 Call Us
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
