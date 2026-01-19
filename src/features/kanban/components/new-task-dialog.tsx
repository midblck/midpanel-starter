'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import type { Task } from '@/features/kanban';
import { useState } from 'react';
import { TaskFormFields } from './task-form-fields';
import { useTaskFormHandlers } from './task-form-handlers';

interface NewTaskDialogProps {
  columnId?: string;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  editingTask?: Task | null;
  onTaskChange?: () => void;
}

export default function NewTaskDialog({
  columnId,
  trigger,
  open: controlledOpen,
  onOpenChange,
  editingTask,
  onTaskChange,
}: NewTaskDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;

  const { formData, setFormData, handleSubmit } = useTaskFormHandlers({
    columnId,
    editingTask,
  });

  const onSubmit = async (e: React.FormEvent) => {
    const success = await handleSubmit(e);
    if (success) {
      setOpen(false);
      onTaskChange?.();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>
            {editingTask ? 'Edit Task' : 'Create New Task'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className='space-y-4'>
          <TaskFormFields
            formData={formData}
            setFormData={setFormData}
            isEditing={!!editingTask}
          />

          <div className='flex justify-end gap-2 pt-4 w-full ml-auto'>
            <Button
              type='button'
              variant='outline'
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type='submit'>
              {editingTask ? 'Update Task' : 'Create Task'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
