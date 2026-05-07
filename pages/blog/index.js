import Header from '../../components/Header'
import { ArrowRightIcon } from '../../components/Icons'
import Footer from '../../components/Footer'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { blogArticles } from '../../lib/siteContent'

export default function BlogIndex() {
  return (
    <div className="min-h-screen bg-[#fbfaf7]">
      <Header />
      <main>
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-16">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 md:gap-10 items-center">
            <div>
              <p className="text-brand text-sm uppercase tracking-[0.24em] font-semibold">Blog</p>
              <h1 className="mt-3 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight text-[#1a3520]">
                Thoughtful articles for healing, clarity, and calm.
              </h1>
              <p className="mt-4 md:mt-5 max-w-2xl text-gray-600 leading-7 md:leading-8 text-sm md:text-base">
                Dummy content is in place for now, but the layout is built like a premium editorial section with strong imagery, contrast, and clean reading flow.
              </p>
            </div>
            <div className="relative w-full h-[220px] sm:h-[300px] md:h-[380px] rounded-[20px] md:rounded-[28px] overflow-hidden">
              <Image src={blogArticles[0].image} alt={blogArticles[0].title} fill className="object-cover" />
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16 md:pb-20">
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5 md:gap-6">
            {blogArticles.map((article, index) => (
              <motion.article
                key={article.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                viewport={{ once: true }}
                className="group overflow-hidden rounded-[20px] md:rounded-[28px] bg-white shadow-soft border border-gray-100 hover:shadow-xl transition-shadow"
              >
                <div className="relative w-full h-44 md:h-48">
                  <Image src={article.image} alt={article.title} fill className="object-cover" />
                </div>
                <div className="p-4 md:p-6">
                  <div className="inline-flex rounded-full bg-[#edf5ee] px-3 py-1 text-xs font-medium text-brand">{article.category}</div>
                  <h2 className="mt-3 md:mt-4 text-base md:text-xl font-semibold text-[#1a3520] group-hover:text-brand transition-colors">{article.title}</h2>
                  <p className="mt-2 md:mt-3 text-sm leading-6 md:leading-7 text-gray-600">{article.excerpt}</p>
                  <div className="mt-4 md:mt-5 flex items-center justify-between text-sm text-gray-500">
                    <span>{article.readTime}</span>
                    <Link href={`/blog/${article.slug}`} className="font-medium text-brand inline-flex items-center gap-1">
                      Read article <ArrowRightIcon className="w-3.5 h-3.5" />
                    </Link>
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
