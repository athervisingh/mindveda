import { useState } from 'react'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import { NextSeo } from 'next-seo'
import Header from '../components/Header'
import Footer from '../components/Footer'

const EMPTY = {
  full_name: '',
  age: '',
  address: '',
  mobile: '',
  gender: '',
  health_issues: '',
  trauma: '',
  email: '',
  fear_1: '',
  fear_2: '',
  personality: '',
  good_thing: '',
  bad_thing: '',
}

const GENDERS = ['Female', 'Male', 'Other', 'Prefer not to say']

const PERSONALITIES = [
  { value: 'introvert', label: 'Introvert', hint: 'You recharge in your own space' },
  { value: 'extrovert', label: 'Extrovert', hint: 'You come alive around people' },
  { value: 'ambivert',  label: 'Ambivert',  hint: 'A little of both' },
]

// Har section ka apna colour — scan karte waqt turant alag dikhe.
const SECTION_THEMES = {
  1: { bar: 'from-[#f5a623] to-[#f7c65b]', badge: 'bg-[#f5a623] text-[#1a3520]', tint: 'bg-[#fff9ec]' },
  2: { bar: 'from-[#4a7c59] to-[#7fb98c]', badge: 'bg-[#4a7c59] text-white',     tint: 'bg-[#f0f8f2]' },
  3: { bar: 'from-[#c2643a] to-[#e79a6b]', badge: 'bg-[#c2643a] text-white',     tint: 'bg-[#fff4ee]' },
  4: { bar: 'from-[#5b6ec2] to-[#93a3ea]', badge: 'bg-[#5b6ec2] text-white',     tint: 'bg-[#f2f4ff]' },
}

const labelCls = 'block text-[15px] font-bold text-[#1a3520] mb-2'
const fieldCls = 'w-full bg-white border-2 border-[#c7d3c6] rounded-xl px-4 py-3.5 text-[16px] font-medium text-[#12251a] placeholder-[#93a394] shadow-sm focus:outline-none focus:ring-4 focus:ring-[#f5a623]/35 focus:border-[#f5a623] hover:border-[#8fae95] transition-all'
const reqCls = 'text-[#c2321f] font-extrabold'

function Section({ step, title, subtitle, children }) {
  const t = SECTION_THEMES[step] || SECTION_THEMES[1]
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl border-2 border-[#dcd3ba] shadow-[0_6px_24px_-8px_rgba(26,53,32,0.28)] overflow-hidden"
    >
      <div className={`h-1.5 w-full bg-gradient-to-r ${t.bar}`} />
      <div className="p-6 sm:p-8">
        <div className={`flex items-start gap-4 mb-7 -mx-2 px-3 py-3 rounded-xl ${t.tint}`}>
          <span className={`w-10 h-10 rounded-full ${t.badge} text-base font-extrabold flex items-center justify-center flex-shrink-0 shadow-md`}>{step}</span>
          <div>
            <h2 className="text-2xl font-bold text-[#1a3520] leading-tight" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>{title}</h2>
            {subtitle && <p className="text-[#4f6354] text-[13px] font-medium mt-1">{subtitle}</p>}
          </div>
        </div>
        <div className="space-y-6">{children}</div>
      </div>
    </motion.section>
  )
}

