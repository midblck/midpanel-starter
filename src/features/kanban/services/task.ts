import { convertToPayloadTask, convertToStoreTask } from './converters';
import type { CreateTaskData, PayloadResponse, Task } from './types';

// Fetch all tasks using PayloadCMS built-in REST API
export async function fetchKanbanTasks(): Promise<Task[]> {
  try {
    console.log('Kanban: Fetching tasks from built-in PayloadCMS API...');

    // Get JWT token from cookies for authentication
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('payload-token='))
      ?.split('=')[1];

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      console.log('Kanban: Using authentication token for API request');
    } else {
      console.log('Kanban: No authentication token found');
    }

    const response = await fetch('/api/tasks?sort=order', {
      headers,
      credentials: 'include', // Include cookies
    });

    console.log('Kanban: API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Kanban: API error response:', errorText);
      throw new Error(
        `Failed to fetch tasks: ${response.status} ${response.statusText}`
      );
    }

    const data: PayloadResponse = await response.json();
    console.log('Kanban: Raw API data received:', data.docs?.length || 0, 'tasks');

    const tasks = Array.isArray(data.docs) ? data.docs.map(convertToStoreTask) : [];
    console.log('Kanban: Converted tasks:', tasks.length, 'tasks');
    console.log('Kanban: Task creators:', tasks.map(t => ({
      id: t.id,
      creator: 'creator' in t ? (t as any).creator : 'unknown',
      title: t.title
    })));

    return tasks;
  } catch (error) {
    console.error('Error fetching kanban tasks:', error);
    return [];
  }
}

// Create task using PayloadCMS built-in REST API
export async function createKanbanTask(
  taskData: CreateTaskData
): Promise<Task | null> {
  try {
    console.log('Kanban: Creating task with data:', taskData);

    // Get JWT token from cookies for authentication
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('payload-token='))
      ?.split('=')[1];

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Truncate description if it exceeds maxLength (1000)
    const payloadData = {
      ...taskData,
      description:
        taskData.description && taskData.description.length > 1000
          ? taskData.description.substring(0, 1000)
          : taskData.description,
    };

    console.log('Kanban: Sending payload with auth:', !!token);
    const response = await fetch('/api/tasks', {
      method: 'POST',
      headers,
      credentials: 'include',
      body: JSON.stringify(payloadData),
    });

    console.log('Kanban: Create response status:', response.status);
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Kanban: Create error response:', errorText);
      throw new Error('Failed to create task');
    }

    const responseData = await response.json();
    console.log('Kanban: Create response data:', responseData);
    // PayloadCMS returns data in a 'doc' property for single item updates
    const data = responseData.doc || responseData;
    const convertedTask = convertToStoreTask(data as import('@/payload-types').Task);
    console.log('Kanban: Converted created task:', convertedTask);
    return convertedTask;
  } catch (error) {
    console.error('Error creating kanban task:', error);
    return null;
  }
}

// Update task using PayloadCMS built-in REST API
export async function updateKanbanTask(
  id: string,
  taskData: Partial<CreateTaskData>
): Promise<Task | null> {
  try {
    // Get JWT token from cookies for authentication
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('payload-token='))
      ?.split('=')[1];

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
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
    };

    const response = await fetch(`/api/tasks/${id}`, {
      method: 'PATCH',
      headers,
      credentials: 'include',
      body: JSON.stringify(payloadData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Update task error response:', errorData);
      throw new Error(
        `Failed to update task: ${response.status} ${response.statusText}`
      );
    }

    const responseData = await response.json();

    // PayloadCMS returns data in a 'doc' property for single item updates
    const data = responseData.doc || responseData;
    return convertToStoreTask(data as import('@/payload-types').Task);
  } catch (error) {
    console.error('Error updating kanban task:', error);
    return null;
  }
}

// Delete task using PayloadCMS built-in REST API
export async function deleteKanbanTask(id: string): Promise<boolean> {
  try {
    // Get JWT token from cookies for authentication
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('payload-token='))
      ?.split('=')[1];

    const headers: HeadersInit = {};

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`/api/tasks/${id}`, {
      method: 'DELETE',
      headers,
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to delete task');
    }

    return true;
  } catch (error) {
    console.error('Error deleting kanban task:', error);
    return false;
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
      })
    );

    const responses = await Promise.all(updatePromises);
    const failedResponses = responses.filter(response => !response.ok);

    if (failedResponses.length > 0) {
      throw new Error('Failed to update some tasks');
    }

    return true;
  } catch (error) {
    console.error('Error bulk updating kanban tasks:', error);
    return false;
  }
}
