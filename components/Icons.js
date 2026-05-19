// Reusable SVG icon components — premium, no emojis

export function CheckIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="2,8 6,12 14,4" />
    </svg>
  )
}

export function ArrowRightIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 8h12M9 3l5 5-5 5" />
    </svg>
  )
}

export function ArrowLeftIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 8H2M7 3L2 8l5 5" />
    </svg>
  )
}

export function CartIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.3 2.3c-.6.6-.2 1.7.7 1.7H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  )
}

export function PhoneIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1A19.5 19.5 0 013.1 10.8 19.8 19.8 0 01.1 2.2 2 2 0 012.1 0h3a2 2 0 012 1.7c.1 1 .4 1.9.7 2.8a2 2 0 01-.45 2.1L6.9 7.1a16 16 0 006 6l.46-.46a2 2 0 012.1-.45c.9.34 1.85.57 2.82.7A2 2 0 0122 16.9z" />
    </svg>
  )
}

export function MailIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M2 7l10 7 10-7" />
    </svg>
  )
}

export function MapPinIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C8.1 2 5 5.1 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.9-3.1-7-7-7z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  )
}

export function CalendarIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="16" height="15" rx="2" />
      <path d="M2 8h16M6 1v4M14 1v4" />
    </svg>
  )
}

export function ClockIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  )
}

export function StarIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l3.1 6.3L22 9.3l-5 4.9 1.2 6.8L12 17.8l-6.2 3.2L7 14.2 2 9.3l6.9-1z" />
    </svg>
  )
}

export function InfoIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <circle cx="10" cy="10" r="8" />
      <path d="M10 7v.01M10 10v5" />
    </svg>
  )
}

export function LotusIcon({ className = 'w-6 h-6' }) {
  return (
    <svg className={className} viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 34C20 34 8 26 8 17C8 12 12 10 16 12.5C16 10 17.5 7.5 20 7.5C22.5 7.5 24 10 24 12.5C28 10 32 12 32 17C32 26 20 34 20 34Z" />
      <path d="M20 34V16" />
      <path d="M13 22C10 20 8 18 8 17" />
      <path d="M27 22C30 20 32 18 32 17" />
    </svg>
  )
}

export function ShieldIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L3 7v5c0 5.5 3.8 10.7 9 12 5.2-1.3 9-6.5 9-12V7z" />
    </svg>
  )
}

export function FacebookIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
    </svg>
  )
}

export function InstagramIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function YoutubeIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.5 6.2a2.8 2.8 0 00-2-2C18.9 4 12 4 12 4s-6.9 0-8.5.2a2.8 2.8 0 00-2 2A29 29 0 001.3 12a29 29 0 00.2 5.8 2.8 2.8 0 002 2C5.1 20 12 20 12 20s6.9 0 8.5-.2a2.8 2.8 0 002-2 29 29 0 00.2-5.8 29 29 0 00-.2-5.8zM9.8 15.2V8.8l5.7 3.2-5.7 3.2z" />
    </svg>
  )
}

export function LinkedInIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2zM4 6a2 2 0 100-4 2 2 0 000 4z" />
    </svg>
  )
}

