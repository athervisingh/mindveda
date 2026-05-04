import Header from '../../components/Header'
import Footer from '../../components/Footer'
import Link from 'next/link'
import ImagePlaceholder from '../../components/ImagePlaceholder'
import { resourceGuides } from '../../lib/siteContent'

export default function ResourcePage({ resource }) {
  return (
    <div className="min-h-screen bg-[#fbfaf7]">
      <Header />
      <main className="max-w-4xl mx-auto px-6 py-16">
        <Link href="/resources" className="text-sm font-medium text-brand">← Back to resources</Link>
        <div className="mt-5 inline-flex rounded-full bg-[#f1ebdb] px-3 py-1 text-xs font-medium text-[#8b6f2b]">{resource.type}</div>
        <h1 className="mt-4 text-4xl md:text-5xl font-semibold leading-tight text-[#2d2343]">{resource.title}</h1>
        <p className="mt-4 text-gray-600 leading-8">{resource.description}</p>
        <div className="mt-8 rounded-[32px] overflow-hidden shadow-soft">
          <ImagePlaceholder width="w-full" height="h-[380px]" label="Resource preview placeholder" />
        </div>
        <div className="mt-10 rounded-[28px] bg-white p-6 shadow-soft text-gray-700 leading-8">
          This is a placeholder resource page. Later, you can attach downloads, embedded audio, or step-by-step frameworks here.
        </div>
      </main>
      <Footer />
    </div>
  )
}

export async function getStaticPaths() {
  return {
    paths: resourceGuides.map((resource) => ({ params: { slug: resource.slug } })),
    fallback: false,
  }
}

export async function getStaticProps({ params }) {
  const resource = resourceGuides.find((item) => item.slug === params.slug)
  return { props: { resource } }
}
