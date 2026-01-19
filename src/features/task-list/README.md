# 📋 Tasks Feature

A comprehensive task management system built with TanStack Table, PayloadCMS, and shadcn/ui components.

## 🎯 Overview

The Tasks feature provides a powerful table-based interface for managing tasks with advanced functionality including sorting, filtering, pagination, and bulk operations. It integrates seamlessly with PayloadCMS for data management and uses shadcn/ui for consistent, accessible UI components.

## 📁 File Structure

```
src/features/task-list/
├── components/
│   ├── table.tsx                # Main task table component
│   └── task-table-columns.tsx   # Column definitions and cell renderers
├── services/
│   └── task-table.ts            # Data fetching and API integration
├── index.ts                     # Feature exports
└── README.md                    # This documentation
```

## 🚀 Features

### Core Functionality

- ✅ **Data Display**: Comprehensive task table with all task information
- ✅ **Sorting**: Sort by any column (title, status, priority, assignee, due date, created date)
- ✅ **Filtering**: Search and filter tasks by various criteria
- ✅ **Pagination**: Navigate through large datasets efficiently
- ✅ **Row Selection**: Select individual or multiple tasks
- ✅ **Responsive Design**: Mobile-friendly with horizontal scroll

### Data Integration

- ✅ **PayloadCMS Integration**: Direct integration with PayloadCMS collections
- ✅ **Relationship Population**: Proper handling of status and task types
- ✅ **Type Safety**: Full TypeScript support with generated types
- ✅ **Server-Side Rendering**: Initial data fetched on the server

### UI Components

- ✅ **shadcn/ui Integration**: Consistent design system
- ✅ **Dark/Light Theme**: Theme-aware components
- ✅ **Accessibility**: Built-in accessibility features
- ✅ **Interactive Elements**: Hover effects, loading states, error handling

## 🛠️ Components

### TaskTable

The main table component that orchestrates the entire task management interface.

```typescript
interface TaskTableProps {
  initialData?: TaskTableData[];
  initialPagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

**Features:**

- Server-side data fetching with PayloadCMS
- Client-side state management
- Error handling and loading states
- Integration with DataTable components

### Task Table Columns

Comprehensive column definitions with custom cell renderers for each task field.

**Columns:**

1. **Select**: Checkbox for row selection
2. **Title**: Task title with description tooltip
3. **Status**: Status badge with color coding
4. **Priority**: Priority badge with styling
5. **Assignee**: Assignee name with fallback
6. **Due Date**: Formatted date with overdue indicator
7. **Task Types**: Task type badges
8. **Created At**: Formatted timestamp
9. **Actions**: Dropdown menu with task actions

**Cell Renderers:**

- **Status Badge**: Color-coded status indicators
- **Priority Badge**: Styled priority levels
- **Date Formatting**: Human-readable date formats
- **Action Menu**: Edit, copy, delete operations

## 🔧 Services

### Task Table Service

Handles all data fetching and API interactions with PayloadCMS.

**Functions:**

- `fetchTaskTableData()`: Main data fetching with pagination and filtering
- `fetchTaskStatuses()`: Get available task statuses
- `fetchTaskTypes()`: Get available task types
- `fetchTaskAssignees()`: Get available assignees

**Features:**

- PayloadCMS REST API integration
- Relationship population with `depth: 2`
- Query parameter handling
- Error handling and type safety

## 📊 Data Types

### TaskTableData

```typescript
interface TaskTableData {
  id: string;
  title: string;
  description?: string;
  status: {
    id: string;
    name: string;
    color: string;
  };
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignee?: string;
  dueDate?: string;
  taskTypes?: Array<{
    id: string;
    name: string;
    color: string;
  }>;
  order: number;
  createdAt: string;
  updatedAt: string;
}
```

### TaskTableParams

```typescript
interface TaskTableParams {
  page?: number;
  limit?: number;
  sort?: string;
  search?: string;
  filters?: TaskTableFilters;
}
```

## 🎨 Styling & Theming

### Design System

- **shadcn/ui Components**: Consistent, accessible UI components
- **Tailwind CSS**: Utility-first styling approach
- **CSS Variables**: Theme-aware color system
- **Responsive Design**: Mobile-first approach

### Visual Features

- **Status Colors**: Dynamic color coding based on task status
- **Priority Indicators**: Visual priority level representation
- **Hover Effects**: Interactive row and cell hover states
- **Loading States**: Skeleton loaders for better UX
- **Error States**: Clear error messaging and fallbacks

## 🔄 Data Flow

1. **Server-Side Rendering**: Initial data fetched using PayloadCMS `getPayload`
2. **Client Hydration**: Data passed to TaskTable component
3. **Table State Management**: useDataTable hook manages table state
4. **Column Rendering**: taskTableColumns define how data is displayed
5. **User Interactions**: Sorting, filtering, pagination update table state
6. **Real-time Updates**: Table re-renders based on state changes

## 🚀 Usage

### Basic Implementation

```typescript
import { TaskTable } from '@/features/task-list';

