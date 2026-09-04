import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabaseClient'
import { matchesRoute } from '../lib/newsPlacements'

// ── Ek hi fetch, chahe marquee kitni jagah mount ho ──
let newsCache = null
let inflight = null

function loadNews() {
  if (newsCache) return Promise.resolve(newsCache)
  if (!supabase) return Promise.resolve([])
  if (!inflight) {
    inflight = supabase
      .from('news_items')
      .select('*')
      .eq('is_active', true)
      .order('sort_order')
      .then(({ data }) => { newsCache = data || []; inflight = null; return newsCache })
      .catch(() => { inflight = null; return [] })
  }
  return inflight
}

// Page ne apna "after hero" slot mount kiya hai ya nahi — iske hisaab se _app fallback decide karta hai.
const HeroSlotContext = createContext(null)

function NewsBar({ placements }) {
  const router = useRouter()
  const [items, setItems] = useState([])

  useEffect(() => {
    let alive = true
    loadNews().then(rows => { if (alive) setItems(rows) })
    return () => { alive = false }
  }, [])

  const visible = items.filter(item =>
    placements.includes(item.placement || 'after_hero') &&
    matchesRoute(item.route, router.pathname, router.asPath)
  )

  if (visible.length === 0) return null

  return (
    <div className="bg-white border-b border-[#e0d9c4] overflow-hidden" style={{ height: '34px', display: 'flex', alignItems: 'center' }}>
      <style>{`@keyframes mv-news-marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}`}</style>
      <div style={{ display: 'flex', width: 'max-content', animation: 'mv-news-marquee 42s linear infinite', willChange: 'transform' }}>
        {[0, 1].map(copy => (
          <div key={copy} style={{ display: 'flex', alignItems: 'center' }}>
            {Array.from({ length: 3 }).flatMap((_, i) =>
              visible.map((item, j) => {
                const key = `${copy}-${i}-${item.id}-${j}`
                const inner = (
                  <>
                    <span style={{ background: '#1a3520', color: '#f5a623', fontWeight: 800, fontSize: '10.5px', letterSpacing: '0.14em', padding: '3px 9px', borderRadius: '4px' }}>NEWS</span>
                    <span style={{ color: '#3d3d2a', fontSize: '12.5px', fontWeight: 500, fontFamily: 'Lato, sans-serif', letterSpacing: '0.01em' }}>
                      {item.headline}
                    </span>
                    <span style={{ color: '#c9b97a', fontSize: '11px' }}>✦</span>
                  </>
                )
                return item.link ? (
                  <Link key={key} href={item.link} style={{ display: 'inline-flex', alignItems: 'center', gap: '14px', whiteSpace: 'nowrap', paddingRight: '52px' }}>
                    {inner}
                  </Link>
                ) : (
                  <span key={key} style={{ display: 'inline-flex', alignItems: 'center', gap: '14px', whiteSpace: 'nowrap', paddingRight: '52px' }}>
                    {inner}
                  </span>
                )
              })
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

const PLACEMENT_SETS = {
  top: ['top'],
  after_hero: ['after_hero'],
  all: ['top', 'after_hero'],
}

/**
 * Page ke andar hero ke turant baad rakho: <NewsMarquee />
 * placement="all" (home) dono tarah ki news yahin dikha deta hai.
 */
export default function NewsMarquee({ placement = 'after_hero' }) {
  const register = useContext(HeroSlotContext)?.register
  const isHeroSlot = placement === 'after_hero' || placement === 'all'

  // register stable hai (useCallback []), isliye yeh effect sirf mount/unmount par chalta hai.
  useEffect(() => {
    if (!register || !isHeroSlot) return undefined
    return register()
  }, [register, isHeroSlot])

  return <NewsBar placements={PLACEMENT_SETS[placement] || PLACEMENT_SETS.after_hero} />
}

/**
 * Header ke andar, navbar ke bilkul neeche render hota hai.
 * Home par kuch nahi dikhata — wahan news hero image ke baad aati hai.
 * Jis page me hero slot nahi hai wahan "after hero" wali news bhi yahin aa jati hai.
 */
export function HeaderNewsBar() {
  const { pathname } = useRouter()
  const slot = useContext(HeroSlotContext)

  if (pathname === '/') return null

  const placements = slot && slot.heroSlots > 0 ? PLACEMENT_SETS.top : PLACEMENT_SETS.all
  return <NewsBar placements={placements} />
}

// _app me poore app ko wrap karta hai — batata hai ki page ka apna hero slot hai ya nahi.
export function NewsProvider({ children }) {
  const [heroSlots, setHeroSlots] = useState(0)

  const register = useCallback(() => {
    setHeroSlots(n => n + 1)
    return () => setHeroSlots(n => Math.max(0, n - 1))
  }, [])

  const value = useMemo(() => ({ heroSlots, register }), [heroSlots, register])

  return (
    <HeroSlotContext.Provider value={value}>
      {children}
    </HeroSlotContext.Provider>
  )
}
