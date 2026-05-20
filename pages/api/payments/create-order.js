import { getRazorpay } from '../../../lib/razorpay'
import { supabaseAdmin } from '../../../lib/supabaseAdmin'

const GROUP_CAPACITY = 50

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { serviceSlug, bookingDate, bookingTime, userId } = req.body
  if (!serviceSlug || !bookingDate || !bookingTime || !userId) {
    return res.status(400).json({ error: 'serviceSlug, bookingDate, bookingTime, userId required' })
  }

  const { data: service } = await supabaseAdmin
    .from('services')
    .select('id, name, type, price, duration_minutes')
    .eq('slug', serviceSlug)
    .single()

  if (!service) return res.status(400).json({ error: 'Service not found' })

  // Race condition guard — check all confirmed bookings for this date at this time
  const { data: allBookings } = await supabaseAdmin
    .from('bookings')
    .select('service_id, services(type)')
    .eq('booking_date', bookingDate)
    .in('status', ['confirmed', 'rescheduled'])

  const atTime = (allBookings || []).filter(b =>
    b.booking_time && b.booking_time.startsWith(bookingTime)
  )

  const individualCount = atTime.filter(b => b.services?.type === 'individual').length
  const groupCount      = atTime.filter(b => b.services?.type === 'group').length
  const thisGroupCount  = atTime.filter(b => b.service_id === service.id).length

  if (individualCount > 0) {
    return res.status(409).json({ error: 'This slot was just booked. Please pick another time.' })
  }
  if (service.type === 'individual' && groupCount > 0) {
    return res.status(409).json({ error: 'A group session is running at this time. Please pick another.' })
  }
  if (service.type === 'group' && thisGroupCount >= GROUP_CAPACITY) {
    return res.status(409).json({ error: 'This group session is full.' })
  }

  // Create Razorpay order (price in DB is in paise)
  const order = await getRazorpay().orders.create({
    amount:   service.price,
    currency: 'INR',
    receipt:  `mv_${Date.now()}`,
    notes:    { serviceSlug, bookingDate, bookingTime, userId },
  })

  // Create pending booking
  const { data: booking, error } = await supabaseAdmin
    .from('bookings')
    .insert({
      user_id:      userId,
      service_id:   service.id,
      status:       'pending',
      booking_date: bookingDate,
      booking_time: bookingTime,
      user_note:    `rzp_order:${order.id}`,
    })
    .select()
    .single()

  if (error) return res.status(500).json({ error: error.message })

  await supabaseAdmin.from('payments').insert({
    booking_id:        booking.id,
    user_id:           userId,
    razorpay_order_id: order.id,
    amount:            service.price,
    status:            'created',
  })

  res.json({
    orderId:     order.id,
    bookingId:   booking.id,
    amount:      service.price,
    serviceName: service.name,
  })
}
