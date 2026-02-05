import { ProjectPhase } from '@/types'
import { cn } from '@/lib/utils'
import { CheckCircle2, Circle, ArrowRight } from 'lucide-react'

interface ProjectTimelineProps {
  currentPhase: ProjectPhase
}

export function ProjectTimeline({ currentPhase }: ProjectTimelineProps) {
  const phases: { id: ProjectPhase; label: string }[] = [
    { id: 'PRE_SALES', label: 'Pré-venda' },
    { id: 'EXECUTION', label: 'Execução' },
    { id: 'DELIVERY', label: 'Entrega' },
    { id: 'POST_DELIVERY', label: 'Pós-entrega' },
  ]

  const getCurrentIndex = () => phases.findIndex((p) => p.id === currentPhase)
  const currentIndex = getCurrentIndex()

  return (
    <div className="w-full py-6">
      <div className="relative flex items-center justify-between w-full">
        {/* Background Line */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-100 z-0" />

        {/* Progress Line */}
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary z-0 transition-all duration-500"
          style={{ width: `${(currentIndex / (phases.length - 1)) * 100}%` }}
        />

        {phases.map((phase, index) => {
          const isCompleted = index <= currentIndex
          const isCurrent = index === currentIndex

          return (
            <div
              key={phase.id}
              className="relative z-10 flex flex-col items-center group"
            >
              <div
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all duration-300',
                  isCompleted
                    ? 'bg-primary border-primary text-primary-foreground'
                    : 'bg-white border-slate-200 text-slate-300',
                  isCurrent && 'ring-4 ring-primary/20 scale-110',
                )}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <Circle className="w-5 h-5" />
                )}
              </div>
              <span
                className={cn(
                  'absolute top-12 text-sm font-medium whitespace-nowrap transition-colors',
                  isCurrent
                    ? 'text-primary font-bold'
                    : isCompleted
                      ? 'text-slate-900'
                      : 'text-slate-400',
                )}
              >
                {phase.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
