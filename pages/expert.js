import Header from '../components/Header'
import Footer from '../components/Footer'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { CheckIcon, ArrowRightIcon } from '../components/Icons'

const pillars = [
  {
    years: '5',
    unit: 'Years',
    domain: 'Psychological Counseling',
    description:
      'Guiding individuals through stress, anxiety, emotional challenges, relationship concerns, and personal growth — with a compassionate, practical, and non-judgmental presence.',
    icon: (
      <svg viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
        <circle cx="22" cy="14" r="5" />
        <path d="M12 38c0-5.5 4.5-10 10-10s10 4.5 10 10" />
        <path d="M8 24c2-3 5-4.5 8-4" />
        <path d="M36 24c-2-3-5-4.5-8-4" />
      </svg>
    ),
    color: 'from-[#edf6ef] to-[#f7fbf8]',
    border: 'border-[#b7d9c0]',
    tag: 'Mental Health',
  },
  {
    years: '10',
    unit: 'Years',
    domain: 'Social Counseling',
    description:
      'Through dedicated NGO work, supporting individuals and families in overcoming personal and social challenges — bringing empathy, clarity, and meaningful guidance to every interaction.',
    icon: (
      <svg viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
        <circle cx="15" cy="14" r="4" />
        <circle cx="29" cy="14" r="4" />
        <path d="M6 36c0-4.5 4-8 9-8" />
        <path d="M38 36c0-4.5-4-8-9-8" />
        <path d="M16 28c1.8-.7 3.7-1 6-1s4.2.3 6 1" />
        <path d="M16 36c0-3.5 2.7-6 6-6s6 2.5 6 6" />
      </svg>
    ),
    color: 'from-[#fdf6e8] to-[#fdf9f0]',
    border: 'border-[#e8d09a]',
    tag: 'NGO · Community',
  },
  {
    years: '12+',
    unit: 'Years',
    domain: 'Yoga & Wellness',
    description:
      'Integrating holistic yoga and wellness practices to restore emotional balance, build inner resilience, and nurture lasting well-being — uniting body, mind, and spirit.',
    icon: (
      <svg viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
        <path d="M22 7C22 7 10 14 10 24c0 6 5.5 11 12 11s12-5 12-11c0-10-12-17-12-17Z" />
        <path d="M22 35V7" />
        <path d="M22 18q-5 3-7 8" />
        <path d="M22 22q5-3 7 2" />
      </svg>
    ),
    color: 'from-[#f0edf8] to-[#f8f6fc]',
    border: 'border-[#c9bfde]',
    tag: 'Holistic · Mindful',
  },
]

const specializations = [
  'Stress & Anxiety Management',
  'Emotional Wellbeing',
  'Relationship Counseling',
  'Personal Growth & Resilience',
  'Community & Family Support',
  'Yoga & Mindful Wellness',
  'Emotional Balance',
  'Compassion-Led Healing',
]

