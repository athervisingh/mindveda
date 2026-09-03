// Services aur Yoga/Retreat packages ka data DB se aata hai (admin panel se editable).
// DB me display fields na bharе hon to lib/siteContent.js wali default value use hoti
// hai — isliye seed karne se pehle bhi site poori tarah chalti rehti hai.
//
// DB me price hamesha PAISE me hota hai (Razorpay isi par chalta hai).
// Site par rupees dikhte hain, isliye yahan convert hota hai.

import { allServices as STATIC_SERVICES, servicePackages as STATIC_PACKAGES, serviceOrderSlugs } from './siteContent'

export const paiseToRupees = p => Math.round((Number(p) || 0) / 100)
export const rupeesToPaise = r => Math.round((Number(r) || 0) * 100)

const staticBySlug = Object.fromEntries(STATIC_SERVICES.map(s => [s.slug, s]))
const staticPkgBySlug = Object.fromEntries(STATIC_PACKAGES.map(p => [p.slug, p]))

// DB row -> wahi shape jo pages already use karte hain
export function rowToService(row) {
  const base = staticBySlug[row.slug] || {}
  return {
    id:               row.id,
    slug:             row.slug,
    title:            row.title || row.name || base.title || row.slug,
    icon:             row.icon || base.icon || 'mind',
    category:         row.category || base.category || 'Personal',
    price:            paiseToRupees(row.price),
    duration:         row.duration_label || base.duration || (row.duration_minutes ? `${row.duration_minutes} min` : ''),
    durationMinutes:  row.duration_minutes,
    color:            row.color || base.color || 'from-[#f0f7f2] to-[#e4f0e8]',
    badge:            row.badge || base.badge || null,
    shortDescription: row.short_description || base.shortDescription || '',
    description:      row.description || base.description || '',
    benefits:         Array.isArray(row.benefits) && row.benefits.length ? row.benefits : (base.benefits || []),
    whatToExpect:     Array.isArray(row.what_to_expect) && row.what_to_expect.length ? row.what_to_expect : (base.whatToExpect || []),
  }
}

export function rowToPackage(row) {
  const base = staticPkgBySlug[row.slug] || {}
  return {
    id:            row.id,
    slug:          row.slug,
    title:         row.title || base.title || row.slug,
    excerpt:       row.excerpt || base.excerpt || '',
    price:         paiseToRupees(row.price),
    duration:      row.duration_label || base.duration || '',
    sessions:      row.sessions ?? base.sessions ?? null,
    sessionsLabel: row.sessions_label || base.sessionsLabel || null,
    mode:          row.mode || base.mode || '',
    featured:      row.featured ?? base.featured ?? false,
  }
}

// Purana manual order barkarar rahe jab tak admin sort_order set na kare
const ORDER = Object.fromEntries((serviceOrderSlugs || []).map((s, i) => [s, i]))
const orderOf = s => (s.sort_order ?? ORDER[s.slug] ?? 999)

export async function fetchServices(client) {
  if (!client) return STATIC_SERVICES
  const { data, error } = await client
    .from('services').select('*').eq('is_active', true)
  if (error || !data?.length) return STATIC_SERVICES

  const visible = data.filter(r => r.show_on_site !== false && r.type !== 'chat')
  if (!visible.length) return STATIC_SERVICES

  return visible.sort((a, b) => orderOf(a) - orderOf(b) || (a.slug > b.slug ? 1 : -1)).map(rowToService)
}

export async function fetchServiceBySlug(client, slug) {
  if (!client) return staticBySlug[slug] || null
  const { data, error } = await client
    .from('services').select('*').eq('slug', slug).eq('is_active', true).maybeSingle()
  if (error || !data) return staticBySlug[slug] || null
  return rowToService(data)
}

export async function fetchPackages(client) {
  if (!client) return STATIC_PACKAGES
  const { data, error } = await client
    .from('service_packages').select('*').eq('is_active', true)
  if (error || !data?.length) return STATIC_PACKAGES
  return data
    .sort((a, b) => (a.sort_order ?? 99) - (b.sort_order ?? 99) || (a.slug > b.slug ? 1 : -1))
    .map(rowToPackage)
}

export async function fetchYogaPackages(client) {
  const all = await fetchPackages(client)
  const yoga = all.filter(p => p.slug !== 'retreats')
  return yoga.length ? yoga : all
}

// ── Admin ke "Import defaults" ke liye ──
// services table me rows pehle se hain — inhe sirf display fields se bharna hai.
export function defaultServicePatch(slug) {
  const b = staticBySlug[slug]
  if (!b) return null
  return {
    title:             b.title,
    icon:              b.icon,
    category:          b.category,
    badge:             b.badge || null,
    color:             b.color,
    duration_label:    b.duration,
    short_description: b.shortDescription,
    description:       b.description,
    benefits:          b.benefits || [],
    what_to_expect:    b.whatToExpect || [],
    sort_order:        ORDER[slug] ?? null,
  }
}

export function defaultPackageRows() {
  return STATIC_PACKAGES.map((p, i) => ({
    slug: p.slug, title: p.title, excerpt: p.excerpt,
    price: rupeesToPaise(p.price),
    duration_label: p.duration, sessions: p.sessions, sessions_label: p.sessionsLabel,
    mode: p.mode, featured: !!p.featured, sort_order: i,
  }))
}

export { STATIC_SERVICES, STATIC_PACKAGES }
