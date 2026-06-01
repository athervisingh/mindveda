import { supabaseAdmin } from '../../../lib/supabaseAdmin'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { couponCode, userId } = req.body
  if (!couponCode || !userId) {
    return res.status(400).json({ error: 'couponCode and userId required' })
  }

  const code = couponCode.trim().toUpperCase()

  const { data: coupon } = await supabaseAdmin
    .from('coupons')
    .select('*')
    .eq('code', code)
    .eq('is_active', true)
    .single()

  if (!coupon) {
    return res.status(400).json({ valid: false, error: 'Invalid coupon code' })
  }

  if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
    return res.status(400).json({ valid: false, error: 'Coupon expired' })
  }

  if (coupon.max_uses !== null && coupon.used_count >= coupon.max_uses) {
    return res.status(400).json({ valid: false, error: 'Coupon limit reached' })
  }

  if (coupon.first_time_only) {
    const { count: paidCount } = await supabaseAdmin
      .from('payments')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('status', 'paid')

    if (paidCount > 0) {
      return res.status(400).json({ valid: false, error: 'This coupon is for first-time customers only' })
    }
  }

  res.json({
    valid:      true,
    flat_price: coupon.flat_price,
    message:    `Coupon applied! You pay only ₹${coupon.flat_price / 100}`,
  })
}
