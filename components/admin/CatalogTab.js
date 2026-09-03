import { useCallback, useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../../lib/supabaseClient'
import { paiseToRupees, rupeesToPaise, defaultServicePatch, defaultPackageRows } from '../../lib/catalog'

const inputCls = 'w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3520]/20'
const labelCls = 'block text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-1'
const btnGhost = 'text-xs font-semibold text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg hover:border-gray-400 disabled:opacity-30'

const TYPES = ['individual', 'group', 'chat']
const ICONS = ['mind', 'star', 'heart', 'leaf', 'wave', 'compass', 'lotus', 'family', 'career', 'child', 'stress']

const EMPTY_SERVICE = {
  name: '', title: '', slug: '', type: 'individual', category: 'Personal', icon: 'mind',
  badge: '', color: 'from-[#f0f7f2] to-[#e4f0e8]', priceRupees: 1500,
  duration_minutes: 50, duration_label: '50 min',
  short_description: '', description: '', benefits: '', what_to_expect: '',
  sort_order: '', show_on_site: true, is_active: true,
}
const EMPTY_PACKAGE = {
  slug: '', title: '', excerpt: '', priceRupees: 999, duration_label: '55 min',
  sessions: '', sessions_label: '', mode: 'Online', featured: false, sort_order: '', is_active: true,
}

export default function CatalogTab() {
  const [view, setView] = useState('services')
  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1a3520]">Services & Yoga</h1>
        <p className="text-sm text-gray-400 mt-0.5">Change rates, edit the text, or add something new. Changes go live within a minute.</p>
      </div>

      <div className="inline-flex bg-gray-100 rounded-xl p-1 mb-6">
        {[['services', 'Services'], ['packages', 'Yoga & Retreats']].map(([id, label]) => (
          <button key={id} onClick={() => setView(id)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              view === id ? 'bg-white text-[#1a3520] shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}>{label}</button>
        ))}
      </div>

      {view === 'services' ? <ServicesEditor /> : <PackagesEditor />}
    </div>
  )
}

/* ══════════════════ Services ══════════════════ */

