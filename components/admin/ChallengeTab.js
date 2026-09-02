import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../../lib/supabaseClient'
import { ITEMS, TOTAL_ITEMS } from '../../lib/pf16'

const LETTER = ['a', 'b', 'c']

const STATUS_STYLES = {
  created:   'bg-gray-100 text-gray-500',
  paid:      'bg-amber-100 text-amber-700',
  submitted: 'bg-green-100 text-green-700',
}
const STATUS_OPTIONS = ['created', 'paid', 'submitted']

const CSV_COLUMNS = [
  'created_at', 'full_name', 'email', 'mobile', 'status', 'amount_rupees', 'coupon_code',
  'razorpay_order_id', 'razorpay_payment_id', 'paid_at', 'submitted_at',
  'answered_count', 'duration_seconds',
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

export default function ChallengeTab() {
  const [rows, setRows]       = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch]   = useState('')
  const [status, setStatus]   = useState('all')
  const [selected, setSelected] = useState(null)

  useEffect(() => { fetchRows() }, [])

  async function fetchRows() {
    setLoading(true)
    const { data, error } = await supabase
      .from('pf16_attempts')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) console.error(error)
    setRows(data || [])
    setLoading(false)
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return rows.filter(r => {
      if (status !== 'all' && r.status !== status) return false
      if (!q) return true
      return [r.full_name, r.email, r.mobile, r.razorpay_payment_id, r.razorpay_order_id]
        .some(v => (v || '').toLowerCase().includes(q))
    })
  }, [rows, search, status])

  const paidTotal = useMemo(
    () => rows.filter(r => r.status !== 'created').reduce((s, r) => s + (r.amount || 0), 0),
    [rows]
  )

  async function handleDelete(row) {
    if (!confirm(`Delete the attempt of "${row.full_name}"? This cannot be undone.`)) return
    const { error } = await supabase.from('pf16_attempts').delete().eq('id', row.id)
    if (error) { alert('Delete failed: ' + error.message); return }
    setRows(prev => prev.filter(r => r.id !== row.id))
    setSelected(s => s && s.id === row.id ? null : s)
  }

  function exportCsv() {
    const esc = v => `"${String(v ?? '').replace(/"/g, '""')}"`
    const csv = [
      CSV_COLUMNS.join(','),
      ...filtered.map(r => CSV_COLUMNS.map(c =>
        esc(c === 'amount_rupees' ? Math.round((r.amount || 0) / 100) : r[c])
      ).join(',')),
    ].join('\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }))
    const a = document.createElement('a')
    a.href = url
    a.download = `mind-challenge-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  // Ek attempt ki poori answer sheet CSV me — scoring ke liye kaam aati hai.
  function exportSheet(row) {
    const esc = v => `"${String(v ?? '').replace(/"/g, '""')}"`
    const csv = [
      ['q_no', 'question', 'answer_letter', 'answer_text'].join(','),
      ...ITEMS.map((item, i) => {
        const a = row.answers?.[i]
        const picked = a === 0 || a === 1 || a === 2
        return [i + 1, item[0], picked ? LETTER[a] : '', picked ? item[a + 1] : ''].map(esc).join(',')
      }),
    ].join('\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }))
    const a = document.createElement('a')
    a.href = url
    a.download = `16pf-${row.full_name.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="p-8 max-w-6xl">
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-[#1a3520]">Mind Challenge — 16 PF</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {rows.length} attempts · {rows.filter(r => r.status === 'submitted').length} submitted · ₹{Math.round(paidTotal / 100)} collected
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
          placeholder="Search name, email, payment ID…"
          className="flex-1 min-w-[220px] border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3520]/20" />
        <select value={status} onChange={e => setStatus(e.target.value)}
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
                  {['Name', 'Contact', 'Payment', 'Progress', 'Status', 'Started', 'Actions'].map(h => (
                    <th key={h} className="text-left text-[11px] font-semibold text-gray-400 px-4 py-3 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-16 text-gray-400 text-sm">No attempts yet</td></tr>
                ) : filtered.map(row => (
                  <tr key={row.id} className="border-b border-gray-50 last:border-0 hover:bg-[#f7f5f0] transition-colors">
                    <td className="px-4 py-3 min-w-[150px]">
                      <button onClick={() => setSelected(row)} className="text-sm font-semibold text-[#1a3520] hover:underline text-left">
                        {row.full_name}
                      </button>
                    </td>
                    <td className="px-4 py-3 min-w-[180px]">
                      <p className="text-xs text-gray-600 truncate max-w-[200px]">{row.email}</p>
                      <p className="text-[11px] text-gray-400">{row.mobile || '—'}</p>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <p className="text-sm font-bold text-[#1a3520]">
                        ₹{Math.round((row.amount || 0) / 100)}
                        {row.coupon_code && row.original_amount > row.amount && (
                          <span className="text-[11px] text-gray-400 line-through font-normal ml-1.5">₹{Math.round(row.original_amount / 100)}</span>
                        )}
                      </p>
                      {row.coupon_code && <p className="text-[10px] font-bold text-amber-600 font-mono">{row.coupon_code}</p>}
                      <p className="text-[11px] text-gray-400 font-mono">{row.razorpay_payment_id || '—'}</p>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-sm text-gray-600">
                        {row.answered_count !== null && row.answered_count !== undefined ? `${row.answered_count} / ${TOTAL_ITEMS}` : '—'}
                      </span>
                      <p className="text-[11px] text-gray-400">{fmtDuration(row.duration_seconds)}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[11px] font-semibold px-2.5 py-1.5 rounded-lg ${STATUS_STYLES[row.status] || 'bg-gray-100 text-gray-500'}`}>
                        {row.status}
                      </span>
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

      {/* ── Detail modal — poori answer sheet ── */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={e => { if (e.target === e.currentTarget) setSelected(null) }}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
              <div className="bg-[#1a3520] px-6 py-4 flex items-center justify-between">
                <div>
                  <h2 className="text-white font-bold">{selected.full_name}</h2>
                  <p className="text-white/50 text-xs mt-0.5">
                    16 PF · {selected.status} · ₹{Math.round((selected.amount || 0) / 100)} · {fmtDateTime(selected.created_at)}
                  </p>
                </div>
                <button onClick={() => setSelected(null)} className="text-white/50 hover:text-white text-xl leading-none">×</button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-5">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-5">
                  {[
                    ['Email', selected.email],
                    ['Mobile', selected.mobile],
                    ['Answered', selected.answered_count !== null && selected.answered_count !== undefined ? `${selected.answered_count} / ${TOTAL_ITEMS}` : '—'],
                    ['Time taken', fmtDuration(selected.duration_seconds)],
                    ['Paid at', fmtDateTime(selected.paid_at)],
                    ['Submitted at', fmtDateTime(selected.submitted_at)],
                    ['Coupon used', selected.coupon_code],
                    ['Full price', selected.original_amount ? `₹${Math.round(selected.original_amount / 100)}` : null],
                    ['Order ID', selected.razorpay_order_id],
                    ['Payment ID', selected.razorpay_payment_id],
                    ['Attempt ID', selected.id],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-1">{label}</p>
                      <p className="text-[13px] text-[#1a3520] font-medium break-all">{value || <span className="text-gray-300">—</span>}</p>
                    </div>
                  ))}
                </div>

                {selected.answers?.length ? (
                  <>
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100 mb-2">
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">Answer sheet — {TOTAL_ITEMS} items</p>
                      <button onClick={() => exportSheet(selected)}
                        className="text-xs text-[#1a3520] border border-[#1a3520]/30 px-3 py-1.5 rounded-lg hover:bg-[#1a3520] hover:text-white transition-all">
                        Download sheet CSV
                      </button>
                    </div>
                    <div className="space-y-1.5">
                      {ITEMS.map((item, i) => {
                        const a = selected.answers[i]
                        const picked = a === 0 || a === 1 || a === 2
                        return (
                          <div key={i} className="flex items-start justify-between gap-3 border-b border-gray-50 pb-1.5 last:border-0">
                            <p className="text-[12.5px] text-gray-600 leading-5 flex-1">
                              <span className="font-bold text-[#1a3520]">{i + 1}.</span> {item[0]}
                            </p>
                            <span className={`text-[12px] font-semibold whitespace-nowrap ${picked ? 'text-[#1a3520]' : 'text-gray-300'}`}>
                              {picked ? `${LETTER[a]}) ${item[a + 1]}` : 'Not answered'}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-gray-400 pt-4 border-t border-gray-100">
                    {selected.status === 'paid'
                      ? 'Paid, but the answer sheet has not been submitted yet.'
                      : 'Payment was never completed — no answer sheet.'}
                  </p>
                )}
              </div>

              <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
                {selected.mobile && <a href={`tel:${selected.mobile}`} className="flex-1 text-center border border-gray-200 rounded-xl py-2.5 text-sm text-gray-600 hover:border-gray-400">Call</a>}
                <a href={`mailto:${selected.email}`} className="flex-1 text-center border border-gray-200 rounded-xl py-2.5 text-sm text-gray-600 hover:border-gray-400">Email</a>
                <button onClick={() => setSelected(null)} className="flex-1 bg-[#1a3520] text-white rounded-xl py-2.5 text-sm font-semibold hover:opacity-90">Close</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
