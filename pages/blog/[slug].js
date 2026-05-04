import Header from '../../components/Header'
import Footer from '../../components/Footer'
import Link from 'next/link'
import ImagePlaceholder from '../../components/ImagePlaceholder'
import { blogArticles } from '../../lib/siteContent'

export default function BlogArticlePage({ article }) {
  return (
    <div className="min-h-screen bg-[#fbfaf7]">
      <Header />
      <main className="max-w-4xl mx-auto px-6 py-16">
        <Link href="/blog" className="text-sm font-medium text-brand">← Back to blog</Link>
        <div className="mt-5 inline-flex rounded-full bg-[#f4edf8] px-3 py-1 text-xs font-medium text-brand">{article.category}</div>
        <h1 className="mt-4 text-4xl md:text-5xl font-semibold leading-tight text-[#2d2343]">{article.title}</h1>
        <p className="mt-4 text-gray-500 text-sm">{article.readTime}</p>
        <div className="mt-8 overflow-hidden rounded-[32px] shadow-soft">
          <ImagePlaceholder width="w-full" height="h-[420px]" label="Article hero image placeholder" />
        </div>
        <article className="mt-10 space-y-6 text-lg leading-9 text-gray-700">
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
