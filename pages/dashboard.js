import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { motion } from 'framer-motion'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabaseClient'

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

export default function Dashboard() {
  const router = useRouter()
  const { user, loading: authLoading, logout } = useAuth()
  const [activeTab, setActiveTab] = useState('sessions')
  const [bookings, setBookings] = useState([])
  const [retreats, setRetreats] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) router.replace('/login?redirect=/dashboard')
  }, [user, authLoading, router])

  useEffect(() => {
    if (!user) return
    async function fetchAll() {
      const [{ data: b }, { data: r }] = await Promise.all([
        supabase
          .from('bookings')
          .select('*, services(name, price, duration_minutes)')
          .eq('user_id', user.id)
          .order('booked_at', { ascending: false }),
        supabase
          .from('retreat_bookings')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false }),
      ])
      setBookings(b || [])
      setRetreats(r || [])
      setLoading(false)
    }
    fetchAll()
  }, [user])

  if (authLoading || !user) return null

  const upcoming = bookings.filter(b => ['confirmed', 'rescheduled'].includes(b.status))
  const past     = bookings.filter(b => ['completed', 'cancelled', 'no_show'].includes(b.status))

  return (
    <div className="min-h-screen bg-[#fbfaf7] flex flex-col">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-12">

        {/* Header */}
        <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
          <div>
            <p className="text-brand text-xs font-bold uppercase tracking-widest mb-1">My Account</p>
            <h1 className="text-3xl font-bold text-[#1a3520]">
              Welcome, {user.user_metadata?.full_name?.split(' ')[0] || 'there'} 👋
            </h1>
            <p className="text-gray-400 text-sm mt-1">{user.email}</p>
          </div>
          <button
            onClick={() => { logout(); router.push('/') }}
            className="px-5 py-2.5 rounded-full border border-gray-200 text-sm text-gray-500 hover:border-red-300 hover:text-red-500 transition-all"
          >
            Log out
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Sessions',  val: bookings.length },
            { label: 'Upcoming',  val: upcoming.length },
            { label: 'Completed', val: bookings.filter(b => b.status === 'completed').length },
            { label: 'Retreats',  val: retreats.length },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center"
            >
              <div className="text-3xl font-black text-[#1a3520]">{s.val}</div>
              <div className="text-xs text-gray-400 mt-1">{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-2xl p-1 mb-6 w-fit">
          {[
            { id: 'sessions', label: 'My Sessions' },
            { id: 'retreats', label: 'My Retreats' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-[#1a3520] shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── SESSIONS TAB ── */}
        {activeTab === 'sessions' && (
          <>
            <section className="mb-8">
              <h2 className="text-lg font-bold text-[#1a3520] mb-4">Upcoming Sessions</h2>
              {loading ? (
                <div className="space-y-3">{[1,2].map(i => <div key={i} className="h-24 bg-gray-100 rounded-2xl animate-pulse" />)}</div>
              ) : upcoming.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
                  <p className="text-gray-400 text-sm mb-4">No upcoming sessions.</p>
                  <Link href="/services" className="inline-flex items-center gap-2 bg-brand text-white text-sm font-semibold px-6 py-2.5 rounded-full hover:opacity-90 transition-opacity">
                    Book a Session
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {upcoming.map((b, i) => (
                    <motion.div
                      key={b.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.07 }}
                      className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4 flex-wrap"
                    >
                      <div className="w-12 h-12 rounded-xl bg-brand/10 flex items-center justify-center text-brand font-black text-lg flex-shrink-0">
                        {b.services?.name?.[0] || 'S'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-[#1a3520] text-sm">{b.services?.name}</p>
                        {b.booking_date && (
                          <p className="text-xs text-gray-400 mt-0.5">
                            {new Date(b.booking_date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                            {b.booking_time && ` · ${fmt12(b.booking_time)}`}
                          </p>
                        )}
                        <p className="text-xs text-gray-400">{b.services?.duration_minutes} min</p>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span className="text-sm font-bold text-brand">₹{Math.round((b.services?.price || 0) / 100).toLocaleString('en-IN')}</span>
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${STATUS_STYLES[b.status] || 'bg-gray-100 text-gray-500'}`}>
                          {b.status}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </section>

            {past.length > 0 && (
              <section>
                <h2 className="text-lg font-bold text-[#1a3520] mb-4">Past Sessions</h2>
                <div className="space-y-3">
                  {past.map((b) => (
                    <div
                      key={b.id}
                      className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4 flex-wrap opacity-70"
                    >
                      <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 font-black text-lg flex-shrink-0">
                        {b.services?.name?.[0] || 'S'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-[#1a3520] text-sm">{b.services?.name}</p>
                        {b.booking_date && (
                          <p className="text-xs text-gray-400 mt-0.5">
                            {new Date(b.booking_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </p>
                        )}
                      </div>
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${STATUS_STYLES[b.status] || 'bg-gray-100 text-gray-500'}`}>
                        {b.status}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        {/* ── RETREATS TAB ── */}
        {activeTab === 'retreats' && (
          <section>
            <h2 className="text-lg font-bold text-[#1a3520] mb-4">My Retreat Bookings</h2>
            {loading ? (
              <div className="space-y-3">{[1,2].map(i => <div key={i} className="h-28 bg-gray-100 rounded-2xl animate-pulse" />)}</div>
            ) : retreats.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
                <p className="text-4xl mb-3">🏔️</p>
                <p className="text-gray-400 text-sm mb-4">No retreat bookings yet.</p>
                <Link href="/retreat" className="inline-flex items-center gap-2 bg-[#1a3520] text-white text-sm font-semibold px-6 py-2.5 rounded-full hover:opacity-90 transition-opacity">
                  Explore Retreats
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {retreats.map((r, i) => (
                  <motion.div
                    key={r.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
                  >
                    <div className="flex items-start gap-4 flex-wrap">
                      <div className="w-12 h-12 rounded-xl bg-[#edf6ef] flex items-center justify-center text-2xl flex-shrink-0">
                        {r.package_id === 'twin-sharing' ? '🛏️' : '🛌'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 flex-wrap mb-1">
                          <p className="font-semibold text-[#1a3520] text-sm">{r.package_label}</p>
                          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-green-100 text-green-700 capitalize">
                            {r.status}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-gray-400">
                          <span>
                            Check-in: <span className="text-gray-600 font-medium">
                              {new Date(r.check_in_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                          </span>
                          <span>
                            Check-out: <span className="text-gray-600 font-medium">
                              {new Date(r.check_out_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                          </span>
                          <span>3 Days / 2 Nights</span>
                        </div>
                        {r.razorpay_payment_id && (
                          <p className="text-xs text-gray-300 mt-1">Payment: {r.razorpay_payment_id}</p>
                        )}
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <p className="text-lg font-bold text-brand">₹{(r.amount_rupees || 0).toLocaleString('en-IN')}</p>
                        <p className="text-xs text-gray-400">per person</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* CTA */}
        <div className="mt-10 bg-gradient-to-r from-[#1a3520] to-[#2d5a3a] rounded-3xl p-8 flex items-center justify-between flex-wrap gap-6">
          <div>
            <h3 className="text-white font-bold text-xl">Ready for your next session?</h3>
            <p className="text-white/70 text-sm mt-1">Browse all services and book your next appointment.</p>
          </div>
          <Link href="/services" className="inline-flex items-center gap-2 bg-white text-[#1a3520] font-semibold text-sm px-6 py-3 rounded-full hover:bg-[#f5a623] hover:text-white transition-all">
            Browse Services
          </Link>
        </div>

      </main>
      <Footer />
    </div>
  )
}
