import Header from '../../components/Header'
import Footer from '../../components/Footer'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRightIcon } from '../../components/Icons'
import { blogArticles } from '../../lib/siteContent'

const categoryColors = {
  Mindfulness: 'bg-[#edf6ef] text-[#2d4f3a]',
  Wellness:    'bg-[#fdf6e8] text-[#7a5c14]',
  Relationships: 'bg-[#f0edf8] text-[#4a3a7a]',
}

export default function BlogIndex() {
  const [featured, ...rest] = blogArticles

  return (
    <div className="min-h-screen bg-[#fbfaf7]">
      <Header />
      <main>

        {/* ── PAGE HEADER ── */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 md:pt-16 pb-6 md:pb-10">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <p className="text-brand text-xs sm:text-sm uppercase tracking-[0.24em] font-semibold">From our blog</p>
            <h1 className="mt-2 md:mt-3 text-3xl sm:text-4xl md:text-5xl font-semibold text-[#1a3520] leading-tight max-w-2xl">
              Articles for healing, clarity & calm.
            </h1>
            <p className="mt-3 md:mt-4 text-gray-500 text-sm md:text-base max-w-xl leading-7">
              Written by Babita Kumari — practical insights from 12+ years of psychology, social counseling, and holistic wellness.
            </p>
          </motion.div>
        </section>

        {/* ── FEATURED ARTICLE ── */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-10 md:pb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
          >
            <Link href={`/blog/${featured.slug}`} className="group block">
              <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-0 rounded-[20px] sm:rounded-[24px] md:rounded-[32px] overflow-hidden bg-white border border-gray-100 shadow-soft hover:shadow-xl transition-shadow duration-300">
                {/* Image */}
                <div className="relative w-full h-[200px] sm:h-[280px] lg:h-full lg:min-h-[340px]">
                  <Image
                    src={featured.image}
                    alt={featured.title}
                    fill
                    className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-black/10" />
                  <span className="absolute top-3 left-3 sm:top-4 sm:left-4 px-2.5 py-1 rounded-full text-xs font-semibold bg-white/90 text-[#2d4f3a]">
                    Featured
                  </span>
                </div>
                {/* Content */}
                <div className="flex flex-col justify-center p-5 sm:p-6 md:p-8 lg:p-10">
                  <span className={`inline-flex self-start px-3 py-1 rounded-full text-xs font-semibold ${categoryColors[featured.category] ?? 'bg-gray-100 text-gray-600'}`}>
                    {featured.category}
                  </span>
                  <h2 className="mt-3 sm:mt-4 text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-[#1a3520] leading-snug group-hover:text-brand transition-colors">
                    {featured.title}
                  </h2>
                  <p className="mt-2 sm:mt-3 text-gray-500 text-sm leading-7 line-clamp-2 sm:line-clamp-none">{featured.excerpt}</p>
                  <div className="mt-3 sm:mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-400">
                    <span>{featured.author}</span>
                    <span>·</span>
                    <span>{featured.date}</span>
                    <span>·</span>
                    <span>{featured.readTime}</span>
                  </div>
                  <div className="mt-4 sm:mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand group-hover:gap-3 transition-all">
                    Read article <ArrowRightIcon className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        </section>

        {/* ── ARTICLE GRID ── */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16 md:pb-24">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
            {rest.map((article, index) => (
              <motion.div
                key={article.slug}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                viewport={{ once: true }}
                className="h-full"
              >
                <Link href={`/blog/${article.slug}`} className="group block h-full">
                  <article className="h-full flex flex-col overflow-hidden rounded-[18px] sm:rounded-[20px] md:rounded-[28px] bg-white border border-gray-100 shadow-soft hover:shadow-xl transition-shadow duration-300">
                    {/* Image */}
                    <div className="relative w-full h-44 sm:h-48 overflow-hidden flex-shrink-0">
                      <Image
                        src={article.image}
                        alt={article.title}
                        fill
                        className="object-cover group-hover:scale-[1.04] transition-transform duration-500"
                      />
                    </div>
                    {/* Content */}
                    <div className="flex flex-col flex-1 p-4 sm:p-5 md:p-6">
                      <span className={`inline-flex self-start px-2.5 py-0.5 rounded-full text-xs font-semibold ${categoryColors[article.category] ?? 'bg-gray-100 text-gray-600'}`}>
                        {article.category}
                      </span>
                      <h2 className="mt-2.5 text-sm sm:text-base md:text-lg font-semibold text-[#1a3520] leading-snug group-hover:text-brand transition-colors flex-1">
                        {article.title}
                      </h2>
                      <p className="mt-2 text-xs sm:text-sm text-gray-500 leading-6 line-clamp-2">{article.excerpt}</p>
                      <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                        <div className="text-[11px] sm:text-xs text-gray-400 flex items-center gap-1.5 min-w-0">
                          <span className="truncate">{article.date}</span>
                          <span>·</span>
                          <span className="whitespace-nowrap">{article.readTime}</span>
                        </div>
                        <span className="text-xs font-semibold text-brand inline-flex items-center gap-1 group-hover:gap-2 transition-all flex-shrink-0">
                          Read <ArrowRightIcon className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="bg-gradient-to-br from-[#1a3520] to-[#2d4f3a] py-14 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto px-4 sm:px-6 text-center"
          >
            <p className="text-white/60 text-xs uppercase tracking-widest font-semibold mb-3">Ready to take a step?</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white leading-snug">
              Reading is a start. Healing is a journey.
            </h2>
            <p className="mt-4 text-white/70 text-sm md:text-base leading-7 max-w-xl mx-auto">
              If something in these articles resonated with you, Babita is here to guide you deeper — through counseling, yoga, or a healing retreat.
            </p>
            <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }} className="mt-8 inline-block">
              <Link
                href="/services"
                className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-[#1a3520] shadow-lg hover:shadow-xl transition-shadow"
              >
                Explore Services <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </motion.div>
          </motion.div>
        </section>

      </main>
      <Footer />
    </div>
  )
}
