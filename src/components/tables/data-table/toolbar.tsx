'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDebouncedCallback } from '@/lib/hooks/use-debounced-callback';
import { cn } from '@/lib/utils';
import { Cross2Icon } from '@radix-ui/react-icons';
import type { Table } from '@tanstack/react-table';
import { Loader2, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { ExportButton } from './export-button';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  data: TData[];
  onSearch?: (searchTerm: string) => void;
  searchPlaceholder?: string;
  filename?: string;
  onBulkDelete?: (selectedRows: TData[]) => void;
  children?: React.ReactNode; // For custom filter components
  className?: string;
  isSearchPending?: boolean; // For useTransition loading state
}

export function DataTableToolbar<TData>({
  table,
  data,
  onSearch,
  searchPlaceholder = 'Search...',
  filename = 'data',
  onBulkDelete,
  children,
  className,
  isSearchPending = false,
}: DataTableToolbarProps<TData>) {
  const [searchValue, setSearchValue] = useState('');
  const isFiltered = table.getState().columnFilters.length > 0;
  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const hasSelectedRows = selectedRows.length > 0;

  const onReset = () => {
    table.resetColumnFilters();
    setSearchValue('');
  };

  const debouncedSearch = useDebouncedCallback((searchTerm: string) => {
    onSearch?.(searchTerm);
  }, 500);

  const handleBulkDelete = () => {
    if (onBulkDelete && hasSelectedRows) {
      onBulkDelete(selectedRows.map(row => row.original));
    }
  };

  return (
    <div
      role='toolbar'
      aria-orientation='horizontal'
      className={cn('flex w-full items-center gap-2 p-1', className)}
    >
      {/* Search */}
      <div className='relative'>
        <Input
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={event => {
            setSearchValue(event.target.value);
          }}
          onBlur={event => {
            const searchTerm = event.target.value;
            debouncedSearch(searchTerm);
          }}
          onKeyDown={event => {
            if (event.key === 'Enter') {
              const searchTerm = event.currentTarget.value;
              debouncedSearch(searchTerm);
            }
          }}
          className='h-8 w-[150px] lg:w-[250px] pr-8'
        />
        {isSearchPending && (
          <Loader2 className='absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground' />
        )}
      </div>

      {/* Custom filters - passed as children */}
      {children}

      {/* Reset filters */}
      {isFiltered && (
        <Button
          aria-label='Reset filters'
          variant='outline'
          size='sm'
          className='border-dashed h-8'
          onClick={onReset}
        >
          <Cross2Icon />
          Reset
        </Button>
      )}

      {/* Export */}
      <ExportButton table={table} data={data} filename={filename} />

      {/* Selected count */}
      {hasSelectedRows && (
        <Badge variant='secondary' className='h-8 px-2'>
          {selectedRows.length} selected
        </Badge>
      )}

      {/* Delete button */}
      {hasSelectedRows && onBulkDelete && (
        <Button
          variant='destructive'
          size='sm'
          className='h-8'
          onClick={handleBulkDelete}
        >
          <Trash2 className='mr-2 h-4 w-4' />
          Delete
        </Button>
      )}
    </div>
  );
}
