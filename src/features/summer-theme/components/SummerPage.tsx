import { motion } from 'framer-motion'
import { Sun, Cloud, HelpCircle, Wind } from 'lucide-react'
import { BentoGrid } from '@/components/ui/BentoGrid'
import { GlassCard } from '@/components/ui/GlassCard'
import { SummerAnimation } from './SummerAnimation'

const summerElements = [
  { icon: Sun, label: 'Sun', color: 'text-yellow-500', bgColor: 'bg-yellow-100' },
  { icon: Cloud, label: 'Cloud', color: 'text-blue-400', bgColor: 'bg-blue-100' },
  { icon: HelpCircle, label: 'Water', color: 'text-blue-500', bgColor: 'bg-blue-100' },
  { icon: Wind, label: 'Wind', color: 'text-green-500', bgColor: 'bg-green-100' }
]

export function SummerPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="relative mb-12">
        <SummerAnimation />
      </div>

      <h1 className="font-display text-4xl font-bold text-center mb-8 text-primary">Summer Vibes</h1>

      <BentoGrid>
        {summerElements.map((element, index) => (
          <GlassCard key={index} className="p-6 flex flex-col items-center justify-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-full ${element.bgColor} ${element.color} mb-4`}
            >
              <element.icon className="h-8 w-8" />
            </motion.div>
            <h3 className="font-display text-xl font-semibold ${element.color}">{element.label}</h3>
          </GlassCard>
        ))}
      </BentoGrid>
    </div>
  )
}