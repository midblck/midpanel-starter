'use client'

import {
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnFiltersState,
  type ColumnSizingState,
  type PaginationState,
  type RowSelectionState,
  type SortingState,
  type TableOptions,
  type TableState,
  type Updater,
  type VisibilityState,
} from '@tanstack/react-table'
import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  useQueryState,
  useQueryStates,
  type Parser,
} from 'nuqs'
import * as React from 'react'

import { useDebouncedCallback } from './use-debounced-callback'
import { logWarn } from '@/utilities/logger'
import type { ExtendedColumnSort } from '@/types/data-table'

const PAGE_KEY = 'page'
const PER_PAGE_KEY = 'perPage'
const SORT_KEY = 'sort'
const ARRAY_SEPARATOR = ','
const DEBOUNCE_MS = 300
const THROTTLE_MS = 50

interface UseDataTableProps<TData>
  extends Omit<TableOptions<TData>, 'state' | 'pageCount' | 'getCoreRowModel'>,
    Required<Pick<TableOptions<TData>, 'pageCount'>> {
  initialState?: Omit<Partial<TableState>, 'sorting'> & {
    sorting?: ExtendedColumnSort<TData>[]
  }
  history?: 'push' | 'replace'
  debounceMs?: number
  throttleMs?: number
  clearOnDefault?: boolean
  enableAdvancedFilter?: boolean
  scroll?: boolean
  shallow?: boolean
  startTransition?: React.TransitionStartFunction
  manualPagination?: boolean
  manualSorting?: boolean
  manualFiltering?: boolean
}

