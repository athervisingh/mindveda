import { getRazorpay } from '../../../lib/razorpay'
import { supabaseAdmin } from '../../../lib/supabaseAdmin'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { items, userId, shipping } = req.body
  if (!items?.length || !userId) {
    return res.status(400).json({ error: 'items and userId required' })
  }
  const required = ['name', 'phone', 'email', 'line1', 'city', 'state', 'pincode']
  if (!shipping || required.some(k => !shipping[k]?.trim())) {
    return res.status(400).json({ error: 'Complete shipping address required' })
  }

  const orderItems = []
  let subtotal = 0

  for (const { productId, quantity } of items) {
    if (!productId || !quantity || quantity < 1) {
      return res.status(400).json({ error: 'Each item needs productId and quantity' })
    }

    const { data: product } = await supabaseAdmin
      .from('products')
      .select('id, name, price, stock, is_active, images')
      .eq('id', productId)
      .single()

    if (!product || !product.is_active) {
      return res.status(400).json({ error: `Product not available: ${productId}` })
    }
    if (product.stock < quantity) {
      return res.status(409).json({ error: `Not enough stock for "${product.name}" (only ${product.stock} left).` })
    }

    const lineTotal = product.price * quantity
    subtotal += lineTotal
    orderItems.push({
      product_id: product.id,
      product_name: product.name,
      product_image: product.images?.[0] || null,
      unit_price: product.price,
      quantity,
      line_total: lineTotal,
    })
  }

  const shippingFee = parseInt(process.env.SHOP_FLAT_SHIPPING_FEE_PAISE || '0', 10) || 0
  const totalAmount = subtotal + shippingFee

  const razorpayOrder = await getRazorpay().orders.create({
    amount: totalAmount,
    currency: 'INR',
    receipt: `mvshop_${Date.now()}`,
    notes: { userId, itemCount: String(items.length) },
  })

  const { data: order, error } = await supabaseAdmin
    .from('orders')
    .insert({
      user_id: userId,
      status: 'pending',
      subtotal,
      shipping_fee: shippingFee,
      total_amount: totalAmount,
      razorpay_order_id: razorpayOrder.id,
      payment_status: 'created',
      shipping_name: shipping.name.trim(),
      shipping_phone: shipping.phone.trim(),
      shipping_email: shipping.email.trim(),
      shipping_line1: shipping.line1.trim(),
      shipping_line2: shipping.line2?.trim() || null,
      shipping_city: shipping.city.trim(),
      shipping_state: shipping.state.trim(),
      shipping_pincode: shipping.pincode.trim(),
    })
    .select()
    .single()

  if (error) return res.status(500).json({ error: error.message })

  await supabaseAdmin.from('order_items').insert(
    orderItems.map(item => ({ ...item, order_id: order.id }))
  )

  res.json({
    orderId: razorpayOrder.id,
    shopOrderId: order.id,
    amount: totalAmount,
  })
}
