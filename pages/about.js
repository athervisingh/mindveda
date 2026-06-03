import Header from '../components/Header'
import Footer from '../components/Footer'
import ImagePlaceholder from '../components/ImagePlaceholder'
import { NextSeo } from 'next-seo'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#fbfaf7]">
      <NextSeo
        title="About Babita — Best Certified Psychologist in Delhi & Online India"
        description="Meet Babita — certified psychologist & wellness coach with 15+ years experience. Trusted by 1000+ clients across Delhi, Mumbai, Bangalore, Hyderabad & all of India. Online & in-person counselling available."
        canonical="https://www.mindvedabybabita.com/about"
        additionalMetaTags={[
          { name: 'keywords', content: 'best psychologist in delhi, certified psychologist india, babita psychologist, psychologist near me, online therapist india, mental health expert india, wellness coach india, psychologist delhi ncr, psychologist noida, psychologist gurgaon, counsellor near me' },
        ]}
        openGraph={{
          url: 'https://www.mindvedabybabita.com/about',
          title: 'About Babita — Best Certified Psychologist in Delhi & Online India',
          description: 'Certified psychologist & wellness coach. 15+ years experience. 1000+ clients across Delhi, Mumbai, Bangalore & all India.',
        }}
      />
      <Header />
      <main className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-[0.95fr_1.05fr] gap-10 items-center">
          <ImagePlaceholder width="w-full" height="h-[460px]" label="About Babita placeholder" />
          <div>
            <p className="text-brand text-sm uppercase tracking-[0.24em] font-semibold">About</p>
            <h1 className="heading-hover mt-3 text-4xl md:text-6xl font-semibold leading-tight text-[#1a3520]">A healing practice built on calm, clarity, and trust.</h1>
            <p className="mt-5 text-gray-600 leading-8">Babita combines clinical psychology, mindful practices, and real-world experience to create a space that feels supportive, intelligent, and deeply human.</p>
            <div className="mt-8 grid md:grid-cols-3 gap-4">
              {[
                ['15+', 'Years of experience'],
                ['1000+', 'People supported'],
                ['18+', 'Cities and retreats'],
              ].map(([value, label]) => (
                <div key={label} className="rounded-[24px] bg-white p-5 shadow-soft text-center">
                  <div className="bold-hover text-3xl font-semibold text-brand">{value}</div>
                  <div className="mt-2 text-sm text-gray-500">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
