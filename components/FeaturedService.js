import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { CheckIcon, ArrowRightIcon } from './Icons'

export default function FeaturedService({ title, description, features, href, index, image }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, scale: 1.012 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="card-anim group bg-white rounded-2xl md:rounded-[20px] shadow-soft border border-gray-100 flex flex-col"
    >
      <div className="relative w-full h-52 md:h-60">
        <Image src={image} alt={title} fill className="object-cover" />
      </div>
      <div className="p-5 md:p-7 flex flex-col flex-1">
        <h3 className="font-semibold text-lg md:text-xl mb-2 md:mb-2.5 text-[#1a3520] group-hover:text-brand transition-colors">{title}</h3>
        <p className="text-sm md:text-base text-gray-500 mb-4 md:mb-5 leading-6 md:leading-7">{description}</p>
        <ul className="space-y-2 md:space-y-2.5 flex-1">
          {features.map((f, i) => (
            <li key={i} className="text-sm text-gray-500 flex items-center gap-2">
              <span className="text-brand flex-shrink-0">
                <CheckIcon className="w-3.5 h-3.5 md:w-4 md:h-4" />
              </span>
              {f}
            </li>
          ))}
        </ul>
        <Link href={href || '/services'}>
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="w-full mt-5 md:mt-6 px-4 py-3 bg-brand text-white rounded-xl text-sm md:text-base hover:opacity-90 flex items-center justify-center gap-2 cursor-pointer font-medium"
          >
            Learn More <ArrowRightIcon className="w-3.5 h-3.5" />
          </motion.div>
        </Link>
      </div>
    </motion.div>
  )
}
