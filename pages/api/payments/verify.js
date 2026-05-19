import crypto from 'crypto'
import { supabaseAdmin } from '../../../lib/supabaseAdmin'
import { resend } from '../../../lib/resend'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body

  // Verify Razorpay signature
  const expected = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex')

  if (expected !== razorpay_signature) {
    return res.status(400).json({ error: 'Invalid payment signature' })
  }

  // Mark payment paid
  await supabaseAdmin
    .from('payments')
    .update({ razorpay_payment_id, status: 'paid', paid_at: new Date().toISOString() })
    .eq('razorpay_order_id', razorpay_order_id)

  // Confirm booking
  const { data: booking, error } = await supabaseAdmin
    .from('bookings')
    .update({ status: 'confirmed' })
    .eq('id', bookingId)
    .select('*, users(email, full_name, phone), services(name, price, duration_minutes, type)')
    .single()

  if (error || !booking) return res.status(500).json({ error: 'Booking update failed' })

  const dateStr = booking.booking_date
    ? new Date(booking.booking_date).toLocaleDateString('en-IN', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
      })
    : '—'

  const timeStr = booking.booking_time
    ? fmt12(booking.booking_time)
    : '—'

  const amountRupees = Math.round((booking.services?.price || 0) / 100)

  // Email to client
  await resend.emails.send({
    from:    process.env.RESEND_FROM_EMAIL,
    to:      booking.users.email,
    subject: `Booking Confirmed — ${booking.services.name}`,
    html:    buildConfirmEmail({
      name:      booking.users.full_name,
      service:   booking.services.name,
      type:      booking.services.type,
      date:      dateStr,
      time:      timeStr,
      duration:  booking.services.duration_minutes,
      amount:    amountRupees,
      bookingId: booking.id,
    }),
  })

  // Email to admin
  await resend.emails.send({
    from:    process.env.RESEND_FROM_EMAIL,
    to:      process.env.ADMIN_EMAIL,
    subject: `New Booking — ${booking.services.name}`,
    html: `<p style="font-family:sans-serif;line-height:1.7">
      <b>New confirmed booking</b><br><br>
      Client: ${booking.users.full_name}<br>
      Email: ${booking.users.email}<br>
      Phone: ${booking.users.phone || 'Not provided'}<br><br>
      Service: ${booking.services.name} (${booking.services.type})<br>
      Date: ${dateStr}<br>
      Time: ${timeStr}<br>
      Duration: ${booking.services.duration_minutes} min<br>
      Amount: ₹${amountRupees}<br><br>
      Booking ID: ${booking.id}
    </p>`,
  })

  res.json({ success: true, bookingId: booking.id })
}

function fmt12(time24) {
  if (!time24) return ''
  const [h, m] = time24.split(':')
  const hr = parseInt(h)
  return `${hr % 12 || 12}:${m} ${hr < 12 ? 'AM' : 'PM'}`
}

function buildConfirmEmail({ name, service, type, date, time, duration, amount, bookingId }) {
  return `
<!DOCTYPE html>
<html>
<body style="font-family:sans-serif;background:#f7f7f5;padding:32px;margin:0">
  <div style="max-width:520px;margin:0 auto;background:white;border-radius:16px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08)">
    <div style="background:#1a3520;padding:28px 32px;text-align:center">
      <h1 style="color:white;margin:0;font-size:22px">Mind Veda</h1>
      <p style="color:#f5a623;margin:6px 0 0;font-size:13px">Booking Confirmed ✓</p>
    </div>
    <div style="padding:32px">
      <p style="color:#333;font-size:15px">Dear ${name},</p>
      <p style="color:#555;font-size:14px">Your session is booked. Here are your details:</p>
      <div style="background:#f7f7f5;border-radius:12px;padding:20px;margin:20px 0">
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="color:#888;font-size:13px;padding:5px 0">Service</td>
              <td style="color:#1a3520;font-weight:600;text-align:right">${service}</td></tr>
          <tr><td style="color:#888;font-size:13px;padding:5px 0">Type</td>
              <td style="color:#1a3520;font-weight:600;text-align:right;text-transform:capitalize">${type}</td></tr>
          <tr><td style="color:#888;font-size:13px;padding:5px 0">Date</td>
              <td style="color:#1a3520;font-weight:600;text-align:right">${date}</td></tr>
          <tr><td style="color:#888;font-size:13px;padding:5px 0">Time</td>
              <td style="color:#1a3520;font-weight:600;text-align:right">${time}</td></tr>
          <tr><td style="color:#888;font-size:13px;padding:5px 0">Duration</td>
              <td style="color:#1a3520;font-weight:600;text-align:right">${duration} min</td></tr>
          <tr><td style="color:#888;font-size:13px;padding:5px 0">Amount Paid</td>
              <td style="color:#1a3520;font-weight:700;font-size:16px;text-align:right">₹${amount}</td></tr>
          <tr><td style="color:#aaa;font-size:11px;padding:5px 0">Booking ID</td>
              <td style="color:#aaa;font-size:11px;text-align:right">${bookingId.slice(0,8).toUpperCase()}</td></tr>
        </table>
      </div>
      <p style="color:#555;font-size:13px">Babita will send you the session link before your appointment.</p>
      <p style="color:#1a3520;font-size:13px;font-weight:600">Need help? WhatsApp: +91 79809 25582</p>
    </div>
    <div style="background:#f7f7f5;padding:16px 32px;text-align:center">
      <p style="color:#aaa;font-size:11px;margin:0">© 2025 Mind Veda by Babita Kumari</p>
    </div>
  </div>
</body>
</html>`
}
