'use client'

import { useState } from 'react'

interface FilterOptions {
  statusOptions: Array<{ value: string; label: string; color: string }>
  priorityOptions: Array<{ value: string; label: string }>
  assigneeOptions: Array<{ value: string; label: string }>
  taskTypesOptions: Array<{ value: string; label: string; color: string }>
}

interface UseFilterOptionsProps {
  initialFilterOptions?: {
    statuses: Array<{ value: string; label: string; color: string }>
    taskTypes: Array<{ value: string; label: string; color: string }>
    assignees: Array<{ value: string; label: string }>
  }
}

export function useFilterOptions({ initialFilterOptions }: UseFilterOptionsProps) {
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    statusOptions: initialFilterOptions?.statuses || [],
    priorityOptions: [
      { value: 'low', label: 'Low' },
      { value: 'medium', label: 'Medium' },
      { value: 'high', label: 'High' },
      { value: 'critical', label: 'Critical' },
    ],
    assigneeOptions: initialFilterOptions?.assignees || [],
    taskTypesOptions: initialFilterOptions?.taskTypes || [],
  })

  const updateFilterOptions = (newOptions: Partial<FilterOptions>) => {
    setFilterOptions(prev => ({
      ...prev,
      ...newOptions,
    }))
  }

  return {
    filterOptions,
    setFilterOptions,
    updateFilterOptions,
  }
}
