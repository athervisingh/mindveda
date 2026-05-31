import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/router'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabaseClient'
import { NextSeo } from 'next-seo'

const STATUS_STYLES = {
  confirmed:   'bg-green-100 text-green-700',
  pending:     'bg-amber-100 text-amber-700',
  cancelled:   'bg-red-100 text-red-600',
  completed:   'bg-blue-100 text-blue-700',
  rescheduled: 'bg-purple-100 text-purple-700',
  no_show:     'bg-gray-100 text-gray-500',
}
const STATUS_OPTIONS = ['confirmed', 'pending', 'completed', 'cancelled', 'rescheduled', 'no_show']

const TABS = [
  { id: 'bookings', label: 'Bookings',  icon: '📋' },
  { id: 'users',    label: 'Users',     icon: '👥' },
  { id: 'schedule', label: 'Schedule',  icon: '🗓️' },
  { id: 'chats',    label: 'Live Chats', icon: '💬' },
  { id: 'retreats', label: 'Retreats',  icon: '🏕️' },
]

function fmt12(t) {
  if (!t) return ''
  const [h, m] = t.toString().split(':')
  const hr = parseInt(h)
  return `${hr % 12 || 12}:${m} ${hr < 12 ? 'AM' : 'PM'}`
}

function fmtDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function AdminDashboard() {
  const router = useRouter()
  const { user, loading: authLoading, logout } = useAuth()
  const [activeTab, setActiveTab] = useState('bookings')
  const [isAdmin, setIsAdmin] = useState(false)

  // ── Bookings ──────────────────────────────────────
  const [bookings, setBookings]         = useState([])
  const [loadingB, setLoadingB]         = useState(true)
  const [search, setSearch]             = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterService, setFilterService] = useState('all')
  const [filterDateFrom, setFilterDateFrom] = useState('')
  const [filterDateTo, setFilterDateTo]     = useState('')
  const [updating, setUpdating]         = useState(null)
  const [services, setServices]         = useState([])
  const [rescheduleBookingId, setRescheduleBookingId] = useState(null)
  const [rescheduleDate, setRescheduleDate]     = useState('')
  const [rescheduleTime, setRescheduleTime]     = useState('')
  const [rescheduleReason, setRescheduleReason] = useState('')
  const [rescheduling, setRescheduling] = useState(false)

  // ── Users ─────────────────────────────────────────
  const [users, setUsers]               = useState([])
  const [loadingU, setLoadingU]         = useState(false)
  const [userSearch, setUserSearch]     = useState('')
  const [filterRole, setFilterRole]     = useState('all')
  const [selectedUser, setSelectedUser] = useState(null)
  const [userBookings, setUserBookings] = useState([])
  const [loadingUB, setLoadingUB]       = useState(false)

  // ── Schedule ──────────────────────────────────────
  const [scheduleDate, setScheduleDate]         = useState(new Date().toISOString().split('T')[0])
  const [scheduleBookings, setScheduleBookings] = useState([])
  const [loadingSchedule, setLoadingSchedule]   = useState(false)

  // ── Retreats ──────────────────────────────────────
  const [retreats, setRetreats]         = useState([])
  const [loadingR, setLoadingR]         = useState(false)
  const [retreatSearch, setRetreatSearch] = useState('')

  // ── Chats ─────────────────────────────────────────
  const [chatSessions, setChatSessions] = useState([])
  const [loadingChats, setLoadingChats] = useState(false)
  const [activeChatId, setActiveChatId] = useState(null)
  const [chatMessages, setChatMessages] = useState([])
  const [staffInput, setStaffInput]     = useState('')
  const [sendingStaff, setSendingStaff] = useState(false)
  const chatBottomRef = useRef(null)

  // ── Auth guard ────────────────────────────────────
  useEffect(() => {
    if (authLoading) return
    if (!user) { router.replace('/login'); return }
    async function checkAdmin() {
      const { data } = await supabase.from('users').select('role').eq('id', user.id).single()
      if (data?.role !== 'admin') { router.replace('/'); return }
      setIsAdmin(true)
      fetchBookings()
      fetchUsers()
      fetchSchedule(scheduleDate)
      fetchRetreats()
      fetchChats()
      fetchServices()
    }
    checkAdmin()
  }, [user, authLoading])

  // ── URL tab sync ──────────────────────────────────
  useEffect(() => {
    if (router.query.tab) setActiveTab(router.query.tab)
  }, [router.query.tab])

  // ── Fetch functions ───────────────────────────────
  async function fetchServices() {
    const { data } = await supabase.from('services').select('id, name, slug').eq('is_active', true)
    setServices(data || [])
  }

  async function fetchBookings() {
    setLoadingB(true)
    let q = supabase
      .from('bookings')
      .select('*, users(full_name, email, phone), services(name, slug, price, duration_minutes), slots(slot_date, start_time, end_time, type)')
      .order('booked_at', { ascending: false })
    if (filterStatus !== 'all') q = q.eq('status', filterStatus)
    if (filterService !== 'all') q = q.eq('services.slug', filterService)
    if (filterDateFrom) q = q.gte('booking_date', filterDateFrom)
    if (filterDateTo)   q = q.lte('booking_date', filterDateTo)
    const { data } = await q
    setBookings(data || [])
    setLoadingB(false)
  }

  async function fetchUsers() {
    setLoadingU(true)
    const { data } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })
    setUsers(data || [])
    setLoadingU(false)
  }

  async function fetchUserBookings(userId) {
    setLoadingUB(true)
    const { data } = await supabase
      .from('bookings')
      .select('*, services(name, price), slots(slot_date, start_time)')
      .eq('user_id', userId)
      .order('booked_at', { ascending: false })
    setUserBookings(data || [])
    setLoadingUB(false)
  }

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

  async function fetchRetreats() {
    setLoadingR(true)
    const { data } = await supabase
      .from('retreat_bookings')
      .select('*')
      .order('created_at', { ascending: false })
    setRetreats(data || [])
    setLoadingR(false)
  }

  async function fetchChats() {
    setLoadingChats(true)
    const { data } = await supabase
      .from('chat_sessions')
      .select('*, users(full_name, email, phone)')
      .in('status', ['active', 'audio'])
      .order('created_at', { ascending: false })
    setChatSessions(data || [])
    setLoadingChats(false)
  }

  async function loadChatMessages(sessionId) {
    const { data } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true })
    setChatMessages(data || [])
  }

  useEffect(() => { if (isAdmin) fetchBookings() }, [filterStatus])
  useEffect(() => { chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [chatMessages])
  useEffect(() => {
    if (!activeChatId) return
    loadChatMessages(activeChatId)
    const ch = supabase.channel(`admin-chat-${activeChatId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `session_id=eq.${activeChatId}` },
        payload => setMessages(prev => prev.some(m => m.id === payload.new.id) ? prev : [...prev, payload.new]))
      .subscribe()
    return () => supabase.removeChannel(ch)
  }, [activeChatId])

  // ── Actions ───────────────────────────────────────
  async function updateStatus(bookingId, newStatus) {
    setUpdating(bookingId)
    await supabase.from('bookings').update({ status: newStatus }).eq('id', bookingId)
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: newStatus } : b))
    setUpdating(null)
  }

  async function sendStaffMessage() {
    if (!staffInput.trim() || !activeChatId || sendingStaff) return
    const text = staffInput.trim()
    setStaffInput('')
    setSendingStaff(true)
    await fetch('/api/chat/staff-reply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId: activeChatId, message: text, adminId: user.id }),
    })
    setSendingStaff(false)
  }

  async function doReschedule() {
    if (!rescheduleDate || !rescheduleTime) return alert('Date aur time dono select karo')
    setRescheduling(true)
    const res = await fetch('/api/bookings/reschedule', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookingId: rescheduleBookingId, newDate: rescheduleDate, newTime: rescheduleTime, reason: rescheduleReason }),
    })
    const data = await res.json()
    if (res.ok) {
      alert('Rescheduled! Email sent to client.')
      setRescheduleBookingId(null)
      setRescheduleDate(''); setRescheduleTime(''); setRescheduleReason('')
      fetchBookings()
    } else {
      alert(data.error)
    }
    setRescheduling(false)
  }

  // ── Derived ───────────────────────────────────────
  const filteredBookings = bookings.filter(b => {
    if (!search) return true
    const q = search.toLowerCase()
    return b.users?.full_name?.toLowerCase().includes(q) ||
           b.users?.email?.toLowerCase().includes(q) ||
           b.users?.phone?.includes(q) ||
           b.services?.name?.toLowerCase().includes(q)
  })

  const filteredUsers = users.filter(u => {
    const matchRole = filterRole === 'all' || u.role === filterRole
    if (!userSearch) return matchRole
    const q = userSearch.toLowerCase()
    return matchRole && (
      u.full_name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.phone?.includes(q)
    )
  })

  const stats = {
    total:     bookings.length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    pending:   bookings.filter(b => b.status === 'pending').length,
    revenue:   bookings.filter(b => ['confirmed','completed'].includes(b.status))
                       .reduce((s, b) => s + Math.round((b.services?.price || 0) / 100), 0),
  }

  // ── Guard ─────────────────────────────────────────
  if (authLoading || !isAdmin) return (
    <div className="min-h-screen flex items-center justify-center bg-[#1a3520]">
      <NextSeo noindex nofollow title="Admin — MindVeda" />
      <div className="text-white text-sm">Loading…</div>
    </div>
  )

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mindvedabybabita.com'

  return (
    <div className="min-h-screen bg-[#f4f3f0] flex">
      <NextSeo noindex nofollow title="Admin — MindVeda" />

      {/* ── Sidebar ── */}
      <aside className="w-56 bg-[#1a3520] min-h-screen p-5 flex flex-col gap-1 flex-shrink-0 sticky top-0 h-screen">
        <div className="mb-8">
          <p className="text-[#f5a623] text-xs font-bold uppercase tracking-widest">Mind Veda</p>
          <p className="text-white/40 text-[11px] mt-1">Admin Panel</p>
        </div>
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2.5 ${
              activeTab === tab.id ? 'bg-white/15 text-white' : 'text-white/50 hover:text-white hover:bg-white/8'
            }`}
          >
            <span className="text-base">{tab.icon}</span>
            {tab.label}
            {tab.id === 'chats' && chatSessions.length > 0 && (
              <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {chatSessions.length}
              </span>
            )}
          </button>
        ))}
        <div className="mt-auto border-t border-white/10 pt-4">
          <p className="text-white/30 text-[11px] mb-3">{user?.email}</p>
          <button
            onClick={() => { logout(); router.push('/') }}
            className="text-white/40 hover:text-white text-xs transition-colors"
          >
            Log out
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main className="flex-1 overflow-auto">

        {/* ══════════════ BOOKINGS TAB ══════════════ */}
        {activeTab === 'bookings' && (
          <div className="p-8 max-w-7xl">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-[#1a3520]">Bookings</h1>
              <button onClick={fetchBookings} className="px-4 py-2 rounded-xl bg-[#1a3520] text-white text-sm font-medium hover:opacity-90">
                Refresh
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Total Bookings', val: stats.total,     color: 'text-[#1a3520]' },
                { label: 'Confirmed',      val: stats.confirmed, color: 'text-green-600' },
                { label: 'Pending',        val: stats.pending,   color: 'text-amber-600' },
                { label: 'Revenue',        val: `₹${stats.revenue.toLocaleString('en-IN')}`, color: 'text-[#1a3520]' },
              ].map((s, i) => (
                <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                  className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                  <div className={`text-2xl font-black ${s.color}`}>{s.val}</div>
                  <div className="text-xs text-gray-400 mt-1 font-medium">{s.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-5">
              <div className="flex flex-wrap gap-3 items-end">
                <div>
                  <label className="block text-[11px] font-medium text-gray-500 mb-1">Search</label>
                  <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="Name, email, phone, service…"
                    className="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3520]/20 w-56" />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-gray-500 mb-1">Status</label>
                  <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
                    className="border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1a3520]/20">
                    <option value="all">All Status</option>
                    {STATUS_OPTIONS.map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-gray-500 mb-1">Service</label>
                  <select value={filterService} onChange={e => setFilterService(e.target.value)}
                    className="border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1a3520]/20 max-w-[180px]">
                    <option value="all">All Services</option>
                    {services.map(s => <option key={s.id} value={s.slug}>{s.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-gray-500 mb-1">From Date</label>
                  <input type="date" value={filterDateFrom} onChange={e => setFilterDateFrom(e.target.value)}
                    className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3520]/20" />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-gray-500 mb-1">To Date</label>
                  <input type="date" value={filterDateTo} onChange={e => setFilterDateTo(e.target.value)}
                    className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3520]/20" />
                </div>
                <button onClick={fetchBookings}
                  className="px-5 py-2 rounded-xl bg-[#1a3520] text-white text-sm font-medium hover:opacity-90">
                  Apply
                </button>
                <button onClick={() => { setSearch(''); setFilterStatus('all'); setFilterService('all'); setFilterDateFrom(''); setFilterDateTo(''); setTimeout(fetchBookings, 50) }}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-gray-500 text-sm hover:border-gray-400">
                  Clear
                </button>
              </div>
            </div>

            {/* Table */}
            {loadingB ? (
              <div className="space-y-2">{[1,2,3,4].map(i => <div key={i} className="h-16 bg-gray-100 rounded-2xl animate-pulse" />)}</div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
                  <p className="text-sm text-gray-500">{filteredBookings.length} booking{filteredBookings.length !== 1 ? 's' : ''}</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50/70">
                        {['Client', 'Service', 'Date & Time', 'Amount', 'Status', 'Join Link', 'Update', 'Reschedule'].map(h => (
                          <th key={h} className="text-left text-[11px] font-semibold text-gray-400 px-4 py-3 uppercase tracking-wide whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBookings.length === 0 ? (
                        <tr><td colSpan={8} className="text-center py-16 text-gray-400 text-sm">No bookings found</td></tr>
                      ) : filteredBookings.map(b => (
                        <tr key={b.id} className="border-b border-gray-50 last:border-0 hover:bg-[#f7f5f0] transition-colors">
                          <td className="px-4 py-3 min-w-[160px]">
                            <p className="text-sm font-semibold text-[#1a3520]">{b.users?.full_name || '—'}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{b.users?.email}</p>
                            {b.users?.phone && <p className="text-xs text-gray-400">{b.users.phone}</p>}
                          </td>
                          <td className="px-4 py-3 min-w-[150px]">
                            <p className="text-sm text-gray-800 font-medium">{b.services?.name || '—'}</p>
                            <p className="text-xs text-gray-400 capitalize mt-0.5">{b.slots?.type || ''} {b.services?.duration_minutes ? `· ${b.services.duration_minutes}m` : ''}</p>
                          </td>
                          <td className="px-4 py-3 min-w-[130px]">
                            {b.slots?.slot_date ? (
                              <>
                                <p className="text-xs font-medium text-gray-700">{fmtDate(b.slots.slot_date)}</p>
                                <p className="text-xs text-gray-400">{fmt12(b.slots.start_time)}</p>
                              </>
                            ) : b.booking_date ? (
                              <>
                                <p className="text-xs font-medium text-gray-700">{fmtDate(b.booking_date)}</p>
                                <p className="text-xs text-gray-400">{fmt12(b.booking_time)}</p>
                              </>
                            ) : <span className="text-xs text-gray-400">—</span>}
                            <p className="text-[10px] text-gray-300 mt-0.5">Booked {fmtDate(b.booked_at)}</p>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm font-bold text-[#1a3520]">
                              ₹{Math.round((b.services?.price || 0) / 100).toLocaleString('en-IN')}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize whitespace-nowrap ${STATUS_STYLES[b.status] || 'bg-gray-100 text-gray-500'}`}>
                              {b.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {b.join_token ? (
                              <a href={`${siteUrl}/join/${b.join_token}`} target="_blank" rel="noopener noreferrer"
                                className="text-xs text-[#1a3520] underline underline-offset-2 hover:opacity-70 whitespace-nowrap">
                                Join Link →
                              </a>
                            ) : (
                              <span className="text-xs text-gray-300">—</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <select value={b.status} onChange={e => updateStatus(b.id, e.target.value)}
                              disabled={updating === b.id}
                              className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white disabled:opacity-50 focus:outline-none capitalize">
                              {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                          </td>
                          <td className="px-4 py-3">
                            <button onClick={() => setRescheduleBookingId(b.id)}
                              className="text-xs text-[#1a3520] border border-[#1a3520]/30 px-3 py-1.5 rounded-lg hover:bg-[#1a3520] hover:text-white transition-all whitespace-nowrap">
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
                  <input type="date" value={rescheduleDate} min={new Date().toISOString().split('T')[0]}
                    onChange={e => setRescheduleDate(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-[#1a3520]/20" />
                  <label className="block text-xs font-medium text-gray-600 mb-1">New Time</label>
                  <select value={rescheduleTime} onChange={e => setRescheduleTime(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm mb-3 bg-white focus:outline-none focus:ring-2 focus:ring-[#1a3520]/20">
                    <option value="">— Pick time —</option>
                    {['09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00'].map(t => (
                      <option key={t} value={t}>{fmt12(t)}</option>
                    ))}
                  </select>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Reason (optional)</label>
                  <input type="text" value={rescheduleReason} onChange={e => setRescheduleReason(e.target.value)}
                    placeholder="e.g. Babita unavailable"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm mb-5 focus:outline-none focus:ring-2 focus:ring-[#1a3520]/20" />
                  <div className="flex gap-3">
                    <button onClick={() => setRescheduleBookingId(null)}
                      className="flex-1 border border-gray-200 rounded-xl py-2.5 text-sm text-gray-600 hover:border-gray-400">
                      Cancel
                    </button>
                    <button onClick={doReschedule} disabled={rescheduling}
                      className="flex-1 bg-[#1a3520] text-white rounded-xl py-2.5 text-sm font-semibold hover:opacity-90 disabled:opacity-50">
                      {rescheduling ? 'Sending…' : 'Reschedule & Email'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ══════════════ USERS TAB ══════════════ */}
        {activeTab === 'users' && (
          <div className="p-8 max-w-7xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-[#1a3520]">Users</h1>
                <p className="text-gray-400 text-sm mt-0.5">{users.length} total registered users</p>
              </div>
              <button onClick={fetchUsers} className="px-4 py-2 rounded-xl bg-[#1a3520] text-white text-sm font-medium hover:opacity-90">
                Refresh
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {[
                { label: 'Total Users',  val: users.length },
                { label: 'Regular Users', val: users.filter(u => u.role === 'user').length },
                { label: 'Admins',        val: users.filter(u => u.role === 'admin').length },
              ].map((s, i) => (
                <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                  className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                  <div className="text-2xl font-black text-[#1a3520]">{s.val}</div>
                  <div className="text-xs text-gray-400 mt-1 font-medium">{s.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-5">
              <div className="flex flex-wrap gap-3 items-end">
                <div>
                  <label className="block text-[11px] font-medium text-gray-500 mb-1">Search</label>
                  <input type="text" value={userSearch} onChange={e => setUserSearch(e.target.value)}
                    placeholder="Name, email, phone…"
                    className="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3520]/20 w-64" />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-gray-500 mb-1">Role</label>
                  <select value={filterRole} onChange={e => setFilterRole(e.target.value)}
                    className="border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1a3520]/20">
                    <option value="all">All Roles</option>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Table */}
            {loadingU ? (
              <div className="space-y-2">{[1,2,3,4,5].map(i => <div key={i} className="h-16 bg-gray-100 rounded-2xl animate-pulse" />)}</div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-5 py-3 border-b border-gray-100">
                  <p className="text-sm text-gray-500">{filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''}</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50/70">
                        {['User', 'Contact', 'Role', 'Joined', 'Actions'].map(h => (
                          <th key={h} className="text-left text-[11px] font-semibold text-gray-400 px-4 py-3 uppercase tracking-wide whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.length === 0 ? (
                        <tr><td colSpan={5} className="text-center py-16 text-gray-400 text-sm">No users found</td></tr>
                      ) : filteredUsers.map(u => (
                        <tr key={u.id} className="border-b border-gray-50 last:border-0 hover:bg-[#f7f5f0] transition-colors">
                          <td className="px-4 py-3 min-w-[200px]">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-[#1a3520] flex items-center justify-center flex-shrink-0">
                                {u.profile_pic ? (
                                  <img src={u.profile_pic} alt="" className="w-9 h-9 rounded-full object-cover" />
                                ) : (
                                  <span className="text-white text-sm font-bold">{u.full_name?.[0]?.toUpperCase() || '?'}</span>
                                )}
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-[#1a3520]">{u.full_name}</p>
                                {u.phone && (
                                  <a href={`tel:${u.phone}`} className="text-xs text-[#1a3520] font-semibold hover:underline">
                                    📞 {u.phone}
                                  </a>
                                )}
                                <p className="text-[10px] text-gray-400 font-mono mt-0.5">{u.id.slice(0, 8)}…</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 min-w-[200px]">
                            <p className="text-sm text-gray-700">{u.email}</p>
                            <a href={`https://wa.me/91${u.phone?.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer"
                              className="text-xs font-semibold text-green-700 hover:underline mt-0.5 inline-block">
                              {u.phone ? `💬 ${u.phone}` : '—'}
                            </a>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                              u.role === 'admin' ? 'bg-[#1a3520] text-white' : 'bg-gray-100 text-gray-600'
                            }`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <p className="text-xs text-gray-600">{fmtDate(u.created_at)}</p>
                            <p className="text-[10px] text-gray-400 mt-0.5">
                              {u.created_at ? new Date(u.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : ''}
                            </p>
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={async () => {
                                setSelectedUser(u)
                                await fetchUserBookings(u.id)
                              }}
                              className="text-xs text-[#1a3520] border border-[#1a3520]/30 px-3 py-1.5 rounded-lg hover:bg-[#1a3520] hover:text-white transition-all whitespace-nowrap"
                            >
                              View Bookings
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* User Detail Modal */}
            <AnimatePresence>
              {selectedUser && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                  onClick={e => { if (e.target === e.currentTarget) setSelectedUser(null) }}>
                  <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                    className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">

                    {/* Header */}
                    <div className="bg-[#1a3520] px-6 py-5 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-lg font-bold">{selectedUser.full_name?.[0]?.toUpperCase()}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h2 className="text-white font-bold text-lg">{selectedUser.full_name}</h2>
                        <p className="text-white/60 text-sm">{selectedUser.email}</p>
                      </div>
                      <button onClick={() => setSelectedUser(null)} className="text-white/50 hover:text-white text-xl leading-none">×</button>
                    </div>

                    {/* User details */}
                    <div className="px-6 py-4 border-b border-gray-100 grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {[
                        { label: 'Phone',  val: selectedUser.phone || '—' },
                        { label: 'Role',   val: selectedUser.role },
                        { label: 'Joined', val: fmtDate(selectedUser.created_at) },
                        { label: 'User ID', val: selectedUser.id.slice(0, 12) + '…' },
                      ].map(item => (
                        <div key={item.label}>
                          <p className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold">{item.label}</p>
                          <p className="text-sm text-gray-700 font-medium mt-0.5 truncate">{item.val}</p>
                        </div>
                      ))}
                    </div>

                    {/* User bookings */}
                    <div className="flex-1 overflow-y-auto">
                      <div className="px-6 py-4">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold text-[#1a3520] text-sm">Booking History</h3>
                          <span className="text-xs text-gray-400">{userBookings.length} booking{userBookings.length !== 1 ? 's' : ''}</span>
                        </div>

                        {loadingUB ? (
                          <div className="space-y-2">{[1,2,3].map(i => <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />)}</div>
                        ) : userBookings.length === 0 ? (
                          <div className="text-center py-10 text-gray-400 text-sm">No bookings yet</div>
                        ) : (
                          <div className="space-y-2">
                            {userBookings.map(b => (
                              <div key={b.id} className="border border-gray-100 rounded-xl px-4 py-3 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-semibold text-gray-800 truncate">{b.services?.name || '—'}</p>
                                  <p className="text-xs text-gray-400 mt-0.5">
                                    {b.slots?.slot_date ? fmtDate(b.slots.slot_date) : b.booking_date ? fmtDate(b.booking_date) : '—'}
                                    {(b.slots?.start_time || b.booking_time) ? ` · ${fmt12(b.slots?.start_time || b.booking_time)}` : ''}
                                  </p>
                                </div>
                                <div className="text-right flex-shrink-0">
                                  <p className="text-sm font-bold text-[#1a3520]">₹{Math.round((b.services?.price || 0) / 100)}</p>
                                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${STATUS_STYLES[b.status] || 'bg-gray-100 text-gray-500'}`}>
                                    {b.status}
                                  </span>
                                </div>
                              </div>
                            ))}
                            <div className="pt-2 border-t border-gray-100 flex justify-between text-sm">
                              <span className="text-gray-500 font-medium">Total Spent</span>
                              <span className="font-black text-[#1a3520]">
                                ₹{userBookings.filter(b => ['confirmed','completed'].includes(b.status))
                                    .reduce((s, b) => s + Math.round((b.services?.price || 0) / 100), 0)
                                    .toLocaleString('en-IN')}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* ══════════════ SCHEDULE TAB ══════════════ */}
        {activeTab === 'schedule' && (
          <div className="p-8 max-w-3xl">
            <h1 className="text-2xl font-bold text-[#1a3520] mb-1">Daily Schedule</h1>
            <p className="text-gray-400 text-sm mb-6">View all bookings for a selected date.</p>
            <div className="flex items-center gap-4 mb-6">
              <input type="date" value={scheduleDate}
                onChange={e => { setScheduleDate(e.target.value); fetchSchedule(e.target.value) }}
                className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3520]/20" />
              <span className="text-sm text-gray-500 font-medium">
                {new Date(scheduleDate).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            </div>
            {loadingSchedule ? (
              <div className="space-y-3">{[1,2,3,4].map(i => <div key={i} className="h-16 bg-gray-100 rounded-2xl animate-pulse" />)}</div>
            ) : (
              <div className="space-y-2">
                {['09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00'].map(time => {
                  const items = scheduleBookings.filter(b => b.booking_time?.startsWith(time))
                  const hasIndividual = items.some(b => b.services?.type === 'individual')
                  const groupCount    = items.filter(b => b.services?.type === 'group').length
                  return (
                    <div key={time} className={`rounded-2xl border p-4 transition-colors ${items.length > 0 ? 'bg-white border-gray-100 shadow-sm' : 'bg-gray-50/70 border-gray-100'}`}>
                      <div className="flex items-start gap-4">
                        <div className="w-20 flex-shrink-0 pt-0.5">
                          <span className="text-sm font-bold text-[#1a3520]">{fmt12(time)}</span>
                        </div>
                        {items.length === 0 ? (
                          <span className="text-xs text-gray-300 pt-0.5">Available</span>
                        ) : (
                          <div className="flex-1 space-y-1.5">
                            {items.map(b => (
                              <div key={b.id} className="flex items-center gap-2 flex-wrap">
                                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${b.services?.type === 'group' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                  {b.services?.type}
                                </span>
                                <span className="text-sm font-semibold text-[#1a3520]">{b.users?.full_name}</span>
                                <span className="text-xs text-gray-400">{b.services?.name}</span>
                                <span className="text-xs text-gray-400">{b.users?.phone}</span>
                                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ml-auto ${STATUS_STYLES[b.status] || ''}`}>{b.status}</span>
                              </div>
                            ))}
                            {hasIndividual && <p className="text-xs text-red-400 font-medium">⛔ Blocked — individual session</p>}
                            {!hasIndividual && groupCount > 0 && <p className="text-xs text-purple-500 font-medium">👥 Group: {groupCount}/50 joined</p>}
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

        {/* ══════════════ LIVE CHATS TAB ══════════════ */}
        {activeTab === 'chats' && (
          <div className="p-8 max-w-6xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-[#1a3520]">Live Chats</h1>
                <p className="text-gray-400 text-sm mt-1">Active chat sessions — click to read and reply as counselor.</p>
              </div>
              <button onClick={fetchChats} className="px-4 py-2 rounded-xl bg-[#1a3520] text-white text-sm font-medium hover:opacity-90">Refresh</button>
            </div>
            {loadingChats ? (
              <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-16 bg-gray-100 rounded-2xl animate-pulse" />)}</div>
            ) : chatSessions.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
                <p className="text-4xl mb-3">💬</p>
                <p className="text-gray-400 text-sm">No active chat sessions right now.</p>
              </div>
            ) : (
              <div className="flex gap-5" style={{ height: '620px' }}>
                <div className="w-72 flex-shrink-0 space-y-2 overflow-y-auto">
                  {chatSessions.map(cs => {
                    const secLeft = Math.max(0, Math.floor((new Date(cs.ends_at) - new Date()) / 1000))
                    const mins = Math.floor(secLeft / 60), secs = secLeft % 60
                    return (
                      <button key={cs.id} onClick={() => { setActiveChatId(cs.id); setChatMessages([]) }}
                        className={`w-full text-left p-4 rounded-2xl border transition-all ${activeChatId === cs.id ? 'bg-[#1a3520] border-[#1a3520]' : 'bg-white border-gray-100 hover:border-[#1a3520]/30'}`}>
                        <p className={`text-sm font-semibold ${activeChatId === cs.id ? 'text-white' : 'text-[#1a3520]'}`}>{cs.users?.full_name || 'User'}</p>
                        <p className={`text-xs mt-0.5 ${activeChatId === cs.id ? 'text-white/60' : 'text-gray-400'}`}>{cs.users?.phone || cs.users?.email}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cs.status === 'audio' ? 'bg-green-100 text-green-700' : cs.type === 'staff' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>
                            {cs.status === 'audio' ? '📞 Audio' : cs.type === 'staff' ? '👤 Staff' : '🤖 Bot'}
                          </span>
                          {secLeft > 0 && cs.status === 'active' && (
                            <span className={`text-xs font-mono font-bold ml-auto ${secLeft < 60 ? 'text-red-400' : activeChatId === cs.id ? 'text-white/60' : 'text-gray-400'}`}>
                              {String(mins).padStart(2,'0')}:{String(secs).padStart(2,'0')}
                            </span>
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>
                <div className="flex-1 bg-white rounded-2xl border border-gray-100 flex flex-col overflow-hidden">
                  {!activeChatId ? (
                    <div className="flex-1 flex items-center justify-center text-gray-300 text-sm">Select a session to view</div>
                  ) : (() => {
                    const cs = chatSessions.find(s => s.id === activeChatId)
                    return (
                      <>
                        <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-3">
                          <div className="w-8 h-8 bg-[#1a3520] rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-xs font-bold">{cs?.users?.full_name?.[0] || 'U'}</span>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-[#1a3520]">{cs?.users?.full_name}</p>
                            <p className="text-xs text-gray-400">{cs?.users?.email} · {cs?.users?.phone}</p>
                          </div>
                          <span className={`ml-auto text-xs px-2.5 py-1 rounded-full font-medium ${cs?.type === 'staff' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>
                            {cs?.type === 'staff' ? 'You are live' : 'Bot active — reply to take over'}
                          </span>
                        </div>
                        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
                          {chatMessages.map((m, i) => (
                            <div key={m.id || i} className={`flex ${m.sender_type === 'user' ? 'justify-end' : 'justify-start'}`}>
                              {m.sender_type !== 'user' && (
                                <div className="w-6 h-6 rounded-full bg-[#1a3520] flex items-center justify-center mr-2 flex-shrink-0 mt-auto mb-1">
                                  <span className="text-white text-[10px] font-bold">{m.sender_type === 'staff' ? 'B' : 'V'}</span>
                                </div>
                              )}
                              <div className={`max-w-xs px-3.5 py-2 rounded-2xl text-sm leading-relaxed ${m.sender_type === 'user' ? 'bg-gray-100 text-gray-800 rounded-br-sm' : m.sender_type === 'staff' ? 'bg-[#1a3520] text-white rounded-bl-sm' : 'bg-blue-50 text-gray-800 border border-blue-100 rounded-bl-sm'}`}>
                                {m.content}
                              </div>
                            </div>
                          ))}
                          <div ref={chatBottomRef} />
                        </div>
                        <div className="px-4 py-3 border-t border-gray-100 flex gap-2">
                          <input type="text" value={staffInput} onChange={e => setStaffInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && sendStaffMessage()}
                            placeholder="Reply as Babita (counselor)…"
                            className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#1a3520] bg-[#fbfaf7]" />
                          <button onClick={sendStaffMessage} disabled={!staffInput.trim() || sendingStaff}
                            className="px-5 py-2.5 bg-[#1a3520] text-white rounded-xl text-sm font-medium hover:opacity-90 disabled:opacity-40">
                            {sendingStaff ? '…' : 'Send'}
                          </button>
                        </div>
                      </>
                    )
                  })()}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ══════════════ RETREATS TAB ══════════════ */}
        {activeTab === 'retreats' && (
          <div className="p-8 max-w-7xl">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-[#1a3520]">Retreat Bookings</h1>
              <button onClick={fetchRetreats} className="px-4 py-2 rounded-xl bg-[#1a3520] text-white text-sm font-medium hover:opacity-90">Refresh</button>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { label: 'Total',     val: retreats.length },
                { label: 'Confirmed', val: retreats.filter(r => r.status === 'confirmed').length },
                { label: 'Revenue',   val: `₹${retreats.filter(r => r.status === 'confirmed').reduce((s, r) => s + (r.amount_rupees || 0), 0).toLocaleString('en-IN')}` },
              ].map((s, i) => (
                <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                  className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                  <div className="text-2xl font-black text-[#1a3520]">{s.val}</div>
                  <div className="text-xs text-gray-400 mt-1 font-medium">{s.label}</div>
                </motion.div>
              ))}
            </div>
            <div className="flex gap-3 mb-5">
              <input type="text" value={retreatSearch} onChange={e => setRetreatSearch(e.target.value)}
                placeholder="Search name, email, package…"
                className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3520]/20 w-72" />
            </div>
            {loadingR ? (
              <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-16 bg-gray-100 rounded-2xl animate-pulse" />)}</div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50/70">
                        {['Guest','Package','Check-in','Check-out','Amount','Payment ID','Status','Booked'].map(h => (
                          <th key={h} className="text-left text-[11px] font-semibold text-gray-400 px-4 py-3 uppercase tracking-wide whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {retreats.filter(r => {
                        if (!retreatSearch) return true
                        const q = retreatSearch.toLowerCase()
                        return r.guest_name?.toLowerCase().includes(q) || r.guest_email?.toLowerCase().includes(q) || r.package_label?.toLowerCase().includes(q)
                      }).map(r => (
                        <tr key={r.id} className="border-b border-gray-50 last:border-0 hover:bg-[#f7f5f0] transition-colors">
                          <td className="px-4 py-3">
                            <p className="text-sm font-semibold text-[#1a3520]">{r.guest_name}</p>
                            <p className="text-xs text-gray-400">{r.guest_email}</p>
                            <p className="text-xs text-gray-400">{r.guest_phone}</p>
                          </td>
                          <td className="px-4 py-3"><p className="text-sm text-gray-700 whitespace-nowrap">{r.package_label}</p></td>
                          <td className="px-4 py-3"><p className="text-xs text-gray-700 whitespace-nowrap">{fmtDate(r.check_in_date)}</p></td>
                          <td className="px-4 py-3"><p className="text-xs text-gray-700 whitespace-nowrap">{fmtDate(r.check_out_date)}</p></td>
                          <td className="px-4 py-3"><span className="text-sm font-bold text-[#1a3520]">₹{(r.amount_rupees || 0).toLocaleString('en-IN')}</span></td>
                          <td className="px-4 py-3"><p className="text-xs text-gray-400 font-mono">{r.razorpay_payment_id || '—'}</p></td>
                          <td className="px-4 py-3"><span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-green-100 text-green-700">{r.status}</span></td>
                          <td className="px-4 py-3"><p className="text-xs text-gray-400 whitespace-nowrap">{fmtDate(r.created_at)}</p></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  )
}
