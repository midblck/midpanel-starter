'use client'

import { DashboardSkeleton } from '@/components/loading/dashboard-skeleton'
import type { TaskTableData } from '@/types/data-table'
import { lazy, Suspense } from 'react'

// Only lazy load the heavy TaskTable component
const TaskTable = lazy(() =>
  import('@/features/task-list/components/table').then(module => ({
    default: module.TaskTable,
  })),
)

interface LazyTaskTableProps {
  initialData?: TaskTableData[]
  initialPagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  initialFilterOptions?: {
    statuses: Array<{ value: string; label: string; color: string }>
    taskTypes: Array<{ value: string; label: string; color: string }>
    assignees: Array<{ value: string; label: string }>
  }
}

export function LazyTaskTable(props: LazyTaskTableProps) {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <TaskTable {...props} />
    </Suspense>
  )
}
