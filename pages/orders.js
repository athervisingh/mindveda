import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { motion } from 'framer-motion'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabaseClient'
import { NextSeo } from 'next-seo'
import { CartIcon } from '../components/Icons'

const STATUS_STYLES = {
  pending:    'bg-amber-100 text-amber-700',
  paid:       'bg-blue-100 text-blue-700',
  processing: 'bg-purple-100 text-purple-700',
  shipped:    'bg-indigo-100 text-indigo-700',
  delivered:  'bg-green-100 text-green-700',
  cancelled:  'bg-red-100 text-red-600',
  failed:     'bg-red-100 text-red-600',
  refunded:   'bg-gray-100 text-gray-500',
}

function fmtDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function Orders() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) router.replace('/login?redirect=/orders')
  }, [user, authLoading, router])

  useEffect(() => {
    if (!user) return
    async function fetchOrders() {
      const { data } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      setOrders(data || [])
      setLoading(false)
    }
    fetchOrders()
  }, [user])

  if (authLoading || !user) return null

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfaf7]">
      <NextSeo noindex nofollow title="My Orders — MindVeda" />
      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-6 py-12 w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-[#1a3520]">My Orders</h1>
          <p className="text-gray-500 text-sm mt-1">Track your shop orders and deliveries</p>
        </div>

        {loading ? (
          <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-24 bg-white rounded-2xl animate-pulse shadow-sm" />)}</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <div className="w-16 h-16 mx-auto mb-4 text-gray-300 flex items-center justify-center">
              <CartIcon className="w-14 h-14" />
            </div>
            <h2 className="text-xl font-semibold text-[#1a3520] mb-2">No orders yet</h2>
            <p className="text-gray-500 mb-6">Your shop orders will show up here once you place one.</p>
            <Link href="/shop" className="inline-flex bg-brand text-white text-sm font-semibold px-6 py-3 rounded-full hover:opacity-90 transition-opacity">
              Browse Shop
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((o, i) => (
              <motion.div key={o.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <p className="text-xs text-gray-400">Order #{o.id.slice(0, 8).toUpperCase()} · {fmtDate(o.created_at)}</p>
                    <p className="text-sm font-semibold text-[#1a3520] mt-0.5">
                      {(o.order_items || []).length} item{(o.order_items || []).length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize whitespace-nowrap ${STATUS_STYLES[o.status] || 'bg-gray-100 text-gray-500'}`}>
                    {o.status}
                  </span>
                </div>

                <div className="space-y-2 mb-3">
                  {(o.order_items || []).map(it => (
                    <div key={it.id} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-brand/10 flex-shrink-0 overflow-hidden">
                        {it.product_image && <img src={it.product_image} alt="" className="w-full h-full object-cover" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-700 truncate">{it.product_name} × {it.quantity}</p>
                      </div>
                      <p className="text-sm font-semibold text-[#1a3520]">₹{Math.round(it.line_total / 100).toLocaleString('en-IN')}</p>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                  <p className="text-sm font-bold text-brand">Total: ₹{Math.round(o.total_amount / 100).toLocaleString('en-IN')}</p>
                  {o.tracking_url ? (
                    <a href={o.tracking_url} target="_blank" rel="noopener noreferrer" className="text-xs text-brand underline underline-offset-2">
                      Track Shipment →
                    </a>
                  ) : o.awb_code ? (
                    <p className="text-xs text-gray-400 font-mono">AWB: {o.awb_code}</p>
                  ) : null}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
