'use client';

import {
  ErrorBoundary,
  KanbanErrorFallback,
} from '@/components/error-boundary';
import { KanbanSkeleton } from '@/components/loading/kanban-skeleton';
import type { Column, Task } from '@/features/kanban';
import { useTaskStore } from '@/features/kanban';
import { SortableContext } from '@dnd-kit/sortable';
import { useEffect, useState } from 'react';
import { BoardColumn, BoardContainer } from './board-column';
import { DragHandlers } from './drag-handlers';
// DropZoneAfterColumn removed - using arrow buttons for column reordering
import { KanbanActionDialogs, KanbanActions } from './kanban-actions';

export type ColumnId = string;

export function KanbanBoard() {
  const [isMounted, setIsMounted] = useState(false);
  const [, setColumnToDelete] = useState<Column | null>(null);
  const [, setTaskToDelete] = useState<Task | null>(null);
  // Column drop zones removed - using arrow buttons for reordering

  const columns = useTaskStore((state) => state.columns);
  const tasks = useTaskStore((state) => state.tasks);
  const dateFilter = useTaskStore((state) => state.dateFilter);
  const isTasksLoading = useTaskStore((state) => state.isTasksLoading);
  const isStatusesLoading = useTaskStore((state) => state.isStatusesLoading);
  const loadTasks = useTaskStore((state) => state.loadTasks);
  const loadStatuses = useTaskStore((state) => state.loadStatuses);

  // Calculate filtered tasks and column mapping inline
  const getColumnTasks = (columnId: string) => {
    let filteredTasks = tasks;

    if (dateFilter.enabled) {
      filteredTasks = tasks.filter((task) => {
        if (!task.dueDate) {
          return true;
        }

        const taskDate = new Date(task.dueDate).toISOString().split('T')[0];
        const startDate = dateFilter.startDate;
        const endDate = dateFilter.endDate;

        if (startDate && endDate) {
          return taskDate >= startDate && taskDate <= endDate;
        } else if (startDate) {
          return taskDate >= startDate;
        } else if (endDate) {
          return taskDate <= endDate;
        }

        return true;
      });
    }

    return filteredTasks.filter(task => {
      const taskStatusId = typeof task.status === 'string' ? task.status : task.status.id;
      return taskStatusId === columnId;
    });
  };

  // Set mounted state to prevent hydration issues
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Load tasks and statuses from PayloadCMS on component mount
  useEffect(() => {
    if (!isMounted) return;

    const loadData = async () => {
      await Promise.all([loadStatuses(), loadTasks()]);
    };
    void loadData();
  }, [isMounted, loadStatuses, loadTasks]);

  const columnsId = columns.map((col: Column) => col.id);

  // Get action handlers
  const {
    handleDeleteTask,
    handleDeleteColumn,
    handleEditTask,
    handleAddTask,
    handleEditColumn,
    deleteColumnConfirmation,
    deleteTaskConfirmation,
    columnToDelete: currentColumnToDelete,
    taskToDelete: currentTaskToDelete,
  } = KanbanActions({
    columns,
    tasks,
    setColumnToDelete,
    setTaskToDelete,
  });

  // Show loading skeleton while data is being fetched or before mounting
  if (!isMounted) {
    return <KanbanSkeleton />;
  }

  if (isTasksLoading || isStatusesLoading || columns.length === 0) {
    return <KanbanSkeleton />;
  }

  return (
    <ErrorBoundary
      fallback={
        <KanbanErrorFallback error={new Error('Kanban board failed to load')} />
      }
    >
      <div className='space-y-4' suppressHydrationWarning>
        <ErrorBoundary
          fallback={
            <div className='p-4 text-center text-red-600'>
              Drag handlers failed to load
            </div>
          }
        >
          <DragHandlers columns={columns} tasks={tasks}>
            <BoardContainer>
              <SortableContext items={columnsId} key={columnsId.join(',')}>
                {columns.map((column: Column) => {
                  // Calculate tasks for this column
                  const columnTasks = getColumnTasks(column.id);

                  return (
                    <div key={`column-wrapper-${column.id}`}>
                      <BoardColumn
                        key={`column-${column.id}`}
                        column={column}
                        tasks={columnTasks}
                        onAddTask={handleAddTask}
                        onEditTask={handleEditTask}
                        onDeleteTask={handleDeleteTask}
                        onEditColumn={handleEditColumn}
                        onDeleteColumn={handleDeleteColumn}
                      />
                      {/* Column drop zones removed - using arrow buttons for reordering */}
                    </div>
                  );
                })}
              </SortableContext>
            </BoardContainer>
          </DragHandlers>
        </ErrorBoundary>

        <KanbanActionDialogs
          deleteColumnConfirmation={deleteColumnConfirmation}
          deleteTaskConfirmation={deleteTaskConfirmation}
          columnToDelete={currentColumnToDelete}
          taskToDelete={currentTaskToDelete}
        />
      </div>
    </ErrorBoundary>
  );
}
