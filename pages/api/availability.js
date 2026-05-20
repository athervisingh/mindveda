import { supabaseAdmin } from '../../lib/supabaseAdmin'

const TIME_SLOTS = ['11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00']
const GROUP_CAPACITY = 50

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end()

  const { date, serviceSlug } = req.query
  if (!date || !serviceSlug) return res.status(400).json({ error: 'date and serviceSlug required' })

  const { data: service } = await supabaseAdmin
    .from('services')
    .select('id, type')
    .eq('slug', serviceSlug)
    .single()

  if (!service) return res.status(400).json({ error: 'Service not found' })

  // Get all confirmed/rescheduled bookings for this date across ALL services
  // This is how we know Babita's full schedule for the day
  const { data: bookings } = await supabaseAdmin
    .from('bookings')
    .select('booking_time, service_id, services(type)')
    .eq('booking_date', date)
    .in('status', ['confirmed', 'rescheduled'])

  const isGroup = service.type === 'group'

  const slots = TIME_SLOTS.map(time => {
    const atTime = (bookings || []).filter(b =>
      b.booking_time && b.booking_time.startsWith(time)
    )

    const individualCount = atTime.filter(b => b.services?.type === 'individual').length
    const groupCount      = atTime.filter(b => b.services?.type === 'group').length
    const thisGroupCount  = atTime.filter(b => b.service_id === service.id).length

    // Rule 1: Any individual booking → Babita is in a 1-on-1 → everyone blocked
    if (individualCount > 0) {
      return { time, available: false }
    }

    if (isGroup) {
      // Rule 2: Group — check capacity for this specific group service
      if (thisGroupCount >= GROUP_CAPACITY) {
        return { time, available: false, spotsLeft: 0 }
      }
      return { time, available: true, spotsLeft: GROUP_CAPACITY - thisGroupCount }
    } else {
      // Rule 3: Individual — blocked if Babita is running a group session
      if (groupCount > 0) {
        return { time, available: false }
      }
      return { time, available: true }
    }
  })

  res.json({ slots, serviceType: service.type, serviceId: service.id })
}
