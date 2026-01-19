'use client';

import { LengthCounter } from '@/components/forms';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useTaskStore } from '@/features/kanban';
import { DEFAULT_STATUS_COLORS } from '@/features/kanban/constants';
import { Edit } from 'lucide-react';
import { useEffect, useState } from 'react';

interface EditColumnDialogProps {
  column: {
    id: string;
    title: string;
  };
  trigger?: React.ReactNode;
}

export default function EditColumnDialog({
  column,
  trigger,
}: EditColumnDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { updateStatus, statuses } = useTaskStore();

  // Find the current status data
  const currentStatus = statuses.find((s: { id: string }) => s.id === column.id);

  const [formData, setFormData] = useState({
    name: currentStatus?.name || column.title,
    description: currentStatus?.description || '',
    color: currentStatus?.color || DEFAULT_STATUS_COLORS[0],
  });

  // Update form data when dialog opens or currentStatus changes
  useEffect(() => {
    if (currentStatus) {
      setFormData({
        name: currentStatus.name,
        description: currentStatus.description || '',
        color: currentStatus.color,
      });
    }
  }, [currentStatus, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) return;

    setLoading(true);

    try {
      const success = await updateStatus(column.id, {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        color: formData.color,
      });

      if (success) {
        setOpen(false);
        // Reset form data
        setFormData({
          name: currentStatus?.name || column.title,
          description: currentStatus?.description || '',
          color: currentStatus?.color || DEFAULT_STATUS_COLORS[0],
        });
      }
    } catch (error) {
      console.error('Failed to update column:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleColorChange = (color: string) => {
    setFormData(prev => ({ ...prev, color }));
  };

  const predefinedColors = DEFAULT_STATUS_COLORS;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant='ghost' size='sm'>
            <Edit className='h-4 w-4 mr-2' />
            Edit Column
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Edit Column</DialogTitle>
          <DialogDescription>
            Make changes to your column here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='name'>Name</Label>
            <Input
              id='name'
              value={formData.name}
              onChange={e =>
                setFormData(prev => ({ ...prev, name: e.target.value }))
              }
              placeholder='e.g., In Review'
              required
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='description'>Description</Label>
            <Textarea
              id='description'
              value={formData.description}
              onChange={e =>
                setFormData(prev => ({ ...prev, description: e.target.value }))
              }
              placeholder='Optional description'
              rows={3}
              maxLength={200}
            />
            <LengthCounter
              current={formData.description.length}
              max={200}
              warningThreshold={0.8}
              dangerThreshold={0.9}
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='color'>Color</Label>
            <div className='flex items-center space-x-2'>
              <Input
                id='color'
                type='color'
                value={formData.color}
                onChange={e => handleColorChange(e.target.value)}
                className='w-12 h-10 p-1'
              />
              <Input
                value={formData.color}
                onChange={e => handleColorChange(e.target.value)}
                placeholder='#6B7280'
                className='flex-1'
              />
            </div>
            <div className='flex flex-wrap gap-2 mt-2'>
              {predefinedColors.map(color => (
                <button
                  key={color}
                  type='button'
                  className='w-6 h-6 rounded-full border-2 border-gray-300 hover:border-gray-400'
                  style={{ backgroundColor: color }}
                  onClick={() => handleColorChange(color)}
                />
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button
              type='button'
              variant='outline'
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type='submit' disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
