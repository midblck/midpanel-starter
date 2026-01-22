'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Table } from '@tanstack/react-table'
import { X } from 'lucide-react'
import { useState } from 'react'

export interface FilterConfig {
  id: string
  label: string
  type: 'select' | 'text' | 'date' | 'date-range'
  options?: Array<{ value: string; label: string; color?: string }>
  placeholder?: string
  columnId?: string // If different from id
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface DataTableFiltersProps<TData = any> {
  table: Table<TData>
  filters: FilterConfig[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onFilterChange?: (filterId: string, value: any) => void
  onClearFilters?: () => void
}

export function DataTableFilters<TData>({
  table,
  filters,
  onFilterChange,
  onClearFilters,
}: DataTableFiltersProps<TData>) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [filterValues, setFilterValues] = useState<Record<string, any>>({})

  const clearFilters = () => {
    setFilterValues({})

    // Clear all table filters
    filters.forEach(filter => {
      const columnId = filter.columnId || filter.id
      table.getColumn(columnId)?.setFilterValue('')
    })

    onClearFilters?.()
  }

  const applyFilters = () => {
    // Clear all filters first
    filters.forEach(filter => {
      const columnId = filter.columnId || filter.id
      table.getColumn(columnId)?.setFilterValue('')
    })

    // Apply active filters
    Object.entries(filterValues).forEach(([filterId, value]) => {
      if (value) {
        const filter = filters.find(f => f.id === filterId)
        if (filter) {
          const columnId = filter.columnId || filter.id
          table.getColumn(columnId)?.setFilterValue(value)
          onFilterChange?.(filterId, value)
        }
      }
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateFilterValue = (filterId: string, value: any) => {
    setFilterValues(prev => ({
      ...prev,
      [filterId]: value,
    }))
  }

  const removeFilter = (filterId: string) => {
    setFilterValues(prev => {
      const newValues = { ...prev }
      delete newValues[filterId]
      return newValues
    })

    const filter = filters.find(f => f.id === filterId)
    if (filter) {
      const columnId = filter.columnId || filter.id
      table.getColumn(columnId)?.setFilterValue('')
    }
  }

  const activeFilters = Object.entries(filterValues)
    .filter(([_, value]) => value && value !== '')
    .map(([filterId, value]) => {
      const filter = filters.find(f => f.id === filterId)
      if (!filter) return null

      let displayValue = value
      if (filter.type === 'select' && filter.options) {
        const option = filter.options.find(opt => opt.value === value)
        displayValue = option?.label || value
      } else if (filter.type === 'date-range' && typeof value === 'object') {
        displayValue = `${value.startDate || 'Any'} - ${value.endDate || 'Any'}`
      }

      return {
        key: filterId,
        value: displayValue,
        label: filter.label,
      }
    })
    .filter(Boolean) as Array<{ key: string; value: string; label: string }>

  const renderFilter = (filter: FilterConfig) => {
    const value = filterValues[filter.id] || ''

    switch (filter.type) {
      case 'select':
        return (
          <Select
            value={value || undefined}
            onValueChange={val => updateFilterValue(filter.id, val)}
          >
            <SelectTrigger className='h-8'>
              <SelectValue
                placeholder={filter.placeholder || `All ${filter.label.toLowerCase()}`}
              />
            </SelectTrigger>
            <SelectContent>
              {filter.options?.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.color ? (
                    <div className='flex items-center gap-2'>
                      <div
                        className='w-2 h-2 rounded-full'
                        style={{ backgroundColor: option.color }}
                      />
                      {option.label}
                    </div>
                  ) : (
                    option.label
                  )}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )

      case 'text':
        return (
          <Input
            placeholder={filter.placeholder || `Enter ${filter.label.toLowerCase()}...`}
            value={value}
            onChange={e => updateFilterValue(filter.id, e.target.value)}
            className='h-8'
          />
        )

      case 'date':
        return (
          <Input
            type='date'
            placeholder={filter.placeholder || `Select ${filter.label.toLowerCase()}`}
            value={value}
            onChange={e => updateFilterValue(filter.id, e.target.value)}
            className='h-8'
          />
        )

      case 'date-range':
        const dateRange = value || { startDate: '', endDate: '' }
        return (
          <div className='space-y-2'>
            <Input
              type='date'
              placeholder='Start date'
              value={dateRange.startDate}
              onChange={e =>
                updateFilterValue(filter.id, {
                  ...dateRange,
                  startDate: e.target.value,
                })
              }
              className='h-8'
            />
            <Input
              type='date'
              placeholder='End date'
              value={dateRange.endDate}
              onChange={e =>
                updateFilterValue(filter.id, {
                  ...dateRange,
                  endDate: e.target.value,
                })
              }
              className='h-8'
            />
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className='flex items-center gap-2'>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='outline' size='sm' className='h-8 border-dashed'>
            Filters
            {activeFilters.length > 0 && (
              <Badge variant='secondary' className='ml-2 h-5 px-1.5 text-xs'>
                {activeFilters.length}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='start' className='w-[200px]'>
          <DropdownMenuLabel>Filter by</DropdownMenuLabel>
          <DropdownMenuSeparator />

          {filters.map(filter => (
            <div key={filter.id} className='p-2'>
              <label className='text-sm font-medium'>{filter.label}</label>
              {renderFilter(filter)}
            </div>
          ))}

          <DropdownMenuSeparator />
          <div className='flex gap-2 p-2'>
            <Button size='sm' onClick={applyFilters} className='flex-1'>
              Apply
            </Button>
            <Button size='sm' variant='outline' onClick={clearFilters} className='flex-1'>
              Clear
            </Button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Active Filters Display */}
      {activeFilters.length > 0 && (
        <div className='flex items-center gap-1'>
          {activeFilters.map(filter => (
            <Badge key={filter.key} variant='secondary' className='gap-1'>
              {filter.label}: {filter.value}
              <Button
                variant='ghost'
                size='sm'
                className='h-4 w-4 p-0 hover:bg-transparent'
                onClick={() => removeFilter(filter.key)}
              >
                <X className='h-3 w-3' />
              </Button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
