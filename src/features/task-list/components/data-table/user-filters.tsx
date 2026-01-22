'use client'

import { DataTableFilters, type FilterConfig } from '@/components/tables/data-table/filters'
import type { Table } from '@tanstack/react-table'

interface UserFiltersProps<TData> {
  table: Table<TData>
  roleOptions?: Array<{ value: string; label: string; color: string }>
  departmentOptions?: Array<{ value: string; label: string }>
  onRoleFilter?: (role: string) => void
  onDepartmentFilter?: (department: string) => void
  onEmailFilter?: (email: string) => void
  onDateRangeFilter?: (startDate: string, endDate: string) => void
}

export function UserFilters<TData>({
  table,
  roleOptions = [],
  departmentOptions = [],
  onRoleFilter,
  onDepartmentFilter,
  onEmailFilter,
  onDateRangeFilter,
}: UserFiltersProps<TData>) {
  const filters: FilterConfig[] = [
    {
      id: 'role',
      label: 'Role',
      type: 'select',
      options: roleOptions,
      placeholder: 'All roles',
    },
    {
      id: 'department',
      label: 'Department',
      type: 'select',
      options: departmentOptions,
      placeholder: 'All departments',
    },
    {
      id: 'email',
      label: 'Email',
      type: 'text',
      placeholder: 'Enter email...',
    },
    {
      id: 'createdAt',
      label: 'Created Date Range',
      type: 'date-range',
    },
  ]

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFilterChange = (filterId: string, value: any) => {
    switch (filterId) {
      case 'role':
        onRoleFilter?.(value)
        break
      case 'department':
        onDepartmentFilter?.(value)
        break
      case 'email':
        onEmailFilter?.(value)
        break
      case 'createdAt':
        if (value && typeof value === 'object') {
          onDateRangeFilter?.(value.startDate || '', value.endDate || '')
        }
        break
    }
  }

  return <DataTableFilters table={table} filters={filters} onFilterChange={handleFilterChange} />
}
