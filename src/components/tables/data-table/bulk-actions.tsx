'use client'

import { Badge } from '@/components/ui/badge'
import { logError } from '@/utilities/logger'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Table } from '@tanstack/react-table'
import { Download, MoreHorizontal } from 'lucide-react'
import { useState } from 'react'

export interface BulkActionConfig {
  id: string
  label: string
  icon?: React.ReactNode
  type: 'action' | 'select'
  options?: Array<{ value: string; label: string }>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onAction?: (selectedRows: any[], value?: string) => void
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
}

interface DataTableBulkActionsProps<TData> {
  table: Table<TData>
  actions: BulkActionConfig[]
  selectedCount?: number
}

export function DataTableBulkActions<TData>({
  table,
  actions,
  selectedCount,
}: DataTableBulkActionsProps<TData>) {
  const [isUpdating, setIsUpdating] = useState(false)
  const selectedRows = table.getFilteredSelectedRowModel().rows
  const actualSelectedCount = selectedCount ?? selectedRows.length
  const selectedData = selectedRows.map(row => row.original)

  if (actualSelectedCount === 0) {
    return null
  }

  const handleAction = async (action: BulkActionConfig, value?: string) => {
    if (!action.onAction) return

    setIsUpdating(true)
    try {
      await action.onAction(selectedData, value)
    } catch (error) {
      logError(`Failed to execute bulk action ${action.id}`, error, {
        component: 'BulkActions',
        action: 'execute-bulk-action',
        actionId: action.id,
        selectedCount: selectedData.length,
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const renderAction = (action: BulkActionConfig) => {
    if (action.type === 'select' && action.options) {
      return (
        <div key={action.id} className='flex items-center gap-2'>
          <span className='text-sm font-medium'>{action.label}:</span>
          <Select onValueChange={value => void handleAction(action, value)} disabled={isUpdating}>
            <SelectTrigger className='h-8 w-[140px]'>
              <SelectValue placeholder={`Select ${action.label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {action.options.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )
    }

    return (
      <Button
        key={action.id}
        variant={action.variant || 'outline'}
        size='sm'
        onClick={() => void handleAction(action)}
        disabled={isUpdating}
        className='h-8'
      >
        {action.icon}
        {action.label}
      </Button>
    )
  }

  return (
    <div className='flex items-center gap-2'>
      <Badge variant='secondary' className='h-8 px-2'>
        {actualSelectedCount} selected
      </Badge>

      <div className='flex items-center gap-2'>{actions.map(action => renderAction(action))}</div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='outline' size='sm' className='h-8 px-2'>
            <MoreHorizontal className='h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuLabel>Export</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              // Generic export functionality
              const csvContent = convertToCSV(selectedData)
              downloadFile(csvContent, 'export.csv', 'text/csv')
            }}
          >
            <Download className='mr-2 h-4 w-4' />
            Export as CSV
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              const jsonContent = JSON.stringify(selectedData, null, 2)
              downloadFile(jsonContent, 'export.json', 'application/json')
            }}
          >
            <Download className='mr-2 h-4 w-4' />
            Export as JSON
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

// Helper functions for export
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function convertToCSV(data: any[]): string {
  if (data.length === 0) return ''

  const headers = Object.keys(data[0])
  const csvHeaders = headers.join(',')

  const csvRows = data.map(row =>
    headers
      .map(header => {
        const value = row[header]
        if (value === null || value === undefined) return ''
        if (typeof value === 'object') return JSON.stringify(value)
        return String(value).replace(/"/g, '""')
      })
      .join(',')
  )

  return [csvHeaders, ...csvRows].join('\n')
}

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
