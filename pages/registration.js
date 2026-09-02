import { useState } from 'react'
import Link from 'next/link'
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

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-7 h-7">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
)

const labelCls = 'block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2'
const fieldCls = 'w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#1a3520] placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1a3520]/15 focus:border-[#1a3520]/40 transition-all'

function Section({ step, title, subtitle, children }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl border border-[#e8e3d5] p-6 sm:p-8"
    >
      <div className="flex items-start gap-3 mb-6">
        <span className="w-7 h-7 rounded-full bg-[#1a3520] text-[#f5a623] text-xs font-bold flex items-center justify-center flex-shrink-0">{step}</span>
        <div>
          <h2 className="text-lg font-semibold text-[#1a3520]" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>{title}</h2>
          {subtitle && <p className="text-gray-400 text-xs mt-0.5">{subtitle}</p>}
        </div>
      </div>
      <div className="space-y-6">{children}</div>
    </motion.section>
  )
}

export default function RegistrationPage() {
  const [form, setForm]       = useState(EMPTY)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError]     = useState('')
  const [done, setDone]       = useState(false)

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
      setDone(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfaf7]">
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
        <div className="bg-[#1a3520] px-6 py-12 sm:py-16">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-[#c9daa0] text-[10px] font-bold uppercase tracking-[0.3em] mb-4">Registration</p>
            <h1 className="text-3xl sm:text-4xl font-semibold text-white leading-tight" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
              Tell us about yourself
            </h1>
            <p className="text-white/50 text-sm leading-7 mt-4 max-w-lg mx-auto">
              This form helps Babita understand you better. The more openly you write, the more accurate your guidance will be. Everything you share stays 100% confidential.
            </p>
          </div>
        </div>

        {done ? (
          <div className="max-w-xl mx-auto px-6 py-20 text-center">
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="w-16 h-16 rounded-full bg-[#edf6ef] flex items-center justify-center mx-auto mb-6 text-[#1a3520]"
            >
              <CheckIcon />
            </motion.div>
            <h2 className="text-2xl font-semibold text-[#1a3520] mb-3" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
              Registration Received
            </h2>
            <p className="text-gray-500 text-sm leading-7">
              Thank you, {form.full_name.split(' ')[0]}. We have received your details and our team will get in touch with you shortly.
              A confirmation email has been sent to {form.email}.
            </p>
            <Link href="/" className="inline-block mt-8 text-xs font-semibold text-[#1a3520] border border-[#1a3520]/20 rounded-full px-6 py-2.5 hover:bg-[#1a3520] hover:text-white transition-all">
              Back to Home
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-5">

            <Section step="1" title="Basic Details" subtitle="So we know how to reach you">
              <div>
                <label className={labelCls}>Name *</label>
                <input type="text" required value={form.full_name} onChange={set('full_name')} placeholder="Priya Sharma" className={fieldCls} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className={labelCls}>Age</label>
                  <input type="number" min="1" max="120" value={form.age} onChange={set('age')} placeholder="28" className={fieldCls} />
                </div>
                <div>
                  <label className={labelCls}>Gender</label>
                  <select value={form.gender} onChange={set('gender')} className={`${fieldCls} appearance-none bg-white`}>
                    <option value="">Select</option>
                    {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className={labelCls}>Mobile No. *</label>
                  <input type="tel" required value={form.mobile} onChange={set('mobile')} placeholder="+91 98765 43210" className={fieldCls} />
                </div>
                <div>
                  <label className={labelCls}>Email ID *</label>
                  <input type="email" required value={form.email} onChange={set('email')} placeholder="priya@email.com" className={fieldCls} />
                </div>
              </div>

              <div>
                <label className={labelCls}>Address</label>
                <textarea rows={2} value={form.address} onChange={set('address')} placeholder="House / Street, City, State, Pincode" className={`${fieldCls} resize-none`} />
              </div>
            </Section>

            <Section step="2" title="Health & Healing" subtitle="Whatever you share stays only with Babita">
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

            <Section step="3" title="Your Fears" subtitle="The two things that frighten you the most">
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

            <Section step="4" title="About You" subtitle="How you see yourself">
              <div>
                <label className={labelCls}>What do you think you're?</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {PERSONALITIES.map(p => (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() => setForm(f => ({ ...f, personality: f.personality === p.value ? '' : p.value }))}
                      className={`text-left rounded-xl border px-4 py-3 transition-all ${
                        form.personality === p.value
                          ? 'border-[#1a3520] bg-[#1a3520] text-white'
                          : 'border-gray-200 bg-white text-[#1a3520] hover:border-[#1a3520]/40'
                      }`}
                    >
                      <span className="block text-sm font-semibold">{p.label}</span>
                      <span className={`block text-[11px] mt-0.5 ${form.personality === p.value ? 'text-white/60' : 'text-gray-400'}`}>{p.hint}</span>
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
              <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{error}</p>
            )}

            <div className="pt-1">
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#1a3520] text-white rounded-xl py-4 text-sm font-semibold tracking-wide hover:opacity-90 disabled:opacity-50 transition-opacity"
              >
                {submitting ? 'Submitting…' : 'Submit Registration'}
              </button>
              <p className="text-center text-[11px] text-gray-400 mt-3">
                🔒 All your information stays private and confidential.
              </p>
            </div>
          </form>
        )}
      </main>

      <Footer />
    </div>
  )
}
