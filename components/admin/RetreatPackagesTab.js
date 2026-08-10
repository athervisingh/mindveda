import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../../lib/supabaseClient'

function slugify(s) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

const ICON_OPTIONS = [
  { key: 'quad',   label: 'Quad (4 beds)' },
  { key: 'bed',    label: 'Twin bed' },
  { key: 'person', label: 'Single person' },
  { key: 'group',  label: 'Group' },
]

function PackageIcon({ iconKey, className }) {
  switch (iconKey) {
    case 'quad':
      return (
        <svg className={className} viewBox="0 0 96 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="11" r="6"/><path d="M3 44c0-8 4-13 9-13s9 5 9 13"/>
          <circle cx="36" cy="11" r="6"/><path d="M27 44c0-8 4-13 9-13s9 5 9 13"/>
          <circle cx="60" cy="11" r="6"/><path d="M51 44c0-8 4-13 9-13s9 5 9 13"/>
          <circle cx="84" cy="11" r="6"/><path d="M75 44c0-8 4-13 9-13s9 5 9 13"/>
        </svg>
      )
    case 'person':
      return (
        <svg className={className} viewBox="0 0 56 72" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="28" cy="18" r="13"/><path d="M4 68c0-14 11-24 24-24s24 10 24 24"/>
        </svg>
      )
    case 'group':
      return (
        <svg className={className} viewBox="0 0 72 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="13" r="6"/><path d="M1 44c0-9 5-14 11-14s11 5 11 14"/>
          <circle cx="60" cy="13" r="6"/><path d="M49 44c0-9 5-14 11-14s11 5 11 14"/>
          <circle cx="36" cy="10" r="7.5"/><path d="M22 44c0-10 6-16 14-16s14 6 14 16"/>
        </svg>
      )
    case 'bed':
    default:
      return (
        <svg className={className} viewBox="0 0 80 56" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 36V16a4 4 0 014-4h60a4 4 0 014 4v20"/>
          <rect x="4" y="36" width="72" height="12" rx="3"/>
          <rect x="12" y="20" width="22" height="10" rx="2.5"/>
          <rect x="46" y="20" width="22" height="10" rx="2.5"/>
          <path d="M6 48v5M74 48v5"/><path d="M4 36h72"/>
        </svg>
      )
  }
}

const EMPTY_FORM = {
  id: null,
  label: '',
  slug: '',
  slugTouched: false,
  subtitle: '',
  icon_key: 'bed',
  originalPriceRupees: '',
  priceRupees: '',
  features: [],
  featureInput: '',
  sold_out: false,
  is_active: true,
  sort_order: 0,
}

