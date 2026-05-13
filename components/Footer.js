import Link from 'next/link'
import { motion } from 'framer-motion'
import { FacebookIcon, InstagramIcon, YoutubeIcon, LinkedInIcon, LotusIcon } from './Icons'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16 md:mt-20">
      <div className="max-w-6xl mx-auto px-5 sm:px-6 py-10 md:py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-10 md:mb-12">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="col-span-2 md:col-span-1"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-brand flex items-center justify-center text-white flex-shrink-0">
                <LotusIcon className="w-4 h-4" />
              </div>
              <div>
                <div className="font-semibold text-white">MindVeda</div>
                <div className="text-xs">by Babita</div>
              </div>
            </div>
            <p className="text-sm leading-6">Improving lives through counselling & wellness.</p>
            <div className="flex gap-4 mt-4">
              {[
                { Icon: FacebookIcon, href: '#', label: 'Facebook' },
                { Icon: InstagramIcon, href: '#', label: 'Instagram' },
                { Icon: YoutubeIcon, href: '#', label: 'YouTube' },
                { Icon: LinkedInIcon, href: '#', label: 'LinkedIn' },
              ].map(({ Icon, href, label }) => (
                <motion.a key={label} whileHover={{ scale: 1.2 }} href={href} aria-label={label} className="text-gray-400 hover:text-brand transition-colors">
                  <Icon className="w-5 h-5" />
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
            <h3 className="font-semibold text-white mb-3 md:mb-4 text-sm md:text-base">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-brand-light transition-colors hover:underline hover:underline-offset-2">Home</Link></li>
              <li><Link href="/yoga" className="hover:text-brand-light transition-colors hover:underline hover:underline-offset-2">Yoga</Link></li>
              <li><Link href="/retreat" className="hover:text-brand-light transition-colors hover:underline hover:underline-offset-2">Retreat</Link></li>
              <li><Link href="/about" className="hover:text-brand-light transition-colors hover:underline hover:underline-offset-2">About</Link></li>
              <li><Link href="/blog" className="hover:text-brand-light transition-colors hover:underline hover:underline-offset-2">Blog</Link></li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="font-semibold text-white mb-3 md:mb-4 text-sm md:text-base">Our Services</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/services" className="hover:text-brand-light transition-colors hover:underline hover:underline-offset-2">Individual Counseling</Link></li>
              <li><Link href="/services" className="hover:text-brand-light transition-colors hover:underline hover:underline-offset-2">Couples Therapy</Link></li>
              <li><Link href="/yoga" className="hover:text-brand-light transition-colors hover:underline hover:underline-offset-2">Yoga & Wellness</Link></li>
              <li><Link href="/retreat" className="hover:text-brand-light transition-colors hover:underline hover:underline-offset-2">Retreats</Link></li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3 className="font-semibold text-white mb-3 md:mb-4 text-sm md:text-base">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/contact" className="hover:text-brand-light transition-colors hover:underline hover:underline-offset-2">Contact Us</Link></li>
              <li><Link href="/resources" className="hover:text-brand-light transition-colors hover:underline hover:underline-offset-2">Resources</Link></li>
              <li><Link href="/about" className="hover:text-brand-light transition-colors hover:underline hover:underline-offset-2">FAQ</Link></li>
              <li><Link href="/" className="hover:text-brand-light transition-colors hover:underline hover:underline-offset-2">Privacy Policy</Link></li>
            </ul>
          </motion.div>
        </div>

        <div className="border-t border-gray-800 pt-6 md:pt-8 text-center text-sm">
          <p>© {new Date().getFullYear()} MindVeda by Babita. All rights reserved.</p>
          <p className="mt-2 flex items-center justify-center gap-1.5 text-gray-500">
            Crafted with care for your well-being
            <LotusIcon className="w-3.5 h-3.5 text-brand" />
          </p>
        </div>
      </div>
    </footer>
  )
}
