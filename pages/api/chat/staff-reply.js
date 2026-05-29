import { supabaseAdmin } from '../../../lib/supabaseAdmin'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { sessionId, message, adminId } = req.body
  if (!sessionId || !message?.trim() || !adminId) {
    return res.status(400).json({ error: 'Missing fields' })
  }

  // Verify admin role
  const { data: adminUser } = await supabaseAdmin
    .from('users')
    .select('role')
    .eq('id', adminId)
    .single()

  if (adminUser?.role !== 'admin') {
    return res.status(403).json({ error: 'Not authorized' })
  }

  // Switch session to staff mode so bot stops responding
  await supabaseAdmin
    .from('chat_sessions')
    .update({ type: 'staff' })
    .eq('id', sessionId)

  await supabaseAdmin.from('chat_messages').insert({
    session_id: sessionId,
    sender_type: 'staff',
    content: message.trim(),
  })

  res.json({ success: true })
}
