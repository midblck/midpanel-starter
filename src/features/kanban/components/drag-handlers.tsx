'use client'

import type { Column, Task } from '@/features/kanban'
import { logError } from '@/utilities/logger'
import { hasDraggableData, useTaskStore } from '@/features/kanban'
import {
  DndContext,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
// arrayMove removed - no longer needed for column reordering
import { useRef, useState } from 'react'

export type ColumnId = string

interface DragHandlersProps {
  children: React.ReactNode
  columns: Column[]
  tasks: Task[]
  // Column drop zone hover removed - using arrow buttons for reordering
}

export function DragHandlers({ children, columns, tasks }: DragHandlersProps) {
  // Column drag state removed - using arrow buttons for reordering
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const [, setHoveredDropZone] = useState<string | null>(null)
  const pickedUpTaskColumn = useRef<ColumnId>('')

  const setTasks = useTaskStore(state => state.setTasks)
  const dragTask = useTaskStore(state => state.dragTask)
  const updateTask = useTaskStore(state => state.updateTask)
  const recalculateColumnOrders = useTaskStore(state => state.recalculateColumnOrders)

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 100,
        tolerance: 5,
      },
    }),
  )

  const columnsId = columns.map(col => col.id)

  // Column drag effect removed - using arrow buttons for reordering

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    if (!hasDraggableData(active)) return

    const data = active.data.current
    if (!data) return

    if (data.type === 'task') {
      setActiveTask(data.task)
      pickedUpTaskColumn.current = data.task.status.id
    }

    dragTask(active.id as string)
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!hasDraggableData(active) || !over) return

    const data = active.data.current
    if (!data) return

    // Column drag handling removed - using arrow buttons for reordering

    if (data.type === 'task') {
      const overId = over.id
      const activeTask = Array.isArray(tasks) ? tasks.find(t => t.id === active.id) : undefined
      if (!activeTask) return

      // Task dragging - only handle task-related interactions
      const overData = over.data?.current

      // Column hover states removed - using arrow buttons for reordering

      // Check if we're hovering over a task drop zone
      if (overData?.type === 'drop-zone') {
        setHoveredDropZone(overId as string)
        return
      }

      // Check if we're hovering over a between-task drop zone
      if (overData?.type === 'drop-zone-after') {
        setHoveredDropZone(overId as string)
        return
      }

      if (active.id !== overId) {
        const overColumnPosition = columnsId.findIndex(id => id === overId)

        if (overColumnPosition !== -1) {
          const newStatusId = overId as string
          if (activeTask.status.id !== newStatusId) {
            // Find the new status object from the columns/statuses
            const newStatus = columns.find(col => col.id === newStatusId)
            const statuses = useTaskStore.getState().statuses
            const statusInfo = statuses.find((s: { id: string }) => s.id === newStatusId)

            const updatedTask = {
              ...activeTask,
              status: {
                id: newStatusId,
                name: statusInfo?.name || newStatus?.title || 'Unknown',
                color: statusInfo?.color || '#6B7280',
                order: statusInfo?.order || 0,
                description: statusInfo?.description,
              },
            }

            setTasks(tasks.map((task: Task) => (task.id === active.id ? updatedTask : task)))
          }
        } else {
          const activeIndex = Array.isArray(tasks) ? tasks.findIndex(t => t.id === active.id) : -1
          const overIndex = Array.isArray(tasks) ? tasks.findIndex(t => t.id === overId) : -1

          if (activeIndex !== -1 && overIndex !== -1 && activeIndex !== overIndex) {
            const activeTask = tasks[activeIndex]
            const overTask = tasks[overIndex]

            if (activeTask.status.id === overTask.status.id) {
              const nextItems = [...tasks]
              const [movedItem] = nextItems.splice(activeIndex, 1)
              nextItems.splice(overIndex, 0, movedItem)
              setTasks(nextItems)
            }
          }
        }
      }
    }
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    if (!hasDraggableData(active) || !over) return

    const data = active.data.current
    if (!data) return

    // Clear hover state
    setHoveredDropZone(null)

    if (data.type === 'task') {
      const overId = over.id
      const taskId = active.id as string
      const activeTask = tasks.find(t => t.id === taskId)

      if (!activeTask) return

      // Check if we're dropping on a drop zone
      const overData = over.data?.current
      const isDroppingOnDropZone = overData?.type === 'drop-zone'
      const isDroppingOnBetweenTaskZone = overData?.type === 'drop-zone-after'
      const isDroppingOnColumn = overData?.type === 'column' || columnsId.includes(overId as string)

      if (isDroppingOnBetweenTaskZone) {
        // Task dropped on a between-task drop zone - insert at specific position
        const { columnId, insertionIndex } = overData

        if (activeTask.status.id !== columnId) {
          // Task moved to different column - insert at specific position
          try {
            // Update the moved task to the insertion position
            await updateTask(taskId, {
              status: columnId,
              order: insertionIndex,
            })

            // Shift tasks at and after the insertion point down
            const targetColumnTasks = tasks.filter(
              t => t.status && t.status.id === columnId && t.id !== taskId,
            )

            for (const task of targetColumnTasks) {
              const currentOrder = task.order ?? 0
              if (currentOrder >= insertionIndex) {
                await updateTask(task.id, { order: currentOrder + 1 })
              }
            }
          } catch (error) {
            logError('Failed to insert task at position', error, {
              component: 'DragHandlers',
              action: 'insert-task',
              taskId,
              insertionIndex,
            })
          }
        } else {
          // Task moved within same column - insert at specific position
          try {
            await updateTask(taskId, { order: insertionIndex })
            await recalculateColumnOrders(columnId, insertionIndex + 1)
          } catch (error) {
            logError('Failed to reorder task within column', error, {
              component: 'DragHandlers',
              action: 'reorder-within-column',
              taskId,
              columnId,
              insertionIndex,
            })
          }
        }
      } else if (isDroppingOnDropZone) {
        // Task dropped on a drop zone - place at top
        const targetColumnId = overData.columnId

        if (activeTask.status.id !== targetColumnId) {
          // Task moved to different column - place at top (order 0)
          try {
            // First, shift all tasks in target column down
            const targetColumnTasks = tasks.filter(
              t => t.status && t.status.id === targetColumnId && t.id !== taskId,
            )

            // Update the moved task to order 0
            await updateTask(taskId, {
              status: targetColumnId,
              order: 0,
            })

            // Shift other tasks in the target column down
            for (let i = 0; i < targetColumnTasks.length; i++) {
              const task = targetColumnTasks[i]
              if (task && (task.order ?? 0) !== i + 1) {
                await updateTask(task.id, { order: i + 1 })
              }
            }
          } catch (error) {
            logError('Failed to update task status', error, {
              component: 'DragHandlers',
              action: 'update-task-status',
            })
          }
        } else {
          // Task moved within same column - place at top
          try {
            await updateTask(taskId, { order: 0 })
            await recalculateColumnOrders(targetColumnId, 1)
          } catch (error) {
            logError('Failed to reorder task', error, {
              component: 'DragHandlers',
              action: 'reorder-task',
            })
          }
        }
      } else if (isDroppingOnColumn) {
        // Task dropped on column (fallback) - place at top
        const targetColumnId = overData?.type === 'column' ? overId : overData?.column?.id || overId

        if (activeTask.status.id !== targetColumnId) {
          try {
            // First, shift all tasks in target column down
            const targetColumnTasks = tasks.filter(
              t => t.status && t.status.id === targetColumnId && t.id !== taskId,
            )

            // Update the moved task to order 0
            await updateTask(taskId, {
              status: targetColumnId,
              order: 0,
            })

            // Shift other tasks in the target column down
            for (let i = 0; i < targetColumnTasks.length; i++) {
              const task = targetColumnTasks[i]
              if (task && (task.order ?? 0) !== i + 1) {
                await updateTask(task.id, { order: i + 1 })
              }
            }
          } catch (error) {
            logError('Failed to update task status', error, {
              component: 'DragHandlers',
              action: 'update-task-status',
            })
          }
        }
      } else if (active.id !== overId) {
        // Task reordered within same column by dragging over another task
        const activeIndex = tasks.findIndex(t => t.id === active.id)
        const overIndex = tasks.findIndex(t => t.id === overId)

        if (activeIndex !== -1 && overIndex !== -1 && activeIndex !== overIndex) {
          const columnTasks = tasks.filter(t => t.status && t.status.id === activeTask.status.id)
          const sortedColumnTasks = [...columnTasks]
          const [movedItem] = sortedColumnTasks.splice(activeIndex, 1)
          sortedColumnTasks.splice(overIndex, 0, movedItem)

          // Update order for all tasks in the column
          for (let i = 0; i < sortedColumnTasks.length; i++) {
            const task = sortedColumnTasks[i]
            if (task && (task.order ?? 0) !== i) {
              await updateTask(task.id, { order: i })
            }
          }
        }
      } else {
        // Task dropped in same position - check if status changed during drag
        const originalStatusId = pickedUpTaskColumn.current
        const currentStatusId = activeTask.status.id

        if (originalStatusId !== currentStatusId) {
          try {
            // Place at top of new column
            await updateTask(taskId, {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              status: currentStatusId as any,
              order: 0,
            })
            await recalculateColumnOrders(currentStatusId, 1)
          } catch (error) {
            logError('Failed to save status change', error, {
              component: 'DragHandlers',
              action: 'save-status-change',
            })
          }
        }
      }
    }

    // Column drag end handling removed - using arrow buttons for reordering

    setActiveTask(null)
    dragTask(null)
  }

  const handleDragCancel = () => {
    setActiveTask(null)
    setHoveredDropZone(null)
    dragTask(null)
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      {children}
      <DragOverlay>
        {activeTask && (
          <div className='rotate-3'>
            {/* TaskCard will be imported dynamically */}
            <div className='bg-white p-3 rounded-lg shadow-lg border'>{activeTask.title}</div>
          </div>
        )}
        {/* Column drag overlay removed - using arrow buttons for reordering */}
      </DragOverlay>
    </DndContext>
  )
}
