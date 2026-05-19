import { supabaseAdmin } from '../../../lib/supabaseAdmin'

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end()

  const { slug, date } = req.query
  if (!slug) return res.status(400).json({ error: 'slug required' })

  const today = new Date().toISOString().split('T')[0]
  const future = new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]

  let query = supabaseAdmin
    .from('slots')
    .select('*, services!inner(id, name, slug, type, duration_minutes, price)')
    .eq('services.slug', slug)
    .eq('is_available', true)
    .gte('slot_date', today)
    .lte('slot_date', future)
    .order('slot_date')
    .order('start_time')

  if (date) query = query.eq('slot_date', date)

  const { data, error } = await query
  if (error) return res.status(500).json({ error: error.message })
  res.json(data || [])
}
