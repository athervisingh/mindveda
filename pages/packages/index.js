import Header from '../../components/Header'
import Footer from '../../components/Footer'
import PackageCard from '../../components/PackageCard'
import Link from 'next/link'
import ImagePlaceholder from '../../components/ImagePlaceholder'
import { motion } from 'framer-motion'
import { servicePackages } from '../../lib/siteContent'

export default function Packages() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fbfaf7]">
      <Header />
      <main className="flex-1">
        <section className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid lg:grid-cols-[1fr_0.95fr] gap-10 items-center">
            <div>
              <p className="text-brand text-sm uppercase tracking-[0.24em] font-semibold">Packages</p>
              <h1 className="mt-3 text-4xl md:text-6xl font-semibold leading-tight text-[#2d2343]">
                Choose a healing package that feels personal and premium.
              </h1>
              <p className="mt-5 max-w-2xl text-gray-600 leading-8">
                Users can browse package cards like e-commerce products, add them to cart, and continue to booking.
              </p>
              <div className="mt-7 flex gap-4">
                <Link href="/cart" className="rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand/20">
                  View cart
                </Link>
                <Link href="/checkout" className="rounded-full border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm">
                  Checkout
                </Link>
              </div>
            </div>
            <ImagePlaceholder width="w-full" height="h-[360px]" label="Package hero image placeholder" />
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 pb-16">
          <div className="grid md:grid-cols-2 gap-6">
            {servicePackages.map((pkg, index) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                viewport={{ once: true }}
              >
                <PackageCard pkg={pkg} />
              </motion.div>
            ))}
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 pb-20">
          <div className="grid lg:grid-cols-3 gap-6">
            {[
              ['Easy to compare', 'Clean product-style browsing for every package.'],
              ['Add to cart flow', 'Users can save a package before booking.'],
              ['Payment-ready UI', 'Razorpay can be added later without redesigning the flow.'],
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
