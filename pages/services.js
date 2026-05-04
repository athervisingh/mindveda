import Header from '../components/Header'
import Footer from '../components/Footer'
import Link from 'next/link'
import { motion } from 'framer-motion'

const services = [
  {
    id: 1,
    title: 'Online Counseling',
    description: 'Connect with experienced therapists from the comfort of your home. Confidential one-on-one sessions tailored to your needs.',
    icon: '💬',
    price: 'Starting at $50/session'
  },
  {
    id: 2,
    title: 'Yoga & Wellness',
    description: 'Holistic wellness programs combining yoga, meditation, and mindfulness practices for physical and mental balance.',
    icon: '🧘',
    price: 'Starting at $40/session'
  },
  {
    id: 3,
    title: 'Couples Therapy',
    description: 'Strengthen your relationship with guided sessions focused on communication, trust, and emotional connection.',
    icon: '💑',
    price: 'Starting at $70/session'
  },
  {
    id: 4,
    title: 'Healing Retreats',
    description: 'Transformational retreat experiences designed to rejuvenate your mind, body, and spirit in serene environments.',
    icon: '🌿',
    price: 'Starting at $500/retreat'
  },
  {
    id: 5,
    title: 'Stress Management',
    description: 'Learn effective techniques to manage stress and anxiety through personalized coaching and practical strategies.',
    icon: '🧠',
    price: 'Starting at $45/session'
  },
  {
    id: 6,
    title: 'Life Coaching',
    description: 'Goal-oriented coaching to help you achieve personal and professional milestones with confidence and clarity.',
    icon: '🎯',
    price: 'Starting at $60/session'
  },
]

export default function Services() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fbfaf7] text-gray-900">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-brand/10 to-brand/5 py-16 md:py-24">
          <div className="max-w-6xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <h1 className="text-5xl md:text-6xl font-semibold text-[#2d2343] mb-6">
                Our Services
              </h1>
              <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                Comprehensive wellness solutions designed to support you at every stage of your healing journey.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="max-w-6xl mx-auto px-6 py-20">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
              >
                <div className="text-5xl mb-4">{service.icon}</div>
                <h3 className="text-2xl font-semibold text-[#2d2343] mb-4">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {service.description}
                </p>
                <p className="text-brand font-semibold mb-6">{service.price}</p>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="/packages"
                    className="inline-block rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
                  >
                    Learn More
                  </Link>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-brand to-brand/80 py-16 md:py-20 text-white">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-4xl md:text-5xl font-semibold mb-6">
              Ready to Start Your Healing Journey?
            </h2>
            <p className="text-lg mb-8 text-white/90">
              Schedule your first session today and experience the transformation you deserve.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/packages"
                className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-base font-semibold text-brand shadow-lg hover:shadow-xl"
              >
                Book a Session <span>→</span>
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
