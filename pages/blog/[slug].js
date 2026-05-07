import Header from '../../components/Header'
import { ArrowLeftIcon } from '../../components/Icons'
import Footer from '../../components/Footer'
import Link from 'next/link'
import Image from 'next/image'
import { blogArticles } from '../../lib/siteContent'

export default function BlogArticlePage({ article }) {
  return (
    <div className="min-h-screen bg-[#fbfaf7]">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 md:py-16">
        <Link href="/blog" className="text-sm font-medium text-brand inline-flex items-center gap-1">
          <ArrowLeftIcon className="w-3.5 h-3.5" /> Back to blog
        </Link>
        <div className="mt-4 md:mt-5 inline-flex rounded-full bg-[#edf5ee] px-3 py-1 text-xs font-medium text-brand">{article.category}</div>
        <h1 className="mt-3 md:mt-4 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight text-[#1a3520]">{article.title}</h1>
        <p className="mt-3 md:mt-4 text-gray-500 text-sm">{article.readTime}</p>
        <div className="mt-6 md:mt-8 overflow-hidden rounded-[20px] md:rounded-[32px] shadow-soft relative h-[220px] sm:h-[320px] md:h-[420px]">
          <Image src={article.image} alt={article.title} fill className="object-cover" />
        </div>
        <article className="mt-8 md:mt-10 space-y-5 md:space-y-6 text-base md:text-lg leading-8 md:leading-9 text-gray-700">
          <p>This is a dummy article page built to feel editorial and premium. Replace this section with your final article content later.</p>
          <p>The layout includes a large hero image block, generous spacing, readable typography, and a calm visual tone that matches the rest of the brand.</p>
          <p>You can extend this page with author metadata, reading progress, related posts, comments, and SEO data.</p>
        </article>
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
  const article = blogArticles.find((item) => item.slug === params.slug)
  return { props: { article } }
}
