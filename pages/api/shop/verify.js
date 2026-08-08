import crypto from 'crypto'
import { supabaseAdmin } from '../../../lib/supabaseAdmin'
import { resend } from '../../../lib/resend'
import { createShiprocketOrder } from '../../../lib/shiprocket'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, shopOrderId } = req.body

  const expected = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex')

  if (expected !== razorpay_signature) {
    return res.status(400).json({ error: 'Invalid payment signature' })
  }

  const { data: order, error } = await supabaseAdmin
    .from('orders')
    .update({
      razorpay_payment_id,
      payment_status: 'paid',
      status: 'processing',
      paid_at: new Date().toISOString(),
    })
    .eq('id', shopOrderId)
    .eq('razorpay_order_id', razorpay_order_id)
    .select('*, order_items(*)')
    .single()

  if (error || !order) return res.status(500).json({ error: 'Order update failed' })

  // Decrement stock per line item (best-effort — not a hard lock, consistent with the app's
  // existing slot-booking risk tolerance).
  for (const item of order.order_items) {
    const { data: product } = await supabaseAdmin.from('products').select('stock').eq('id', item.product_id).single()
    if (product) {
      await supabaseAdmin.from('products').update({ stock: Math.max(0, product.stock - item.quantity) }).eq('id', item.product_id)
    }
  }

  // Confirmation + admin emails (non-blocking on failure)
  try {
    const itemRows = order.order_items.map(i => `
      <tr><td style="padding:6px 0;color:#333">${i.product_name} × ${i.quantity}</td>
      <td style="padding:6px 0;text-align:right;color:#1a3520;font-weight:600">₹${Math.round(i.line_total / 100)}</td></tr>
    `).join('')

    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to: order.shipping_email,
      subject: `Order Confirmed — Mind Veda Shop`,
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
          <div style="background:#1a3520;padding:24px;text-align:center;border-radius:12px 12px 0 0">
            <h1 style="color:white;margin:0;font-size:20px">Mind Veda Shop</h1>
            <p style="color:#f5a623;margin:4px 0 0;font-size:13px">Order Confirmed ✓</p>
          </div>
          <div style="padding:24px;background:#f7f7f5;border-radius:0 0 12px 12px">
            <p style="color:#333">Dear ${order.shipping_name},</p>
            <p style="color:#555;font-size:14px">Your order has been placed and will be shipped to:</p>
            <p style="color:#555;font-size:13px">${order.shipping_line1}${order.shipping_line2 ? ', ' + order.shipping_line2 : ''}, ${order.shipping_city}, ${order.shipping_state} — ${order.shipping_pincode}</p>
            <table style="width:100%;border-collapse:collapse;margin-top:12px">${itemRows}</table>
            <p style="text-align:right;font-weight:700;color:#1a3520;margin-top:8px">Total: ₹${Math.round(order.total_amount / 100)}</p>
            <p style="color:#aaa;font-size:11px;margin-top:16px">Order Ref: ${order.id.slice(0, 8).toUpperCase()}</p>
          </div>
        </div>`,
    })

    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to: process.env.ADMIN_EMAIL,
      subject: `New Shop Order — ${order.shipping_name}`,
      html: `<p style="font-family:sans-serif;line-height:1.7">
        <b>New paid order</b><br><br>
        Customer: ${order.shipping_name}<br>
        Email: ${order.shipping_email}<br>
        Phone: ${order.shipping_phone}<br>
        Ship to: ${order.shipping_line1}, ${order.shipping_city}, ${order.shipping_state} ${order.shipping_pincode}<br><br>
        Total: ₹${Math.round(order.total_amount / 100)}<br>
        Order ID: ${order.id.slice(0, 8).toUpperCase()}
      </p>`,
    })
  } catch (err) {
    console.error('Shop order email error:', err.message)
  }

  // Best-effort Shiprocket shipment creation — failures don't block the paid response;
  // admin can retry from the Shop > Orders tab.
  try {
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
    if (!result.skipped && result.shiprocket_order_id) {
      await supabaseAdmin.from('orders').update({
        shiprocket_order_id: result.shiprocket_order_id,
        shiprocket_shipment_id: result.shiprocket_shipment_id,
      }).eq('id', order.id)
    }
  } catch (err) {
    console.error('Shiprocket order creation error:', err.message)
  }

  res.json({ success: true, orderId: order.id })
}
