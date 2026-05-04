import Header from '../components/Header'
import Footer from '../components/Footer'
import ImagePlaceholder from '../components/ImagePlaceholder'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#fbfaf7]">
      <Header />
      <main className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-[1fr_0.9fr] gap-10 items-start">
          <div>
            <p className="text-brand text-sm uppercase tracking-[0.24em] font-semibold">Contact</p>
            <h1 className="mt-3 text-4xl md:text-6xl font-semibold leading-tight text-[#2d2343]">Let's make the first step feel easy.</h1>
            <p className="mt-5 text-gray-600 leading-8">Use this section for your contact form or booking inquiry. The visual style stays calm, premium, and clear.</p>
            <div className="mt-8 rounded-[28px] bg-white p-6 shadow-soft space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <input className="rounded-xl border border-gray-200 px-4 py-3" placeholder="Your name" />
                <input className="rounded-xl border border-gray-200 px-4 py-3" placeholder="Email address" />
              </div>
              <input className="w-full rounded-xl border border-gray-200 px-4 py-3" placeholder="Subject" />
              <textarea className="w-full rounded-2xl border border-gray-200 px-4 py-3 min-h-40" placeholder="Tell us what you need" />
              <button className="rounded-full bg-brand px-6 py-3 text-white font-semibold">Send message</button>
            </div>
          </div>
          <ImagePlaceholder width="w-full" height="h-[560px]" label="Contact image placeholder" />
        </div>
      </main>
      <Footer />
    </div>
  )
}
