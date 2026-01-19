import type { ColumnSort, Row, RowData } from '@tanstack/react-table';

declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    label?: string;
    placeholder?: string;
    variant?: FilterVariant;
    options?: Option[];
    range?: [number, number];
    unit?: string;
    icon?: React.FC<React.SVGProps<SVGSVGElement>>;
  }
}

export interface Option {
  label: string;
  value: string;
  count?: number;
  icon?: React.FC<React.SVGProps<SVGSVGElement>>;
}

export type FilterOperator =
  | 'eq'
  | 'ne'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte'
  | 'like'
  | 'iLike'
  | 'in'
  | 'notIn'
  | 'isEmpty'
  | 'isNotEmpty'
  | 'between'
  | 'notBetween';

export type FilterVariant =
  | 'text'
  | 'number'
  | 'range'
  | 'date'
  | 'dateRange'
  | 'boolean'
  | 'select'
  | 'multiSelect';

export type JoinOperator = 'and' | 'or';

export interface ExtendedColumnSort<TData> extends Omit<ColumnSort, 'id'> {
  id: Extract<keyof TData, string>;
}

export interface ExtendedColumnFilter<TData> {
  id: Extract<keyof TData, string>;
  operator: FilterOperator;
  value: string | string[] | number | number[] | boolean | null;
}

export interface DataTableRowAction<TData> {
  row: Row<TData>;
  variant: 'update' | 'delete';
}

// Task-specific types
export interface TaskTableData {
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

export interface TaskTableFilters {
  search?: string;
  status?: string[];
  priority?: string[];
  assignee?: string[];
  taskTypes?: string[];
  dueDateFrom?: string;
  dueDateTo?: string;
}

export interface TaskTablePagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
