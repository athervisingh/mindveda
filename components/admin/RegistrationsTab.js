import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../../lib/supabaseClient'

const STATUS_STYLES = {
  new:       'bg-amber-100 text-amber-700',
  contacted: 'bg-blue-100 text-blue-700',
  closed:    'bg-gray-100 text-gray-500',
}
const STATUS_OPTIONS = ['new', 'contacted', 'closed']

const DETAIL_FIELDS = [
  ['Age',                   'age'],
  ['Gender',                'gender'],
  ['Mobile No.',            'mobile'],
  ['Email ID',              'email'],
  ['Address',               'address'],
  ['Health Issues',         'health_issues'],
  ['Trauma (unforgettable)', 'trauma'],
  ['Fear 1',                'fear_1'],
  ['Fear 2',                'fear_2'],
  ['Personality',           'personality'],
  ['Good thing about them', 'good_thing'],
  ['Bad thing about them',  'bad_thing'],
]

const CSV_COLUMNS = [
  'created_at', 'full_name', 'age', 'gender', 'mobile', 'email', 'address',
  'health_issues', 'trauma', 'fear_1', 'fear_2', 'personality',
  'good_thing', 'bad_thing', 'status', 'admin_note',
]

function fmtDateTime(d) {
  if (!d) return '—'
  return new Date(d).toLocaleString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit',
  })
}

