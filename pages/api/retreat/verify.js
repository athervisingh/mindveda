import crypto from 'crypto'
import { resend } from '../../../lib/resend'
import { supabaseAdmin } from '../../../lib/supabaseAdmin'

const PACKAGE_LABELS = {
'twin-sharing': 'Twin Sharing Room (1 Room, 2 Beds)',
  'single-stay':  'Single Stay (Private Room)',
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const {
    razorpay_order_id, razorpay_payment_id, razorpay_signature,
    packageId, price, checkInDate, checkOutDate, name, email, phone, userId,
  } = req.body

  // Verify Razorpay signature
  const expected = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex')

  if (expected !== razorpay_signature) {
    return res.status(400).json({ error: 'Invalid payment signature' })
  }

  const label = PACKAGE_LABELS[packageId] || packageId
  const checkInDisplay  = new Date(checkInDate).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  const checkOutDisplay = new Date(checkOutDate).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  // Store in DB
  try {
    await supabaseAdmin.from('retreat_bookings').insert({
      user_id:             userId || null,
      package_id:          packageId,
      package_label:       label,
      check_in_date:       checkInDate,
      check_out_date:      checkOutDate,
      guest_name:          name,
      guest_email:         email,
      guest_phone:         phone,
      amount_rupees:       price || 0,
      razorpay_order_id:   razorpay_order_id,
      razorpay_payment_id: razorpay_payment_id,
      status:              'confirmed',
    })
  } catch (dbErr) {
    console.error('Retreat DB insert failed:', dbErr)
  }

  // Send emails (non-blocking)
  try {
    await resend.emails.send({
      from:    process.env.RESEND_FROM_EMAIL,
      to:      email,
      subject: `Retreat Booking Confirmed — Mind Veda`,
      html: `
<!DOCTYPE html>
<html>
<body style="font-family:sans-serif;background:#f7f7f5;padding:32px;margin:0">
  <div style="max-width:520px;margin:0 auto;background:white;border-radius:16px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08)">
    <div style="background:#1a3520;padding:28px 32px;text-align:center">
      <h1 style="color:white;margin:0;font-size:22px">Mind Veda</h1>
      <p style="color:#f5a623;margin:6px 0 0;font-size:13px">Retreat Booking Confirmed ✓</p>
    </div>
    <div style="padding:32px">
      <p style="color:#333;font-size:15px">Dear ${name},</p>
      <p style="color:#555;font-size:14px">Your retreat booking is confirmed! We look forward to welcoming you to our Spiritual Wellness Retreat in Rishikesh.</p>
      <div style="background:#f7f7f5;border-radius:12px;padding:20px;margin:20px 0">
        <table style="width:100%;border-collapse:collapse;font-size:14px">
          <tr><td style="color:#888;padding:5px 0">Package</td><td style="color:#1a3520;font-weight:700;text-align:right">${label}</td></tr>
          <tr><td style="color:#888;padding:5px 0">Check-in</td><td style="color:#1a3520;font-weight:600;text-align:right">${checkInDisplay}</td></tr>
          <tr><td style="color:#888;padding:5px 0">Check-out</td><td style="color:#1a3520;font-weight:600;text-align:right">${checkOutDisplay}</td></tr>
          <tr><td style="color:#888;padding:5px 0">Duration</td><td style="color:#1a3520;font-weight:600;text-align:right">3 Days / 2 Nights</td></tr>
          <tr><td style="color:#888;padding:5px 0">Amount Paid</td><td style="color:#1a3520;font-weight:700;font-size:16px;text-align:right">₹${(price || 0).toLocaleString('en-IN')}</td></tr>
          <tr><td style="color:#aaa;font-size:11px;padding:5px 0">Payment ID</td><td style="color:#aaa;font-size:11px;text-align:right">${razorpay_payment_id}</td></tr>
        </table>
      </div>
      <p style="color:#555;font-size:13px">Babita will share the detailed itinerary and arrival instructions before your retreat date.</p>
      <p style="color:#1a3520;font-size:13px;font-weight:600">Questions? WhatsApp: +91 79809 25582</p>
    </div>
    <div style="background:#f7f7f5;padding:16px 32px;text-align:center">
      <p style="color:#aaa;font-size:11px;margin:0">© 2025 Mind Veda by Babita Kumari · Rishikesh, Uttarakhand</p>
    </div>
  </div>
</body>
</html>`,
    })

    await resend.emails.send({
      from:    process.env.RESEND_FROM_EMAIL,
      to:      process.env.ADMIN_EMAIL,
      subject: `New Retreat Booking — ${label}`,
      html: `<p style="font-family:sans-serif;line-height:1.7">
        <b>New confirmed retreat booking</b><br><br>
        Guest: ${name}<br>
        Email: ${email}<br>
        Phone: ${phone}<br><br>
        Package: ${label}<br>
        Check-in: ${checkInDisplay}<br>
        Check-out: ${checkOutDisplay}<br>
        Amount: ₹${(price || 0).toLocaleString('en-IN')}<br><br>
        Razorpay Payment ID: ${razorpay_payment_id}<br>
        Razorpay Order ID: ${razorpay_order_id}
      </p>`,
    })
  } catch (emailErr) {
    console.error('Email send failed:', emailErr)
  }

  res.json({ success: true })
}
