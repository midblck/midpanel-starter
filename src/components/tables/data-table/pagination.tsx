'use client'

import type { Table } from '@tanstack/react-table'

import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'

interface DataTablePaginationProps<TData> {
  table: Table<TData>
}

export function DataTablePagination<TData>({ table }: DataTablePaginationProps<TData>) {
  return (
    <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-2 sm:px-4 py-2'>
      {/* Selected rows count - hidden on mobile */}
      <div className='hidden sm:flex flex-1 text-sm text-muted-foreground'>
        {table.getFilteredSelectedRowModel().rows.length} of{' '}
        {table.getFilteredRowModel().rows.length} row(s) selected.
      </div>

      {/* Mobile: Compact layout */}
      <div className='flex sm:hidden items-center justify-between w-full'>
        <div className='text-xs text-muted-foreground'>
          {table.getFilteredRowModel().rows.length} row(s)
        </div>
        <div className='flex items-center gap-1'>
          <Button
            variant='outline'
            className='h-9 w-9 p-0 touch-manipulation'
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            aria-label='Previous page'
          >
            <ChevronLeft className='h-4 w-4' />
          </Button>
          <div className='flex min-w-[80px] items-center justify-center text-xs font-medium px-2'>
            {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
          </div>
          <Button
            variant='outline'
            className='h-9 w-9 p-0 touch-manipulation'
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            aria-label='Next page'
          >
            <ChevronRight className='h-4 w-4' />
          </Button>
        </div>
      </div>

      {/* Desktop: Full layout */}
      <div className='hidden sm:flex items-center space-x-4 lg:space-x-6'>
        <div className='flex items-center space-x-2'>
          <p className='hidden lg:inline text-sm font-medium'>Rows per page</p>
          <p className='lg:hidden text-xs text-muted-foreground'>Per page</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={value => {
              table.setPageSize(Number(value))
            }}
          >
            <SelectTrigger className='h-8 w-[70px] touch-manipulation'>
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side='top'>
              {[10, 20, 30, 40, 50].map(pageSize => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className='flex min-w-[100px] items-center justify-center text-sm font-medium'>
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </div>
        <div className='flex items-center space-x-2'>
          <Button
            variant='outline'
            className='hidden h-8 w-8 p-0 lg:flex touch-manipulation'
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            aria-label='Go to first page'
          >
            <span className='sr-only'>Go to first page</span>
            <ChevronsLeft className='h-4 w-4' />
          </Button>
          <Button
            variant='outline'
            className='h-8 w-8 p-0 touch-manipulation'
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            aria-label='Go to previous page'
          >
            <span className='sr-only'>Go to previous page</span>
            <ChevronLeft className='h-4 w-4' />
          </Button>
          <Button
            variant='outline'
            className='h-8 w-8 p-0 touch-manipulation'
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            aria-label='Go to next page'
          >
            <span className='sr-only'>Go to next page</span>
            <ChevronRight className='h-4 w-4' />
          </Button>
          <Button
            variant='outline'
            className='hidden h-8 w-8 p-0 lg:flex touch-manipulation'
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            aria-label='Go to last page'
          >
            <span className='sr-only'>Go to last page</span>
            <ChevronsRight className='h-4 w-4' />
          </Button>
        </div>
      </div>
    </div>
  )
}
