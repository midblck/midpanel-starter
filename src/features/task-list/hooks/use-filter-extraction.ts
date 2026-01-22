'use client'

import type { Table } from '@tanstack/react-table'
import { logInfo } from '@/utilities/logger'
import { useCallback } from 'react'
import type { TaskTableData } from '@/types/data-table'

interface FilterObject {
  status?: string
  priority?: string
  assignee?: string
  taskTypes?: string
  search?: string
  dueDateFrom?: string
  dueDateTo?: string
}

export function useFilterExtraction() {
  const extractFilters = useCallback((table: Table<TaskTableData>): FilterObject => {
    const currentFilters = table.getState().columnFilters
    logInfo('Extracting filters from table', {
      component: 'FilterExtraction',
      action: 'extract-filters',
      filterCount: currentFilters.length,
    })

    const filterObj: FilterObject = {}

    currentFilters.forEach(filter => {
      if (filter.id === 'status' && filter.value) {
        filterObj.status = Array.isArray(filter.value) ? filter.value[0] : filter.value
      }
      if (filter.id === 'priority' && filter.value) {
        filterObj.priority = Array.isArray(filter.value) ? filter.value[0] : filter.value
      }
      if (filter.id === 'assignee' && filter.value) {
        filterObj.assignee = Array.isArray(filter.value) ? filter.value[0] : filter.value
      }
      if (filter.id === 'taskTypes' && filter.value) {
        filterObj.taskTypes = Array.isArray(filter.value) ? filter.value[0] : filter.value
      }
      if (filter.id === 'dueDate' && filter.value) {
        const dateFilter = filter.value as {
          startDate: string
          endDate: string
        }
        if (dateFilter.startDate) filterObj.dueDateFrom = dateFilter.startDate
        if (dateFilter.endDate) filterObj.dueDateTo = dateFilter.endDate
      }
      if (filter.id === 'title' && filter.value) {
        filterObj.search = Array.isArray(filter.value) ? filter.value[0] : filter.value
      }
    })

    logInfo('Filter extraction completed', {
      component: 'FilterExtraction',
      action: 'extract-filters',
      extractedFilters: Object.keys(filterObj),
    })
    return filterObj
  }, [])

  return { extractFilters }
}
