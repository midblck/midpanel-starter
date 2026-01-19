'use client';

import { LengthCounter } from '@/components/forms';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useTaskStore, type Status, type TaskType } from '@/features/kanban';

interface TaskFormData {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignee: string;
  dueDate: string;
  taskTypes: string[];
  status: string;
}

interface TaskFormFieldsProps {
  formData: TaskFormData;
  setFormData: React.Dispatch<React.SetStateAction<TaskFormData>>;
  isEditing?: boolean;
}

export function TaskFormFields({ formData, setFormData }: TaskFormFieldsProps) {
  const statuses = useTaskStore((state) => state.statuses);
  const taskTypes = useTaskStore((state) => state.taskTypes);

  return (
    <>
      <div className='space-y-2'>
        <Label htmlFor='title'>Title *</Label>
        <Input
          id='title'
          value={formData.title}
          onChange={e =>
            setFormData(prev => ({ ...prev, title: e.target.value }))
          }
          placeholder='Enter task title'
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
          placeholder='Enter task description'
          rows={3}
          maxLength={1000}
        />
        <LengthCounter
          current={formData.description.length}
          max={1000}
          warningThreshold={0.8}
          dangerThreshold={0.9}
        />
      </div>

      <div className='space-y-2'>
        <Label htmlFor='taskTypes'>Task Types</Label>
        <Select
          value=''
          onValueChange={value => {
            if (value) {
              setFormData(prev => ({
                ...prev,
                taskTypes: [...prev.taskTypes, value],
              }));
            }
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder='Select task types' />
          </SelectTrigger>
          <SelectContent>
            {taskTypes
              .filter((taskType: TaskType) => !formData.taskTypes.includes(taskType.id))
              .map((taskType: TaskType) => (
                <SelectItem key={taskType.id} value={taskType.id}>
                  <div className='flex items-center gap-2'>
                    <div
                      className='w-3 h-3 rounded-full'
                      style={{ backgroundColor: taskType.color }}
                    />
                    {taskType.name}
                  </div>
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
        {formData.taskTypes.length > 0 && (
          <div className='flex flex-wrap gap-1 mt-2'>
            {formData.taskTypes.map((taskTypeId: string) => {
              const taskType = taskTypes.find((tt: { id: string }) => tt.id === taskTypeId);
              return taskType ? (
                <Badge
                  key={taskTypeId}
                  variant='secondary'
                  className='text-xs'
                  style={{
                    backgroundColor: `${taskType.color}20`,
                    color: taskType.color,
                    borderColor: taskType.color,
                  }}
                >
                  {taskType.name}
                  <button
                    type='button'
                    onClick={() =>
                      setFormData(prev => ({
                        ...prev,
                        taskTypes: prev.taskTypes.filter(
                          (id: string) => id !== taskTypeId
                        ),
                      }))
                    }
                    className='ml-1 hover:bg-gray-300 rounded-full w-4 h-4 flex items-center justify-center'
                  >
                    ×
                  </button>
                </Badge>
              ) : null;
            })}
          </div>
        )}
      </div>

      <div className='space-y-2'>
        <Label htmlFor='priority'>Priority</Label>
        <Select
          value={formData.priority}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onValueChange={(value: any) =>
            setFormData(prev => ({ ...prev, priority: value }))
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='low'>Low</SelectItem>
            <SelectItem value='medium'>Medium</SelectItem>
            <SelectItem value='high'>High</SelectItem>
            <SelectItem value='critical'>Critical</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className='space-y-2'>
        <Label htmlFor='status'>Status</Label>
        <Select
          value={formData.status}
          onValueChange={value =>
            setFormData(prev => ({ ...prev, status: value }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder='Select a status' />
          </SelectTrigger>
          <SelectContent>
            {statuses.map((status: Status) => (
              <SelectItem key={status.id} value={status.id}>
                <div className='flex items-center gap-2'>
                  <div
                    className='w-3 h-3 rounded-full'
                    style={{ backgroundColor: status.color }}
                  />
                  {status.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className='space-y-2'>
        <Label htmlFor='dueDate'>Due Date</Label>
        <Input
          id='dueDate'
          type='date'
          value={formData.dueDate}
          onChange={e =>
            setFormData(prev => ({ ...prev, dueDate: e.target.value }))
          }
        />
      </div>

      <div className='space-y-2'>
        <Label htmlFor='assignee'>Assignee</Label>
        <Input
          id='assignee'
          value={formData.assignee}
          onChange={e =>
            setFormData(prev => ({ ...prev, assignee: e.target.value }))
          }
          placeholder='Assignee name'
        />
      </div>
    </>
  );
}
