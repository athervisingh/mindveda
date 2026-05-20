import '../styles/globals.css'
import { DefaultSeo } from 'next-seo'
import { AuthProvider } from '../context/AuthContext'

const DEFAULT_SEO = {
  titleTemplate: '%s | MindVeda',
  defaultTitle: 'MindVeda — Healing, Counselling & Wellness in India',
  description: 'MindVeda offers professional counselling, yoga, and spiritual retreats by certified psychologists. 1000+ lives transformed across 18+ cities.',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://www.mindvedabybabita.com',
    siteName: 'MindVeda',
    images: [{ url: 'https://www.mindvedabybabita.com/og-default.jpg', width: 1200, height: 630, alt: 'MindVeda — Healing & Growth' }],
  },
  twitter: { cardType: 'summary_large_image' },
  additionalMetaTags: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
}

export default function App({ Component, pageProps }) {
  return (
    <>
      <DefaultSeo {...DEFAULT_SEO} />
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </>
  )
}
