import { supabaseAdmin } from '../../../lib/supabaseAdmin'
import { resend } from '../../../lib/resend'
import { ITEMS, TOTAL_ITEMS, scorePF16, FACTORS } from '../../../lib/pf16'

const LETTER = ['a', 'b', 'c']

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { attemptId, accessToken, answers, durationSeconds } = req.body || {}

  if (!attemptId || !accessToken) return res.status(400).json({ error: 'Missing access details' })
  if (!Array.isArray(answers) || answers.length !== TOTAL_ITEMS) {
    return res.status(400).json({ error: 'Answer sheet is incomplete or malformed' })
  }

  // Har answer 0/1/2 ya null hona chahiye.
  const clean = answers.map(a => (a === 0 || a === 1 || a === 2 ? a : null))

  const { data: attempt } = await supabaseAdmin
    .from('pf16_attempts')
    .select('*')
    .eq('id', attemptId)
    .single()

  if (!attempt || attempt.access_token !== accessToken) {
    return res.status(403).json({ error: 'This test link is not valid' })
  }
  if (attempt.status === 'created') {
    return res.status(402).json({ error: 'Payment for this test is not complete' })
  }
  if (attempt.status === 'submitted') {
    return res.status(409).json({ error: 'This answer sheet has already been submitted' })
  }

  const answered = clean.filter(a => a !== null).length

  const { error } = await supabaseAdmin
    .from('pf16_attempts')
    .update({
      answers: clean,
      answered_count: answered,
      duration_seconds: Number.isFinite(durationSeconds) ? Math.round(durationSeconds) : null,
      status: 'submitted',
      submitted_at: new Date().toISOString(),
    })
    .eq('id', attempt.id)

  if (error) {
    console.error('16pf submit failed:', error)
    return res.status(500).json({ error: 'Could not save your answers. Please try again.' })
  }

  // Scoring key mile to score bhi bhej do, warna sirf answer sheet.
  const scores = scorePF16(clean)

  try {
    const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')

    const sheet = ITEMS.map((item, i) => {
      const a = clean[i]
      return `<tr>
        <td style="color:#aaa;padding:3px 8px 3px 0;width:34px;text-align:right;font-size:12px">${i + 1}</td>
        <td style="color:#444;padding:3px 8px 3px 0;font-size:12px">${esc(item[0])}</td>
        <td style="color:#1a3520;font-weight:700;padding:3px 0;font-size:12px;white-space:nowrap">${
          a === null ? '—' : `${LETTER[a]}) ${esc(item[a + 1])}`
        }</td>
      </tr>`
    }).join('')

    const scoreBlock = scores
      ? `<h3 style="font-family:sans-serif;color:#1a3520;margin:24px 0 8px">Factor scores</h3>
         <table style="border-collapse:collapse;font-family:sans-serif">${
           FACTORS.filter(([c]) => scores[c] !== undefined)
             .map(([c, name]) => `<tr><td style="padding:2px 12px 2px 0;color:#888;font-size:13px">${c} · ${name}</td><td style="font-weight:700;color:#1a3520">${scores[c]}</td></tr>`)
             .join('')
         }</table>`
      : `<p style="font-family:sans-serif;color:#8a6914;font-size:13px;background:#fff8e8;border:1px solid #f0dfae;padding:10px 12px;border-radius:8px">
           No scoring key is configured on the site, so no factor scores were computed.
           Please score this sheet with your official 16 PF stencil key.
         </p>`

    await resend.emails.send({
      from:    process.env.RESEND_FROM_EMAIL,
      to:      process.env.ADMIN_EMAIL,
      subject: `16 PF Answer Sheet — ${attempt.full_name}`,
      html: `<div style="font-family:sans-serif;max-width:760px;margin:0 auto">
        <div style="background:#1a3520;padding:20px 24px;border-radius:12px 12px 0 0">
          <h1 style="color:#fff;margin:0;font-size:19px">Mind Veda — 16 PF Mind Challenge</h1>
          <p style="color:#f5a623;margin:5px 0 0;font-size:13px">Paid answer sheet received</p>
        </div>
        <div style="border:1px solid #eee;border-top:0;border-radius:0 0 12px 12px;padding:22px 24px">
          <table style="font-size:13px;line-height:1.9">
            <tr><td style="color:#888;padding-right:16px">Name</td><td style="font-weight:700;color:#1a3520">${esc(attempt.full_name)}</td></tr>
            <tr><td style="color:#888;padding-right:16px">Email</td><td style="font-weight:700;color:#1a3520">${esc(attempt.email)}</td></tr>
            <tr><td style="color:#888;padding-right:16px">Mobile</td><td style="font-weight:700;color:#1a3520">${esc(attempt.mobile || '—')}</td></tr>
            <tr><td style="color:#888;padding-right:16px">Answered</td><td style="font-weight:700;color:#1a3520">${answered} / ${TOTAL_ITEMS}</td></tr>
            <tr><td style="color:#888;padding-right:16px">Payment</td><td style="font-weight:700;color:#1a3520">₹${Math.round(attempt.amount / 100)} · ${esc(attempt.razorpay_payment_id || '—')}</td></tr>
            <tr><td style="color:#888;padding-right:16px">Attempt ID</td><td style="color:#666">${attempt.id}</td></tr>
          </table>
          ${scoreBlock}
          <h3 style="color:#1a3520;margin:24px 0 8px">Answer sheet</h3>
          <table style="border-collapse:collapse;width:100%">${sheet}</table>
        </div>
      </div>`,
    })

    await resend.emails.send({
      from:    process.env.RESEND_FROM_EMAIL,
      to:      attempt.email,
      subject: 'Your 16 PF Mind Challenge — answers received',
      html: `<div style="font-family:sans-serif;background:#f7f7f5;padding:32px">
        <div style="max-width:520px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.08)">
          <div style="background:#1a3520;padding:28px 32px;text-align:center">
            <h1 style="color:#fff;margin:0;font-size:22px">Mind Veda</h1>
            <p style="color:#f5a623;margin:6px 0 0;font-size:13px">Mind Challenge submitted ✓</p>
          </div>
          <div style="padding:32px">
            <p style="color:#333;font-size:15px">Dear ${esc(attempt.full_name)},</p>
            <p style="color:#555;font-size:14px;line-height:1.7">
              We have received your completed 16 PF answer sheet (${answered} of ${TOTAL_ITEMS} answered).
              Babita will score it personally and send you your detailed personality report.
              Your answers stay strictly confidential.
            </p>
            <p style="color:#555;font-size:14px;line-height:1.7">Payment of ₹${Math.round(attempt.amount / 100)} received. Reference: ${esc(attempt.razorpay_payment_id || attempt.id.slice(0, 8).toUpperCase())}</p>
            <p style="color:#1a3520;font-size:13px;font-weight:600;margin-top:24px">Questions? WhatsApp: +91 79809 25582</p>
          </div>
        </div>
      </div>`,
    })
  } catch (err) {
    console.error('16pf email failed:', err)   // answers already saved — best effort
  }

  res.json({ success: true, answered, total: TOTAL_ITEMS, scored: !!scores })
}
