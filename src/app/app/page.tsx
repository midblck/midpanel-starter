import { DashboardGreeting } from '@/components/dashboard-greeting'
import { DashboardErrorFallback, ErrorBoundary } from '@/components/error-boundary'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { DashboardData, DashboardStat } from '@/types/dashboard'
import { logError } from '@/utilities/logger'
import configPromise from '@payload-config'
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  TrendingDown,
  TrendingUp,
  Users,
} from 'lucide-react'
import { headers } from 'next/headers'
import { getPayload } from 'payload'
import { Suspense } from 'react'

// Force dynamic rendering due to authentication requirements
export const dynamic = 'force-dynamic'

// Icon mapping for dynamic icon rendering
const iconMap = {
  TrendingUp,
  TrendingDown,
  Users,
  Activity,
} as const

interface DashboardPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

async function getDashboardData(userId: string): Promise<DashboardData> {
  try {
    const payload = await getPayload({ config: configPromise })

    // Get today's date range (start of day to end of day) in UTC
    const now = new Date()
    const startOfToday = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
    )
    const endOfToday = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1)
    )

    // Fetch tasks created today by the current user
    const [todayTasksResult, totalTasksResult] = await Promise.all([
      payload.find({
        collection: 'tasks',
        where: {
          creator: {
            equals: userId,
          },
          createdAt: {
            greater_than_equal: startOfToday.toISOString(),
            less_than: endOfToday.toISOString(),
          },
        },
        limit: 0,
      }),
      payload.find({
        collection: 'tasks',
        where: {
          creator: {
            equals: userId,
          },
        },
        limit: 0,
      }),
    ])

    const todayTasks = todayTasksResult.docs
    const totalTasks = totalTasksResult.docs
    const tasksCreatedToday = todayTasks.length

    // Create user-specific stats - only keep My Total Tasks
    const stats: DashboardStat[] = [
      {
        title: 'My Total Tasks',
        value: totalTasks.length.toString(),
        change: `+${tasksCreatedToday}`,
        trend: 'up' as const,
        description: 'tasks created',
        icon: 'trending-up',
      },
    ]

    return {
      stats,
      activities: [],
      totalUsers: 0, // Not relevant for user dashboard
      totalRevenue: 0, // Not relevant for user dashboard
      growthRate: 0, // Not relevant for user dashboard
    }
  } catch (error) {
    logError('Failed to fetch dashboard data', error, {
      component: 'DashboardPage',
      action: 'fetch-dashboard-data',
    })
    // Return fallback data on error
    return {
      stats: [
        {
          title: 'My Total Tasks',
          value: '0',
          change: '+0',
          trend: 'up' as const,
          description: 'tasks created',
          icon: 'trending-up',
        },
      ],
      activities: [],
      totalUsers: 0,
      totalRevenue: 0,
      growthRate: 0,
    }
  }
}

function StatsCard({ stat }: { stat: DashboardStat }) {
  const IconComponent = iconMap[stat.icon as keyof typeof iconMap] || Activity

  return (
    <Card className='relative overflow-hidden'>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-sm font-medium text-muted-foreground'>{stat.title}</CardTitle>
        <IconComponent className='h-4 w-4 text-muted-foreground' />
      </CardHeader>
      <CardContent>
        <div className='text-2xl font-bold'>{stat.value}</div>
        <div className='flex items-center space-x-1 text-xs text-muted-foreground'>
          {stat.trend === 'up' ? (
            <ArrowUpRight className='h-3 w-3 text-green-500' />
          ) : (
            <ArrowDownRight className='h-3 w-3 text-red-500' />
          )}
          <span className={stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}>
            {stat.change}
          </span>
          <span>{stat.description}</span>
        </div>
      </CardContent>
    </Card>
  )
}

function DashboardContent() {
  return (
    <ErrorBoundary
      fallback={<DashboardErrorFallback error={new Error('Dashboard failed to load')} />}
    >
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardData />
      </Suspense>
    </ErrorBoundary>
  )
}

async function DashboardData() {
  // Get authenticated user data server-side
  let user = null
  try {
    const payload = await getPayload({ config: configPromise })
    const headersList = await headers()
    const authResult = await payload.auth({
      headers: headersList,
    })
    user = authResult.user
  } catch (error) {
    logError('Failed to get user data in dashboard', error, {
      component: 'DashboardPage',
      action: 'get-user-data',
    })
  }

  const data = await getDashboardData(user?.id || '')

  return (
    <div className='flex flex-1 flex-col space-y-4'>
      <DashboardGreeting user={user} />

      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-1 max-w-md'>
        {data.stats.map(stat => (
          <StatsCard key={stat.title} stat={stat} />
        ))}
      </div>
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className='flex flex-1 flex-col space-y-4'>
      <div className='flex items-center justify-between space-y-2'>
        <h2 className='text-2xl font-bold tracking-tight'>Hi, There 👋</h2>
      </div>

      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-1 max-w-md'>
        {Array.from({ length: 1 }).map((_, i) => (
          <Card key={i} className='relative overflow-hidden'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <div className='h-4 w-20 bg-muted animate-pulse rounded' />
              <div className='h-4 w-4 bg-muted animate-pulse rounded' />
            </CardHeader>
            <CardContent>
              <div className='h-8 w-24 bg-muted animate-pulse rounded mb-2' />
              <div className='h-3 w-32 bg-muted animate-pulse rounded' />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default async function DashboardPage(
  {
    // searchParams,
  }: DashboardPageProps
) {
  // This would be where you'd add authentication checks
  // For now, we'll assume the user is authenticated via middleware

  return <DashboardContent />
}
