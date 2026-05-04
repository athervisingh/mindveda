import Header from '../components/Header'
import Footer from '../components/Footer'
import { useEffect, useState } from 'react'

export default function Checkout(){
  const [cart, setCart] = useState([])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  useEffect(()=>{
    setCart(JSON.parse(localStorage.getItem('mv_cart') || '[]'))
  },[])

  const total = cart.reduce((s,p)=> s + (p.price||0), 0)

  const handlePay = ()=>{
    // Mock payment UI only — integrate Razorpay later
    alert('Payment UI mocked. Razorpay integration to be added later.')
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-semibold">Checkout</h1>
        <div className="mt-6 grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-soft">
            <h2 className="font-medium">Billing Details</h2>
            <div className="mt-4 space-y-3">
              <input value={name} onChange={e=>setName(e.target.value)} placeholder="Full name" className="w-full border p-2 rounded" />
              <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full border p-2 rounded" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-soft">
            <h2 className="font-medium">Order Summary</h2>
            <div className="mt-4 space-y-3">
              {cart.map((c,i)=> (
                <div key={i} className="flex items-center justify-between">
                  <div>{c.title}</div>
                  <div>₹{c.price}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between font-semibold">Total <div>₹{total}</div></div>
            <div className="mt-6">
              <button onClick={handlePay} className="w-full px-4 py-3 bg-brand text-white rounded">Pay (Mock UI)</button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