export default function Expert() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fbfaf7] text-gray-900">
      <Header />

      <main className="flex-1">

        {/* ── HERO ─────────────────────────────────────── */}
        <section className="relative overflow-hidden">
          <Image
            src="/babita.webp"
            alt="Babita Kumari – Mind Veda Expert"
            width={1672}
            height={771}
            className="w-full h-auto block"
            priority
          />
          {/* Left dark gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/35 to-transparent" />
          {/* Extra left shadow for text visibility */}
          <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-black/60 via-black/30 to-transparent blur-sm" />

          {/* Content */}
          <div className="absolute inset-0 flex items-center">
            <div className="w-full sm:w-1/2 px-5 sm:px-10 md:px-16 lg:px-20">
              <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
                <span className="hidden md:inline-flex items-center px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/90 text-xs font-semibold tracking-widest uppercase mb-4">
                  Online Counselling Services
                </span>
                <h1 className="text-base sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white leading-tight mb-1.5 sm:mb-3 md:mb-4 drop-shadow-lg">
                  <span className="whitespace-nowrap">Every Mind Deserves</span><br />
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

        {/* ── ABOUT ────────────────────────────────────── */}
        <section className="max-w-6xl mx-auto px-6 py-16 md:py-24">
          <div className="grid lg:grid-cols-[0.6fr_1.4fr] gap-10 md:gap-16 items-center">

            {/* Photo */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="w-full"
            >
              <div className="relative w-full rounded-[28px] overflow-hidden shadow-xl">
                <Image src="/about.webp" alt="Babita Kumari – Mind Veda" width={900} height={1320} className="w-full h-auto block" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a3520]/30 to-transparent" />
              </div>
            </motion.div>

            {/* Text */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="pt-6 lg:pt-0"
            >
              <p className="text-brand text-xs uppercase tracking-[0.26em] font-semibold mb-3">About Babita</p>
              <h2 className="heading-hover text-3xl md:text-4xl font-semibold text-[#1a3520] leading-snug mb-6">
                Healing through compassion, clarity & holistic wisdom
              </h2>

              <div className="space-y-4 text-gray-600 leading-7 text-sm md:text-base">
                <p>
                  Babita Kumari is a <strong>Counseling Psychologist</strong> with 5 years of dedicated experience helping individuals navigate stress, anxiety, emotional challenges, relationship concerns, and personal growth — through a compassionate and practical approach that creates lasting change.
                </p>
                <p>
                  With <strong>10 years of social counseling</strong> through NGO work, she has walked alongside individuals and families from diverse backgrounds, supporting them in overcoming personal and social challenges with empathy, clarity, and grounded guidance.
                </p>
                <p>
                  Deeply rooted in holistic well-being, Babita brings <strong>12+ years of yoga and wellness</strong> expertise — seamlessly integrating mindful practices to restore emotional balance, build inner resilience, and nurture overall well-being in every person she works with.
                </p>
              </div>

              <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }} className="mt-8 inline-block">
                <Link
                  href="/yoga"
                  className="inline-flex items-center gap-2 rounded-full bg-[#2d4f3a] text-white px-7 py-3.5 text-sm font-semibold shadow-lg hover:bg-[#1f3829] transition-colors"
                >
                  Book a Session with Babita <ArrowRightIcon className="w-4 h-4" />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ── THREE EXPERIENCE PILLARS ─────────────────── */}
        <section className="bg-white border-y border-gray-100 py-16 md:py-20">
          <div className="max-w-6xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <p className="text-brand text-xs uppercase tracking-[0.26em] font-semibold mb-2">Experience</p>
              <h2 className="heading-hover text-3xl md:text-4xl font-semibold text-[#1a3520]">Three Pillars of Expertise</h2>
              <p className="mt-3 text-gray-500 text-sm md:text-base max-w-lg mx-auto">
                A rare combination of clinical psychology, community service, and holistic wellness — unified by one mission: your well-being.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {pillars.map((p, i) => (
                <motion.div
                  key={p.domain}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -6, scale: 1.015 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className={`card-anim group relative bg-gradient-to-br ${p.color} rounded-[24px] border ${p.border} p-7 flex flex-col gap-4`}
                >
                  {/* Tag */}
                  <span className="inline-flex self-start px-2.5 py-0.5 rounded-full bg-white/70 text-[11px] font-semibold text-gray-500 border border-white">
                    {p.tag}
                  </span>

                  {/* Years badge */}
                  <div className="flex items-end gap-1.5">
                    <span className="bold-hover text-5xl font-bold text-[#1a3520] leading-none">{p.years}</span>
                    <span className="text-sm text-gray-500 mb-1.5 font-medium">{p.unit}</span>
                  </div>

                  {/* Icon + title */}
                  <div className="flex items-center gap-3 text-brand">
                    {p.icon}
                    <h3 className="text-lg font-semibold text-[#1a3520] group-hover:text-brand transition-colors leading-snug">
                      {p.domain}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-600 leading-6">{p.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SPECIALIZATIONS ──────────────────────────── */}
        <section className="max-w-6xl mx-auto px-6 py-16 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <p className="text-brand text-xs uppercase tracking-[0.26em] font-semibold mb-2">Areas of Focus</p>
            <h2 className="heading-hover text-3xl md:text-4xl font-semibold text-[#1a3520]">How Babita Can Help You</h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {specializations.map((spec, i) => (
              <motion.div
                key={spec}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: (i % 4) * 0.07 }}
                viewport={{ once: true }}
                className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-brand/20 transition-all p-5 flex items-center gap-3"
              >
                <span className="w-7 h-7 rounded-full bg-[#edf6ef] flex items-center justify-center text-brand flex-shrink-0 group-hover:bg-brand group-hover:text-white transition-colors">
                  <CheckIcon className="w-3.5 h-3.5" />
                </span>
                <p className="text-sm font-semibold text-gray-700 group-hover:text-[#1a3520] transition-colors leading-snug">{spec}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── APPROACH / PHILOSOPHY ────────────────────── */}
        <section className="max-w-6xl mx-auto px-6 pb-16 md:pb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-[#fffaf0] to-[#f7fbf5] rounded-[32px] border border-[#e8dfc0] p-8 md:p-12"
          >
            <div className="grid md:grid-cols-3 gap-6 md:gap-10">
              {[
                {
                  title: 'Compassionate',
                  desc: 'Every session is a safe, non-judgmental space — where your feelings are heard, respected, and understood.',
                  icon: '🌿',
                },
                {
                  title: 'Practical',
                  desc: 'Guidance that is actionable and rooted in real-life experiences — tools you can use right away for lasting change.',
                  icon: '🧭',
                },
                {
                  title: 'Holistic',
                  desc: 'Blending modern psychology with yoga and wellness traditions to heal the whole person — mind, heart, and body.',
                  icon: '✨',
                },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="text-3xl mb-3">{item.icon}</div>
                  <h3 className="text-xl font-semibold text-[#1a3520] mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm leading-6">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ── CTA ──────────────────────────────────────── */}
        <section className="bg-gradient-to-r from-[#1a3520] to-[#2d4f3a] py-16 md:py-20 text-white">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-5xl font-semibold mb-4 leading-tight"
              style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
              Ready to Begin Your Journey?
            </h2>
            <p className="text-lg mb-8 text-white/75 max-w-xl mx-auto leading-relaxed">
              Take the first step toward emotional clarity, inner peace, and lasting well-being — with Babita by your side.
            </p>
            <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }} className="inline-block">
              <Link
                href="/yoga"
                className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-base font-semibold text-[#1a3520] shadow-xl hover:shadow-2xl transition-shadow"
              >
                Book a Session <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  )
}
