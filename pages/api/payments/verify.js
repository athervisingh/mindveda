import crypto from 'crypto'
import { supabaseAdmin } from '../../../lib/supabaseAdmin'
import { resend } from '../../../lib/resend'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingIds } = req.body

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

  // Generate unique join_token + call_room_url for each booking
  const tokenUpdates = bookingIds.map(id => {
    const token = crypto.randomBytes(14).toString('hex') // 28-char unique token
    const callRoomUrl = `https://meet.jit.si/mindveda-${token.slice(0, 12)}`
    return { id, join_token: token, call_room_url: callRoomUrl }
  })

  // Update each booking with its token
  await Promise.all(
    tokenUpdates.map(({ id, join_token, call_room_url }) =>
      supabaseAdmin.from('bookings').update({ join_token, call_room_url }).eq('id', id)
    )
  )

  const { data: bookings, error } = await supabaseAdmin
    .from('bookings')
    .update({ status: 'confirmed' })
    .in('id', bookingIds)
    .select('*, users(email, full_name, phone), services(name, price, duration_minutes, type), slots(slot_date, start_time)')

  if (error || !bookings?.length) return res.status(500).json({ error: 'Booking update failed' })

  const user      = bookings[0].users
  const totalPaid = bookings.reduce((s, b) => s + (b.services?.price || 0), 0)

  // Save phone to users table if not already stored (collected from booking form)
  const userId = bookings[0].user_id
  const phoneFromBody = req.body.phone || null
  if (phoneFromBody && userId) {
    await supabaseAdmin
      .from('users')
      .update({ phone: phoneFromBody, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .is('phone', null) // only update if phone not already saved
  }
  const siteUrl   = process.env.NEXT_PUBLIC_SITE_URL || 'https://mindvedabybabita.com'

  // Build session rows for emails — include join link per booking
  const sessionRows = bookings.map(b => {
    const token  = tokenUpdates.find(t => t.id === b.id)
    const joinLink = token ? `${siteUrl}/join/${token.join_token}` : null
    const dateStr = b.slots?.slot_date
      ? new Date(b.slots.slot_date).toLocaleDateString('en-IN', {
          weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
        })
      : b.booking_date
        ? new Date(b.booking_date).toLocaleDateString('en-IN', {
            weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
          })
        : '—'
    const rawTime = b.slots?.start_time || b.booking_time
    const timeStr  = rawTime ? fmt12(rawTime) : '—'
    return { name: b.services.name, date: dateStr, time: timeStr, duration: b.services.duration_minutes, joinLink }
  })

  // Email to client
  await resend.emails.send({
    from:    process.env.RESEND_FROM_EMAIL,
    to:      user.email,
    subject: bookings.length === 1
      ? `Booking Confirmed — ${bookings[0].services.name}`
      : `${bookings.length} Sessions Booked — Mind Veda`,
    html: buildConfirmEmail({
      name:      user.full_name,
      sessions:  sessionRows,
      totalPaid: Math.round(totalPaid / 100),
      bookingId: bookings[0].id,
    }),
  })

  // Email to admin (Babita) with join links
  const sessionList = sessionRows.map(s =>
    `${s.name} — ${s.date} at ${s.time} (${s.duration} min)${s.joinLink ? `<br><small>Join link: <a href="${s.joinLink}">${s.joinLink}</a></small>` : ''}`
  ).join('<br><br>')

  await resend.emails.send({
    from:    process.env.RESEND_FROM_EMAIL,
    to:      process.env.ADMIN_EMAIL,
    subject: `New Booking${bookings.length > 1 ? 's' : ''} — ${user.full_name}`,
    html: `<p style="font-family:sans-serif;line-height:1.7">
      <b>${bookings.length} session${bookings.length > 1 ? 's' : ''} confirmed</b><br><br>
      Client: ${user.full_name}<br>
      Email: ${user.email}<br>
      Phone: ${user.phone || 'Not provided'}<br><br>
      Sessions:<br>${sessionList}<br><br>
      Total Amount: ₹${Math.round(totalPaid / 100)}<br>
      Booking ID(s): ${bookings.map(b => b.id.slice(0, 8).toUpperCase()).join(', ')}
    </p>`,
  })

  // Create quick intro chat for first-time users
  let chatSessionId = null
  try {
    const b = bookings[0]
    const { count: priorCount } = await supabaseAdmin
      .from('bookings')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', b.user_id)
      .eq('status', 'confirmed')
      .not('id', 'in', `(${bookings.map(x => x.id).join(',')})`)

    if (priorCount > 0) {
      return res.json({ success: true, bookingIds, chatSessionId: null })
    }

    const serviceSlug = b.services?.slug || ''
    const serviceName = b.services?.name || 'Counseling'
    const now = new Date()
    const endsAt = new Date(now.getTime() + 5 * 60 * 1000)

    const { data: chatSession } = await supabaseAdmin
      .from('chat_sessions')
      .insert({
        booking_id: `${b.id}|service:${serviceSlug}`,
        user_id: b.user_id,
        type: 'bot',
        status: 'active',
        started_at: now.toISOString(),
        ends_at: endsAt.toISOString(),
      })
      .select()
      .single()

    if (chatSession) {
      chatSessionId = chatSession.id
      const welcomeMap = {
        'individual-counseling': `Namaste! I'm Veda, your Mind Veda wellness guide. I see you're interested in **Individual Counseling**. Before your session with Babita, I'd love to understand you better. What's been weighing on your mind lately — is it stress, relationships, anxiety, or something else?`,
        'child-counseling': `Namaste! I'm Veda from Mind Veda. I see you've booked **Child Counseling** — you're taking a wonderful step for your child. To help Babita prepare, could you tell me: How old is your child, and what changes in behavior or emotions have you noticed?`,
        'stress-counseling': `Namaste! I'm Veda from Mind Veda. You've booked **Stress Counseling** — a great decision. To help Babita understand your situation, tell me: Where is most of your stress coming from right now — work, family, health, or finances?`,
        'career-counseling': `Namaste! I'm Veda from Mind Veda. You've booked **Career Counseling**. I'd love to understand your situation better. Are you feeling stuck in your current job, confused about which career to choose, or looking for a change? Tell me more.`,
        'family-counseling': `Namaste! I'm Veda from Mind Veda. You've booked **Family Counseling**. Family matters can be deeply complex. To help Babita prepare, could you share: What's the main challenge in your family right now — communication, conflict, or something else?`,
        'sports-counseling': `Namaste! I'm Veda from Mind Veda. You've booked **Sports Counseling**. Mental strength is key to great performance. Tell me: What sport do you play, and what mental challenges are affecting your game — anxiety, focus, pressure, or motivation?`,
      }
      const welcomeText = welcomeMap[serviceSlug] ||
        `Namaste! I'm Veda, your Mind Veda wellness guide. You've booked **${serviceName}** — I'm here to understand your needs before your session with Babita. How are you feeling today, and what brings you here?`

      await supabaseAdmin.from('chat_messages').insert({
        session_id: chatSession.id,
        sender_type: 'bot',
        content: welcomeText,
      })
    }
  } catch (err) {
    console.error('Chat session creation error:', err.message)
  }

  res.json({ success: true, bookingIds, chatSessionId })
}

function fmt12(time24) {
  if (!time24) return ''
  const [h, m] = time24.toString().split(':')
  const hr = parseInt(h)
  return `${hr % 12 || 12}:${m} ${hr < 12 ? 'AM' : 'PM'}`
}

function buildConfirmEmail({ name, sessions, totalPaid, bookingId }) {
  const sessionRows = sessions.map(s => `
    <tr>
      <td colspan="2" style="padding:8px 0 4px;color:#1a3520;font-weight:600;font-size:14px">${s.name}</td>
    </tr>
    <tr>
      <td style="color:#888;font-size:13px;padding:2px 0">Date</td>
      <td style="color:#1a3520;font-weight:500;text-align:right">${s.date}</td>
    </tr>
    <tr>
      <td style="color:#888;font-size:13px;padding:2px 0">Time</td>
      <td style="color:#1a3520;font-weight:500;text-align:right">${s.time} IST</td>
    </tr>
    <tr>
      <td style="color:#888;font-size:13px;padding:2px 0">Duration</td>
      <td style="color:#1a3520;font-weight:500;text-align:right">${s.duration} min</td>
    </tr>
    ${s.joinLink ? `
    <tr>
      <td colspan="2" style="padding:8px 0 4px">
        <a href="${s.joinLink}"
           style="display:block;background:#1a3520;color:white;text-decoration:none;text-align:center;padding:11px 0;border-radius:8px;font-weight:600;font-size:13px">
          Join Voice Session →
        </a>
        <p style="color:#aaa;font-size:10px;text-align:center;margin:4px 0 0">
          Link opens 15 min before your session time
        </p>
      </td>
    </tr>` : ''}
    <tr><td colspan="2" style="padding:4px 0"><hr style="border:none;border-top:1px solid #eee;margin:4px 0"></td></tr>
  `).join('')

  return `
<!DOCTYPE html>
<html>
<body style="font-family:sans-serif;background:#f7f7f5;padding:32px;margin:0">
  <div style="max-width:520px;margin:0 auto;background:white;border-radius:16px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08)">
    <div style="background:#1a3520;padding:28px 32px;text-align:center">
      <h1 style="color:white;margin:0;font-size:22px">Mind Veda</h1>
      <p style="color:#f5a623;margin:6px 0 0;font-size:13px">Booking${sessions.length > 1 ? 's' : ''} Confirmed ✓</p>
    </div>
    <div style="padding:32px">
      <p style="color:#333;font-size:15px">Dear ${name},</p>
      <p style="color:#555;font-size:14px">Your session${sessions.length > 1 ? 's are' : ' is'} confirmed. A unique voice call link is included below — it will activate 15 minutes before your session time.</p>
      <div style="background:#f7f7f5;border-radius:12px;padding:20px;margin:20px 0">
        <table style="width:100%;border-collapse:collapse">
          ${sessionRows}
          <tr>
            <td style="color:#888;font-size:13px;padding:8px 0 2px">Total Paid</td>
            <td style="color:#1a3520;font-weight:700;font-size:18px;text-align:right">₹${totalPaid}</td>
          </tr>
          <tr>
            <td style="color:#aaa;font-size:11px;padding:4px 0">Booking Ref</td>
            <td style="color:#aaa;font-size:11px;text-align:right">${bookingId.slice(0, 8).toUpperCase()}</td>
          </tr>
        </table>
      </div>
      <p style="color:#555;font-size:13px">The join link in this email is personal — please do not share it. It only works during your session window.</p>
      <p style="color:#1a3520;font-size:13px;font-weight:600">Need help? WhatsApp: +91 79809 25582</p>
    </div>
    <div style="background:#f7f7f5;padding:16px 32px;text-align:center">
      <p style="color:#aaa;font-size:11px;margin:0">© 2025 Mind Veda by Babita Kumari</p>
    </div>
  </div>
</body>
</html>`
}
