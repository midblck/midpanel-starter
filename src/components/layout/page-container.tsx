import { ReactNode } from 'react'

interface PageContainerProps {
  children: ReactNode
  className?: string
}

export function PageContainer({ children, className = '' }: PageContainerProps) {
  return <div className={`flex flex-1 flex-col space-y-4 p-4 sm:p-6 ${className}`}>{children}</div>
}