export default function TasksPage() {
  return (
    <div>
      <h1>Tasks</h1>
      <TaskTable
        initialData={tasks}
        initialPagination={pagination}
      />
    </div>
  );
}
```

### With Server-Side Data

```typescript
import { getPayload } from 'payload';
import configPromise from '@payload-config';
import { TaskTable } from '@/features/task-list';

export default async function TasksPage() {
  const payload = await getPayload({ config: configPromise });

  const result = await payload.find({
    collection: 'tasks',
    depth: 2,
    populate: { status: true, taskTypes: true },
  });

  return (
    <TaskTable
      initialData={result.docs}
      initialPagination={{
        page: result.page,
        limit: result.limit,
        total: result.totalDocs,
        totalPages: result.totalPages,
      }}
    />
  );
}
```

## 🎯 Key Features Deep Dive

### Sorting

- **Multi-column Sorting**: Sort by multiple columns simultaneously
- **Direction Toggle**: Click headers to toggle ascending/descending
- **Visual Indicators**: Arrow indicators show current sort state
- **Persistent State**: Sort state maintained during interactions

### Filtering

- **Global Search**: Search across all task fields
- **Column Filters**: Filter by specific columns (status, priority, assignee)
- **Date Range**: Filter by due date ranges
- **Real-time Updates**: Filters apply immediately as you type

### Pagination

- **Page Navigation**: First, previous, next, last page buttons
- **Page Size Control**: Adjust number of rows per page
- **Page Information**: Current page and total pages display
- **URL State**: Pagination state reflected in URL (when enabled)

### Row Selection

- **Individual Selection**: Select single tasks with checkboxes
- **Bulk Selection**: Select all tasks on current page
- **Selection Counter**: Display number of selected tasks
- **Bulk Actions**: Perform actions on selected tasks (future feature)

## 🔧 Configuration

### Table Configuration

```typescript
const { table } = useDataTable({
  data,
  columns: taskTableColumns,
  pageCount: initialPagination?.totalPages || -1,
  initialState: {
    pagination: {
      pageIndex: (initialPagination?.page || 1) - 1,
      pageSize: initialPagination?.limit || 10,
    },
    sorting: [{ id: 'createdAt', desc: true }],
  },
  shallow: true,
  debounceMs: 500,
  manualPagination: false,
  manualSorting: false,
  manualFiltering: false,
});
```

### Column Configuration

Each column can be configured with:

- **Sorting**: Enable/disable sorting per column
- **Filtering**: Enable/disable filtering per column
- **Visibility**: Show/hide columns
- **Width**: Set column width constraints
- **Alignment**: Left, center, right alignment

## 🐛 Troubleshooting

### Common Issues

1. **Data Not Displaying**
   - Check if `flexRender` is working correctly
   - Verify cell renderer functions are properly defined
   - Ensure data structure matches expected format

2. **Infinite Loops**
   - Disable URL state management temporarily
   - Check for circular dependencies in useEffect
   - Verify state update patterns

3. **Relationship Data Missing**
   - Ensure `depth: 2` is set in PayloadCMS queries
   - Check `populate` parameter includes required relationships
   - Verify relationship field names match collection slugs

4. **Styling Issues**
   - Check CSS class conflicts
   - Verify Tailwind CSS is properly configured
   - Ensure shadcn/ui components are imported correctly

### Debug Tools

- **Console Logging**: Add strategic console.log statements
- **React DevTools**: Use React DevTools to inspect component state
- **Network Tab**: Check API requests and responses
- **Visual Debugging**: Use colored backgrounds to identify layout issues

## 🚀 Future Enhancements

### Planned Features

- [ ] **Bulk Actions**: Delete, update status, assign multiple tasks
- [ ] **Export Functionality**: CSV and JSON export
- [ ] **Real-time Updates**: WebSocket integration for live updates
- [ ] **Advanced Filtering**: Date range, status combinations
- [ ] **Column Customization**: User-configurable column visibility
- [ ] **Mobile Optimization**: Touch-friendly mobile interface

### Performance Improvements

- [ ] **Virtual Scrolling**: Handle large datasets efficiently
- [ ] **Server-side Pagination**: Reduce client-side data processing
- [ ] **Caching**: Implement data caching strategies
- [ ] **Lazy Loading**: Load data on demand

## 📚 Dependencies

### Core Dependencies

- `@tanstack/react-table`: Table functionality
- `payload`: CMS integration
- `next`: React framework
- `react`: UI library

### UI Dependencies

- `@radix-ui/react-*`: Headless UI components
- `lucide-react`: Icons
- `class-variance-authority`: Component variants
- `clsx`: Class name utilities

### Development Dependencies

- `typescript`: Type safety
- `tailwindcss`: Styling
- `@types/react`: TypeScript types

## 🤝 Contributing

When contributing to the Tasks feature:

1. **Follow Patterns**: Maintain consistency with existing code patterns
2. **Type Safety**: Ensure all new code is properly typed
3. **Testing**: Add appropriate tests for new functionality
4. **Documentation**: Update this README for significant changes
5. **Performance**: Consider performance implications of changes

## 📄 License

This feature is part of the main project and follows the same license terms.

---

**Last Updated**: December 2024  
**Version**: 1.0.0  
**Maintainer**: Development Team
