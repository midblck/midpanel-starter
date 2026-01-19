'use client';

import { PageContainer, PageHeader } from '@/components/layout';
import { Button } from '@/components/ui/button';
import {
  AddStatusDialog,
  DateRangeFilter,
  KanbanBoard,
  NewTaskDialog,
} from '@/features/kanban';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { Task as StoreTask } from '@/features/kanban/store';
import type { Task as PayloadTask, TaskStatus, TaskType as PayloadTaskType } from '@/payload-types';

// Convert PayloadCMS Task to Store Task format
function convertPayloadTaskToStoreTask(payloadTask: PayloadTask): StoreTask {
  const status = payloadTask.status as TaskStatus;
  const taskTypes = payloadTask.taskTypes as PayloadTaskType[];

  return {
    id: payloadTask.id,
    title: payloadTask.title,
    description: payloadTask.description || undefined,
    status: {
      id: status.id,
      name: status.name,
      description: status.description || undefined,
      color: status.color,
      order: status.order,
    },
    priority: payloadTask.priority,
    assignee: payloadTask.assignee || undefined,
    dueDate: payloadTask.dueDate || undefined,
    taskTypes: taskTypes?.map(type => ({
      id: type.id,
      name: type.name,
      description: type.description || undefined,
      color: type.color,
      order: type.order || 0,
    })),
    order: payloadTask.order || 0,
    createdAt: payloadTask.createdAt,
    updatedAt: payloadTask.updatedAt,
  };
}

export default function KanbanPage() {
  const [newTaskDialogOpen, setNewTaskDialogOpen] = useState(false);
  const [selectedColumnId, setSelectedColumnId] = useState<string>('');
  const [editingTask, setEditingTask] = useState<StoreTask | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleTaskChange = () => {
    // Trigger a refresh by updating the key
    setRefreshKey(prev => prev + 1);
  };

  useEffect(() => {
    const handleAddTask = (event: CustomEvent<{ columnId: string }>) => {
      setSelectedColumnId(event.detail.columnId);
      setEditingTask(null);
      setNewTaskDialogOpen(true);
    };

    const handleEditTask = (event: CustomEvent<{ task: PayloadTask }>) => {
      setEditingTask(convertPayloadTaskToStoreTask(event.detail.task));
      setSelectedColumnId('');
      setNewTaskDialogOpen(true);
    };

    window.addEventListener('kanban-add-task', handleAddTask as EventListener);
    window.addEventListener(
      'kanban-edit-task',
      handleEditTask as EventListener
    );

    return () => {
      window.removeEventListener(
        'kanban-add-task',
        handleAddTask as EventListener
      );
      window.removeEventListener(
        'kanban-edit-task',
        handleEditTask as EventListener
      );
    };
  }, []);

  return (
    <PageContainer>
      <PageHeader
        title='Kanban Board'
        description='Manage your tasks with drag and drop'
      >
        <div className='flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto'>
          <DateRangeFilter />
          <Button
            variant='default'
            className='h-8 sm:h-10 w-full sm:w-auto touch-manipulation text-xs sm:text-sm px-3 sm:px-4 rounded-md compact-mobile'
            onClick={() => setNewTaskDialogOpen(true)}
          >
            <Plus className='mr-1.5 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4' />
            Add Task
          </Button>
          <AddStatusDialog />
        </div>
      </PageHeader>

      <NewTaskDialog
        open={newTaskDialogOpen}
        onOpenChange={open => {
          setNewTaskDialogOpen(open);
          if (!open) {
            setSelectedColumnId('');
            setEditingTask(null);
          }
        }}
        columnId={selectedColumnId}
        editingTask={editingTask}
        onTaskChange={handleTaskChange}
      />

      <KanbanBoard key={refreshKey} />
    </PageContainer>
  );
}
