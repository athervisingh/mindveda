import crypto from 'crypto'
import { getRazorpay } from '../../../lib/razorpay'
import { supabaseAdmin } from '../../../lib/supabaseAdmin'
import { CHALLENGE_PRICE_PAISE } from '../../../lib/pf16'

function clean(v, max) {
  if (typeof v !== 'string') return null
  const t = v.trim()
  return t ? t.slice(0, max) : null
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const full_name = clean(req.body?.full_name, 120)
  const email     = clean(req.body?.email, 160)
  const mobile    = clean(req.body?.mobile, 20)

  if (!full_name || !email) {
    return res.status(400).json({ error: 'Name and email are required' })
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ error: 'Please enter a valid email ID' })
  }

  // Amount hamesha server par tay hota hai — client bhej hi nahi sakta.
  const amount = CHALLENGE_PRICE_PAISE

  let order
  try {
    order = await getRazorpay().orders.create({
      amount,
      currency: 'INR',
      receipt:  `mv16pf_${Date.now()}`,
      notes:    { product: '16pf-mind-challenge', email },
    })
  } catch (err) {
    console.error('16pf order create failed:', err)
    return res.status(500).json({ error: 'Could not start the payment. Please try again.' })
  }

  const { data, error } = await supabaseAdmin
    .from('pf16_attempts')
    .insert({
      full_name, email, mobile,
      amount,
      status: 'created',
      razorpay_order_id: order.id,
      access_token: crypto.randomBytes(24).toString('hex'),
    })
    .select('id')
    .single()

  if (error) {
    console.error('16pf attempt insert failed:', error)
    return res.status(500).json({ error: 'Could not start the test. Please try again.' })
  }

  res.json({
    attemptId: data.id,
    orderId:   order.id,
    amount,
    keyId:     process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  })
}
