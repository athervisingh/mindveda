import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../../lib/supabaseClient'
import { NEWS_ROUTE_OPTIONS, ALL_ROUTES } from '../../lib/newsPlacements'

const EMPTY_FORM = {
  id: null,
  headline: '',
  link: '',
  route: ALL_ROUTES,
  placement: 'top',
  is_active: true,
  sort_order: 0,
}

function routeLabel(route) {
  const known = NEWS_ROUTE_OPTIONS.find(o => o.value === route)
  return known ? known.label : route
}

export default function NewsTab() {
  const [items, setItems] = useState([])
  const [customRoute, setCustomRoute] = useState(false)
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  useEffect(() => { fetchItems() }, [])

  async function fetchItems() {
    setLoading(true)
    const { data } = await supabase.from('news_items').select('*').order('sort_order')
    setItems(data || [])
    setLoading(false)
  }

  function openCreateForm() {
    setForm({ ...EMPTY_FORM, sort_order: items.length })
    setCustomRoute(false)
    setFormOpen(true)
  }

  function openEditForm(item) {
    const route = item.route || ALL_ROUTES
    setForm({
      id: item.id,
      headline: item.headline,
      link: item.link || '',
      route,
      placement: item.placement || 'after_hero',
      is_active: item.is_active,
      sort_order: item.sort_order,
    })
    setCustomRoute(!NEWS_ROUTE_OPTIONS.some(o => o.value === route))
    setFormOpen(true)
  }

  async function handleSave() {
    if (!form.headline.trim()) {
      alert('Headline zaroori hai')
      return
    }
    setSaving(true)
    try {
      const payload = {
        headline: form.headline.trim(),
        link: form.link.trim() || null,
        route: form.route.trim() || ALL_ROUTES,
        placement: form.placement,
        is_active: form.is_active,
        sort_order: parseInt(form.sort_order) || 0,
      }

      if (!form.id) {
        const { error } = await supabase.from('news_items').insert(payload)
        if (error) throw error
      } else {
        const { error } = await supabase.from('news_items').update(payload).eq('id', form.id)
        if (error) throw error
      }

      setFormOpen(false)
      fetchItems()
    } catch (err) {
      alert('Save failed: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  async function toggleActive(item) {
    await supabase.from('news_items').update({ is_active: !item.is_active }).eq('id', item.id)
    setItems(prev => prev.map(x => x.id === item.id ? { ...x, is_active: !x.is_active } : x))
  }

  async function handleDelete(item) {
    if (!confirm(`Delete "${item.headline}"? This can't be undone.`)) return
    const { error } = await supabase.from('news_items').delete().eq('id', item.id)
    if (error) {
      alert('Delete failed: ' + error.message)
      return
    }
    setItems(prev => prev.filter(x => x.id !== item.id))
  }

  return (
    <div className="p-8 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#1a3520]">News Marquee</h1>
        <button onClick={openCreateForm} className="px-5 py-2.5 rounded-xl bg-[#1a3520] text-white text-sm font-medium hover:opacity-90">
          + Add Headline
        </button>
      </div>

      {loading ? (
        <div className="space-y-2">{[1, 2, 3].map(i => <div key={i} className="h-16 bg-gray-100 rounded-2xl animate-pulse" />)}</div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/70">
                  {['Headline', 'Page / Route', 'Link', 'Order', 'Active', 'Actions'].map(h => (
                    <th key={h} className="text-left text-[11px] font-semibold text-gray-400 px-4 py-3 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-16 text-gray-400 text-sm">No headlines yet</td></tr>
                ) : items.map(item => (
                  <tr key={item.id} className="border-b border-gray-50 last:border-0 hover:bg-[#f7f5f0] transition-colors">
                    <td className="px-4 py-3 min-w-[260px]">
                      <p className="text-sm font-semibold text-[#1a3520]">{item.headline}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-medium text-[#1a3520] bg-[#f1ebdb] px-2 py-1 rounded-md whitespace-nowrap">
                        {(item.route || ALL_ROUTES) === ALL_ROUTES ? 'All pages' : item.route}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-gray-400 truncate max-w-[180px] inline-block">{item.link || '—'}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-500">{item.sort_order}</span>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => toggleActive(item)}
                        className={`w-10 h-5.5 rounded-full relative transition-colors ${item.is_active ? 'bg-green-500' : 'bg-gray-200'}`}
                        style={{ height: '22px' }}>
                        <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all shadow-sm ${item.is_active ? 'left-[22px]' : 'left-0.5'}`} />
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => openEditForm(item)}
                          className="text-xs text-[#1a3520] border border-[#1a3520]/30 px-3 py-1.5 rounded-lg hover:bg-[#1a3520] hover:text-white transition-all whitespace-nowrap">
                          Edit
                        </button>
                        <button onClick={() => handleDelete(item)}
                          className="text-xs text-red-500 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-500 hover:text-white transition-all whitespace-nowrap">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Headline Form Modal ── */}
      <AnimatePresence>
        {formOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={e => { if (e.target === e.currentTarget) setFormOpen(false) }}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[88vh] flex flex-col overflow-hidden">
              <div className="bg-[#1a3520] px-6 py-4 flex items-center justify-between">
                <h2 className="text-white font-bold">{form.id ? 'Edit Headline' : 'Add Headline'}</h2>
                <button onClick={() => setFormOpen(false)} className="text-white/50 hover:text-white text-xl leading-none">×</button>
              </div>
              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Headline</label>
                  <input type="text" value={form.headline} onChange={e => setForm(f => ({ ...f, headline: e.target.value }))}
                    placeholder="e.g. New batch starting 1st September — limited seats"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3520]/20" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Link (optional)</label>
                  <input type="text" value={form.link} onChange={e => setForm(f => ({ ...f, link: e.target.value }))}
                    placeholder="e.g. /retreat"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3520]/20" />
                </div>

                <div className="rounded-xl border border-[#e0d9c4] bg-[#faf8f3] p-4 space-y-3">
                  <p className="text-xs font-semibold text-[#1a3520] uppercase tracking-wide">Kahan dikhe</p>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Page / Route</label>
                    <select
                      value={customRoute ? '__custom__' : form.route}
                      onChange={e => {
                        if (e.target.value === '__custom__') {
                          setCustomRoute(true)
                          setForm(f => ({ ...f, route: '' }))
                        } else {
                          setCustomRoute(false)
                          setForm(f => ({ ...f, route: e.target.value }))
                        }
                      }}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1a3520]/20">
                      {NEWS_ROUTE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                      <option value="__custom__">Custom route…</option>
                    </select>
                    {customRoute && (
                      <input type="text" value={form.route} onChange={e => setForm(f => ({ ...f, route: e.target.value }))}
                        placeholder="e.g. /yoga/hatha  ya  /blog/* (poora section)"
                        className="mt-2 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3520]/20" />
                    )}
                    <p className="mt-1 text-[11px] text-gray-400">* = saare pages · /blog/* = us section ke saare pages</p>
                  </div>

                  <p className="text-[11px] text-gray-500 leading-5">
                    <span className="font-semibold text-[#1a3520]">Position:</span> Home page par news hero image ke baad
                    dikhti hai, baaki har page par navbar ke bilkul neeche — yeh automatic hai.
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Sort Order</label>
                  <input type="number" value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: e.target.value }))}
                    className="w-24 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3520]/20" />
                </div>
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input type="checkbox" checked={form.is_active} onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))} />
                  Active (visible on site)
                </label>
              </div>
              <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
                <button onClick={() => setFormOpen(false)} className="flex-1 border border-gray-200 rounded-xl py-2.5 text-sm text-gray-600 hover:border-gray-400">
                  Cancel
                </button>
                <button onClick={handleSave} disabled={saving}
                  className="flex-1 bg-[#1a3520] text-white rounded-xl py-2.5 text-sm font-semibold hover:opacity-90 disabled:opacity-50">
                  {saving ? 'Saving…' : 'Save Headline'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
