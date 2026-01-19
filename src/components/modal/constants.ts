import { AlertCircle, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

export type ConfirmationVariant =
  | 'default'
  | 'destructive'
  | 'warning'
  | 'success';

export interface VariantConfig {
  icon: typeof AlertCircle;
  iconColor: string;
  iconBg: string;
  buttonVariant:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link';
}

export const CONFIRMATION_VARIANT_CONFIG: Record<
  ConfirmationVariant,
  VariantConfig
> = {
  default: {
    icon: AlertCircle,
    iconColor: 'text-blue-600 dark:text-blue-400',
    iconBg: 'bg-blue-100 dark:bg-blue-900/20',
    buttonVariant: 'default',
  },
  destructive: {
    icon: XCircle,
    iconColor: 'text-red-600 dark:text-red-400',
    iconBg: 'bg-red-100 dark:bg-red-900/20',
    buttonVariant: 'destructive',
  },
  warning: {
    icon: AlertTriangle,
    iconColor: 'text-yellow-600 dark:text-yellow-400',
    iconBg: 'bg-yellow-100 dark:bg-yellow-900/20',
    buttonVariant: 'default',
  },
  success: {
    icon: CheckCircle,
    iconColor: 'text-green-600 dark:text-green-400',
    iconBg: 'bg-green-100 dark:bg-green-900/20',
    buttonVariant: 'default',
  },
};

export const DEFAULT_TEXTS = {
  confirm: 'Confirm',
  cancel: 'Cancel',
  delete: 'Delete',
  approve: 'Approve',
  reject: 'Reject',
  save: 'Save',
  update: 'Update',
  create: 'Create',
} as const;

export const DEFAULT_DESCRIPTIONS = {
  delete: (itemName?: string) =>
    itemName
      ? `Are you sure you want to delete "${itemName}"? This action cannot be undone.`
      : 'Are you sure you want to delete this item? This action cannot be undone.',
  approve: (itemName?: string) =>
    itemName
      ? `Are you sure you want to approve "${itemName}"?`
      : 'Are you sure you want to approve this item?',
  reject: (itemName?: string) =>
    itemName
      ? `Are you sure you want to reject "${itemName}"?`
      : 'Are you sure you want to reject this item?',
  save: (itemName?: string) =>
    itemName
      ? `Are you sure you want to save changes to "${itemName}"?`
      : 'Are you sure you want to save these changes?',
  update: (itemName?: string) =>
    itemName
      ? `Are you sure you want to update "${itemName}"?`
      : 'Are you sure you want to update this item?',
  create: (itemName?: string) =>
    itemName
      ? `Are you sure you want to create "${itemName}"?`
      : 'Are you sure you want to create this item?',
} as const;
