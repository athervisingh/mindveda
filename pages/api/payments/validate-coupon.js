import { supabaseAdmin } from '../../../lib/supabaseAdmin'

const FIRST_TIME_COUPON = process.env.FIRST_TIME_COUPON_CODE || 'FIRST10'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { couponCode, userId } = req.body
  if (!couponCode || !userId) {
    return res.status(400).json({ error: 'couponCode and userId required' })
  }

  const code = couponCode.trim().toUpperCase()

  if (code !== FIRST_TIME_COUPON) {
    return res.status(400).json({ valid: false, error: 'Invalid coupon code' })
  }

  // Check if user has ever completed a paid booking
  const { count: paidCount } = await supabaseAdmin
    .from('payments')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('status', 'paid')

  if (paidCount > 0) {
    return res.status(400).json({ valid: false, error: 'This coupon is for first-time customers only' })
  }

  res.json({
    valid:   true,
    message: 'First-time discount applied! You pay only ₹10',
  })
}
