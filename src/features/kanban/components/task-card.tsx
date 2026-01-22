'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { Task } from '@/features/kanban';
import {
  formatDate,
  getPriorityCardColors,
  getPriorityLabel,
  isOverdue,
} from '@/features/kanban';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Calendar,
  GripVertical,
  MoreHorizontal,
  Tag,
  User,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
}

// Hook to detect if text is truncated
function useIsTextTruncated(text: string) {
  const [isTruncated, setIsTruncated] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  // Estimate if text might be truncated based on character count
  // This provides a consistent SSR/client experience
  const estimatedTruncated = text.length > 120; // Rough estimate for 2 lines

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const checkTruncation = () => {
      if (textRef.current) {
        const element = textRef.current;
        setIsTruncated(element.scrollHeight > element.clientHeight);
      }
    };

    // Use requestAnimationFrame to ensure DOM is fully rendered
    const rafId = requestAnimationFrame(() => {
      checkTruncation();
    });

    window.addEventListener('resize', checkTruncation);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', checkTruncation);
    };
  }, [text, isMounted]);

  // Use estimated truncation for SSR, actual measurement for client
  return {
    textRef,
    isTruncated: isMounted ? isTruncated : estimatedTruncated,
  };
}

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: 'task',
      task,
    },
  });

  const { textRef, isTruncated } = useIsTextTruncated(task.description || '');

  // Ensure we have a valid priority value
  const taskPriority =
    task.priority &&
    ['low', 'medium', 'high', 'critical'].includes(task.priority)
      ? task.priority
      : 'medium';
  const priorityColors = getPriorityCardColors(taskPriority);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card
      ref={setNodeRef}
      style={{
        ...style,
        borderLeftColor: priorityColors.borderColor,
      }}
      className={`group cursor-grab active:cursor-grabbing hover:shadow-lg hover:scale-[1.02] transition-all duration-200 border-l-4 ${priorityColors.border} ${
        isDragging ? 'shadow-xl scale-105 rotate-2 z-50' : ''
      }`}
      {...attributes}
      {...listeners}
    >
      <CardHeader className='pb-3 px-3 sm:px-6'>
        <div className='flex items-start justify-between gap-2'>
          <div className='flex-1 min-w-0'>
            <CardTitle className='text-sm font-semibold leading-tight text-foreground group-hover:text-primary transition-colors'>
              {task.title}
            </CardTitle>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant='ghost'
                size='sm'
                className='h-8 w-8 sm:h-6 sm:w-6 p-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity touch-manipulation'
                onClick={e => e.stopPropagation()}
                aria-label='Task options'
              >
                <MoreHorizontal className='h-4 w-4 sm:h-3 sm:w-3' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuItem onClick={() => onEdit?.(task)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete?.(task.id)}
                className='text-red-600'
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className='flex items-center gap-1 mt-2 opacity-60 group-hover:opacity-100 transition-opacity'>
          <GripVertical className='h-3 w-3 text-muted-foreground' />
          <span className='text-xs text-muted-foreground font-medium'>
            Drag to move
          </span>
        </div>
      </CardHeader>

      <CardContent className='pt-0 space-y-3 px-3 sm:px-6'>
        {task.description && (
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className='group relative' suppressHydrationWarning>
                  <p
                    ref={textRef}
                    className={`text-xs text-muted-foreground line-clamp-2 transition-colors duration-150 group-hover:text-foreground leading-relaxed ${
                      isTruncated ? 'cursor-help' : 'cursor-default'
                    }`}
                    style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      maxHeight: '2.5rem', // Fallback for 2 lines
                    }}
                  >
                    {task.description}
                  </p>
                  {isTruncated && (
                    <div className='absolute bottom-0 right-0 bg-gradient-to-l from-background via-background/95 to-transparent w-12 h-4 pointer-events-none flex items-end justify-end'>
                      <span className='text-xs text-muted-foreground font-medium opacity-80'>
                        ...
                      </span>
                    </div>
                  )}
                </div>
              </TooltipTrigger>
              {isTruncated && (
                <TooltipContent
                  side='top'
                  className='w-96 max-h-96 p-4 text-sm bg-popover text-popover-foreground border shadow-xl z-auto rounded-lg overflow-y-auto'
                  sideOffset={12}
                >
                  <div className='space-y-3'>
                    <div className='flex items-center gap-2'>
                      <div className='w-2 h-2 bg-blue-500 rounded-full'></div>
                      <p className='font-semibold text-sm text-foreground'>
                        Task Description
                      </p>
                    </div>
                    <div className='bg-muted/10 rounded-md p-3'>
                      <p className='whitespace-pre-wrap break-words leading-relaxed text-sm'>
                        {task.description}
                      </p>
                    </div>
                  </div>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        )}

        <div className='flex items-center justify-between'>
          <Badge
            variant='secondary'
            style={{
              backgroundColor: priorityColors.badgeBackground,
              color: priorityColors.badgeColor,
            }}
            className={`text-xs font-medium px-2 py-1 shadow-sm border-0`}
          >
            {getPriorityLabel(taskPriority)}
          </Badge>
        </div>

        <div className='space-y-2'>
          <div className='flex items-center justify-between text-xs'>
            <div className='flex items-center gap-3'>
              {task.assignee && (
                <div className='flex items-center gap-1.5 bg-muted/50 px-2 py-1 rounded-md'>
                  <User className='h-3 w-3 text-muted-foreground' />
                  <span className='truncate max-w-20 font-medium text-foreground'>
                    {task.assignee}
                  </span>
                </div>
              )}
              {task.dueDate && (
                <div
                  className={`flex items-center gap-1.5 font-medium px-2 py-1 rounded-md ${
                    isOverdue(task.dueDate, task.status)
                      ? 'text-red-600 bg-red-50 border border-red-200'
                      : 'text-blue-600 bg-blue-50 border border-blue-200'
                  }`}
                >
                  <Calendar className='h-3 w-3' />
                  <span>{formatDate(task.dueDate)}</span>
                </div>
              )}
            </div>
          </div>

          {task.taskTypes && task.taskTypes.length > 0 && (
            <div className='flex items-center gap-1.5 flex-wrap'>
              <Tag className='h-3 w-3 text-muted-foreground' />
              {task.taskTypes.slice(0, 2).map(taskType => (
                <Badge
                  key={taskType.id}
                  variant='outline'
                  className='text-xs font-medium px-2 py-1 border shadow-sm'
                  style={{
                    borderColor: taskType.color,
                    color: taskType.color,
                    backgroundColor: `${taskType.color}15`,
                  }}
                >
                  {taskType.name}
                </Badge>
              ))}
              {task.taskTypes.length > 2 && (
                <span className='text-xs text-muted-foreground font-medium bg-muted/50 px-2 py-1 rounded-md'>
                  +{task.taskTypes.length - 2}
                </span>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