export default function RetreatPackagesTab() {
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [deleteBlockedId, setDeleteBlockedId] = useState(null)

  useEffect(() => { fetchPackages() }, [])

  async function fetchPackages() {
    setLoading(true)
    const { data } = await supabase.from('retreat_packages').select('*').order('sort_order')
    setPackages(data || [])
    setLoading(false)
  }

  function openCreateForm() {
    setForm({ ...EMPTY_FORM, sort_order: packages.length })
    setFormOpen(true)
  }

  function openEditForm(p) {
    setForm({
      id: p.id,
      label: p.label,
      slug: p.slug,
      slugTouched: true,
      subtitle: p.subtitle || '',
      icon_key: p.icon_key,
      originalPriceRupees: String(p.original_price),
      priceRupees: String(p.price),
      features: [...(p.features || [])],
      featureInput: '',
      sold_out: p.sold_out,
      is_active: p.is_active,
      sort_order: p.sort_order,
    })
    setFormOpen(true)
  }

  function handleLabelChange(label) {
    setForm(f => ({ ...f, label, slug: f.slugTouched ? f.slug : slugify(label) }))
  }

  function addFeature() {
    const val = form.featureInput.trim()
    if (!val) return
    setForm(f => ({ ...f, features: [...f.features, val], featureInput: '' }))
  }

  function removeFeature(idx) {
    setForm(f => ({ ...f, features: f.features.filter((_, i) => i !== idx) }))
  }

  async function handleSave() {
    if (!form.label.trim() || !form.slug.trim() || !form.originalPriceRupees || !form.priceRupees) {
      alert('Label, slug, original price aur price zaroori hai')
      return
    }
    setSaving(true)
    try {
      const payload = {
        label: form.label.trim(),
        slug: form.slug.trim(),
        subtitle: form.subtitle.trim() || null,
        icon_key: form.icon_key,
        original_price: parseInt(form.originalPriceRupees) || 0,
        price: parseInt(form.priceRupees) || 0,
        features: form.features,
        sold_out: form.sold_out,
        is_active: form.is_active,
        sort_order: parseInt(form.sort_order) || 0,
      }

      if (!form.id) {
        const { error } = await supabase.from('retreat_packages').insert(payload)
        if (error) throw error
      } else {
        const { error } = await supabase.from('retreat_packages').update(payload).eq('id', form.id)
        if (error) throw error
      }

      setFormOpen(false)
      fetchPackages()
    } catch (err) {
      alert('Save failed: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  async function toggleField(p, field) {
    await supabase.from('retreat_packages').update({ [field]: !p[field] }).eq('id', p.id)
    setPackages(prev => prev.map(x => x.id === p.id ? { ...x, [field]: !p[field] } : x))
  }

  async function handleDelete(p) {
    if (!confirm(`Delete "${p.label}"? This can't be undone.`)) return
    const { error } = await supabase.from('retreat_packages').delete().eq('id', p.id)
    if (error) {
      setDeleteBlockedId(p.id)
      return
    }
    setPackages(prev => prev.filter(x => x.id !== p.id))
  }

  return (
    <div className="p-8 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#1a3520]">Retreat Packages</h1>
        <button onClick={openCreateForm} className="px-5 py-2.5 rounded-xl bg-[#1a3520] text-white text-sm font-medium hover:opacity-90">
          + Add Package
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
                  {['Package', 'Price', 'Sold Out', 'Active', 'Actions'].map(h => (
                    <th key={h} className="text-left text-[11px] font-semibold text-gray-400 px-4 py-3 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {packages.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-16 text-gray-400 text-sm">No packages yet</td></tr>
                ) : packages.map(p => (
                  <tr key={p.id} className="border-b border-gray-50 last:border-0 hover:bg-[#f7f5f0] transition-colors">
                    <td className="px-4 py-3 min-w-[220px]">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-gray-100 flex-shrink-0 flex items-center justify-center text-[#7a5c14]">
                          <PackageIcon iconKey={p.icon_key} className="w-7 h-7" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-[#1a3520] truncate">{p.label}</p>
                          <p className="text-xs text-gray-400 truncate">/{p.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-bold text-[#1a3520]">₹{p.price.toLocaleString('en-IN')}</span>
                      <span className="text-xs text-gray-400 line-through ml-1.5">₹{p.original_price.toLocaleString('en-IN')}</span>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => toggleField(p, 'sold_out')}
                        className={`w-10 h-5.5 rounded-full relative transition-colors ${p.sold_out ? 'bg-red-500' : 'bg-gray-200'}`}
                        style={{ height: '22px' }}>
                        <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all shadow-sm ${p.sold_out ? 'left-[22px]' : 'left-0.5'}`} />
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => toggleField(p, 'is_active')}
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
                        <p className="text-[11px] text-amber-600 mt-1.5 max-w-[180px]">Has existing bookings — disable it instead using the toggle.</p>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Package Form Modal ── */}
      <AnimatePresence>
        {formOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={e => { if (e.target === e.currentTarget) setFormOpen(false) }}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[88vh] flex flex-col overflow-hidden">
              <div className="bg-[#1a3520] px-6 py-4 flex items-center justify-between">
                <h2 className="text-white font-bold">{form.id ? 'Edit Package' : 'Add Package'}</h2>
                <button onClick={() => setFormOpen(false)} className="text-white/50 hover:text-white text-xl leading-none">×</button>
              </div>
              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Label</label>
                  <input type="text" value={form.label} onChange={e => handleLabelChange(e.target.value)}
                    placeholder="e.g. TWIN SHARING ROOM"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3520]/20" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Slug (used as package ID)</label>
                  <input type="text" value={form.slug}
                    onChange={e => setForm(f => ({ ...f, slug: slugify(e.target.value), slugTouched: true }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3520]/20" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Subtitle</label>
                  <input type="text" value={form.subtitle} onChange={e => setForm(f => ({ ...f, subtitle: e.target.value }))}
                    placeholder="e.g. 1 Room (2 Beds)"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3520]/20" />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Icon</label>
                  <div className="grid grid-cols-4 gap-2">
                    {ICON_OPTIONS.map(opt => (
                      <button key={opt.key} type="button" onClick={() => setForm(f => ({ ...f, icon_key: opt.key }))}
                        className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border-2 transition-colors ${form.icon_key === opt.key ? 'border-[#1a3520] bg-[#1a3520]/5' : 'border-gray-200 hover:border-gray-300'}`}>
                        <PackageIcon iconKey={opt.key} className="w-8 h-6 text-[#7a5c14]" />
                        <span className="text-[10px] text-gray-500 text-center px-1">{opt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Original Price (₹)</label>
                    <input type="number" min="0" value={form.originalPriceRupees}
                      onChange={e => setForm(f => ({ ...f, originalPriceRupees: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3520]/20" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Price (₹)</label>
                    <input type="number" min="0" value={form.priceRupees}
                      onChange={e => setForm(f => ({ ...f, priceRupees: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3520]/20" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Features</label>
                  <div className="flex gap-2 mb-2">
                    <input type="text" value={form.featureInput}
                      onChange={e => setForm(f => ({ ...f, featureInput: e.target.value }))}
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addFeature() } }}
                      placeholder="e.g. Sattvic Meals"
                      className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3520]/20" />
                    <button type="button" onClick={addFeature}
                      className="px-4 py-2 rounded-xl bg-gray-100 text-sm text-gray-600 hover:bg-gray-200">Add</button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {form.features.map((feat, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1.5 bg-[#1a3520]/5 text-[#1a3520] text-xs px-2.5 py-1 rounded-full">
                        {feat}
                        <button type="button" onClick={() => removeFeature(idx)} className="text-[#1a3520]/50 hover:text-[#1a3520] leading-none">×</button>
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Sort Order</label>
                  <input type="number" value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: e.target.value }))}
                    className="w-24 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3520]/20" />
                </div>

                <div className="flex gap-6">
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input type="checkbox" checked={form.is_active} onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))} />
                    Active (visible on site)
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input type="checkbox" checked={form.sold_out} onChange={e => setForm(f => ({ ...f, sold_out: e.target.checked }))} />
                    Sold out
                  </label>
                </div>
              </div>
              <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
                <button onClick={() => setFormOpen(false)} className="flex-1 border border-gray-200 rounded-xl py-2.5 text-sm text-gray-600 hover:border-gray-400">
                  Cancel
                </button>
                <button onClick={handleSave} disabled={saving}
                  className="flex-1 bg-[#1a3520] text-white rounded-xl py-2.5 text-sm font-semibold hover:opacity-90 disabled:opacity-50">
                  {saving ? 'Saving…' : 'Save Package'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
