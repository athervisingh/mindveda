import Header from '../../components/Header'
import Footer from '../../components/Footer'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { blogArticles } from '../../lib/siteContent'

const categoryColors = {
  Mindfulness:   'bg-emerald-100 text-emerald-800',
  Wellness:      'bg-amber-100 text-amber-800',
  Relationships: 'bg-violet-100 text-violet-800',
}

const allCategories = ['All', ...Array.from(new Set(blogArticles.map(a => a.category)))]

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 36 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] },
})

export default function BlogIndex() {
  const [active, setActive] = useState('All')
  const [featured, ...rest] = blogArticles
  const filtered = active === 'All' ? rest : rest.filter(a => a.category === active)

  return (
    <div className="min-h-screen bg-[#fbfaf7]">
      <Header />
      <main>

        {/* ══════════ HEADER ══════════ */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-14 md:pt-20 pb-10 md:pb-14">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">

            <div className="max-w-2xl">
              <motion.div
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-3 mb-5"
              >
                <span className="w-8 h-px bg-[#1a3520]" />
                <span className="text-[#1a3520] text-xs font-bold uppercase tracking-[0.3em]">Mind Veda Journal</span>
              </motion.div>

              <div className="overflow-hidden">
                <motion.h1
                  initial={{ y: 80, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="text-[clamp(2.8rem,7vw,5.5rem)] font-black text-[#1a3520] leading-[1.05] tracking-tight"
                >
                  Stories for the<br />
                  <span className="relative inline-block">
                    healing
                    <motion.span
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                      style={{ originX: 0 }}
                      className="absolute bottom-1 left-0 right-0 h-[6px] bg-[#f5a623]/40 rounded-full -z-10"
                    />
                  </span>{' '}mind.
                </motion.h1>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="md:text-right max-w-xs"
            >
              <p className="text-gray-500 text-sm leading-7 mb-5">
                Practical insights by Babita Kumari — 12+ years of psychology, social counseling &amp; holistic wellness.
              </p>
              <div className="flex md:justify-end gap-6">
                {[{ val: `${blogArticles.length}+`, label: 'Articles' }, { val: '12+', label: 'Years Exp.' }].map(s => (
                  <div key={s.label} className="text-center">
                    <div className="text-2xl font-black text-[#1a3520]">{s.val}</div>
                    <div className="text-[10px] text-gray-400 uppercase tracking-widest mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* category pills */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.55 }}
            className="mt-8 flex flex-wrap gap-2"
          >
            {allCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all duration-300 ${
                  active === cat
                    ? 'bg-[#1a3520] text-white border-[#1a3520] shadow-md'
                    : 'bg-white text-gray-500 border-gray-200 hover:border-[#1a3520] hover:text-[#1a3520]'
                }`}
              >
                {cat}
              </button>
            ))}
          </motion.div>
        </section>

        {/* ══════════ FEATURED ══════════ */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-8">
          <motion.div {...fadeUp(0)}>
            <Link href={`/blog/${featured.slug}`} className="group grid md:grid-cols-[1fr_1fr] rounded-[28px] md:rounded-[36px] overflow-hidden bg-white shadow-xl hover:shadow-2xl transition-shadow duration-500 border border-gray-100">
              {/* image */}
              <div className="relative h-[240px] md:h-[440px] overflow-hidden">
                <Image
                  src={featured.image}
                  alt={featured.title}
                  fill
                  className="object-cover group-hover:scale-[1.05] transition-transform duration-700 ease-out"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/10 md:bg-none" />
                <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f5a623] text-white text-[11px] font-bold shadow-lg">
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  Featured
                </span>
              </div>

              {/* content */}
              <div className="flex flex-col justify-between p-7 md:p-10 lg:p-12">
                <div>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-4 ${categoryColors[featured.category] ?? 'bg-gray-100 text-gray-600'}`}>
                    {featured.category}
                  </span>
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-[#1a3520] leading-tight group-hover:text-brand transition-colors duration-300">
                    {featured.title}
                  </h2>
                  <p className="mt-4 text-gray-500 text-sm leading-7">{featured.excerpt}</p>
                </div>

                <div className="mt-8">
                  <div className="flex items-center gap-3 text-xs text-gray-400 mb-5">
                    <div className="w-7 h-7 rounded-full bg-[#edf6ef] flex items-center justify-center text-[#1a3520] font-bold text-[10px] flex-shrink-0">BK</div>
                    <span>{featured.author}</span>
                    <span>·</span>
                    <span>{featured.date}</span>
                    <span>·</span>
                    <span>{featured.readTime}</span>
                  </div>
                  <div className="inline-flex items-center gap-2 bg-[#1a3520] text-white text-sm font-bold px-6 py-3 rounded-full group-hover:bg-[#f5a623] transition-colors duration-300">
                    Read Article
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        </section>

        {/* ══════════ CARDS GRID ══════════ */}
        {filtered.length > 0 && (
          <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-24 md:pb-32">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              {filtered.map((article, i) => {
                const c = categoryColors[article.category] ?? 'bg-gray-100 text-gray-600'
                return (
                  <motion.div
                    key={article.slug}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.6, delay: (i % 3) * 0.1, ease: [0.22, 1, 0.36, 1] }}
                    whileHover={{ y: -6, transition: { duration: 0.25 } }}
                    className="group"
                  >
                    <Link href={`/blog/${article.slug}`} className="block h-full">
                      <article className="h-full flex flex-col bg-white rounded-[20px] md:rounded-[24px] overflow-hidden border border-gray-100/80 shadow-soft group-hover:shadow-xl transition-all duration-300">

                        {/* image */}
                        <div className="relative w-full h-48 overflow-hidden flex-shrink-0">
                          <Image
                            src={article.image}
                            alt={article.title}
                            fill
                            className="object-cover group-hover:scale-[1.07] transition-transform duration-600 ease-out"
                          />
                          <div className="absolute inset-0 bg-[#1a3520]/0 group-hover:bg-[#1a3520]/10 transition-colors duration-400" />
                          <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-bold ${c}`}>
                            {article.category}
                          </span>
                        </div>

                        {/* content */}
                        <div className="flex flex-col flex-1 p-5">
                          <h2 className="text-[15px] sm:text-base font-bold text-[#1a3520] leading-snug group-hover:text-brand transition-colors line-clamp-2 flex-1 mb-3">
                            {article.title}
                          </h2>
                          <p className="text-sm text-gray-500 leading-6 line-clamp-2 mb-4">{article.excerpt}</p>

                          <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100">
                            <div className="flex items-center gap-2 text-[11px] text-gray-400">
                              <div className="w-5 h-5 rounded-full bg-[#edf6ef] flex items-center justify-center text-[#1a3520] font-bold text-[9px] flex-shrink-0">BK</div>
                              <span>{article.date}</span>
                              <span>·</span>
                              <span>{article.readTime}</span>
                            </div>
                            <span className="w-7 h-7 rounded-full bg-[#f5f5f5] group-hover:bg-[#1a3520] flex items-center justify-center transition-colors duration-300 flex-shrink-0">
                              <svg className="w-3.5 h-3.5 text-gray-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
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

        {/* ══════════ CTA ══════════ */}
        <section className="mx-4 sm:mx-6 mb-16 md:mb-24 rounded-[28px] md:rounded-[36px] overflow-hidden">
          <div className="relative bg-[#1a3520] py-16 md:py-24 px-6">
            <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "url('/blog1.webp')", backgroundSize: 'cover', backgroundPosition: 'center' }} />
            <div className="absolute top-0 right-0 w-72 h-72 bg-[#f5a623]/15 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-56 h-56 bg-white/5 rounded-full blur-[60px] pointer-events-none" />

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65 }}
              viewport={{ once: true }}
              className="relative max-w-2xl mx-auto text-center"
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-[#f5a623] text-xs font-bold uppercase tracking-widest mb-6">
                Ready to begin?
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight mb-4">
                Reading is the first step.<br />
                <span className="text-[#f5a623]">Let's take the next one.</span>
              </h2>
              <p className="text-white/55 text-sm md:text-base leading-7 max-w-md mx-auto mb-8">
                Babita is here to guide you deeper — through counseling, yoga, or a healing retreat.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
                  <Link href="/services" className="inline-flex items-center gap-2 rounded-full bg-[#f5a623] text-white px-7 py-3.5 text-sm font-bold shadow-xl hover:shadow-2xl transition-shadow">
                    Explore Services
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
                  <Link href="/contact" className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 text-white px-7 py-3.5 text-sm font-bold hover:bg-white/20 transition-colors">
                    Contact Babita
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  )
}
