'use client';

import type { TaskTableData } from '@/types/data-table';
import { useCallback, useEffect, useRef, useState } from 'react';
import useSWR, { mutate } from 'swr';

interface TaskDataState {
  data: TaskTableData[];
  isLoading: boolean;
  error: string | null;
  pagination:
    | {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      }
    | undefined;
  refreshData: () => void;
}

interface UseTaskDataProps {
  initialData: TaskTableData[];
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

// SWR will use the default fetcher

export function useTaskData({
  initialData,
  initialPagination,
  initialFilterOptions,
}: UseTaskDataProps) {
  const [pagination, setPagination] = useState(initialPagination);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Refs to track previous values and prevent infinite loops
  const prevStateRef = useRef<{
    pageIndex: number;
    pageSize: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sorting: any[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    columnFilters: any[];
  } | null>(null);

  // Build SWR key based on current filters (will be passed from useTaskPagination)
  const [currentKey, setCurrentKey] = useState<string | null>(null);

  // SWR hook for data fetching with automatic deduplication and caching
  const { data: swrData, error, isLoading, mutate: swrMutate } = useSWR(
    currentKey,
    {
      fallbackData: initialData.length > 0 ? { docs: initialData, ...initialPagination } : undefined,
      revalidateOnFocus: false, // Disable revalidation on window focus for better UX
      revalidateOnReconnect: true,
      dedupingInterval: 2000, // Dedupe requests within 2 seconds
      errorRetryCount: 3,
    }
  );

  // Extract data from SWR response
  const data = swrData?.docs || initialData;
  const paginationData = swrData ? {
    page: swrData.page,
    limit: swrData.limit,
    total: swrData.totalDocs,
    totalPages: swrData.totalPages,
  } : pagination;

  // Server-side data fetching function (now uses SWR mutate)
  const fetchTasks = useCallback(
    async (
      page: number,
      limit: number,
      sort: string,
      filters: {
        status?: string;
        priority?: string;
        assignee?: string;
        taskTypes?: string;
        search?: string;
        dueDateFrom?: string;
        dueDateTo?: string;
      } = {},
      includeFilterOptions: boolean = false
    ) => {
      try {
        const searchParams = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          sort,
        });

        // Add filter parameters
        if (filters.status) searchParams.append('status', filters.status);
        if (filters.priority) searchParams.append('priority', filters.priority);
        if (filters.assignee) searchParams.append('assignee', filters.assignee);
        if (filters.taskTypes)
          searchParams.append('taskTypes', filters.taskTypes);
        if (filters.search) searchParams.append('search', filters.search);
        if (filters.dueDateFrom)
          searchParams.append('dueDateFrom', filters.dueDateFrom);
        if (filters.dueDateTo)
          searchParams.append('dueDateTo', filters.dueDateTo);

        if (includeFilterOptions) {
          searchParams.append('includeFilterOptions', 'true');
        }

        const url = `/api/task-list?${searchParams}`;

        // Update the SWR key to trigger a new request
        setCurrentKey(url);

        // Use SWR's mutate to update the cache optimistically
        const result = await swrMutate();

        if (result) {
          setPagination({
            page: result.page,
            limit: result.limit,
            total: result.totalDocs,
            totalPages: result.totalPages,
          });
        }

        return result;
      } catch (err) {
        console.error('Failed to fetch tasks:', err);
        throw err;
      }
    },
    [swrMutate]
  );

  // Fetch filter options on initial load
  useEffect(() => {
    if (!initialFilterOptions) {
      void fetchTasks(1, 10, '-createdAt', {}, true);
    }
    setIsInitialLoad(false);
  }, [fetchTasks, initialFilterOptions]);

  // Function to manually refresh data
  const refreshData = useCallback(() => {
    if (currentKey) {
      swrMutate();
    }
  }, [currentKey, swrMutate]);

  // Function to update data optimistically
  const updateData = useCallback((updater: (currentData: TaskTableData[]) => TaskTableData[]) => {
    swrMutate((current: any) => {
      if (!current) return current;
      return {
        ...current,
        docs: updater(current.docs || [])
      };
    }, false); // false = don't revalidate after optimistic update
  }, [swrMutate]);

  return {
    data,
    setData: updateData,
    isLoading,
    error: error?.message || null,
    pagination: paginationData,
    setPagination,
    isInitialLoad,
    fetchTasks,
    prevStateRef,
    refreshData,
  };
}
