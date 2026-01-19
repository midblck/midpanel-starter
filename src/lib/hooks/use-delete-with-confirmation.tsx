'use client';

import { useState, useTransition } from 'react';
import { toast } from 'sonner';

interface UseDeleteWithConfirmationOptions {
  onDelete: () => Promise<boolean>;
  itemName?: string;
  successMessage?: string;
  errorMessage?: string;
}

export function useDeleteWithConfirmation({
  onDelete,
  itemName,
  successMessage,
  errorMessage,
}: UseDeleteWithConfirmationOptions) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = async () => {
    // Use useTransition for non-urgent delete operations
    startTransition(async () => {
      setIsLoading(true);
      try {
        const success = await onDelete();
        if (success) {
          toast.success(
            successMessage || `${itemName || 'Item'} deleted successfully`
          );
          setIsOpen(false);
        } else {
          toast.error(errorMessage || `Failed to delete ${itemName || 'item'}`);
        }
      } catch (error) {
        console.error('Delete error:', error);
        toast.error(errorMessage || `Failed to delete ${itemName || 'item'}`);
      } finally {
        setIsLoading(false);
      }
    });
  };

  const openDialog = () => setIsOpen(true);
  const closeDialog = () => setIsOpen(false);

  return {
    isOpen,
    isLoading,
    isPending,
    openDialog,
    closeDialog,
    handleDelete,
  };
}
