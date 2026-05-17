import Header from '../../components/Header'
import Footer from '../../components/Footer'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckIcon, ArrowRightIcon, CartIcon } from '../../components/Icons'
import { retreatPackage } from '../../lib/siteContent'
import { useState } from 'react'
import { useRouter } from 'next/router'

const TIME_SLOTS = ['11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM']

function getNext14Days() {
  const days = []
  const today = new Date()
  for (let i = 1; i <= 14; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    days.push(d)
  }
  return days
}

const PROPERTY_SECTIONS = [
  {
    title: 'Your Private Suite',
    image: '/r1.webp',
    imgW: 1376, imgH: 768,
    position: 'left',
    paragraphs: [
      'Experience refined comfort in our elegantly designed suites, where modern luxury meets a peaceful retreat. Spacious interiors, soothing natural light, and stylish décor create a warm and relaxing atmosphere for an unforgettable stay.',
      'Each suite features a plush king-size bed with premium linens, thoughtfully selected amenities, and contemporary touches crafted for complete comfort. Whether you are unwinding indoors or enjoying the serene views outside, every moment is designed to feel effortless and special.',
      'From personalized hospitality to carefully curated refreshments, every detail is arranged to provide a relaxing and memorable experience throughout your stay.',
    ],
  },
  {
    title: 'Rest & Rejuvenate',
    image: '/r2.webp',
    imgW: 1376, imgH: 768,
    position: 'right',
    paragraphs: [
      'Get a full night\'s rest, wake up to birds chirping, grab a book from your personal library and be engulfed in a tranquil atmosphere, with exceptional hospitality.',
      'Each of our spacious spa-suites have an integral, private spa area or treatment room, from where you can indulge in unlimited therapies. Studies have shown that getting good sleep immediately after your therapies allows a much longer term effect — our suites have been built to offer a calm and relaxing space for you to continue to rejuvenate following your treatments.',
      'Beyond your in-suite spa, your balcony overlooks the pool, is shaded by foliage and is positioned so you can take in delightful river views.',
    ],
  },
  {
    title: 'Mindful Design',
    image: '/r3.webp',
    imgW: 1376, imgH: 768,
    position: 'left',
    paragraphs: [
      'MindVeda has a minimalist and eco-friendly design to resonate with your mind. To keep your doshas in balance, and to propagate sattva guna, our property has been made with uncluttered open spaces that instil a feeling of peace and relaxation.',
      'The entire property\'s wood is handcrafted teak made by local artisans, with handpicked art and decor. Being a boutique property allows us to give our guests personalised care & attention.',
      'For treatments that require heavy oil, we have provisioned a rooftop spa right above your suite — our spa-to-suite ratio ensures we leave no stone unturned in giving you the comfort & privacy you need.',
    ],
  },
  {
    title: 'Nature & Tranquility',
    image: '/r4.webp',
    imgW: 1376, imgH: 768,
    position: 'right',
    paragraphs: [
      'Surrounded by lush greenery, fresh air, and peaceful surroundings, this tranquil retreat offers the perfect escape from the rush of everyday life. Every corner is thoughtfully designed to create a sense of calm, comfort, and connection with nature.',
      'Wake up to soft sunlight, gentle breezes, and the soothing sounds of nature that make each moment feel refreshing and unforgettable. The serene atmosphere allows you to slow down, relax completely, and embrace a more peaceful way of living.',
      'Whether you seek quiet reflection, wellness experiences, or simple relaxation, the retreat provides inviting spaces to unwind and reconnect with yourself. Blending natural beauty with modern comfort, every stay is designed to leave you feeling renewed and refreshed.',
    ],
  },
]

const PRICING = [
  { type: 'Sharing Accommodation', price: 7500, icon: '👥', desc: '3-bed shared room · all meals included' },
  { type: 'Twin Sharing', price: 10000, icon: '🛏️', desc: '2-bed room · all meals included', highlight: true },
  { type: 'Single Accommodation', price: 15000, icon: '🛌', desc: 'Private room · all meals included' },
]