export function useDataTable<TData>(props: UseDataTableProps<TData>) {
  const {
    columns,
    pageCount = -1,
    data,
    initialState,
    debounceMs = DEBOUNCE_MS,
    throttleMs = THROTTLE_MS,
    enableAdvancedFilter = false,
    shallow = true,
    manualPagination = true,
    manualSorting = true,
    manualFiltering = true,
    ...tableProps
  } = props

  const queryStateOptions = React.useMemo(
    () => ({
      history: 'replace' as const,
      shallow: true,
      throttleMs: 500,
    }),
    [],
  )

  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>(
    initialState?.rowSelection ?? {},
  )
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>(
    initialState?.columnVisibility ?? {},
  )
  // Load column sizing from localStorage (client-side only)
  const [columnSizing, setColumnSizing] = React.useState<ColumnSizingState>(
    initialState?.columnSizing ?? {},
  )
  const [isHydrated, setIsHydrated] = React.useState(false)

  // Load saved column sizes after hydration
  React.useEffect(() => {
    setIsHydrated(true)

    if (typeof window === 'undefined') return

    try {
      const saved = localStorage.getItem('table-column-sizes')
      if (saved) {
        const parsedSizing = JSON.parse(saved)
        setColumnSizing(parsedSizing)
      }
    } catch (error) {
      logWarn('Failed to load column sizes from localStorage', {
        component: 'DataTable',
        action: 'load-column-sizes',
        error: error instanceof Error ? error.message : String(error),
      })
    }
  }, [])

  // Custom column sizing change handler that saves to localStorage
  const onColumnSizingChange = React.useCallback(
    (updaterOrValue: Updater<ColumnSizingState>) => {
      const newSizing =
        typeof updaterOrValue === 'function' ? updaterOrValue(columnSizing) : updaterOrValue

      setColumnSizing(newSizing)

      // Save to localStorage
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('table-column-sizes', JSON.stringify(newSizing))
        } catch (error) {
          logWarn('Failed to save column sizes to localStorage', {
            component: 'DataTable',
            action: 'save-column-sizes',
            error: error instanceof Error ? error.message : String(error),
          })
        }
      }
    },
    [columnSizing],
  )

  // Simple ref to prevent initial load loops
  const isInitialLoad = React.useRef(true)

  React.useEffect(() => {
    isInitialLoad.current = false
  }, [])

  // URL state management with simple configuration
  const [page, setPage] = useQueryState(
    PAGE_KEY,
    parseAsInteger.withOptions(queryStateOptions).withDefault(1),
  )
  const [perPage, setPerPage] = useQueryState(
    PER_PAGE_KEY,
    parseAsInteger
      .withOptions(queryStateOptions)
      .withDefault(initialState?.pagination?.pageSize ?? 10),
  )

  const pagination: PaginationState = React.useMemo(() => {
    return {
      pageIndex: page - 1, // zero-based index -> one-based index
      pageSize: perPage,
    }
  }, [page, perPage])

  const onPaginationChange = React.useCallback(
    (updaterOrValue: Updater<PaginationState>) => {
      if (typeof updaterOrValue === 'function') {
        const newPagination = updaterOrValue(pagination)
        void setPage(newPagination.pageIndex + 1)
        void setPerPage(newPagination.pageSize)
      } else {
        void setPage(updaterOrValue.pageIndex + 1)
        void setPerPage(updaterOrValue.pageSize)
      }
    },
    [pagination],
  )

  // const columnIds = React.useMemo(() => {
  //   return new Set(
  //     columns.map(column => column.id).filter(Boolean) as string[]
  //   );
  // }, [columns]);

  // URL state management for sorting
  const [sorting, setSorting] = useQueryState(
    SORT_KEY,
    parseAsString.withOptions(queryStateOptions).withDefault(''),
  )

  const parsedSorting: SortingState = React.useMemo(() => {
    if (!sorting) return initialState?.sorting ?? []

    try {
      const parsed = JSON.parse(sorting)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return initialState?.sorting ?? []
    }
  }, [sorting, initialState?.sorting])

  const onSortingChange = React.useCallback(
    (updaterOrValue: Updater<SortingState>) => {
      const newSorting =
        typeof updaterOrValue === 'function' ? updaterOrValue(parsedSorting) : updaterOrValue

      void setSorting(JSON.stringify(newSorting))
    },
    [parsedSorting],
  )

  const filterableColumns = React.useMemo(() => {
    if (enableAdvancedFilter) return []

    return columns.filter(column => column.enableColumnFilter)
  }, [columns, enableAdvancedFilter])

  const filterParsers = React.useMemo(() => {
    if (enableAdvancedFilter) return {}

    return filterableColumns.reduce<Record<string, Parser<string> | Parser<string[]>>>(
      (acc, column) => {
        if (column.meta?.options) {
          acc[column.id ?? ''] = parseAsArrayOf(parseAsString, ARRAY_SEPARATOR).withOptions(
            queryStateOptions,
          )
        } else {
          acc[column.id ?? ''] = parseAsString.withOptions(queryStateOptions)
        }
        return acc
      },
      {},
    )
  }, [filterableColumns, queryStateOptions, enableAdvancedFilter])

  // URL state management for filters
  const [filterValues, setFilterValues] = useQueryStates(filterParsers, queryStateOptions)

  const debouncedSetFilterValues = useDebouncedCallback((values: typeof filterValues) => {
    if (!isInitialLoad.current) {
      void setPage(1)
      void setFilterValues(values)
    }
  }, debounceMs)

  const initialColumnFilters: ColumnFiltersState = React.useMemo(() => {
    if (enableAdvancedFilter) return []

    return Object.entries(filterValues).reduce<ColumnFiltersState>((filters, [key, value]) => {
      if (value !== null) {
        const processedValue = Array.isArray(value)
          ? value
          : typeof value === 'string' && /[^a-zA-Z0-9]/.test(value)
            ? value.split(/[^a-zA-Z0-9]+/).filter(Boolean)
            : [value]

        filters.push({
          id: key,
          value: processedValue,
        })
      }
      return filters
    }, [])
  }, [filterValues, enableAdvancedFilter])

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(initialColumnFilters)

  const onColumnFiltersChange = React.useCallback(
    (updaterOrValue: Updater<ColumnFiltersState>) => {
      if (enableAdvancedFilter) return

      setColumnFilters(prev => {
        const next = typeof updaterOrValue === 'function' ? updaterOrValue(prev) : updaterOrValue

        const filterUpdates = next.reduce<Record<string, string | string[] | null>>(
          (acc, filter) => {
            if (filterableColumns.find(column => column.id === filter.id)) {
              acc[filter.id] = filter.value as string | string[]
            }
            return acc
          },
          {},
        )

        for (const prevFilter of prev) {
          if (!next.some(filter => filter.id === prevFilter.id)) {
            filterUpdates[prevFilter.id] = null
          }
        }

        debouncedSetFilterValues(filterUpdates)
        return next
      })
    },
    [debouncedSetFilterValues, filterableColumns, enableAdvancedFilter],
  )

  const table = useReactTable({
    ...tableProps,
    data,
    columns,
    initialState,
    pageCount,
    state: {
      pagination,
      sorting: parsedSorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      columnSizing: isHydrated ? columnSizing : (initialState?.columnSizing ?? {}),
    },
    defaultColumn: {
      ...tableProps.defaultColumn,
      enableColumnFilter: false,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onPaginationChange,
    onSortingChange,
    onColumnFiltersChange,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnSizingChange,
    enableColumnResizing: true,
    columnResizeMode: 'onEnd',
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    manualPagination,
    manualSorting,
    manualFiltering,
  })

  return { table, shallow, debounceMs, throttleMs, isHydrated }
}
