import { getRazorpay } from '../../../lib/razorpay'
import { supabaseAdmin } from '../../../lib/supabaseAdmin'

const GROUP_CAPACITY = 50

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { items, userId, couponCode } = req.body
  if (!items?.length || !userId) {
    return res.status(400).json({ error: 'items and userId required' })
  }

  // Validate coupon from DB
  let coupon = null
  if (couponCode) {
    const code = couponCode.trim().toUpperCase()

    const { data: found } = await supabaseAdmin
      .from('coupons')
      .select('*')
      .eq('code', code)
      .eq('is_active', true)
      .single()

    if (!found) {
      return res.status(400).json({ error: 'Invalid coupon code' })
    }

    if (found.expires_at && new Date(found.expires_at) < new Date()) {
      return res.status(400).json({ error: 'Coupon expired' })
    }

    if (found.max_uses !== null && found.used_count >= found.max_uses) {
      return res.status(400).json({ error: 'Coupon limit reached' })
    }

    if (found.first_time_only) {
      const { count: paidCount } = await supabaseAdmin
        .from('payments')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('status', 'paid')

      if (paidCount > 0) {
        return res.status(400).json({ error: 'This coupon is for first-time customers only' })
      }
    }

    coupon = found
  }

  // Validate each item and calculate total
  const processedItems = []
  let totalAmount = 0

  for (let i = 0; i < items.length; i++) {
    const { serviceSlug, bookingDate, bookingTime } = items[i]
    if (!serviceSlug || !bookingDate || !bookingTime) {
      return res.status(400).json({ error: 'Each item needs serviceSlug, bookingDate, bookingTime' })
    }

    const { data: service } = await supabaseAdmin
      .from('services')
      .select('id, name, type, price, duration_minutes')
      .eq('slug', serviceSlug)
      .single()

    if (!service) return res.status(400).json({ error: `Service not found: ${serviceSlug}` })

    // Race condition guard
    const { data: allBookings } = await supabaseAdmin
      .from('bookings')
      .select('service_id, booking_time, services(type)')
      .eq('booking_date', bookingDate)
      .in('status', ['confirmed', 'rescheduled'])

    const atTime = (allBookings || []).filter(b =>
      b.booking_time && b.booking_time.startsWith(bookingTime)
    )

    const individualCount = atTime.filter(b => b.services?.type === 'individual').length
    const groupCount      = atTime.filter(b => b.services?.type === 'group').length
    const thisGroupCount  = atTime.filter(b => b.service_id === service.id).length

    if (individualCount > 0) {
      return res.status(409).json({ error: `Slot just booked for "${service.name}". Please pick another time.` })
    }
    if (service.type === 'individual' && groupCount > 0) {
      return res.status(409).json({ error: `A group session is running at this time for "${service.name}".` })
    }
    if (service.type === 'group' && thisGroupCount >= GROUP_CAPACITY) {
      return res.status(409).json({ error: `"${service.name}" group session is full.` })
    }

    // Coupon applies flat_price to first item only, rest at normal price
    const itemAmount = coupon && i === 0 ? coupon.flat_price : service.price
    totalAmount += itemAmount
    processedItems.push({ service, bookingDate, bookingTime, itemAmount })
  }

  // One Razorpay order for the full total
  const order = await getRazorpay().orders.create({
    amount:   totalAmount,
    currency: 'INR',
    receipt:  `mv_${Date.now()}`,
    notes:    { userId, itemCount: String(items.length) },
  })

  // Create all bookings as pending
  const { data: bookings, error } = await supabaseAdmin
    .from('bookings')
    .insert(
      processedItems.map(({ service, bookingDate, bookingTime, itemAmount }, idx) => ({
        user_id:         userId,
        service_id:      service.id,
        status:          'pending',
        booking_date:    bookingDate,
        booking_time:    bookingTime,
        user_note:       `rzp_order:${order.id}`,
        coupon_code:     coupon && idx === 0 ? coupon.code : null,
        original_amount: service.price,
        final_amount:    itemAmount,
      }))
    )
    .select()

  if (error) return res.status(500).json({ error: error.message })

  // One payment record per booking
  await supabaseAdmin.from('payments').insert(
    processedItems.map(({ itemAmount }, idx) => ({
      booking_id:        bookings[idx].id,
      user_id:           userId,
      razorpay_order_id: order.id,
      amount:            itemAmount,
      status:            'created',
    }))
  )

  // Increment coupon used_count
  if (coupon) {
    await supabaseAdmin
      .from('coupons')
      .update({ used_count: coupon.used_count + 1 })
      .eq('id', coupon.id)
  }

  res.json({
    orderId:       order.id,
    bookingIds:    bookings.map(b => b.id),
    amount:        totalAmount,
    couponApplied: coupon ? coupon.code : null,
  })
}
