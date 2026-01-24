import { cn } from '@/utilities/cn'

/**
 * LengthCounter - A reusable component for displaying character count with visual warnings
 *
 * @example
 * ```tsx
 * <LengthCounter
 *   current={description.length}
 *   max={1000}
 *   warningThreshold={0.8}
 *   dangerThreshold={0.9}
 * />
 * ```
 */
interface LengthCounterProps {
  current: number
  max: number
  className?: string
  showWarning?: boolean
  warningThreshold?: number
  dangerThreshold?: number
}

export function LengthCounter({
  current,
  max,
  className,
  showWarning = true,
  warningThreshold = 0.8, // 80% of max
  dangerThreshold = 0.9, // 90% of max
}: LengthCounterProps) {
  const warningLimit = Math.floor(max * warningThreshold)
  const dangerLimit = Math.floor(max * dangerThreshold)

  const getColorClass = () => {
    if (current > dangerLimit) return 'text-red-500'
    if (current > warningLimit) return 'text-yellow-500'
    return 'text-muted-foreground'
  }

  const getStatus = () => {
    if (current > max) return 'exceeded'
    if (current > dangerLimit) return 'danger'
    if (current > warningLimit) return 'warning'
    return 'normal'
  }

  const status = getStatus()

  if (!showWarning) {
    return (
      <div className={cn('text-xs text-right', className)}>
        {current}/{max} characters
      </div>
    )
  }

  return (
    <div className={cn('text-xs text-right', getColorClass(), className)}>
      {current}/{max} characters
      {status === 'exceeded' && (
        <span className='ml-1 text-red-500 font-medium'>(Exceeded limit)</span>
      )}
      {status === 'danger' && (
        <span className='ml-1 text-yellow-500 font-medium'>(Near limit)</span>
      )}
    </div>
  )
}
