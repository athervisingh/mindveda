// News marquee ki placement helpers — admin panel (NewsTab) aur site dono use karte hain.

export const ALL_ROUTES = '*'

// Admin dropdown ke liye site ke main routes. "Custom" option se koi bhi path likha ja sakta hai.
export const NEWS_ROUTE_OPTIONS = [
  { value: ALL_ROUTES, label: 'All pages (har route)' },
  { value: '/', label: 'Home — /' },
  { value: '/about', label: 'About — /about' },
  { value: '/services', label: 'Services — /services' },
  { value: '/packages', label: 'Packages — /packages' },
  { value: '/expert', label: 'Expert — /expert' },
  { value: '/retreat', label: 'Retreat — /retreat' },
  { value: '/challenge', label: 'Challenge — /challenge' },
  { value: '/contact', label: 'Contact — /contact' },
  { value: '/shop', label: 'Shop — /shop' },
  { value: '/shop/*', label: 'Shop + product pages — /shop/*' },
  { value: '/blog', label: 'Blog — /blog' },
  { value: '/blog/*', label: 'Blog + articles — /blog/*' },
  { value: '/resources', label: 'Resources — /resources' },
  { value: '/resources/*', label: 'Resources + articles — /resources/*' },
  { value: '/yoga/*', label: 'Yoga pages — /yoga/*' },
  { value: '/book/*', label: 'Booking pages — /book/*' },
  { value: '/quick-book', label: 'Quick Book — /quick-book' },
  { value: '/registration', label: 'Registration — /registration' },
  { value: '/dashboard', label: 'Dashboard — /dashboard' },
  { value: '/cart', label: 'Cart — /cart' },
  { value: '/checkout', label: 'Checkout — /checkout' },
]

function cleanPath(value) {
  const base = (value || '').split('?')[0].split('#')[0]
  return base.length > 1 ? base.replace(/\/+$/, '') : base
}

// pattern: '*' (sab pages), '/retreat' (exact), ya '/blog/*' (prefix).
// pathname = Next ka route pattern (/blog/[slug]), asPath = actual URL (/blog/anxiety-tips).
export function matchesRoute(pattern, pathname, asPath) {
  const raw = (pattern || ALL_ROUTES).trim()
  if (!raw || raw === ALL_ROUTES) return true

  const candidates = [cleanPath(asPath), cleanPath(pathname)]
  const p = cleanPath(raw)

  if (p.endsWith('/*')) {
    const prefix = p.slice(0, -2) || '/'
    return candidates.some(c => c === prefix || c.startsWith(prefix === '/' ? '/' : prefix + '/'))
  }
  return candidates.includes(p)
}
