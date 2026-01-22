import { convertToStoreStatus } from './converters'
import type { CreateStatusData, PayloadStatusResponse, Status, UpdateStatusData } from './types'
import { logDbError } from '@/utilities/logger'

// Fetch all task statuses using PayloadCMS built-in REST API
export async function fetchTaskStatuses(): Promise<Status[]> {
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

    const response = await fetch('/api/task-statuses?sort=order', {
      headers,
      credentials: 'include',
    })

    if (!response.ok) {
      throw new Error('Failed to fetch task statuses')
    }
    const data: PayloadStatusResponse = await response.json()
    return Array.isArray(data.docs) ? data.docs.map(convertToStoreStatus) : []
  } catch (error) {
    logDbError('fetch-task-statuses', error)
    return []
  }
}

// Create task status using PayloadCMS built-in REST API
export async function createTaskStatus(statusData: CreateStatusData): Promise<Status | null> {
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

    const response = await fetch('/api/task-statuses', {
      method: 'POST',
      headers,
      credentials: 'include',
      body: JSON.stringify(statusData),
    })

    if (!response.ok) {
      throw new Error('Failed to create task status')
    }

    const responseData = await response.json()
    // PayloadCMS returns data in a 'doc' property for single item updates
    const data = responseData.doc || responseData
    return convertToStoreStatus(data as import('@/payload-types').TaskStatus)
  } catch (error) {
    logDbError('create-task-status', error, { statusData })
    return null
  }
}

// Update task status using PayloadCMS built-in REST API
export async function updateTaskStatus(
  id: string,
  statusData: UpdateStatusData
): Promise<Status | null> {
  try {
    const response = await fetch(`/api/task-statuses/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(statusData),
    })

    if (!response.ok) {
      throw new Error('Failed to update task status')
    }

    const responseData = await response.json()
    // PayloadCMS returns data in a 'doc' property for single item updates
    const data = responseData.doc || responseData
    return convertToStoreStatus(data as import('@/payload-types').TaskStatus)
  } catch (error) {
    logDbError('update-task-status', error, { statusId: id, statusData })
    return null
  }
}

// Delete task status using PayloadCMS built-in REST API
export async function deleteTaskStatus(id: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/task-statuses/${id}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      throw new Error('Failed to delete task status')
    }

    return true
  } catch (error) {
    logDbError('delete-task-status', error, { statusId: id })
    return false
  }
}
