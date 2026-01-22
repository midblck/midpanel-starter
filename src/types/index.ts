// Common type definitions

export interface BaseEntity {
  id: string
  createdAt: string
  updatedAt: string
}

export interface User extends BaseEntity {
  name: string
  email: string
  avatar?: string
  role: 'admin' | 'user'
}

export interface Media extends BaseEntity {
  filename: string
  mimeType: string
  filesize: number
  width?: number
  height?: number
  url: string
  alt?: string
}

// API Response types
export interface ApiResponse<T> {
  data: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  docs: T[]
  totalDocs: number
  limit: number
  page: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

// Component Props types
export interface BaseComponentProps {
  className?: string
  children?: React.ReactNode
}

export interface CardProps extends BaseComponentProps {
  variant?: 'default' | 'outlined' | 'elevated'
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

export interface ButtonProps extends BaseComponentProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  disabled?: boolean
  loading?: boolean
  onClick?: () => void
}

// Form types
export interface FormField {
  name: string
  label: string
  type: 'text' | 'email' | 'password' | 'textarea' | 'select' | 'checkbox'
  required?: boolean
  placeholder?: string
  options?: { value: string; label: string }[]
}

export interface FormData {
  [key: string]: string | boolean | number
}

// Error types
export interface AppError {
  code: string
  message: string
  field?: string
}

export interface ValidationError extends AppError {
  field: string
  value: unknown
}

// Export auth types
export * from './auth'
