import { getRazorpay } from '../../../lib/razorpay'
import { supabaseAdmin } from '../../../lib/supabaseAdmin'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { sessionId, userId } = req.body
  if (!sessionId || !userId) return res.status(400).json({ error: 'Missing fields' })

  const { data: session } = await supabaseAdmin
    .from('chat_sessions')
    .select('id, user_id, status')
    .eq('id', sessionId)
    .single()

  if (!session || session.user_id !== userId) {
    return res.status(403).json({ error: 'Invalid session' })
  }

  const order = await getRazorpay().orders.create({
    amount: 1000, // ₹10
    currency: 'INR',
    receipt: `audio_${Date.now()}`,
    notes: { sessionId, userId, type: 'voice-call' },
  })

  res.json({ orderId: order.id, amount: 1000 })
}
