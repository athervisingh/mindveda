import { useRouter } from 'next/router'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import Link from 'next/link'
import ImagePlaceholder from '../../components/ImagePlaceholder'
import { servicePackages } from '../../lib/siteContent'

export default function PackageDetail() {
  const router = useRouter()
  const { slug } = router.query
  const currentPackage = servicePackages.find((item) => item.slug === slug) || servicePackages[0]

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem('mv_cart') || '[]')
    cart.push({ ...currentPackage })
    localStorage.setItem('mv_cart', JSON.stringify(cart))
    router.push('/cart')
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfaf7]">
      <Header />
      <main className="flex-1">
        <section className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid lg:grid-cols-[0.95fr_1.05fr] gap-10 items-start">
            <ImagePlaceholder width="w-full" height="h-[560px]" label="Package image placeholder" />

            <div className="lg:pt-4">
              <div className="inline-flex rounded-full bg-[#f4edf8] px-3 py-1 text-xs font-medium text-brand">Premium package</div>
              <h1 className="mt-4 text-4xl md:text-5xl font-semibold leading-tight text-[#2d2343]">{currentPackage.title}</h1>
              <p className="mt-4 text-gray-600 leading-8">{currentPackage.excerpt}</p>

              <div className="mt-8 grid grid-cols-2 gap-4 max-w-md">
                <div className="rounded-2xl bg-white p-4 shadow-soft">
                  <div className="text-xs uppercase tracking-[0.2em] text-gray-400">Price</div>
                  <div className="mt-2 text-3xl font-semibold text-brand">₹{currentPackage.price}</div>
                </div>
                <div className="rounded-2xl bg-white p-4 shadow-soft">
                  <div className="text-xs uppercase tracking-[0.2em] text-gray-400">Duration</div>
                  <div className="mt-2 text-2xl font-semibold text-[#2d2343]">{currentPackage.duration}</div>
                </div>
              </div>

              <div className="mt-8 rounded-[28px] bg-white p-6 shadow-soft border border-gray-100">
                <h2 className="text-lg font-semibold text-[#2d2343]">What is included</h2>
                <ul className="mt-4 space-y-3 text-sm text-gray-600">
                  {[
                    'Initial consultation and support plan',
                    'Secure session booking and reminders',
                    'Ongoing support notes and progress tracking',
                    'Easy upgrade to multi-session plans later',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3"><span className="text-brand mt-0.5">✓</span><span>{item}</span></li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                <button onClick={handleAddToCart} className="rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand/20">Add to Cart</button>
                <Link href="/checkout" className="rounded-full border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm">Book Slot</Link>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 pb-20">
          <div className="grid lg:grid-cols-3 gap-6">
            {[
              ['1. Discover', 'Pick the right package based on your needs.'],
              ['2. Reserve', 'Add it to your cart and choose a booking slot.'],
              ['3. Start healing', 'Proceed to payment UI, then join your session.'],
            ].map(([title, desc]) => (
              <div key={title} className="rounded-[28px] bg-white p-6 shadow-soft border border-gray-100">
                <h3 className="text-lg font-semibold text-[#2d2343]">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-gray-600">{desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