// ─── Retreat Activity Icons ──────────────────────────────────────────────────
export function RetreatActivityIcon({ type, className = 'w-5 h-5' }) {
  const p = { className, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '1.8', strokeLinecap: 'round', strokeLinejoin: 'round' }

  if (type === 'bell') return (
    <svg {...p}>
      <path d="M6 17h12M10 17v.5a2 2 0 004 0V17M12 4v1"/>
      <path d="M12 5a5 5 0 015 5v5H7v-5a5 5 0 015-5z"/>
    </svg>
  )

  if (type === 'tea') return (
    <svg {...p}>
      <path d="M5 9h14l-1.5 9.5A2 2 0 0115.5 20h-7A2 2 0 016.5 18.5L5 9z"/>
      <path d="M19 12h1a1.5 1.5 0 010 3h-1"/>
      <path d="M9 6c0-1.5 1-2 1.5-3M13.5 6c0-1.5 1-2 1.5-3"/>
    </svg>
  )

  if (type === 'namaste') return (
    <svg {...p}>
      <path d="M12 3c-2 0-3 1.5-3 3.5V15h6V6.5C15 4.5 14 3 12 3z"/>
      <path d="M9 7.5C7 7 5.5 7.5 5 10.5L4.5 15H9"/>
      <path d="M15 7.5c2-.5 3.5 0 4 3l.5 4.5H15"/>
      <path d="M6 15v2.5a6 6 0 0012 0V15"/>
    </svg>
  )

  if (type === 'bowl') return (
    <svg {...p}>
      <path d="M4 11h16M5 11c.3 4.5 3.2 8 7 8s6.7-3.5 7-8"/>
      <path d="M9.5 7.5L11 10M14.5 7.5L13 10M12 6v4"/>
    </svg>
  )

  if (type === 'soundwaves') return (
    <svg {...p}>
      <path d="M11 5L6 9H2v6h4l5 4V5z"/>
      <path d="M15.5 8.5a5 5 0 010 7"/>
      <path d="M19.07 4.93a10 10 0 010 14.14"/>
    </svg>
  )

  if (type === 'moon') return (
    <svg {...p}>
      <path d="M21 12.8A9 9 0 1111.2 3 7 7 0 0021 12.8z"/>
    </svg>
  )

  if (type === 'conch') return (
    <svg {...p}>
      <path d="M6 5c-3 3-3 9 0 13 2.5 3 7 4 11 2"/>
      <path d="M9 9c-1.5 2-1.5 6 0 8"/>
      <path d="M13 10.5c.8 1.2 1 4 0 5.5"/>
      <circle cx="17" cy="17" r="2"/>
    </svg>
  )

  if (type === 'herb') return (
    <svg {...p}>
      <path d="M12 22V10"/>
      <path d="M12 10c0 0 5-2 5-7-5 0-5 7-5 7z"/>
      <path d="M12 16c0 0-4-1-4-5 4 0 4 5 4 5z"/>
    </svg>
  )

  if (type === 'yoga') return (
    <svg {...p}>
      <circle cx="12" cy="4" r="2"/>
      <path d="M6.5 11c1.5-2 3-3 5.5-3s4 1 5.5 3"/>
      <path d="M5 21c1-3 3-5 5-6h4c2 1 4 3 5 6"/>
      <path d="M3 14l5 2M21 14l-5 2"/>
    </svg>
  )

  if (type === 'sun') return (
    <svg {...p}>
      <circle cx="12" cy="12" r="4"/>
      <line x1="12" y1="2" x2="12" y2="5"/>
      <line x1="12" y1="19" x2="12" y2="22"/>
      <line x1="2" y1="12" x2="5" y2="12"/>
      <line x1="19" y1="12" x2="22" y2="12"/>
      <line x1="4.9" y1="4.9" x2="7.1" y2="7.1"/>
      <line x1="16.9" y1="16.9" x2="19.1" y2="19.1"/>
      <line x1="19.1" y1="4.9" x2="16.9" y2="7.1"/>
      <line x1="7.1" y1="16.9" x2="4.9" y2="19.1"/>
    </svg>
  )

  if (type === 'wave') return (
    <svg {...p}>
      <path d="M2 10c2-5 5-5 7 0s5 5 7 0 4-5 6 0"/>
      <path d="M2 17c2-5 5-5 7 0s5 5 7 0 4-5 6 0"/>
    </svg>
  )

  if (type === 'mic') return (
    <svg {...p}>
      <rect x="9" y="2" width="6" height="11" rx="3"/>
      <path d="M5 10a7 7 0 0014 0"/>
      <line x1="12" y1="17" x2="12" y2="22"/>
      <line x1="8" y1="22" x2="16" y2="22"/>
    </svg>
  )

  if (type === 'rest') return (
    <svg {...p}>
      <path d="M21 12.8A9 9 0 1111.2 3 7 7 0 0021 12.8z"/>
      <path d="M14 8h4l-4 4h4"/>
    </svg>
  )

  if (type === 'mind') return (
    <svg {...p}>
      <path d="M9 3a5.5 5.5 0 00-4 9.3V17h14v-4.7A5.5 5.5 0 0015 3c-1 0-2 .4-2.7 1A4 4 0 009 3z"/>
      <path d="M9.3 13.7c1.7-.9 3.7-.9 5.4 0"/>
      <line x1="12" y1="7" x2="12" y2="12"/>
    </svg>
  )

  if (type === 'diya') return (
    <svg {...p}>
      <path d="M6 16.5h12l-1.5 3.5h-9L6 16.5z"/>
      <path d="M7.5 16.5c.5-4 2-5.5 4.5-5.5s4 1.5 4.5 5.5"/>
      <path d="M12 11V9"/>
      <path d="M10.5 9c.5-2.5 1-4 1.5-5 .5 1 1 2.5 1.5 5"/>
    </svg>
  )

  if (type === 'flame') return (
    <svg {...p}>
      <path d="M12 2c0 0-7 8-5 14a7 7 0 0014 0c0-5-3-8-4-10-1 3.5-2 5-5 6z"/>
    </svg>
  )

  if (type === 'chat') return (
    <svg {...p}>
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
    </svg>
  )

  if (type === 'mala') return (
    <svg {...p}>
      <circle cx="12" cy="12" r="7"/>
      <circle cx="12" cy="5" r="1.3" fill="currentColor" stroke="none"/>
      <circle cx="16.9" cy="6.8" r="1.3" fill="currentColor" stroke="none"/>
      <circle cx="19" cy="12" r="1.3" fill="currentColor" stroke="none"/>
      <circle cx="16.9" cy="17.2" r="1.3" fill="currentColor" stroke="none"/>
      <circle cx="12" cy="19" r="1.3" fill="currentColor" stroke="none"/>
      <circle cx="7.1" cy="17.2" r="1.3" fill="currentColor" stroke="none"/>
      <circle cx="5" cy="12" r="1.3" fill="currentColor" stroke="none"/>
      <circle cx="7.1" cy="6.8" r="1.3" fill="currentColor" stroke="none"/>
      <path d="M12 5V2.5M10.5 2.5h3"/>
    </svg>
  )

  if (type === 'notes') return (
    <svg {...p}>
      <rect x="5" y="3" width="14" height="18" rx="2"/>
      <path d="M9 3v2h6V3"/>
      <line x1="9" y1="10" x2="15" y2="10"/>
      <line x1="9" y1="14" x2="15" y2="14"/>
      <line x1="9" y1="18" x2="13" y2="18"/>
    </svg>
  )

  if (type === 'handshake') return (
    <svg {...p}>
      <path d="M3 9l4-2 3 2 4-2 4 2"/>
      <path d="M7 7v9M17 7v9"/>
      <path d="M4 16a1 1 0 001 1h14a1 1 0 001-1v-1H4v1z"/>
    </svg>
  )

  if (type === 'seedling') return (
    <svg {...p}>
      <path d="M12 22V12"/>
      <path d="M12 12c0 0 5-1.5 5-7-5 0-5 7-5 7z"/>
      <path d="M12 16.5c0 0-4.5-1-4.5-5.5 4.5 0 4.5 5.5 4.5 5.5z"/>
    </svg>
  )

  if (type === 'swim') return (
    <svg {...p}>
      <circle cx="12" cy="5" r="2.5"/>
      <path d="M5 20c1.5-2 3-3 4.5-2.5s2.5 2.5 4.5 2.5 3-1 4.5-2.5"/>
      <path d="M7.5 15c1.5-3 3-5.5 4.5-5.5l3 3c-1 2-1.5 4.5-1 7"/>
    </svg>
  )

  if (type === 'temple') return (
    <svg {...p}>
      <path d="M12 2L3 8h18L12 2z"/>
      <line x1="3" y1="8" x2="3" y2="22"/>
      <line x1="21" y1="8" x2="21" y2="22"/>
      <line x1="3" y1="22" x2="21" y2="22"/>
      <line x1="8" y1="8" x2="8" y2="22"/>
      <line x1="16" y1="8" x2="16" y2="22"/>
      <rect x="10" y="14" width="4" height="8"/>
      <line x1="12" y1="2" x2="12" y2="1"/>
    </svg>
  )

  if (type === 'sleep') return (
    <svg {...p}>
      <path d="M2 15h20M2 20h20"/>
      <path d="M5 15v-4a3 3 0 013-3h8a3 3 0 013 3v4"/>
      <rect x="10" y="8" width="4" height="4" rx="1"/>
    </svg>
  )

  if (type === 'pin') return (
    <svg {...p}>
      <path d="M12 2C8.1 2 5 5.1 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.9-3.1-7-7-7z"/>
      <circle cx="12" cy="9" r="2.5"/>
    </svg>
  )

  return null
}

