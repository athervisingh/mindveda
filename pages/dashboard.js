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
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) router.replace('/login?redirect=/dashboard')
  }, [user, authLoading, router])

  useEffect(() => {
    if (!user) return
    async function fetchBookings() {
      const { data } = await supabase
        .from('bookings')
        .select('*, services(name, price, duration_minutes), slots(slot_date, start_time, end_time, type)')
        .eq('user_id', user.id)
        .order('booked_at', { ascending: false })
      setBookings(data || [])
      setLoading(false)
    }
    fetchBookings()
  }, [user])

  if (authLoading || !user) return null

  const upcoming = bookings.filter(b => ['confirmed', 'rescheduled'].includes(b.status))
  const past     = bookings.filter(b => ['completed', 'cancelled', 'no_show'].includes(b.status))

  return (
    <div className="min-h-screen bg-[#fbfaf7] flex flex-col">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-12">

        {/* Header */}
        <div className="flex items-start justify-between mb-10 flex-wrap gap-4">
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
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { label: 'Total Bookings', val: bookings.length },
            { label: 'Upcoming', val: upcoming.length },
            { label: 'Completed', val: bookings.filter(b => b.status === 'completed').length },
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

        {/* Upcoming Sessions */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-[#1a3520] mb-4">Upcoming Sessions</h2>
          {loading ? (
            <div className="space-y-3">
              {[1, 2].map(i => <div key={i} className="h-24 bg-gray-100 rounded-2xl animate-pulse" />)}
            </div>
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
                    {b.slots?.slot_date && (
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(b.slots.slot_date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                        {' · '}{fmt12(b.slots.start_time)} – {fmt12(b.slots.end_time)}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 capitalize">{b.slots?.type} session · {b.services?.duration_minutes} min</p>
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

        {/* Past Sessions */}
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
                    {b.slots?.slot_date && (
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(b.slots.slot_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
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
