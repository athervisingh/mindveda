import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabaseClient'
import { NextSeo } from 'next-seo'

const STATUS_STYLES = {
  confirmed:   'bg-green-100 text-green-700',
  pending:     'bg-amber-100 text-amber-700',
  cancelled:   'bg-red-100 text-red-600',
  completed:   'bg-blue-100 text-blue-700',
  rescheduled: 'bg-purple-100 text-purple-700',
  no_show:     'bg-gray-100 text-gray-500',
}

function fmt12(time24) {
  if (!time24) return ''
  const [h, m] = time24.split(':')
  const hr = parseInt(h)
  return `${hr % 12 || 12}:${m} ${hr < 12 ? 'AM' : 'PM'}`
}

const NAV_TABS  = [{ id: 'sessions', label: 'Sessions' }, { id: 'retreats', label: 'Retreats' }]
const ALL_TABS  = [...NAV_TABS, { id: 'profile', label: 'Profile' }]

export default function Dashboard() {
  const router = useRouter()
  const { user, loading: authLoading, logout } = useAuth()
  const [activeTab,  setActiveTab]  = useState('sessions')
  const [bookings,   setBookings]   = useState([])
  const [retreats,   setRetreats]   = useState([])
  const [loading,    setLoading]    = useState(true)
  const [profilePic, setProfilePic] = useState(null)
  const [uploading,  setUploading]  = useState(false)
  const fileInputRef = useRef()

  useEffect(() => {
    if (!authLoading && !user) router.replace('/login?redirect=/dashboard')
  }, [user, authLoading, router])

  useEffect(() => {
    if (!user) return
    async function fetchAll() {
      const [{ data: b }, { data: r }, { data: profile }] = await Promise.all([
        supabase.from('bookings').select('*, services(name, price, duration_minutes)').eq('user_id', user.id).order('booked_at', { ascending: false }),
        supabase.from('retreat_bookings').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('users').select('profile_pic').eq('id', user.id).single(),
      ])
      setBookings(b || [])
      setRetreats(r || [])
      if (profile?.profile_pic) setProfilePic(profile.profile_pic)
      setLoading(false)
    }
    fetchAll()
  }, [user])

  async function handlePicUpload(e) {
    const file = e.target.files?.[0]
    if (!file || !user) return
    setUploading(true)
    try {
      const ext  = file.name.split('.').pop()
      const path = `${user.id}/avatar.${ext}`
      const { error: upErr } = await supabase.storage.from('avatars').upload(path, file, { upsert: true })
      if (upErr) throw upErr
      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path)
      await supabase.from('users').update({ profile_pic: publicUrl }).eq('id', user.id)
      setProfilePic(publicUrl)
    } catch (err) {
      alert('Upload failed: ' + err.message)
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  if (authLoading || !user) return null

  const upcoming = bookings.filter(b => ['confirmed', 'rescheduled', 'pending'].includes(b.status))
  const past     = bookings.filter(b => ['completed', 'cancelled', 'no_show'].includes(b.status))
  const initials = (user.user_metadata?.full_name || user.email || 'U')[0].toUpperCase()
  const fullName = user.user_metadata?.full_name || 'User'
  const stats    = [
    { label: 'Total',    val: bookings.length },
    { label: 'Upcoming', val: upcoming.length },
    { label: 'Done',     val: bookings.filter(b => b.status === 'completed').length },
    { label: 'Retreats', val: retreats.length },
  ]

  return (
    <div className="min-h-screen bg-[#f0efeb] flex flex-col">
      <NextSeo noindex={true} nofollow={true} title="My Dashboard — MindVeda" />

      {/* Hidden file input – shared by all avatar buttons */}
      <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handlePicUpload} />

      {/* ─── HEADER  (tablet + desktop only) ─── */}
      <div className="hidden sm:block">
        <Header />
      </div>

      {/* ─── MOBILE: full-screen green header ─── */}
      <div className="sm:hidden bg-[#1a3520] px-5 pt-14 pb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-44 h-44 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="relative flex items-center gap-4">
          {/* avatar */}
          <button type="button" onClick={() => fileInputRef.current?.click()} className="relative flex-shrink-0">
            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-[#2d5a3a] flex items-center justify-center ring-2 ring-white/20">
              {uploading
                ? <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                : profilePic
                  ? <img src={profilePic} alt="avatar" className="w-full h-full object-cover" />
                  : <span className="text-white text-2xl font-black">{initials}</span>}
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#f5a623] rounded-full flex items-center justify-center">
              <CameraIcon className="w-2.5 h-2.5 text-white" />
            </div>
          </button>
          {/* name */}
          <div className="flex-1 min-w-0">
            <p className="text-[#f5a623] text-[10px] font-bold uppercase tracking-widest">Welcome back</p>
            <p className="text-white font-black text-lg truncate">{fullName}</p>
            <p className="text-white/40 text-xs truncate">{user.email}</p>
          </div>
          {/* logout */}
          <button onClick={() => { logout(); router.push('/') }} className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
            <LogoutIcon className="w-4 h-4 text-white/60" />
          </button>
        </div>
        {/* mobile stats */}
        <div className="grid grid-cols-4 gap-2 mt-5">
          {stats.map(s => (
            <div key={s.label} className="bg-white/10 rounded-xl py-3 text-center">
              <div className="text-white font-black text-2xl leading-none">{s.val}</div>
              <div className="text-white/40 text-[9px] font-medium mt-1 uppercase tracking-wide">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── MAIN ─── */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 sm:pb-0 sm:py-8 lg:py-10">

        {/* ── TABLET: profile strip ── */}
        <div className="hidden sm:flex lg:hidden items-center gap-4 bg-white rounded-2xl p-4 shadow-sm mb-6">
          <button type="button" onClick={() => fileInputRef.current?.click()} className="relative flex-shrink-0">
            <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#edf6ef] flex items-center justify-center">
              {uploading
                ? <div className="w-5 h-5 border-2 border-gray-300 border-t-[#1a3520] rounded-full animate-spin" />
                : profilePic
                  ? <img src={profilePic} alt="avatar" className="w-full h-full object-cover" />
                  : <span className="text-[#1a3520] text-xl font-black">{initials}</span>}
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-[#f5a623] rounded-full flex items-center justify-center">
              <CameraIcon className="w-2.5 h-2.5 text-white" />
            </div>
          </button>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-[#1a3520] truncate">{fullName}</p>
            <p className="text-gray-400 text-sm truncate">{user.email}</p>
          </div>
          <button onClick={() => { logout(); router.push('/') }} className="px-4 py-2 rounded-full border border-gray-200 text-sm text-gray-500 hover:border-red-200 hover:text-red-500 transition-all whitespace-nowrap">
            Log out
          </button>
        </div>

        <div className="lg:flex lg:gap-8">

          {/* ── DESKTOP SIDEBAR ── */}
          <aside className="hidden lg:flex flex-col gap-4 w-72 flex-shrink-0">

            {/* Profile card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
              <button type="button" onClick={() => fileInputRef.current?.click()} className="relative inline-block mb-4 group">
                <div className="w-24 h-24 rounded-2xl overflow-hidden bg-[#edf6ef] flex items-center justify-center mx-auto ring-2 ring-transparent group-hover:ring-[#1a3520]/20 transition-all">
                  {uploading
                    ? <div className="w-6 h-6 border-2 border-gray-300 border-t-[#1a3520] rounded-full animate-spin" />
                    : profilePic
                      ? <img src={profilePic} alt="avatar" className="w-full h-full object-cover" />
                      : <span className="text-[#1a3520] text-3xl font-black">{initials}</span>}
                </div>
                <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#f5a623] rounded-full flex items-center justify-center shadow-sm">
                  <CameraIcon className="w-3.5 h-3.5 text-white" />
                </div>
              </button>
              <p className="font-bold text-[#1a3520] text-lg">{fullName}</p>
              <p className="text-gray-400 text-sm mt-0.5 truncate">{user.email}</p>
              <p className="text-xs text-gray-300 mt-2">{uploading ? 'Uploading…' : 'Click photo to update'}</p>
            </div>

            {/* Stats 2×2 */}
            <div className="grid grid-cols-2 gap-3">
              {stats.map(s => (
                <div key={s.label} className="bg-white rounded-2xl p-4 text-center shadow-sm">
                  <div className="text-3xl font-black text-[#1a3520]">{s.val}</div>
                  <div className="text-xs text-gray-400 mt-1">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Nav */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
              {NAV_TABS.map((tab, i) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full px-5 py-4 text-left text-sm font-semibold flex items-center gap-3 transition-colors
                    ${i > 0 ? 'border-t border-gray-50' : ''}
                    ${activeTab === tab.id ? 'bg-[#1a3520] text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${activeTab === tab.id ? 'bg-[#f5a623]' : 'bg-gray-200'}`} />
                  {tab.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => { logout(); router.push('/') }}
              className="w-full py-3 rounded-2xl bg-white shadow-sm text-red-400 text-sm font-semibold hover:bg-red-50 hover:text-red-500 transition-colors"
            >
              Log Out
            </button>
          </aside>

          {/* ── CONTENT ── */}
          <div className="flex-1 min-w-0">

            {/* Stats – tablet row */}
            <div className="hidden sm:grid lg:hidden grid-cols-4 gap-4 mb-6">
              {stats.map(s => (
                <div key={s.label} className="bg-white rounded-2xl p-4 text-center shadow-sm">
                  <div className="text-3xl font-black text-[#1a3520]">{s.val}</div>
                  <div className="text-xs text-gray-400 mt-1">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Tabs – tablet */}
            <div className="hidden sm:flex lg:hidden gap-1 bg-white rounded-2xl p-1 shadow-sm mb-6">
              {ALL_TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    activeTab === tab.id ? 'bg-[#1a3520] text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Desktop greeting */}
            <div className="hidden lg:flex items-center justify-between mb-6">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">My Account</p>
                <h1 className="text-2xl font-black text-[#1a3520] mt-0.5">
                  Welcome, {fullName.split(' ')[0]} 👋
                </h1>
              </div>
            </div>

            <AnimatePresence mode="wait">

              {/* ── SESSIONS ── */}
              {activeTab === 'sessions' && (
                <motion.div key="sessions" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.18 }}>
                  <SectionLabel>Upcoming Sessions</SectionLabel>
                  {loading ? <SkeletonList /> : upcoming.length === 0 ? (
                    <EmptyCard emoji="📅" text="No upcoming sessions">
                      <Link href="/services" className="mt-4 inline-flex bg-[#1a3520] text-white text-sm font-semibold px-6 py-2.5 rounded-full hover:opacity-90 transition-opacity">
                        Book a Session
                      </Link>
                    </EmptyCard>
                  ) : (
                    <div className="space-y-3 mb-6">
                      {upcoming.map((b, i) => <SessionCard key={b.id} b={b} i={i} />)}
                    </div>
                  )}

                  {past.length > 0 && (
                    <>
                      <SectionLabel muted>History</SectionLabel>
                      <div className="space-y-2 mb-6">
                        {past.map((b, i) => <SessionCard key={b.id} b={b} i={i} dim />)}
                      </div>
                    </>
                  )}

                  <div className="bg-gradient-to-r from-[#1a3520] to-[#2d5a3a] rounded-2xl p-6 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-white font-bold">Ready for your next session?</p>
                      <p className="text-white/60 text-sm">Browse all available services</p>
                    </div>
                    <Link href="/services" className="bg-white text-[#1a3520] font-semibold text-sm px-5 py-2.5 rounded-full whitespace-nowrap hover:bg-[#f5a623] hover:text-white transition-all">
                      Browse
                    </Link>
                  </div>
                </motion.div>
              )}

              {/* ── RETREATS ── */}
              {activeTab === 'retreats' && (
                <motion.div key="retreats" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.18 }}>
                  <SectionLabel>My Retreats</SectionLabel>
                  {loading ? <SkeletonList /> : retreats.length === 0 ? (
                    <EmptyCard emoji="🏔️" text="No retreat bookings yet">
                      <Link href="/retreat" className="mt-4 inline-flex bg-[#1a3520] text-white text-sm font-semibold px-6 py-2.5 rounded-full hover:opacity-90 transition-opacity">
                        Explore Retreats
                      </Link>
                    </EmptyCard>
                  ) : (
                    <div className="space-y-3">
                      {retreats.map((r, i) => <RetreatCard key={r.id} r={r} i={i} />)}
                    </div>
                  )}
                </motion.div>
              )}

              {/* ── PROFILE (mobile + tablet only – desktop uses sidebar) ── */}
              {activeTab === 'profile' && (
                <motion.div key="profile" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.18 }} className="lg:hidden">
                  <SectionLabel>My Profile</SectionLabel>
                  <div className="bg-white rounded-2xl overflow-hidden shadow-sm mb-4">
                    <InfoRow label="Full Name" value={fullName} />
                    <InfoRow label="Email"     value={user.email} last />
                  </div>

                  <div className="bg-white rounded-2xl p-5 shadow-sm mb-4">
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-3">Profile Photo</p>
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#edf6ef] flex items-center justify-center flex-shrink-0">
                        {profilePic
                          ? <img src={profilePic} alt="avatar" className="w-full h-full object-cover" />
                          : <span className="text-[#1a3520] font-black text-xl">{initials}</span>}
                      </div>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="flex-1 py-3 rounded-xl border border-dashed border-gray-200 text-sm text-gray-400 hover:border-[#1a3520] hover:text-[#1a3520] transition-colors disabled:opacity-50"
                      >
                        {uploading ? 'Uploading…' : profilePic ? 'Change Photo' : '+ Upload Photo'}
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => { logout(); router.push('/') }}
                    className="w-full py-3.5 rounded-2xl bg-red-50 text-red-500 font-semibold text-sm hover:bg-red-100 transition-colors"
                  >
                    Log Out
                  </button>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Footer (tablet + desktop) */}
      <div className="hidden sm:block">
        <Footer />
      </div>

      {/* ─── MOBILE BOTTOM NAV ─── */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex z-50">
        {ALL_TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-3.5 flex flex-col items-center gap-0.5 transition-colors ${
              activeTab === tab.id ? 'text-[#1a3520]' : 'text-gray-300'
            }`}
          >
            <TabIcon id={tab.id} active={activeTab === tab.id} />
            <span className="text-[9px] font-bold uppercase tracking-wide">{tab.label}</span>
            {activeTab === tab.id && <span className="w-1 h-1 rounded-full bg-[#f5a623]" />}
          </button>
        ))}
      </div>

    </div>
  )
}

/* ── SMALL COMPONENTS ── */

function SectionLabel({ children, muted = false }) {
  return <p className={`text-[10px] font-bold uppercase tracking-widest mb-3 ${muted ? 'text-gray-400' : 'text-[#1a3520]'}`}>{children}</p>
}

function InfoRow({ label, value, last = false }) {
  return (
    <div className={`px-5 py-4 ${last ? '' : 'border-b border-gray-50'}`}>
      <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-[#1a3520] font-semibold text-sm">{value}</p>
    </div>
  )
}

function EmptyCard({ emoji, text, children }) {
  return (
    <div className="bg-white rounded-2xl p-10 text-center shadow-sm mb-6">
      <p className="text-4xl mb-2">{emoji}</p>
      <p className="text-gray-400 text-sm">{text}</p>
      {children}
    </div>
  )
}

function SkeletonList() {
  return (
    <div className="space-y-3 mb-6">
      {[1,2,3].map(i => <div key={i} className="h-16 bg-white rounded-2xl animate-pulse shadow-sm" />)}
    </div>
  )
}

function SessionCard({ b, i = 0, dim = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.06 }}
      className={`bg-white rounded-2xl p-4 flex items-center gap-4 ${dim ? 'opacity-55' : 'shadow-sm'}`}
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl flex-shrink-0 ${dim ? 'bg-gray-100 text-gray-400' : 'bg-[#edf6ef] text-[#1a3520]'}`}>
        {b.services?.name?.[0] || 'S'}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-[#1a3520] text-sm truncate">{b.services?.name}</p>
        {b.booking_date && (
          <p className="text-xs text-gray-400 mt-0.5">
            {new Date(b.booking_date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
            {b.booking_time && ` · ${fmt12(b.booking_time)}`}
          </p>
        )}
        {b.services?.duration_minutes && <p className="text-xs text-gray-300">{b.services.duration_minutes} min</p>}
      </div>
      <div className="flex-shrink-0 text-right">
        <p className="text-sm font-bold text-brand mb-1">₹{Math.round((b.services?.price || 0) / 100).toLocaleString('en-IN')}</p>
        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full capitalize ${STATUS_STYLES[b.status] || 'bg-gray-100 text-gray-500'}`}>
          {b.status}
        </span>
      </div>
    </motion.div>
  )
}

function RetreatCard({ r, i = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.06 }}
      className="bg-white rounded-2xl p-4 shadow-sm"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 rounded-xl bg-[#edf6ef] flex items-center justify-center text-2xl flex-shrink-0">
          {r.package_id === 'twin-sharing' ? '🛏️' : '🛌'}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-[#1a3520] text-sm truncate">{r.package_label}</p>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700 capitalize">{r.status}</span>
        </div>
        <p className="text-brand font-black text-base flex-shrink-0">₹{(r.amount_rupees || 0).toLocaleString('en-IN')}</p>
      </div>
      <div className="flex flex-wrap gap-4 text-xs text-gray-400 bg-gray-50 rounded-xl px-4 py-2.5">
        <span>Check-in: <span className="font-semibold text-gray-600">{new Date(r.check_in_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span></span>
        <span>Check-out: <span className="font-semibold text-gray-600">{new Date(r.check_out_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span></span>
      </div>
    </motion.div>
  )
}

function TabIcon({ id, active }) {
  const cls = `w-5 h-5 ${active ? 'text-[#1a3520]' : 'text-gray-300'}`
  if (id === 'sessions') return (
    <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  )
  if (id === 'retreats') return (
    <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  )
  return (
    <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  )
}

function CameraIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}

function LogoutIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  )
}
