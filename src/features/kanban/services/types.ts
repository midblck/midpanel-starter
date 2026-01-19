// Re-export types for convenience
export type { Status, Task, TaskType } from '../store';

// PayloadCMS types - use directly from @/payload-types

// API Response types
export interface PayloadResponse {
  docs: import('@/payload-types').Task[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}

export interface PayloadStatusResponse {
  docs: import('@/payload-types').TaskStatus[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}

export interface PayloadTaskTypeResponse {
  docs: import('@/payload-types').TaskType[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}

// Request data types
export interface CreateTaskData {
  title: string;
  description?: string;
  status?: string; // TaskStatus ID
  priority?: 'low' | 'medium' | 'high' | 'critical';
  assignee?: string;
  dueDate?: string;
  taskTypes?: string[]; // TaskType IDs
  order?: number;
}

export interface CreateStatusData {
  name: string;
  description?: string;
  color?: string;
  order?: number;
}

export interface UpdateStatusData {
  name?: string;
  description?: string;
  color?: string;
  order?: number;
}

export interface CreateTaskTypeData {
  name: string;
  description?: string;
  color?: string;
  order?: number;
}

export interface UpdateTaskTypeData {
  name?: string;
  description?: string;
  color?: string;
  order?: number;
}
