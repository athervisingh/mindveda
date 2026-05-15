import Header from '../components/Header'
import Footer from '../components/Footer'
import Link from 'next/link'
import ServiceCard from '../components/ServiceCard'
import FeaturedService from '../components/FeaturedService'
import TestimonialCarousel from '../components/TestimonialCarousel'
import { motion } from 'framer-motion'
import { featuredCards, homepageServices, blogArticles } from '../lib/siteContent'
import Image from 'next/image'
import { PhoneIcon, MailIcon, MapPinIcon, ArrowRightIcon } from '../components/Icons'

const heroStats = [
  { value: '1000+', label: 'Lives transformed' },
  { value: '12+', label: 'Years experience' },
  { value: '18+', label: 'Cities & retreats' },
]

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fbfaf7] text-gray-900">
      <Header />

      <main className="flex-1">

        {/* ══ HERO — Mobile: landscape image + text below ══════════════ */}
        <section className="bg-white w-full">

          {/* ── MOBILE HERO (hidden on md+) ── */}
          <div className="md:hidden">
            {/* Landscape image — 16:9 ratio, never portrait */}
            <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
              <Image
                src="/hero2.webp"
                alt="Babita – Mind Veda"
                fill
                className="object-cover object-[70%_center]"
                priority
              />
              {/* subtle gradient at bottom for readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

              {/* ── overlay — top-left ── */}
              <motion.div
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="absolute top-3 left-0 w-[56%] flex flex-col pl-4 min-[380px]:pl-5"
              >
                <p className="text-[8px] min-[360px]:text-[9px] tracking-[0.22em] uppercase text-[#4a5e3a] font-bold mb-0.5">
                  Welcome To
                </p>
                <h1
                  className="text-[1.7rem] min-[360px]:text-[2.1rem] leading-none text-[#2d4f3a] font-normal"
                  style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
                >
                  Mind Veda
                </h1>
                <p
                  className="text-[1.45rem] min-[360px]:text-[1.75rem] text-[#8a6914] leading-tight mt-0.5"
                  style={{ fontFamily: 'Great Vibes, cursive' }}
                >
                  by Babita
                </p>
                <div className="h-px w-8 bg-[#4a5e3a]/40 my-1.5" />
                <p
                  className="text-[0.65rem] min-[360px]:text-[0.72rem] text-[#1a3520] font-semibold leading-snug"
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  Heal Your Mind,<br />Transform Your Life
                </p>
                <p
                  className="hidden min-[360px]:block text-[0.6rem] text-[#3d3d2a] leading-4 mt-1"
                  style={{ fontFamily: 'Lato, sans-serif', fontWeight: 600 }}
                >
                  Your journey toward inner peace, emotional balance, and self-discovery.
                </p>
              </motion.div>

              {/* Icons overlay on image — 400px+ only — MUST be inside relative container */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="hidden min-[400px]:flex absolute bottom-0 left-0 right-0 items-center gap-0 bg-black/30 backdrop-blur-sm px-1 py-2"
              >
                {[
                  { label1: 'Mindfulness', label2: 'Practices', icon: <svg width="26" height="26" viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="22" cy="8.5" r="3.2"/><path d="M22 11.7 L22 20"/><path d="M15 17.5 Q10 19 8 23"/><path d="M29 17.5 Q34 19 36 23"/><path d="M8 33 Q11 25 18 22 Q20 21.5 22 21.5 Q24 21.5 26 22 Q33 25 36 33"/><path d="M8 33 Q13 29 18 31 Q20 32 22 32 Q24 32 26 31 Q31 29 36 33"/></svg> },
                  { label1: 'Emotional', label2: 'Wellbeing', icon: <svg width="26" height="26" viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10 C16 10 11 14.5 11 20 C11 23 12.5 25.5 15 27 L15 32 L29 32 L29 27 C31.5 25.5 33 23 33 20 C33 14.5 28 10 22 10Z"/><path d="M22 10 C22 10 22 15 22 20"/><path d="M11.5 18 Q14 16 16 18 Q18 20 20 18"/><path d="M24 18 Q26 20 28 18 Q30 16 32.5 18"/><path d="M17 27 L17 32 M27 27 L27 32"/></svg> },
                  { label1: 'Holistic', label2: 'Healing', icon: <svg width="26" height="26" viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 7 C22 7 10 14 10 24 C10 30 15.5 35 22 35 C28.5 35 34 30 34 24 C34 14 22 7 22 7Z"/><path d="M22 35 L22 7"/><path d="M22 18 Q17 21 15 26"/><path d="M22 22 Q27 19 29 24"/><path d="M22 26 Q18 28 17 31"/></svg> },
                  { label1: 'Personal', label2: 'Growth', icon: <svg width="26" height="26" viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="22" cy="22" r="7"/><line x1="22" y1="7" x2="22" y2="11"/><line x1="22" y1="33" x2="22" y2="37"/><line x1="7" y1="22" x2="11" y2="22"/><line x1="33" y1="22" x2="37" y2="22"/><line x1="11.5" y1="11.5" x2="14.3" y2="14.3"/><line x1="29.7" y1="29.7" x2="32.5" y2="32.5"/><line x1="32.5" y1="11.5" x2="29.7" y2="14.3"/><line x1="14.3" y1="29.7" x2="11.5" y2="32.5"/></svg> },
                ].map(({ label1, label2, icon }) => (
                  <div key={label1} className="flex-1 flex flex-col items-center gap-0.5 text-white px-1">
                    {icon}
                    <div className="text-center leading-tight">
                      <div className="text-[8px] font-semibold">{label1}</div>
                      <div className="text-[8px] font-normal">{label2}</div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Text section below image */}
            <div className="bg-white px-5 pt-5 pb-8">

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="mt-5 flex gap-3"
              >
                <Link
                  href="/yoga"
                  className="flex-1 flex items-center justify-center gap-2 rounded-full bg-[#2a6c39] text-white py-3 text-sm font-semibold shadow-md active:scale-95 transition-transform"
                >
                  Start Journey
                </Link>
                <Link
                  href="/services"
                  className="flex-1 flex items-center justify-center gap-2 rounded-full border border-[#1a3520]/30 text-[#1a3520] py-3 text-sm font-semibold active:scale-95 transition-transform"
                >
                  Our Services
                </Link>
              </motion.div>

              {/* Stats strip */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="mt-6 grid grid-cols-3 gap-2"
              >
                {heroStats.map(stat => (
                  <div key={stat.label} className="bg-[#f7f4eb] rounded-xl p-3 text-center">
                    <div className="bold-hover text-lg font-bold text-brand">{stat.value}</div>
                    <div className="text-[9px] text-gray-500 mt-0.5 leading-tight">{stat.label}</div>
                  </div>
                ))}
              </motion.div>

              {/* Service icons — only below 400px, at 400px+ they show on image */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="mt-5 min-[400px]:hidden bg-[#faf7f0] rounded-2xl border border-[#e8dfc0] flex items-center px-1 py-3"
              >
                {[
                  { label1: 'Mindfulness', label2: 'Practices', icon: <svg width="32" height="32" viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="22" cy="8.5" r="3.2"/><path d="M22 11.7 L22 20"/><path d="M15 17.5 Q10 19 8 23"/><path d="M29 17.5 Q34 19 36 23"/><path d="M8 33 Q11 25 18 22 Q20 21.5 22 21.5 Q24 21.5 26 22 Q33 25 36 33"/><path d="M8 33 Q13 29 18 31 Q20 32 22 32 Q24 32 26 31 Q31 29 36 33"/></svg> },
                  { label1: 'Emotional', label2: 'Wellbeing', icon: <svg width="32" height="32" viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10 C16 10 11 14.5 11 20 C11 23 12.5 25.5 15 27 L15 32 L29 32 L29 27 C31.5 25.5 33 23 33 20 C33 14.5 28 10 22 10Z"/><path d="M22 10 C22 10 22 15 22 20"/><path d="M11.5 18 Q14 16 16 18 Q18 20 20 18"/><path d="M24 18 Q26 20 28 18 Q30 16 32.5 18"/><path d="M17 27 L17 32 M27 27 L27 32"/></svg> },
                  { label1: 'Holistic', label2: 'Healing', icon: <svg width="32" height="32" viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 7 C22 7 10 14 10 24 C10 30 15.5 35 22 35 C28.5 35 34 30 34 24 C34 14 22 7 22 7Z"/><path d="M22 35 L22 7"/><path d="M22 18 Q17 21 15 26"/><path d="M22 22 Q27 19 29 24"/><path d="M22 26 Q18 28 17 31"/></svg> },
                  { label1: 'Personal', label2: 'Growth', icon: <svg width="32" height="32" viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="22" cy="22" r="7"/><line x1="22" y1="7" x2="22" y2="11"/><line x1="22" y1="33" x2="22" y2="37"/><line x1="7" y1="22" x2="11" y2="22"/><line x1="33" y1="22" x2="37" y2="22"/><line x1="11.5" y1="11.5" x2="14.3" y2="14.3"/><line x1="29.7" y1="29.7" x2="32.5" y2="32.5"/><line x1="32.5" y1="11.5" x2="29.7" y2="14.3"/><line x1="14.3" y1="29.7" x2="11.5" y2="32.5"/></svg> },
                ].map(({ label1, label2, icon }) => (
                  <div key={label1} className="flex-1 flex flex-col items-center gap-1.5 text-[#8a7040] px-1">
                    {icon}
                    <div className="text-center">
                      <div className="text-[10px] font-semibold text-[#1f1d17] leading-tight">{label1}</div>
                      <div className="text-[10px] font-normal text-[#1f1d17] leading-tight">{label2}</div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>

          {/* ── DESKTOP HERO ≥768px — full-width image, content overlay left ── */}
          <div className="hidden md:block relative">
            <Image
              src="/hero2.webp"
              alt="Babita – Mind Veda"
              width={11811}
              height={5906}
              className="w-full h-auto block"
              priority
            />

            {/* Content overlay — stays within image height via overflow:hidden */}
            <div
              className="absolute inset-0 flex flex-col justify-center overflow-hidden"
              style={{ width: '50%', paddingLeft: '4%', paddingRight: '1.5%' }}
            >
              {/* Welcome To */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex items-center"
                style={{ gap: 'clamp(4px, 0.6vw, 10px)', marginBottom: 'clamp(0.4rem, 1.2vh, 1.4rem)' }}
              >
                <div className="h-px bg-[#4a5e3a]/60 flex-1" />
                <svg style={{ width: 'clamp(12px,1.2vw,20px)', height: 'clamp(12px,1.2vw,20px)', flexShrink: 0 }} viewBox="0 0 12 12" fill="none" className="text-[#4a5e3a]">
                  <path d="M6 10C6 10 2 7.5 2 4.5C2 3 3.5 2 5 3C5 2 5.5 1 6 1C6.5 1 7 2 7 3C8.5 2 10 3 10 4.5C10 7.5 6 10 6 10Z" stroke="currentColor" strokeWidth="0.9" fill="none" />
                </svg>
                <span
                  className="tracking-[0.2em] uppercase text-[#22271d] font-semibold whitespace-nowrap"
                  style={{ fontFamily: 'Lato, sans-serif', fontSize: 'clamp(0.6rem, 1.3vw, 1.3rem)' }}
                >
                  &nbsp;Welcome To&nbsp;
                </span>
                <svg style={{ width: 'clamp(12px,1.2vw,20px)', height: 'clamp(12px,1.2vw,20px)', flexShrink: 0 }} viewBox="0 0 12 12" fill="none" className="text-[#4a5e3a] scale-x-[-1]">
                  <path d="M6 10C6 10 2 7.5 2 4.5C2 3 3.5 2 5 3C5 2 5.5 1 6 1C6.5 1 7 2 7 3C8.5 2 10 3 10 4.5C10 7.5 6 10 6 10Z" stroke="currentColor" strokeWidth="0.9" fill="none" />
                </svg>
                <div className="h-px bg-[#4a5e3a]/60 flex-1" />
              </motion.div>

              {/* Mind Veda */}
              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, delay: 0.1 }}
                className="leading-none text-[#2d4f3a]"
                style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 'clamp(3rem, 8vw, 8.5rem)', fontWeight: 400 }}
              >
                Mind Veda
              </motion.h1>

              {/* by Babita */}
              <motion.div
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.25 }}
                className="flex items-center"
                style={{ gap: 'clamp(4px, 0.6vw, 10px)', marginTop: '-0.2em', width: '82%' }}
              >
                <span
                  className="text-[#8a6914]"
                  style={{ fontFamily: 'Great Vibes, cursive', fontSize: 'clamp(2rem, 5.5vw, 5rem)', fontWeight: 400, lineHeight: 1.1 }}
                >
                  by&thinsp;Babita
                </span>
                <svg
                  viewBox="0 0 32 32" fill="none" className="text-[#8a6914] flex-shrink-0"
                  style={{ width: 'clamp(22px, 3vw, 58px)', height: 'clamp(22px, 3vw, 58px)' }}
                >
                  <path d="M16 28C16 28 6 22 6 14C6 10 10 8 13 10C13 8 14 6 16 6C18 6 19 8 19 10C22 8 26 10 26 14C26 22 16 28 16 28Z" stroke="currentColor" strokeWidth="1.4" fill="none" />
                  <path d="M16 28C16 28 10 20 10 14M16 28C16 28 22 20 22 14" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
                  <line x1="16" y1="10" x2="16" y2="28" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
                </svg>
              </motion.div>

              {/* Divider */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                className="origin-left flex items-center gap-2"
                style={{ width: '76%', margin: 'clamp(0.3rem, 1vh, 1.1rem) 0' }}
              >
                <div className="h-[1.5px] w-32 bg-gradient-to-r from-[#4a5e3a]/70 to-[#4a5e3a]/10" />
                <div className="w-1 h-1 rounded-full bg-[#8a6914]" />
                <div className="w-1 h-1 rounded-full bg-[#8a6914]" />
                <div className="h-[1.5px] w-32 bg-gradient-to-l from-[#4a5e3a]/70 to-[#4a5e3a]/10" />
              </motion.div>

              {/* Heal Your Mind */}
              <motion.h2
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.43 }}
                className="text-[#1a3520] leading-snug"
                style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(1rem, 2.2vw, 2rem)', fontWeight: 600 }}
              >
                Heal Your Mind,<br />Transform Your Life
              </motion.h2>

              {/* Paragraph */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.52 }}
                className="text-[#3d3d2a] leading-relaxed"
                style={{
                  fontFamily: 'Lato, sans-serif', fontWeight: 600,
                  fontSize: 'clamp(0.65rem, 0.9vw, 0.93rem)',
                  marginTop: 'clamp(0.3rem, 0.8vh, 1rem)',
                  maxWidth: '28rem'
                }}
              >
                Mind Veda by Babita is your journey toward inner peace, emotional balance, and self-discovery through mindful guidance and holistic healing.
              </motion.p>

              {/* Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex flex-wrap"
                style={{ gap: 'clamp(6px, 0.8vw, 12px)', marginTop: 'clamp(0.4rem, 1.2vh, 1.5rem)' }}
              >
                <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    href="/yoga"
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#2a6c39] text-white font-semibold hover:bg-[#243f2b] transition-all shadow-md"
                    style={{ fontFamily: 'Lato, sans-serif', fontSize: 'clamp(0.6rem, 0.85vw, 0.875rem)', padding: 'clamp(0.4rem, 0.7vh, 0.75rem) clamp(0.7rem, 1.4vw, 1.5rem)' }}
                  >
                    <svg style={{ width: 'clamp(10px,1.1vw,16px)', height: 'clamp(10px,1.1vw,16px)' }} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M16 28C16 28 6 22 6 14C6 10 10 8 13 10C13 8 14 6 16 6C18 6 19 8 19 10C22 8 26 10 26 14C26 22 16 28 16 28Z" /><line x1="16" y1="10" x2="16" y2="28" /></svg>
                    Start Your Journey
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    href="/services"
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#1a3520]/35 bg-white/70 text-[#1a3520] font-semibold hover:bg-white transition-all"
                    style={{ fontFamily: 'Lato, sans-serif', fontSize: 'clamp(0.6rem, 0.85vw, 0.875rem)', padding: 'clamp(0.4rem, 0.7vh, 0.75rem) clamp(0.7rem, 1.4vw, 1.5rem)' }}
                  >
                    <span className="flex items-center justify-center rounded-full bg-[#1a3520]/10" style={{ width: 'clamp(14px,1.3vw,20px)', height: 'clamp(14px,1.3vw,20px)' }}>
                      <svg width="7" height="9" viewBox="0 0 8 10" fill="currentColor"><path d="M0 0L8 5L0 10V0Z" /></svg>
                    </span>
                    Watch Video
                  </Link>
                </motion.div>
              </motion.div>

              {/* Icons card — below buttons */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.75 }}
                className="rounded-2xl border border-[#e0d9c4] bg-white/85 backdrop-blur-sm flex items-center divide-x divide-[#c9b97a]/40"
                style={{ marginTop: 'clamp(0.4rem, 1.2vh, 1.4rem)', padding: 'clamp(0.4rem, 0.9vh, 1rem) clamp(0.3rem, 0.5vw, 0.5rem)' }}
              >
                {[
                  { label1: 'Mindfulness', label2: 'Practices', icon: (s) => <svg width={s} height={s} viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><circle cx="22" cy="8.5" r="3.2"/><path d="M22 11.7 L22 20"/><path d="M15 17.5 Q10 19 8 23"/><path d="M29 17.5 Q34 19 36 23"/><path d="M8 33 Q11 25 18 22 Q20 21.5 22 21.5 Q24 21.5 26 22 Q33 25 36 33"/><path d="M8 33 Q13 29 18 31 Q20 32 22 32 Q24 32 26 31 Q31 29 36 33"/></svg> },
                  { label1: 'Emotional', label2: 'Wellbeing', icon: (s) => <svg width={s} height={s} viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10 C16 10 11 14.5 11 20 C11 23 12.5 25.5 15 27 L15 32 L29 32 L29 27 C31.5 25.5 33 23 33 20 C33 14.5 28 10 22 10Z"/><path d="M22 10 C22 10 22 15 22 20"/><path d="M11.5 18 Q14 16 16 18 Q18 20 20 18"/><path d="M24 18 Q26 20 28 18 Q30 16 32.5 18"/><path d="M17 27 L17 32 M27 27 L27 32"/></svg> },
                  { label1: 'Holistic', label2: 'Healing', icon: (s) => <svg width={s} height={s} viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M22 7 C22 7 10 14 10 24 C10 30 15.5 35 22 35 C28.5 35 34 30 34 24 C34 14 22 7 22 7Z"/><path d="M22 35 L22 7"/><path d="M22 18 Q17 21 15 26"/><path d="M22 22 Q27 19 29 24"/><path d="M22 26 Q18 28 17 31"/></svg> },
                  { label1: 'Personal', label2: 'Growth', icon: (s) => <svg width={s} height={s} viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><circle cx="22" cy="22" r="7"/><line x1="22" y1="7" x2="22" y2="11"/><line x1="22" y1="33" x2="22" y2="37"/><line x1="7" y1="22" x2="11" y2="22"/><line x1="33" y1="22" x2="37" y2="22"/><line x1="11.5" y1="11.5" x2="14.3" y2="14.3"/><line x1="29.7" y1="29.7" x2="32.5" y2="32.5"/><line x1="32.5" y1="11.5" x2="29.7" y2="14.3"/><line x1="14.3" y1="29.7" x2="11.5" y2="32.5"/></svg> },
                ].map(({ label1, label2, icon }) => (
                  <div key={label1} className="flex-1 flex flex-col items-center text-[#2d4f3a]" style={{ gap: 'clamp(2px, 0.4vh, 6px)', padding: '0 clamp(2px, 0.3vw, 4px)' }}>
                    {icon('clamp(20px, 2.8vw, 36px)')}
                    <div className="text-center" style={{ fontFamily: 'Lato, sans-serif' }}>
                      <div style={{ fontSize: 'clamp(0.5rem, 0.85vw, 0.8rem)', fontWeight: 600, color: '#1a3520', lineHeight: 1.2 }}>{label1}</div>
                      <div style={{ fontSize: 'clamp(0.5rem, 0.85vw, 0.8rem)', fontWeight: 400, color: '#1a3520', lineHeight: 1.2 }}>{label2}</div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── QUOTE BANNER ── */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.7 }} viewport={{ once: true }} className="bg-white border-y border-gray-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-8 py-4 flex items-center justify-center gap-3">
            <svg width="18" height="18" viewBox="0 0 32 32" fill="none" className="text-[#8a6914] flex-shrink-0 hidden sm:block">
              <path d="M16 28C16 28 6 22 6 14C6 10 10 8 13 10C13 8 14 6 16 6C18 6 19 8 19 10C22 8 26 10 26 14C26 22 16 28 16 28Z" stroke="currentColor" strokeWidth="1.6" fill="none" />
              <line x1="16" y1="10" x2="16" y2="28" stroke="currentColor" strokeWidth="1.4" />
            </svg>
            <p className="text-center text-[#3d3d2a] text-xs sm:text-sm md:text-base italic" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
              "The mind is everything. What you think, you become."
              <span className="ml-2 not-italic font-semibold text-[#8a6914]">– Buddha</span>
            </p>
          </div>
        </motion.div>

        {/* ── FEATURED CARDS ── */}
        <section className="max-w-[1800px] mx-auto px-4 sm:px-6 py-10 md:py-16">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }} className="text-center mb-8 md:mb-12">
            <p className="text-brand text-xs sm:text-sm uppercase tracking-[0.28em] font-semibold">What we offer</p>
            <h2 className="heading-hover mt-2 md:mt-3 text-xl sm:text-2xl md:text-4xl font-semibold text-[#1a3520]">Support for every chapter of life</h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {featuredCards.map((card, index) => (
              <FeaturedService key={card.title} index={index} title={card.title} description={card.description} features={card.features} href={card.href} image={card.image} />
            ))}
          </div>
        </section>

        {/* ── SERVICES ── */}
        <section className="max-w-[1800px] mx-auto px-4 sm:px-6 pb-10 md:pb-12">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-5">
            {homepageServices.map(service => (
              <ServiceCard key={service.title} icon={service.icon} title={service.title} description={service.description} href={service.href} />
            ))}
          </div>
        </section>

        {/* ── ABOUT BABITA ── */}
        <section className="max-w-[1800px] mx-auto px-4 sm:px-6 py-10 md:py-20">
          <div className="grid lg:grid-cols-[0.95fr_1.05fr] gap-6 md:gap-14 items-center">

            {/* Image */}
            <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="relative">
              <div className="w-full rounded-2xl md:rounded-[28px] overflow-hidden shadow-xl">
                <Image src="/babita.webp" alt="Babita Kumari – Mind Veda" width={1536} height={1024} className="w-full h-auto block" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a3520]/25 to-transparent" />
              </div>
              {/* Floating badge */}
              <motion.div
                initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} viewport={{ once: true }}
                className="absolute -bottom-4 left-4 right-4 md:left-6 md:right-6 bg-white rounded-2xl px-4 py-3 shadow-lg border border-gray-100 flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-[#edf6ef] flex items-center justify-center text-brand flex-shrink-0">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="w-4 h-4">
                    <path d="M12 22C12 22 4 17 4 10a8 8 0 0 1 16 0c0 7-8 12-8 12Z" />
                    <circle cx="12" cy="10" r="2.5" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#1a3520]">Holistic Healing Approach</p>
                  <p className="text-[11px] text-gray-500">Psychology · Social Work · Yoga</p>
                </div>
              </motion.div>
            </motion.div>

            {/* Text */}
            <motion.div initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.1 }} viewport={{ once: true }} className="pt-6 lg:pt-0">
              <p className="text-brand text-xs sm:text-sm uppercase tracking-[0.24em] font-semibold">About Babita</p>
              <h2 className="heading-hover mt-2 md:mt-3 text-2xl sm:text-3xl md:text-4xl font-semibold text-[#1a3520]">Hi, I'm Babita</h2>
              <p className="mt-1.5 md:mt-2 text-sm md:text-base text-gray-500 font-medium">Counseling Psychologist · Social Counselor · Yoga & Wellness Expert</p>

              {/* Expertise pills */}
              <div className="mt-4 md:mt-5 flex flex-wrap gap-2">
                {[
                  { years: '5 Yrs', label: 'Psychological Counseling', color: 'bg-[#edf6ef] text-[#2d4f3a] border-[#b7d9c0]' },
                  { years: '10 Yrs', label: 'Social Counseling', color: 'bg-[#fdf6e8] text-[#7a5c14] border-[#e8d09a]' },
                  { years: '12+ Yrs', label: 'Yoga & Wellness', color: 'bg-[#f0edf8] text-[#4a3a7a] border-[#c9bfde]' },
                ].map(item => (
                  <span key={item.label} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold ${item.color}`}>
                    <span className="font-bold">{item.years}</span>
                    <span className="opacity-70">·</span>
                    {item.label}
                  </span>
                ))}
              </div>

              <div className="mt-4 md:mt-6 space-y-3 text-gray-600 leading-7 text-sm md:text-base">
                <p>Babita Kumari is a <strong className="text-[#1a3520]">Counseling Psychologist</strong> helping individuals navigate stress, anxiety, emotional challenges, and personal growth — through a compassionate, practical approach that creates lasting change.</p>
                <p>With <strong className="text-[#1a3520]">10 years of social counseling</strong> via NGO work and <strong className="text-[#1a3520]">12+ years of yoga & wellness</strong> expertise, she blends modern psychology with holistic practices to heal mind, heart, and body.</p>
              </div>

              <div className="mt-5 md:mt-8 grid grid-cols-3 gap-2 md:gap-4">
                {heroStats.map(stat => (
                  <div key={stat.label} className="card-anim rounded-xl md:rounded-2xl bg-white p-3 md:p-4 text-center shadow-soft border border-gray-100">
                    <div className="bold-hover text-lg md:text-2xl font-bold text-brand">{stat.value}</div>
                    <div className="mt-0.5 text-[9px] md:text-xs text-gray-500 leading-tight">{stat.label}</div>
                  </div>
                ))}
              </div>

              <blockquote className="mt-5 md:mt-6 rounded-xl md:rounded-[24px] border border-gray-100 bg-white p-4 md:p-5 shadow-soft">
                <div className="text-3xl md:text-4xl text-brand/40 leading-none">{'“'}</div>
                <p className="mt-1 text-sm md:text-base italic text-gray-700 leading-7">
                  Everyone has the strength within themselves. I'm here to help you unlock it.
                </p>
              </blockquote>

              <motion.div whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }} className="mt-6 md:mt-7 inline-block">
                <Link href="/expert" className="inline-flex items-center gap-2 rounded-full bg-[#2d4f3a] text-white px-6 py-3 text-sm font-semibold shadow-lg hover:bg-[#1f3829] transition-colors">
                  Meet Babita <ArrowRightIcon className="w-4 h-4" />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <TestimonialCarousel />

        {/* ── BLOG ── */}
        <section className="max-w-[1800px] mx-auto px-4 sm:px-6 py-10 md:py-20">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6 md:mb-10">
            <div>
              <p className="text-brand text-xs sm:text-sm uppercase tracking-[0.24em] font-semibold">From our blog</p>
              <h2 className="heading-hover mt-1.5 md:mt-2 text-xl sm:text-2xl md:text-3xl font-semibold text-[#1a3520]">Articles & emotional support</h2>
            </div>
            <Link href="/blog" className="text-xs sm:text-sm font-semibold text-brand inline-flex items-center gap-1 flex-shrink-0 hover:text-brand-light transition-colors highlight-hover">
              View all <ArrowRightIcon className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {blogArticles.slice(0, 3).map((article, index) => (
              <motion.article
                key={article.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5, scale: 1.01 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                viewport={{ once: true }}
                className="card-anim group rounded-2xl md:rounded-[28px] border border-gray-100 bg-white shadow-soft"
              >
                <div className="relative w-full h-40 md:h-52">
                  <Image src={article.image} alt={article.title} fill className="object-cover" />
                </div>
                <div className="p-4 md:p-6">
                  <span className="inline-flex rounded-full bg-[#edf5ee] px-2.5 py-0.5 text-[10px] md:text-xs font-semibold text-brand">{article.category}</span>
                  <h3 className="mt-2.5 md:mt-4 text-sm md:text-xl font-semibold text-[#1a3520] group-hover:text-brand transition-colors leading-snug">{article.title}</h3>
                  <p className="mt-1.5 md:mt-3 text-xs md:text-sm leading-5 md:leading-7 text-gray-500 line-clamp-2">{article.excerpt}</p>
                  <Link href={`/blog/${article.slug}`} className="mt-3 md:mt-5 inline-flex items-center gap-1 text-xs md:text-sm font-semibold text-brand">
                    Read more <ArrowRightIcon className="w-3 h-3 md:w-3.5 md:h-3.5" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        {/* ── CONTACT / CTA ── */}
        <section className="max-w-[1800px] mx-auto px-4 sm:px-6 pb-12 md:pb-20">
          <div className="grid lg:grid-cols-2 gap-4 md:gap-6 items-stretch">

            <div className="card-anim rounded-2xl md:rounded-[32px] bg-[#fffaf0] p-5 md:p-8 border border-[#e8dfc0]">
              <p className="text-brand text-xs sm:text-sm uppercase tracking-[0.24em] font-semibold">Begin your journey today</p>
              <h2 className="mt-2 md:mt-3 text-xl sm:text-2xl md:text-3xl font-semibold text-[#1a3520] leading-snug">A calm first step for booking and support</h2>
              <p className="mt-3 md:mt-4 text-gray-600 leading-7 text-xs sm:text-sm md:text-base">
                Book a session, choose a package, or simply send a message. Warm, premium, and reassuring from the first click.
              </p>
              <div className="mt-5 md:mt-8 flex flex-col gap-3 text-xs sm:text-sm text-gray-600">
                <div className="flex items-center gap-3"><PhoneIcon className="w-4 h-4 text-brand flex-shrink-0" /> +91 98765 43210</div>
                <div className="flex items-center gap-3"><MailIcon className="w-4 h-4 text-brand flex-shrink-0" /> hello@mindveda.com</div>
                <div className="flex items-center gap-3"><MapPinIcon className="w-4 h-4 text-brand flex-shrink-0" /> Delhi | Mumbai | Bangalore</div>
              </div>
            </div>

            <motion.div
              whileHover={{ y: -5, scale: 1.01 }}
              className="card-anim card-anim-dark rounded-2xl md:rounded-[32px] bg-gradient-to-br from-brand to-brand-light p-5 md:p-8 text-white shadow-xl shadow-brand/20"
            >
              <div className="text-[10px] sm:text-xs uppercase tracking-[0.24em] text-white/70">Schedule a free 15-min consultation</div>
              <h3 className="mt-3 md:mt-4 text-xl sm:text-2xl md:text-3xl font-semibold leading-snug">Let's talk about how we can help you feel better.</h3>
              <p className="mt-2 md:mt-4 text-white/75 leading-6 md:leading-7 text-xs sm:text-sm md:text-base">Razorpay-ready payment flow — no redesign needed when you're ready to go live.</p>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="mt-5 md:mt-8">
                <Link href="/yoga" className="inline-flex items-center gap-2 rounded-full bg-white px-5 md:px-6 py-2.5 md:py-3 font-semibold text-brand shadow-lg text-sm">
                  Schedule now <ArrowRightIcon className="w-4 h-4" />
                </Link>
              </motion.div>
            </motion.div>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
