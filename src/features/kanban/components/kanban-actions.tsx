'use client';

import { DeleteConfirmationDialog } from '@/components/modal';
import type { Column, Task } from '@/features/kanban';
import { useTaskStore } from '@/features/kanban';
import { useDeleteWithConfirmation } from '@/lib/hooks/use-delete-with-confirmation';
import { useState } from 'react';

interface KanbanActionsProps {
  columns: Column[];
  tasks: Task[];
  setColumnToDelete: (column: Column | null) => void;
  setTaskToDelete: (task: Task | null) => void;
}

export function KanbanActions({
  columns,
  tasks,
  setColumnToDelete: setColumnToDeleteState,
  setTaskToDelete: setTaskToDeleteState,
}: KanbanActionsProps) {
  const deleteStatus = useTaskStore(state => state.deleteStatus);
  const deleteTask = useTaskStore(state => state.deleteTask);

  // We need to track the current items to delete locally for the confirmation dialogs
  const [currentColumnToDelete, setCurrentColumnToDelete] =
    useState<Column | null>(null);
  const [currentTaskToDelete, setCurrentTaskToDelete] = useState<Task | null>(
    null
  );

  const deleteColumnConfirmation = useDeleteWithConfirmation({
    onDelete: async () => {
      if (!currentColumnToDelete) return false;
      const result = await deleteStatus(currentColumnToDelete.id);
      if (result) {
        setColumnToDeleteState(null);
        setCurrentColumnToDelete(null);
      }
      return result;
    },
    itemName: currentColumnToDelete?.title,
    successMessage: 'Column deleted successfully',
    errorMessage: 'Failed to delete column',
  });

  const deleteTaskConfirmation = useDeleteWithConfirmation({
    onDelete: async () => {
      if (!currentTaskToDelete) return false;
      const result = await deleteTask(currentTaskToDelete.id);
      if (result) {
        setTaskToDeleteState(null);
        setCurrentTaskToDelete(null);
      }
      return result;
    },
    itemName: currentTaskToDelete?.title,
    successMessage: 'Task deleted successfully',
    errorMessage: 'Failed to delete task',
  });

  const handleDeleteTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setTaskToDeleteState(task);
      setCurrentTaskToDelete(task);
      deleteTaskConfirmation.openDialog();
    }
  };

  const handleDeleteColumn = (columnId: string) => {
    const column = columns.find(col => col.id === columnId);
    if (column) {
      setColumnToDeleteState(column);
      setCurrentColumnToDelete(column);
      deleteColumnConfirmation.openDialog();
    }
  };

  const handleEditTask = (task: Task) => {
    window.dispatchEvent(
      new CustomEvent('kanban-edit-task', { detail: { task } })
    );
  };

  const handleAddTask = (columnId: string) => {
    window.dispatchEvent(
      new CustomEvent('kanban-add-task', { detail: { columnId } })
    );
  };

  const handleEditColumn = () => {
    // The EditColumnDialog will handle the editing
  };

  return {
    handleDeleteTask,
    handleDeleteColumn,
    handleEditTask,
    handleAddTask,
    handleEditColumn,
    deleteColumnConfirmation,
    deleteTaskConfirmation,
    columnToDelete: currentColumnToDelete,
    taskToDelete: currentTaskToDelete,
  };
}

export function KanbanActionDialogs({
  deleteColumnConfirmation,
  deleteTaskConfirmation,
  columnToDelete,
  taskToDelete,
}: {
  deleteColumnConfirmation: ReturnType<typeof useDeleteWithConfirmation>;
  deleteTaskConfirmation: ReturnType<typeof useDeleteWithConfirmation>;
  columnToDelete: Column | null;
  taskToDelete: Task | null;
}) {
  return (
    <>
      <DeleteConfirmationDialog
        open={deleteColumnConfirmation.isOpen}
        onOpenChange={deleteColumnConfirmation.closeDialog}
        onConfirm={deleteColumnConfirmation.handleDelete}
        title='Delete Column'
        description='Are you sure you want to delete this column? Tasks with this status will be moved to the first available status.'
        itemName={columnToDelete?.title}
        isLoading={deleteColumnConfirmation.isLoading}
      />

      <DeleteConfirmationDialog
        open={deleteTaskConfirmation.isOpen}
        onOpenChange={deleteTaskConfirmation.closeDialog}
        onConfirm={deleteTaskConfirmation.handleDelete}
        title='Delete Task'
        description='Are you sure you want to delete this task? This action cannot be undone.'
        itemName={taskToDelete?.title}
        isLoading={deleteTaskConfirmation.isLoading}
      />
    </>
  );
}
