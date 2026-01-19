'use client';

import {
  ErrorBoundary,
  InlineErrorFallback,
  TaskListErrorFallback,
} from '@/components/error-boundary';
import { DeleteConfirmationDialog } from '@/components/modal';
import { DataTable, DataTableToolbar } from '@/components/tables';
import { Button } from '@/components/ui/button';
import { useDataTable } from '@/lib/hooks/use-data-table';
import type { TaskTableData } from '@/types/data-table';
import { Plus } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';
import {
  useFilterExtraction,
  useFilterOptions,
  useTaskData,
  useTaskPagination,
  useTaskSearch,
} from '../hooks';
import { deleteTask } from '../services/task-table';
import { Filters } from './data-table';
import { TaskDialog } from './task-dialog';
import { createTaskTableColumns } from './task-table-columns';

interface TaskTableProps {
  initialData?: TaskTableData[];
  initialPagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  initialFilterOptions?: {
    statuses: Array<{ value: string; label: string; color: string }>;
    taskTypes: Array<{ value: string; label: string; color: string }>;
    assignees: Array<{ value: string; label: string }>;
  };
}

export function TaskTable({
  initialData = [],
  initialPagination,
  initialFilterOptions,
}: TaskTableProps) {
  const [editingTask, setEditingTask] = useState<TaskTableData | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [tasksToDelete, setTasksToDelete] = useState<TaskTableData[]>([]);
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false);

  // Data management
  const {
    data,
    isLoading,
    error,
    pagination,
    isInitialLoad,
    fetchTasks,
    prevStateRef,
    refreshData,
  } = useTaskData({
    initialData,
    initialPagination,
    initialFilterOptions,
  });

  // Filter options management
  const { filterOptions } = useFilterOptions({
    initialFilterOptions,
  });

  // Filter extraction
  const { extractFilters } = useFilterExtraction();

  // Task handlers
  const handleCreateTask = () => {
    setIsCreateDialogOpen(true);
  };

  const handleEditTask = (task: TaskTableData) => {
    setEditingTask(task);
  };

  const handleDeleteTask = async (task: TaskTableData) => {
    setTasksToDelete([task]);
    setIsBulkDeleteDialogOpen(true);
  };

  const confirmDeleteTasks = async () => {
    try {
      const deletePromises = tasksToDelete.map(task => deleteTask(task.id));
      await Promise.all(deletePromises);

      toast.success(`${tasksToDelete.length} task(s) deleted successfully`);

      // Clear selection and refresh data
      table.resetRowSelection();
      refreshData();

      // Close dialog
      setIsBulkDeleteDialogOpen(false);
      setTasksToDelete([]);
    } catch (error) {
      toast.error('Failed to delete tasks');
      console.error('Error deleting tasks:', error);
    }
  };

  const handleTaskChange = () => {
    // Refresh the data when a task is created or updated
    refreshData();
    setEditingTask(null);
    setIsCreateDialogOpen(false);
  };

  // Bulk delete handler
  const handleBulkDelete = (selectedRows: TaskTableData[]) => {
    if (selectedRows.length === 0) {
      toast.error('No tasks selected');
      return;
    }
    setTasksToDelete(selectedRows);
    setIsBulkDeleteDialogOpen(true);
  };

  // Table configuration
  const { table } = useDataTable({
    data,
    columns: createTaskTableColumns({
      onEdit: handleEditTask,
      onDelete: handleDeleteTask,
    }),
    pageCount: pagination?.totalPages || -1,
    initialState: {
      pagination: {
        pageIndex: (pagination?.page || 1) - 1,
        pageSize: pagination?.limit || 10,
      },
      sorting: [], // Default sort by created date
    },
    shallow: false, // Enable URL state management
    debounceMs: 500,
    // Use hybrid mode: server-side pagination and filtering, client-side sorting
    manualPagination: true,
    manualSorting: false, // Allow client-side sorting
    manualFiltering: true, // Enable server-side filtering
  });

  // Set initial sorting after table is created and data is loaded
  React.useEffect(() => {
    if (
      data.length > 0 &&
      table.getAllColumns().some(col => col.id === 'createdAt')
    ) {
      table.setSorting([{ id: 'createdAt', desc: true }]);
    }
  }, [data.length, table]);

  // Search functionality
  const { handleSearch, isPending: isSearchPending } = useTaskSearch({
    table,
    fetchTasks,
    extractFilters,
  });

  // Pagination and filter changes
  useTaskPagination({
    table,
    initialData,
    initialFilterOptions,
    fetchTasks,
    extractFilters,
    prevStateRef,
  });

  // Note: enhancedFetchTasks was removed as it's not currently used

  if (error) {
    return (
      <InlineErrorFallback
        error={new Error(error)}
        title='Failed to load tasks'
        description='There was an error loading the task list. Please try again.'
      />
    );
  }

  return (
    <ErrorBoundary
      fallback={
        <TaskListErrorFallback error={new Error('Task list failed to load')} />
      }
    >
      <div className='space-y-4'>
        <div className='flex justify-between items-center'>
          <h2 className='text-2xl font-bold tracking-tight'>Tasks</h2>
          <Button onClick={handleCreateTask}>
            <Plus className='mr-2 h-4 w-4' />
            Create Task
          </Button>
        </div>

        <DataTable table={table} isLoading={isLoading && isInitialLoad}>
          <DataTableToolbar
            table={table}
            data={data}
            onSearch={handleSearch}
            searchPlaceholder='Search tasks...'
            filename='tasks'
            onBulkDelete={handleBulkDelete}
            isSearchPending={isSearchPending}
          >
            <Filters
              table={table}
              statusOptions={filterOptions.statusOptions}
              priorityOptions={filterOptions.priorityOptions}
              assigneeOptions={filterOptions.assigneeOptions}
              taskTypesOptions={filterOptions.taskTypesOptions}
              onStatusFilter={(status: string) => {
                table.getColumn('status')?.setFilterValue(status);
              }}
              onPriorityFilter={(priority: string) => {
                table.getColumn('priority')?.setFilterValue(priority);
              }}
              onAssigneeFilter={(assignee: string) => {
                table.getColumn('assignee')?.setFilterValue(assignee);
              }}
              onTaskTypesFilter={(taskTypes: string) => {
                table.getColumn('taskTypes')?.setFilterValue(taskTypes);
              }}
              onDateRangeFilter={(startDate: string, endDate: string) => {
                table
                  .getColumn('dueDate')
                  ?.setFilterValue({ startDate, endDate });
              }}
            />
          </DataTableToolbar>
        </DataTable>

        {/* Task Dialogs */}
        <TaskDialog
          editingTask={editingTask}
          onTaskChange={handleTaskChange}
          open={!!editingTask}
          onOpenChange={open => !open && setEditingTask(null)}
        />

        <TaskDialog
          editingTask={null}
          onTaskChange={handleTaskChange}
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
        />

        {/* Delete Confirmation Dialog */}
        <DeleteConfirmationDialog
          open={isBulkDeleteDialogOpen}
          onOpenChange={setIsBulkDeleteDialogOpen}
          onConfirm={confirmDeleteTasks}
          title='Delete Tasks'
          description={
            tasksToDelete.length === 1
              ? `Are you sure you want to delete "${tasksToDelete[0]?.title}"? This action cannot be undone.`
              : `Are you sure you want to delete ${tasksToDelete.length} selected tasks? This action cannot be undone.`
          }
        />
      </div>
    </ErrorBoundary>
  );
}
