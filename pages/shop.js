import Header from '../components/Header'
import Footer from '../components/Footer'
import Link from 'next/link'
import { NextSeo } from 'next-seo'

export default function ShopPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fbfaf7]">
      <NextSeo title="Shop — Mind Veda" description="Mind Veda's shop is on its way. Wellness products and resources, coming soon." noindex />
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-[#1a3520]/10 flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-[#1a3520]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <p className="text-brand text-xs sm:text-sm uppercase tracking-[0.28em] font-semibold">Shop</p>
          <h1 className="heading-hover mt-3 text-3xl sm:text-4xl font-semibold text-[#1a3520]">Coming Soon</h1>
          <p className="mt-4 text-gray-500 leading-7">
            We're putting together wellness products and resources for you. Check back soon — or reach out on WhatsApp if there's something specific you're looking for.
          </p>
          <Link href="/" className="inline-flex items-center gap-2 mt-8 rounded-full bg-[#1a3520] text-white px-6 py-3 text-sm font-semibold hover:opacity-90 transition-opacity">
            Back to Home
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}