function ServicesEditor() {
  const [rows, setRows]       = useState([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy]       = useState(false)
  const [editing, setEditing] = useState(null)
  const [prices, setPrices]   = useState({})   // inline rate edits

  const load = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase.from('services').select('*').order('name')
    if (error) alert('Could not load services: ' + error.message)
    setRows(data || [])
    setPrices(Object.fromEntries((data || []).map(r => [r.id, paiseToRupees(r.price)])))
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const missingText = useMemo(() => rows.filter(r => !r.short_description && !r.title).length, [rows])

  async function savePrice(row) {
    const rupees = Number(prices[row.id])
    if (!Number.isFinite(rupees) || rupees < 0) { alert('Enter a valid amount.'); return }
    setBusy(true)
    const { error } = await supabase.from('services').update({ price: rupeesToPaise(rupees) }).eq('id', row.id)
    setBusy(false)
    if (error) { alert('Save failed: ' + error.message); return }
    setRows(prev => prev.map(r => r.id === row.id ? { ...r, price: rupeesToPaise(rupees) } : r))
  }

  async function toggle(row, field) {
    const { error } = await supabase.from('services').update({ [field]: !row[field] }).eq('id', row.id)
    if (error) { alert('Update failed: ' + error.message); return }
    setRows(prev => prev.map(r => r.id === row.id ? { ...r, [field]: !r[field] } : r))
  }

  async function fillDefaults() {
    if (!confirm('Fill in the built-in title, description, benefits etc. for services that have none? Prices are not touched.')) return
    setBusy(true)
    let n = 0
    for (const row of rows) {
      if (row.short_description || row.title) continue
      const patch = defaultServicePatch(row.slug)
      if (!patch) continue
      const { error } = await supabase.from('services').update(patch).eq('id', row.id)
      if (!error) n++
    }
    setBusy(false)
    alert(`${n} services filled in.`)
    load()
  }

  async function save(form, isNew) {
    const payload = {
      name:              (form.title || form.name).trim(),
      title:             form.title?.trim() || null,
      type:              form.type,
      category:          form.category?.trim() || null,
      icon:              form.icon || null,
      badge:             form.badge?.trim() || null,
      color:             form.color?.trim() || null,
      price:             rupeesToPaise(form.priceRupees),
      duration_minutes:  Number(form.duration_minutes) || 50,
      duration_label:    form.duration_label?.trim() || null,
      short_description: form.short_description?.trim() || null,
      description:       form.description?.trim() || null,
      benefits:          splitLines(form.benefits),
      what_to_expect:    splitLines(form.what_to_expect),
      sort_order:        form.sort_order === '' ? null : Number(form.sort_order),
      show_on_site:      form.show_on_site,
      is_active:         form.is_active,
    }
    if (isNew) {
      const slug = form.slug.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
      if (!slug) { alert('A URL slug is required.'); return }
      if (rows.some(r => r.slug === slug)) { alert('That slug is already used.'); return }
      payload.slug = slug
    }
    setBusy(true)
    const { error } = isNew
      ? await supabase.from('services').insert(payload)
      : await supabase.from('services').update(payload).eq('id', form.id)
    setBusy(false)
    if (error) { alert('Save failed: ' + error.message); return }
    setEditing(null)
    load()
  }

  async function remove(row) {
    if (!confirm(`Delete "${row.name}"? Past bookings that point to it may stop resolving. Hiding it is usually safer.`)) return
    const { error } = await supabase.from('services').delete().eq('id', row.id)
    if (error) { alert('Delete failed: ' + error.message + '\n\nTip: use Hide instead.'); return }
    load()
  }

  if (loading) return <Skeleton />

  return (
    <>
      <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
        <p className="text-sm font-semibold text-[#1a3520]">
          {rows.filter(r => r.is_active).length} active · {rows.length} total
          {missingText > 0 && <span className="text-amber-600 font-normal"> · {missingText} missing page text</span>}
        </p>
        <div className="flex gap-2">
          {missingText > 0 && <button onClick={fillDefaults} disabled={busy} className={btnGhost + ' px-4 py-2.5 rounded-xl text-sm'}>Fill page text from defaults</button>}
          <button onClick={() => setEditing({ form: { ...EMPTY_SERVICE }, isNew: true })}
            className="px-5 py-2.5 rounded-xl bg-[#1a3520] text-white text-sm font-medium hover:opacity-90">+ Add service</button>
        </div>
      </div>

      <div className="space-y-2">
        {rows.map(row => (
          <div key={row.id} className={`bg-white rounded-2xl border border-gray-100 p-4 ${row.is_active ? '' : 'opacity-55'}`}>
            <div className="flex items-start gap-4 flex-wrap">
              <div className="flex-1 min-w-[200px]">
                <p className="text-sm font-semibold text-[#1a3520]">{row.title || row.name}</p>
                <p className="text-[11px] text-gray-400 font-mono">/book/{row.slug}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  {row.type} · {row.duration_minutes} min{row.category ? ` · ${row.category}` : ''}
                  {row.show_on_site === false && <span className="text-amber-600 font-semibold"> · hidden from /services</span>}
                </p>
              </div>

              {/* Rate — inline */}
              <div className="flex items-end gap-2">
                <div>
                  <label className={labelCls}>Rate (₹)</label>
                  <input type="number" min="0" value={prices[row.id] ?? ''}
                    onChange={e => setPrices(p => ({ ...p, [row.id]: e.target.value }))}
                    onKeyDown={e => { if (e.key === 'Enter') savePrice(row) }}
                    className="w-28 border border-gray-200 rounded-xl px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#1a3520]/20" />
                </div>
                {Number(prices[row.id]) !== paiseToRupees(row.price) && (
                  <button onClick={() => savePrice(row)} disabled={busy}
                    className="bg-[#1a3520] text-white text-xs font-semibold px-4 py-2.5 rounded-xl hover:opacity-90 disabled:opacity-50">Save</button>
                )}
              </div>

              <div className="flex gap-1.5 items-center">
                <button onClick={() => setEditing({ form: toForm(row), isNew: false })}
                  className="text-xs text-[#1a3520] border border-[#1a3520]/30 px-3 py-1.5 rounded-lg hover:bg-[#1a3520] hover:text-white transition-all">Edit</button>
                <button onClick={() => toggle(row, 'is_active')} className={btnGhost}>{row.is_active ? 'Hide' : 'Show'}</button>
                <button onClick={() => remove(row)}
                  className="text-xs text-red-500 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-500 hover:text-white transition-all">Del</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {editing && (
          <Modal title={editing.isNew ? 'New service' : `Edit — ${editing.form.title || editing.form.name}`} onClose={() => setEditing(null)}>
            <ServiceForm value={editing.form} isNew={editing.isNew} busy={busy}
              onChange={form => setEditing(e => ({ ...e, form }))}
              onSave={() => save(editing.form, editing.isNew)} />
          </Modal>
        )}
      </AnimatePresence>
    </>
  )
}

function toForm(row) {
  return {
    ...row,
    title: row.title || row.name || '',
    priceRupees: paiseToRupees(row.price),
    duration_label: row.duration_label || '',
    short_description: row.short_description || '',
    description: row.description || '',
    benefits: joinLines(row.benefits),
    what_to_expect: joinLines(row.what_to_expect),
    category: row.category || '',
    icon: row.icon || 'mind',
    badge: row.badge || '',
    color: row.color || '',
    sort_order: row.sort_order ?? '',
    show_on_site: row.show_on_site !== false,
  }
}
const splitLines = t => String(t || '').split('\n').map(x => x.trim()).filter(Boolean)
const joinLines  = a => (Array.isArray(a) ? a : []).join('\n')

function ServiceForm({ value, onChange, onSave, busy, isNew }) {
  const set = (k, v) => onChange({ ...value, [k]: v })
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>Title (shown on site)</label>
          <input value={value.title} onChange={e => set('title', e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>URL slug</label>
          {isNew ? (
            <input value={value.slug} onChange={e => set('slug', e.target.value)} className={inputCls} placeholder="teen-counselling" />
          ) : (
            <>
              <input value={value.slug} disabled className={inputCls + ' bg-gray-50 text-gray-400'} />
              <p className="text-[10px] text-gray-400 mt-1">Locked — changing it would break existing booking links.</p>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        <div>
          <label className={labelCls}>Rate (₹)</label>
          <input type="number" min="0" value={value.priceRupees} onChange={e => set('priceRupees', e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Minutes</label>
          <input type="number" min="1" value={value.duration_minutes} onChange={e => set('duration_minutes', e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Duration text</label>
          <input value={value.duration_label} onChange={e => set('duration_label', e.target.value)} className={inputCls} placeholder="50 min" />
        </div>
        <div>
          <label className={labelCls}>Booking type</label>
          <select value={value.type} onChange={e => set('type', e.target.value)} className={inputCls}>
            {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        <div>
          <label className={labelCls}>Category</label>
          <input value={value.category} onChange={e => set('category', e.target.value)} className={inputCls} placeholder="Personal" />
        </div>
        <div>
          <label className={labelCls}>Icon</label>
          <select value={value.icon} onChange={e => set('icon', e.target.value)} className={inputCls}>
            {ICONS.map(i => <option key={i} value={i}>{i}</option>)}
          </select>
        </div>
        <div>
          <label className={labelCls}>Badge</label>
          <input value={value.badge} onChange={e => set('badge', e.target.value)} className={inputCls} placeholder="Most Popular" />
        </div>
        <div>
          <label className={labelCls}>Sort order</label>
          <input type="number" value={value.sort_order} onChange={e => set('sort_order', e.target.value)} className={inputCls} placeholder="0" />
        </div>
      </div>

      <div>
        <label className={labelCls}>Short description (card)</label>
        <textarea rows={2} value={value.short_description} onChange={e => set('short_description', e.target.value)} className={`${inputCls} resize-none`} />
      </div>
      <div>
        <label className={labelCls}>Full description (booking page)</label>
        <textarea rows={4} value={value.description} onChange={e => set('description', e.target.value)} className={`${inputCls} resize-none`} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>Benefits — one per line</label>
          <textarea rows={5} value={value.benefits} onChange={e => set('benefits', e.target.value)} className={`${inputCls} resize-none`} />
        </div>
        <div>
          <label className={labelCls}>What to expect — one per line</label>
          <textarea rows={5} value={value.what_to_expect} onChange={e => set('what_to_expect', e.target.value)} className={`${inputCls} resize-none`} />
        </div>
      </div>

      <div>
        <label className={labelCls}>Card gradient (Tailwind classes)</label>
        <input value={value.color} onChange={e => set('color', e.target.value)} className={inputCls} placeholder="from-[#f0f7f2] to-[#e4f0e8]" />
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2.5 text-sm font-semibold text-[#1a3520] cursor-pointer">
          <input type="checkbox" checked={value.is_active} onChange={e => set('is_active', e.target.checked)} className="w-4 h-4 accent-[#1a3520]" />
          Bookable
        </label>
        <label className="flex items-center gap-2.5 text-sm font-semibold text-[#1a3520] cursor-pointer">
          <input type="checkbox" checked={value.show_on_site} onChange={e => set('show_on_site', e.target.checked)} className="w-4 h-4 accent-[#1a3520]" />
          Show on the Services page
        </label>
      </div>

      <button onClick={onSave} disabled={busy || !value.title?.trim()}
        className="w-full bg-[#1a3520] text-white rounded-xl py-3 text-sm font-semibold hover:opacity-90 disabled:opacity-40">
        {busy ? 'Saving…' : 'Save service'}
      </button>
    </div>
  )
}

/* ══════════════════ Yoga / Retreat packages ══════════════════ */

function PackagesEditor() {
  const [rows, setRows]       = useState([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy]       = useState(false)
  const [editing, setEditing] = useState(null)
  const [missing, setMissing] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase.from('service_packages').select('*').order('sort_order')
    setMissing(!!error)
    setRows(data || [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  async function importDefaults() {
    if (!confirm('Import the built-in Yoga & Retreat packages?')) return
    setBusy(true)
    const { error } = await supabase.from('service_packages').insert(defaultPackageRows())
    setBusy(false)
    if (error) { alert('Import failed: ' + error.message); return }
    load()
  }

  async function save(form, isNew) {
    const payload = {
      title:          form.title.trim(),
      excerpt:        form.excerpt?.trim() || null,
      price:          rupeesToPaise(form.priceRupees),
      duration_label: form.duration_label?.trim() || null,
      sessions:       form.sessions === '' ? null : Number(form.sessions),
      sessions_label: form.sessions_label?.trim() || null,
      mode:           form.mode?.trim() || null,
      featured:       !!form.featured,
      sort_order:     form.sort_order === '' ? null : Number(form.sort_order),
      is_active:      form.is_active,
      updated_at:     new Date().toISOString(),
    }
    if (isNew) {
      const slug = form.slug.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
      if (!slug) { alert('A URL slug is required.'); return }
      payload.slug = slug
    }
    setBusy(true)
    const { error } = isNew
      ? await supabase.from('service_packages').insert(payload)
      : await supabase.from('service_packages').update(payload).eq('id', form.id)
    setBusy(false)
    if (error) { alert('Save failed: ' + error.message); return }
    setEditing(null)
    load()
  }

  async function remove(row) {
    if (!confirm(`Delete "${row.title}"?`)) return
    const { error } = await supabase.from('service_packages').delete().eq('id', row.id)
    if (error) { alert('Delete failed: ' + error.message); return }
    load()
  }

  if (loading) return <Skeleton />

  if (missing) return (
    <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
      <p className="text-sm text-gray-500">The <code className="text-[#1a3520]">service_packages</code> table does not exist yet. Run migration 009 in Supabase, then reload this page.</p>
    </div>
  )

  if (rows.length === 0) return (
    <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
      <p className="text-sm text-gray-500 leading-6 max-w-md mx-auto">
        No packages in the database yet, so the Yoga and Retreat pages are showing the built-in defaults. Import them to start editing.
      </p>
      <div className="flex gap-3 justify-center mt-6">
        <button onClick={importDefaults} disabled={busy} className="px-6 py-3 rounded-xl bg-[#1a3520] text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50">
          {busy ? 'Importing…' : 'Import default packages'}
        </button>
        <button onClick={() => setEditing({ form: { ...EMPTY_PACKAGE }, isNew: true })}
          className="px-6 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:border-gray-400">Start from scratch</button>
      </div>
    </div>
  )

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-semibold text-[#1a3520]">{rows.filter(r => r.is_active).length} active packages</p>
        <button onClick={() => setEditing({ form: { ...EMPTY_PACKAGE }, isNew: true })}
          className="px-5 py-2.5 rounded-xl bg-[#1a3520] text-white text-sm font-medium hover:opacity-90">+ Add package</button>
      </div>

      <div className="space-y-2">
        {rows.map(row => (
          <div key={row.id} className={`bg-white rounded-2xl border border-gray-100 p-4 flex items-start gap-4 flex-wrap ${row.is_active ? '' : 'opacity-55'}`}>
            <div className="flex-1 min-w-[200px]">
              <p className="text-sm font-semibold text-[#1a3520]">
                {row.title}
                {row.featured && <span className="ml-2 text-[10px] font-bold text-amber-600 bg-amber-50 rounded px-1.5 py-0.5">FEATURED</span>}
              </p>
              <p className="text-[11px] text-gray-400 font-mono">/yoga/{row.slug}</p>
              <p className="text-[11px] text-gray-400 mt-0.5">{row.mode} · {row.duration_label}{row.sessions_label ? ` · ${row.sessions_label}` : ''}</p>
            </div>
            <p className="text-lg font-bold text-[#1a3520]">₹{paiseToRupees(row.price)}</p>
            <div className="flex gap-1.5">
              <button onClick={() => setEditing({ form: { ...row, priceRupees: paiseToRupees(row.price), sessions: row.sessions ?? '', sort_order: row.sort_order ?? '' }, isNew: false })}
                className="text-xs text-[#1a3520] border border-[#1a3520]/30 px-3 py-1.5 rounded-lg hover:bg-[#1a3520] hover:text-white transition-all">Edit</button>
              <button onClick={() => remove(row)}
                className="text-xs text-red-500 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-500 hover:text-white transition-all">Del</button>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {editing && (
          <Modal title={editing.isNew ? 'New package' : `Edit — ${editing.form.title}`} onClose={() => setEditing(null)}>
            <PackageForm value={editing.form} isNew={editing.isNew} busy={busy}
              onChange={form => setEditing(e => ({ ...e, form }))}
              onSave={() => save(editing.form, editing.isNew)} />
          </Modal>
        )}
      </AnimatePresence>
    </>
  )
}

function PackageForm({ value, onChange, onSave, busy, isNew }) {
  const set = (k, v) => onChange({ ...value, [k]: v })
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>Title</label>
          <input value={value.title} onChange={e => set('title', e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>URL slug</label>
          <input value={value.slug} disabled={!isNew} onChange={e => set('slug', e.target.value)}
            className={inputCls + (isNew ? '' : ' bg-gray-50 text-gray-400')} placeholder="prenatal-yoga" />
        </div>
      </div>
      <div>
        <label className={labelCls}>Excerpt</label>
        <textarea rows={2} value={value.excerpt || ''} onChange={e => set('excerpt', e.target.value)} className={`${inputCls} resize-none`} />
      </div>
      <div className="grid grid-cols-4 gap-3">
        <div>
          <label className={labelCls}>Rate (₹)</label>
          <input type="number" min="0" value={value.priceRupees} onChange={e => set('priceRupees', e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Duration text</label>
          <input value={value.duration_label || ''} onChange={e => set('duration_label', e.target.value)} className={inputCls} placeholder="55 min" />
        </div>
        <div>
          <label className={labelCls}>Sessions</label>
          <input type="number" value={value.sessions} onChange={e => set('sessions', e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Sort order</label>
          <input type="number" value={value.sort_order} onChange={e => set('sort_order', e.target.value)} className={inputCls} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>Sessions label</label>
          <input value={value.sessions_label || ''} onChange={e => set('sessions_label', e.target.value)} className={inputCls} placeholder="20 classes / month" />
        </div>
        <div>
          <label className={labelCls}>Mode</label>
          <input value={value.mode || ''} onChange={e => set('mode', e.target.value)} className={inputCls} placeholder="Group · Online" />
        </div>
      </div>
      <div className="flex gap-6">
        <label className="flex items-center gap-2.5 text-sm font-semibold text-[#1a3520] cursor-pointer">
          <input type="checkbox" checked={!!value.featured} onChange={e => set('featured', e.target.checked)} className="w-4 h-4 accent-[#1a3520]" />
          Featured
        </label>
        <label className="flex items-center gap-2.5 text-sm font-semibold text-[#1a3520] cursor-pointer">
          <input type="checkbox" checked={value.is_active !== false} onChange={e => set('is_active', e.target.checked)} className="w-4 h-4 accent-[#1a3520]" />
          Active
        </label>
      </div>
      <button onClick={onSave} disabled={busy || !value.title?.trim()}
        className="w-full bg-[#1a3520] text-white rounded-xl py-3 text-sm font-semibold hover:opacity-90 disabled:opacity-40">
        {busy ? 'Saving…' : 'Save package'}
      </button>
    </div>
  )
}

/* ══════════════════ shared ══════════════════ */

const Skeleton = () => <div className="space-y-2">{[1, 2, 3].map(i => <div key={i} className="h-20 bg-gray-100 rounded-2xl animate-pulse" />)}</div>

function Modal({ title, children, onClose }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[88vh] flex flex-col overflow-hidden">
        <div className="bg-[#1a3520] px-6 py-4 flex items-center justify-between">
          <h2 className="text-white font-bold text-sm">{title}</h2>
          <button onClick={onClose} className="text-white/50 hover:text-white text-xl leading-none">×</button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
      </motion.div>
    </motion.div>
  )
}