// ─── Service Category Icons — clear, premium, relatable ─────────────────────
export function ServiceCategoryIcon({ type, className = 'w-10 h-10' }) {
  const base = { className, viewBox: '0 0 56 56', fill: 'none', stroke: 'currentColor', strokeLinecap: 'round', strokeLinejoin: 'round' }

  // Individual Counseling — person + peaceful mind / thought cloud
  if (type === 'mind') return (
    <svg {...base} strokeWidth="1.8">
      {/* head */}
      <circle cx="28" cy="14" r="7" />
      {/* body / shoulders */}
      <path d="M14 44c0-7.7 6.3-14 14-14s14 6.3 14 14" />
      {/* small thought dots above head */}
      <circle cx="37" cy="9" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="41" cy="6" r="1.8" fill="currentColor" stroke="none" />
      {/* thought bubble */}
      <path d="M44 4a5 5 0 010 10H40" strokeWidth="1.6" />
      {/* small heart inside thought */}
      <path d="M44 7.5c0 0-1.5-1.5-1.5 0 0 1.5 1.5 2 1.5 2s1.5-.5 1.5-2c0-1.5-1.5 0-1.5 0z" fill="currentColor" stroke="none" />
    </svg>
  )

  // Child Counseling — smiling sun, bright & cheerful
  if (type === 'star') return (
    <svg {...base} strokeWidth="1.8">
      <circle cx="28" cy="28" r="10" />
      {/* sun rays */}
      <line x1="28" y1="8" x2="28" y2="13" />
      <line x1="28" y1="43" x2="28" y2="48" />
      <line x1="8" y1="28" x2="13" y2="28" />
      <line x1="43" y1="28" x2="48" y2="28" />
      <line x1="13.5" y1="13.5" x2="17" y2="17" />
      <line x1="39" y1="39" x2="42.5" y2="42.5" />
      <line x1="42.5" y1="13.5" x2="39" y2="17" />
      <line x1="17" y1="39" x2="13.5" y2="42.5" />
      {/* smile face */}
      <path d="M23 27.5a5 5 0 0010 0" />
      <circle cx="24.5" cy="25" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="31.5" cy="25" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  )

  // Stress Counseling — calm breathing / waves
  if (type === 'wave') return (
    <svg {...base} strokeWidth="1.8">
      {/* three calm waves */}
      <path d="M8 20 Q14 14 20 20 Q26 26 32 20 Q38 14 48 20" />
      <path d="M8 28 Q14 22 20 28 Q26 34 32 28 Q38 22 48 28" />
      <path d="M8 36 Q14 30 20 36 Q26 42 32 36 Q38 30 48 36" />
      {/* breathing circle hint */}
      <circle cx="28" cy="11" r="4" strokeDasharray="3 2" />
    </svg>
  )

  // Career Counseling — compass with clear needle
  if (type === 'compass') return (
    <svg {...base} strokeWidth="1.8">
      <circle cx="28" cy="28" r="18" />
      <circle cx="28" cy="28" r="2.5" fill="currentColor" stroke="none" />
      {/* N S E W markers */}
      <line x1="28" y1="12" x2="28" y2="16" />
      <line x1="28" y1="40" x2="28" y2="44" />
      <line x1="12" y1="28" x2="16" y2="28" />
      <line x1="40" y1="28" x2="44" y2="28" />
      {/* compass needle — north red, south gray */}
      <path d="M28 28L23 19" strokeWidth="2.5" />
      <path d="M28 28L33 37" strokeWidth="1.5" opacity="0.4" />
    </svg>
  )

  // Family Counseling — house with a heart inside
  if (type === 'home') return (
    <svg {...base} strokeWidth="1.8">
      {/* house */}
      <path d="M10 26L28 10l18 16" />
      <path d="M14 26v18h10v-8h8v8h10V26" />
      {/* heart inside */}
      <path d="M28 27c0 0-6-4-6-8a4 4 0 018 0 4 4 0 018 0c0 4-6 8-10 10z" />
    </svg>
  )

  // Sports Counseling — lightning bolt (performance/energy)
  if (type === 'trophy') return (
    <svg {...base} strokeWidth="1.8">
      {/* trophy cup */}
      <path d="M18 8h20v16a10 10 0 01-20 0V8z" />
      {/* handles */}
      <path d="M18 12H12a6 6 0 006 6" />
      <path d="M38 12h6a6 6 0 01-6 6" />
      {/* stem */}
      <line x1="28" y1="34" x2="28" y2="42" />
      {/* base */}
      <path d="M20 42h16" />
      <path d="M16 48h24" strokeWidth="2" />
    </svg>
  )

  // Anxiety Counseling — lotus flower (calm, peace)
  if (type === 'calm') return (
    <svg {...base} strokeWidth="1.8">
      {/* center petal */}
      <path d="M28 42C28 42 20 34 20 26a8 8 0 0116 0c0 8-8 16-8 16z" />
      {/* left petal */}
      <path d="M28 34C28 34 16 32 14 24a8 8 0 0114 2" />
      {/* right petal */}
      <path d="M28 34C28 34 40 32 42 24a8 8 0 00-14 2" />
      {/* far left petal */}
      <path d="M22 30C22 30 10 26 10 18a6 6 0 0112 4" />
      {/* far right petal */}
      <path d="M34 30C34 30 46 26 46 18a6 6 0 00-12 4" />
      {/* stem */}
      <path d="M28 42v6" />
      {/* water line */}
      <path d="M20 48h16" />
    </svg>
  )

  // Parental Counseling — adult + child hands / protective embrace
  if (type === 'heart') return (
    <svg {...base} strokeWidth="1.8">
      {/* large adult figure */}
      <circle cx="22" cy="13" r="5" />
      <path d="M11 38c0-6 5-11 11-11" />
      {/* small child figure */}
      <circle cx="36" cy="16" r="3.5" />
      <path d="M29 38c0-4.5 3.1-8 7-8" />
      {/* connecting / protective arm */}
      <path d="M22 24c4 0 7 1.5 7 5" strokeDasharray="none" />
      {/* heart above */}
      <path d="M28 8c0 0-4-3-4 0 0 4 4 6 4 6s4-2 4-6c0-3-4 0-4 0z" fill="currentColor" stroke="none" opacity="0.7" />
    </svg>
  )

  // Depression Counseling — plant/leaf growing from ground (hope, growth)
  if (type === 'leaf') return (
    <svg {...base} strokeWidth="1.8">
      {/* ground line */}
      <line x1="12" y1="44" x2="44" y2="44" />
      {/* stem */}
      <path d="M28 44V22" />
      {/* main leaf */}
      <path d="M28 22C28 22 44 18 44 8C44 8 28 10 28 22Z" />
      {/* second leaf opposite */}
      <path d="M28 30C28 30 14 26 12 16C12 16 26 18 28 30Z" />
      {/* small new growth at top */}
      <path d="M28 22C28 22 28 16 32 13" />
    </svg>
  )

  // Educational Counseling — open book with light/knowledge
  if (type === 'book') return (
    <svg {...base} strokeWidth="1.8">
      {/* open book left page */}
      <path d="M28 40V16C28 16 22 14 12 16v24c10-2 16 0 16 0z" />
      {/* open book right page */}
      <path d="M28 40V16c0 0 6-2 16 0v24c-10-2-16 0-16 0z" />
      {/* lines on left page */}
      <line x1="17" y1="22" x2="25" y2="21" />
      <line x1="17" y1="27" x2="25" y2="26" />
      <line x1="17" y1="32" x2="25" y2="31" />
      {/* lines on right page */}
      <line x1="31" y1="21" x2="39" y2="22" />
      <line x1="31" y1="26" x2="39" y2="27" />
      <line x1="31" y1="31" x2="39" y2="32" />
      {/* light bulb above center */}
      <circle cx="28" cy="9" r="4" />
      <path d="M26 13v2h4v-2" />
    </svg>
  )

  // Parent-Child Counseling — two people with a connecting bridge/bond
  if (type === 'bond') return (
    <svg {...base} strokeWidth="1.8">
      {/* adult figure left */}
      <circle cx="17" cy="14" r="5.5" />
      <path d="M7 42c0-6.6 4.5-12 10-12" />
      {/* child figure right */}
      <circle cx="39" cy="17" r="4" />
      <path d="M49 42c0-5.5-4-10-10-10" />
      {/* connecting hands / arc between them */}
      <path d="M17 30c4 4 12 4 22 0" strokeWidth="2" />
      {/* heart at center top */}
      <path d="M28 10c0 0-3-2.5-3 0s3 5 3 5 3-2.5 3-5-3 0-3 0z" fill="currentColor" stroke="none" />
    </svg>
  )

  // Couples Counseling — two hearts interlinked
  if (type === 'couple') return (
    <svg {...base} strokeWidth="1.8">
      {/* left heart */}
      <path d="M22 32c0 0-12-8-12-17a7 7 0 0114 0" />
      {/* right heart */}
      <path d="M34 32c0 0 12-8 12-17a7 7 0 00-14 0" />
      {/* shared bottom — they meet */}
      <path d="M22 32c2 3 4 5 6 6 2-1 4-3 6-6" />
      {/* joining point */}
      <circle cx="28" cy="16" r="2.5" fill="currentColor" stroke="none" />
      {/* ring symbols */}
      <circle cx="17" cy="44" r="4" />
      <circle cx="39" cy="44" r="4" />
      <path d="M21 44h14" />
    </svg>
  )

  // Group Sessions — three people together
  if (type === 'group') return (
    <svg {...base} strokeWidth="1.8">
      {/* center person */}
      <circle cx="28" cy="14" r="5.5" />
      <path d="M18 42c0-6 4.5-10 10-10s10 4 10 10" />
      {/* left person */}
      <circle cx="13" cy="18" r="4" />
      <path d="M5 42c0-5 3.6-8 8-8" />
      {/* right person */}
      <circle cx="43" cy="18" r="4" />
      <path d="M51 42c0-5-3.6-8-8-8" />
    </svg>
  )

  // Default lotus (for packages, generic)
  return (
    <svg {...base} strokeWidth="1.8">
      <path d="M28 42C28 42 16 34 16 24a12 12 0 0124 0c0 10-12 18-12 18z" />
      <path d="M28 30C28 30 14 28 12 18a10 10 0 0116 6" />
      <path d="M28 30C28 30 42 28 44 18a10 10 0 00-16 6" />
      <path d="M28 42v6" />
      <path d="M20 48h16" />
    </svg>
  )
}
