import { motion } from 'framer-motion'
import { Sun } from 'lucide-react'

interface SummerAnimationProps {
  size?: number
}

export function SummerAnimation({ size = 120 }: SummerAnimationProps) {
  return (
    <div className="relative w-full h-64 flex items-center justify-center">
      {/* Sun */}
      <motion.div
        className="absolute"
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      >
        <Sun className="h-20 w-20 text-yellow-400" />
      </motion.div>

      {/* Waves */}
      {[1, 2, 3].map((wave) => (
        <motion.div
          key={wave}
          className={`absolute w-[${size}px] h-[${size/4}px] rounded-full bg-blue-200/50`}
          style={{ bottom: `${wave * 20}px` }}
          animate={{ y: [0, -10, 0] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: wave * 0.2
          }}
        />
      ))}

      {/* Bubbles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-4 h-4 rounded-full bg-blue-300/70"
          initial={{ y: 100, x: Math.random() * 200 - 100, scale: 0.5, opacity: 0.7 }}
          animate={{ y: -100, scale: [0.5, 1, 0.5], opacity: [0.7, 1, 0.7] }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.5
          }}
        />
      ))}
    </div>
  )
}