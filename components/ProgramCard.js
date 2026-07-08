import { motion } from 'framer-motion'
import Image from 'next/image'
import { CheckIcon, WhatsAppIcon } from './Icons'

const WA_LINK = 'https://wa.me/918851452070'

export default function ProgramCard({ title, hook, description, features, gradient, image, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, scale: 1.012 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="card-anim group bg-white rounded-2xl md:rounded-[20px] shadow-soft border border-gray-100 flex flex-col overflow-hidden"
    >
      <div className={`relative w-full aspect-[3/2] bg-gradient-to-br ${gradient} flex flex-col items-center justify-center px-6 overflow-hidden`}>
        {image && (
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover"
          />
        )}
      </div>

      <div className="p-5 md:p-7 flex flex-col flex-1">
        <h3 className="font-semibold text-lg md:text-xl mb-2 md:mb-2.5 text-[#1a3520] group-hover:text-brand transition-colors">{title}</h3>
        <p className="text-sm md:text-base text-gray-500 mb-4 md:mb-5 leading-6 md:leading-7">{description}</p>
        <ul className="space-y-2 md:space-y-2.5 flex-1">
          {features.map((f, i) => (
            <li key={i} className="text-sm text-gray-500 flex items-start gap-2">
              <span className="text-brand flex-shrink-0 mt-0.5">
                <CheckIcon className="w-3.5 h-3.5 md:w-4 md:h-4" />
              </span>
              {f}
            </li>
          ))}
        </ul>
        <a href={WA_LINK} target="_blank" rel="noopener noreferrer">
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="w-full mt-5 md:mt-6 px-4 py-3 bg-[#25D366] text-white rounded-xl text-sm md:text-base hover:bg-[#1ebe5d] flex items-center justify-center gap-2 cursor-pointer font-medium transition-colors"
          >
            <WhatsAppIcon className="w-4 h-4 md:w-5 md:h-5" />
            Chat on WhatsApp
          </motion.div>
        </a>
      </div>
    </motion.div>
  )
}
