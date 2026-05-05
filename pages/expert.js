import Header from '../components/Header'
import Footer from '../components/Footer'
import Link from 'next/link'
import { motion } from 'framer-motion'

const expertData = {
  name: 'Babita',
  title: 'Clinical Psychologist & Wellness Coach',
  bio: 'With over 15 years of experience in mental health and wellness, Babita has transformed the lives of 1000+ individuals across 18+ cities through evidence-based therapy, mindful practices, and transformational retreats.',
  qualifications: [
    'Ph.D. in Clinical Psychology',
    'Certified Life Coach (ICF)',
    'Yoga Instructor (RYT-200)',
    'Meditation Practitioner'
  ],
  specializations: [
    'Anxiety & Stress Management',
    'Depression & Trauma Healing',
    'Couples Counseling',
    'Life Transitions',
    'Mindfulness & Wellness',
    'Personal Growth Coaching'
  ],
  experience: [
    {
      year: '2009-2012',
      role: 'Clinical Psychologist',
      organization: 'Mental Health Research Institute'
    },
    {
      year: '2012-2018',
      role: 'Senior Counselor',
      organization: 'Wellness Retreat Centers'
    },
    {
      year: '2018-Present',
      role: 'Founder & Lead Therapist',
      organization: 'MindVeda by Babita'
    }
  ],
  achievements: [
    '1000+ Lives Transformed',
    '15+ Years of Clinical Experience',
    '18+ Cities & Retreat Locations',
    '100% Client Confidentiality Rating',
    'Featured in 20+ Wellness Publications',
    'TEDx Speaker on Mental Health'
  ]
}

export default function Expert() {
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
              <h1 className="text-5xl md:text-6xl font-semibold text-[#1a3520] mb-4">
                Meet Our Expert
              </h1>
              <p className="text-2xl text-brand font-light">
                {expertData.name}
              </p>
              <p className="text-lg text-gray-600 mt-2">
                {expertData.title}
              </p>
            </motion.div>
          </div>
        </section>

        {/* About Expert */}
        <section className="max-w-6xl mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="bg-gradient-to-br from-brand/20 to-brand/10 rounded-3xl h-96 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-7xl mb-4">👩‍⚕️</div>
                  <p className="text-gray-600 font-medium">{expertData.name}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-semibold text-[#1a3520] mb-6">
                About {expertData.name}
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                {expertData.bio}
              </p>

              <div className="mb-8">
                <h3 className="text-2xl font-semibold text-[#1a3520] mb-4">Qualifications</h3>
                <ul className="space-y-3">
                  {expertData.qualifications.map((qual, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-brand text-xl mt-1">✓</span>
                      <span className="text-gray-700">{qual}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/packages"
                  className="inline-flex items-center gap-2 rounded-full bg-brand px-8 py-4 text-base font-semibold text-white shadow-lg hover:shadow-xl"
                >
                  Book a Session with {expertData.name}
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Specializations */}
        <section className="max-w-6xl mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-semibold text-[#1a3520] mb-4">
              Areas of Specialization
            </h2>
            <p className="text-lg text-gray-600">
              Expert guidance across diverse wellness domains
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {expertData.specializations.map((spec, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-shadow"
              >
                <p className="text-lg font-semibold text-gray-800">{spec}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Experience Timeline */}
        <section className="max-w-6xl mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-semibold text-[#1a3520] mb-4">
              Professional Journey
            </h2>
          </motion.div>

          <div className="space-y-8">
            {expertData.experience.map((exp, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm"
              >
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-brand text-white font-bold">
                      {index + 1}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-brand">{exp.year}</p>
                    <h3 className="text-2xl font-semibold text-[#1a3520] mt-2">
                      {exp.role}
                    </h3>
                    <p className="text-lg text-gray-600 mt-1">{exp.organization}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Achievements */}
        <section className="max-w-6xl mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-semibold text-[#1a3520] mb-4">
              Achievements & Recognition
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {expertData.achievements.map((achievement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-brand/10 to-brand/5 rounded-2xl p-6 border border-brand/20 text-center"
              >
                <p className="text-xl font-semibold text-[#1a3520]">
                  {achievement}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-brand to-brand/80 py-16 md:py-20 text-white">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-4xl md:text-5xl font-semibold mb-6">
              Begin Your Transformation Today
            </h2>
            <p className="text-lg mb-8 text-white/90">
              Work with {expertData.name} to achieve lasting wellness and personal growth.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/packages"
                className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-base font-semibold text-brand shadow-lg hover:shadow-xl"
              >
                Book Your Session <span>→</span>
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
