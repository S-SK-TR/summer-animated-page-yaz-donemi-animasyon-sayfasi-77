import { cn } from '@/lib/utils'

interface GlassCardProps {
  children: React.ReactNode
  className?: string
}

export function GlassCard({ children, className }: GlassCardProps) {
  return (
    <div className={cn(
      "glass-card rounded-xl border border-white/20",
      className
    )}>
      {children}
    </div>
  )
}