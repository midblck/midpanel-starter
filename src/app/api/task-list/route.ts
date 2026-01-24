import configPromise from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import { cookies } from 'next/headers'
import { isAdmin } from '@/lib/access'
import type { Task, TaskStatus, TaskType } from '@/payload-types'
import type { TaskTableData } from '@/types/data-table'
import { createRequestLogger } from '@/utilities/logger'

export async function GET(request: NextRequest) {
  const requestLogger = createRequestLogger()

  // Get user from JWT token in cookies for proper access control
  let user = null

  try {
    const { searchParams } = new URL(request.url)

    // Extract pagination parameters from URL
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const sort = searchParams.get('sort') || '-createdAt'

    // Check if pagination should be used (default: true, unless explicitly disabled)
    const usePagination =
      searchParams.has('page') ||
      searchParams.has('limit') ||
      searchParams.get('usePagination') !== 'false'

    // Extract filter parameters
    const status = searchParams.get('status')
    const priority = searchParams.get('priority')
    const assignee = searchParams.get('assignee')
    const taskTypes = searchParams.get('taskTypes')
    const dueDateFrom = searchParams.get('dueDateFrom')
    const dueDateTo = searchParams.get('dueDateTo')
    const search = searchParams.get('search')
    const includeFilterOptions = searchParams.get('includeFilterOptions') === 'true'

    const payload = await getPayload({ config: configPromise })
    const cookieStore = await cookies()
    const token = cookieStore.get('payload-token')?.value

    if (token) {
      try {
        const headers = new Headers()
        headers.set('Authorization', `Bearer ${token}`)
        const authResult = await payload.auth({ headers })
        user = authResult.user
      } catch (authError) {
        requestLogger.error('Failed to authenticate user for task-list API', authError, {
          component: 'API',
          action: 'GET /api/task-list',
        })
      }
    }

    // Build where clause for filtering
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: Record<string, any> = {}

    // Always filter by creator for multi-tenancy
    if (user && !isAdmin(user)) {
      where.creator = { equals: user.id }
    }

    if (status) {
      where['status.id'] = { equals: status }
    }

    if (priority) {
      where.priority = { equals: priority }
    }

    if (assignee) {
      where.assignee = { equals: assignee }
    }

    if (taskTypes) {
      where['taskTypes.id'] = { equals: taskTypes }
    }

    if (dueDateFrom) {
      where.dueDate = {
        ...((where.dueDate as Record<string, unknown>) || {}),
        greater_than_equal: dueDateFrom,
      }
    }

    if (dueDateTo) {
      where.dueDate = {
        ...((where.dueDate as Record<string, unknown>) || {}),
        less_than_equal: dueDateTo,
      }
    }

    if (search) {
      where.or = [
        { title: { contains: search } },
        { description: { contains: search } },
        { assignee: { contains: search } },
      ]
    }

    // Use PayloadCMS built-in pagination
    const result = await payload.find({
      collection: 'tasks',
      page: usePagination ? page : 1,
      limit: usePagination ? limit : 0, // Large limit when usePagination=false
      sort,
      where,
      depth: 2, // Populate relationships
      populate: {
        'task-statuses': {
          name: true,
          color: true,
        },
        'task-types': {
          name: true,
          color: true,
        },
        users: {
          name: true,
          email: true,
        },
      },
    })

    // Transform the data to match our table structure
    const transformedData: TaskTableData[] = result.docs.map((task: Task) => ({
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
            : { id: type.id, name: type.name, color: type.color },
        ) || [],
      order: task.order || 0,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    }))

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response: any = {
      docs: transformedData,
      totalDocs: result.totalDocs,
      limit: usePagination ? result.limit : result.docs.length, // When pagination disabled, show actual returned count
      totalPages: usePagination ? result.totalPages : 1, // When pagination disabled, always 1 page
      page: usePagination ? result.page : 1, // When pagination disabled, always page 1
      pagingCounter: result.pagingCounter,
      hasPrevPage: usePagination ? result.hasPrevPage : false, // No pagination when disabled
      hasNextPage: usePagination ? result.hasNextPage : false, // No pagination when disabled
      prevPage: usePagination ? result.prevPage : null,
      nextPage: usePagination ? result.nextPage : null,
    }

    // Include filter options if requested (for initial load)
    if (includeFilterOptions) {
      try {
        // Fetch statuses, task types, and assignees in parallel
        const [statusResult, taskTypesResult, assigneeResult] = await Promise.all([
          payload.find({
            collection: 'task-statuses',
            limit: 100,
            // Filter by creator for multi-tenancy
            ...(user && !isAdmin(user) && { where: { creator: { equals: user.id } } }),
          }),
          payload.find({
            collection: 'task-types',
            limit: 100,
            // Task types are global, not filtered by creator
          }),
          payload.find({
            collection: 'tasks',
            limit: 1000,
            select: { assignee: true },
            // Filter by creator for multi-tenancy
            ...(user && !isAdmin(user) && { where: { creator: { equals: user.id } } }),
          }),
        ])

        const uniqueAssignees = [
          ...new Set(
            assigneeResult.docs
              .map((task: Pick<Task, 'assignee'>) => task.assignee)
              .filter(
                (assignee): assignee is string =>
                  assignee !== null && assignee !== undefined && assignee.trim() !== '',
              ),
          ),
        ].sort()

        ;(response as Record<string, unknown>).filterOptions = {
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
      } catch (filterError) {
        requestLogger.error('Failed to fetch filter options', filterError, {
          component: 'API',
          action: 'GET /api/task-list',
          userId: user?.id,
        })
        // Don't fail the main request if filter options fail
        ;(response as Record<string, unknown>).filterOptions = {
          statuses: [],
          taskTypes: [],
          assignees: [],
        }
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    requestLogger.error('Failed to fetch tasks', error, {
      component: 'API',
      action: 'GET /api/task-list',
      userId: user?.id,
    })
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 })
  }
}