export default function RegistrationsTab() {
  const [rows, setRows]         = useState([])
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selected, setSelected] = useState(null)
  const [note, setNote]         = useState('')
  const [savingNote, setSavingNote] = useState(false)

  useEffect(() => { fetchRows() }, [])

  async function fetchRows() {
    setLoading(true)
    const { data } = await supabase
      .from('registrations')
      .select('*')
      .order('created_at', { ascending: false })
    setRows(data || [])
    setLoading(false)
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return rows.filter(r => {
      if (filterStatus !== 'all' && r.status !== filterStatus) return false
      if (!q) return true
      return [r.full_name, r.email, r.mobile, r.address].some(v => (v || '').toLowerCase().includes(q))
    })
  }, [rows, search, filterStatus])

  async function updateStatus(row, status) {
    const { error } = await supabase.from('registrations').update({ status }).eq('id', row.id)
    if (error) { alert('Update failed: ' + error.message); return }
    setRows(prev => prev.map(r => r.id === row.id ? { ...r, status } : r))
    setSelected(s => s && s.id === row.id ? { ...s, status } : s)
  }

  async function saveNote() {
    if (!selected) return
    setSavingNote(true)
    const { error } = await supabase.from('registrations').update({ admin_note: note.trim() || null }).eq('id', selected.id)
    setSavingNote(false)
    if (error) { alert('Note save failed: ' + error.message); return }
    setRows(prev => prev.map(r => r.id === selected.id ? { ...r, admin_note: note.trim() || null } : r))
    setSelected(s => ({ ...s, admin_note: note.trim() || null }))
  }

  async function handleDelete(row) {
    if (!confirm(`Delete registration of "${row.full_name}"? This can't be undone.`)) return
    const { error } = await supabase.from('registrations').delete().eq('id', row.id)
    if (error) { alert('Delete failed: ' + error.message); return }
    setRows(prev => prev.filter(r => r.id !== row.id))
    setSelected(s => s && s.id === row.id ? null : s)
  }

  function openDetail(row) {
    setSelected(row)
    setNote(row.admin_note || '')
  }

  function exportCsv() {
    const esc = v => `"${String(v ?? '').replace(/"/g, '""')}"`
    const csv = [
      CSV_COLUMNS.join(','),
      ...filtered.map(r => CSV_COLUMNS.map(c => esc(r[c])).join(',')),
    ].join('\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }))
    const a = document.createElement('a')
    a.href = url
    a.download = `registrations-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="p-8 max-w-6xl">
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-[#1a3520]">Registrations</h1>
          <p className="text-sm text-gray-400 mt-0.5">{rows.length} total · {rows.filter(r => r.status === 'new').length} new</p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchRows} className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:border-gray-400">
            Refresh
          </button>
          <button onClick={exportCsv} disabled={filtered.length === 0}
            className="px-5 py-2.5 rounded-xl bg-[#1a3520] text-white text-sm font-medium hover:opacity-90 disabled:opacity-40">
            Export CSV
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-5 flex-wrap">
        <input
          type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search name, email, mobile…"
          className="flex-1 min-w-[220px] border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3520]/20"
        />
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1a3520]/20">
          <option value="all">All statuses</option>
          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="space-y-2">{[1, 2, 3].map(i => <div key={i} className="h-16 bg-gray-100 rounded-2xl animate-pulse" />)}</div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/70">
                  {['Name', 'Contact', 'Age / Gender', 'Submitted', 'Status', 'Actions'].map(h => (
                    <th key={h} className="text-left text-[11px] font-semibold text-gray-400 px-4 py-3 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-16 text-gray-400 text-sm">No registrations yet</td></tr>
                ) : filtered.map(row => (
                  <tr key={row.id} className="border-b border-gray-50 last:border-0 hover:bg-[#f7f5f0] transition-colors">
                    <td className="px-4 py-3 min-w-[160px]">
                      <button onClick={() => openDetail(row)} className="text-sm font-semibold text-[#1a3520] hover:underline text-left">
                        {row.full_name}
                      </button>
                      {row.personality && <p className="text-[11px] text-gray-400 capitalize">{row.personality}</p>}
                    </td>
                    <td className="px-4 py-3 min-w-[180px]">
                      <p className="text-xs text-gray-600">{row.mobile}</p>
                      <p className="text-[11px] text-gray-400 truncate max-w-[200px]">{row.email}</p>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-sm text-gray-500">{row.age || '—'}{row.gender ? ` · ${row.gender}` : ''}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-xs text-gray-500">{fmtDateTime(row.created_at)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <select value={row.status} onChange={e => updateStatus(row, e.target.value)}
                        className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border-0 cursor-pointer ${STATUS_STYLES[row.status] || 'bg-gray-100 text-gray-500'}`}>
                        {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => openDetail(row)}
                          className="text-xs text-[#1a3520] border border-[#1a3520]/30 px-3 py-1.5 rounded-lg hover:bg-[#1a3520] hover:text-white transition-all whitespace-nowrap">
                          View
                        </button>
                        <button onClick={() => handleDelete(row)}
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

      {/* ── Detail Modal ── */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={e => { if (e.target === e.currentTarget) setSelected(null) }}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[88vh] flex flex-col overflow-hidden">
              <div className="bg-[#1a3520] px-6 py-4 flex items-center justify-between">
                <div>
                  <h2 className="text-white font-bold">{selected.full_name}</h2>
                  <p className="text-white/50 text-xs mt-0.5">Registered {fmtDateTime(selected.created_at)}</p>
                </div>
                <button onClick={() => setSelected(null)} className="text-white/50 hover:text-white text-xl leading-none">×</button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
                {DETAIL_FIELDS.map(([label, key]) => (
                  <div key={key}>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-1">{label}</p>
                    <p className={`text-sm text-[#1a3520] whitespace-pre-wrap ${key === 'personality' ? 'capitalize' : ''}`}>
                      {selected[key] || <span className="text-gray-300">—</span>}
                    </p>
                  </div>
                ))}

                <div className="pt-2 border-t border-gray-100">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-1">Admin Note</p>
                  <textarea rows={3} value={note} onChange={e => setNote(e.target.value)}
                    placeholder="Internal note — follow-up, call summary…"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#1a3520]/20" />
                  <button onClick={saveNote} disabled={savingNote}
                    className="mt-2 text-xs text-[#1a3520] border border-[#1a3520]/30 px-4 py-1.5 rounded-lg hover:bg-[#1a3520] hover:text-white transition-all disabled:opacity-50">
                    {savingNote ? 'Saving…' : 'Save Note'}
                  </button>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
                <a href={`tel:${selected.mobile}`}
                  className="flex-1 text-center border border-gray-200 rounded-xl py-2.5 text-sm text-gray-600 hover:border-gray-400">
                  Call
                </a>
                <a href={`mailto:${selected.email}`}
                  className="flex-1 text-center border border-gray-200 rounded-xl py-2.5 text-sm text-gray-600 hover:border-gray-400">
                  Email
                </a>
                <button onClick={() => setSelected(null)}
                  className="flex-1 bg-[#1a3520] text-white rounded-xl py-2.5 text-sm font-semibold hover:opacity-90">
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
