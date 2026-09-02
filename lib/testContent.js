// Test ka content DB se aata hai (admin panel se editable). Jab tak DB khali hai
// — ya kisi wajah se padha na ja sake — code wali default list use hoti hai,
// taaki site kabhi khali test na dikhaye.

import { TESTS as STATIC_TESTS } from './mindTest'
import { ITEMS as STATIC_ITEMS } from './pf16'

// ── DB row -> wahi shape jo pages already use karte hain ──
export function rowToMindQuestion(row) {
  return {
    id:      row.id,
    scored:  row.scored,
    emoji:   row.emoji || '',
    text:    { en: row.text_en, hi: row.text_hi || row.text_en },
    note:    row.note_en ? { en: row.note_en, hi: row.note_hi || row.note_en } : null,
    options: (Array.isArray(row.options) ? row.options : []).map(o => ({
      emoji: o.emoji || '',
      score: Number(o.score) || 0,
      label: { en: o.en, hi: o.hi || o.en },
    })),
  }
}

export function rowToBand(row) {
  return {
    min:   row.min_score,
    max:   row.max_score,
    emoji: row.emoji || '',
    title: { en: row.title_en, hi: row.title_hi || row.title_en },
    body:  { en: row.body_en || '', hi: row.body_hi || row.body_en || '' },
  }
}

// Max score sawalon se nikalta hai — admin sawal jode/hataye to apne aap badalta hai.
export function computeMaxScore(questions) {
  return questions
    .filter(q => q.scored)
    .reduce((sum, q) => sum + Math.max(0, ...q.options.map(o => o.score)), 0)
}

// ── Ek age group ka poora test ──
export async function fetchMindTest(client, groupId) {
  const fallback = STATIC_TESTS[groupId]
  if (!client || !fallback) return fallback || null

  const [qRes, bRes] = await Promise.all([
    client.from('mind_check_questions').select('*')
      .eq('age_group', groupId).eq('is_active', true).order('position'),
    client.from('mind_check_bands').select('*')
      .eq('age_group', groupId).eq('is_active', true).order('min_score'),
  ])

  const rows = qRes.data || []
  if (qRes.error || rows.length === 0) return fallback   // DB khali ya error -> defaults

  const questions = rows.map(rowToMindQuestion).filter(q => q.options.length > 0)
  if (questions.length === 0) return fallback

  const bands = (bRes.data || []).map(rowToBand)

  return {
    ...fallback,                       // label, title, blurb, emoji wahin se
    id:       groupId,
    questions,
    maxScore: computeMaxScore(questions),
    bands:    bands.length ? bands : fallback.bands,
  }
}

// ── 16 PF items: [text, a, b, c] ──
export async function fetchPf16Items(client) {
  if (!client) return STATIC_ITEMS

  const { data, error } = await client
    .from('pf16_questions').select('*').eq('is_active', true).order('position')

  if (error || !data?.length) return STATIC_ITEMS
  return data.map(r => [r.text, r.option_a, r.option_b, r.option_c])
}

// ── "Import defaults" ke liye insert payloads ──
export function defaultMindRows(groupId) {
  const test = STATIC_TESTS[groupId]
  if (!test) return { questions: [], bands: [] }
  return {
    questions: test.questions.map((q, i) => ({
      age_group: groupId,
      position:  i + 1,
      emoji:     q.emoji || null,
      text_en:   q.text.en,
      text_hi:   q.text.hi,
      note_en:   q.note?.en || null,
      note_hi:   q.note?.hi || null,
      scored:    q.scored,
      options:   q.options.map(o => ({ emoji: o.emoji || '', score: o.score, en: o.label.en, hi: o.label.hi })),
    })),
    bands: test.bands.map(b => ({
      age_group: groupId,
      min_score: b.min,
      max_score: b.max,
      emoji:     b.emoji || null,
      title_en:  b.title.en,
      title_hi:  b.title.hi,
      body_en:   b.body.en,
      body_hi:   b.body.hi,
    })),
  }
}

export function defaultPf16Rows() {
  return STATIC_ITEMS.map((item, i) => ({
    position: i + 1,
    text:     item[0],
    option_a: item[1],
    option_b: item[2],
    option_c: item[3],
  }))
}
