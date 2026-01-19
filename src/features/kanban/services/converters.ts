import type {
  Task as PayloadTask,
  TaskStatus as PayloadTaskStatus,
  TaskType as PayloadTaskType,
} from '@/payload-types';
import type { CreateTaskData, Status, Task, TaskType } from './types';

// Convert PayloadCMS task status to store status format
export const convertToStoreStatus = (
  payloadStatus: PayloadTaskStatus
): Status => ({
  id: payloadStatus.id,
  name: payloadStatus.name,
  description: payloadStatus.description || undefined,
  color: payloadStatus.color || '#6B7280',
  order: payloadStatus.order || 0,
});

// Convert PayloadCMS task type to store task type format
export const convertToStoreTaskType = (
  payloadTaskType: PayloadTaskType
): TaskType => ({
  id: payloadTaskType.id,
  name: payloadTaskType.name,
  description: payloadTaskType.description || undefined,
  color: payloadTaskType.color || '#6B7280',
  order: payloadTaskType.order || 0,
});

// Convert PayloadCMS task to store task format
export const convertToStoreTask = (payloadTask: PayloadTask): Task => ({
  id: payloadTask.id,
  title: payloadTask.title,
  description: payloadTask.description || undefined,
  status:
    typeof payloadTask.status === 'string'
      ? { id: payloadTask.status, name: 'Unknown', color: '#6B7280', order: 0 }
      : convertToStoreStatus(payloadTask.status),
  priority: payloadTask.priority,
  assignee: payloadTask.assignee || undefined,
  dueDate: payloadTask.dueDate || undefined,
  taskTypes:
    payloadTask.taskTypes?.map((taskType: string | PayloadTaskType) =>
      typeof taskType === 'string'
        ? { id: taskType, name: 'Unknown', color: '#6B7280', order: 0 }
        : convertToStoreTaskType(taskType)
    ) || [],
  order: payloadTask.order || 0,
  createdAt: payloadTask.createdAt,
  updatedAt: payloadTask.updatedAt,
});

// Convert store task to PayloadCMS format
export const convertToPayloadTask = (
  storeTask: Partial<Task>
): Partial<CreateTaskData> => ({
  title: storeTask.title || '',
  description: storeTask.description,
  status:
    typeof storeTask.status === 'string'
      ? storeTask.status
      : storeTask.status?.id,
  priority: storeTask.priority,
  assignee: storeTask.assignee,
  dueDate: storeTask.dueDate,
  taskTypes: storeTask.taskTypes?.map(taskType => taskType.id) || [],
  order: storeTask.order,
});
