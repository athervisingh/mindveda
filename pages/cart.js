import Header from '../components/Header'
import Footer from '../components/Footer'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function Cart(){
  const [cart, setCart] = useState([])

  useEffect(()=>{
    setCart(JSON.parse(localStorage.getItem('mv_cart') || '[]'))
  },[])

  const removeItem = (i)=>{
    const c = [...cart]
    c.splice(i,1)
    setCart(c)
    localStorage.setItem('mv_cart', JSON.stringify(c))
  }

  const total = cart.reduce((s,p)=> s + (p.price||0), 0)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-semibold">Your Cart</h1>
        <div className="mt-6">
          {cart.length===0 && <div className="text-gray-500">Your cart is empty. <Link href="/packages" className="text-indigo-600">Browse packages</Link></div>}
          <div className="space-y-4 mt-4">
            {cart.map((item, idx)=> (
              <div key={idx} className="flex items-center justify-between bg-white p-4 rounded-lg shadow-soft">
                <div>
                  <div className="font-medium">{item.title}</div>
                  <div className="text-sm text-gray-500">{item.excerpt}</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="font-semibold">₹{item.price}</div>
                  <button className="text-sm text-red-500" onClick={()=>removeItem(idx)}>Remove</button>
                </div>
              </div>
            ))}
          </div>

          {cart.length>0 && (
            <div className="mt-6 flex items-center justify-between">
              <div className="text-lg font-semibold">Total: ₹{total}</div>
              <Link href="/checkout" className="px-4 py-2 bg-brand text-white rounded-md">Proceed to Checkout</Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
