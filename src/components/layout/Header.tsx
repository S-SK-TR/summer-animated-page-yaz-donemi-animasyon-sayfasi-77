import { NavLink } from 'react-router-dom'
import { Sun, Cloud, Wind } from 'lucide-react'
import { motion } from 'framer-motion'

const navItems = [
  { to: '/summer', icon: Sun, label: 'Summer' },
  { to: '/weather', icon: Cloud, label: 'Weather' },
  { to: '/wind', icon: Wind, label: 'Wind' }
]

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="glass-card py-4 px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sun className="h-6 w-6 text-primary" />
          <h1 className="font-display text-xl font-bold text-primary">SummerVibe</h1>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => 
                `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors $
                {isActive ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-100'}`
              }
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <motion.button
          whileTap={{ scale: 0.95 }}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </motion.button>
      </div>
    </header>
  )
}