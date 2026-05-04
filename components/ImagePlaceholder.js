import { motion } from 'framer-motion'

export default function ImagePlaceholder({ width = 'w-full', height = 'h-64', label = 'Image' }) {
  return (
    <motion.div
      initial={{ backgroundColor: '#000000' }}
      animate={{ backgroundColor: '#0a0a0a' }}
      transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
      className={`${width} ${height} rounded-lg flex items-center justify-center text-gray-500 font-medium`}
    >
      {label}
    </motion.div>
  )
}
