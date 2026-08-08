import Header from '../components/Header'
import Footer from '../components/Footer'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { NextSeo } from 'next-seo'
import { supabase } from '../lib/supabaseClient'
import { CartIcon } from '../components/Icons'

export default function ShopPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')

  useEffect(() => {
    async function fetchProducts() {
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
      setProducts(data || [])
      setLoading(false)
    }
    fetchProducts()
  }, [])

  const categories = ['all', ...new Set(products.map(p => p.category).filter(Boolean))]
  const filtered = products.filter(p => {
    const matchCat = category === 'all' || p.category === category
    if (!search) return matchCat
    return matchCat && p.name.toLowerCase().includes(search.toLowerCase())
  })

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfaf7]">
      <NextSeo title="Shop — Mind Veda" description="Wellness products handpicked by Mind Veda — oils, kits, books and more." />
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-6 py-12 w-full">
        <div className="mb-10 text-center">
          <p className="text-brand text-xs sm:text-sm uppercase tracking-[0.28em] font-semibold">Shop</p>
          <h1 className="mt-3 text-3xl sm:text-4xl font-semibold text-[#1a3520]">Wellness Products</h1>
          <p className="mt-3 text-gray-500 max-w-xl mx-auto">Curated products to support your healing journey, delivered to your door.</p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map(c => (
              <button key={c} onClick={() => setCategory(c)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-all ${category === c ? 'bg-brand text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-brand/40'}`}>
                {c === 'all' ? 'All' : c}
              </button>
            ))}
          </div>
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search products…"
            className="border border-gray-200 rounded-full px-4 py-2 text-sm w-56 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand" />
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {[1,2,3,4].map(i => <div key={i} className="aspect-[3/4] bg-gray-100 rounded-2xl animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <div className="w-16 h-16 mx-auto mb-4 text-gray-300 flex items-center justify-center">
              <CartIcon className="w-14 h-14" />
            </div>
            <h2 className="text-xl font-semibold text-[#1a3520] mb-2">No products found</h2>
            <p className="text-gray-500 mb-6">Check back soon — new wellness products are on the way.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filtered.map((p, i) => (
              <motion.div key={p.id} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (i % 8) * 0.05 }}>
                <Link href={`/shop/${p.slug}`} className="group block bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden hover:-translate-y-1 transition-transform">
                  <div className="aspect-square bg-brand/5 relative overflow-hidden">
                    {p.images?.[0] ? (
                      <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-brand/20"><CartIcon className="w-12 h-12" /></div>
                    )}
                    {p.stock === 0 && (
                      <span className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">Out of Stock</span>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-[10px] text-brand/60 uppercase tracking-wider font-medium">{p.category}</p>
                    <h3 className="text-sm font-semibold text-[#1a3520] mt-0.5 truncate">{p.name}</h3>
                    <p className="text-base font-bold text-brand mt-1.5">₹{Math.round(p.price / 100).toLocaleString('en-IN')}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
