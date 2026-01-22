import type { Admin, User } from '@/payload-types'

interface DashboardGreetingProps {
  user?: (Admin | User) | null
}

export function DashboardGreeting({ user }: DashboardGreetingProps) {
  const userName = user?.name || 'There'

  return (
    <div className='flex items-center justify-between space-y-2'>
      <h2 className='text-2xl font-bold tracking-tight'>Hi, {userName} 👋</h2>
    </div>
  )
}
