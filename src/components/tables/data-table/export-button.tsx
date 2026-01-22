'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { exportToCSV, exportToJSON, getExportFilename } from '@/lib/export-utils'
import type { Table } from '@tanstack/react-table'
import { Download, FileJson, FileText } from 'lucide-react'

interface ExportButtonProps<TData> {
  table: Table<TData>
  data: TData[]
  filename?: string
}

export function ExportButton<TData>({ table, data, filename = 'tasks' }: ExportButtonProps<TData>) {
  const selectedRows = table.getFilteredSelectedRowModel().rows
  const hasSelectedRows = selectedRows.length > 0
  const exportData = hasSelectedRows ? selectedRows.map(row => row.original) : data

  const handleExportCSV = () => {
    const csvFilename = getExportFilename(filename, 'csv')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    exportToCSV(exportData as any[], { filename: csvFilename })
  }

  const handleExportJSON = () => {
    const jsonFilename = getExportFilename(filename, 'json')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    exportToJSON(exportData as any[], { filename: jsonFilename })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='outline'
          size='sm'
          className='h-8 border-dashed'
          disabled={!hasSelectedRows}
        >
          <Download className='mr-2 h-4 w-4' />
          Export
          {hasSelectedRows && (
            <span className='ml-2 text-xs text-muted-foreground'>({selectedRows.length})</span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='start' className='w-[180px]'>
        <DropdownMenuLabel>Export</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleExportCSV} className='cursor-pointer'>
          <FileText className='mr-2 h-4 w-4' />
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportJSON} className='cursor-pointer'>
          <FileJson className='mr-2 h-4 w-4' />
          Export as JSON
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
