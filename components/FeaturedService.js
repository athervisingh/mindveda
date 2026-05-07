import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { CheckIcon, ArrowRightIcon } from './Icons'

export default function FeaturedService({ title, description, features, href, index, image }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="bg-white rounded-2xl md:rounded-[20px] shadow-soft overflow-hidden hover:shadow-xl transition-shadow border border-gray-100"
    >
      <div className="relative w-full h-44 md:h-48">
        <Image src={image} alt={title} fill className="object-cover" />
      </div>
      <div className="p-4 md:p-6">
        <h3 className="font-semibold text-base md:text-lg mb-1.5 md:mb-2 text-[#1a3520]">{title}</h3>
        <p className="text-xs md:text-sm text-gray-500 mb-3 md:mb-4 leading-5 md:leading-6">{description}</p>
        <ul className="space-y-1.5 md:space-y-2">
          {features.map((f, i) => (
            <li key={i} className="text-xs text-gray-500 flex items-center gap-2">
              <span className="text-brand flex-shrink-0">
                <CheckIcon className="w-3 h-3 md:w-3.5 md:h-3.5" />
              </span>
              {f}
            </li>
          ))}
        </ul>
        <Link href={href || '/services'}>
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="w-full mt-4 md:mt-5 px-4 py-2.5 bg-brand text-white rounded-xl text-xs md:text-sm hover:opacity-90 flex items-center justify-center gap-2 cursor-pointer font-medium"
          >
            Learn More <ArrowRightIcon className="w-3.5 h-3.5" />
          </motion.div>
        </Link>
      </div>
    </motion.div>
  )
}
