import Header from '../../components/Header'
import Footer from '../../components/Footer'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { NextSeo } from 'next-seo'
import { supabase } from '../../lib/supabaseClient'
import { CartIcon, CheckIcon, ArrowLeftIcon } from '../../components/Icons'

export default function ProductDetail() {
  const router = useRouter()
  const { slug } = router.query
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeImage, setActiveImage] = useState(0)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    if (!slug) return
    async function fetchProduct() {
      const { data } = await supabase.from('products').select('*').eq('slug', slug).eq('is_active', true).single()
      setProduct(data || null)
      setLoading(false)
    }
    fetchProduct()
  }, [slug])

  function addToCart() {
    if (!product) return
    const cart = JSON.parse(localStorage.getItem('mv_cart') || '[]')
    const existing = cart.find(c => c.type === 'product' && c.productId === product.id)
    if (existing) {
      existing.quantity += qty
    } else {
      cart.push({
        cartId: `product_${product.id}_${Date.now()}`,
        type: 'product',
        productId: product.id,
        slug: product.slug,
        title: product.name,
        price: Math.round(product.price / 100),
        image: product.images?.[0] || null,
        quantity: qty,
      })
    }
    localStorage.setItem('mv_cart', JSON.stringify(cart))
    window.dispatchEvent(new Event('cartUpdated'))
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#fbfaf7]">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <svg className="w-8 h-8 animate-spin text-brand" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
        </main>
        <Footer />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-[#fbfaf7]">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-xl font-semibold text-gray-700 mb-4">Product not found</p>
            <Link href="/shop" className="text-brand underline">Back to Shop</Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const images = product.images?.length ? product.images : [null]

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfaf7]">
      <NextSeo title={`${product.name} — Mind Veda Shop`} description={product.description || product.name} />
      <Header />

      <main className="flex-1 max-w-5xl mx-auto px-6 py-10 w-full">
        <Link href="/shop" className="inline-flex items-center gap-1 text-sm text-brand hover:underline mb-6">
          <ArrowLeftIcon className="w-3.5 h-3.5" /> Back to Shop
        </Link>

        <div className="grid md:grid-cols-2 gap-10">
          <div>
            <div className="aspect-square bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              {images[activeImage] ? (
                <img src={images[activeImage]} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-brand/20"><CartIcon className="w-16 h-16" /></div>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 mt-3">
                {images.map((img, i) => img && (
                  <button key={i} onClick={() => setActiveImage(i)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-colors ${activeImage === i ? 'border-brand' : 'border-transparent'}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <p className="text-xs font-medium text-brand/60 uppercase tracking-wider">{product.category}</p>
            <h1 className="text-2xl sm:text-3xl font-semibold text-[#1a3520] mt-1">{product.name}</h1>
            <p className="text-2xl font-bold text-brand mt-3">₹{Math.round(product.price / 100).toLocaleString('en-IN')}</p>

            {product.description && (
              <p className="text-gray-500 leading-7 mt-4">{product.description}</p>
            )}

            <div className="mt-5">
              {product.stock === 0 ? (
                <span className="inline-block bg-red-100 text-red-600 text-xs font-semibold px-3 py-1.5 rounded-full">Out of Stock</span>
              ) : (
                <span className="inline-flex items-center gap-1.5 bg-green-100 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                  <CheckIcon className="w-3 h-3" /> In Stock
                </span>
              )}
            </div>

            {product.stock > 0 && (
              <>
                <div className="flex items-center gap-4 mt-6">
                  <span className="text-sm text-gray-600 font-medium">Quantity</span>
                  <div className="flex items-center border border-gray-200 rounded-full">
                    <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-9 h-9 flex items-center justify-center text-gray-500 hover:text-brand">−</button>
                    <span className="w-8 text-center text-sm font-semibold">{qty}</span>
                    <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} className="w-9 h-9 flex items-center justify-center text-gray-500 hover:text-brand">+</button>
                  </div>
                </div>

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={addToCart}
                  className="mt-6 w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-brand px-8 py-3.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
                >
                  {added ? <><CheckIcon className="w-4 h-4" /> Added to Cart</> : <><CartIcon className="w-4 h-4" /> Add to Cart</>}
                </motion.button>
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
