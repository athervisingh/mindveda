import { supabaseAdmin } from '../../../lib/supabaseAdmin'
import { resend } from '../../../lib/resend'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { sessionId, userId } = req.body
  if (!sessionId || !userId) return res.status(400).json({ error: 'Missing fields' })

  const { data: session } = await supabaseAdmin
    .from('chat_sessions')
    .select('id, user_id, audio_room_url, status')
    .eq('id', sessionId)
    .single()

  if (!session || session.user_id !== userId) {
    return res.status(403).json({ error: 'Invalid session' })
  }

  if (!session.audio_room_url) {
    return res.status(400).json({ error: 'No voice call room found for this session' })
  }

  // Mark session as audio (voice call active)
  await supabaseAdmin
    .from('chat_sessions')
    .update({ status: 'audio' })
    .eq('id', sessionId)

  const { data: userRow } = await supabaseAdmin
    .from('users')
    .select('full_name, email, phone')
    .eq('id', userId)
    .single()

  // Telegram instant notification to Babita
  try {
    const tgMsg = `🔔 *Voice Call — Client Joining Now!*\n\nClient: ${userRow?.full_name || 'User'}\nPhone: ${userRow?.phone || 'Not provided'}\n\n👆 Join immediately:\n${session.audio_room_url}`
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

  // Email to Babita
  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL,
    to: process.env.ADMIN_EMAIL,
    subject: `URGENT: Voice Call — ${userRow?.full_name || 'Client'} is joining now`,
    html: `<div style="font-family:sans-serif;line-height:1.8;max-width:500px">
      <div style="background:#1a3520;color:white;padding:20px;border-radius:8px 8px 0 0">
        <h2 style="margin:0">Voice Call — Join Now</h2>
        <p style="margin:4px 0 0;color:#f5a623">Client has clicked "Join Voice Call" — join immediately</p>
      </div>
      <div style="background:#fff;border:1px solid #eee;padding:20px;border-radius:0 0 8px 8px">
        <p><b>Client:</b> ${userRow?.full_name || '—'}</p>
        <p><b>Email:</b> ${userRow?.email || '—'}</p>
        <p><b>Phone:</b> ${userRow?.phone || 'Not provided'}</p>
        <p style="margin-top:24px">
          <a href="${session.audio_room_url}" style="background:#1a3520;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:600">
            Join Voice Call Now →
          </a>
        </p>
        <p style="color:#888;font-size:12px;margin-top:16px">Room: ${session.audio_room_url}</p>
      </div>
    </div>`,
  })

  res.json({ success: true })
}
