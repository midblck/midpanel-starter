import type { FilterOperator, FilterVariant } from '@/types/data-table'
import type { Column } from '@tanstack/react-table'

// Data table configuration
export const dataTableConfig = {
  textOperators: [
    { label: 'Contains', value: 'iLike' as FilterOperator },
    { label: 'Equals', value: 'eq' as FilterOperator },
    { label: 'Starts with', value: 'like' as FilterOperator },
    { label: 'Is empty', value: 'isEmpty' as FilterOperator },
    { label: 'Is not empty', value: 'isNotEmpty' as FilterOperator },
  ],
  numericOperators: [
    { label: 'Equals', value: 'eq' as FilterOperator },
    { label: 'Not equals', value: 'ne' as FilterOperator },
    { label: 'Greater than', value: 'gt' as FilterOperator },
    { label: 'Greater than or equal', value: 'gte' as FilterOperator },
    { label: 'Less than', value: 'lt' as FilterOperator },
    { label: 'Less than or equal', value: 'lte' as FilterOperator },
    { label: 'Between', value: 'between' as FilterOperator },
    { label: 'Is empty', value: 'isEmpty' as FilterOperator },
    { label: 'Is not empty', value: 'isNotEmpty' as FilterOperator },
  ],
  dateOperators: [
    { label: 'Equals', value: 'eq' as FilterOperator },
    { label: 'After', value: 'gt' as FilterOperator },
    { label: 'Before', value: 'lt' as FilterOperator },
    { label: 'Between', value: 'between' as FilterOperator },
    { label: 'Is empty', value: 'isEmpty' as FilterOperator },
    { label: 'Is not empty', value: 'isNotEmpty' as FilterOperator },
  ],
  booleanOperators: [
    { label: 'Is true', value: 'eq' as FilterOperator },
    { label: 'Is false', value: 'ne' as FilterOperator },
  ],
  selectOperators: [
    { label: 'Equals', value: 'eq' as FilterOperator },
    { label: 'Not equals', value: 'ne' as FilterOperator },
    { label: 'Is empty', value: 'isEmpty' as FilterOperator },
    { label: 'Is not empty', value: 'isNotEmpty' as FilterOperator },
  ],
  multiSelectOperators: [
    { label: 'Contains any', value: 'in' as FilterOperator },
    { label: 'Contains all', value: 'in' as FilterOperator },
    { label: 'Does not contain', value: 'notIn' as FilterOperator },
    { label: 'Is empty', value: 'isEmpty' as FilterOperator },
    { label: 'Is not empty', value: 'isNotEmpty' as FilterOperator },
  ],
  filterVariants: [
    'text',
    'number',
    'range',
    'date',
    'dateRange',
    'boolean',
    'select',
    'multiSelect',
  ] as FilterVariant[],
  joinOperators: ['and', 'or'] as const,
  operators: [
    'eq',
    'ne',
    'gt',
    'gte',
    'lt',
    'lte',
    'like',
    'iLike',
    'in',
    'notIn',
    'isEmpty',
    'isNotEmpty',
    'between',
    'notBetween',
  ] as FilterOperator[],
}

export function getCommonPinningStyles<TData>({
  column,
  withBorder = false,
}: {
  column: Column<TData>
  withBorder?: boolean
}): React.CSSProperties {
  const isPinned = column.getIsPinned()
  const isLastLeftPinnedColumn = isPinned === 'left' && column.getIsLastColumn('left')
  const isFirstRightPinnedColumn = isPinned === 'right' && column.getIsFirstColumn('right')

  return {
    boxShadow: withBorder
      ? isLastLeftPinnedColumn
        ? '-4px 0 4px -4px hsl(var(--border)) inset'
        : isFirstRightPinnedColumn
          ? '4px 0 4px -4px hsl(var(--border)) inset'
          : undefined
      : undefined,
    left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
    right: isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
    opacity: isPinned ? 0.97 : 1,
    position: isPinned ? 'sticky' : 'relative',
    background: isPinned ? 'hsl(var(--background))' : 'hsl(var(--background))',
    width: column.getSize(),
    zIndex: isPinned ? 1 : 0,
  }
}

export function getFilterOperators(filterVariant: FilterVariant) {
  const operatorMap: Record<FilterVariant, { label: string; value: FilterOperator }[]> = {
    text: dataTableConfig.textOperators,
    number: dataTableConfig.numericOperators,
    range: dataTableConfig.numericOperators,
    date: dataTableConfig.dateOperators,
    dateRange: dataTableConfig.dateOperators,
    boolean: dataTableConfig.booleanOperators,
    select: dataTableConfig.selectOperators,
    multiSelect: dataTableConfig.multiSelectOperators,
  }

  return operatorMap[filterVariant] ?? dataTableConfig.textOperators
}

export function getDefaultFilterOperator(filterVariant: FilterVariant) {
  const operators = getFilterOperators(filterVariant)
  return operators[0]?.value ?? (filterVariant === 'text' ? 'iLike' : 'eq')
}

export function getValidFilters(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filters: Array<{ id: string; operator: FilterOperator; value: any }>,
) {
  return filters.filter(
    filter =>
      filter.operator === 'isEmpty' ||
      filter.operator === 'isNotEmpty' ||
      (Array.isArray(filter.value)
        ? filter.value.length > 0
        : filter.value !== '' && filter.value !== null && filter.value !== undefined),
  )
}

// Task-specific utilities
export function formatTaskPriority(priority: string) {
  const priorityMap = {
    low: { label: 'Low', color: 'low' },
    medium: { label: 'Medium', color: 'medium' },
    high: { label: 'High', color: 'high' },
    critical: { label: 'Critical', color: 'critical' },
  }

  return priorityMap[priority as keyof typeof priorityMap] || priorityMap.medium
}

export function formatTaskStatus(status: { name: string; color: string }) {
  return {
    label: status.name,
    color: status.color,
    className: 'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
  }
}

export function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function formatDateTime(dateString: string) {
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function getDaysUntilDue(dueDate: string, status?: { name: string; color: string }) {
  // If task is Done or Archive, don't show overdue indicators
  if (status?.name === 'Done') {
    return { text: 'Completed', className: 'text-green-600' }
  }

  if (status?.name === 'Archive') {
    return { text: 'Archived', className: 'text-gray-500' }
  }

  const today = new Date()
  const due = new Date(dueDate)
  const diffTime = due.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays < 0) {
    return {
      text: `Overdue by ${Math.abs(diffDays)} days`,
      className: 'text-red-600',
    }
  } else if (diffDays === 0) {
    return { text: 'Due today', className: 'text-orange-600' }
  } else if (diffDays === 1) {
    return { text: 'Due tomorrow', className: 'text-yellow-600' }
  } else {
    return { text: `Due in ${diffDays} days`, className: 'text-gray-600' }
  }
}
