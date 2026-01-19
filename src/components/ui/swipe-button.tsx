'use client';

import { cn } from '@/lib/utils';
import { SwipeableButton } from 'react-swipeable-button';

interface SwipeButtonProps {
  onConfirm: () => void;
  text: string;
  variant?: 'default' | 'destructive' | 'warning' | 'success';
  disabled?: boolean;
  className?: string;
}

const variantStyles = {
  default: {
    color: '#3b82f6', // Blue primary color
    text: 'Slide to ',
  },
  destructive: {
    color: '#ef4444', // Red destructive color
    text: 'Slide to ',
  },
  warning: {
    color: '#f59e0b', // Yellow warning color
    text: 'Slide to ',
  },
  success: {
    color: '#10b981', // Green success color
    text: 'Slide to ',
  },
};

export function SwipeButton({
  onConfirm,
  text,
  variant = 'default',
  disabled = false,
  className,
}: SwipeButtonProps) {
  const styles = variantStyles[variant];

  return (
    <div className={cn('w-full flex justify-center', className)}>
      <SwipeableButton
        onSuccess={onConfirm}
        text={`${styles.text}${text.toLowerCase()}`}
        text_unlocked='Release to confirm'
        sliderColor={styles.color}
        disabled={disabled}
        height={50}
        width={320}
      />
    </div>
  );
}
