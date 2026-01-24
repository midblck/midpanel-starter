'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { Column, Task } from '@/features/kanban'
import { useTaskStore } from '@/features/kanban'
import { useDroppable } from '@dnd-kit/core'
import { ChevronLeft, ChevronRight, MoreHorizontal, Plus } from 'lucide-react'
import { useCallback } from 'react'
import EditColumnDialog from './edit-column-dialog'
import { DropZone, DropZoneAfterTask, InsertionIndicator } from './insertion-indicator'
import { TaskCard } from './task-card'

export interface BoardColumnProps {
  column: Column
  tasks: Task[]
  onAddTask?: (columnId: string) => void
  onEditTask?: (task: Task) => void
  onDeleteTask?: (taskId: string) => void
  onEditColumn?: (column: Column) => void
  onDeleteColumn?: (columnId: string) => void
}

export function BoardColumn({
  column,
  tasks,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onDeleteColumn,
}: BoardColumnProps) {
  const statuses = useTaskStore(state => state.statuses)
  const updateStatusOrders = useTaskStore(state => state.updateStatusOrders)
  const currentStatus = statuses.find((s: { id: string }) => s.id === column.id)

  // Determine if this is first or last column
  const currentIndex = statuses.findIndex((s: { id: string }) => s.id === column.id)
  const isFirstColumn = currentIndex === 0
  const isLastColumn = currentIndex === statuses.length - 1

  // Move column functions
  const moveColumnLeft = useCallback(
    async (columnId: string) => {
      if (isFirstColumn) return

      const newStatuses = [...statuses]
      const currentIndex = newStatuses.findIndex((s: { id: string }) => s.id === columnId)
      const newIndex = currentIndex - 1

      // Swap positions
      ;[newStatuses[currentIndex], newStatuses[newIndex]] = [
        newStatuses[newIndex],
        newStatuses[currentIndex],
      ]

      // Update store
      useTaskStore.getState().setStatuses(newStatuses)

      // Update database
      await updateStatusOrders()
    },
    [isFirstColumn, statuses, updateStatusOrders],
  )

  const moveColumnRight = useCallback(
    async (columnId: string) => {
      if (isLastColumn) return

      const newStatuses = [...statuses]
      const currentIndex = newStatuses.findIndex((s: { id: string }) => s.id === columnId)
      const newIndex = currentIndex + 1

      // Swap positions
      ;[newStatuses[currentIndex], newStatuses[newIndex]] = [
        newStatuses[newIndex],
        newStatuses[currentIndex],
      ]

      // Update store
      useTaskStore.getState().setStatuses(newStatuses)

      // Update database
      await updateStatusOrders()
    },
    [isLastColumn, statuses, updateStatusOrders],
  )

  // Column is no longer draggable - only uses arrow buttons for reordering

  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: column.id,
    data: {
      type: 'column',
      column,
    },
  })

  // Top drop zone for placing tasks at the top
  const { setNodeRef: setTopDropRef, isOver: isTopOver } = useDroppable({
    id: `${column.id}-top`,
    data: {
      type: 'drop-zone',
      columnId: column.id,
      position: 'top',
    },
  })

  // No drag styling needed since columns are not draggable

  const sortedTasks = tasks.sort((a, b) => {
    // Always prioritize order field for consistent sorting
    const aOrder = a.order ?? 0
    const bOrder = b.order ?? 0

    if (aOrder !== bOrder) {
      return aOrder - bOrder
    }

    // Fallback to updatedAt (newest first) if orders are equal
    const aTime = new Date(a.updatedAt || a.createdAt || 0).getTime()
    const bTime = new Date(b.updatedAt || b.createdAt || 0).getTime()
    return bTime - aTime
  })

  return (
    <Card
      ref={setDroppableRef}
      style={{
        borderTopColor: currentStatus?.color || undefined,
        borderTopWidth: currentStatus?.color ? '3px' : undefined,
      }}
      className={`w-full sm:w-80 flex-shrink-0 transition-all duration-200 hover:shadow-lg snap-start ${
        isOver ? 'ring-2 ring-primary ring-opacity-50 bg-primary/5' : ''
      }`}
    >
      <CardHeader className='pb-3 px-3 sm:px-6'>
        <div className='flex items-center justify-between gap-2'>
          <div className='flex items-center gap-2 min-w-0 flex-1'>
            {currentStatus?.color && (
              <div
                className='w-3 h-3 rounded-full flex-shrink-0'
                style={{ backgroundColor: currentStatus.color }}
              />
            )}
            <div className='flex flex-col min-w-0 flex-1'>
              <CardTitle className='text-sm font-semibold truncate'>{column.title}</CardTitle>
              {currentStatus?.description && (
                <p className='text-xs text-muted-foreground mt-0.5 line-clamp-1'>
                  {currentStatus.description}
                </p>
              )}
            </div>
            <Badge variant='secondary' className='text-xs ml-2 flex-shrink-0'>
              {tasks.length}
            </Badge>
          </div>
          <div className='flex items-center gap-1'>
            {/* Column reorder buttons */}
            <div className='flex items-center gap-1 mr-2'>
              <Button
                variant='ghost'
                size='sm'
                className='h-8 w-8 sm:h-6 sm:w-6 p-0 hover:bg-gray-100 touch-manipulation'
                onClick={() => moveColumnLeft(column.id)}
                disabled={isFirstColumn}
                aria-label='Move column left'
              >
                <ChevronLeft className='h-4 w-4 sm:h-3 sm:w-3' />
              </Button>
              <Button
                variant='ghost'
                size='sm'
                className='h-8 w-8 sm:h-6 sm:w-6 p-0 hover:bg-gray-100 touch-manipulation'
                onClick={() => moveColumnRight(column.id)}
                disabled={isLastColumn}
                aria-label='Move column right'
              >
                <ChevronRight className='h-4 w-4 sm:h-3 sm:w-3' />
              </Button>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant='ghost'
                  size='sm'
                  className='h-8 w-8 sm:h-6 sm:w-6 p-0 touch-manipulation'
                >
                  <MoreHorizontal className='h-4 w-4 sm:h-3 sm:w-3' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                <EditColumnDialog
                  column={column}
                  trigger={
                    <DropdownMenuItem onSelect={e => e.preventDefault()}>
                      Edit Column
                    </DropdownMenuItem>
                  }
                />
                <DropdownMenuItem
                  onClick={() => onDeleteColumn?.(column.id)}
                  className='text-red-600'
                >
                  Delete Column
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      <CardContent ref={setDroppableRef} className='pt-0 space-y-2 min-h-[200px] px-3 sm:px-6'>
        {/* Top drop zone for placing tasks at the top */}
        <DropZone id={`${column.id}-top`} isActive={isTopOver} className='min-h-1'>
          <div ref={setTopDropRef} className='h-2 -mt-2' />
          <InsertionIndicator isVisible={isTopOver} />
        </DropZone>

        {sortedTasks.map((task, index) => (
          <div key={task.id}>
            <TaskCard task={task} onEdit={onEditTask} onDelete={onDeleteTask} />
            {/* Drop zone after each task for precise insertion */}
            <DropZoneAfterTask
              columnId={column.id}
              taskId={task.id}
              position={index + 1}
              isHovered={false}
            />
          </div>
        ))}

        <Button
          variant='outline'
          size='sm'
          className={`w-full h-10 sm:h-8 text-muted-foreground hover:text-foreground transition-all duration-200 touch-manipulation ${
            isOver ? 'border-primary bg-primary/10' : ''
          }`}
          onClick={() => onAddTask?.(column.id)}
        >
          <Plus className='h-4 w-4 sm:h-3 sm:w-3 mr-1' />
          <span className='text-sm sm:text-xs'>
            {isOver ? 'Drop here to add task' : 'Add Task'}
          </span>
        </Button>
      </CardContent>
    </Card>
  )
}

export function BoardContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex gap-4 sm:gap-6 overflow-x-auto pb-4 min-h-[600px] px-2 sm:px-0 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent'>
      {children}
    </div>
  )
}
