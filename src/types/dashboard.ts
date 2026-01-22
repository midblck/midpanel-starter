// Dashboard types
export type TrendType = 'up' | 'down'

export type ActivityStatus = 'info' | 'success' | 'warning' | 'error'

export interface DashboardStat {
  title: string
  value: string
  change: string
  trend: TrendType
  description: string
  icon: string
}

export interface RecentActivity {
  id: string
  type: string
  message: string
  timestamp: string
  status: ActivityStatus
}

export interface DashboardData {
  stats: DashboardStat[]
  activities: RecentActivity[]
  totalUsers?: number
  totalRevenue?: number
  growthRate?: number
}

export interface DashboardProps {
  data?: DashboardData
  isLoading?: boolean
  error?: string
}
