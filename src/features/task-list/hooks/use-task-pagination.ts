'use client'

import type { Table } from '@tanstack/react-table'
import { useEffect } from 'react'

interface UseTaskPaginationProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  table: Table<any>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialData: any[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialFilterOptions?: any
  fetchTasks: (
    page: number,
    limit: number,
    sort: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    filters: any,
    includeFilterOptions?: boolean,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ) => Promise<any>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  extractFilters: (table: Table<any>) => any
  prevStateRef: React.MutableRefObject<{
    pageIndex: number
    pageSize: number
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sorting: any[]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    columnFilters: any[]
  } | null>
}

export function useTaskPagination({
  table,
  initialData,
  initialFilterOptions,
  fetchTasks,
  extractFilters,
  prevStateRef,
}: UseTaskPaginationProps) {
  useEffect(() => {
    // Only fetch if we have initial data (to avoid fetching on mount)
    if (initialData.length === 0 && !initialFilterOptions) return

    const currentState = table.getState()
    const currentPage = currentState.pagination.pageIndex + 1
    const currentPageSize = currentState.pagination.pageSize

    // Check if pagination or filters have actually changed to prevent infinite loops
    const prevState = prevStateRef.current
    if (
      prevState &&
      prevState.pageIndex === currentState.pagination.pageIndex &&
      prevState.pageSize === currentState.pagination.pageSize &&
      JSON.stringify(prevState.columnFilters) === JSON.stringify(currentState.columnFilters)
    ) {
      return // No change, skip fetch
    }

    // Update ref with current pagination and filter state
    prevStateRef.current = {
      pageIndex: currentState.pagination.pageIndex,
      pageSize: currentState.pagination.pageSize,
      sorting: [], // Not used for server-side
      columnFilters: currentState.columnFilters,
    }

    // Use default sorting for server-side pagination
    const sortString = '-createdAt'

    // Extract filters and fetch tasks
    const filterObj = extractFilters(table)
    void fetchTasks(currentPage, currentPageSize, sortString, filterObj, false)
  }, [
    table.getState().pagination.pageIndex,
    table.getState().pagination.pageSize,
    table.getState().columnFilters,
    fetchTasks,
    extractFilters,
    initialData.length,
    initialFilterOptions,
    prevStateRef,
  ])
}
