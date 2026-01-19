'use client';

import {
  DataTableBulkActions,
  type BulkActionConfig,
} from '@/components/tables/data-table/bulk-actions';
import {
  exportToCSV,
  exportToJSON,
  getExportFilename,
} from '@/lib/export-utils';
import type { Table } from '@tanstack/react-table';
import { FileJson, FileText, Flag, Tag, Trash2, User } from 'lucide-react';

interface BulkActionsProps<TData> {
  table: Table<TData>;
  statusOptions?: Array<{ value: string; label: string; color: string }>;
  priorityOptions?: Array<{ value: string; label: string }>;
  assigneeOptions?: Array<{ value: string; label: string }>;
  onBulkDelete?: (selectedRows: TData[]) => void;
  onBulkUpdateStatus?: (selectedRows: TData[], status: string) => void;
  onBulkUpdatePriority?: (selectedRows: TData[], priority: string) => void;
  onBulkAssign?: (selectedRows: TData[], assignee: string) => void;
  onBulkExport?: (selectedRows: TData[], format: 'csv' | 'json') => void;
  filename?: string;
}

export function BulkActions<TData>({
  table,
  statusOptions = [],
  priorityOptions = [],
  assigneeOptions = [],
  onBulkDelete,
  onBulkUpdateStatus,
  onBulkUpdatePriority,
  onBulkAssign,
  onBulkExport: _onBulkExport,
  filename = 'tasks',
}: BulkActionsProps<TData>) {
  const handleExportCSV = (selectedRows: TData[]) => {
    const csvFilename = getExportFilename(filename, 'csv');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    exportToCSV(selectedRows as any[], { filename: csvFilename });
  };

  const handleExportJSON = (selectedRows: TData[]) => {
    const jsonFilename = getExportFilename(filename, 'json');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    exportToJSON(selectedRows as any[], { filename: jsonFilename });
  };

  const actions: BulkActionConfig[] = [
    {
      id: 'delete',
      label: 'Delete',
      icon: <Trash2 className='mr-2 h-4 w-4' />,
      type: 'action',
      variant: 'destructive',
      onAction: onBulkDelete,
    },
    {
      id: 'updateStatus',
      label: 'Status',
      icon: <Flag className='mr-2 h-4 w-4' />,
      type: 'select',
      options: statusOptions,
      onAction: (selectedRows, value) =>
        onBulkUpdateStatus?.(selectedRows, value || ''),
    },
    {
      id: 'updatePriority',
      label: 'Priority',
      icon: <Tag className='mr-2 h-4 w-4' />,
      type: 'select',
      options: priorityOptions,
      onAction: (selectedRows, value) =>
        onBulkUpdatePriority?.(selectedRows, value || ''),
    },
    {
      id: 'assign',
      label: 'Assignee',
      icon: <User className='mr-2 h-4 w-4' />,
      type: 'select',
      options: assigneeOptions,
      onAction: (selectedRows, value) =>
        onBulkAssign?.(selectedRows, value || ''),
    },
    {
      id: 'exportCSV',
      label: 'Export CSV',
      icon: <FileText className='mr-2 h-4 w-4' />,
      type: 'action',
      variant: 'outline',
      onAction: handleExportCSV,
    },
    {
      id: 'exportJSON',
      label: 'Export JSON',
      icon: <FileJson className='mr-2 h-4 w-4' />,
      type: 'action',
      variant: 'outline',
      onAction: handleExportJSON,
    },
  ];

  return <DataTableBulkActions table={table} actions={actions} />;
}
