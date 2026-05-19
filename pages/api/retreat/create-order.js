import { getRazorpay } from '../../../lib/razorpay'

const PACKAGE_PRICES = {
'twin-sharing': 15000,
  'single-stay':  18000,
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { packageId, checkInDate, name, email, phone } = req.body
  if (!packageId || !checkInDate || !name || !email || !phone) {
    return res.status(400).json({ error: 'All fields are required' })
  }

  const priceRupees = PACKAGE_PRICES[packageId]
  if (!priceRupees) return res.status(400).json({ error: 'Invalid package' })

  try {
    const order = await getRazorpay().orders.create({
      amount:   priceRupees * 100,
      currency: 'INR',
      receipt:  `retreat_${packageId}_${Date.now()}`,
      notes:    { packageId, checkInDate, name, email, phone },
    })
    res.json({ orderId: order.id, amount: order.amount })
  } catch (err) {
    res.status(500).json({ error: err.message || 'Order creation failed' })
  }
}
