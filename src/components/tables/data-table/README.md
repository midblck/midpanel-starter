# Reusable Data Table Components

This directory contains fully reusable data table components built with TanStack Table v8, designed to work with any data collection.

## 🏗️ Architecture

### Generic Components (Reusable)

- **`DataTable`** - Main table wrapper component
- **`DataTableToolbar`** - Toolbar with search functionality
- **`DataTablePagination`** - Pagination controls
- **`DataTableColumnHeader`** - Sortable column headers
- **`DataTableFilters`** - Configurable filter system
- **`DataTableBulkActions`** - Configurable bulk actions

### Collection-Specific Components

Located in `src/features/{collection}/components/data-table/`:

- **`Filters`** - Pre-configured for task fields
- **`BulkActions`** - Pre-configured for task operations
- **`UserFilters`** - Example for user collection

## 🚀 Usage

### 1. Using Generic Components Directly

```tsx
import {
  DataTable,
  DataTableToolbar,
  DataTableFilters,
  DataTableBulkActions,
} from '@/components/tables/data-table'

function MyTable({ table }: { table: Table<MyData> }) {
  const filters: FilterConfig[] = [
    {
      id: 'name',
      label: 'Name',
      type: 'text',
      placeholder: 'Enter name...',
    },
    {
      id: 'category',
      label: 'Category',
      type: 'select',
      options: [
        { value: 'tech', label: 'Technology' },
        { value: 'design', label: 'Design' },
      ],
    },
    {
      id: 'dateRange',
      label: 'Date Range',
      type: 'date-range',
    },
  ]

  const actions: BulkActionConfig[] = [
    {
      id: 'delete',
      label: 'Delete',
      type: 'action',
      variant: 'destructive',
      onAction: selectedRows => handleDelete(selectedRows),
    },
    {
      id: 'updateStatus',
      label: 'Status',
      type: 'select',
      options: [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
      ],
      onAction: (selectedRows, status) => handleUpdateStatus(selectedRows, status),
    },
  ]

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table}>
        <DataTableFilters
          table={table}
          filters={filters}
          onFilterChange={(filterId, value) => {
            table.getColumn(filterId)?.setFilterValue(value)
          }}
        />
      </DataTableToolbar>

      <DataTableBulkActions table={table} actions={actions} />
    </DataTable>
  )
}
```

### 2. Using Collection-Specific Components

```tsx
import { DataTable, DataTableToolbar } from '@/components/tables/data-table'
import { Filters, BulkActions } from '@/features/task-list/components/data-table'

function TaskTable({ table }: { table: Table<TaskData> }) {
  return (
    <DataTable table={table}>
      <DataTableToolbar table={table}>
        <Filters
          table={table}
          statusOptions={statusOptions}
          priorityOptions={priorityOptions}
          onStatusFilter={status => table.getColumn('status')?.setFilterValue(status)}
          onPriorityFilter={priority => table.getColumn('priority')?.setFilterValue(priority)}
        />
      </DataTableToolbar>

      <BulkActions
        table={table}
        statusOptions={statusOptions}
        onBulkDelete={handleBulkDelete}
        onBulkUpdateStatus={handleBulkUpdateStatus}
      />
    </DataTable>
  )
}
```

## 🔧 Configuration

### FilterConfig Interface

```tsx
interface FilterConfig {
  id: string // Column ID
  label: string // Display label
  type: 'select' | 'text' | 'date' | 'date-range'
  options?: Array<{
    // For select type
    value: string
    label: string
    color?: string // Optional color indicator
  }>
  placeholder?: string // Input placeholder
  columnId?: string // Override column ID if different from id
}
```

### BulkActionConfig Interface

```tsx
interface BulkActionConfig {
  id: string // Unique action ID
  label: string // Display label
  icon?: React.ReactNode // Optional icon
  type: 'action' | 'select' // Action type
  options?: Array<{
    // For select type
    value: string
    label: string
  }>
  onAction?: (selectedRows: any[], value?: string) => void
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
}
```

## 🎨 Filter Types

### Text Filter

```tsx
{
  id: 'name',
  label: 'Name',
  type: 'text',
  placeholder: 'Enter name...',
}
```

### Select Filter

```tsx
{
  id: 'status',
  label: 'Status',
  type: 'select',
  options: [
    { value: 'active', label: 'Active', color: '#22C55E' },
    { value: 'inactive', label: 'Inactive', color: '#EF4444' },
  ],
  placeholder: 'All statuses',
}
```

### Date Filter

```tsx
{
  id: 'dueDate',
  label: 'Due Date',
  type: 'date',
  placeholder: 'Select date',
}
```

### Date Range Filter

```tsx
{
  id: 'dateRange',
  label: 'Date Range',
  type: 'date-range',
}
```

## 🎯 Bulk Action Types

### Simple Action

```tsx
{
  id: 'delete',
  label: 'Delete',
  type: 'action',
  variant: 'destructive',
  icon: <Trash2 className="mr-2 h-4 w-4" />,
  onAction: (selectedRows) => handleDelete(selectedRows),
}
```

### Select Action

```tsx
{
  id: 'updateStatus',
  label: 'Status',
  type: 'select',
  options: [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
  ],
  onAction: (selectedRows, status) => handleUpdateStatus(selectedRows, status),
}
```

## 🔄 Creating Collection-Specific Components

1. **Create filter component:**

```tsx
// src/features/users/components/data-table/user-filters.tsx
import { DataTableFilters, type FilterConfig } from '@/components/tables/data-table/filters'

export function UserFilters<TData>({ table, roleOptions = [] }: UserFiltersProps<TData>) {
  const filters: FilterConfig[] = [
    {
      id: 'role',
      label: 'Role',
      type: 'select',
      options: roleOptions,
      placeholder: 'All roles',
    },
    // ... more filters
  ]

  return (
    <DataTableFilters
      table={table}
      filters={filters}
      onFilterChange={(filterId, value) => {
        table.getColumn(filterId)?.setFilterValue(value)
      }}
    />
  )
}
```

2. **Create bulk actions component:**

```tsx
// src/features/users/components/data-table/user-bulk-actions.tsx
import {
  DataTableBulkActions,
  type BulkActionConfig,
} from '@/components/tables/data-table/bulk-actions'

export function UserBulkActions<TData>({ table, onBulkDelete }: UserBulkActionsProps<TData>) {
  const actions: BulkActionConfig[] = [
    {
      id: 'delete',
      label: 'Delete',
      type: 'action',
      variant: 'destructive',
      onAction: onBulkDelete,
    },
    // ... more actions
  ]

  return <DataTableBulkActions table={table} actions={actions} />
}
```

## ✅ Benefits

- **Fully Reusable**: Works with any data type and collection
- **Type Safe**: Full TypeScript support with generics
- **Configurable**: Easy to customize filters and actions
- **Clean Separation**: Collection-specific logic in features folder
- **Consistent UX**: Same look and feel across all tables
- **Maintainable**: Single source of truth for table components

## 🎯 Current Implementation

The task table (`src/features/task-list/components/task-table.tsx`) uses this reusable system:

- **Generic components** handle the table structure
- **TaskFilters** provides task-specific filter configuration
- **TaskBulkActions** provides task-specific bulk operations
- **Clean separation** between reusable and specific logic

This architecture makes it easy to create new table implementations for any collection while maintaining consistency and reducing code duplication.
