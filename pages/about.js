import Header from '../components/Header'
import Footer from '../components/Footer'
import ImagePlaceholder from '../components/ImagePlaceholder'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#fbfaf7]">
      <Header />
      <main className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-[0.95fr_1.05fr] gap-10 items-center">
          <ImagePlaceholder width="w-full" height="h-[460px]" label="About Babita placeholder" />
          <div>
            <p className="text-brand text-sm uppercase tracking-[0.24em] font-semibold">About</p>
            <h1 className="mt-3 text-4xl md:text-6xl font-semibold leading-tight text-[#1a3520]">A healing practice built on calm, clarity, and trust.</h1>
            <p className="mt-5 text-gray-600 leading-8">Babita combines clinical psychology, mindful practices, and real-world experience to create a space that feels supportive, intelligent, and deeply human.</p>
            <div className="mt-8 grid md:grid-cols-3 gap-4">
              {[
                ['15+', 'Years of experience'],
                ['1000+', 'People supported'],
                ['18+', 'Cities and retreats'],
              ].map(([value, label]) => (
                <div key={label} className="rounded-[24px] bg-white p-5 shadow-soft text-center">
                  <div className="text-3xl font-semibold text-brand">{value}</div>
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
