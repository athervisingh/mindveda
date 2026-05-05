import Header from '../../components/Header'
import Footer from '../../components/Footer'
import Link from 'next/link'
import ImagePlaceholder from '../../components/ImagePlaceholder'
import { motion } from 'framer-motion'
import { blogArticles } from '../../lib/siteContent'

export default function BlogIndex() {
  return (
    <div className="min-h-screen bg-[#fbfaf7]">
      <Header />
      <main>
        <section className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
            <div>
              <p className="text-brand text-sm uppercase tracking-[0.24em] font-semibold">Blog</p>
              <h1 className="mt-3 text-4xl md:text-6xl font-semibold leading-tight text-[#1a3520]">Thoughtful articles for healing, clarity, and calm.</h1>
              <p className="mt-5 max-w-2xl text-gray-600 leading-8">Dummy content is in place for now, but the layout is built like a premium editorial section with strong imagery, contrast, and clean reading flow.</p>
            </div>
            <ImagePlaceholder width="w-full" height="h-[380px]" label="Blog hero image placeholder" />
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 pb-20">
          <div className="grid md:grid-cols-3 gap-6">
            {blogArticles.map((article, index) => (
              <motion.article
                key={article.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                viewport={{ once: true }}
                className="overflow-hidden rounded-[28px] bg-white shadow-soft border border-gray-100"
              >
                <ImagePlaceholder width="w-full" height="h-48" label="" />
                <div className="p-6">
                  <div className="inline-flex rounded-full bg-[#edf5ee] px-3 py-1 text-xs font-medium text-brand">{article.category}</div>
                  <h2 className="mt-4 text-xl font-semibold text-[#1a3520]">{article.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-gray-600">{article.excerpt}</p>
                  <div className="mt-5 flex items-center justify-between text-sm text-gray-500">
                    <span>{article.readTime}</span>
                    <Link href={`/blog/${article.slug}`} className="font-medium text-brand">Read article →</Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
