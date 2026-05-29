import crypto from 'crypto'
import { supabaseAdmin } from '../../../lib/supabaseAdmin'
import { resend } from '../../../lib/resend'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, sessionId, userId } = req.body

  const expected = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex')

  if (expected !== razorpay_signature) {
    return res.status(400).json({ error: 'Invalid payment signature' })
  }

  const { data: session } = await supabaseAdmin
    .from('chat_sessions')
    .select('id, user_id')
    .eq('id', sessionId)
    .single()

  if (!session || session.user_id !== userId) {
    return res.status(403).json({ error: 'Invalid session' })
  }

  // Jitsi room — no API needed, just a unique room name
  const roomSlug = `mindveda-${sessionId.replace(/-/g, '').slice(0, 10)}`
  const audioRoomUrl = `https://meet.jit.si/${roomSlug}`

  await supabaseAdmin
    .from('chat_sessions')
    .update({ status: 'audio', audio_room_url: audioRoomUrl })
    .eq('id', sessionId)

  const { data: userRow } = await supabaseAdmin
    .from('users')
    .select('full_name, email, phone')
    .eq('id', userId)
    .single()

  // Telegram instant notification to Babita
  try {
    const tgMsg = `🔔 *Voice Call Request!*\n\nClient: ${userRow?.full_name || 'User'}\nPhone: ${userRow?.phone || 'Not provided'}\n\n👆 Tap to join:\n${audioRoomUrl}`
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
    console.error('[Telegram notify error]', err.message)
  }

  // Email admin with room link
  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL,
    to: process.env.ADMIN_EMAIL,
    subject: `URGENT: Voice Call Ready — ${userRow?.full_name || 'User'} is waiting`,
    html: `<div style="font-family:sans-serif;line-height:1.8;max-width:500px">
      <div style="background:#1a3520;color:white;padding:20px;border-radius:8px 8px 0 0">
        <h2 style="margin:0">Voice Call Request</h2>
        <p style="margin:4px 0 0;color:#f5a623">A client has paid ₹10 and is waiting for you</p>
      </div>
      <div style="background:#fff;border:1px solid #eee;padding:20px;border-radius:0 0 8px 8px">
        <p><b>Client:</b> ${userRow?.full_name || '—'}</p>
        <p><b>Email:</b> ${userRow?.email || '—'}</p>
        <p><b>Phone:</b> ${userRow?.phone || 'Not provided'}</p>
        <p style="margin-top:24px">
          <a href="${audioRoomUrl}" style="background:#1a3520;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:600">
            Join Voice Call Now →
          </a>
        </p>
        <p style="color:#888;font-size:12px;margin-top:16px">Room: ${audioRoomUrl}</p>
      </div>
    </div>`,
  })

  res.json({ success: true, audioRoomUrl })
}
