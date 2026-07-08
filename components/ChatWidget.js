import { useRouter } from 'next/router'

const HIDDEN_PATHS = ['/chat', '/admin', '/login', '/signup']

export default function ChatWidget() {
  const router = useRouter()

  if (HIDDEN_PATHS.some(p => router.pathname.startsWith(p))) return null

  return (
    <button
      onClick={() => router.push('/chat')}
      aria-label="Chat with Veda — free"
      className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-[9997] w-14 h-14 rounded-full bg-[#1a3520] text-white shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
      <span className="absolute -top-1 -right-1 bg-[#f5a623] text-[#1a3520] text-[9px] font-bold px-1.5 py-0.5 rounded-full leading-none">FREE</span>
    </button>
  )
}
