import Link from 'next/link'
import { motion } from 'framer-motion'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-brand flex items-center justify-center text-white text-sm font-semibold">MV</div>
              <div>
                <div className="font-semibold text-white">MindVeda</div>
                <div className="text-xs">by Babita</div>
              </div>
            </div>
            <p className="text-sm">Improving lives through counselling & wellness.</p>
            <div className="flex gap-4 mt-4">
              {['f', 'ig', 'yt', 'in'].map((icon, i) => (
                <motion.a key={i} whileHover={{ scale: 1.2 }} href="#" className="text-gray-400 hover:text-brand">
                  {icon === 'f' && '📘'}
                  {icon === 'ig' && '📷'}
                  {icon === 'yt' && '📹'}
                  {icon === 'in' && '🔗'}
                </motion.a>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-brand transition-colors">Home</Link></li>
              <li><Link href="/packages" className="hover:text-brand transition-colors">Packages</Link></li>
              <li><Link href="/about" className="hover:text-brand transition-colors">About</Link></li>
              <li><Link href="/blog" className="hover:text-brand transition-colors">Blog</Link></li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="font-semibold text-white mb-4">Our Services</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/packages" className="hover:text-brand transition-colors">Individual Counseling</Link></li>
              <li><Link href="/packages" className="hover:text-brand transition-colors">Couples Therapy</Link></li>
              <li><Link href="/packages" className="hover:text-brand transition-colors">Yoga & Wellness</Link></li>
              <li><Link href="/packages" className="hover:text-brand transition-colors">Retreats</Link></li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3 className="font-semibold text-white mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/contact" className="hover:text-brand transition-colors">Contact Us</Link></li>
              <li><Link href="/resources" className="hover:text-brand transition-colors">Resources</Link></li>
              <li><Link href="/about" className="hover:text-brand transition-colors">FAQ</Link></li>
              <li><Link href="/" className="hover:text-brand transition-colors">Privacy Policy</Link></li>
            </ul>
          </motion.div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-sm">
          <p>© {new Date().getFullYear()} MindVeda by Babita. All rights reserved.</p>
          <p className="mt-2">Designed with 💚 for your well-being</p>
        </div>
      </div>
    </footer>
  )
}
