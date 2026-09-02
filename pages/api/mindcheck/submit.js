import { supabaseAdmin } from '../../../lib/supabaseAdmin'
import { bandFor } from '../../../lib/mindTest'
import { fetchMindTest } from '../../../lib/testContent'

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { groupId, lang, answers, timedOut, durationSeconds, registrationId } = req.body || {}

  if (groupId !== 'under-20' && groupId !== 'above-20') {
    return res.status(400).json({ error: 'Unknown age group' })
  }
  // Wahi sawal jo user ko dikhe the — admin ne edit kiye ho to DB wale.
  const test = await fetchMindTest(supabaseAdmin, groupId)
  if (!test) return res.status(400).json({ error: 'Unknown age group' })
  if (!answers || typeof answers !== 'object') return res.status(400).json({ error: 'Answers missing' })

  // Score client par nahi, yahin dobara compute hota hai — jo bheja gaya wo bharosemand nahi.
  let score = 0, answered = 0
  const detail = test.questions.map((q, i) => {
    const pick = answers[q.id]
    const opt  = Number.isInteger(pick) ? q.options[pick] : null
    if (opt) {
      answered++
      if (q.scored) score += opt.score
    }
    return {
      q: i + 1,
      question: q.text.en,
      answer: opt ? opt.label.en : null,
      score: opt && q.scored ? opt.score : null,
    }
  })

  const band = bandFor(test, score)

  const { data, error } = await supabaseAdmin
    .from('mind_check_results')
    .insert({
      registration_id: UUID.test(registrationId || '') ? registrationId : null,
      age_group:       test.id,
      lang:            lang === 'hi' ? 'hi' : 'en',
      score,
      max_score:       test.maxScore,
      band_title:      band?.title?.en || null,
      answers:         detail,
      answered_count:  answered,
      total_questions: test.questions.length,
      timed_out:       !!timedOut,
      duration_seconds: Number.isFinite(durationSeconds) ? Math.round(durationSeconds) : null,
    })
    .select('id')
    .single()

  if (error) {
    console.error('mind check save failed:', error)
    return res.status(500).json({ error: 'Could not save result' })
  }

  res.json({ success: true, id: data.id, score, maxScore: test.maxScore })
}
