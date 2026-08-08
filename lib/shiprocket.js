const BASE_URL = 'https://apiv2.shiprocket.in/v1/external'

let tokenCache = { token: null, expiresAt: 0 }
let warnedOnce = false

export function isShiprocketConfigured() {
  return !!(process.env.SHIPROCKET_EMAIL && process.env.SHIPROCKET_PASSWORD)
}

function warnUnconfigured() {
  if (warnedOnce) return
  warnedOnce = true
  console.warn('[shiprocket] SHIPROCKET_EMAIL/SHIPROCKET_PASSWORD not set — Shiprocket integration is disabled (no-op).')
}

export async function getShiprocketToken() {
  if (!isShiprocketConfigured()) { warnUnconfigured(); return null }
  if (tokenCache.token && tokenCache.expiresAt > Date.now()) return tokenCache.token

  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: process.env.SHIPROCKET_EMAIL,
      password: process.env.SHIPROCKET_PASSWORD,
    }),
  })
  if (!res.ok) {
    console.error('[shiprocket] auth/login failed', res.status, await res.text().catch(() => ''))
    return null
  }
  const data = await res.json()
  if (!data.token) return null

  // Shiprocket tokens are valid ~10 days — refresh a day early to be safe.
  tokenCache = { token: data.token, expiresAt: Date.now() + 9 * 24 * 60 * 60 * 1000 }
  return tokenCache.token
}

// order: a row from public.orders. orderItems: rows from public.order_items for that order.
export async function createShiprocketOrder(order, orderItems) {
  if (!isShiprocketConfigured()) { warnUnconfigured(); return { skipped: true } }

  const token = await getShiprocketToken()
  if (!token) return { skipped: true, error: 'no_token' }

  const pickupLocation = process.env.SHIPROCKET_PICKUP_LOCATION
  if (!pickupLocation) {
    console.error('[shiprocket] SHIPROCKET_PICKUP_LOCATION not set — cannot create shipment.')
    return { skipped: true, error: 'no_pickup_location' }
  }

  const payload = {
    order_id: order.id,
    order_date: new Date(order.created_at || Date.now()).toISOString().slice(0, 19).replace('T', ' '),
    pickup_location: pickupLocation,
    billing_customer_name: order.shipping_name,
    billing_last_name: '',
    billing_address: order.shipping_line1,
    billing_address_2: order.shipping_line2 || '',
    billing_city: order.shipping_city,
    billing_pincode: order.shipping_pincode,
    billing_state: order.shipping_state,
    billing_country: order.shipping_country || 'India',
    billing_email: order.shipping_email,
    billing_phone: order.shipping_phone,
    shipping_is_billing: true,
    order_items: orderItems.map(item => ({
      name: item.product_name,
      sku: item.product_id,
      units: item.quantity,
      selling_price: Math.round(item.unit_price / 100),
    })),
    payment_method: 'Prepaid',
    sub_total: Math.round(order.subtotal / 100),
    length: Math.max(...orderItems.map(i => i.length_cm || 10), 10),
    breadth: Math.max(...orderItems.map(i => i.breadth_cm || 10), 10),
    height: Math.max(...orderItems.map(i => i.height_cm || 10), 10),
    weight: orderItems.reduce((s, i) => s + ((i.weight_grams || 250) * i.quantity), 0) / 1000,
  }

  const res = await fetch(`${BASE_URL}/orders/create/adhoc`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    console.error('[shiprocket] order create failed', res.status, data)
    return { skipped: false, error: data.message || 'shiprocket_order_create_failed' }
  }

  return {
    skipped: false,
    shiprocket_order_id: data.order_id ? String(data.order_id) : null,
    shiprocket_shipment_id: data.shipment_id ? String(data.shipment_id) : null,
  }
}

export async function trackShipment(awbCode) {
  if (!isShiprocketConfigured() || !awbCode) return null
  const token = await getShiprocketToken()
  if (!token) return null

  const res = await fetch(`${BASE_URL}/courier/track/awb/${awbCode}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) return null
  return res.json().catch(() => null)
}
