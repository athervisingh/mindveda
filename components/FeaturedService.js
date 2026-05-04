import { motion } from 'framer-motion'
import ImagePlaceholder from './ImagePlaceholder'

export default function FeaturedService({ title, description, features, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="bg-white rounded-xl shadow-soft overflow-hidden hover:shadow-xl transition-shadow"
    >
      <div className="h-48 w-full">
        <ImagePlaceholder width="w-full" height="h-48" label="" />
      </div>
      <div className="p-6">
        <h3 className="font-semibold text-lg mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-4">{description}</p>
        <ul className="space-y-2">
          {features.map((f, i) => (
            <li key={i} className="text-xs text-gray-500 flex items-center gap-2">
              <span className="text-brand">✓</span> {f}
            </li>
          ))}
        </ul>
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="w-full mt-4 px-4 py-2 bg-brand text-white rounded-md text-sm hover:opacity-90"
        >
          Learn More →
        </motion.button>
      </div>
    </motion.div>
  )
}
