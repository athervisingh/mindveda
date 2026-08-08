import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../../lib/supabaseClient'

const ORDER_STATUS_STYLES = {
  pending:    'bg-amber-100 text-amber-700',
  paid:       'bg-blue-100 text-blue-700',
  processing: 'bg-purple-100 text-purple-700',
  shipped:    'bg-indigo-100 text-indigo-700',
  delivered:  'bg-green-100 text-green-700',
  cancelled:  'bg-red-100 text-red-600',
  failed:     'bg-red-100 text-red-600',
  refunded:   'bg-gray-100 text-gray-500',
}
const ORDER_STATUS_OPTIONS = ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']

function slugify(s) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

function fmtDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

const EMPTY_FORM = {
  id: null,
  name: '',
  slug: '',
  slugTouched: false,
  description: '',
  priceRupees: '',
  category: '',
  stock: '',
  weight_grams: 250,
  length_cm: 10,
  breadth_cm: 10,
  height_cm: 10,
  is_active: true,
  images: [null, null, null], // existing URLs (or null)
}

export default function ShopTab() {
  const [view, setView] = useState('products')

  // ── Products ──────────────────────────────────
  const [products, setProducts] = useState([])
  const [loadingP, setLoadingP] = useState(true)
  const [productSearch, setProductSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [formOpen, setFormOpen] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [imageFiles, setImageFiles] = useState([null, null, null])
  const [imagePreviews, setImagePreviews] = useState([null, null, null])
  const [uploadingSlot, setUploadingSlot] = useState(null)
  const [deleteBlockedId, setDeleteBlockedId] = useState(null)

  // ── Orders ────────────────────────────────────
  const [orders, setOrders] = useState([])
  const [loadingO, setLoadingO] = useState(false)
  const [orderSearch, setOrderSearch] = useState('')
  const [orderStatusFilter, setOrderStatusFilter] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [orderItemsMap, setOrderItemsMap] = useState({})
  const [creatingShipment, setCreatingShipment] = useState(null)
  const [updatingOrder, setUpdatingOrder] = useState(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    if (view === 'orders' && orders.length === 0) fetchOrders()
  }, [view])

  async function fetchProducts() {
    setLoadingP(true)
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false })
    setProducts(data || [])
    setLoadingP(false)
  }

  async function fetchOrders() {
    setLoadingO(true)
    const { data } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false })
    setOrders(data || [])
    setLoadingO(false)
  }

  // ── Product form ──────────────────────────────
  function openCreateForm() {
    setForm(EMPTY_FORM)
    setImageFiles([null, null, null])
    setImagePreviews([null, null, null])
    setFormOpen(true)
  }

  function openEditForm(p) {
    setForm({
      id: p.id,
      name: p.name,
      slug: p.slug,
      slugTouched: true,
      description: p.description || '',
      priceRupees: String(Math.round(p.price / 100)),
      category: p.category || '',
      stock: String(p.stock),
      weight_grams: p.weight_grams,
      length_cm: p.length_cm,
      breadth_cm: p.breadth_cm,
      height_cm: p.height_cm,
      is_active: p.is_active,
      images: [p.images?.[0] || null, p.images?.[1] || null, p.images?.[2] || null],
    })
    setImageFiles([null, null, null])
    setImagePreviews([p.images?.[0] || null, p.images?.[1] || null, p.images?.[2] || null])
    setFormOpen(true)
  }

  function handleNameChange(name) {
    setForm(f => ({ ...f, name, slug: f.slugTouched ? f.slug : slugify(name) }))
  }

  function handleImageSelect(slot, file) {
    if (!file) return
    const next = [...imageFiles]; next[slot] = file
    setImageFiles(next)
    const previews = [...imagePreviews]; previews[slot] = URL.createObjectURL(file)
    setImagePreviews(previews)
  }

  async function uploadImages(productId) {
    const urls = [...form.images]
    for (let slot = 0; slot < 3; slot++) {
      const file = imageFiles[slot]
      if (!file) continue
      setUploadingSlot(slot)
      const ext = file.name.split('.').pop()
      const path = `products/${productId}/${slot + 1}.${ext}`
      const { error: upErr } = await supabase.storage.from('product-images').upload(path, file, { upsert: true })
      if (upErr) { setUploadingSlot(null); throw upErr }
      const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(path)
      urls[slot] = publicUrl
    }
    setUploadingSlot(null)
    return urls
  }

  async function handleSave() {
    if (!form.name.trim() || !form.slug.trim() || !form.priceRupees) {
      alert('Name, slug aur price zaroori hai')
      return
    }
    setSaving(true)
    try {
      const payload = {
        name: form.name.trim(),
        slug: form.slug.trim(),
        description: form.description.trim() || null,
        price: Math.round(parseFloat(form.priceRupees) * 100),
        category: form.category.trim() || 'general',
        stock: parseInt(form.stock) || 0,
        weight_grams: parseInt(form.weight_grams) || 250,
        length_cm: parseInt(form.length_cm) || 10,
        breadth_cm: parseInt(form.breadth_cm) || 10,
        height_cm: parseInt(form.height_cm) || 10,
        is_active: form.is_active,
      }

      let productId = form.id
      if (!productId) {
        const { data, error } = await supabase.from('products').insert({ ...payload, images: [] }).select().single()
        if (error) throw error
        productId = data.id
      } else {
        const { error } = await supabase.from('products').update(payload).eq('id', productId)
        if (error) throw error
      }

      if (imageFiles.some(Boolean)) {
        const urls = await uploadImages(productId)
        await supabase.from('products').update({ images: urls.filter(Boolean) }).eq('id', productId)
      }

      setFormOpen(false)
      fetchProducts()
    } catch (err) {
      alert('Save failed: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  async function toggleActive(p) {
    await supabase.from('products').update({ is_active: !p.is_active }).eq('id', p.id)
    setProducts(prev => prev.map(x => x.id === p.id ? { ...x, is_active: !p.is_active } : x))
  }

  async function handleDelete(p) {
    if (!confirm(`Delete "${p.name}"? This can't be undone.`)) return
    const { error } = await supabase.from('products').delete().eq('id', p.id)
    if (error) {
      setDeleteBlockedId(p.id)
      return
    }
    setProducts(prev => prev.filter(x => x.id !== p.id))
  }

  // ── Orders ────────────────────────────────────
  async function updateOrderStatus(orderId, status) {
    setUpdatingOrder(orderId)
    await supabase.from('orders').update({ status }).eq('id', orderId)
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o))
    setUpdatingOrder(null)
  }

  async function createShipment(order) {
    setCreatingShipment(order.id)
    try {
      const res = await fetch('/api/admin/shop/create-shipment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: order.id }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Shipment creation failed')
      alert(data.skipped
        ? 'Shiprocket not configured yet — add SHIPROCKET_EMAIL/PASSWORD/PICKUP_LOCATION env vars first.'
        : 'Shipment created!')
      fetchOrders()
    } catch (err) {
      alert(err.message)
    } finally {
      setCreatingShipment(null)
    }
  }

  // ── Derived ───────────────────────────────────
  const categories = ['all', ...new Set(products.map(p => p.category).filter(Boolean))]
  const filteredProducts = products.filter(p => {
    const matchCat = categoryFilter === 'all' || p.category === categoryFilter
    if (!productSearch) return matchCat
    const q = productSearch.toLowerCase()
    return matchCat && (p.name.toLowerCase().includes(q) || p.category?.toLowerCase().includes(q))
  })
  const productStats = {
    total: products.length,
    active: products.filter(p => p.is_active).length,
    outOfStock: products.filter(p => p.stock === 0).length,
    inventoryValue: products.reduce((s, p) => s + Math.round(p.price / 100) * p.stock, 0),
  }

  const filteredOrders = orders.filter(o => {
    const matchStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter
    if (!orderSearch) return matchStatus
    const q = orderSearch.toLowerCase()
    return matchStatus && (
      o.shipping_name?.toLowerCase().includes(q) ||
      o.shipping_email?.toLowerCase().includes(q) ||
      o.shipping_city?.toLowerCase().includes(q)
    )
  })
  const orderStats = {
    total: orders.length,
    paid: orders.filter(o => o.payment_status === 'paid').length,
    shipped: orders.filter(o => ['shipped', 'delivered'].includes(o.status)).length,
    revenue: orders.filter(o => o.payment_status === 'paid').reduce((s, o) => s + Math.round(o.total_amount / 100), 0),
  }

  return (
    <div className="p-8 max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#1a3520]">Shop</h1>
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
          {['products', 'orders'].map(v => (
            <button key={v} onClick={() => setView(v)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-all ${view === v ? 'bg-white shadow-sm text-[#1a3520]' : 'text-gray-500'}`}>
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* ══════════════ PRODUCTS ══════════════ */}
      {view === 'products' && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Total Products', val: productStats.total },
              { label: 'Active',         val: productStats.active, color: 'text-green-600' },
              { label: 'Out of Stock',   val: productStats.outOfStock, color: 'text-red-500' },
              { label: 'Inventory Value', val: `₹${productStats.inventoryValue.toLocaleString('en-IN')}` },
            ].map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <div className={`text-2xl font-black ${s.color || 'text-[#1a3520]'}`}>{s.val}</div>
                <div className="text-xs text-gray-400 mt-1 font-medium">{s.label}</div>
              </motion.div>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-5 flex flex-wrap gap-3 items-end justify-between">
            <div className="flex flex-wrap gap-3 items-end">
              <div>
                <label className="block text-[11px] font-medium text-gray-500 mb-1">Search</label>
                <input type="text" value={productSearch} onChange={e => setProductSearch(e.target.value)}
                  placeholder="Name, category…"
                  className="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3520]/20 w-56" />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-gray-500 mb-1">Category</label>
                <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}
                  className="border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1a3520]/20">
                  {categories.map(c => <option key={c} value={c}>{c === 'all' ? 'All Categories' : c}</option>)}
                </select>
              </div>
            </div>
            <button onClick={openCreateForm} className="px-5 py-2.5 rounded-xl bg-[#1a3520] text-white text-sm font-medium hover:opacity-90">
              + Add Product
            </button>
          </div>

          {loadingP ? (
            <div className="space-y-2">{[1,2,3,4].map(i => <div key={i} className="h-16 bg-gray-100 rounded-2xl animate-pulse" />)}</div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/70">
                      {['Product', 'Category', 'Price', 'Stock', 'Active', 'Actions'].map(h => (
                        <th key={h} className="text-left text-[11px] font-semibold text-gray-400 px-4 py-3 uppercase tracking-wide whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.length === 0 ? (
                      <tr><td colSpan={6} className="text-center py-16 text-gray-400 text-sm">No products yet</td></tr>
                    ) : filteredProducts.map(p => (
                      <tr key={p.id} className="border-b border-gray-50 last:border-0 hover:bg-[#f7f5f0] transition-colors">
                        <td className="px-4 py-3 min-w-[220px]">
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-xl bg-gray-100 flex-shrink-0 overflow-hidden">
                              {p.images?.[0] && <img src={p.images[0]} alt="" className="w-full h-full object-cover" />}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-[#1a3520] truncate">{p.name}</p>
                              <p className="text-xs text-gray-400 truncate">/{p.slug}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3"><span className="text-xs text-gray-600 capitalize">{p.category}</span></td>
                        <td className="px-4 py-3"><span className="text-sm font-bold text-[#1a3520]">₹{Math.round(p.price / 100).toLocaleString('en-IN')}</span></td>
                        <td className="px-4 py-3">
                          <span className={`text-sm font-semibold ${p.stock === 0 ? 'text-red-500' : 'text-gray-700'}`}>{p.stock}</span>
                        </td>
                        <td className="px-4 py-3">
                          <button onClick={() => toggleActive(p)}
                            className={`w-10 h-5.5 rounded-full relative transition-colors ${p.is_active ? 'bg-green-500' : 'bg-gray-200'}`}
                            style={{ height: '22px' }}>
                            <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all shadow-sm ${p.is_active ? 'left-[22px]' : 'left-0.5'}`} />
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button onClick={() => openEditForm(p)}
                              className="text-xs text-[#1a3520] border border-[#1a3520]/30 px-3 py-1.5 rounded-lg hover:bg-[#1a3520] hover:text-white transition-all whitespace-nowrap">
                              Edit
                            </button>
                            <button onClick={() => handleDelete(p)}
                              className="text-xs text-red-500 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-500 hover:text-white transition-all whitespace-nowrap">
                              Delete
                            </button>
                          </div>
                          {deleteBlockedId === p.id && (
                            <p className="text-[11px] text-amber-600 mt-1.5 max-w-[180px]">Has existing orders — disable it instead using the toggle.</p>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── Product Form Modal ── */}
          <AnimatePresence>
            {formOpen && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                onClick={e => { if (e.target === e.currentTarget) setFormOpen(false) }}>
                <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                  className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[88vh] flex flex-col overflow-hidden">
                  <div className="bg-[#1a3520] px-6 py-4 flex items-center justify-between">
                    <h2 className="text-white font-bold">{form.id ? 'Edit Product' : 'Add Product'}</h2>
                    <button onClick={() => setFormOpen(false)} className="text-white/50 hover:text-white text-xl leading-none">×</button>
                  </div>
                  <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Name</label>
                      <input type="text" value={form.name} onChange={e => handleNameChange(e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3520]/20" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Slug (URL)</label>
                      <input type="text" value={form.slug}
                        onChange={e => setForm(f => ({ ...f, slug: slugify(e.target.value), slugTouched: true }))}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3520]/20" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                      <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3520]/20" />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Price (₹)</label>
                        <input type="number" min="0" value={form.priceRupees} onChange={e => setForm(f => ({ ...f, priceRupees: e.target.value }))}
                          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3520]/20" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Stock</label>
                        <input type="number" min="0" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))}
                          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3520]/20" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Category</label>
                        <input type="text" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                          placeholder="e.g. Aromatherapy"
                          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3520]/20" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1.5">Shipping — weight & dimensions (defaults are fine for small items)</label>
                      <div className="grid grid-cols-4 gap-2">
                        {[['weight_grams','Weight (g)'],['length_cm','L (cm)'],['breadth_cm','B (cm)'],['height_cm','H (cm)']].map(([key,label]) => (
                          <div key={key}>
                            <input type="number" min="1" value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                              placeholder={label}
                              className="w-full border border-gray-200 rounded-xl px-2.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#1a3520]/20" />
                            <p className="text-[10px] text-gray-400 mt-0.5 text-center">{label}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1.5">Images (3)</label>
                      <div className="grid grid-cols-3 gap-3">
                        {[0, 1, 2].map(slot => (
                          <label key={slot} className="relative aspect-square rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center cursor-pointer overflow-hidden hover:border-[#1a3520]/40 transition-colors">
                            <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
                              onChange={e => handleImageSelect(slot, e.target.files?.[0])} />
                            {uploadingSlot === slot ? (
                              <div className="w-5 h-5 border-2 border-gray-300 border-t-[#1a3520] rounded-full animate-spin" />
                            ) : imagePreviews[slot] ? (
                              <img src={imagePreviews[slot]} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-gray-300 text-xs text-center px-1">+ Image {slot + 1}</span>
                            )}
                          </label>
                        ))}
                      </div>
                    </div>

                    <label className="flex items-center gap-2 text-sm text-gray-700">
                      <input type="checkbox" checked={form.is_active} onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))} />
                      Active (visible in shop)
                    </label>
                  </div>
                  <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
                    <button onClick={() => setFormOpen(false)} className="flex-1 border border-gray-200 rounded-xl py-2.5 text-sm text-gray-600 hover:border-gray-400">
                      Cancel
                    </button>
                    <button onClick={handleSave} disabled={saving}
                      className="flex-1 bg-[#1a3520] text-white rounded-xl py-2.5 text-sm font-semibold hover:opacity-90 disabled:opacity-50">
                      {saving ? 'Saving…' : 'Save Product'}
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}

      {/* ══════════════ ORDERS ══════════════ */}
      {view === 'orders' && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Total Orders', val: orderStats.total },
              { label: 'Paid',         val: orderStats.paid, color: 'text-blue-600' },
              { label: 'Shipped',      val: orderStats.shipped, color: 'text-indigo-600' },
              { label: 'Revenue',      val: `₹${orderStats.revenue.toLocaleString('en-IN')}` },
            ].map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <div className={`text-2xl font-black ${s.color || 'text-[#1a3520]'}`}>{s.val}</div>
                <div className="text-xs text-gray-400 mt-1 font-medium">{s.label}</div>
              </motion.div>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-5 flex flex-wrap gap-3 items-end justify-between">
            <div className="flex flex-wrap gap-3 items-end">
              <div>
                <label className="block text-[11px] font-medium text-gray-500 mb-1">Search</label>
                <input type="text" value={orderSearch} onChange={e => setOrderSearch(e.target.value)}
                  placeholder="Customer, city…"
                  className="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3520]/20 w-56" />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-gray-500 mb-1">Status</label>
                <select value={orderStatusFilter} onChange={e => setOrderStatusFilter(e.target.value)}
                  className="border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1a3520]/20">
                  <option value="all">All Status</option>
                  {ORDER_STATUS_OPTIONS.map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
                </select>
              </div>
            </div>
            <button onClick={fetchOrders} className="px-4 py-2 rounded-xl bg-[#1a3520] text-white text-sm font-medium hover:opacity-90">Refresh</button>
          </div>

          {loadingO ? (
            <div className="space-y-2">{[1,2,3].map(i => <div key={i} className="h-16 bg-gray-100 rounded-2xl animate-pulse" />)}</div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/70">
                      {['Customer', 'Items', 'Total', 'Payment', 'Shipment', 'Status', 'Actions'].map(h => (
                        <th key={h} className="text-left text-[11px] font-semibold text-gray-400 px-4 py-3 uppercase tracking-wide whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.length === 0 ? (
                      <tr><td colSpan={7} className="text-center py-16 text-gray-400 text-sm">No orders yet</td></tr>
                    ) : filteredOrders.map(o => (
                      <tr key={o.id} className="border-b border-gray-50 last:border-0 hover:bg-[#f7f5f0] transition-colors">
                        <td className="px-4 py-3 min-w-[160px]">
                          <p className="text-sm font-semibold text-[#1a3520]">{o.shipping_name}</p>
                          <p className="text-xs text-gray-400">{o.shipping_city}, {o.shipping_state}</p>
                        </td>
                        <td className="px-4 py-3 min-w-[160px]">
                          <p className="text-xs text-gray-600">{o.order_items?.length || 0} item{(o.order_items?.length || 0) !== 1 ? 's' : ''}</p>
                          <p className="text-xs text-gray-400 truncate max-w-[150px]">{o.order_items?.[0]?.product_name}</p>
                        </td>
                        <td className="px-4 py-3"><span className="text-sm font-bold text-[#1a3520]">₹{Math.round(o.total_amount / 100).toLocaleString('en-IN')}</span></td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${o.payment_status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                            {o.payment_status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {o.awb_code ? (
                            <>
                              <p className="text-xs font-mono text-gray-600">{o.awb_code}</p>
                              <p className="text-[10px] text-gray-400">{o.courier_name}</p>
                            </>
                          ) : <span className="text-xs text-gray-300">—</span>}
                        </td>
                        <td className="px-4 py-3">
                          <select value={o.status} onChange={e => updateOrderStatus(o.id, e.target.value)}
                            disabled={updatingOrder === o.id}
                            className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white disabled:opacity-50 focus:outline-none capitalize">
                            {ORDER_STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-col gap-1.5">
                            <button onClick={() => setSelectedOrder(o)}
                              className="text-xs text-[#1a3520] border border-[#1a3520]/30 px-3 py-1.5 rounded-lg hover:bg-[#1a3520] hover:text-white transition-all whitespace-nowrap">
                              View
                            </button>
                            {!o.shiprocket_order_id && o.payment_status === 'paid' && (
                              <button onClick={() => createShipment(o)} disabled={creatingShipment === o.id}
                                className="text-xs text-indigo-600 border border-indigo-200 px-3 py-1.5 rounded-lg hover:bg-indigo-600 hover:text-white transition-all whitespace-nowrap disabled:opacity-50">
                                {creatingShipment === o.id ? '…' : 'Create Shipment'}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── Order Detail Modal ── */}
          <AnimatePresence>
            {selectedOrder && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                onClick={e => { if (e.target === e.currentTarget) setSelectedOrder(null) }}>
                <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                  className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden">
                  <div className="bg-[#1a3520] px-6 py-5 flex items-center justify-between">
                    <div>
                      <h2 className="text-white font-bold text-lg">{selectedOrder.shipping_name}</h2>
                      <p className="text-white/60 text-sm">{selectedOrder.shipping_email}</p>
                    </div>
                    <button onClick={() => setSelectedOrder(null)} className="text-white/50 hover:text-white text-xl leading-none">×</button>
                  </div>
                  <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold mb-1">Shipping Address</p>
                      <p className="text-sm text-gray-700">
                        {selectedOrder.shipping_line1}{selectedOrder.shipping_line2 ? `, ${selectedOrder.shipping_line2}` : ''}<br />
                        {selectedOrder.shipping_city}, {selectedOrder.shipping_state} — {selectedOrder.shipping_pincode}<br />
                        {selectedOrder.shipping_phone}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold mb-2">Items</p>
                      <div className="space-y-2">
                        {(selectedOrder.order_items || []).map(it => (
                          <div key={it.id} className="flex justify-between text-sm border-b border-gray-50 pb-2">
                            <span className="text-gray-700">{it.product_name} × {it.quantity}</span>
                            <span className="font-semibold text-[#1a3520]">₹{Math.round(it.line_total / 100).toLocaleString('en-IN')}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-[#1a3520] pt-2 border-t border-gray-100">
                      <span>Total</span>
                      <span>₹{Math.round(selectedOrder.total_amount / 100).toLocaleString('en-IN')}</span>
                    </div>
                    {selectedOrder.tracking_url && (
                      <a href={selectedOrder.tracking_url} target="_blank" rel="noopener noreferrer" className="block text-center text-sm text-[#1a3520] underline">
                        Track Shipment →
                      </a>
                    )}
                    {selectedOrder.status === 'paid' && (
                      <p className="text-[11px] text-gray-400">To cancel a paid order, set status to "cancelled" from the table — refund must be issued manually via the Razorpay dashboard.</p>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  )
}
