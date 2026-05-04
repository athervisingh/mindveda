import Header from '../../components/Header'
import Footer from '../../components/Footer'
import Link from 'next/link'
import ImagePlaceholder from '../../components/ImagePlaceholder'
import { motion } from 'framer-motion'
import { resourceGuides } from '../../lib/siteContent'

export default function ResourcesIndex() {
  return (
    <div className="min-h-screen bg-[#fbfaf7]">
      <Header />
      <main>
        <section className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-10 items-center">
            <div>
              <p className="text-brand text-sm uppercase tracking-[0.24em] font-semibold">Resources</p>
              <h1 className="mt-3 text-4xl md:text-6xl font-semibold leading-tight text-[#2d2343]">Guides, worksheets, and calm tools for daily support.</h1>
              <p className="mt-5 max-w-2xl text-gray-600 leading-8">This section is styled like a polished library of resources with dummy data, strong visual hierarchy, and a premium card grid.</p>
            </div>
            <ImagePlaceholder width="w-full" height="h-[380px]" label="Resources hero image placeholder" />
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 pb-20">
          <div className="grid md:grid-cols-3 gap-6">
            {resourceGuides.map((resource, index) => (
              <motion.article
                key={resource.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                viewport={{ once: true }}
                className="rounded-[28px] bg-white border border-gray-100 shadow-soft p-6"
              >
                <div className="inline-flex rounded-full bg-[#f1ebdb] px-3 py-1 text-xs font-medium text-[#8b6f2b]">{resource.type}</div>
                <h2 className="mt-4 text-xl font-semibold text-[#2d2343]">{resource.title}</h2>
                <p className="mt-3 text-sm leading-7 text-gray-600">{resource.description}</p>
                <div className="mt-6 overflow-hidden rounded-2xl">
                  <ImagePlaceholder width="w-full" height="h-40" label="" />
                </div>
                <Link href={`/resources/${resource.slug}`} className="mt-5 inline-flex text-sm font-medium text-brand">Open resource →</Link>
              </motion.article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
