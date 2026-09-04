import { createContext, useCallback, useContext, useEffect, useState } from 'react'
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

function NewsBar({ placement }) {
  const router = useRouter()
  const [items, setItems] = useState([])

  useEffect(() => {
    let alive = true
    loadNews().then(rows => { if (alive) setItems(rows) })
    return () => { alive = false }
  }, [])

  const visible = items.filter(item =>
    (item.placement || 'after_hero') === placement &&
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

/**
 * Page ke andar hero ke turant baad rakho: <NewsMarquee />
 * Jis page me yeh nahi hai wahan "After hero image" wali news
 * NewsProvider automatically page ke top par dikha deta hai.
 */
export default function NewsMarquee({ placement = 'after_hero' }) {
  const slot = useContext(HeroSlotContext)

  useEffect(() => {
    if (!slot || placement !== 'after_hero') return undefined
    return slot.register()
  }, [slot, placement])

  return <NewsBar placement={placement} />
}

// _app me poore app ko wrap karta hai: "Top of page" wali news har route par top par.
export function NewsProvider({ children }) {
  const [heroSlots, setHeroSlots] = useState(0)

  const register = useCallback(() => {
    setHeroSlots(n => n + 1)
    return () => setHeroSlots(n => Math.max(0, n - 1))
  }, [])

  return (
    <HeroSlotContext.Provider value={{ register }}>
      <NewsBar placement="top" />
      {heroSlots === 0 && <NewsBar placement="after_hero" />}
      {children}
    </HeroSlotContext.Provider>
  )
}
