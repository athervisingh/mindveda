import Header from '../components/Header'
import Footer from '../components/Footer'
import { motion } from 'framer-motion'
import { useState } from 'react'

const PHONE     = '919211488516'
const PHONE_RAW = '+919211488516'
const PHONE_DISPLAY = '+91 92114 88516'

const TOPICS = [
  'Individual Counselling',
  'Couples Therapy',
  'Child & Teen Counselling',
  'Career Guidance',
  'Yoga & Wellness',
  'Spiritual Retreat',
  'Other / Not Sure',
]

const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"/>
  </svg>
)

const WAIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.136.559 4.14 1.535 5.876L.057 23.487a.75.75 0 00.919.919l5.61-1.478A11.955 11.955 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.98 0-3.837-.575-5.407-1.567l-.387-.23-4.02 1.058 1.058-3.873-.253-.4A9.956 9.956 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
  </svg>
)

const MailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"/>
  </svg>
)

const ClockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-5 h-5">
    <circle cx="12" cy="12" r="9.75" strokeWidth="1.6"/>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75v5.25l3.75 2.25"/>
  </svg>
)

const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"/>
  </svg>
)

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"/>
  </svg>
)

export default function ContactPage() {
  const [form, setForm]   = useState({ name: '', contact: '', topic: '', message: '' })
  const [sent, setSent]   = useState(false)
  const [focus, setFocus] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    const text = `Hi Babita,\n\nI'm ${form.name}${form.contact ? ` (${form.contact})` : ''}.\n\nLooking for: ${form.topic || 'General Inquiry'}\n\n${form.message}`
    window.open(`https://wa.me/${PHONE}?text=${encodeURIComponent(text)}`, '_blank')
    setSent(true)
  }

  const inputBase = (field) =>
    `w-full bg-transparent border-b-2 pt-1 pb-2.5 text-sm text-[#1a3520] placeholder-gray-300 focus:outline-none transition-colors duration-200 ${
      focus === field ? 'border-[#1a3520]' : 'border-gray-200'
    }`

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfaf7]">
      <Header />

      <main className="flex-1 grid grid-cols-1 lg:grid-cols-2">

        {/* ═══════════════════════════════════════
            LEFT — dark green info panel
        ════════════════════════════════════════ */}
        <div className="bg-[#1a3520] flex flex-col justify-between px-8 sm:px-12 md:px-14 lg:px-16 py-14 lg:py-20 order-2 lg:order-1">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>

            <p className="text-[#c9daa0] text-[10px] font-bold uppercase tracking-[0.3em] mb-6">Contact</p>
            <h1
              className="text-4xl sm:text-5xl font-semibold text-white leading-[1.15] mb-4"
              style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
            >
              Let's Talk.
            </h1>
            <p className="text-white/50 text-sm leading-7 max-w-sm mb-10">
              Babita personally reads every message and responds within a few hours. Reach out — no judgment, no pressure.
            </p>

            {/* Phone */}
            <div className="mb-8">
              <p className="text-white/30 text-[10px] uppercase tracking-widest font-semibold mb-3">Phone</p>
              <p className="text-white text-2xl font-semibold tracking-tight mb-4">{PHONE_DISPLAY}</p>
              <div className="flex gap-3">
                <a
                  href={`tel:${PHONE_RAW}`}
                  className="flex items-center gap-2 rounded-full border border-white/20 text-white text-sm font-semibold px-5 py-2.5 hover:bg-white hover:text-[#1a3520] transition-all duration-200"
                >
                  <PhoneIcon /> Call
                </a>
                <a
                  href={`https://wa.me/${PHONE}?text=Hi%20Babita%2C%20I%27d%20like%20to%20know%20more%20about%20your%20services.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-full bg-[#25D366] text-white text-sm font-semibold px-5 py-2.5 hover:bg-[#1ebe57] transition-all duration-200"
                >
                  <WAIcon /> WhatsApp
                </a>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-white/10 mb-8" />

            {/* Info rows */}
            <div className="space-y-5 mb-10">
              {[
                { icon: <MailIcon />,   label: 'Email',   value: 'mindveda.in@gmail.com', href: 'mailto:mindveda.in@gmail.com' },
                { icon: <ClockIcon />,  label: 'Hours',   value: 'Mon – Sat · 9 AM – 7 PM IST' },
                { icon: <ShieldIcon />, label: 'Privacy', value: '100% Confidential Sessions' },
              ].map(({ icon, label, value, href }) => (
                <div key={label} className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white/60 flex-shrink-0">
                    {icon}
                  </div>
                  <div>
                    <p className="text-white/30 text-[10px] uppercase tracking-widest font-semibold mb-0.5">{label}</p>
                    {href
                      ? <a href={href} className="text-white/80 text-sm hover:text-white transition-colors">{value}</a>
                      : <p className="text-white/80 text-sm">{value}</p>
                    }
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Quote */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="border-l-2 border-[#c9daa0]/40 pl-5"
          >
            <p className="text-white/50 text-sm leading-7 italic" style={{ fontFamily: 'Georgia, serif' }}>
              {'"'}Every mind deserves care. The first step is simply saying hello.{'"'}
            </p>
            <p className="mt-2 text-[#c9daa0] text-xs font-semibold tracking-wide">— Babita Kumari</p>
          </motion.div>
        </div>

        {/* ═══════════════════════════════════════
            RIGHT — form panel
        ════════════════════════════════════════ */}
        <div className="bg-white flex items-center px-8 sm:px-12 md:px-14 lg:px-16 py-14 lg:py-20 order-1 lg:order-2">
          <motion.div
            className="w-full max-w-md mx-auto lg:mx-0"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            {sent ? (
              <div className="text-center py-16">
                <motion.div
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                  className="w-16 h-16 rounded-full bg-[#edf6ef] flex items-center justify-center mx-auto mb-5 text-[#1a3520]"
                >
                  <CheckIcon />
                </motion.div>
                <h2 className="text-xl font-semibold text-[#1a3520] mb-2">WhatsApp Opened</h2>
                <p className="text-gray-400 text-sm leading-6">Your message is ready to send.<br />Babita will respond soon.</p>
                <button
                  onClick={() => { setSent(false); setForm({ name: '', contact: '', topic: '', message: '' }) }}
                  className="mt-8 text-xs font-semibold text-[#1a3520] border border-[#1a3520]/20 rounded-full px-5 py-2 hover:bg-[#1a3520] hover:text-white transition-all"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-2xl sm:text-3xl font-semibold text-[#1a3520] mb-1"
                  style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
                  Send a Message
                </h2>
                <p className="text-gray-400 text-sm mb-10">We'll open WhatsApp with your message pre-filled.</p>

                <form onSubmit={handleSubmit} className="space-y-8">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">Full Name *</label>
                    <input
                      type="text" required
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      onFocus={() => setFocus('name')}
                      onBlur={() => setFocus('')}
                      placeholder="Priya Sharma"
                      className={inputBase('name')}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">
                      Phone or Email <span className="text-gray-300 normal-case font-normal">(optional)</span>
                    </label>
                    <input
                      type="text"
                      value={form.contact}
                      onChange={e => setForm(f => ({ ...f, contact: e.target.value }))}
                      onFocus={() => setFocus('contact')}
                      onBlur={() => setFocus('')}
                      placeholder="+91 98765 43210"
                      className={inputBase('contact')}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">I am Looking For</label>
                    <select
                      value={form.topic}
                      onChange={e => setForm(f => ({ ...f, topic: e.target.value }))}
                      onFocus={() => setFocus('topic')}
                      onBlur={() => setFocus('')}
                      className={`${inputBase('topic')} appearance-none cursor-pointer`}
                    >
                      <option value="">Select a topic...</option>
                      {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">Message *</label>
                    <textarea
                      required rows={4}
                      value={form.message}
                      onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                      onFocus={() => setFocus('message')}
                      onBlur={() => setFocus('')}
                      placeholder="Tell Babita what you're going through..."
                      className={`${inputBase('message')} resize-none`}
                    />
                  </div>

                  <div className="pt-2 space-y-3">
                    <button
                      type="submit"
                      className="w-full flex items-center justify-center gap-2.5 rounded-full bg-[#1a3520] text-white text-sm font-semibold py-4 hover:bg-[#2d4f3a] active:scale-[0.98] transition-all duration-200"
                    >
                      <WAIcon />
                      Send via WhatsApp
                    </button>
                    <a
                      href={`tel:${PHONE_RAW}`}
                      className="w-full flex items-center justify-center gap-2.5 rounded-full border border-gray-200 text-gray-500 text-sm font-semibold py-4 hover:border-[#1a3520] hover:text-[#1a3520] transition-all duration-200"
                    >
                      <PhoneIcon />
                      Call {PHONE_DISPLAY}
                    </a>
                  </div>
                </form>
              </>
            )}
          </motion.div>
        </div>

      </main>

      <Footer />
    </div>
  )
}
