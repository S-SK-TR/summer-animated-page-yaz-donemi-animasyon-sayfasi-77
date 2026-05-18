import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

interface LoadingScreenProps {
  isLoading: boolean
  message?: string
}

export function LoadingScreen({ isLoading, message = 'Yükleniyor...' }: LoadingScreenProps) {
  if (!isLoading) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--bg-base)]/80 backdrop-blur-sm"
    >
      <div className="glass-card p-8 rounded-3xl flex flex-col items-center gap-6">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear'
          }}
        >
          <Loader2 className="h-12 w-12 text-[var(--brand-500)]" />
        </motion.div>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-lg font-medium text-[var(--text-primary)]"
        >
          {message}
        </motion.p>
      </div>
    </motion.div>
  )
}