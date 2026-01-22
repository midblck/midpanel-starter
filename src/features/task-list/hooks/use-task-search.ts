'use client'

import type { Table } from '@tanstack/react-table'
import { useCallback, useTransition } from 'react'

interface UseTaskSearchProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  table: Table<any>
  fetchTasks: (
    page: number,
    limit: number,
    sort: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    filters: any,
    includeFilterOptions?: boolean
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ) => Promise<any>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  extractFilters: (table: Table<any>) => any
}

export function useTaskSearch({ table, fetchTasks, extractFilters }: UseTaskSearchProps) {
  const [isPending, startTransition] = useTransition()

  const handleSearch = useCallback(
    (searchTerm: string) => {
      // Use useTransition for non-urgent search updates
      startTransition(() => {
        // Reset to first page when searching
        table.setPageIndex(0)

        // Trigger a refetch with the search term
        const currentState = table.getState()
        const currentPage = 1 // Always start from page 1 when searching
        const currentPageSize = currentState.pagination.pageSize
        const sortString = '-createdAt'

        const filterObj = extractFilters(table)

        if (searchTerm) {
          filterObj.search = searchTerm
        }

        void fetchTasks(currentPage, currentPageSize, sortString, filterObj, false)
      })
    },
    [table, fetchTasks, extractFilters, startTransition]
  )

  return { handleSearch, isPending }
}
