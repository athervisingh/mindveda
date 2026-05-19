import { resend } from '../../../lib/resend'

const PACKAGE_LABELS = {
  'group-stay':    'Group Stay (Shared Accommodation)',
  'twin-sharing':  'Twin Sharing Room (1 Room, 2 Beds)',
  'single-stay':   'Single Stay (Private Room)',
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { packageId, packageLabel, price, checkInDate, checkOutDate, name, email, phone } = req.body

  if (!packageId || !checkInDate || !name || !email || !phone) {
    return res.status(400).json({ error: 'All fields are required' })
  }

  const label = PACKAGE_LABELS[packageId] || packageLabel || packageId

  const checkInDisplay = new Date(checkInDate).toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
  const checkOutDisplay = new Date(checkOutDate).toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })

  // Email to admin
  await resend.emails.send({
    from:    process.env.RESEND_FROM_EMAIL,
    to:      process.env.ADMIN_EMAIL,
    subject: `New Retreat Enquiry — ${label}`,
    html: `
<!DOCTYPE html>
<html>
<body style="font-family:sans-serif;background:#f7f7f5;padding:32px;margin:0">
  <div style="max-width:520px;margin:0 auto;background:white;border-radius:16px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08)">
    <div style="background:#1a3520;padding:24px 32px">
      <h1 style="color:white;margin:0;font-size:20px">Mind Veda</h1>
      <p style="color:#f5a623;margin:6px 0 0;font-size:13px">New Retreat Enquiry</p>
    </div>
    <div style="padding:28px 32px">
      <table style="width:100%;border-collapse:collapse;font-size:14px">
        <tr><td style="color:#888;padding:6px 0">Name</td><td style="color:#1a3520;font-weight:600;text-align:right">${name}</td></tr>
        <tr><td style="color:#888;padding:6px 0">Email</td><td style="color:#1a3520;font-weight:600;text-align:right">${email}</td></tr>
        <tr><td style="color:#888;padding:6px 0">Phone</td><td style="color:#1a3520;font-weight:600;text-align:right">${phone}</td></tr>
        <tr><td style="color:#888;padding:6px 0">Package</td><td style="color:#1a3520;font-weight:600;text-align:right">${label}</td></tr>
        <tr><td style="color:#888;padding:6px 0">Price</td><td style="color:#1a3520;font-weight:700;text-align:right">₹${(price || 0).toLocaleString('en-IN')} / person</td></tr>
        <tr><td style="color:#888;padding:6px 0">Check-in</td><td style="color:#1a3520;font-weight:600;text-align:right">${checkInDisplay}</td></tr>
        <tr><td style="color:#888;padding:6px 0">Check-out</td><td style="color:#1a3520;font-weight:600;text-align:right">${checkOutDisplay}</td></tr>
      </table>
    </div>
  </div>
</body>
</html>`,
  })

  // Confirmation email to user
  await resend.emails.send({
    from:    process.env.RESEND_FROM_EMAIL,
    to:      email,
    subject: `Retreat Enquiry Received — Mind Veda`,
    html: `
<!DOCTYPE html>
<html>
<body style="font-family:sans-serif;background:#f7f7f5;padding:32px;margin:0">
  <div style="max-width:520px;margin:0 auto;background:white;border-radius:16px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08)">
    <div style="background:#1a3520;padding:28px 32px;text-align:center">
      <h1 style="color:white;margin:0;font-size:22px">Mind Veda</h1>
      <p style="color:#f5a623;margin:6px 0 0;font-size:13px">Retreat Enquiry Received ✓</p>
    </div>
    <div style="padding:32px">
      <p style="color:#333;font-size:15px">Dear ${name},</p>
      <p style="color:#555;font-size:14px">Thank you for your interest in our Spiritual Wellness Retreat at Rishikesh. We have received your enquiry and will contact you within 24 hours to confirm your spot and share payment details.</p>
      <div style="background:#f7f7f5;border-radius:12px;padding:20px;margin:20px 0">
        <p style="margin:0 0 4px;color:#888;font-size:12px;text-transform:uppercase">Package</p>
        <p style="margin:0 0 16px;color:#1a3520;font-weight:700;font-size:15px">${label}</p>
        <div style="display:flex;gap:16px">
          <div>
            <p style="margin:0 0 4px;color:#888;font-size:12px;text-transform:uppercase">Check-in</p>
            <p style="margin:0;color:#1a3520;font-weight:600">${checkInDisplay}</p>
          </div>
          <div>
            <p style="margin:0 0 4px;color:#888;font-size:12px;text-transform:uppercase">Check-out</p>
            <p style="margin:0;color:#1a3520;font-weight:600">${checkOutDisplay}</p>
          </div>
        </div>
        <p style="margin:16px 0 4px;color:#888;font-size:12px;text-transform:uppercase">Price</p>
        <p style="margin:0;color:#1a3520;font-weight:700;font-size:18px">₹${(price || 0).toLocaleString('en-IN')} <span style="font-size:13px;font-weight:400;color:#888">per person</span></p>
      </div>
      <p style="color:#1a3520;font-size:13px;font-weight:600">Have questions? WhatsApp: +91 79809 25582</p>
    </div>
    <div style="background:#f7f7f5;padding:16px 32px;text-align:center">
      <p style="color:#aaa;font-size:11px;margin:0">© 2025 Mind Veda by Babita Kumari · Rishikesh, Uttarakhand</p>
    </div>
  </div>
</body>
</html>`,
  })

  res.json({ success: true })
}
