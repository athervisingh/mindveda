import { motion } from 'framer-motion'
import Link from 'next/link'
import { ServiceCategoryIcon, ArrowRightIcon } from './Icons'

export default function ServiceCard({ icon, title, description, href }) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col items-center text-center p-4 md:p-6 bg-white md:bg-transparent rounded-2xl md:rounded-none shadow-soft md:shadow-none border border-gray-100 md:border-none"
    >
      <div className="w-12 h-12 md:w-16 md:h-16 mb-3 md:mb-4 text-brand flex items-center justify-center">
        <ServiceCategoryIcon type={icon} className="w-9 h-9 md:w-12 md:h-12" />
      </div>
      <h3 className="font-semibold text-sm md:text-lg mb-1 md:mb-2 leading-tight">{title}</h3>
      <p className="text-gray-500 text-xs md:text-sm leading-5 hidden md:block">{description}</p>
      {href && (
        <motion.div whileHover={{ color: '#2d4f3a' }} className="mt-2 md:mt-3">
          <Link href={href} className="text-xs md:text-sm text-gray-400 inline-flex items-center gap-1 hover:text-brand transition-colors">
            Book <ArrowRightIcon className="w-3 h-3 md:w-3.5 md:h-3.5" />
          </Link>
        </motion.div>
      )}
    </motion.div>
  )
}
