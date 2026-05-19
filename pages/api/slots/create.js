import { supabaseAdmin } from '../../../lib/supabaseAdmin'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { serviceSlug, date, startTime, endTime, type, maxCapacity } = req.body
  if (!serviceSlug || !date || !startTime || !endTime) {
    return res.status(400).json({ error: 'serviceSlug, date, startTime, endTime required' })
  }

  const { data: service } = await supabaseAdmin
    .from('services')
    .select('id, type')
    .eq('slug', serviceSlug)
    .single()

  if (!service) return res.status(400).json({ error: 'Service not found' })

  const isGroup = (type || service.type) === 'group'

  const { data, error } = await supabaseAdmin
    .from('slots')
    .insert({
      service_id:    service.id,
      slot_date:     date,
      start_time:    startTime,
      end_time:      endTime,
      type:          isGroup ? 'group' : 'individual',
      max_capacity:  isGroup ? (parseInt(maxCapacity) || 50) : 1,
      current_count: 0,
      is_available:  true,
    })
    .select()
    .single()

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
}
