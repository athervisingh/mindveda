import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../../lib/supabaseClient'

const GROUP_LABEL = { 'under-20': 'Under 20', 'above-20': '20 & above' }
const GROUP_STYLE = { 'under-20': 'bg-amber-100 text-amber-700', 'above-20': 'bg-blue-100 text-blue-700' }

const CSV_COLUMNS = [
  'created_at', 'name', 'email', 'mobile', 'age_group', 'lang',
  'score', 'max_score', 'band_title', 'answered_count', 'total_questions',
  'timed_out', 'duration_seconds',
]

function fmtDateTime(d) {
  if (!d) return '—'
  return new Date(d).toLocaleString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit',
  })
}
function fmtDuration(s) {
  if (!Number.isFinite(s)) return '—'
  return `${Math.floor(s / 60)}m ${String(s % 60).padStart(2, '0')}s`
}

export default function MindCheckTab() {
  const [rows, setRows]       = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch]   = useState('')
  const [group, setGroup]     = useState('all')
  const [selected, setSelected] = useState(null)

  useEffect(() => { fetchRows() }, [])

  async function fetchRows() {
    setLoading(true)
    // Registration se join — jise registration ke baad diya gaya, uska naam mil jata hai.
    const { data, error } = await supabase
      .from('mind_check_results')
      .select('*, registrations(full_name, email, mobile, age)')
      .order('created_at', { ascending: false })
    if (error) console.error(error)
    setRows(data || [])
    setLoading(false)
  }

  const withNames = useMemo(() => rows.map(r => ({
    ...r,
    name:   r.registrations?.full_name || null,
    email:  r.registrations?.email || null,
    mobile: r.registrations?.mobile || null,
  })), [rows])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return withNames.filter(r => {
      if (group !== 'all' && r.age_group !== group) return false
      if (!q) return true
      return [r.name, r.email, r.mobile, r.band_title].some(v => (v || '').toLowerCase().includes(q))
    })
  }, [withNames, search, group])

  async function handleDelete(row) {
    if (!confirm('Delete this test result? This cannot be undone.')) return
    const { error } = await supabase.from('mind_check_results').delete().eq('id', row.id)
    if (error) { alert('Delete failed: ' + error.message); return }
    setRows(prev => prev.filter(r => r.id !== row.id))
    setSelected(s => s && s.id === row.id ? null : s)
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
    a.download = `mind-check-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="p-8 max-w-6xl">
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-[#1a3520]">Mind Check Results</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {rows.length} total · {rows.filter(r => r.age_group === 'under-20').length} under 20 · {rows.filter(r => r.age_group === 'above-20').length} above 20
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchRows} className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:border-gray-400">Refresh</button>
          <button onClick={exportCsv} disabled={filtered.length === 0}
            className="px-5 py-2.5 rounded-xl bg-[#1a3520] text-white text-sm font-medium hover:opacity-90 disabled:opacity-40">Export CSV</button>
        </div>
      </div>

      <div className="flex gap-3 mb-5 flex-wrap">
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search name, email, result…"
          className="flex-1 min-w-[220px] border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3520]/20" />
        <select value={group} onChange={e => setGroup(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1a3520]/20">
          <option value="all">All age groups</option>
          <option value="under-20">Under 20</option>
          <option value="above-20">20 &amp; above</option>
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
                  {['Who', 'Group', 'Score', 'Result', 'Taken', 'Actions'].map(h => (
                    <th key={h} className="text-left text-[11px] font-semibold text-gray-400 px-4 py-3 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-16 text-gray-400 text-sm">No test results yet</td></tr>
                ) : filtered.map(row => (
                  <tr key={row.id} className="border-b border-gray-50 last:border-0 hover:bg-[#f7f5f0] transition-colors">
                    <td className="px-4 py-3 min-w-[180px]">
                      <button onClick={() => setSelected(row)} className="text-sm font-semibold text-[#1a3520] hover:underline text-left">
                        {row.name || 'Anonymous'}
                      </button>
                      {row.email && <p className="text-[11px] text-gray-400 truncate max-w-[200px]">{row.email}</p>}
                      {!row.registration_id && <p className="text-[11px] text-gray-300">no registration linked</p>}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg ${GROUP_STYLE[row.age_group] || 'bg-gray-100 text-gray-500'}`}>
                        {GROUP_LABEL[row.age_group] || row.age_group}
                      </span>
                      <span className="text-[11px] text-gray-400 ml-2 uppercase">{row.lang}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-sm font-bold text-[#1a3520]">{row.score}</span>
                      <span className="text-xs text-gray-400"> / {row.max_score}</span>
                      {row.timed_out && <p className="text-[10px] text-red-500 font-semibold">timed out</p>}
                    </td>
                    <td className="px-4 py-3 min-w-[160px]">
                      <p className="text-xs text-gray-600">{row.band_title || '—'}</p>
                      <p className="text-[11px] text-gray-400">{row.answered_count}/{row.total_questions} answered · {fmtDuration(row.duration_seconds)}</p>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap"><span className="text-xs text-gray-500">{fmtDateTime(row.created_at)}</span></td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => setSelected(row)}
                          className="text-xs text-[#1a3520] border border-[#1a3520]/30 px-3 py-1.5 rounded-lg hover:bg-[#1a3520] hover:text-white transition-all">View</button>
                        <button onClick={() => handleDelete(row)}
                          className="text-xs text-red-500 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-500 hover:text-white transition-all">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Detail modal ── */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={e => { if (e.target === e.currentTarget) setSelected(null) }}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[88vh] flex flex-col overflow-hidden">
              <div className="bg-[#1a3520] px-6 py-4 flex items-center justify-between">
                <div>
                  <h2 className="text-white font-bold">{selected.name || 'Anonymous'}</h2>
                  <p className="text-white/50 text-xs mt-0.5">
                    {GROUP_LABEL[selected.age_group]} · {selected.score}/{selected.max_score} · {fmtDateTime(selected.created_at)}
                  </p>
                </div>
                <button onClick={() => setSelected(null)} className="text-white/50 hover:text-white text-xl leading-none">×</button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-5">
                <div className="grid grid-cols-2 gap-4 mb-5">
                  {[
                    ['Result', selected.band_title],
                    ['Language', selected.lang === 'hi' ? 'Hindi' : 'English'],
                    ['Answered', `${selected.answered_count} / ${selected.total_questions}`],
                    ['Time taken', fmtDuration(selected.duration_seconds)],
                    ['Timed out', selected.timed_out ? 'Yes' : 'No'],
                    ['Email', selected.email],
                    ['Mobile', selected.mobile],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-1">{label}</p>
                      <p className="text-sm text-[#1a3520] font-medium">{value || <span className="text-gray-300">—</span>}</p>
                    </div>
                  ))}
                </div>

                <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-2 pt-3 border-t border-gray-100">Answer sheet</p>
                <div className="space-y-2">
                  {(selected.answers || []).map(a => (
                    <div key={a.q} className="flex items-start justify-between gap-3 border-b border-gray-50 pb-2 last:border-0">
                      <p className="text-[13px] text-gray-600 leading-5 flex-1">
                        <span className="font-bold text-[#1a3520]">{a.q}.</span> {a.question}
                      </p>
                      <span className={`text-[12px] font-semibold whitespace-nowrap ${a.answer ? 'text-[#1a3520]' : 'text-gray-300'}`}>
                        {a.answer || 'Not answered'}{a.score !== null && a.score !== undefined ? ` · ${a.score}` : ''}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
                {selected.mobile && <a href={`tel:${selected.mobile}`} className="flex-1 text-center border border-gray-200 rounded-xl py-2.5 text-sm text-gray-600 hover:border-gray-400">Call</a>}
                {selected.email && <a href={`mailto:${selected.email}`} className="flex-1 text-center border border-gray-200 rounded-xl py-2.5 text-sm text-gray-600 hover:border-gray-400">Email</a>}
                <button onClick={() => setSelected(null)} className="flex-1 bg-[#1a3520] text-white rounded-xl py-2.5 text-sm font-semibold hover:opacity-90">Close</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
