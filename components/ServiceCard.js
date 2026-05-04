import { motion } from 'framer-motion'

export default function ServiceCard({ icon, title, description }) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="text-center p-6"
    >
      <motion.div
        initial={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        className="w-16 h-16 mx-auto mb-4 text-3xl flex items-center justify-center"
      >
        {icon}
      </motion.div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
      <motion.button
        whileHover={{ color: '#5B3E8A' }}
        className="text-sm text-gray-500 mt-3 inline-block"
      >
        Learn More →
      </motion.button>
    </motion.div>
  )
}
