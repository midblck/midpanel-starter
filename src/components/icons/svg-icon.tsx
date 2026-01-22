'use client'

import { cn } from '@/lib/utils'
import { type IconName } from './svg'

interface SvgIconProps {
  name: IconName
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  color?: string
  strokeWidth?: number
}

const sizeClasses = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8',
}

// Inline SVG components for each icon
const iconComponents = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  'arrow-left': (props: any) => (
    <svg {...props} viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path
        d='M19 12H5M12 19L5 12L12 5'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  ),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  'arrow-right': (props: any) => (
    <svg {...props} viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path
        d='M5 12H19M12 5L19 12L12 19'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  ),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  check: (props: any) => (
    <svg {...props} viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path
        d='M20 6L9 17L4 12'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  ),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  close: (props: any) => (
    <svg {...props} viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path
        d='M18 6L6 18M6 6L18 18'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  ),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  download: (props: any) => (
    <svg {...props} viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path
        d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <polyline
        points='7,10 12,15 17,10'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <line
        x1='12'
        y1='15'
        x2='12'
        y2='3'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  ),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  edit: (props: any) => (
    <svg {...props} viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path
        d='M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  ),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  eye: (props: any) => (
    <svg {...props} viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path
        d='M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <circle
        cx='12'
        cy='12'
        r='3'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  ),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filter: (props: any) => (
    <svg {...props} viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <polygon
        points='22,3 2,3 10,12.46 10,19 14,21 14,12.46'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  ),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  logo: (props: any) => (
    <svg {...props} viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <circle cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='2' />
      <path
        d='M12 6v6l4 2'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  ),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  plus: (props: any) => (
    <svg {...props} viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path
        d='M12 5v14M5 12h14'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  ),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  search: (props: any) => (
    <svg {...props} viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <circle
        cx='11'
        cy='11'
        r='8'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M21 21l-4.35-4.35'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  ),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  settings: (props: any) => (
    <svg {...props} viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <circle
        cx='12'
        cy='12'
        r='3'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  ),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  trash: (props: any) => (
    <svg {...props} viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path
        d='M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M10 11v6M14 11v6'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  ),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  upload: (props: any) => (
    <svg {...props} viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path
        d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <polyline
        points='17,8 12,3 7,8'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <line
        x1='12'
        y1='3'
        x2='12'
        y2='15'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  ),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: (props: any) => (
    <svg {...props} viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path
        d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <circle
        cx='12'
        cy='7'
        r='4'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  ),
}

export function SvgIcon({
  name,
  size = 'md',
  className,
  color = 'currentColor',
  strokeWidth = 1.5,
}: SvgIconProps) {
  const IconComponent = iconComponents[name]

  if (!IconComponent) {
    return (
      <div
        className={cn(
          sizeClasses[size],
          'bg-destructive/10 text-destructive rounded flex items-center justify-center text-xs',
          className
        )}
        title={`Icon "${name}" not found`}
        aria-label='Icon error'
      >
        ?
      </div>
    )
  }

  return (
    <IconComponent
      className={cn(sizeClasses[size], className)}
      style={{
        color,
        strokeWidth: strokeWidth.toString(),
      }}
      aria-hidden='true'
    />
  )
}

// Fallback component for missing icons
export function IconFallback({
  name,
  size = 'md',
  className,
}: {
  name: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}) {
  const sizeClass = sizeClasses[size]

  return (
    <div
      className={cn(
        sizeClass,
        'bg-muted text-muted-foreground rounded flex items-center justify-center text-xs font-mono',
        className
      )}
      title={`Icon "${name}" not found`}
      aria-label={`Missing icon: ${name}`}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  )
}
