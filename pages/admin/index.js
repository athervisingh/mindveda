import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabaseClient'

const STATUS_STYLES = {
  confirmed:   'bg-green-100 text-green-700',
  pending:     'bg-amber-100 text-amber-700',
  cancelled:   'bg-red-100 text-red-600',
  completed:   'bg-blue-100 text-blue-700',
  rescheduled: 'bg-purple-100 text-purple-700',
  no_show:     'bg-gray-100 text-gray-500',
}
const STATUS_OPTIONS = ['confirmed', 'pending', 'completed', 'cancelled', 'rescheduled', 'no_show']

function fmt12(t) {
  if (!t) return ''
  const [h, m] = t.split(':')
  const hr = parseInt(h)
  return `${hr % 12 || 12}:${m} ${hr < 12 ? 'AM' : 'PM'}`
}

export default function AdminDashboard() {
  const router = useRouter()
  const { user, loading: authLoading, logout } = useAuth()
  const [activeTab, setActiveTab] = useState('bookings')
  const [scheduleDate, setScheduleDate] = useState(new Date().toISOString().split('T')[0])
  const [isAdmin, setIsAdmin] = useState(false)

  // Bookings state
  const [bookings, setBookings] = useState([])
  const [loadingB, setLoadingB] = useState(true)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [updating, setUpdating] = useState(null)

  // Schedule state
  const [scheduleBookings, setScheduleBookings] = useState([])
  const [loadingSchedule, setLoadingSchedule] = useState(false)

  // Reschedule state
  const [rescheduleBookingId, setRescheduleBookingId] = useState(null)
  const [rescheduleDate, setRescheduleDate] = useState('')
  const [rescheduleTime, setRescheduleTime] = useState('')
  const [rescheduleReason, setRescheduleReason] = useState('')
  const [rescheduling, setRescheduling] = useState(false)

  useEffect(() => {
    if (authLoading) return
    if (!user) { router.replace('/login'); return }
    async function checkAdmin() {
      const { data } = await supabase.from('users').select('role').eq('id', user.id).single()
      if (data?.role !== 'admin') { router.replace('/'); return }
      setIsAdmin(true)
      fetchBookings()
      fetchSchedule(scheduleDate)
    }
    checkAdmin()
  }, [user, authLoading])

  async function fetchSchedule(date) {
    setLoadingSchedule(true)
    const { data } = await supabase
      .from('bookings')
      .select('*, users(full_name, email, phone), services(name, type, price, duration_minutes)')
      .eq('booking_date', date)
      .in('status', ['confirmed', 'rescheduled', 'pending'])
      .order('booking_time')
    setScheduleBookings(data || [])
    setLoadingSchedule(false)
  }

  async function fetchBookings() {
    setLoadingB(true)
    let q = supabase
      .from('bookings')
      .select('*, users(full_name, email, phone), services(name, price, duration_minutes), slots(slot_date, start_time, end_time, type)')
      .order('booked_at', { ascending: false })
    if (filterStatus !== 'all') q = q.eq('status', filterStatus)
    const { data } = await q
    setBookings(data || [])
    setLoadingB(false)
  }

  async function fetchSlots() {
    setLoadingS(true)
    const { data } = await supabase
      .from('slots')
      .select('*, services(name, slug)')
      .order('slot_date')
      .order('start_time')
    setSlots(data || [])
    setLoadingS(false)
  }

  async function fetchServices() {
    const { data } = await supabase.from('services').select('id, name, slug, type').eq('is_active', true)
    setServices(data || [])
  }

  useEffect(() => { if (isAdmin) fetchBookings() }, [filterStatus])

  async function updateStatus(bookingId, newStatus) {
    setUpdating(bookingId)
    await supabase.from('bookings').update({ status: newStatus }).eq('id', bookingId)
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: newStatus } : b))
    setUpdating(null)
  }

  async function createSlot(e) {
    e.preventDefault()
    setSlotSaving(true)
    setSlotMsg('')
    const res = await fetch('/api/slots/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        serviceSlug: slotForm.serviceSlug,
        date:        slotForm.date,
        startTime:   slotForm.startTime,
        endTime:     slotForm.endTime,
        type:        slotForm.type,
        maxCapacity: slotForm.maxCapacity,
      }),
    })
    const data = await res.json()
    if (res.ok) {
      setSlotMsg('✓ Slot created!')
      setSlotForm({ serviceSlug: '', date: '', startTime: '', endTime: '', type: 'individual', maxCapacity: 50 })
      fetchSlots()
    } else {
      setSlotMsg(`Error: ${data.error}`)
    }
    setSlotSaving(false)
  }

  async function deleteSlot(slotId) {
    if (!confirm('Delete this slot?')) return
    const res = await fetch('/api/slots/delete', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slotId }),
    })
    const data = await res.json()
    if (res.ok) fetchSlots()
    else alert(data.error)
  }

  async function doReschedule() {
    if (!rescheduleDate || !rescheduleTime) return alert('Date aur time dono select karo')
    setRescheduling(true)
    const res = await fetch('/api/bookings/reschedule', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bookingId:   rescheduleBookingId,
        newDate:     rescheduleDate,
        newTime:     rescheduleTime,
        reason:      rescheduleReason,
      }),
    })
    const data = await res.json()
    if (res.ok) {
      alert('Rescheduled! Email sent to client.')
      setRescheduleBookingId(null)
      setRescheduleDate('')
      setRescheduleTime('')
      setRescheduleReason('')
      fetchBookings()
    } else {
      alert(data.error)
    }
    setRescheduling(false)
  }

  const filteredBookings = bookings.filter(b => {
    if (!search) return true
    const q = search.toLowerCase()
    return b.users?.full_name?.toLowerCase().includes(q) ||
           b.users?.email?.toLowerCase().includes(q) ||
           b.services?.name?.toLowerCase().includes(q)
  })

  const stats = {
    total:     bookings.length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    pending:   bookings.filter(b => b.status === 'pending').length,
    revenue:   bookings
      .filter(b => ['confirmed', 'completed'].includes(b.status))
      .reduce((s, b) => s + Math.round((b.services?.price || 0) / 100), 0),
  }

  if (authLoading || !isAdmin) return (
    <div className="min-h-screen flex items-center justify-center bg-[#1a3520]">
      <div className="text-white text-sm">Loading…</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#f7f7f5] flex">
      {/* Sidebar */}
      <aside className="w-56 bg-[#1a3520] min-h-screen p-6 flex flex-col gap-1 flex-shrink-0">
        <div className="mb-8">
          <p className="text-[#f5a623] text-xs font-bold uppercase tracking-widest">Mind Veda</p>
          <p className="text-white/40 text-xs mt-1">Admin Panel</p>
        </div>
        {[
          { id: 'bookings', label: 'Bookings' },
          { id: 'schedule', label: 'Schedule' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === tab.id ? 'bg-white/15 text-white' : 'text-white/50 hover:text-white hover:bg-white/10'
            }`}
          >
            {tab.label}
          </button>
        ))}
        <div className="mt-auto">
          <button
            onClick={() => { logout(); router.push('/') }}
            className="text-white/40 hover:text-white text-xs transition-colors"
          >
            Log out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8 overflow-auto">

        {/* ── BOOKINGS TAB ── */}
        {activeTab === 'bookings' && (
          <div className="max-w-6xl">
            <h1 className="text-2xl font-bold text-[#1a3520] mb-6">Bookings</h1>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Total',     val: stats.total },
                { label: 'Confirmed', val: stats.confirmed },
                { label: 'Pending',   val: stats.pending },
                { label: 'Revenue',   val: `₹${stats.revenue.toLocaleString('en-IN')}` },
              ].map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"
                >
                  <div className="text-2xl font-black text-[#1a3520]">{s.val}</div>
                  <div className="text-xs text-gray-400 mt-1">{s.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-5">
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search name, email, service…"
                className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 w-60"
              />
              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
                className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand/20"
              >
                <option value="all">All Status</option>
                {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <button onClick={fetchBookings} className="px-4 py-2.5 rounded-xl bg-brand text-white text-sm font-medium hover:opacity-90">
                Refresh
              </button>
            </div>

            {/* Table */}
            {loadingB ? (
              <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-16 bg-gray-100 rounded-2xl animate-pulse" />)}</div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50">
                        {['Client', 'Service', 'Slot', 'Amount', 'Status', 'Update', 'Reschedule'].map(h => (
                          <th key={h} className="text-left text-xs font-semibold text-gray-500 px-4 py-3">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBookings.length === 0 ? (
                        <tr><td colSpan={7} className="text-center py-12 text-gray-400 text-sm">No bookings found</td></tr>
                      ) : filteredBookings.map(b => (
                        <tr key={b.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3">
                            <p className="text-sm font-semibold text-[#1a3520]">{b.users?.full_name || '—'}</p>
                            <p className="text-xs text-gray-400">{b.users?.email}</p>
                            {b.users?.phone && <p className="text-xs text-gray-400">{b.users.phone}</p>}
                          </td>
                          <td className="px-4 py-3">
                            <p className="text-sm text-gray-700">{b.services?.name}</p>
                            <p className="text-xs text-gray-400 capitalize">{b.slots?.type} · {b.services?.duration_minutes}m</p>
                          </td>
                          <td className="px-4 py-3">
                            {b.slots ? (
                              <>
                                <p className="text-xs text-gray-700">
                                  {new Date(b.slots.slot_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                </p>
                                <p className="text-xs text-gray-400">{fmt12(b.slots.start_time)} – {fmt12(b.slots.end_time)}</p>
                              </>
                            ) : <span className="text-xs text-gray-400">—</span>}
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm font-bold text-brand">
                              ₹{Math.round((b.services?.price || 0) / 100).toLocaleString('en-IN')}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${STATUS_STYLES[b.status] || 'bg-gray-100 text-gray-500'}`}>
                              {b.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <select
                              value={b.status}
                              onChange={e => updateStatus(b.id, e.target.value)}
                              disabled={updating === b.id}
                              className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white disabled:opacity-50 focus:outline-none"
                            >
                              {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => setRescheduleBookingId(b.id)}
                              className="text-xs text-brand border border-brand/30 px-3 py-1.5 rounded-lg hover:bg-brand hover:text-white transition-all"
                            >
                              Reschedule
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Reschedule Modal */}
            {rescheduleBookingId && (
              <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
                  <h3 className="font-bold text-[#1a3520] mb-4">Reschedule Booking</h3>

                  <label className="block text-xs font-medium text-gray-600 mb-1">New Date</label>
                  <input
                    type="date"
                    value={rescheduleDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={e => setRescheduleDate(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-brand/20"
                  />

                  <label className="block text-xs font-medium text-gray-600 mb-1">New Time</label>
                  <select
                    value={rescheduleTime}
                    onChange={e => setRescheduleTime(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm mb-3 bg-white focus:outline-none focus:ring-2 focus:ring-brand/20"
                  >
                    <option value="">-- Pick time --</option>
                    {['11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00'].map(t => (
                      <option key={t} value={t}>{fmt12(t)}</option>
                    ))}
                  </select>

                  <label className="block text-xs font-medium text-gray-600 mb-1">Reason (optional)</label>
                  <input
                    type="text"
                    value={rescheduleReason}
                    onChange={e => setRescheduleReason(e.target.value)}
                    placeholder="e.g. Babita unavailable"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-brand/20"
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={() => setRescheduleBookingId(null)}
                      className="flex-1 border border-gray-200 rounded-xl py-2.5 text-sm text-gray-600 hover:border-gray-400"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={doReschedule}
                      disabled={rescheduling}
                      className="flex-1 bg-brand text-white rounded-xl py-2.5 text-sm font-semibold hover:opacity-90 disabled:opacity-50"
                    >
                      {rescheduling ? 'Sending…' : 'Reschedule & Email'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── SCHEDULE TAB ── */}
        {activeTab === 'schedule' && (
          <div className="max-w-3xl">
            <h1 className="text-2xl font-bold text-[#1a3520] mb-2">Daily Schedule</h1>
            <p className="text-gray-400 text-sm mb-6">See who has booked for any date. Slots auto-generate 11 AM – 6 PM.</p>

            {/* Date picker */}
            <div className="flex items-center gap-4 mb-6">
              <input
                type="date"
                value={scheduleDate}
                onChange={e => { setScheduleDate(e.target.value); fetchSchedule(e.target.value) }}
                className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/20"
              />
              <span className="text-sm text-gray-500">
                {new Date(scheduleDate).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            </div>

            {/* Time grid */}
            {loadingSchedule ? (
              <div className="space-y-3">{[1,2,3,4].map(i => <div key={i} className="h-16 bg-gray-100 rounded-2xl animate-pulse" />)}</div>
            ) : (
              <div className="space-y-2">
                {['11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00'].map(time => {
                  const bookingsAtTime = scheduleBookings.filter(b => b.booking_time?.startsWith(time))
                  const hasIndividual = bookingsAtTime.some(b => b.services?.type === 'individual')
                  const groupCount = bookingsAtTime.filter(b => b.services?.type === 'group').length

                  return (
                    <div key={time} className={`rounded-2xl border p-4 ${bookingsAtTime.length > 0 ? 'bg-white border-gray-100 shadow-sm' : 'bg-gray-50 border-gray-100'}`}>
                      <div className="flex items-center gap-4">
                        <div className="w-20 flex-shrink-0">
                          <span className="text-sm font-bold text-[#1a3520]">{fmt12(time)}</span>
                        </div>

                        {bookingsAtTime.length === 0 ? (
                          <span className="text-xs text-gray-300">Available</span>
                        ) : (
                          <div className="flex-1 space-y-1">
                            {bookingsAtTime.map(b => (
                              <div key={b.id} className="flex items-center gap-3 flex-wrap">
                                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${b.services?.type === 'group' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                  {b.services?.type}
                                </span>
                                <span className="text-sm font-semibold text-[#1a3520]">{b.users?.full_name}</span>
                                <span className="text-xs text-gray-400">{b.services?.name}</span>
                                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_STYLES[b.status] || 'bg-gray-100 text-gray-500'}`}>{b.status}</span>
                                <span className="text-xs text-gray-400 ml-auto">{b.users?.phone}</span>
                              </div>
                            ))}
                            {hasIndividual && (
                              <p className="text-xs text-red-400 font-medium mt-1">⛔ Slot blocked — individual session</p>
                            )}
                            {!hasIndividual && groupCount > 0 && (
                              <p className="text-xs text-purple-500 font-medium mt-1">👥 Group: {groupCount}/50 joined</p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  )
}
