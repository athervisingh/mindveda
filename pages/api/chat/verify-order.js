import crypto from 'crypto'
import { supabaseAdmin } from '../../../lib/supabaseAdmin'
import { resend } from '../../../lib/resend'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId, userId } = req.body

  const expected = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex')

  if (expected !== razorpay_signature) {
    return res.status(400).json({ error: 'Invalid payment signature' })
  }

  await supabaseAdmin
    .from('payments')
    .update({ razorpay_payment_id, status: 'paid', paid_at: new Date().toISOString() })
    .eq('razorpay_order_id', razorpay_order_id)

  await supabaseAdmin
    .from('bookings')
    .update({ status: 'confirmed' })
    .eq('id', bookingId)

  const now = new Date()
  const endsAt = new Date(now.getTime() + 5 * 60 * 1000) // 5 minutes chat

  // Pre-create Jitsi voice call room — included in ₹99 bundle
  const roomSlug = `mindveda-${bookingId.replace(/-/g, '').slice(0, 12)}`
  const audioRoomUrl = `https://meet.jit.si/${roomSlug}`

  const { data: session, error } = await supabaseAdmin
    .from('chat_sessions')
    .insert({
      booking_id: String(bookingId),
      user_id: userId,
      type: 'bot',
      status: 'active',
      started_at: now.toISOString(),
      ends_at: endsAt.toISOString(),
      audio_room_url: audioRoomUrl, // pre-set — no second payment needed
    })
    .select()
    .single()

  if (error) return res.status(500).json({ error: error.message })

  // Welcome message from bot
  await supabaseAdmin.from('chat_messages').insert({
    session_id: session.id,
    sender_type: 'bot',
    content: "Namaste! I'm Veda, your Mind Veda wellness guide. You have 5 minutes — share what's on your mind and I'll listen. How are you feeling today?",
  })

  const { data: userRow } = await supabaseAdmin
    .from('users')
    .select('full_name, email, phone')
    .eq('id', userId)
    .single()

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL,
    to: process.env.ADMIN_EMAIL,
    subject: `New Quick Chat Session — ${userRow?.full_name || 'User'}`,
    html: `<p style="font-family:sans-serif;line-height:1.8">
      <b>New ₹99 chat + voice call session started.</b><br><br>
      Client: ${userRow?.full_name || '—'}<br>
      Email: ${userRow?.email || '—'}<br>
      Phone: ${userRow?.phone || 'Not provided'}<br><br>
      Session ID: ${session.id}<br>
      Started: ${now.toLocaleString('en-IN')}<br>
      Chat ends at: ${endsAt.toLocaleString('en-IN')}<br><br>
      Voice call room (ready when client joins): <a href="${audioRoomUrl}">${audioRoomUrl}</a><br><br>
      <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://mindvedabybabita.com'}/admin?tab=chats">View in Admin Dashboard →</a>
    </p>`,
  })

  res.json({ success: true, sessionId: session.id })
}
