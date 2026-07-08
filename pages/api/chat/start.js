import { supabaseAdmin } from '../../../lib/supabaseAdmin'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { userId } = req.body
  if (!userId) return res.status(400).json({ error: 'userId required' })

  const now = new Date()
  const endsAt = new Date(now.getTime() + 24 * 60 * 60 * 1000) // effectively unlimited — free chat, no timer shown

  const { data: session, error } = await supabaseAdmin
    .from('chat_sessions')
    .insert({
      user_id: userId,
      type: 'bot',
      status: 'active',
      started_at: now.toISOString(),
      ends_at: endsAt.toISOString(),
    })
    .select()
    .single()

  if (error) return res.status(500).json({ error: error.message })

  await supabaseAdmin.from('chat_messages').insert({
    session_id: session.id,
    sender_type: 'bot',
    content: "Namaste! I'm Veda, your Mind Veda wellness guide. Share what's on your mind — I'm here to listen. How are you feeling today?",
  })

  res.json({ sessionId: session.id })
}
