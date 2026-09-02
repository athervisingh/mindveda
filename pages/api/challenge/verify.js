import crypto from 'crypto'
import { supabaseAdmin } from '../../../lib/supabaseAdmin'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, attemptId } = req.body || {}
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !attemptId) {
    return res.status(400).json({ error: 'Missing payment details' })
  }

  const expected = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex')

  if (expected !== razorpay_signature) {
    return res.status(400).json({ error: 'Invalid payment signature' })
  }

  // Order id attempt se match hona chahiye — koi dusre order ka signature
  // laakar test nahi khol sakta.
  const { data: attempt } = await supabaseAdmin
    .from('pf16_attempts')
    .select('id, status, access_token, razorpay_order_id')
    .eq('id', attemptId)
    .single()

  if (!attempt || attempt.razorpay_order_id !== razorpay_order_id) {
    return res.status(400).json({ error: 'Payment does not match this test' })
  }

  if (attempt.status === 'created') {
    await supabaseAdmin
      .from('pf16_attempts')
      .update({ status: 'paid', razorpay_payment_id, paid_at: new Date().toISOString() })
      .eq('id', attempt.id)
  }

  res.json({ success: true, attemptId: attempt.id, accessToken: attempt.access_token })
}
