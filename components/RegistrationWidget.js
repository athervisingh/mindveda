import { useRouter } from 'next/router'

// ChatWidget ke bilkul upar baithta hai — label hamesha visible, hover ki zaroorat nahi.
const HIDDEN_PATHS = ['/chat', '/admin', '/login', '/signup', '/registration']

export default function RegistrationWidget() {
  const router = useRouter()

  if (HIDDEN_PATHS.some(p => router.pathname.startsWith(p))) return null

  return (
    <button
      onClick={() => router.push('/registration')}
      aria-label="Fill the registration form"
      title="Registration Form"
      className="group fixed bottom-[84px] right-4 sm:bottom-[92px] sm:right-6 z-[9996] inline-flex items-center gap-2 h-12 sm:h-14 pl-3.5 pr-4 sm:pl-4 sm:pr-5 rounded-full bg-[#f5a623] text-[#1a3520] shadow-xl hover:scale-105 active:scale-95 transition-transform"
    >
      {/* Pulse ring — dhyan kheenchne ke liye */}
      <span className="absolute inset-0 rounded-full bg-[#f5a623] opacity-60 animate-ping pointer-events-none" style={{ animationDuration: '2.4s' }} />

      <svg className="relative w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 4H7a2 2 0 00-2 2v13a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2h-2" />
        <rect x="9" y="2.5" width="6" height="3.5" rx="1" />
        <path d="M8.5 11h7M8.5 14.5h7M8.5 18h4" />
      </svg>

      <span className="relative text-left leading-tight">
        <span className="block text-[12px] sm:text-[13px] font-extrabold whitespace-nowrap">Registration Form</span>
        <span className="hidden sm:block text-[10px] font-semibold text-[#1a3520]/70 whitespace-nowrap">Fill in 2 minutes</span>
      </span>
    </button>
  )
}
