'use client';

import { cn } from '@/lib/utils';
import { useDroppable } from '@dnd-kit/core';

interface InsertionIndicatorProps {
  isVisible: boolean;
  className?: string;
}

export function InsertionIndicator({
  isVisible,
  className,
}: InsertionIndicatorProps) {
  return (
    <div
      className={cn(
        'h-0.5 bg-primary rounded-full transition-all duration-200 ease-in-out',
        'mx-2 my-1 shadow-sm',
        isVisible
          ? 'opacity-100 scale-x-100 shadow-primary/30'
          : 'opacity-0 scale-x-0',
        className
      )}
      role='presentation'
      aria-hidden='true'
    />
  );
}

interface DropZoneAfterTaskProps {
  columnId: string;
  taskId: string;
  position: number;
  isHovered: boolean;
}

export function DropZoneAfterTask({
  columnId,
  taskId,
  position,
  isHovered,
}: DropZoneAfterTaskProps) {
  const dropZoneId = `${columnId}-after-${taskId}`;

  const { setNodeRef, isOver } = useDroppable({
    id: dropZoneId,
    data: {
      type: 'drop-zone-after',
      columnId,
      afterTaskId: taskId,
      insertionIndex: position,
    },
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'min-h-2 transition-all duration-200',
        isOver || isHovered
          ? 'bg-primary/10 border-2 border-dashed border-primary/30 rounded-md'
          : 'bg-transparent'
      )}
    >
      <InsertionIndicator isVisible={isOver || isHovered} />
    </div>
  );
}

interface DropZoneProps {
  id: string;
  isActive: boolean;
  children?: React.ReactNode;
  className?: string;
}

export function DropZone({ id, isActive, children, className }: DropZoneProps) {
  return (
    <div
      id={id}
      className={cn(
        'min-h-2 transition-all duration-200',
        isActive
          ? 'bg-primary/10 border-2 border-dashed border-primary/30 rounded-md'
          : 'bg-transparent',
        className
      )}
    >
      {children}
    </div>
  );
}

interface DropZoneAfterColumnProps {
  columnId: string;
  position: number;
  isHovered: boolean;
}

export function DropZoneAfterColumn({
  columnId,
  position,
  isHovered,
}: DropZoneAfterColumnProps) {
  const dropZoneId = `column-after-${columnId}`;

  const { setNodeRef, isOver } = useDroppable({
    id: dropZoneId,
    data: {
      type: 'drop-zone-column-after',
      columnId,
      insertionIndex: position,
    },
  });

  try {
    return (
      <div
        ref={setNodeRef}
        className={cn(
          'min-h-12 w-8 transition-all duration-200 flex items-center justify-center mx-2',
          isOver || isHovered
            ? 'bg-primary/20 border-2 border-dashed border-primary/50 rounded-lg shadow-lg'
            : 'bg-gray-100/70 border-2 border-dashed border-gray-400 rounded-lg hover:bg-gray-200/70'
        )}
      >
        <div className='flex flex-col items-center gap-1'>
          <InsertionIndicator isVisible={isOver || isHovered} />
          <div
            className={cn(
              'text-xs font-medium transition-all duration-200',
              isOver || isHovered ? 'text-primary' : 'text-gray-500'
            )}
          >
            Drop Column
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('DropZoneAfterColumn error:', error);
    return null;
  }
}
