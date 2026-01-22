'use client';

import type { Table } from '@tanstack/react-table';
import { useCallback } from 'react';
import type { TaskTableData } from '@/types/data-table';

interface FilterObject {
  status?: string;
  priority?: string;
  assignee?: string;
  taskTypes?: string;
  search?: string;
  dueDateFrom?: string;
  dueDateTo?: string;
}

export function useFilterExtraction() {
  const extractFilters = useCallback(
    (table: Table<TaskTableData>): FilterObject => {
      const currentFilters = table.getState().columnFilters;
      console.log('Current column filters:', currentFilters);

      const filterObj: FilterObject = {};

      currentFilters.forEach(filter => {
        if (filter.id === 'status' && filter.value) {
          filterObj.status = Array.isArray(filter.value)
            ? filter.value[0]
            : filter.value;
        }
        if (filter.id === 'priority' && filter.value) {
          filterObj.priority = Array.isArray(filter.value)
            ? filter.value[0]
            : filter.value;
        }
        if (filter.id === 'assignee' && filter.value) {
          filterObj.assignee = Array.isArray(filter.value)
            ? filter.value[0]
            : filter.value;
        }
        if (filter.id === 'taskTypes' && filter.value) {
          filterObj.taskTypes = Array.isArray(filter.value)
            ? filter.value[0]
            : filter.value;
        }
        if (filter.id === 'dueDate' && filter.value) {
          const dateFilter = filter.value as {
            startDate: string;
            endDate: string;
          };
          if (dateFilter.startDate)
            filterObj.dueDateFrom = dateFilter.startDate;
          if (dateFilter.endDate) filterObj.dueDateTo = dateFilter.endDate;
        }
        if (filter.id === 'title' && filter.value) {
          filterObj.search = Array.isArray(filter.value)
            ? filter.value[0]
            : filter.value;
        }
      });

      console.log('Extracted filter object:', filterObj);
      return filterObj;
    },
    []
  );

  return { extractFilters };
}
