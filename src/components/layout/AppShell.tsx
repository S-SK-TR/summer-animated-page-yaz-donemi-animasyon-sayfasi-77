import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Header } from './Header'
import { SummerPage } from '@/features/summer-theme/components/SummerPage'
import { NotFoundPage } from '@/components/ui/NotFoundPage'

interface AppShellProps {
  children?: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const location = useLocation()

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
      <Header />

      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Routes>
              <Route path="/" element={<Navigate to="/summer" replace />} />
              <Route path="/summer" element={<SummerPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>

      {children}
    </div>
  )
}