import { supabaseAdmin } from '../../../lib/supabaseAdmin'
import { resend } from '../../../lib/resend'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { joinToken } = req.body
  if (!joinToken) return res.status(400).json({ error: 'Missing token' })

  const { data: booking } = await supabaseAdmin
    .from('bookings')
    .select('*, users(full_name, email, phone), services(name, duration_minutes), slots(slot_date, start_time)')
    .eq('join_token', joinToken)
    .eq('status', 'confirmed')
    .single()

  if (!booking) return res.status(404).json({ error: 'Booking not found' })

  const user        = booking.users
  const serviceName = booking.services?.name || 'Session'
  const callUrl     = booking.call_room_url
  const rawTime     = booking.slots?.start_time || booking.booking_time
  const rawDate     = booking.slots?.slot_date  || booking.booking_date

  const dateStr = rawDate
    ? new Date(rawDate).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
    : '—'
  const timeStr = rawTime ? fmt12(rawTime) : '—'

  // Telegram
  try {
    const tgMsg = `🔔 *Client Joining Now!*\n\n📋 Service: ${serviceName}\n👤 Client: ${user?.full_name || 'User'}\n📱 Phone: ${user?.phone || 'Not provided'}\n📅 ${dateStr} at ${timeStr} IST\n\n🎙️ Join immediately:\n${callUrl}`
    await fetch(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: process.env.TELEGRAM_CHAT_ID,
          text: tgMsg,
          parse_mode: 'Markdown',
        }),
      }
    )
  } catch (err) {
    console.error('[Telegram notify-call error]', err.message)
  }

  // Email to Babita
  try {
    await resend.emails.send({
      from:    process.env.RESEND_FROM_EMAIL,
      to:      process.env.ADMIN_EMAIL,
      subject: `URGENT: ${user?.full_name || 'Client'} is joining their ${serviceName} call now`,
      html: `<div style="font-family:sans-serif;line-height:1.8;max-width:500px">
        <div style="background:#1a3520;color:white;padding:20px;border-radius:8px 8px 0 0">
          <h2 style="margin:0">Client Joining — Join Now</h2>
          <p style="margin:4px 0 0;color:#f5a623">${serviceName} · ${dateStr} at ${timeStr}</p>
        </div>
        <div style="background:#fff;border:1px solid #eee;padding:20px;border-radius:0 0 8px 8px">
          <p><b>Client:</b> ${user?.full_name || '—'}</p>
          <p><b>Email:</b> ${user?.email || '—'}</p>
          <p><b>Phone:</b> ${user?.phone || 'Not provided'}</p>
          <p style="margin-top:24px">
            <a href="${callUrl}" style="background:#1a3520;color:white;padding:12px 28px;border-radius:6px;text-decoration:none;font-weight:600;font-size:15px">
              Join Voice Call Now →
            </a>
          </p>
          <p style="color:#888;font-size:12px;margin-top:16px">Room: ${callUrl}</p>
        </div>
      </div>`,
    })
  } catch (err) {
    console.error('[Email notify-call error]', err.message)
  }

  res.json({ success: true })
}

function fmt12(time24) {
  if (!time24) return ''
  const [h, m] = time24.toString().split(':')
  const hr = parseInt(h)
  return `${hr % 12 || 12}:${m} ${hr < 12 ? 'AM' : 'PM'}`
}
