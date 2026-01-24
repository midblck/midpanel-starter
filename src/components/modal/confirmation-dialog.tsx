'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ReactNode } from 'react'

import { SwipeButton } from '../ui/swipe-button'
import {
  CONFIRMATION_VARIANT_CONFIG,
  DEFAULT_DESCRIPTIONS,
  DEFAULT_TEXTS,
  type ConfirmationVariant,
} from './constants'

export type { ConfirmationVariant }

interface ConfirmationDialogProps {
  /** Whether the dialog is open */
  open: boolean
  /** Callback when dialog open state changes */
  onOpenChange: (open: boolean) => void
  /** Callback when confirm button is clicked */
  onConfirm: () => void | Promise<void>
  /** Dialog title */
  title?: string
  /** Dialog description */
  description?: string
  /** Name of the item being acted upon (used in default descriptions) */
  itemName?: string
  /** Whether the confirm action is loading */
  isLoading?: boolean
  /** Visual variant of the dialog */
  variant?: ConfirmationVariant
  /** Text for the confirm button */
  confirmText?: string
  /** Text for the cancel button */
  cancelText?: string
  /** Text shown while loading */
  loadingText?: string
  /** Custom icon to display */
  icon?: ReactNode
  /** Whether to show the icon */
  showIcon?: boolean
}

export function ConfirmationDialog({
  open,
  onOpenChange,
  onConfirm,
  title = 'Confirm Action',
  description,
  isLoading = false,
  variant = 'default',
  confirmText = DEFAULT_TEXTS.confirm,
  loadingText,
  icon,
  showIcon = true,
}: ConfirmationDialogProps) {
  const handleConfirm = () => {
    const result = onConfirm()
    if (result instanceof Promise) {
      result.then(() => onOpenChange(false))
    } else {
      onOpenChange(false)
    }
  }

  const config = CONFIRMATION_VARIANT_CONFIG[variant]
  const IconComponent = config.icon
  const defaultLoadingText = loadingText || `${confirmText}ing...`

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <div className='flex items-center gap-3'>
            {showIcon && (
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full ${config.iconBg}`}
                style={{ aspectRatio: '1/1' }}
              >
                {icon || <IconComponent className={`h-5 w-5 ${config.iconColor}`} />}
              </div>
            )}
            <div>
              <DialogTitle className='text-lg font-semibold'>{title}</DialogTitle>
              <DialogDescription className='text-sm text-muted-foreground'>
                {description}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className='flex justify-center py-4'>
          {isLoading ? (
            <div className='h-12 w-80 rounded-full bg-muted flex items-center justify-center'>
              <div className='h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent' />
              <span className='ml-2 text-sm'>{defaultLoadingText}</span>
            </div>
          ) : (
            <SwipeButton
              onConfirm={handleConfirm}
              text={confirmText}
              variant={variant}
              disabled={isLoading}
              className='w-80'
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Convenience components for common use cases
export function DeleteConfirmationDialog(
  props: Omit<ConfirmationDialogProps, 'confirmText' | 'icon'>,
) {
  return (
    <ConfirmationDialog
      {...props}
      variant='destructive'
      confirmText={DEFAULT_TEXTS.delete}
      title={props.title || 'Delete Item'}
      description={props.description || DEFAULT_DESCRIPTIONS.delete(props.itemName)}
    />
  )
}

export function ApproveConfirmationDialog(
  props: Omit<ConfirmationDialogProps, 'confirmText' | 'icon'>,
) {
  return (
    <ConfirmationDialog
      {...props}
      variant='success'
      confirmText={DEFAULT_TEXTS.approve}
      title={props.title || 'Approve Item'}
      description={props.description || DEFAULT_DESCRIPTIONS.approve(props.itemName)}
    />
  )
}

export function RejectConfirmationDialog(
  props: Omit<ConfirmationDialogProps, 'confirmText' | 'icon'>,
) {
  return (
    <ConfirmationDialog
      {...props}
      variant='warning'
      confirmText={DEFAULT_TEXTS.reject}
      title={props.title || 'Reject Item'}
      description={props.description || DEFAULT_DESCRIPTIONS.reject(props.itemName)}
    />
  )
}

export function SaveConfirmationDialog(
  props: Omit<ConfirmationDialogProps, 'confirmText' | 'icon'>,
) {
  return (
    <ConfirmationDialog
      {...props}
      variant='default'
      confirmText={DEFAULT_TEXTS.save}
      title={props.title || 'Save Changes'}
      description={props.description || DEFAULT_DESCRIPTIONS.save(props.itemName)}
    />
  )
}

export function UpdateConfirmationDialog(
  props: Omit<ConfirmationDialogProps, 'confirmText' | 'icon'>,
) {
  return (
    <ConfirmationDialog
      {...props}
      variant='default'
      confirmText={DEFAULT_TEXTS.update}
      title={props.title || 'Update Item'}
      description={props.description || DEFAULT_DESCRIPTIONS.update(props.itemName)}
    />
  )
}

export function CreateConfirmationDialog(
  props: Omit<ConfirmationDialogProps, 'confirmText' | 'icon'>,
) {
  return (
    <ConfirmationDialog
      {...props}
      variant='success'
      confirmText={DEFAULT_TEXTS.create}
      title={props.title || 'Create Item'}
      description={props.description || DEFAULT_DESCRIPTIONS.create(props.itemName)}
    />
  )
}
