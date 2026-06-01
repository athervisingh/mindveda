import { getRazorpay } from '../../../lib/razorpay'
import { supabaseAdmin } from '../../../lib/supabaseAdmin'

const PACKAGE_PRICES = {
  'twin-sharing': 15000,
  'single-stay':  18000,
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { packageId, checkInDate, name, email, phone, couponCode, userId } = req.body
  if (!packageId || !checkInDate || !name || !email || !phone) {
    return res.status(400).json({ error: 'All fields are required' })
  }

  const priceRupees = PACKAGE_PRICES[packageId]
  if (!priceRupees) return res.status(400).json({ error: 'Invalid package' })

  let finalAmountPaise = priceRupees * 100

  if (couponCode) {
    const { data: coupon } = await supabaseAdmin
      .from('coupons')
      .select('*')
      .eq('code', couponCode.trim().toUpperCase())
      .eq('is_active', true)
      .single()

    if (!coupon) return res.status(400).json({ error: 'Invalid coupon code' })

    if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
      return res.status(400).json({ error: 'Coupon expired' })
    }

    if (coupon.max_uses !== null && coupon.used_count >= coupon.max_uses) {
      return res.status(400).json({ error: 'Coupon limit reached' })
    }

    if (coupon.first_time_only && userId) {
      const { count: paidCount } = await supabaseAdmin
        .from('payments')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('status', 'paid')

      if (paidCount > 0) {
        return res.status(400).json({ error: 'This coupon is for first-time customers only' })
      }
    }

    finalAmountPaise = coupon.flat_price

    await supabaseAdmin
      .from('coupons')
      .update({ used_count: coupon.used_count + 1 })
      .eq('id', coupon.id)
  }

  try {
    const order = await getRazorpay().orders.create({
      amount:   finalAmountPaise,
      currency: 'INR',
      receipt:  `retreat_${packageId}_${Date.now()}`,
      notes:    { packageId, checkInDate, name, email, phone },
    })
    res.json({ orderId: order.id, amount: order.amount })
  } catch (err) {
    res.status(500).json({ error: err.message || 'Order creation failed' })
  }
}
