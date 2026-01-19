'use client';

import {
  DataTableFilters,
  type FilterConfig,
} from '@/components/tables/data-table/filters';
import type { Table } from '@tanstack/react-table';

interface FiltersProps<TData> {
  table: Table<TData>;
  statusOptions?: Array<{ value: string; label: string; color: string }>;
  priorityOptions?: Array<{ value: string; label: string }>;
  assigneeOptions?: Array<{ value: string; label: string }>;
  taskTypesOptions?: Array<{ value: string; label: string; color: string }>;
  onStatusFilter?: (status: string) => void;
  onPriorityFilter?: (priority: string) => void;
  onAssigneeFilter?: (assignee: string) => void;
  onTaskTypesFilter?: (taskTypes: string) => void;
  onDateRangeFilter?: (startDate: string, endDate: string) => void;
}

export function Filters<TData>({
  table,
  statusOptions = [],
  priorityOptions = [],
  assigneeOptions: _assigneeOptions = [],
  taskTypesOptions = [],
  onStatusFilter,
  onPriorityFilter,
  onAssigneeFilter,
  onTaskTypesFilter,
  onDateRangeFilter,
}: FiltersProps<TData>) {
  const filters: FilterConfig[] = [
    {
      id: 'status',
      label: 'Status',
      type: 'select',
      options: statusOptions,
      placeholder: 'All statuses',
    },
    {
      id: 'priority',
      label: 'Priority',
      type: 'select',
      options: priorityOptions,
      placeholder: 'All priorities',
    },
    {
      id: 'assignee',
      label: 'Assignee',
      type: 'text',
      placeholder: 'Enter assignee name...',
    },
    {
      id: 'taskTypes',
      label: 'Types',
      type: 'select',
      options: taskTypesOptions,
      placeholder: 'All types',
    },
    {
      id: 'dueDate',
      label: 'Due Date Range',
      type: 'date-range',
    },
  ];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFilterChange = (filterId: string, value: any) => {
    switch (filterId) {
      case 'status':
        onStatusFilter?.(value);
        break;
      case 'priority':
        onPriorityFilter?.(value);
        break;
      case 'assignee':
        onAssigneeFilter?.(value);
        break;
      case 'taskTypes':
        onTaskTypesFilter?.(value);
        break;
      case 'dueDate':
        if (value && typeof value === 'object') {
          onDateRangeFilter?.(value.startDate || '', value.endDate || '');
        }
        break;
    }
  };

  return (
    <DataTableFilters
      table={table}
      filters={filters}
      onFilterChange={handleFilterChange}
    />
  );
}
