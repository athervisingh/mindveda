import { useCallback, useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../../lib/supabaseClient'
import { defaultMindRows, defaultPf16Rows, rowToMindQuestion, computeMaxScore } from '../../lib/testContent'

const VIEWS = [
  { id: 'under-20', label: 'Under 20' },
  { id: 'above-20', label: '20 & above' },
  { id: 'pf16',     label: '16 PF (₹300)' },
]

const inputCls = 'w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3520]/20'
const labelCls = 'block text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-1'
const btnGhost = 'text-xs font-semibold text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg hover:border-gray-400 disabled:opacity-30'

const EMPTY_MIND = {
  emoji: '', text_en: '', text_hi: '', note_en: '', note_hi: '', scored: true,
  options: [{ emoji: '', en: '', hi: '', score: 0 }, { emoji: '', en: '', hi: '', score: 1 }, { emoji: '', en: '', hi: '', score: 2 }],
}
const EMPTY_BAND = { min_score: 0, max_score: 0, emoji: '', title_en: '', title_hi: '', body_en: '', body_hi: '' }
const EMPTY_PF16 = { text: '', option_a: '', option_b: '', option_c: '' }

export default function TestQuestionsTab() {
  const [view, setView] = useState('under-20')
  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1a3520]">Test Questions</h1>
        <p className="text-sm text-gray-400 mt-0.5">Add, edit, reorder or remove the questions each test shows.</p>
      </div>

      <div className="inline-flex bg-gray-100 rounded-xl p-1 mb-6">
        {VIEWS.map(v => (
          <button key={v.id} onClick={() => setView(v.id)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              view === v.id ? 'bg-white text-[#1a3520] shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}>
            {v.label}
          </button>
        ))}
      </div>

      {view === 'pf16' ? <Pf16Editor /> : <MindEditor key={view} groupId={view} />}
    </div>
  )
}

/* ══════════════════ Mind Check (Under 20 / 20+) ══════════════════ */

