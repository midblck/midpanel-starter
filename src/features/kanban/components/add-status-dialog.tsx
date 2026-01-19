'use client';

import { LengthCounter } from '@/components/forms';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useTaskStore } from '@/features/kanban';
import { Plus } from 'lucide-react';
import { useState } from 'react';

interface AddStatusDialogProps {
  trigger?: React.ReactNode;
}

export default function AddStatusDialog({ trigger }: AddStatusDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusName, setStatusName] = useState('');
  const [statusDescription, setStatusDescription] = useState('');

  const { addStatus, statuses } = useTaskStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!statusName.trim()) return;

    setLoading(true);

    try {
      // Generate a color based on the number of existing statuses
      const colors = [
        '#6B7280', // Gray
        '#EF4444', // Red
        '#F97316', // Orange
        '#EAB308', // Yellow
        '#22C55E', // Green
        '#06B6D4', // Cyan
        '#3B82F6', // Blue
        '#8B5CF6', // Purple
        '#EC4899', // Pink
      ];

      const color = colors[statuses.length % colors.length];
      const order = statuses.length;

      await addStatus({
        name: statusName.trim(),
        description: statusDescription.trim() || undefined,
        color,
        order,
      });

      setOpen(false);
      setStatusName('');
      setStatusDescription('');
    } catch (error) {
      console.error('Error creating status:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            variant='outline'
            className='h-8 sm:h-10 w-full sm:w-auto touch-manipulation text-xs sm:text-sm px-3 sm:px-4 rounded-md compact-mobile'
          >
            <Plus className='mr-1.5 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 shrink-0' />
            New Status
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className='w-[calc(100vw-2rem)] sm:max-w-md'>
        <DialogHeader>
          <DialogTitle className='text-xl font-semibold'>
            Add New Status
          </DialogTitle>
          <DialogDescription className='text-gray-600'>
            What status you want to add today?
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='status-name'>Status Name</Label>
            <Input
              id='status-name'
              value={statusName}
              onChange={e => setStatusName(e.target.value)}
              placeholder='Status name...'
              className='w-full'
              autoFocus
              required
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='status-description'>Description (Optional)</Label>
            <Textarea
              id='status-description'
              value={statusDescription}
              onChange={e => setStatusDescription(e.target.value)}
              placeholder='Describe what this status is for...'
              className='w-full'
              rows={3}
              maxLength={200}
            />
            <LengthCounter
              current={statusDescription.length}
              max={200}
              warningThreshold={0.8}
              dangerThreshold={0.9}
            />
          </div>
          <div className='flex flex-col-reverse sm:flex-row justify-end gap-2'>
            <Button
              type='button'
              variant='outline'
              onClick={() => setOpen(false)}
              className='w-full sm:w-auto touch-manipulation'
            >
              Cancel
            </Button>
            <Button
              type='submit'
              disabled={loading || !statusName.trim()}
              className='w-full sm:w-auto touch-manipulation'
            >
              {loading ? 'Adding...' : 'Add Status'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
