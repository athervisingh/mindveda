import { supabaseAdmin } from '../../../lib/supabaseAdmin'
import { resend } from '../../../lib/resend'

const PERSONALITY = ['introvert', 'extrovert', 'ambivert']

function clean(v, max = 2000) {
  if (typeof v !== 'string') return null
  const t = v.trim()
  if (!t) return null
  return t.slice(0, max)
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const b = req.body || {}

  const full_name = clean(b.full_name, 120)
  const email     = clean(b.email, 160)
  const mobile    = clean(b.mobile, 20)

  if (!full_name || !email || !mobile) {
    return res.status(400).json({ error: 'Name, email and mobile number are required' })
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ error: 'Please enter a valid email ID' })
  }
  if (!/^[0-9+\-\s()]{7,20}$/.test(mobile)) {
    return res.status(400).json({ error: 'Please enter a valid mobile number' })
  }

  const ageRaw = parseInt(b.age)
  const personalityRaw = clean(b.personality, 20)?.toLowerCase()

  const row = {
    full_name,
    email,
    mobile,
    age:           Number.isFinite(ageRaw) && ageRaw > 0 && ageRaw < 130 ? ageRaw : null,
    address:       clean(b.address, 500),
    gender:        clean(b.gender, 40),
    health_issues: clean(b.health_issues),
    trauma:        clean(b.trauma),
    fear_1:        clean(b.fear_1, 300),
    fear_2:        clean(b.fear_2, 300),
    personality:   PERSONALITY.includes(personalityRaw) ? personalityRaw : null,
    good_thing:    clean(b.good_thing),
    bad_thing:     clean(b.bad_thing),
  }

  const { data, error } = await supabaseAdmin
    .from('registrations')
    .insert(row)
    .select('id')
    .single()

  if (error) {
    console.error('registration insert failed:', error)
    return res.status(500).json({ error: 'Could not save your registration. Please try again in a moment.' })
  }

  // Emails are best-effort — registration is already saved.
  try {
    const rows = [
      ['Name', row.full_name],
      ['Age', row.age ?? '—'],
      ['Email', row.email],
      ['Mobile', row.mobile],
      ['Gender', row.gender || '—'],
      ['Address', row.address || '—'],
      ['Health Issues', row.health_issues || '—'],
      ['Unforgettable Trauma', row.trauma || '—'],
      ['Fear 1', row.fear_1 || '—'],
      ['Fear 2', row.fear_2 || '—'],
      ['Personality', row.personality || '—'],
      ['Good thing about them', row.good_thing || '—'],
      ['Bad thing about them', row.bad_thing || '—'],
    ].map(([k, v]) => `
      <tr>
        <td style="color:#888;padding:7px 0;vertical-align:top;width:40%">${k}</td>
        <td style="color:#1a3520;font-weight:600;padding:7px 0;text-align:right">${String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\n/g, '<br>')}</td>
      </tr>`).join('')

    await resend.emails.send({
      from:    process.env.RESEND_FROM_EMAIL,
      to:      process.env.ADMIN_EMAIL,
      subject: `New Registration — ${row.full_name}`,
      html: `
<!DOCTYPE html>
<html>
<body style="font-family:sans-serif;background:#f7f7f5;padding:32px;margin:0">
  <div style="max-width:560px;margin:0 auto;background:white;border-radius:16px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08)">
    <div style="background:#1a3520;padding:24px 32px">
      <h1 style="color:white;margin:0;font-size:20px">Mind Veda</h1>
      <p style="color:#f5a623;margin:6px 0 0;font-size:13px">New Registration Form Submitted</p>
    </div>
    <div style="padding:28px 32px">
      <table style="width:100%;border-collapse:collapse;font-size:14px">${rows}</table>
    </div>
  </div>
</body>
</html>`,
    })

    await resend.emails.send({
      from:    process.env.RESEND_FROM_EMAIL,
      to:      row.email,
      subject: 'Registration Received — Mind Veda',
      html: `
<!DOCTYPE html>
<html>
<body style="font-family:sans-serif;background:#f7f7f5;padding:32px;margin:0">
  <div style="max-width:520px;margin:0 auto;background:white;border-radius:16px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08)">
    <div style="background:#1a3520;padding:28px 32px;text-align:center">
      <h1 style="color:white;margin:0;font-size:22px">Mind Veda</h1>
      <p style="color:#f5a623;margin:6px 0 0;font-size:13px">Registration Received ✓</p>
    </div>
    <div style="padding:32px">
      <p style="color:#333;font-size:15px">Dear ${row.full_name},</p>
      <p style="color:#555;font-size:14px;line-height:1.6">Thank you for registering with Mind Veda. Everything you shared with us stays strictly confidential. Our team will go through your responses and reach out to you shortly on ${row.mobile}.</p>
      <p style="color:#1a3520;font-size:13px;font-weight:600;margin-top:24px">Need to talk sooner? WhatsApp: +91 79809 25582</p>
    </div>
    <div style="background:#f7f7f5;padding:16px 32px;text-align:center">
      <p style="color:#aaa;font-size:11px;margin:0">© Mind Veda by Babita Kumari · Rishikesh, Uttarakhand</p>
    </div>
  </div>
</body>
</html>`,
    })
  } catch (err) {
    console.error('registration email failed:', err)
  }

  res.json({ success: true, id: data.id })
}
