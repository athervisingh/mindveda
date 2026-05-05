import Header from '../components/Header'
import Footer from '../components/Footer'
import Link from 'next/link'
import ServiceCard from '../components/ServiceCard'
import FeaturedService from '../components/FeaturedService'
import TestimonialCarousel from '../components/TestimonialCarousel'
import ImagePlaceholder from '../components/ImagePlaceholder'
import { motion } from 'framer-motion'
import { featuredCards, homepageServices } from '../lib/siteContent'
import Image from 'next/image'

const heroStats = [
  { value: '1000+', label: 'Lives transformed' },
  { value: '15+', label: 'Years experience' },
  { value: '18+', label: 'Cities & retreats' },
]

const trustPoints = ['100% Confidential', 'Expert Therapist', 'Flexible Sessions']

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fbfaf7] text-gray-900">
      <Header />

      <main className="flex-1">

        {/* ══ HERO ══════════════════════════════════════════════════════ */}
        <section className="relative bg-white w-full">

          {/* Full image — natural aspect ratio, no cropping ever */}
          <Image
            src="/hero2.png"
            alt="Babita – Mind Veda"
            width={11811}
            height={5906}
            className="w-full h-[92vh] object-cover block"
            priority
          />

          {/* Text content — absolutely over the image's white left area */}
          <div className="absolute top-[-160px] inset-0 flex flex-col justify-center w-[48%] pl-[4%]">

            {/* Welcome To */}
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-2 mb-5"
            >
              <div className="flex items-center">
                <div className="h-px w-36 bg-[#4a5e3a]/60" />
                <svg width="20" height="20" viewBox="0 0 12 12" fill="none" className="text-[#4a5e3a]">
                  <path d="M6 10C6 10 2 7.5 2 4.5C2 3 3.5 2 5 3C5 2 5.5 1 6 1C6.5 1 7 2 7 3C8.5 2 10 3 10 4.5C10 7.5 6 10 6 10Z" stroke="currentColor" strokeWidth="0.9" fill="none" />
                </svg>
              </div>
              <span className="text-[25px] tracking-[0.2em] uppercase text-[#22271d] font-semibold" style={{ fontFamily: 'Lato, sans-serif' }}>
                &nbsp; Welcome To &nbsp;
              </span>
              <div className="flex items-center">
                <svg width="20" height="20" viewBox="0 0 12 12" fill="none" className="text-[#4a5e3a] scale-x-[-1]">
                  <path d="M6 10C6 10 2 7.5 2 4.5C2 3 3.5 2 5 3C5 2 5.5 1 6 1C6.5 1 7 2 7 3C8.5 2 10 3 10 4.5C10 7.5 6 10 6 10Z" stroke="currentColor" strokeWidth="0.9" fill="none" />
                </svg>
                <div className="h-px w-36 bg-[#4a5e3a]/60" />
              </div>
            </motion.div>

            {/* Mind Veda – thin elegant serif */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.1 }}
              className="leading-none text-[#1a3520]"
              style={{
                fontFamily: 'Playfair Display, Georgia, serif',
                fontSize: 'clamp(4.5rem, 10vw, 8.5rem)',
                fontWeight: 400,
              }}
            >
              Mind Veda
            </motion.h1>

            {/* by Babita – script + lotus */}
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="flex items-center gap-2 -mt-1"
              style={{
                justifyContent: 'center',
                alignContent: 'center',
                width: '80%',
                fontSize: 'clamp(5.8rem, 4vw, 2.8rem)',
              }}
            >
              <span
                className="text-[#8a6914]"
                style={{ fontFamily: 'Great Vibes, cursive', fontSize: '80px',fontWeight:500, }}
              >
                by &thinsp; Babita
              </span>
              <svg width="58" height="58" viewBox="0 0 32 32" fill="none" className="text-[#8a6914] flex-shrink-0">
                <path d="M16 28C16 28 6 22 6 14C6 10 10 8 13 10C13 8 14 6 16 6C18 6 19 8 19 10C22 8 26 10 26 14C26 22 16 28 16 28Z" stroke="currentColor" strokeWidth="1.4" fill="none" />
                <path d="M16 28C16 28 10 20 10 14M16 28C16 28 22 20 22 14" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
                <line x1="16" y1="10" x2="16" y2="28" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
              </svg>
            </motion.div>

            {/* Divider */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, delay: 0.38 }}
              className="mt-4 mb-5 origin-left"
            >
              <div className="flex items-center gap-2 justify-center" style={{width:'76%'}}>
                <div className="h-1 w-40 bg-gradient-to-r from-[#4a5e3a]/70 to-[#4a5e3a]/10" />
                <div className="w-1 h-1 rounded-full bg-[#8a6914]" />
                <div className="w-1 h-1 rounded-full bg-[#8a6914]" />
                 <div className="h-1 w-40 bg-gradient-to-l from-[#4a5e3a]/70 to-[#4a5e3a]/10" />
              </div>
            </motion.div>

            {/* Sub-heading */}
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.45 }}
              className="text-[#1a3520] leading-snug"
              style={{
                fontFamily: 'Georgia, serif',
                fontSize: 'clamp(1.4rem, 2.6vw, 2rem)',
              }}
            >
              Heal Your Mind,<br />Transform Your Life
            </motion.h2>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.55 }}
              className="mt-4 text-[#3d3d2a] leading-relaxed"
              style={{ fontFamily: 'Lato, sans-serif', fontWeight: 600, fontSize: '0.93rem', maxWidth: '26rem' }}
            >
              Mind Veda by Babita is your journey toward inner peace, emotional balance, and self-discovery through mindful guidance and holistic healing.
            </motion.p>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.65 }}
              className="mt-7 flex flex-wrap gap-3"
            >
              <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href="/packages"
                  className="inline-flex items-center gap-2 rounded-full bg-[#2a6c39] text-white px-6 py-3 text-sm font-semibold hover:bg-[#243f2b] transition-all duration-300 shadow-md"
                  style={{ fontFamily: 'Lato, sans-serif' }}
                > 
                  <svg width="16" height="16" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <path d="M16 28C16 28 6 22 6 14C6 10 10 8 13 10C13 8 14 6 16 6C18 6 19 8 19 10C22 8 26 10 26 14C26 22 16 28 16 28Z" />
                    <line x1="16" y1="10" x2="16" y2="28" />
                  </svg>
                  Start Your Journey
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href="/services"
                  className="inline-flex items-center gap-2 rounded-full border border-[#1a3520]/35 bg-white/70 text-[#1a3520] px-6 py-3 text-sm font-semibold hover:bg-white transition-all duration-300"
                  style={{ fontFamily: 'Lato, sans-serif' }}
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#1a3520]/10">
                    <svg width="7" height="9" viewBox="0 0 8 10" fill="currentColor"><path d="M0 0L8 5L0 10V0Z" /></svg>
                  </span>
                  Watch Video
                </Link>
              </motion.div>
            </motion.div>

          </div>

          {/* ── SERVICE ICONS — absolutely at bottom-left ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.9 }}
            className="absolute bottom-0 left-0 z-10 pl-[10%] pb-[4%]"
          >
            <div className="flex items-start gap-0 divide-x divide-[#1a3520]/15 border-t border-[#1a3520]/10 pt-5 w-fit">
              {[
                {
                  label1: 'Mindfulness', label2: 'Practices',
                  icon: <svg width="46" height="46" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><path d="M14 4C14 4 8 8 8 14C8 17.31 10.69 20 14 20C17.31 20 20 17.31 20 14C20 8 14 4 14 4Z" /><path d="M14 20V24M10 24H18" /><path d="M7 10C5 10 3 12 3 14M21 10C23 10 25 12 25 14" /></svg>
                },
                {
                  label1: 'Emotional', label2: 'Wellbeing',
                  icon: <svg width="46" height="46" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><circle cx="14" cy="10" r="5" /><path d="M6 24C6 19.58 9.58 16 14 16C18.42 16 22 19.58 22 24" /></svg>
                },
                {
                  label1: 'Holistic', label2: 'Healing',
                  icon: <svg width="46" height="46" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><path d="M14 6L16 10H21L17 13L19 18L14 15L9 18L11 13L7 10H12L14 6Z" /><circle cx="14" cy="14" r="11" strokeWidth="1" /></svg>
                },
                {
                  label1: 'Personal', label2: 'Growth',
                  icon: <svg width="46" height="46" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><path d="M6 22C6 22 8 14 14 10C20 6 22 6 22 6C22 6 22 8 18 14C14 20 6 22 6 22Z" /><path d="M6 22L12 16" /><circle cx="14" cy="10" r="1.5" fill="currentColor" /></svg>
                },
              ].map(({ label1, label2, icon }, i) => (
                <motion.div
                  key={label1}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 + i * 0.07 }}
                  whileHover={{ y: -2 }}
                  className="flex flex-col items-center gap-1.5 px-6 cursor-default text-[#4a5e3a]"
                >
                  {icon}
                  <div className="text-center" style={{ fontFamily: 'Lato, sans-serif' }}>
                    <div className="text-[11px] font-semibold text-[#1a3520]">{label1}</div>
                    <div className="text-[11px] font-light text-[#5a5a3a]">{label2}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

        </section>

        {/* ── QUOTE BANNER ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="bg-white border-b border-gray-100"
        >
          <div className="max-w-4xl mx-auto px-8 py-5 flex items-center justify-center gap-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#4a5e3a]/20" />
            <svg width="22" height="22" viewBox="0 0 32 32" fill="none" className="text-[#8a6914] flex-shrink-0">
              <path d="M16 28C16 28 6 22 6 14C6 10 10 8 13 10C13 8 14 6 16 6C18 6 19 8 19 10C22 8 26 10 26 14C26 22 16 28 16 28Z" stroke="currentColor" strokeWidth="1.6" fill="none" />
              <line x1="16" y1="10" x2="16" y2="28" stroke="currentColor" strokeWidth="1.4" />
            </svg>
            <p
              className="text-center text-[#3d3d2a]"
              style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 'clamp(0.85rem, 1.8vw, 1.05rem)', fontStyle: 'italic' }}
            >
              "The mind is everything. What you think, you become."
              <span className="ml-2 not-italic font-semibold text-[#8a6914]">– Buddha</span>
            </p>
            <svg width="22" height="22" viewBox="0 0 32 32" fill="none" className="text-[#8a6914] flex-shrink-0">
              <path d="M16 28C16 28 6 22 6 14C6 10 10 8 13 10C13 8 14 6 16 6C18 6 19 8 19 10C22 8 26 10 26 14C26 22 16 28 16 28Z" stroke="currentColor" strokeWidth="1.6" fill="none" />
              <line x1="16" y1="10" x2="16" y2="28" stroke="currentColor" strokeWidth="1.4" />
            </svg>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#4a5e3a]/20" />
          </div>
        </motion.div>

        <section className="max-w-6xl mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-brand text-sm uppercase tracking-[0.28em] font-semibold">What we offer</p>
            <h2 className="mt-3 text-3xl md:text-4xl font-semibold text-[#2d2343]">Support for every chapter of life</h2>
          </motion.div>

          <div className="grid md:grid-cols-5 gap-6">
            {homepageServices.map((service, index) => (
              <ServiceCard key={service.title} icon={service.icon} title={service.title} description={service.description} />
            ))}
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 py-8">
          <div className="grid md:grid-cols-3 gap-6">
            {featuredCards.map((card, index) => (
              <FeaturedService key={card.title} index={index} title={card.title} description={card.description} features={card.features} />
            ))}
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-[0.95fr_1.05fr] gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute -left-6 -top-6 h-24 w-24 rounded-full bg-brand/10 blur-2xl" />
              <ImagePlaceholder width="w-full" height="h-[460px]" label="Babita image placeholder" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <p className="text-brand text-sm uppercase tracking-[0.24em] font-semibold">About Babita</p>
              <h2 className="mt-3 text-3xl md:text-4xl font-semibold text-[#2d2343]">Hi, I'm Babita</h2>
              <p className="mt-2 text-lg text-gray-600">Your partner in healing and growth.</p>
              <p className="mt-6 text-gray-600 leading-8 max-w-2xl">
                With 15+ years of experience in clinical psychology and holistic wellness, I blend science-backed therapy with mindful practices to help people heal deeply and live fully.
              </p>

              <div className="mt-8 grid grid-cols-3 gap-4 max-w-xl">
                {heroStats.map((stat) => (
                  <div key={stat.label} className="rounded-2xl bg-white p-4 text-center shadow-soft">
                    <div className="text-2xl font-semibold text-brand">{stat.value}</div>
                    <div className="mt-1 text-xs text-gray-500">{stat.label}</div>
                  </div>
                ))}
              </div>

              <blockquote className="mt-8 rounded-[28px] border border-gray-100 bg-white p-6 shadow-soft">
                <div className="text-4xl text-brand/40">“</div>
                <p className="mt-2 text-lg italic text-gray-700">
                  Everyone has the strength within themselves. I'm here to help you unlock it.
                </p>
              </blockquote>
            </motion.div>
          </div>
        </section>

        <TestimonialCarousel />

        <section className="max-w-6xl mx-auto px-6 py-20">
          <div className="flex items-center justify-between mb-10">
            <div>
              <p className="text-brand text-sm uppercase tracking-[0.24em] font-semibold">From our blog</p>
              <h2 className="mt-2 text-3xl font-semibold text-[#2d2343]">Practical articles and emotional support</h2>
            </div>
            <Link href="/blog" className="text-sm font-medium text-brand">View all articles →</Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              'Morning Rituals to Reduce Anxiety Before Work',
              'Somatic Healing: How Your Body Stores Stress',
              'Healthy Boundaries: The Ultimate Act of Self-Love',
            ].map((title, index) => (
              <motion.article
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                viewport={{ once: true }}
                className="group overflow-hidden rounded-[28px] border border-gray-100 bg-white shadow-soft"
              >
                <ImagePlaceholder width="w-full" height="h-52" label="" />
                <div className="p-6">
                  <div className="inline-flex rounded-full bg-[#f4edf8] px-3 py-1 text-xs font-medium text-brand">Mindfulness</div>
                  <h3 className="mt-4 text-xl font-semibold text-[#2d2343] group-hover:text-brand transition-colors">{title}</h3>
                  <p className="mt-3 text-sm leading-7 text-gray-600">A dummy article card with a premium layout, perfect for your later real content.</p>
                  <Link href="/blog" className="mt-5 inline-flex text-sm font-medium text-brand">Read more →</Link>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 pb-20">
          <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-8 items-stretch">
            <div className="rounded-[32px] bg-[#fffaf0] p-8 shadow-soft">
              <p className="text-brand text-sm uppercase tracking-[0.24em] font-semibold">Begin your journey today</p>
              <h2 className="mt-3 text-3xl font-semibold text-[#2d2343]">A calm first step for booking and support</h2>
              <p className="mt-4 text-gray-600 leading-8 max-w-2xl">
                You can book a session, choose a package, or simply send a message. The experience should feel warm, premium, and reassuring from the first click.
              </p>

              <div className="mt-8 grid gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-3"><span className="text-brand">📞</span> +91 98765 43210</div>
                <div className="flex items-center gap-3"><span className="text-brand">📧</span> hello@mindveda.com</div>
                <div className="flex items-center gap-3"><span className="text-brand">📍</span> Delhi | Mumbai | Bangalore</div>
              </div>
            </div>

            <motion.div
              whileHover={{ y: -6 }}
              className="rounded-[32px] bg-gradient-to-br from-brand to-brand-light p-8 text-white shadow-2xl shadow-brand/20"
            >
              <div className="text-sm uppercase tracking-[0.24em] text-white/70">Schedule a free 15-min consultation</div>
              <h3 className="mt-4 text-3xl font-semibold leading-tight">Let's talk about how we can help you feel better.</h3>
              <p className="mt-4 text-white/80 leading-7">The payment UI is ready, and Razorpay can be plugged in later without redesigning the flow.</p>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                <Link href="/packages" className="mt-8 inline-flex rounded-full bg-white px-6 py-3 font-semibold text-brand shadow-lg">Schedule now →</Link>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