function MindEditor({ groupId }) {
  const [questions, setQuestions] = useState([])
  const [bands, setBands]     = useState([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy]       = useState(false)
  const [editing, setEditing] = useState(null)   // { row, isNew }
  const [editingBand, setEditingBand] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    const [q, b] = await Promise.all([
      supabase.from('mind_check_questions').select('*').eq('age_group', groupId).order('position'),
      supabase.from('mind_check_bands').select('*').eq('age_group', groupId).order('min_score'),
    ])
    if (q.error) alert('Could not load questions: ' + q.error.message)
    setQuestions(q.data || [])
    setBands(b.data || [])
    setLoading(false)
  }, [groupId])

  useEffect(() => { load() }, [load])

  const maxScore = useMemo(
    () => computeMaxScore(questions.filter(r => r.is_active).map(rowToMindQuestion)),
    [questions]
  )

  // Bands 0..maxScore ko poora cover karte hain ya nahi
  const bandGap = useMemo(() => {
    const active = bands.filter(b => b.is_active)
    if (!active.length) return 'No result bands set — the test cannot show a result.'
    for (let s = 0; s <= maxScore; s++) {
      if (!active.some(b => s >= b.min_score && s <= b.max_score)) {
        return `No band covers a score of ${s}. Scores now go up to ${maxScore}.`
      }
    }
    return null
  }, [bands, maxScore])

  async function importDefaults() {
    if (!confirm('Import the built-in questions and result bands for this group?')) return
    setBusy(true)
    const { questions: qs, bands: bs } = defaultMindRows(groupId)
    const a = await supabase.from('mind_check_questions').insert(qs)
    const b = await supabase.from('mind_check_bands').insert(bs)
    setBusy(false)
    if (a.error || b.error) { alert('Import failed: ' + (a.error || b.error).message); return }
    load()
  }

  async function saveQuestion(row, isNew) {
    setBusy(true)
    const payload = {
      age_group: groupId,
      position:  isNew ? (questions.length ? Math.max(...questions.map(q => q.position)) + 1 : 1) : row.position,
      emoji:     row.emoji || null,
      text_en:   row.text_en.trim(),
      text_hi:   row.text_hi?.trim() || null,
      note_en:   row.note_en?.trim() || null,
      note_hi:   row.note_hi?.trim() || null,
      scored:    row.scored,
      options:   row.options
        .filter(o => o.en?.trim())
        .map(o => ({ emoji: o.emoji || '', en: o.en.trim(), hi: o.hi?.trim() || o.en.trim(), score: Number(o.score) || 0 })),
      updated_at: new Date().toISOString(),
    }
    if (payload.options.length < 2) { setBusy(false); alert('A question needs at least 2 options.'); return }

    const { error } = isNew
      ? await supabase.from('mind_check_questions').insert(payload)
      : await supabase.from('mind_check_questions').update(payload).eq('id', row.id)
    setBusy(false)
    if (error) { alert('Save failed: ' + error.message); return }
    setEditing(null)
    load()
  }

  async function saveBand(row, isNew) {
    setBusy(true)
    const payload = {
      age_group: groupId,
      min_score: Number(row.min_score) || 0,
      max_score: Number(row.max_score) || 0,
      emoji:     row.emoji || null,
      title_en:  row.title_en.trim(),
      title_hi:  row.title_hi?.trim() || null,
      body_en:   row.body_en?.trim() || null,
      body_hi:   row.body_hi?.trim() || null,
    }
    if (payload.min_score > payload.max_score) { setBusy(false); alert('Min score cannot be greater than max score.'); return }
    const { error } = isNew
      ? await supabase.from('mind_check_bands').insert(payload)
      : await supabase.from('mind_check_bands').update(payload).eq('id', row.id)
    setBusy(false)
    if (error) { alert('Save failed: ' + error.message); return }
    setEditingBand(null)
    load()
  }

  async function toggleActive(row) {
    const { error } = await supabase.from('mind_check_questions')
      .update({ is_active: !row.is_active }).eq('id', row.id)
    if (error) { alert('Update failed: ' + error.message); return }
    setQuestions(prev => prev.map(q => q.id === row.id ? { ...q, is_active: !q.is_active } : q))
  }

  async function move(row, dir) {
    const idx   = questions.findIndex(q => q.id === row.id)
    const other = questions[idx + dir]
    if (!other) return
    setBusy(true)
    await Promise.all([
      supabase.from('mind_check_questions').update({ position: other.position }).eq('id', row.id),
      supabase.from('mind_check_questions').update({ position: row.position }).eq('id', other.id),
    ])
    setBusy(false)
    load()
  }

  async function removeQuestion(row) {
    if (!confirm('Delete this question? Past results keep the answers they already recorded.')) return
    const { error } = await supabase.from('mind_check_questions').delete().eq('id', row.id)
    if (error) { alert('Delete failed: ' + error.message); return }
    load()
  }

  async function removeBand(row) {
    if (!confirm(`Delete the band "${row.title_en}"?`)) return
    const { error } = await supabase.from('mind_check_bands').delete().eq('id', row.id)
    if (error) { alert('Delete failed: ' + error.message); return }
    load()
  }

  if (loading) return <div className="space-y-2">{[1, 2, 3].map(i => <div key={i} className="h-16 bg-gray-100 rounded-2xl animate-pulse" />)}</div>

  if (questions.length === 0 && bands.length === 0) {
    return (
      <EmptyState busy={busy} onImport={importDefaults} onAdd={() => setEditing({ row: { ...EMPTY_MIND }, isNew: true })}>
        This group has no questions in the database yet, so the site is showing the built-in default questions.
        Import them to start editing, or add your own from scratch.
      </EmptyState>
    )
  }

  return (
    <>
      <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
        <div>
          <p className="text-sm font-semibold text-[#1a3520]">
            {questions.filter(q => q.is_active).length} active questions · max score {maxScore}
          </p>
          {bandGap && <p className="text-xs font-semibold text-amber-600 mt-1">⚠ {bandGap}</p>}
        </div>
        <button onClick={() => setEditing({ row: { ...EMPTY_MIND }, isNew: true })}
          className="px-5 py-2.5 rounded-xl bg-[#1a3520] text-white text-sm font-medium hover:opacity-90">+ Add question</button>
      </div>

      <div className="space-y-2 mb-10">
        {questions.map((row, i) => (
          <div key={row.id} className={`bg-white rounded-2xl border p-4 ${row.is_active ? 'border-gray-100' : 'border-gray-100 opacity-50'}`}>
            <div className="flex items-start gap-3">
              <span className="text-xs font-bold text-gray-300 mt-1 w-6 flex-shrink-0">{i + 1}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#1a3520] leading-5">
                  {row.emoji} {row.text_en}
                </p>
                {row.text_hi && <p className="text-[12px] text-gray-400 mt-0.5">{row.text_hi}</p>}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {(row.options || []).map((o, j) => (
                    <span key={j} className="text-[11px] text-gray-500 bg-gray-50 border border-gray-100 rounded-lg px-2 py-1">
                      {o.emoji} {o.en} <b className="text-[#1a3520]">· {o.score}</b>
                    </span>
                  ))}
                  {!row.scored && <span className="text-[11px] font-semibold text-amber-600 bg-amber-50 rounded-lg px-2 py-1">not scored</span>}
                </div>
              </div>
              <div className="flex flex-col gap-1.5 flex-shrink-0">
                <div className="flex gap-1">
                  <button onClick={() => move(row, -1)} disabled={i === 0 || busy} className={btnGhost}>↑</button>
                  <button onClick={() => move(row, 1)} disabled={i === questions.length - 1 || busy} className={btnGhost}>↓</button>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => setEditing({ row: toForm(row), isNew: false })}
                    className="text-xs text-[#1a3520] border border-[#1a3520]/30 px-3 py-1.5 rounded-lg hover:bg-[#1a3520] hover:text-white transition-all">Edit</button>
                  <button onClick={() => removeQuestion(row)}
                    className="text-xs text-red-500 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-500 hover:text-white transition-all">Delete</button>
                </div>
                <button onClick={() => toggleActive(row)} className={btnGhost}>{row.is_active ? 'Hide' : 'Show'}</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Result bands ── */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
        <div>
          <h2 className="text-lg font-bold text-[#1a3520]">Result bands</h2>
          <p className="text-xs text-gray-400">Which score range shows which result. Scores run 0 – {maxScore}.</p>
        </div>
        <button onClick={() => setEditingBand({ row: { ...EMPTY_BAND }, isNew: true })}
          className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:border-gray-400">+ Add band</button>
      </div>

      <div className="space-y-2">
        {bands.map(row => (
          <div key={row.id} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-start gap-3">
            <span className="text-xs font-bold text-[#1a3520] bg-[#f7f4eb] rounded-lg px-2.5 py-1.5 flex-shrink-0">{row.min_score}–{row.max_score}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#1a3520]">{row.emoji} {row.title_en}</p>
              {row.title_hi && <p className="text-[12px] text-gray-400">{row.title_hi}</p>}
              {row.body_en && <p className="text-[12px] text-gray-500 mt-1 leading-5">{row.body_en}</p>}
            </div>
            <div className="flex gap-1.5 flex-shrink-0">
              <button onClick={() => setEditingBand({ row: { ...row }, isNew: false })}
                className="text-xs text-[#1a3520] border border-[#1a3520]/30 px-3 py-1.5 rounded-lg hover:bg-[#1a3520] hover:text-white transition-all">Edit</button>
              <button onClick={() => removeBand(row)}
                className="text-xs text-red-500 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-500 hover:text-white transition-all">Delete</button>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {editing && (
          <Modal title={editing.isNew ? 'New question' : 'Edit question'} onClose={() => setEditing(null)}>
            <MindQuestionForm
              value={editing.row} busy={busy}
              onChange={row => setEditing(e => ({ ...e, row }))}
              onSave={() => saveQuestion(editing.row, editing.isNew)}
            />
          </Modal>
        )}
        {editingBand && (
          <Modal title={editingBand.isNew ? 'New band' : 'Edit band'} onClose={() => setEditingBand(null)}>
            <BandForm
              value={editingBand.row} busy={busy} maxScore={maxScore}
              onChange={row => setEditingBand(e => ({ ...e, row }))}
              onSave={() => saveBand(editingBand.row, editingBand.isNew)}
            />
          </Modal>
        )}
      </AnimatePresence>
    </>
  )
}

function toForm(row) {
  return {
    ...row,
    text_hi: row.text_hi || '', note_en: row.note_en || '', note_hi: row.note_hi || '',
    options: (row.options || []).map(o => ({ emoji: o.emoji || '', en: o.en || '', hi: o.hi || '', score: o.score ?? 0 })),
  }
}

function MindQuestionForm({ value, onChange, onSave, busy }) {
  const set = (k, v) => onChange({ ...value, [k]: v })
  const setOpt = (i, k, v) => onChange({ ...value, options: value.options.map((o, j) => j === i ? { ...o, [k]: v } : o) })

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-[70px_1fr] gap-3">
        <div>
          <label className={labelCls}>Emoji</label>
          <input value={value.emoji} onChange={e => set('emoji', e.target.value)} className={inputCls} placeholder="🎯" />
        </div>
        <div>
          <label className={labelCls}>Question — English</label>
          <input value={value.text_en} onChange={e => set('text_en', e.target.value)} className={inputCls} />
        </div>
      </div>
      <div>
        <label className={labelCls}>Question — Hindi</label>
        <input value={value.text_hi} onChange={e => set('text_hi', e.target.value)} className={inputCls} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>Note — English (optional)</label>
          <input value={value.note_en} onChange={e => set('note_en', e.target.value)} className={inputCls} placeholder="Just for fun — not scored." />
        </div>
        <div>
          <label className={labelCls}>Note — Hindi</label>
          <input value={value.note_hi} onChange={e => set('note_hi', e.target.value)} className={inputCls} />
        </div>
      </div>

      <label className="flex items-center gap-2.5 text-sm font-semibold text-[#1a3520] cursor-pointer">
        <input type="checkbox" checked={value.scored} onChange={e => set('scored', e.target.checked)} className="w-4 h-4 accent-[#1a3520]" />
        Count this question in the score
      </label>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className={labelCls + ' mb-0'}>Options</label>
          <button type="button" onClick={() => onChange({ ...value, options: [...value.options, { emoji: '', en: '', hi: '', score: 0 }] })}
            className={btnGhost}>+ Add option</button>
        </div>
        <div className="space-y-2">
          {value.options.map((o, i) => (
            <div key={i} className="grid grid-cols-[54px_1fr_1fr_62px_34px] gap-2 items-center">
              <input value={o.emoji} onChange={e => setOpt(i, 'emoji', e.target.value)} className={inputCls} placeholder="🐢" />
              <input value={o.en} onChange={e => setOpt(i, 'en', e.target.value)} className={inputCls} placeholder="English" />
              <input value={o.hi} onChange={e => setOpt(i, 'hi', e.target.value)} className={inputCls} placeholder="हिंदी" />
              <input type="number" value={o.score} onChange={e => setOpt(i, 'score', e.target.value)} className={inputCls} />
              <button type="button" onClick={() => onChange({ ...value, options: value.options.filter((_, j) => j !== i) })}
                className="text-red-400 hover:text-red-600 text-lg leading-none">×</button>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-gray-400 mt-2">Higher score = more concerning answer. Blank options are dropped on save.</p>
      </div>

      <button onClick={onSave} disabled={busy || !value.text_en?.trim()}
        className="w-full bg-[#1a3520] text-white rounded-xl py-3 text-sm font-semibold hover:opacity-90 disabled:opacity-40">
        {busy ? 'Saving…' : 'Save question'}
      </button>
    </div>
  )
}

function BandForm({ value, onChange, onSave, busy, maxScore }) {
  const set = (k, v) => onChange({ ...value, [k]: v })
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className={labelCls}>Min score</label>
          <input type="number" value={value.min_score} onChange={e => set('min_score', e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Max score (test max: {maxScore})</label>
          <input type="number" value={value.max_score} onChange={e => set('max_score', e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Emoji</label>
          <input value={value.emoji || ''} onChange={e => set('emoji', e.target.value)} className={inputCls} placeholder="🌟" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>Title — English</label>
          <input value={value.title_en} onChange={e => set('title_en', e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Title — Hindi</label>
          <input value={value.title_hi || ''} onChange={e => set('title_hi', e.target.value)} className={inputCls} />
        </div>
      </div>
      <div>
        <label className={labelCls}>Message — English</label>
        <textarea rows={3} value={value.body_en || ''} onChange={e => set('body_en', e.target.value)} className={`${inputCls} resize-none`} />
      </div>
      <div>
        <label className={labelCls}>Message — Hindi</label>
        <textarea rows={3} value={value.body_hi || ''} onChange={e => set('body_hi', e.target.value)} className={`${inputCls} resize-none`} />
      </div>
      <button onClick={onSave} disabled={busy || !value.title_en?.trim()}
        className="w-full bg-[#1a3520] text-white rounded-xl py-3 text-sm font-semibold hover:opacity-90 disabled:opacity-40">
        {busy ? 'Saving…' : 'Save band'}
      </button>
    </div>
  )
}

/* ══════════════════ 16 PF ══════════════════ */

function Pf16Editor() {
  const [rows, setRows]       = useState([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy]       = useState(false)
  const [search, setSearch]   = useState('')
  const [editing, setEditing] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase.from('pf16_questions').select('*').order('position')
    if (error) alert('Could not load questions: ' + error.message)
    setRows(data || [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return rows
    return rows.filter(r => [r.text, r.option_a, r.option_b, r.option_c].some(v => (v || '').toLowerCase().includes(q)))
  }, [rows, search])

  async function importDefaults() {
    if (!confirm('Import all 187 built-in 16 PF questions?')) return
    setBusy(true)
    const all = defaultPf16Rows()
    // 187 rows — chunk me daalte hain taaki request bahut badi na ho.
    for (let i = 0; i < all.length; i += 50) {
      const { error } = await supabase.from('pf16_questions').insert(all.slice(i, i + 50))
      if (error) { setBusy(false); alert('Import failed at row ' + (i + 1) + ': ' + error.message); load(); return }
    }
    setBusy(false)
    load()
  }

  async function save(row, isNew) {
    setBusy(true)
    const payload = {
      position: isNew ? (rows.length ? Math.max(...rows.map(r => r.position)) + 1 : 1) : row.position,
      text:     row.text.trim(),
      option_a: row.option_a.trim(),
      option_b: row.option_b.trim(),
      option_c: row.option_c.trim(),
      updated_at: new Date().toISOString(),
    }
    const { error } = isNew
      ? await supabase.from('pf16_questions').insert(payload)
      : await supabase.from('pf16_questions').update(payload).eq('id', row.id)
    setBusy(false)
    if (error) { alert('Save failed: ' + error.message); return }
    setEditing(null)
    load()
  }

  async function toggleActive(row) {
    const { error } = await supabase.from('pf16_questions').update({ is_active: !row.is_active }).eq('id', row.id)
    if (error) { alert('Update failed: ' + error.message); return }
    setRows(prev => prev.map(r => r.id === row.id ? { ...r, is_active: !r.is_active } : r))
  }

  async function move(row, dir) {
    const idx   = rows.findIndex(r => r.id === row.id)
    const other = rows[idx + dir]
    if (!other) return
    setBusy(true)
    await Promise.all([
      supabase.from('pf16_questions').update({ position: other.position }).eq('id', row.id),
      supabase.from('pf16_questions').update({ position: row.position }).eq('id', other.id),
    ])
    setBusy(false)
    load()
  }

  async function remove(row) {
    if (!confirm(`Delete question ${row.position}? Answer sheets already submitted keep their own copy of the questions.`)) return
    const { error } = await supabase.from('pf16_questions').delete().eq('id', row.id)
    if (error) { alert('Delete failed: ' + error.message); return }
    load()
  }

  if (loading) return <div className="space-y-2">{[1, 2, 3].map(i => <div key={i} className="h-14 bg-gray-100 rounded-2xl animate-pulse" />)}</div>

  if (rows.length === 0) {
    return (
      <EmptyState busy={busy} onImport={importDefaults} onAdd={() => setEditing({ row: { ...EMPTY_PF16 }, isNew: true })}>
        The 16 PF questions are not in the database yet, so the paid test is showing the built-in 187 questions.
        Import them to start editing.
      </EmptyState>
    )
  }

  return (
    <>
      <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
        <p className="text-sm font-semibold text-[#1a3520]">
          {rows.filter(r => r.is_active).length} active questions{rows.length !== rows.filter(r => r.is_active).length ? ` · ${rows.length - rows.filter(r => r.is_active).length} hidden` : ''}
        </p>
        <div className="flex gap-2">
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search questions…"
            className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm w-56 focus:outline-none focus:ring-2 focus:ring-[#1a3520]/20" />
          <button onClick={() => setEditing({ row: { ...EMPTY_PF16 }, isNew: true })}
            className="px-5 py-2.5 rounded-xl bg-[#1a3520] text-white text-sm font-medium hover:opacity-90 whitespace-nowrap">+ Add</button>
        </div>
      </div>

      <div className="space-y-1.5">
        {filtered.map(row => {
          const idx = rows.findIndex(r => r.id === row.id)
          return (
            <div key={row.id} className={`bg-white rounded-xl border border-gray-100 px-4 py-3 flex items-start gap-3 ${row.is_active ? '' : 'opacity-50'}`}>
              <span className="text-xs font-bold text-gray-300 mt-0.5 w-8 flex-shrink-0">{row.position}</span>
              <div className="flex-1 min-w-0">
                <p className="text-[13.5px] font-semibold text-[#1a3520] leading-5">{row.text}</p>
                <p className="text-[12px] text-gray-400 mt-0.5">a) {row.option_a} · b) {row.option_b} · c) {row.option_c}</p>
              </div>
              <div className="flex gap-1 flex-shrink-0">
                <button onClick={() => move(row, -1)} disabled={idx === 0 || busy || !!search} className={btnGhost}>↑</button>
                <button onClick={() => move(row, 1)} disabled={idx === rows.length - 1 || busy || !!search} className={btnGhost}>↓</button>
                <button onClick={() => setEditing({ row: { ...row }, isNew: false })}
                  className="text-xs text-[#1a3520] border border-[#1a3520]/30 px-3 py-1.5 rounded-lg hover:bg-[#1a3520] hover:text-white transition-all">Edit</button>
                <button onClick={() => toggleActive(row)} className={btnGhost}>{row.is_active ? 'Hide' : 'Show'}</button>
                <button onClick={() => remove(row)}
                  className="text-xs text-red-500 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-500 hover:text-white transition-all">Del</button>
              </div>
            </div>
          )
        })}
        {filtered.length === 0 && <p className="text-center py-10 text-sm text-gray-400">No question matches “{search}”.</p>}
      </div>

      {search && <p className="text-[11px] text-gray-400 mt-3">Reordering is disabled while searching — clear the search to move questions.</p>}

      <AnimatePresence>
        {editing && (
          <Modal title={editing.isNew ? 'New question' : `Edit question ${editing.row.position || ''}`} onClose={() => setEditing(null)}>
            <div className="space-y-4">
              <div>
                <label className={labelCls}>Question</label>
                <textarea rows={2} value={editing.row.text} onChange={e => setEditing(s => ({ ...s, row: { ...s.row, text: e.target.value } }))}
                  className={`${inputCls} resize-none`} />
              </div>
              {['a', 'b', 'c'].map(k => (
                <div key={k}>
                  <label className={labelCls}>Option {k}</label>
                  <input value={editing.row[`option_${k}`]} onChange={e => setEditing(s => ({ ...s, row: { ...s.row, [`option_${k}`]: e.target.value } }))}
                    className={inputCls} />
                </div>
              ))}
              <button onClick={() => save(editing.row, editing.isNew)}
                disabled={busy || !editing.row.text?.trim() || !editing.row.option_a?.trim()}
                className="w-full bg-[#1a3520] text-white rounded-xl py-3 text-sm font-semibold hover:opacity-90 disabled:opacity-40">
                {busy ? 'Saving…' : 'Save question'}
              </button>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </>
  )
}

/* ══════════════════ shared ══════════════════ */

function EmptyState({ children, onImport, onAdd, busy }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
      <p className="text-sm text-gray-500 leading-6 max-w-md mx-auto">{children}</p>
      <div className="flex gap-3 justify-center mt-6">
        <button onClick={onImport} disabled={busy}
          className="px-6 py-3 rounded-xl bg-[#1a3520] text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50">
          {busy ? 'Importing…' : 'Import default questions'}
        </button>
        <button onClick={onAdd} className="px-6 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:border-gray-400">
          Start from scratch
        </button>
      </div>
    </div>
  )
}

function Modal({ title, children, onClose }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[88vh] flex flex-col overflow-hidden">
        <div className="bg-[#1a3520] px-6 py-4 flex items-center justify-between">
          <h2 className="text-white font-bold text-sm">{title}</h2>
          <button onClick={onClose} className="text-white/50 hover:text-white text-xl leading-none">×</button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
      </motion.div>
    </motion.div>
  )
}
