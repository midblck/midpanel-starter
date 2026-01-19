'use client';

import { useTaskStore, type Task, type TaskType } from '@/features/kanban';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface TaskFormHandlersProps {
  columnId?: string;
  editingTask?: Task | null;
}

export function useTaskFormHandlers({
  columnId,
  editingTask,
}: TaskFormHandlersProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'critical',
    assignee: '',
    dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0],
    taskTypes: [] as string[],
    status: columnId || '',
  });

  const addTask = useTaskStore((state) => state.addTask);
  const updateTask = useTaskStore((state) => state.updateTask);
  const loadTaskTypes = useTaskStore((state) => state.loadTaskTypes);
  const taskTypes = useTaskStore((state) => state.taskTypes);
  const statuses = useTaskStore((state) => state.statuses);

  // Load task types on component mount
  useEffect(() => {
    void loadTaskTypes();
  }, [loadTaskTypes]);

  // Populate form when editing
  useEffect(() => {
    if (editingTask) {
      setFormData({
        title: editingTask.title,
        description: editingTask.description || '',
        priority: editingTask.priority || 'medium',
        assignee: editingTask.assignee || '',
        dueDate: editingTask.dueDate
          ? new Date(editingTask.dueDate).toISOString().split('T')[0]
          : '',
        taskTypes: editingTask.taskTypes?.map(tt => tt.id) || [],
        status: editingTask.status.id,
      });
    } else {
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        assignee: '',
        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0],
        taskTypes: [],
        status: columnId || '',
      });
    }
  }, [editingTask, columnId]);

  // Set default "General" task type for new tasks
  useEffect(() => {
    if (!editingTask && taskTypes.length > 0) {
      const generalTaskType = taskTypes.find(tt => tt.name === 'General');
      if (generalTaskType && formData.taskTypes.length === 0) {
        setFormData(prev => ({
          ...prev,
          taskTypes: [generalTaskType.id],
        }));
      }
    }
  }, [editingTask, taskTypes, formData.taskTypes.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) return;

    if (formData.description && formData.description.length > 1000) {
      toast.error('Description must be 1000 characters or less');
      return;
    }

    if (editingTask) {
      // Find the status object from the selected status ID
      const selectedStatus = statuses.find(
        (status: { id: string }) => status.id === formData.status
      );

      // Update existing task
      await updateTask(editingTask.id, {
        title: formData.title,
        description: formData.description || undefined,
        priority: formData.priority,
        assignee: formData.assignee || undefined,
        dueDate: formData.dueDate
          ? new Date(formData.dueDate).toISOString()
          : undefined,
        status: selectedStatus || editingTask.status, // Use selected status or fallback to original
        taskTypes: formData.taskTypes
          .map(id => taskTypes.find((tt: TaskType) => tt.id === id))
          .filter(Boolean) as TaskType[], // Convert string IDs to TaskType objects for updateTask
      });
    } else {
      // Create new task
      await addTask(
        formData.title,
        formData.description || undefined,
        formData.status || columnId,
        formData.taskTypes,
        formData.priority,
        formData.assignee || undefined,
        formData.dueDate ? new Date(formData.dueDate).toISOString() : undefined
      );
    }

    return true; // Indicate success
  };

  return {
    formData,
    setFormData,
    handleSubmit,
  };
}
