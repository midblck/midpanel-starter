import { PageContainer, PageHeader } from '@/components/layout'
import { TaskTable } from '@/features/task-list'
import { logError } from '@/utilities/logger'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { cookies } from 'next/headers'
import { isAdmin } from '@/lib/access'
import type { Task, TaskStatus, TaskType, User, Admin } from '@/payload-types'
import type { TaskTableData } from '@/types/data-table'

// Force dynamic rendering due to authentication requirements
export const dynamic = 'force-dynamic'

// Union type to handle different user types from PayloadCMS
type UserWithRole = (Admin & { collection: 'admins' }) | (User & { collection: 'users' }) | null

export default async function TasksListPage() {
  // Fetch initial data for server-side rendering using PayloadCMS directly
  let initialData: TaskTableData[] = []
  let initialPagination:
    | {
        page: number
        limit: number
        total: number
        totalPages: number
      }
    | undefined = undefined
  let filterOptions:
    | {
        statuses: Array<{ value: string; label: string; color: string }>
        taskTypes: Array<{ value: string; label: string; color: string }>
        assignees: Array<{ value: string; label: string }>
      }
    | undefined = undefined

  try {
    // Import cache dynamically to avoid module-level issues
    const { cache } = await import('react')

    // Cached database operations for server-side request deduplication
    const getCachedPayload = cache(async () => {
      const config = await configPromise
      return getPayload({ config })
    })

    const getCachedTasks = cache(async (user: UserWithRole) => {
      const payload = await getCachedPayload()
      const result = await payload.find({
        collection: 'tasks',
        limit: 100,
        page: 1,
        sort: '-createdAt',
        depth: 2,
      })

      // Manually filter tasks by creator for multi-tenancy
      let filteredTasks = result.docs
      if (user && !isAdmin(user)) {
        const currentUser = user
        filteredTasks = result.docs.filter((task: Task) => {
          const creator = task.creator as User
          return creator && creator.id === currentUser.id
        })
      }

      return {
        ...result,
        docs: filteredTasks,
        totalDocs: filteredTasks.length,
        totalPages: Math.ceil(filteredTasks.length / 10),
      }
    })

    const getCachedStatuses = cache(async (user: UserWithRole) => {
      const payload = await getCachedPayload()

      // Filter by creator for multi-tenancy if not admin
      const whereClause = user && !isAdmin(user) ? { creator: { equals: user.id } } : undefined

      return payload.find({
        collection: 'task-statuses',
        limit: 100,
        ...(whereClause && { where: whereClause }),
      })
    })

    const getCachedTaskTypes = cache(async () => {
      const payload = await getCachedPayload()
      return payload.find({
        collection: 'task-types',
        limit: 100,
      })
    })

    const getCachedAssigneeTasks = cache(async (user: UserWithRole) => {
      const payload = await getCachedPayload()

      // Filter by creator for multi-tenancy if not admin
      const whereClause = user && !isAdmin(user) ? { creator: { equals: user.id } } : undefined

      return payload.find({
        collection: 'tasks',
        limit: 1000,
        select: { assignee: true },
        ...(whereClause && { where: whereClause }),
      })
    })
    // Get user from JWT token in cookies for proper access control
    let user: UserWithRole = null
    const cookieStore = await cookies()
    const token = cookieStore.get('payload-token')?.value

    if (token) {
      try {
        const payload = await getCachedPayload()
        const headers = new Headers()
        headers.set('Authorization', `Bearer ${token}`)
        const authResult = await payload.auth({ headers })
        user = authResult.user as UserWithRole
      } catch (authError) {
        logError('Failed to authenticate user in task-list page', authError, {
          component: 'TaskListPage',
          action: 'authenticate-user',
        })
        // Continue without user - access controls will handle this
      }
    }

    // Use cached database operations with React.cache() for deduplication
    const [taskResult, statusResult, taskTypesResult, assigneeResult] = await Promise.all([
      getCachedTasks(user),
      getCachedStatuses(user),
      getCachedTaskTypes(),
      getCachedAssigneeTasks(user),
    ])

    // Create filtered result for initial display
    const filteredResult = {
      ...taskResult,
      docs: taskResult.docs.slice(0, 10), // Apply original limit
    }

    // Transform the data to match our table structure
    initialData = filteredResult.docs.map(
      (task: Task): TaskTableData => ({
        id: task.id,
        title: task.title,
        description: task.description || undefined,
        status: {
          id: (task.status as TaskStatus)?.id || '',
          name: (task.status as TaskStatus)?.name || 'Unknown',
          color: (task.status as TaskStatus)?.color || '#6B7280',
        },
        priority: task.priority,
        assignee: task.assignee || undefined,
        dueDate: task.dueDate || undefined,
        taskTypes:
          task.taskTypes?.map((type: string | TaskType) =>
            typeof type === 'string'
              ? { id: type, name: 'Unknown', color: '#6B7280' }
              : { id: type.id, name: type.name, color: type.color }
          ) || [],
        order: task.order || 0,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
      })
    )

    initialPagination = {
      page: filteredResult.page || 1,
      limit: filteredResult.limit,
      total: filteredResult.totalDocs,
      totalPages: filteredResult.totalPages,
    }

    const uniqueAssignees = [
      ...new Set(
        assigneeResult.docs
          .map((task: Pick<Task, 'assignee'>) => task.assignee)
          .filter(
            (assignee): assignee is string =>
              assignee !== null && assignee !== undefined && assignee.trim() !== ''
          )
      ),
    ].sort()

    filterOptions = {
      statuses: statusResult.docs.map((status: TaskStatus) => ({
        value: status.id,
        label: status.name,
        color: status.color,
      })),
      taskTypes: taskTypesResult.docs.map((type: TaskType) => ({
        value: type.id,
        label: type.name,
        color: type.color,
      })),
      assignees: uniqueAssignees.map((assignee: string) => ({
        value: assignee,
        label: assignee,
      })),
    }
  } catch (error) {
    logError('Failed to fetch initial task data', error, {
      component: 'TaskListPage',
      action: 'fetch-initial-data',
    })
    // Continue with empty data - the table will handle the error state
  }

  return (
    <PageContainer>
      <PageHeader
        title='Tasks List'
        description='View and manage your tasks in a comprehensive table format'
      />

      <TaskTable
        initialData={initialData}
        initialPagination={initialPagination}
        initialFilterOptions={filterOptions}
      />
    </PageContainer>
  )
}
