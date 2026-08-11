import { supabaseAdmin } from '../../../lib/supabaseAdmin'

// Courier partner calls this with shipment status updates. Configure the webhook URL + this token
// in the courier dashboard — exact header name may need adjusting against their current docs
// (SHIPROCKET_WEBHOOK_TOKEN is a secret we define ourselves).
// Path deliberately avoids the courier's name in the URL — their own webhook setup form
// rejects URLs containing "shiprocket"/"kartrocket"/"sr"/"kr".
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const expectedToken = process.env.SHIPROCKET_WEBHOOK_TOKEN
  const givenToken = req.headers['x-api-key'] || req.query.token
  if (expectedToken && givenToken !== expectedToken) {
    return res.status(401).json({ error: 'Invalid webhook token' })
  }

  const { order_id, awb, courier_name, current_status, current_status_id } = req.body || {}
  if (!order_id) return res.status(400).json({ error: 'order_id required' })

  const update = { shipment_status: current_status || null }
  if (awb) update.awb_code = awb
  if (courier_name) update.courier_name = courier_name
  if (awb) update.tracking_url = `https://shiprocket.co/tracking/${awb}`

  const statusMap = { 6: 'shipped', 7: 'delivered', 18: 'cancelled' }
  if (statusMap[current_status_id]) update.status = statusMap[current_status_id]

  await supabaseAdmin.from('orders').update(update).eq('shiprocket_order_id', String(order_id))

  res.json({ success: true })
}