function SlotPicker({ pkg, days, selectedDay, setSelectedDay, selectedTime, setSelectedTime, onAddToCart }) {
  return (
    <div className="card-anim bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="bg-[#2d4f3a] px-5 py-4">
        <h2 className="text-white font-semibold text-base sm:text-lg">Book Your Retreat Slot</h2>
        <p className="text-white/70 text-xs sm:text-sm mt-0.5">All times in IST · 11 AM – 6 PM · All days</p>
      </div>
      <div className="p-4 sm:p-5">
        <p className="text-sm font-medium text-gray-700 mb-3">Choose a Start Date</p>
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
          {days.map((d, i) => {
            const isSelected = selectedDay && selectedDay.toDateString() === d.toDateString()
            return (
              <button key={i} onClick={() => { setSelectedDay(d); setSelectedTime(null) }}
                className={`flex-shrink-0 w-14 rounded-2xl py-3 flex flex-col items-center transition-all ${isSelected ? 'bg-[#2d4f3a] text-white shadow-md' : 'bg-gray-50 hover:bg-[#2d4f3a]/10 text-gray-700'}`}>
                <span className="text-[10px] font-medium opacity-80">{d.toLocaleDateString('en-IN', { weekday: 'short' })}</span>
                <span className="text-base font-bold mt-0.5">{d.getDate()}</span>
                <span className="text-[10px] opacity-70">{d.toLocaleDateString('en-IN', { month: 'short' })}</span>
              </button>
            )
          })}
        </div>
        <AnimatePresence>
          {selectedDay && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <p className="text-sm font-medium text-gray-700 mt-4 mb-3">
                Arrival Time — <span className="text-gray-400 font-normal">{selectedDay.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
              </p>
              <div className="grid grid-cols-3 gap-2">
                {TIME_SLOTS.map(t => (
                  <button key={t} onClick={() => setSelectedTime(t)}
                    className={`py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${selectedTime === t ? 'bg-[#2d4f3a] text-white shadow-md' : 'bg-gray-50 text-gray-700 hover:bg-[#2d4f3a]/10 border border-gray-100'}`}>
                    {t}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {selectedDay && selectedTime && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 bg-[#2d4f3a]/5 border border-[#2d4f3a]/10 rounded-xl px-4 py-3 text-sm">
            <div className="flex justify-between text-gray-600 mb-1">
              <span className="truncate pr-2">{pkg.title}</span>
              <span className="font-semibold text-[#2d4f3a] flex-shrink-0">₹{pkg.price.toLocaleString('en-IN')}</span>
            </div>
            <div className="text-xs text-gray-400">
              Starts {selectedDay.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })} · {selectedTime} · {pkg.duration}
            </div>
          </motion.div>
        )}
        <button disabled={!selectedDay || !selectedTime} onClick={onAddToCart}
          className="mt-4 w-full rounded-full bg-[#2d4f3a] py-3.5 text-white font-semibold text-sm disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#1f3829] active:scale-[0.98] transition-all">
          {selectedDay && selectedTime ? 'Add to Cart' : 'Select a Date & Time'}
        </button>
        <p className="text-center text-xs text-gray-400 mt-3">No payment now · Review in cart</p>
      </div>
    </div>
  )
}

export default function Retreat() {
  const router = useRouter()
  const pkg = retreatPackage
  const days = getNext14Days()
  const [selectedDay, setSelectedDay] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)
  const [activeDay, setActiveDay] = useState(0)

  function handleAddToCart() {
    if (!selectedDay || !selectedTime) return
    const cart = JSON.parse(localStorage.getItem('mv_cart') || '[]')
    cart.push({
      cartId: Date.now(), id: pkg.id, type: 'package', slug: pkg.slug,
      title: pkg.title, icon: 'lotus', price: pkg.price, duration: pkg.duration,
      bookingDate: selectedDay.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
      bookingTime: selectedTime,
    })
    localStorage.setItem('mv_cart', JSON.stringify(cart))
    window.dispatchEvent(new Event('cartUpdated'))
    router.push('/cart')
  }

  const slotPickerProps = { pkg, days, selectedDay, setSelectedDay, selectedTime, setSelectedTime, onAddToCart: handleAddToCart }

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfaf7]">
      <Header />
      <main className="flex-1 pb-20 lg:pb-0">

        {/* ── HERO ── */}
        <section className="flex flex-col md:flex-row min-h-[420px] md:min-h-[560px]">
          {/* Left — gradient text panel (narrower) */}
          <div className="w-full md:w-[32%] bg-gradient-to-br from-[#0d1f12] via-[#1a3520] to-[#2d4f3a] flex items-center px-7 sm:px-10 md:px-8 lg:px-12 py-12 md:py-16 order-2 md:order-1 flex-shrink-0">
            <motion.div initial={{ opacity: 0, x: -28 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 mb-5">
                <span className="w-2 h-2 rounded-full bg-[#c9daa0] animate-pulse" />
                <span className="text-white text-xs font-semibold tracking-widest uppercase">Rishikesh Experience</span>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-white/10 border border-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-full">3 DAYS</span>
                <span className="text-white/40">·</span>
                <span className="bg-white/10 border border-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-full">2 NIGHTS</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4"
                style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
                Spiritual Wellness<br />
                <span className="text-[#c9daa0]">Retreat</span>
              </h1>
              <p className="text-white/70 text-sm italic mb-6"
                style={{ fontFamily: 'Georgia, serif' }}>
                Where Healing Meets the Himalayas
              </p>
              <div className="flex flex-col gap-2 text-xs text-white/60">
                {['In-Person · Rishikesh, Uttarakhand', 'Group & Individual Sessions', 'All Meals & Accommodation Included'].map(t => (
                  <span key={t} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#c9daa0] flex-shrink-0" />{t}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
          {/* Right — image (wider) with left-edge fade into green */}
          <div className="w-full md:w-[68%] order-1 md:order-2 flex-shrink-0 relative">
            <Image src="/retreat-hero.webp" alt="Spiritual Wellness Retreat Rishikesh" width={1672} height={941} className="w-full h-full object-cover block" priority />
            <div className="hidden md:block absolute inset-y-0 left-0 w-64 bg-gradient-to-r from-[#2d4f3a] via-[#2d4f3a]/50 to-transparent" />
          </div>
        </section>

        {/* ── TRANSFORMATION STATEMENT ── */}
        <section className="bg-[#fffaf0] border-y border-[#e8d9a0]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
              <p className="text-[#7a5c14] text-sm sm:text-base italic mb-1" style={{ fontFamily: 'Georgia, serif' }}>This is not a trip...</p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#1a3520] mb-6 sm:mb-10">
                It's a <span className="text-[#2d4f3a]">transformation.</span>
              </h2>
              <div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-lg mx-auto">
                {[{ icon: '🧘', label: 'Heal Within' }, { icon: '🤝', label: 'Connect Deeply' }, { icon: '🌱', label: 'Transform Forever' }].map((item, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.12 }} viewport={{ once: true }} className="flex flex-col items-center gap-2">
                    <span className="text-2xl sm:text-4xl">{item.icon}</span>
                    <span className="text-xs sm:text-sm font-semibold text-[#1a3520]">{item.label}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── PROPERTY SECTIONS ── */}
        <section className="py-10 sm:py-16">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-8 sm:mb-12 px-4">
            <p className="text-brand text-xs uppercase tracking-[0.24em] font-semibold mb-2">The Experience</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-[#1a3520]">Your Retreat, Your Sanctuary</h2>
          </motion.div>

          <div className="divide-y divide-gray-100">
            {PROPERTY_SECTIONS.map((section, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className={`flex flex-col ${section.position === 'right' ? 'lg:flex-row-reverse' : 'lg:flex-row'}`}
              >
                {/* Image */}
                <div className="w-full lg:w-1/2 flex-shrink-0">
                  <Image src={section.image} alt={section.title} width={section.imgW} height={section.imgH} className="w-full h-auto block" />
                </div>

                {/* Text content */}
                <div className="w-full lg:w-1/2 bg-white flex flex-col justify-center px-5 py-6 lg:px-6 lg:py-5 xl:px-10 xl:py-7 2xl:px-16 2xl:py-10">
                  <h3
                    className="font-semibold text-[#1a3520] leading-tight mb-2 lg:mb-2 xl:mb-3 2xl:mb-5 text-2xl lg:text-base xl:text-2xl 2xl:text-3xl"
                    style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
                  >
                    {section.title}
                  </h3>
                  <div className="space-y-2 lg:space-y-1 xl:space-y-2 2xl:space-y-3">
                    {section.paragraphs.map((para, i) => (
                      <p
                        key={i}
                        className="text-gray-600 text-sm lg:text-[11px] xl:text-sm 2xl:text-base leading-6 lg:leading-4 xl:leading-5 2xl:leading-7"
                      >
                        {para}
                      </p>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── WHAT'S INCLUDED ── */}
        <section className="bg-[#edf6ef] py-10 sm:py-14">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-8">
              <p className="text-brand text-xs uppercase tracking-[0.24em] font-semibold mb-2">Everything Included</p>
              <h2 className="text-2xl sm:text-3xl font-semibold text-[#1a3520]">What's in Your Retreat</h2>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {[
                { icon: '🧘', text: 'Yoga & Meditation Sessions' },
                { icon: '🔥', text: 'Agnihotra Fire Healing' },
                { icon: '🎶', text: 'Sound & Mantra Healing' },
                { icon: '🏊', text: 'Ganga Snan — Holy Dip' },
                { icon: '🥗', text: 'All Sattvic Meals Included' },
                { icon: '🛕', text: 'Temple Darshan & Sacred Sites' },
                { icon: '🌿', text: 'Nature Walks & Adventure' },
                { icon: '🎤', text: 'Expert Lectures & Workshops' },
                { icon: '🙏', text: 'Farewell Blessings Ceremony' },
                { icon: '🛌', text: 'Accommodation (2 Nights)' },
                { icon: '🧠', text: 'Chakra & Counseling Sessions' },
                { icon: '📿', text: 'Rudraksh Mala Gift' },
              ].map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} viewport={{ once: true }}
                  className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-sm border border-[#c5ddc8]">
                  <span className="text-xl flex-shrink-0">{item.icon}</span>
                  <span className="text-sm text-gray-700 font-medium">{item.text}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PRICING ── */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-8 sm:mb-10">
            <p className="text-brand text-xs uppercase tracking-[0.24em] font-semibold mb-2">Retreat Pricing</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-[#1a3520]">Choose Your Experience</h2>
            <p className="mt-2 text-gray-500 text-sm">All packages include meals, activities & accommodation</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
            {PRICING.map((plan, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}
                className={`relative rounded-2xl sm:rounded-[24px] border p-5 sm:p-6 flex flex-col items-center text-center transition-shadow ${plan.highlight ? 'bg-[#1a3520] border-[#2d4f3a] shadow-2xl scale-[1.03]' : 'bg-white border-gray-100 shadow-soft hover:shadow-lg'}`}>
                {plan.highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#c9daa0] text-[#1a3520] text-xs font-bold px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                )}
                <span className="text-3xl mb-3">{plan.icon}</span>
                <h3 className={`text-sm font-semibold mb-1 ${plan.highlight ? 'text-[#c9daa0]' : 'text-gray-500'}`}>{plan.type}</h3>
                <div className={`text-3xl sm:text-4xl font-bold mb-1 ${plan.highlight ? 'text-white' : 'text-[#1a3520]'}`}>
                  ₹{plan.price.toLocaleString('en-IN')}
                </div>
                <p className={`text-xs mb-4 ${plan.highlight ? 'text-white/60' : 'text-gray-400'}`}>per person</p>
                <p className={`text-xs leading-5 ${plan.highlight ? 'text-white/70' : 'text-gray-500'}`}>{plan.desc}</p>
              </motion.div>
            ))}
          </div>
          <p className="text-center text-xs text-gray-400 mt-4">* All prices per person. GST applicable.</p>
        </section>

        {/* ── LOCATION ── */}
        <section className="bg-gradient-to-br from-[#1a3520] to-[#2d4f3a] py-10 sm:py-14">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <span className="text-3xl block mb-3">📍</span>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-white mb-2">Retreat Location</h2>
              <p className="text-[#c9daa0] text-sm sm:text-base font-medium mb-1">Rishikesh, Uttarakhand, India</p>
              <p className="text-white/60 text-xs sm:text-sm">Tehri Farm, Gohri Mafi, Rishikesh — 249205</p>
              <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm text-white/70">
                {['Himalayan Foothills', 'Ganga Riverside', 'Triveni Ghat', 'Sacred Temples Nearby'].map(t => (
                  <span key={t} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#c9daa0]" />{t}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── BOOK NOW ── */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14" id="book">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-8">
            <p className="text-brand text-xs uppercase tracking-[0.24em] font-semibold mb-2">Reserve Your Spot</p>
            <h2 className="text-2xl sm:text-3xl font-semibold text-[#1a3520]">Book Your Retreat</h2>
            <p className="mt-2 text-gray-500 text-sm">Select your arrival date and time. No payment required now.</p>
          </motion.div>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-6 lg:gap-10 items-start">
            {/* Left — trust info */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-soft">
                <h3 className="text-base font-semibold text-[#1a3520] mb-4">Why Choose This Retreat?</h3>
                <ul className="space-y-3">
                  {[
                    '3 full days of immersive healing in Rishikesh',
                    'Expert-led yoga, counseling & meditation',
                    'Authentic Vedic ceremonies & fire rituals',
                    'Sattvic meals — pure, nourishing, healing',
                    'Small group — personal attention guaranteed',
                    'Post-retreat follow-up support from Babita',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600">
                      <span className="w-5 h-5 rounded-full bg-[#edf6ef] flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckIcon className="w-3 h-3 text-brand" />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[{ v: '3', l: 'Days' }, { v: '2', l: 'Nights' }, { v: '12+', l: 'Yrs Experience' }].map(s => (
                  <div key={s.l} className="bg-white rounded-xl p-3 text-center border border-gray-100 shadow-soft">
                    <div className="text-xl sm:text-2xl font-bold text-[#2d4f3a]">{s.v}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
            {/* Right — slot picker */}
            <div id="slot-picker">
              <SlotPicker {...slotPickerProps} />
              <Link href="/cart" className="mt-3 flex items-center justify-center gap-2 text-sm text-[#2d4f3a] hover:underline">
                <CartIcon className="w-4 h-4" /> View Cart
              </Link>
            </div>
          </div>
        </section>

      </main>

      {/* Mobile sticky bottom bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-sm border-t border-gray-200 px-4 py-3 flex items-center gap-3 shadow-2xl">
        <div className="flex-1 min-w-0">
          <div className="text-[11px] text-gray-400 truncate">
            {selectedDay && selectedTime
              ? `${selectedDay.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })} · ${selectedTime}`
              : 'Select start date & time'}
          </div>
          <div className="font-bold text-[#1a3520] text-base">
            ₹{pkg.price.toLocaleString('en-IN')} <span className="text-xs font-normal text-gray-400">/ person</span>
          </div>
        </div>
        <motion.button whileTap={{ scale: 0.96 }}
          onClick={() => {
            if (selectedDay && selectedTime) handleAddToCart()
            else document.getElementById('slot-picker')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }}
          className="flex-shrink-0 rounded-full bg-[#2d4f3a] text-white px-5 py-3 text-sm font-semibold shadow-lg hover:bg-[#1f3829] transition-colors">
          {selectedDay && selectedTime ? 'Add to Cart' : 'Book Now'}
        </motion.button>
      </div>

      <Footer />
    </div>
  )
}
