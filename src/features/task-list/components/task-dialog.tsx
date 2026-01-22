'use client'

import { NewTaskDialog } from '@/features/kanban'
import type { TaskTableData } from '@/types/data-table'

interface TaskDialogProps {
  trigger?: React.ReactNode
  editingTask?: TaskTableData | null
  onTaskChange?: () => void
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function TaskDialog({
  trigger,
  editingTask,
  onTaskChange,
  open,
  onOpenChange,
}: TaskDialogProps) {
  // Convert TaskTableData to kanban Task format for the dialog
  const kanbanTask = editingTask
    ? {
        id: editingTask.id,
        title: editingTask.title,
        description: editingTask.description,
        status: {
          id: editingTask.status.id,
          name: editingTask.status.name,
          color: editingTask.status.color,
          order: 0, // Default order for status
        },
        priority: editingTask.priority,
        assignee: editingTask.assignee,
        dueDate: editingTask.dueDate,
        taskTypes: (editingTask.taskTypes || []).map(tt => ({
          id: tt.id,
          name: tt.name,
          color: tt.color,
          order: 0, // Default order for task type
        })),
        order: editingTask.order,
        createdAt: editingTask.createdAt,
        updatedAt: editingTask.updatedAt,
      }
    : null

  const handleTaskChange = () => {
    // Refresh the task list data
    if (onTaskChange) {
      onTaskChange()
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    // When dialog closes, refresh the data
    if (!newOpen) {
      handleTaskChange()
    }

    // Call the original onOpenChange if provided
    if (onOpenChange) {
      onOpenChange(newOpen)
    }
  }

  return (
    <NewTaskDialog
      trigger={trigger}
      open={open}
      onOpenChange={handleOpenChange}
      editingTask={kanbanTask}
    />
  )
}
