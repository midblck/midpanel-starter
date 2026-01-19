import { convertToStoreTaskType } from './converters';
import type {
  CreateTaskTypeData,
  PayloadTaskTypeResponse,
  TaskType,
  UpdateTaskTypeData,
} from './types';

// Fetch all task types using PayloadCMS built-in REST API
export async function fetchTaskTypes(): Promise<TaskType[]> {
  try {
    const response = await fetch('/api/task-types?sort=order');
    if (!response.ok) {
      throw new Error('Failed to fetch task types');
    }
    const data: PayloadTaskTypeResponse = await response.json();
    return Array.isArray(data.docs)
      ? data.docs.map(convertToStoreTaskType)
      : [];
  } catch (error) {
    console.error('Error fetching task types:', error);
    return [];
  }
}

// Create task type using PayloadCMS built-in REST API
export async function createTaskType(
  taskTypeData: CreateTaskTypeData
): Promise<TaskType | null> {
  try {
    const response = await fetch('/api/task-types', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskTypeData),
    });

    if (!response.ok) {
      throw new Error('Failed to create task type');
    }

    const responseData = await response.json();
    // PayloadCMS returns data in a 'doc' property for single item updates
    const data = responseData.doc || responseData;
    return convertToStoreTaskType(data as import('@/payload-types').TaskType);
  } catch (error) {
    console.error('Error creating task type:', error);
    return null;
  }
}

// Update task type using PayloadCMS built-in REST API
export async function updateTaskType(
  id: string,
  taskTypeData: UpdateTaskTypeData
): Promise<TaskType | null> {
  try {
    const response = await fetch(`/api/task-types/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskTypeData),
    });

    if (!response.ok) {
      throw new Error('Failed to update task type');
    }

    const responseData = await response.json();
    // PayloadCMS returns data in a 'doc' property for single item updates
    const data = responseData.doc || responseData;
    return convertToStoreTaskType(data as import('@/payload-types').TaskType);
  } catch (error) {
    console.error('Error updating task type:', error);
    return null;
  }
}

// Delete task type using PayloadCMS built-in REST API
export async function deleteTaskType(id: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/task-types/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete task type');
    }

    return true;
  } catch (error) {
    console.error('Error deleting task type:', error);
    return false;
  }
}
