import Header from '../../components/Header'
import Footer from '../../components/Footer'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowLeftIcon, ArrowRightIcon } from '../../components/Icons'
import { blogArticles } from '../../lib/siteContent'

const categoryColors = {
  Mindfulness:   'bg-[#edf6ef] text-[#2d4f3a]',
  Wellness:      'bg-[#fdf6e8] text-[#7a5c14]',
  Relationships: 'bg-[#f0edf8] text-[#4a3a7a]',
}

export default function BlogArticlePage({ article, related }) {
  return (
    <div className="min-h-screen bg-[#fbfaf7]">
      <Header />
      <main>

        {/* ── HERO ── */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 md:pt-12 pb-0">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            {/* Back */}
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-brand hover:text-brand-light transition-colors mb-5 sm:mb-6"
            >
              <ArrowLeftIcon className="w-3.5 h-3.5" /> Back to blog
            </Link>

            {/* Category + meta */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${categoryColors[article.category] ?? 'bg-gray-100 text-gray-600'}`}>
                {article.category}
              </span>
              <span className="text-xs text-gray-400">{article.date}</span>
              <span className="text-xs text-gray-300">·</span>
              <span className="text-xs text-gray-400">{article.readTime}</span>
            </div>

            {/* Title */}
            <h1 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-semibold text-[#1a3520] leading-tight">
              {article.title}
            </h1>
            <p className="mt-2.5 sm:mt-3 md:mt-4 text-gray-500 text-sm md:text-base leading-7">
              {article.excerpt}
            </p>

            {/* Author */}
            <div className="mt-4 sm:mt-5 md:mt-6 flex items-center gap-3">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#edf6ef] flex items-center justify-center text-brand font-bold text-sm flex-shrink-0">
                B
              </div>
              <div>
                <p className="text-sm font-semibold text-[#1a3520]">{article.author}</p>
                <p className="text-[11px] sm:text-xs text-gray-400">Counseling Psychologist · Yoga & Wellness Expert</p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ── HERO IMAGE ── */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 mt-6 sm:mt-8 md:mt-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="overflow-hidden rounded-[16px] sm:rounded-[20px] md:rounded-[32px] shadow-xl"
          >
            <div className="relative w-full h-[200px] sm:h-[280px] md:h-[420px]">
              <Image
                src={article.image}
                alt={article.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </motion.div>
        </section>

        {/* ── ARTICLE BODY ── */}
        <section className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-10 md:py-14">
          {article.content.map((section, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: i * 0.05 }}
              viewport={{ once: true }}
              className="mb-7 sm:mb-8 md:mb-10"
            >
              <h2 className="text-base sm:text-lg md:text-xl font-semibold text-[#1a3520] mb-2.5 sm:mb-3 md:mb-4">
                {section.heading}
              </h2>
              {section.paragraphs.map((para, j) => (
                <p key={j} className="text-gray-600 text-sm md:text-base leading-7 sm:leading-8 mb-3 sm:mb-4 last:mb-0">
                  {para}
                </p>
              ))}

              {/* Pull quote after 3rd section */}
              {i === 2 && (
                <motion.blockquote
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                  className="my-6 sm:my-8 md:my-10 pl-4 sm:pl-5 border-l-4 border-brand"
                >
                  <p className="text-sm sm:text-base md:text-lg italic text-[#2d4f3a] leading-7 sm:leading-8 font-medium">
                    {article.content[2].paragraphs[0].slice(0, 120).trim()}…
                  </p>
                </motion.blockquote>
              )}
            </motion.div>
          ))}

          {/* Author card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mt-8 sm:mt-10 md:mt-12 p-4 sm:p-5 md:p-7 rounded-[16px] sm:rounded-[20px] md:rounded-[28px] bg-white border border-gray-100 shadow-soft"
          >
            <div className="flex gap-3 sm:gap-4 items-start">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#edf6ef] flex items-center justify-center text-brand font-bold text-base sm:text-lg flex-shrink-0">
                B
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm sm:text-base text-[#1a3520]">{article.author}</p>
                <p className="text-[10px] sm:text-xs text-gray-400 mt-0.5 mb-2 leading-relaxed">Counseling Psychologist · Social Counselor · Yoga & Wellness Expert</p>
                <p className="text-xs sm:text-sm text-gray-500 leading-6">
                  Babita Kumari has been helping individuals navigate emotional challenges, relationships, and personal growth for over 12 years through psychology, holistic wellness, and compassionate guidance.
                </p>
                <Link href="/expert" className="inline-flex items-center gap-1 mt-2.5 sm:mt-3 text-xs font-semibold text-brand hover:text-brand-light transition-colors">
                  Meet Babita <ArrowRightIcon className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ── RELATED ARTICLES ── */}
        {related.length > 0 && (
          <section className="max-w-4xl mx-auto px-4 sm:px-6 pb-12 sm:pb-14 md:pb-20">
            <div className="border-t border-gray-100 pt-8 sm:pt-10 md:pt-12">
              <p className="text-brand text-xs uppercase tracking-[0.24em] font-semibold mb-1.5 sm:mb-2">Continue reading</p>
              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-[#1a3520] mb-5 sm:mb-6 md:mb-8">More articles for you</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5 md:gap-6">
                {related.map((rel, i) => (
                  <motion.div
                    key={rel.slug}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    viewport={{ once: true }}
                  >
                    <Link href={`/blog/${rel.slug}`} className="group flex gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white border border-gray-100 shadow-soft hover:shadow-md transition-shadow items-start">
                      <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg sm:rounded-xl overflow-hidden flex-shrink-0">
                        <Image src={rel.image} alt={rel.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${categoryColors[rel.category] ?? 'bg-gray-100 text-gray-500'}`}>
                          {rel.category}
                        </span>
                        <h3 className="mt-1 sm:mt-1.5 text-xs sm:text-sm font-semibold text-[#1a3520] leading-snug group-hover:text-brand transition-colors line-clamp-2">
                          {rel.title}
                        </h3>
                        <p className="mt-1 text-[10px] sm:text-xs text-gray-400">{rel.readTime}</p>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── CTA ── */}
        <section className="bg-gradient-to-br from-[#1a3520] to-[#2d4f3a] py-14 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto px-4 sm:px-6 text-center"
          >
            <p className="text-white/60 text-xs uppercase tracking-widest font-semibold mb-3">Take the next step</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white leading-snug">
              Ready to go deeper?
            </h2>
            <p className="mt-4 text-white/70 text-sm md:text-base leading-7 max-w-xl mx-auto">
              Reading opens the door. Working with Babita walks you through it — through counseling, yoga, or an immersive healing retreat.
            </p>
            <div className="mt-7 sm:mt-8 flex flex-col sm:flex-row flex-wrap gap-3 justify-center items-center">
              <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }} className="w-full sm:w-auto">
                <Link
                  href="/services"
                  className="flex sm:inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#1a3520] shadow-lg hover:shadow-xl transition-shadow"
                >
                  Explore Services <ArrowRightIcon className="w-4 h-4" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }} className="w-full sm:w-auto">
                <Link
                  href="/blog"
                  className="flex sm:inline-flex items-center justify-center gap-2 rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
                >
                  Back to Blog
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </section>

      </main>
      <Footer />
    </div>
  )
}

export async function getStaticPaths() {
  return {
    paths: blogArticles.map((article) => ({ params: { slug: article.slug } })),
    fallback: false,
  }
}

export async function getStaticProps({ params }) {
  const article = blogArticles.find((a) => a.slug === params.slug)
  const related = blogArticles.filter((a) => a.slug !== params.slug).slice(0, 2)
  return { props: { article, related } }
}
