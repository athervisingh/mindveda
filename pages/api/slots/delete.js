import { supabaseAdmin } from '../../../lib/supabaseAdmin'

export default async function handler(req, res) {
  if (req.method !== 'DELETE') return res.status(405).end()

  const { slotId } = req.body
  if (!slotId) return res.status(400).json({ error: 'slotId required' })

  // Check if any confirmed bookings exist
  const { data: active } = await supabaseAdmin
    .from('bookings')
    .select('id')
    .eq('slot_id', slotId)
    .eq('status', 'confirmed')
    .limit(1)

  if (active?.length) {
    return res.status(400).json({ error: 'Cannot delete slot with confirmed bookings. Cancel them first.' })
  }

  const { error } = await supabaseAdmin.from('slots').delete().eq('id', slotId)
  if (error) return res.status(500).json({ error: error.message })
  res.json({ success: true })
}
