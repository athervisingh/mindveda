import { useRouter } from 'next/router'

// ChatWidget ke bilkul upar baithta hai — wahi circle shape, sirf colour alag (gold).
const HIDDEN_PATHS = ['/chat', '/admin', '/login', '/signup', '/registration', '/test']

export default function RegistrationWidget() {
  const router = useRouter()

  if (HIDDEN_PATHS.some(p => router.pathname.startsWith(p))) return null

  return (
    <button
      onClick={() => router.push('/registration')}
      aria-label="Fill the registration form"
      title="Registration Form"
      className="group fixed bottom-[88px] right-5 sm:bottom-[92px] sm:right-6 z-[9996] w-14 h-14 rounded-full bg-[#f5a623] text-[#1a3520] shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
    >
      {/* Pulse ring — dhyan kheenchne ke liye */}
      <span className="absolute inset-0 rounded-full bg-[#f5a623] opacity-60 animate-ping pointer-events-none" style={{ animationDuration: '2.4s' }} />

      <svg className="relative w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 4H7a2 2 0 00-2 2v13a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2h-2" />
        <rect x="9" y="2.5" width="6" height="3.5" rx="1" />
        <path d="M8.5 11h7M8.5 14.5h7M8.5 18h4" />
      </svg>

      {/* Hover pe naam — circle saaf rehta hai, par pata chalta hai kya hai */}
      <span className="absolute right-full mr-3 whitespace-nowrap rounded-full bg-[#1a3520] text-white text-[11px] font-bold px-3 py-1.5 opacity-0 translate-x-1 pointer-events-none shadow-lg transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0">
        Registration Form
      </span>
    </button>
  )
}
