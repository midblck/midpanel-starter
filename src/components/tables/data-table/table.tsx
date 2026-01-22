import { flexRender, type Table as TanstackTable } from '@tanstack/react-table'
import type * as React from 'react'

import { getCommonPinningStyles } from '@/lib/data-table'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../table'
import { DataTablePagination } from './pagination'

interface DataTableProps<TData> extends React.ComponentProps<'div'> {
  table: TanstackTable<TData>
  actionBar?: React.ReactNode
  isLoading?: boolean
}

export function DataTable<TData>({
  table,
  actionBar,
  children,
  isLoading = false,
}: DataTableProps<TData>) {
  return (
    <div className='flex flex-1 flex-col space-y-4'>
      {children}
      <div className='relative flex flex-1 rounded-lg border'>
        <div className='w-full h-full flex flex-col'>
          <div className='flex-1 overflow-auto relative'>
            <Table
              className='w-full [&_th]:group [&_th:hover]:bg-muted/30'
              suppressHydrationWarning
            >
              <TableHeader className='bg-muted sticky top-0 z-10'>
                {table.getHeaderGroups().map(headerGroup => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                      <TableHead
                        key={header.id}
                        colSpan={header.colSpan}
                        style={{
                          ...getCommonPinningStyles({ column: header.column }),
                          width: header.getSize(),
                        }}
                        className='relative transition-all duration-200 ease-in-out'
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getCanResize() && (
                          <div
                            className={`absolute right-0 top-0 h-full w-[6px] cursor-col-resize select-none touch-none transition-all duration-200 ease-in-out opacity-0 group-hover:opacity-100 ${
                              header.column.getIsResizing()
                                ? 'opacity-100 bg-primary shadow-lg'
                                : 'bg-border hover:bg-primary/70 hover:w-[8px] hover:shadow-md'
                            }`}
                            onMouseDown={header.getResizeHandler()}
                            onTouchStart={header.getResizeHandler()}
                          />
                        )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  // Loading skeleton
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      {table.getAllColumns().map((column, colIndex) => (
                        <TableCell key={colIndex} className='px-4 py-2'>
                          <div className='h-4 bg-muted animate-pulse rounded' />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map(row => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && 'selected'}
                      className='border-b border-border hover:bg-muted/50'
                    >
                      {row.getVisibleCells().map(cell => (
                        <TableCell
                          key={cell.id}
                          className='px-4 py-2 text-left transition-all duration-200 ease-in-out'
                          style={{
                            ...getCommonPinningStyles({
                              column: cell.column,
                            }),
                            width: cell.column.getSize(),
                          }}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={table.getAllColumns().length} className='h-24 text-center'>
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
      <div className='flex flex-col gap-2.5'>
        <DataTablePagination table={table} />
        {actionBar && table.getFilteredSelectedRowModel().rows.length > 0 && actionBar}
      </div>
    </div>
  )
}
