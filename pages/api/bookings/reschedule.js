import { supabaseAdmin } from '../../../lib/supabaseAdmin'
import { resend } from '../../../lib/resend'

const GROUP_CAPACITY = 50

function fmt12(time24) {
  if (!time24) return ''
  const [h, m] = time24.split(':')
  const hr = parseInt(h)
  return `${hr % 12 || 12}:${m} ${hr < 12 ? 'AM' : 'PM'}`
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { bookingId, newDate, newTime, reason } = req.body
  if (!bookingId || !newDate || !newTime) {
    return res.status(400).json({ error: 'bookingId, newDate, newTime required' })
  }

  const { data: booking } = await supabaseAdmin
    .from('bookings')
    .select('*, users(email, full_name), services(id, name, type)')
    .eq('id', bookingId)
    .single()

  if (!booking) return res.status(404).json({ error: 'Booking not found' })

  // Check availability at new time using bookings table
  const { data: allBookings } = await supabaseAdmin
    .from('bookings')
    .select('service_id, services(type)')
    .eq('booking_date', newDate)
    .in('status', ['confirmed', 'rescheduled'])

  const atTime = (allBookings || []).filter(b =>
    b.booking_time && b.booking_time.startsWith(newTime)
  )

  const individualCount = atTime.filter(b => b.services?.type === 'individual').length
  const groupCount      = atTime.filter(b => b.services?.type === 'group').length
  const thisGroupCount  = atTime.filter(b => b.service_id === booking.services?.id).length

  if (individualCount > 0) {
    return res.status(409).json({ error: 'That time is already booked by someone else.' })
  }
  if (booking.services?.type === 'individual' && groupCount > 0) {
    return res.status(409).json({ error: 'A group session is running at that time.' })
  }
  if (booking.services?.type === 'group' && thisGroupCount >= GROUP_CAPACITY) {
    return res.status(409).json({ error: 'That group session is full.' })
  }

  const oldDate = booking.booking_date
    ? new Date(booking.booking_date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'long' })
    : 'previous date'
  const oldTime = booking.booking_time ? fmt12(booking.booking_time) : ''

  const newDateDisplay = new Date(newDate).toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })

  await supabaseAdmin
    .from('bookings')
    .update({ booking_date: newDate, booking_time: newTime, status: 'rescheduled' })
    .eq('id', bookingId)

  await supabaseAdmin.from('reschedule_requests').insert({
    rescheduled_by:       null,
    reason:               reason || 'Admin rescheduled',
    affected_users_count: 1,
    emails_sent_count:    1,
  })

  await resend.emails.send({
    from:    process.env.RESEND_FROM_EMAIL,
    to:      booking.users.email,
    subject: `Your session has been rescheduled — ${booking.services.name}`,
    html: `
<!DOCTYPE html>
<html>
<body style="font-family:sans-serif;background:#f7f7f5;padding:32px;margin:0">
  <div style="max-width:520px;margin:0 auto;background:white;border-radius:16px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08)">
    <div style="background:#1a3520;padding:28px 32px;text-align:center">
      <h1 style="color:white;margin:0;font-size:22px">Mind Veda</h1>
      <p style="color:#f5a623;margin:6px 0 0;font-size:13px">Session Rescheduled</p>
    </div>
    <div style="padding:32px">
      <p style="color:#333;font-size:15px">Dear ${booking.users.full_name},</p>
      <p style="color:#555;font-size:14px">Your session has been rescheduled. Please note your new timing:</p>
      <div style="background:#f7f7f5;border-radius:12px;padding:20px;margin:20px 0">
        <p style="margin:0 0 8px;color:#888;font-size:12px">SERVICE</p>
        <p style="margin:0 0 16px;color:#1a3520;font-weight:700">${booking.services.name}</p>
        <p style="margin:0 0 4px;color:#888;font-size:12px">PREVIOUS DATE & TIME</p>
        <p style="margin:0 0 16px;color:#aaa;text-decoration:line-through">${oldDate}${oldTime ? ', ' + oldTime : ''}</p>
        <p style="margin:0 0 4px;color:#888;font-size:12px">NEW DATE & TIME</p>
        <p style="margin:0;color:#1a3520;font-weight:700;font-size:16px">${newDateDisplay}, ${fmt12(newTime)}</p>
      </div>
      ${reason ? `<p style="color:#555;font-size:13px"><b>Reason:</b> ${reason}</p>` : ''}
      <p style="color:#555;font-size:13px">If this doesn't work for you, please reply or WhatsApp: <b>+91 79809 25582</b></p>
    </div>
    <div style="background:#f7f7f5;padding:16px 32px;text-align:center">
      <p style="color:#aaa;font-size:11px;margin:0">© 2025 Mind Veda by Babita Kumari</p>
    </div>
  </div>
</body>
</html>`,
  })

  res.json({ success: true })
}
