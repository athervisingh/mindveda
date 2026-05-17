import Header from '../../components/Header'
import Footer from '../../components/Footer'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { blogArticles } from '../../lib/siteContent'

const categoryColors = {
  Mindfulness:   'bg-emerald-100 text-emerald-700 border-emerald-200',
  Wellness:      'bg-amber-100 text-amber-700 border-amber-200',
  Relationships: 'bg-violet-100 text-violet-700 border-violet-200',
}

const allCategories = ['All', ...Array.from(new Set(blogArticles.map(a => a.category)))]

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
})

export default function BlogIndex() {
  const [active, setActive] = useState('All')
  const [featured, ...rest] = blogArticles
  const filtered = active === 'All' ? rest : rest.filter(a => a.category === active)

  return (
    <div className="min-h-screen bg-[#fbfaf7] flex flex-col">
      <Header />
      <main className="flex-1">

        {/* ── HEADER ── */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-14 md:pt-20 pb-8 md:pb-12">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">

            <div className="max-w-2xl">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2.5 mb-5"
              >
                <span className="w-7 h-px bg-brand" />
                <span className="text-brand text-xs font-bold uppercase tracking-[0.28em]">Mind Veda Journal</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="text-4xl sm:text-5xl md:text-[3.5rem] font-black text-[#1a3520] leading-[1.1] tracking-tight"
              >
                Stories for the{' '}
                <span className="relative inline-block">
                  healing
                  <motion.span
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.7, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    style={{ originX: 0 }}
                    className="absolute bottom-1 left-0 right-0 h-[6px] bg-[#f5a623]/35 rounded-full -z-10"
                  />
                </span>{' '}mind.
              </motion.h1>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="md:text-right max-w-xs"
            >
              <p className="text-gray-500 text-sm leading-7 mb-5">
                Practical insights by Babita Kumari — 12+ years of psychology, social counseling &amp; holistic wellness.
              </p>
              <div className="flex md:justify-end gap-8">
                {[{ val: `${blogArticles.length}+`, label: 'Articles' }, { val: '12+', label: 'Years Exp.' }].map(s => (
                  <div key={s.label}>
                    <div className="text-2xl font-black text-[#1a3520]">{s.val}</div>
                    <div className="text-[10px] text-gray-400 uppercase tracking-widest mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── CATEGORY FILTER ── */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-6 md:py-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap gap-2"
          >
            {allCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all duration-300 ${
                  active === cat
                    ? 'bg-[#1a3520] text-white border-[#1a3520] shadow-sm'
                    : 'bg-white text-gray-500 border-gray-200 hover:border-[#1a3520] hover:text-[#1a3520]'
                }`}
              >
                {cat}
              </button>
            ))}
          </motion.div>
        </section>

        {/* ── FEATURED ── */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-10">
          <motion.div {...fadeUp(0)}>
            <Link
              href={`/blog/${featured.slug}`}
              className="group grid md:grid-cols-2 rounded-[24px] overflow-hidden bg-white shadow-lg hover:shadow-xl transition-shadow duration-500 border border-gray-100"
            >
              {/* image */}
              <div className="relative h-[240px] md:h-[420px] overflow-hidden">
                <Image
                  src={featured.image}
                  alt={featured.title}
                  fill
                  className="object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f5a623] text-white text-[11px] font-bold shadow-md">
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  Featured
                </span>
              </div>

              {/* content */}
              <div className="flex flex-col justify-between p-7 md:p-10">
                <div>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border mb-4 ${categoryColors[featured.category] ?? 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                    {featured.category}
                  </span>
                  <h2 className="text-2xl md:text-3xl font-bold text-[#1a3520] leading-snug group-hover:text-brand transition-colors duration-300 mb-4">
                    {featured.title}
                  </h2>
                  <p className="text-gray-500 text-sm leading-7">{featured.excerpt}</p>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5 text-xs text-gray-400">
                      <div className="w-7 h-7 rounded-full bg-[#edf6ef] flex items-center justify-center text-[#1a3520] font-bold text-[10px] flex-shrink-0">BK</div>
                      <div>
                        <p className="font-semibold text-gray-600">{featured.author}</p>
                        <p>{featured.date} &middot; {featured.readTime}</p>
                      </div>
                    </div>
                    <div className="inline-flex items-center gap-2 bg-[#1a3520] text-white text-xs font-bold px-5 py-2.5 rounded-full group-hover:bg-[#f5a623] transition-colors duration-300">
                      Read
                      <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        </section>

        {/* ── CARDS GRID ── */}
        {filtered.length > 0 && (
          <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-20 md:pb-28">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              {filtered.map((article, i) => {
                const c = categoryColors[article.category] ?? 'bg-gray-100 text-gray-600 border-gray-200'
                return (
                  <motion.div
                    key={article.slug}
                    {...fadeUp((i % 3) * 0.08)}
                    whileHover={{ y: -5, transition: { duration: 0.22 } }}
                    className="group"
                  >
                    <Link href={`/blog/${article.slug}`} className="block h-full">
                      <article className="h-full flex flex-col bg-white rounded-[20px] overflow-hidden border border-gray-100 shadow-sm group-hover:shadow-lg transition-all duration-300">

                        {/* image */}
                        <div className="relative w-full h-48 overflow-hidden flex-shrink-0">
                          <Image
                            src={article.image}
                            alt={article.title}
                            fill
                            className="object-cover group-hover:scale-[1.06] transition-transform duration-500 ease-out"
                          />
                          <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${c}`}>
                            {article.category}
                          </span>
                        </div>

                        {/* content */}
                        <div className="flex flex-col flex-1 p-5">
                          <h2 className="text-[15px] font-bold text-[#1a3520] leading-snug group-hover:text-brand transition-colors line-clamp-2 mb-2">
                            {article.title}
                          </h2>
                          <p className="text-xs text-gray-400 leading-6 line-clamp-2 mb-4 flex-1">{article.excerpt}</p>

                          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                            <div className="flex items-center gap-2 text-[11px] text-gray-400">
                              <div className="w-5 h-5 rounded-full bg-[#edf6ef] flex items-center justify-center text-[#1a3520] font-bold text-[9px] flex-shrink-0">BK</div>
                              <span>{article.date}</span>
                              <span>&middot;</span>
                              <span>{article.readTime}</span>
                            </div>
                            <span className="w-7 h-7 rounded-full bg-gray-50 group-hover:bg-[#1a3520] border border-gray-100 group-hover:border-[#1a3520] flex items-center justify-center transition-colors duration-300 flex-shrink-0">
                              <svg className="w-3 h-3 text-gray-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                              </svg>
                            </span>
                          </div>
                        </div>
                      </article>
                    </Link>
                  </motion.div>
                )
              })}
            </div>

            {filtered.length === 0 && (
              <p className="text-center py-20 text-gray-400 text-sm">No articles in this category yet.</p>
            )}
          </section>
        )}


      </main>
      <Footer />
    </div>
  )
}
