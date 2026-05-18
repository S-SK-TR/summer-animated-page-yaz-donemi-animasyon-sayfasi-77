import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HelpCircle } from 'lucide-react'

interface NotFoundPageProps {
  title?: string
  message?: string
}

export function NotFoundPage({
  title = 'Page Not Found',
  message = 'The page you are looking for does not exist.'
}: NotFoundPageProps) {
  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        <HelpCircle className="h-20 w-20 text-blue-400 mx-auto mb-6" />
        <h1 className="font-display text-4xl font-bold text-gray-900 mb-4">{title}</h1>
        <p className="text-gray-600 mb-8">{message}</p>
        <Link
          to="/"
          className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          Go to Homepage
        </Link>
      </motion.div>
    </div>
  )
}