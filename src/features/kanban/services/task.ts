import { logApiError, logDbError, logInfo } from '@/utilities/logger'
import { convertToPayloadTask, convertToStoreTask } from './converters'
import type { CreateTaskData, PayloadResponse, Task } from './types'

// Fetch all tasks using PayloadCMS built-in REST API
export async function fetchKanbanTasks(): Promise<Task[]> {
  try {
    logInfo('Fetching tasks from built-in PayloadCMS API', {
      component: 'Kanban',
      action: 'fetch-tasks',
    })

    // Get JWT token from cookies for authentication
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('payload-token='))
      ?.split('=')[1]

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
      logInfo('Using authentication token for API request', {
        component: 'Kanban',
        action: 'fetch-tasks',
        hasToken: true,
      })
    } else {
      logInfo('No authentication token found', {
        component: 'Kanban',
        action: 'fetch-tasks',
        hasToken: false,
      })
    }

    const response = await fetch('/api/tasks?sort=order', {
      headers,
      credentials: 'include', // Include cookies
    })

    logInfo('API response received', {
      component: 'Kanban',
      action: 'fetch-tasks',
      status: response.status,
    })

    if (!response.ok) {
      const errorText = await response.text()
      logApiError('/api/tasks', 'GET', new Error(errorText), {
        component: 'Kanban',
        action: 'fetch-tasks',
        status: response.status,
      })
      throw new Error(`Failed to fetch tasks: ${response.status} ${response.statusText}`)
    }

    const data: PayloadResponse = await response.json()
    logInfo('Raw API data received', {
      component: 'Kanban',
      action: 'fetch-tasks',
      taskCount: data.docs?.length || 0,
    })

    const tasks = Array.isArray(data.docs) ? data.docs.map(convertToStoreTask) : []
    logInfo('Tasks converted successfully', {
      component: 'Kanban',
      action: 'fetch-tasks',
      convertedCount: tasks.length,
    })

    return tasks
  } catch (error) {
    logDbError('fetch-kanban-tasks', error)
    return []
  }
}

// Create task using PayloadCMS built-in REST API
export async function createKanbanTask(taskData: CreateTaskData): Promise<Task | null> {
  try {
    logInfo('Creating task', {
      component: 'Kanban',
      action: 'create-task',
      taskData,
    })

    // Get JWT token from cookies for authentication
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('payload-token='))
      ?.split('=')[1]

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    // Truncate description if it exceeds maxLength (1000)
    const payloadData = {
      ...taskData,
      description:
        taskData.description && taskData.description.length > 1000
          ? taskData.description.substring(0, 1000)
          : taskData.description,
    }

    logInfo('Sending create request', {
      component: 'Kanban',
      action: 'create-task',
      hasAuth: !!token,
    })
    const response = await fetch('/api/tasks', {
      method: 'POST',
      headers,
      credentials: 'include',
      body: JSON.stringify(payloadData),
    })

    logInfo('Create response received', {
      component: 'Kanban',
      action: 'create-task',
      status: response.status,
    })
    if (!response.ok) {
      const errorText = await response.text()
      logApiError('/api/tasks', 'POST', new Error(errorText), {
        component: 'Kanban',
        action: 'create-task',
        status: response.status,
      })
      throw new Error('Failed to create task')
    }

    const responseData = await response.json()
    logInfo('Create response processed', {
      component: 'Kanban',
      action: 'create-task',
      hasDoc: !!responseData.doc,
    })
    // PayloadCMS returns data in a 'doc' property for single item updates
    const data = responseData.doc || responseData
    const convertedTask = convertToStoreTask(data as import('@/payload-types').Task)
    logInfo('Task created successfully', {
      component: 'Kanban',
      action: 'create-task',
      taskId: convertedTask.id,
    })
    return convertedTask
  } catch (error) {
    logDbError('create-kanban-task', error)
    return null
  }
}

// Update task using PayloadCMS built-in REST API
export async function updateKanbanTask(
  id: string,
  taskData: Partial<CreateTaskData>,
): Promise<Task | null> {
  try {
    // Get JWT token from cookies for authentication
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('payload-token='))
      ?.split('=')[1]

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    // Ensure we're sending the correct format for PayloadCMS
    const payloadData = {
      ...taskData,
      // Ensure status is a string ID for relationship
      status:
        typeof taskData.status === 'string'
          ? taskData.status
          : (taskData.status as unknown as { id: string })?.id,
      // Ensure taskTypes is an array of string IDs
      taskTypes: Array.isArray(taskData.taskTypes) ? taskData.taskTypes : [],
      // Truncate description if it exceeds maxLength (1000)
      description:
        taskData.description && taskData.description.length > 1000
          ? taskData.description.substring(0, 1000)
          : taskData.description,
    }

    const response = await fetch(`/api/tasks/${id}`, {
      method: 'PATCH',
      headers,
      credentials: 'include',
      body: JSON.stringify(payloadData),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      logApiError(`/api/tasks/${id}`, 'PATCH', new Error(JSON.stringify(errorData)), {
        component: 'Kanban',
        action: 'update-task',
        taskId: id,
        status: response.status,
      })
      throw new Error(`Failed to update task: ${response.status} ${response.statusText}`)
    }

    const responseData = await response.json()

    // PayloadCMS returns data in a 'doc' property for single item updates
    const data = responseData.doc || responseData
    return convertToStoreTask(data as import('@/payload-types').Task)
  } catch (error) {
    logDbError('update-kanban-task', error, { taskId: id })
    return null
  }
}

// Delete task using PayloadCMS built-in REST API
export async function deleteKanbanTask(id: string): Promise<boolean> {
  try {
    // Get JWT token from cookies for authentication
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('payload-token='))
      ?.split('=')[1]

    const headers: HeadersInit = {}

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(`/api/tasks/${id}`, {
      method: 'DELETE',
      headers,
      credentials: 'include',
    })

    if (!response.ok) {
      throw new Error('Failed to delete task')
    }

    return true
  } catch (error) {
    logDbError('delete-kanban-task', error, { taskId: id })
    return false
  }
}

// Bulk update tasks using PayloadCMS built-in REST API
export async function bulkUpdateKanbanTasks(tasks: Task[]): Promise<boolean> {
  try {
    const updatePromises = tasks.map((task, index) =>
      fetch(`/api/tasks/${task.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...convertToPayloadTask(task),
          order: index,
        }),
      }),
    )

    const responses = await Promise.all(updatePromises)
    const failedResponses = responses.filter(response => !response.ok)

    if (failedResponses.length > 0) {
      throw new Error('Failed to update some tasks')
    }

    return true
  } catch (error) {
    logDbError('bulk-update-kanban-tasks', error, {
      taskIds: tasks.map(task => task.id),
    })
    return false
  }
}