export default function RegistrationPage() {
  const router                = useRouter()
  const [form, setForm]       = useState(EMPTY)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError]     = useState('')

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const res  = await fetch('/api/registration/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Something went wrong. Please try again.')
      // Registration save ho gaya — seedha Mind Check test par bhej do.
      router.push('/test?from=registration')
      return
    } catch (err) {
      setError(err.message)
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fdf8ec]">
      <NextSeo
        title="Registration Form — Mind Veda by Babita"
        description="Register with Mind Veda. Share a little about yourself and certified psychologist Babita's team will reach out to guide you on the right programme, counselling or retreat."
        canonical="https://www.mindvedabybabita.com/registration"
        openGraph={{
          url: 'https://www.mindvedabybabita.com/registration',
          title: 'Registration Form — Mind Veda by Babita',
          description: 'Register with Mind Veda — counselling, yoga and spiritual retreats. 100% confidential.',
        }}
      />
      <Header />

      <main className="flex-1">
        {/* ── Page header ── */}
        <div className="bg-gradient-to-br from-[#1a3520] via-[#24492c] to-[#12271a] px-6 py-14 sm:py-20 border-b-4 border-[#f5a623]">
          <div className="max-w-2xl mx-auto text-center">
            <p className="inline-block bg-[#f5a623] text-[#1a3520] text-[11px] font-extrabold uppercase tracking-[0.25em] rounded-full px-4 py-1.5 mb-5">Registration</p>
            <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
              Tell us about yourself
            </h1>
            <p className="text-white/85 text-[15px] font-medium leading-8 mt-5 max-w-lg mx-auto">
              This form helps Babita understand you better. The more openly you write, the more accurate your guidance will be.
              Everything you share stays <span className="text-[#ffd27a] font-bold">100% confidential</span>.
            </p>
          </div>
        </div>

          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-6">

            <Section step={1} title="Basic Details" subtitle="So we know how to reach you">
              <div>
                <label className={labelCls}>Name <span className={reqCls}>*</span></label>
                <input type="text" required value={form.full_name} onChange={set('full_name')} placeholder="Priya Sharma" className={fieldCls} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className={labelCls}>Age</label>
                  <input type="number" min="1" max="120" value={form.age} onChange={set('age')} placeholder="28" className={fieldCls} />
                </div>
                <div>
                  <label className={labelCls}>Gender</label>
                  <select value={form.gender} onChange={set('gender')} className={`${fieldCls} appearance-none bg-white cursor-pointer`}>
                    <option value="">Select</option>
                    {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className={labelCls}>Mobile No. <span className={reqCls}>*</span></label>
                  <input type="tel" required value={form.mobile} onChange={set('mobile')} placeholder="+91 98765 43210" className={fieldCls} />
                </div>
                <div>
                  <label className={labelCls}>Email ID <span className={reqCls}>*</span></label>
                  <input type="email" required value={form.email} onChange={set('email')} placeholder="priya@email.com" className={fieldCls} />
                </div>
              </div>

              <div>
                <label className={labelCls}>Address</label>
                <textarea rows={2} value={form.address} onChange={set('address')} placeholder="House / Street, City, State, Pincode" className={`${fieldCls} resize-none`} />
              </div>
            </Section>

            <Section step={2} title="Health & Healing" subtitle="Whatever you share stays only with Babita">
              <div>
                <label className={labelCls}>Health Issues</label>
                <textarea rows={3} value={form.health_issues} onChange={set('health_issues')}
                  placeholder="Any physical or mental health concern — anxiety, sleep, thyroid, BP, ongoing medication…"
                  className={`${fieldCls} resize-none`} />
              </div>
              <div>
                <label className={labelCls}>Trauma that you can't forget</label>
                <textarea rows={4} value={form.trauma} onChange={set('trauma')}
                  placeholder="An event or memory that has stayed with you. Share only as much as you are comfortable with."
                  className={`${fieldCls} resize-none`} />
              </div>
            </Section>

            <Section step={3} title="Your Fears" subtitle="The two things that frighten you the most">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className={labelCls}>Fear 1</label>
                  <input type="text" value={form.fear_1} onChange={set('fear_1')} placeholder="e.g. Being alone" className={fieldCls} />
                </div>
                <div>
                  <label className={labelCls}>Fear 2</label>
                  <input type="text" value={form.fear_2} onChange={set('fear_2')} placeholder="e.g. Failure" className={fieldCls} />
                </div>
              </div>
            </Section>

            <Section step={4} title="About You" subtitle="How you see yourself">
              <div>
                <label className={labelCls}>What do you think you're?</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {PERSONALITIES.map(p => (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() => setForm(f => ({ ...f, personality: f.personality === p.value ? '' : p.value }))}
                      className={`text-left rounded-xl border-2 px-4 py-3.5 transition-all ${
                        form.personality === p.value
                          ? 'border-[#1a3520] bg-[#1a3520] text-white shadow-lg scale-[1.02]'
                          : 'border-[#c7d3c6] bg-white text-[#1a3520] hover:border-[#f5a623] hover:bg-[#fff9ec]'
                      }`}
                    >
                      <span className="block text-[15px] font-bold">{p.label}</span>
                      <span className={`block text-[12px] font-medium mt-0.5 ${form.personality === p.value ? 'text-[#ffd27a]' : 'text-[#5b6d5f]'}`}>{p.hint}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className={labelCls}>Good thing about you</label>
                <textarea rows={3} value={form.good_thing} onChange={set('good_thing')}
                  placeholder="One quality people remember you for" className={`${fieldCls} resize-none`} />
              </div>
              <div>
                <label className={labelCls}>Bad thing about you</label>
                <textarea rows={3} value={form.bad_thing} onChange={set('bad_thing')}
                  placeholder="One habit or pattern you would like to change" className={`${fieldCls} resize-none`} />
              </div>
            </Section>

            {error && (
              <p className="text-[15px] font-semibold text-[#a3231a] bg-[#ffeceb] border-2 border-[#f3b6b1] rounded-xl px-4 py-3.5">{error}</p>
            )}

            <div className="pt-1">
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-[#f5a623] to-[#f0901c] text-[#1a3520] rounded-xl py-5 text-lg font-extrabold tracking-wide shadow-[0_8px_24px_-6px_rgba(245,166,35,0.75)] hover:brightness-105 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:hover:translate-y-0 transition-all"
              >
                {submitting ? 'Submitting…' : 'Submit Registration'}
              </button>
              <p className="text-center text-[13px] font-semibold text-[#4f6354] mt-4">
                🔒 All your information stays private and confidential.
              </p>
            </div>
        </form>
      </main>

      <Footer />
    </div>
  )
}
