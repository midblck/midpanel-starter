'use client'

import { DataTableColumnHeader } from '@/components/tables'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  formatDate,
  formatDateTime,
  formatTaskPriority,
  formatTaskStatus,
  getDaysUntilDue,
} from '@/lib/data-table'
import type { TaskTableData } from '@/types/data-table'
import { Column, ColumnDef } from '@tanstack/react-table'
import { Copy, Edit, MoreHorizontal, Trash2 } from 'lucide-react'

interface TaskTableColumnsProps {
  onEdit?: (task: TaskTableData) => void
  onDelete?: (task: TaskTableData) => void
}

export const createTaskTableColumns = ({
  onEdit,
  onDelete,
}: TaskTableColumnsProps = {}): ColumnDef<TaskTableData>[] => [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={value => row.toggleSelected(!!value)}
        aria-label='Select row'
      />
    ),
    enableSorting: false,
    enableHiding: false,
    size: 40, // Fixed width for checkbox column
    minSize: 40,
    maxSize: 40,
  },
  {
    id: 'title',
    accessorKey: 'title',
    header: ({ column }: { column: Column<TaskTableData, unknown> }) => (
      <DataTableColumnHeader column={column} title='Title' />
    ),
    size: 300,
    minSize: 200,
    cell: ({ row }) => {
      const title = row.getValue('title') as string
      const description = row.original.description

      return (
        <div className='max-w-[300px]'>
          <div className='font-medium truncate'>{title}</div>
          {description && (
            <div className='text-sm text-muted-foreground truncate'>{description}</div>
          )}
        </div>
      )
    },
    meta: {
      label: 'Title',
      placeholder: 'Search tasks...',
      variant: 'text',
    },
    enableColumnFilter: true,
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: ({ column }: { column: Column<TaskTableData, unknown> }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    size: 120,
    minSize: 100,
    cell: ({ row }) => {
      const status = row.getValue('status') as { name: string; color: string }
      const statusConfig = formatTaskStatus(status)

      return (
        <Badge
          variant='outline'
          className='font-medium'
          style={{ borderColor: status.color + '40', color: status.color }}
        >
          {statusConfig.label}
        </Badge>
      )
    },
    meta: {
      label: 'Status',
      variant: 'multiSelect',
    },
    enableColumnFilter: true,
  },
  {
    id: 'priority',
    accessorKey: 'priority',
    header: ({ column }: { column: Column<TaskTableData, unknown> }) => (
      <DataTableColumnHeader column={column} title='Priority' />
    ),
    size: 100,
    minSize: 80,
    cell: ({ row }) => {
      const priority = row.getValue('priority') as string
      const priorityConfig = formatTaskPriority(priority)

      const priorityVariants = {
        low: 'success' as const,
        medium: 'warning' as const,
        high: 'danger' as const,
        critical: 'danger' as const,
      }

      return (
        <Badge variant={priorityVariants[priority as keyof typeof priorityVariants] || 'warning'}>
          {priorityConfig.label}
        </Badge>
      )
    },
    meta: {
      label: 'Priority',
      variant: 'multiSelect',
      options: [
        { label: 'Low', value: 'low' },
        { label: 'Medium', value: 'medium' },
        { label: 'High', value: 'high' },
        { label: 'Critical', value: 'critical' },
      ],
    },
    enableColumnFilter: true,
  },
  {
    id: 'assignee',
    accessorKey: 'assignee',
    header: ({ column }: { column: Column<TaskTableData, unknown> }) => (
      <DataTableColumnHeader column={column} title='Assignee' />
    ),
    size: 150,
    minSize: 120,
    cell: ({ row }) => {
      const assignee = row.getValue('assignee') as string
      return (
        <div className='max-w-[150px] truncate'>
          {assignee || <span className='text-muted-foreground'>Unassigned</span>}
        </div>
      )
    },
    meta: {
      label: 'Assignee',
      variant: 'multiSelect',
    },
    enableColumnFilter: true,
  },
  {
    id: 'dueDate',
    accessorKey: 'dueDate',
    header: ({ column }: { column: Column<TaskTableData, unknown> }) => (
      <DataTableColumnHeader column={column} title='Due Date' />
    ),
    size: 180,
    minSize: 150,
    cell: ({ row }) => {
      const dueDate = row.getValue('dueDate') as string
      if (!dueDate) {
        return <span className='text-muted-foreground'>No due date</span>
      }

      const status = row.getValue('status') as { name: string; color: string }
      const dueInfo = getDaysUntilDue(dueDate, status)
      return (
        <div className='max-w-[120px]'>
          <div className='text-sm'>{formatDate(dueDate)}</div>
          <div className={`text-xs ${dueInfo.className}`}>{dueInfo.text}</div>
        </div>
      )
    },
    meta: {
      label: 'Due Date',
      variant: 'dateRange',
    },
    enableColumnFilter: true,
  },
  {
    id: 'taskTypes',
    accessorKey: 'taskTypes',
    header: ({ column }: { column: Column<TaskTableData, unknown> }) => (
      <DataTableColumnHeader column={column} title='Types' />
    ),
    size: 150,
    minSize: 120,
    cell: ({ row }) => {
      const taskTypes = row.getValue('taskTypes') as Array<{
        id: string
        name: string
        color: string
      }>
      if (!taskTypes || taskTypes.length === 0) {
        return <span className='text-muted-foreground'>No types</span>
      }

      return (
        <div className='flex flex-wrap gap-1 max-w-[200px]'>
          {taskTypes.map(type => (
            <Badge
              key={type.id}
              variant='outline'
              className='text-xs'
              style={{
                borderColor: type.color + '40',
                color: type.color,
              }}
            >
              {type.name}
            </Badge>
          ))}
        </div>
      )
    },
    meta: {
      label: 'Task Types',
      variant: 'multiSelect',
    },
    enableColumnFilter: true,
  },
  {
    id: 'createdAt',
    accessorKey: 'createdAt',
    header: ({ column }: { column: Column<TaskTableData, unknown> }) => (
      <DataTableColumnHeader column={column} title='Created' />
    ),
    size: 180,
    minSize: 150,
    cell: ({ row }) => {
      const createdAt = row.getValue('createdAt') as string
      return (
        <div className='max-w-[120px] text-sm text-muted-foreground'>
          {formatDateTime(createdAt)}
        </div>
      )
    },
  },
  {
    id: 'actions',
    size: 60,
    minSize: 60,
    maxSize: 60,
    cell: ({ row }) => {
      const task = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0'>
              <span className='sr-only'>Open menu</span>
              <MoreHorizontal className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(task.id)}>
              <Copy className='mr-2 h-4 w-4' />
              Copy ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onEdit?.(task)}>
              <Edit className='mr-2 h-4 w-4' />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem className='text-red-600' onClick={() => void onDelete?.(task)}>
              <Trash2 className='mr-2 h-4 w-4' />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
    enableSorting: false,
    enableHiding: false,
  },
]

// Default columns without callbacks (for backward compatibility)
export const taskTableColumns = createTaskTableColumns()
