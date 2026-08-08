import { supabaseAdmin } from '../../../../lib/supabaseAdmin'
import { createShiprocketOrder } from '../../../../lib/shiprocket'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { orderId } = req.body
  if (!orderId) return res.status(400).json({ error: 'orderId required' })

  const { data: order } = await supabaseAdmin.from('orders').select('*').eq('id', orderId).single()
  if (!order) return res.status(404).json({ error: 'Order not found' })
  if (order.payment_status !== 'paid') return res.status(400).json({ error: 'Order is not paid yet' })

  const { data: itemsWithDims } = await supabaseAdmin
    .from('order_items')
    .select('*, products(weight_grams, length_cm, breadth_cm, height_cm)')
    .eq('order_id', order.id)

  const shipItems = (itemsWithDims || []).map(i => ({
    ...i,
    weight_grams: i.products?.weight_grams,
    length_cm: i.products?.length_cm,
    breadth_cm: i.products?.breadth_cm,
    height_cm: i.products?.height_cm,
  }))

  const result = await createShiprocketOrder(order, shipItems)
  if (result.skipped) return res.json({ skipped: true, reason: result.error || 'not_configured' })
  if (result.error) return res.status(502).json({ error: result.error })

  await supabaseAdmin.from('orders').update({
    shiprocket_order_id: result.shiprocket_order_id,
    shiprocket_shipment_id: result.shiprocket_shipment_id,
  }).eq('id', order.id)

  res.json({ success: true, ...result })
}
