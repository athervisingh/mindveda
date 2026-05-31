import { getRazorpay } from '../../../lib/razorpay'
import { supabaseAdmin } from '../../../lib/supabaseAdmin'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { userId } = req.body
  if (!userId) return res.status(400).json({ error: 'userId required' })

  // Only first-time users can book Quick Chat
  const { count } = await supabaseAdmin
    .from('bookings')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('status', 'confirmed')

  if (count > 0) {
    return res.status(400).json({ error: 'Quick Chat is only for first-time clients. Please book a regular session.' })
  }

  const { data: service } = await supabaseAdmin
    .from('services')
    .select('id, name, price, duration_minutes')
    .eq('slug', 'quick-chat')
    .single()

  if (!service) return res.status(400).json({ error: 'Quick Chat service not found. Please add it in Supabase.' })

  const now = new Date()
  const bookingDate = now.toISOString().split('T')[0]
  const bookingTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`

  const order = await getRazorpay().orders.create({
    amount: 9900, // ₹99 — chat (5 min) + voice call (10 min) bundled
    currency: 'INR',
    receipt: `chat_${Date.now()}`,
    notes: { userId, type: 'quick-chat' },
  })

  const { data: booking, error } = await supabaseAdmin
    .from('bookings')
    .insert({
      user_id: userId,
      service_id: service.id,
      status: 'pending',
      booking_date: bookingDate,
      booking_time: bookingTime,
      user_note: `rzp_order:${order.id}`,
    })
    .select()
    .single()

  if (error) return res.status(500).json({ error: error.message })

  await supabaseAdmin.from('payments').insert({
    booking_id: booking.id,
    user_id: userId,
    razorpay_order_id: order.id,
    amount: 9900,
    status: 'created',
  })

  res.json({ orderId: order.id, bookingId: booking.id, amount: 9900 })
}
