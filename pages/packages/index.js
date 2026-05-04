import Header from '../../components/Header'
import Footer from '../../components/Footer'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { servicePackages } from '../../lib/siteContent'
import { useState } from 'react'
import SlotPickerModal from '../../components/SlotPickerModal'

export default function Packages() {
  const [modalItem, setModalItem] = useState(null)

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfaf7]">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-[#2d2343] to-brand py-20 md:py-28 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-white blur-3xl" />
            <div className="absolute bottom-10 right-20 w-80 h-80 rounded-full bg-brand-accent blur-3xl" />
          </div>
          <div className="max-w-5xl mx-auto px-6 relative z-10">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-white/80 text-sm font-medium mb-6 border border-white/20">
                Healing Packages
              </span>
              <h1 className="text-5xl md:text-6xl font-semibold leading-tight mb-5">
                Choose Your<br /><span className="text-brand-accent">Healing Path</span>
              </h1>
              <p className="text-lg text-white/75 max-w-xl mb-8">
                Curated multi-session packages for deeper, more transformational healing. Pick a slot and add to cart — checkout when ready.
              </p>
              <div className="flex gap-4">
                <Link href="/cart" className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand shadow-lg hover:shadow-xl transition-shadow">
                  View Cart 🛒
                </Link>
                <Link href="/services" className="rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-all">
                  Individual Services
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Packages grid */}
        <section className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-2 gap-6">
            {servicePackages.map((pkg, index) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                viewport={{ once: true }}
                className="bg-white rounded-3xl shadow-sm hover:shadow-lg transition-all border border-gray-100 overflow-hidden flex flex-col"
              >
                {pkg.featured && (
                  <div className="bg-brand px-5 py-1.5 text-xs font-semibold text-white text-center tracking-wide">
                    ⭐ Most Popular
                  </div>
                )}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-brand/10 flex items-center justify-center text-2xl flex-shrink-0">🧠</div>
                    <div>
                      <h3 className="text-xl font-semibold text-[#2d2343]">{pkg.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">{pkg.excerpt}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mt-auto pt-4 border-t border-gray-100">
                    <div>
                      <span className="text-2xl font-bold text-brand">₹{pkg.price.toLocaleString('en-IN')}</span>
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
                      href={`/packages/${pkg.slug}`}
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
              ['1. Browse', 'Find the package that matches your healing goals.'],
              ['2. Pick a Slot', 'Choose your preferred date and time — add to cart.'],
              ['3. Checkout & Start', 'Review your cart, pay securely, and begin your journey.'],
            ].map(([title, desc]) => (
              <div key={title} className="rounded-[28px] bg-white p-6 shadow-soft border border-gray-100">
                <h3 className="text-lg font-semibold text-[#2d2343]">{title}</h3>
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
