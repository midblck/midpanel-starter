import { Active, DataRef } from '@dnd-kit/core'

export const hasDraggableData = (
  active: Active | undefined | null,
): active is Active & {
  data: DataRef<{
    type: string
  }>
} => {
  return Boolean(active?.data.current?.type)
}

export const isTask = (
  active: Active | undefined | null,
): active is Active & {
  data: DataRef<{
    type: 'task'
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    task: any
  }>
} => {
  return hasDraggableData(active) && active.data.current?.type === 'task'
}

export const isColumn = (
  active: Active | undefined | null,
): active is Active & {
  data: DataRef<{
    type: 'column'
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    column: any
  }>
} => {
  return hasDraggableData(active) && active.data.current?.type === 'column'
}

// Priority color function moved to constants.ts
// Use getPriorityColor from '@/features/kanban/constants' instead

export const getPriorityLabel = (priority?: string) => {
  switch (priority) {
    case 'critical':
      return 'Critical'
    case 'high':
      return 'High'
    case 'medium':
      return 'Medium'
    case 'low':
      return 'Low'
    default:
      return 'Medium'
  }
}

export const formatDate = (dateString?: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export const isOverdue = (dueDate?: string, status?: { name: string; color: string }) => {
  if (!dueDate) return false

  // Don't show overdue for Done or Archive tasks
  if (status?.name === 'Done' || status?.name === 'Archive') {
    return false
  }

  return new Date(dueDate) < new Date()
}
