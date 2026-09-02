import { supabaseAdmin } from '../../../lib/supabaseAdmin'
import { CHALLENGE_PRICE_PAISE } from '../../../lib/pf16'

// Wahi coupons table jo counseling/shop checkout par use hoti hai.
// Yahan koi logged-in user nahi hota, isliye first_time_only ko email se
// check kiya jaata hai — pehle se koi paid attempt ho to coupon nahi chalega.
export async function lookupCoupon(rawCode, email) {
  const code = String(rawCode || '').trim().toUpperCase()
  if (!code) return { error: 'Please enter a code' }

  const { data: coupon } = await supabaseAdmin
    .from('coupons')
    .select('*')
    .eq('code', code)
    .eq('is_active', true)
    .single()

  if (!coupon) return { error: 'Invalid code' }
  if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) return { error: 'This code has expired' }
  if (coupon.max_uses !== null && coupon.used_count >= coupon.max_uses) return { error: 'This code has reached its limit' }
  if (!Number.isFinite(coupon.flat_price) || coupon.flat_price < 100) {
    return { error: 'This code cannot be used here' }   // Razorpay ka minimum ₹1
  }
  if (coupon.flat_price >= CHALLENGE_PRICE_PAISE) return { error: 'This code gives no discount here' }

  if (coupon.first_time_only && email) {
    const { count } = await supabaseAdmin
      .from('pf16_attempts')
      .select('id', { count: 'exact', head: true })
      .eq('email', email.trim().toLowerCase())
      .neq('status', 'created')
    if (count > 0) return { error: 'This code is for first-time users only' }
  }

  return { coupon }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { couponCode, email } = req.body || {}
  const { coupon, error } = await lookupCoupon(couponCode, email)

  if (error) return res.status(400).json({ valid: false, error })

  res.json({
    valid:      true,
    code:       coupon.code,
    flat_price: coupon.flat_price,
    message:    `Code applied! You pay only ₹${Math.round(coupon.flat_price / 100)}`,
  })
}
