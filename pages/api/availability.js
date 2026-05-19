import { supabaseAdmin } from '../../lib/supabaseAdmin'

const TIME_SLOTS = ['11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00']

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end()

  const { date, serviceSlug } = req.query
  if (!date || !serviceSlug) return res.status(400).json({ error: 'date and serviceSlug required' })

  // Get service type
  const { data: service } = await supabaseAdmin
    .from('services')
    .select('id, type')
    .eq('slug', serviceSlug)
    .single()

  if (!service) return res.status(400).json({ error: 'Service not found' })

  // Get all confirmed bookings for this date with service type
  const { data: bookings } = await supabaseAdmin
    .from('bookings')
    .select('booking_time, services(type)')
    .eq('booking_date', date)
    .in('status', ['confirmed', 'rescheduled'])

  const isGroupService = service.type === 'group'

  const slots = TIME_SLOTS.map(time => {
    const atTime = (bookings || []).filter(b =>
      b.booking_time && b.booking_time.startsWith(time)
    )
    const individualCount = atTime.filter(b => b.services?.type === 'individual').length
    const groupCount      = atTime.filter(b => b.services?.type === 'group').length

    // Rule 1: Any individual booking → fully blocked for everyone
    if (individualCount > 0) {
      return { time, available: false, reason: 'booked' }
    }

    if (isGroupService) {
      // Rule 2: Group full (50+) → blocked
      if (groupCount >= 50) {
        return { time, available: false, reason: 'full', spotsLeft: 0 }
      }
      // Group has space
      return { time, available: true, spotsLeft: 50 - groupCount, groupCount }
    } else {
      // Rule 3: Individual service — if any group running → blocked
      if (groupCount > 0) {
        return { time, available: false, reason: 'group_running' }
      }
      return { time, available: true }
    }
  })

  res.json({ slots, serviceType: service.type, serviceId: service.id })
}
