import { useEffect, useState, useCallback } from 'react'
import { supabaseAdmin } from '../../lib/supabaseAdmin'
import { NextSeo } from 'next-seo'
import Link from 'next/link'

// Window: 15 min before start → duration + 30 min after start
const OPEN_BEFORE_MINS  = 15
const CLOSE_AFTER_MINS  = 30

function getSlotDatetime(slotDate, startTime) {
  if (!slotDate || !startTime) return null
  const time = startTime.toString().slice(0, 5) // HH:MM
  // Treat as IST (UTC+5:30)
  return new Date(`${slotDate}T${time}:00+05:30`)
}

function fmt12(time24) {
  if (!time24) return ''
  const [h, m] = time24.toString().split(':')
  const hr = parseInt(h)
  return `${hr % 12 || 12}:${m} ${hr < 12 ? 'AM' : 'PM'}`
}

function fmtDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
}

function pad(n) { return String(n).padStart(2, '0') }

export default function JoinCall({ booking, slotIso, durationMins, status: initialStatus }) {
  const [status, setStatus]   = useState(initialStatus) // 'upcoming' | 'open' | 'ended' | 'invalid'
  const [countdown, setCd]    = useState({ d: 0, h: 0, m: 0, s: 0 })
  const [notifying, setNotif] = useState(false)
  const [notified, setNotified] = useState(false)

  const slotDt  = slotIso ? new Date(slotIso) : null
  const openAt  = slotDt ? new Date(slotDt.getTime() - OPEN_BEFORE_MINS * 60_000) : null
  const closeAt = slotDt ? new Date(slotDt.getTime() + (durationMins + CLOSE_AFTER_MINS) * 60_000) : null

  const tick = useCallback(() => {
    if (!openAt || !closeAt) return
    const now  = Date.now()
    if (now >= openAt.getTime() && now <= closeAt.getTime()) {
      setStatus('open')
      return
    }
    if (now > closeAt.getTime()) {
      setStatus('ended')
      return
    }
    // Countdown to openAt
    const diff = Math.max(0, openAt.getTime() - now)
    const totalSecs = Math.floor(diff / 1000)
    const d = Math.floor(totalSecs / 86400)
    const h = Math.floor((totalSecs % 86400) / 3600)
    const m = Math.floor((totalSecs % 3600) / 60)
    const s = totalSecs % 60
    setCd({ d, h, m, s })
  }, [openAt, closeAt])

  useEffect(() => {
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [tick])

  async function handleJoin() {
    if (notifying || !booking?.call_room_url) return
    setNotif(true)
    try {
      await fetch('/api/bookings/notify-call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ joinToken: booking.join_token }),
      })
      setNotified(true)
    } catch {}
    window.open(booking.call_room_url, '_blank')
    setNotif(false)
  }

  const rawDate  = booking?.slots?.slot_date  || booking?.booking_date
  const rawTime  = booking?.slots?.start_time || booking?.booking_time
  const dateStr  = fmtDate(rawDate)
  const timeStr  = fmt12(rawTime)
  const svcName  = booking?.services?.name || 'Your Session'

  // ── Invalid / not found ─────────────────────────────────────
  if (status === 'invalid' || !booking) {
    return (
      <div className="min-h-screen bg-[#fbfaf7] flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-[#1a3520] mb-2">Link not found</h1>
          <p className="text-gray-500 text-sm mb-6">This join link is invalid or has expired. Please check your confirmation email.</p>
          <Link href="/" className="text-[#1a3520] font-medium underline text-sm">Back to Mind Veda</Link>
        </div>
      </div>
    )
  }

  // ── Session ended ────────────────────────────────────────────
  if (status === 'ended') {
    return (
      <>
        <NextSeo title="Session Ended — Mind Veda" noindex />
        <div className="min-h-screen bg-[#fbfaf7] flex items-center justify-center px-4">
          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 max-w-sm w-full text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-[#1a3520] mb-2">Session window closed</h1>
            <p className="text-gray-500 text-sm mb-1">{svcName}</p>
            <p className="text-gray-400 text-xs mb-6">{dateStr} at {timeStr} IST</p>
            <p className="text-gray-500 text-sm mb-6">The join window for this session has passed. If you missed it, please contact Babita.</p>
            <a
              href="https://wa.me/917980925582"
              target="_blank" rel="noopener noreferrer"
              className="block w-full bg-[#1a3520] text-white rounded-full py-3 font-semibold text-sm hover:opacity-90 transition-opacity mb-3"
            >
              WhatsApp Babita
            </a>
            <Link href="/dashboard" className="block w-full text-gray-400 text-sm py-2 hover:text-gray-600 transition-colors">
              Go to Dashboard
            </Link>
          </div>
        </div>
      </>
    )
  }

  // ── Join window OPEN ─────────────────────────────────────────
  if (status === 'open') {
    return (
      <>
        <NextSeo title={`Join — ${svcName} | Mind Veda`} noindex />
        <div className="min-h-screen bg-[#ede9e2] flex items-center justify-center px-4 py-8">
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden w-full max-w-sm">
            <div className="bg-[#1a3520] px-6 py-6 text-center">
              <div className="w-12 h-12 bg-green-400/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <p className="text-green-300 text-xs font-semibold uppercase tracking-wider mb-1">Session Active</p>
              <h1 className="text-white text-xl font-semibold">{svcName}</h1>
              <p className="text-white/60 text-xs mt-1">{dateStr} · {timeStr} IST</p>
            </div>

            <div className="px-6 py-6 text-center">
              <div className="bg-green-50 border border-green-100 rounded-2xl px-4 py-3 mb-6">
                <p className="text-green-700 text-sm font-semibold">Your session is live — join now</p>
                <p className="text-green-600 text-xs mt-0.5">Babita will be notified the moment you click below</p>
              </div>

              {notified && (
                <p className="text-green-600 text-xs mb-3 font-medium">✓ Babita has been notified</p>
              )}

              <button
                onClick={handleJoin}
                disabled={notifying}
                className="w-full bg-[#1a3520] text-white rounded-full py-4 font-semibold text-sm hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-60 flex items-center justify-center gap-2 mb-3"
              >
                {notifying ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Connecting…
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Join Voice Session Now
                  </>
                )}
              </button>

              <p className="text-gray-400 text-xs">Having trouble? <a href="https://wa.me/917980925582" target="_blank" rel="noopener noreferrer" className="text-[#1a3520] underline">WhatsApp Babita</a></p>
            </div>
          </div>
        </div>
      </>
    )
  }

  // ── Upcoming — countdown ─────────────────────────────────────
  return (
    <>
      <NextSeo title={`Upcoming Session — ${svcName} | Mind Veda`} noindex />
      <div className="min-h-screen bg-[#fbfaf7] flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-sm">

          {/* Brand */}
          <div className="text-center mb-6">
            <p className="text-[#1a3520] font-bold text-lg tracking-tight">Mind Veda</p>
            <p className="text-gray-400 text-xs">by Babita Kumari</p>
          </div>

          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-[#1a3520] px-6 py-5 text-center">
              <p className="text-white/60 text-xs uppercase tracking-wider mb-1">Your Upcoming Session</p>
              <h1 className="text-white font-semibold text-lg">{svcName}</h1>
            </div>

            <div className="px-6 py-6">
              {/* Session details */}
              <div className="bg-[#f7f5f0] rounded-2xl px-4 py-4 mb-5 space-y-2.5">
                <div className="flex items-center gap-3 text-sm">
                  <svg className="w-4 h-4 text-[#1a3520] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
                  </svg>
                  <span className="text-gray-700">{dateStr}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <svg className="w-4 h-4 text-[#1a3520] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
                  </svg>
                  <span className="text-gray-700">{timeStr} IST</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <svg className="w-4 h-4 text-[#1a3520] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <span className="text-gray-700">Link activates 15 min before start</span>
                </div>
              </div>

              {/* Countdown */}
              <p className="text-center text-xs text-gray-400 uppercase tracking-wider mb-3">Session starts in</p>
              <div className="grid grid-cols-4 gap-2 mb-6">
                {[
                  { val: countdown.d, label: 'Days' },
                  { val: countdown.h, label: 'Hrs' },
                  { val: countdown.m, label: 'Min' },
                  { val: countdown.s, label: 'Sec' },
                ].map(({ val, label }) => (
                  <div key={label} className="bg-[#1a3520] rounded-2xl py-3 text-center">
                    <p className="text-white font-mono font-bold text-xl leading-none">{pad(val)}</p>
                    <p className="text-white/50 text-[10px] mt-1">{label}</p>
                  </div>
                ))}
              </div>

              <p className="text-center text-gray-400 text-xs">
                Keep this link safe — it's personal and only works during your session window.
              </p>
            </div>
          </div>

          <div className="text-center mt-5">
            <a href="https://wa.me/917980925582" target="_blank" rel="noopener noreferrer" className="text-[#1a3520] text-sm underline">
              Need help? WhatsApp Babita
            </a>
          </div>
        </div>
      </div>
    </>
  )
}

export async function getServerSideProps({ params }) {
  const { token } = params

  if (!token) return { props: { booking: null, status: 'invalid' } }

  const { data: booking } = await supabaseAdmin
    .from('bookings')
    .select('*, users(full_name, email), services(name, duration_minutes), slots(slot_date, start_time)')
    .eq('join_token', token)
    .eq('status', 'confirmed')
    .single()

  if (!booking || !booking.call_room_url) {
    return { props: { booking: null, status: 'invalid' } }
  }

  const rawDate = booking.slots?.slot_date  || booking.booking_date
  const rawTime = booking.slots?.start_time || booking.booking_time

  const slotDt = getSlotDatetime(rawDate, rawTime)

  if (!slotDt) {
    return { props: { booking: null, status: 'invalid' } }
  }

  const durationMins = booking.services?.duration_minutes || 60
  const openAt  = new Date(slotDt.getTime() - OPEN_BEFORE_MINS * 60_000)
  const closeAt = new Date(slotDt.getTime() + (durationMins + CLOSE_AFTER_MINS) * 60_000)
  const now     = new Date()

  let status = 'upcoming'
  if (now >= openAt && now <= closeAt) status = 'open'
  if (now > closeAt)                   status = 'ended'

  // Serialize — remove circular/non-serializable fields
  const safeBooking = {
    join_token:    booking.join_token,
    call_room_url: booking.call_room_url,
    booking_date:  booking.booking_date  ? String(booking.booking_date)  : null,
    booking_time:  booking.booking_time  ? String(booking.booking_time)  : null,
    services: booking.services ? {
      name:            booking.services.name,
      duration_minutes: booking.services.duration_minutes,
    } : null,
    slots: booking.slots ? {
      slot_date:  String(booking.slots.slot_date),
      start_time: String(booking.slots.start_time),
    } : null,
  }

  return {
    props: {
      booking:    safeBooking,
      slotIso:    slotDt.toISOString(),
      durationMins,
      status,
    },
  }
}
