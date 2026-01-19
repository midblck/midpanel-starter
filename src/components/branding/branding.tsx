import { cn } from '@/lib/utils';
import Image from 'next/image';

interface BrandingProps {
  variant?: 'logo' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export function Branding({
  variant = 'logo',
  size = 'md',
  showText = true,
  className,
}: BrandingProps) {
  const sizeClasses = {
    sm: 'h-5 w-5',
    md: 'h-7 w-7',
    lg: 'h-10 w-10',
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-xl',
  };

  return (
    <div className={cn('flex items-center space-x-3', className)}>
      <div className={cn('relative flex-shrink-0', sizeClasses[size])}>
        <Image
          src={`/branding/${variant}.svg`}
          alt='Midblck Admin Starter'
          width={variant === 'logo' ? 28 : 24}
          height={variant === 'logo' ? 28 : 24}
          className='h-full w-full object-contain'
          priority
        />
      </div>
      {showText && (
        <span className={cn('font-semibold text-foreground', textSizes[size])}>
          Midblck Admin Starter
        </span>
      )}
    </div>
  );
}

// Compact version for smaller spaces
export function BrandingIcon({
  size = 'md',
  className,
}: Omit<BrandingProps, 'variant' | 'showText'>) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  return (
    <div className={cn('relative', sizeClasses[size], className)}>
      <Image
        src='/branding/icon.svg'
        alt='Midblck'
        width={24}
        height={24}
        className='h-full w-full object-contain'
        priority
      />
    </div>
  );
}

// Logo with gradient background
export function BrandingLogo({
  size = 'md',
  className,
}: Omit<BrandingProps, 'variant' | 'showText'>) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div
      className={cn(
        'relative rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center',
        sizeClasses[size],
        className
      )}
    >
      <Image
        src='/branding/icon.svg'
        alt='Midblck'
        width={20}
        height={20}
        className='h-3/4 w-3/4 object-contain'
        priority
      />
    </div>
  );
}
