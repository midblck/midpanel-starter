import { createKanbanTask, deleteKanbanTask, updateKanbanTask } from '@/features/kanban'
import type { TaskTableData, TaskTableFilters, TaskTablePagination } from '@/types/data-table'
import type { Task, TaskStatus, TaskType } from '@/payload-types'
import { logDbError } from '@/utilities/logger'

export interface TaskTableResponse {
  docs: TaskTableData[]
  totalDocs: number
  limit: number
  totalPages: number
  page: number
  pagingCounter: number
  hasPrevPage: boolean
  hasNextPage: boolean
  prevPage: number | null
  nextPage: number | null
}

export interface TaskTableParams {
  page?: number
  limit?: number
  sort?: string
  search?: string
  filters?: TaskTableFilters
}

// Fetch tasks with pagination and filtering using PayloadCMS built-in API
export async function fetchTaskTableData(params: TaskTableParams = {}): Promise<{
  data: TaskTableData[]
  pagination: TaskTablePagination
}> {
  try {
    const {
      page = 1,
      limit = 10,
      sort = '-createdAt', // Default sort by created date (newest first)
      search,
      filters = {},
    } = params

    // Build query parameters
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sort,
    })

    // Add search parameter
    if (search) {
      queryParams.append('where[title][like]', search)
    }

    // Add filters
    if (filters.status && filters.status.length > 0) {
      queryParams.append('where[status][in]', filters.status.join(','))
    }

    if (filters.priority && filters.priority.length > 0) {
      queryParams.append('where[priority][in]', filters.priority.join(','))
    }

    if (filters.assignee && filters.assignee.length > 0) {
      queryParams.append('where[assignee][in]', filters.assignee.join(','))
    }

    if (filters.taskTypes && filters.taskTypes.length > 0) {
      queryParams.append('where[taskTypes][in]', filters.taskTypes.join(','))
    }

    if (filters.dueDateFrom) {
      queryParams.append('where[dueDate][greater_than_equal]', filters.dueDateFrom)
    }

    if (filters.dueDateTo) {
      queryParams.append('where[dueDate][less_than_equal]', filters.dueDateTo)
    }

    // Add populate parameters to get related data
    queryParams.append('populate', 'status,taskTypes')
    queryParams.append('depth', '2') // Populate relationships up to 2 levels deep

    // Get the base URL for requests
    const baseUrl =
      typeof window !== 'undefined'
        ? window.location.origin
        : process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
    const apiUrl = `${baseUrl}/api/task-list?${queryParams.toString()}`

    const response = await fetch(apiUrl)

    if (!response.ok) {
      throw new Error(`Failed to fetch tasks: ${response.statusText}`)
    }

    const result: TaskTableResponse = await response.json()

    // Transform the data to match our table structure
    const transformedData: TaskTableData[] = result.docs.map((task: TaskTableData) => ({
      id: task.id,
      title: task.title,
      description: task.description,
      status: {
        id: task.status?.id || '',
        name: task.status?.name || 'Unknown',
        color: task.status?.color || '#6B7280',
      },
      priority: task.priority,
      assignee: task.assignee,
      dueDate: task.dueDate,
      taskTypes:
        task.taskTypes?.map(type => ({
          id: type.id,
          name: type.name,
          color: type.color,
        })) || [],
      order: task.order,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    }))

    const pagination: TaskTablePagination = {
      page: result.page,
      limit: result.limit,
      total: result.totalDocs,
      totalPages: result.totalPages,
    }

    return {
      data: transformedData,
      pagination,
    }
  } catch (error) {
    logDbError('fetch-task-table-data', error)
    throw error
  }
}

// Fetch task statuses for filter options
export async function fetchTaskStatuses() {
  try {
    const baseUrl =
      typeof window !== 'undefined'
        ? window.location.origin
        : process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/task-statuses?limit=100`)

    if (!response.ok) {
      throw new Error(`Failed to fetch task statuses: ${response.statusText}`)
    }

    const result = await response.json()
    // Handle both possible response formats
    const statuses = result.docs || result.data || []
    return statuses.map((status: TaskStatus) => ({
      label: status.name,
      value: status.id,
      color: status.color,
    }))
  } catch (error) {
    logDbError('fetch-task-statuses', error)
    return []
  }
}

// Fetch task types for filter options
export async function fetchTaskTypes() {
  try {
    const baseUrl =
      typeof window !== 'undefined'
        ? window.location.origin
        : process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/task-types?limit=100`)

    if (!response.ok) {
      throw new Error(`Failed to fetch task types: ${response.statusText}`)
    }

    const result = await response.json()
    return result.docs.map((type: TaskType) => ({
      label: type.name,
      value: type.id,
      color: type.color,
    }))
  } catch (error) {
    logDbError('fetch-task-types', error)
    return []
  }
}

// Fetch unique assignees for filter options
export async function fetchTaskAssignees() {
  try {
    const baseUrl =
      typeof window !== 'undefined'
        ? window.location.origin
        : process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/tasks?limit=1000&select=assignee`)

    if (!response.ok) {
      throw new Error(`Failed to fetch task assignees: ${response.statusText}`)
    }

    const result = await response.json()
    const assignees = result.data
      .map((task: Pick<Task, 'assignee'>) => task.assignee)
      .filter((assignee: string | null | undefined): assignee is string => {
        return assignee !== null && assignee !== undefined && assignee.trim() !== ''
      })
      .filter(
        (assignee: string, index: number, array: string[]) => array.indexOf(assignee) === index
      )
      .sort()

    return assignees.map((assignee: string) => ({
      label: assignee,
      value: assignee,
    }))
  } catch (error) {
    logDbError('fetch-task-assignees', error)
    return []
  }
}

// Task CRUD operations using kanban services
export async function createTask(taskData: {
  title: string
  description?: string
  status: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  assignee?: string
  dueDate?: string
  taskTypes?: string[]
}) {
  try {
    const result = await createKanbanTask(taskData)
    return result
  } catch (error) {
    logDbError('create-task', error, { taskData })
    throw error
  }
}

export async function updateTask(
  id: string,
  taskData: {
    title?: string
    description?: string
    status?: string
    priority?: 'low' | 'medium' | 'high' | 'critical'
    assignee?: string
    dueDate?: string
    taskTypes?: string[]
  }
) {
  try {
    const result = await updateKanbanTask(id, taskData)
    return result
  } catch (error) {
    logDbError('update-task', error, { taskId: id, taskData })
    throw error
  }
}

export async function deleteTask(id: string) {
  try {
    const result = await deleteKanbanTask(id)
    return result
  } catch (error) {
    logDbError('delete-task', error, { taskId: id })
    throw error
  }
}
