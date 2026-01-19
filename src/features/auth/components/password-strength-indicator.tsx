'use client';

import { Check, X } from 'lucide-react';
import { passwordRequirements } from '../utils/password-validation';

interface PasswordStrengthIndicatorProps {
  password: string;
}

export default function PasswordStrengthIndicator({
  password,
}: PasswordStrengthIndicatorProps) {
  if (!password) return null;

  return (
    <div className='grid grid-cols-2 gap-x-4 gap-y-2 text-xs'>
      {passwordRequirements.map((requirement, index) => {
        const isValid = requirement.test(password);
        return (
          <div key={index} className='flex items-center gap-2'>
            {isValid ? (
              <Check className='h-3 w-3 text-green-500' />
            ) : (
              <X className='h-3 w-3 text-red-500' />
            )}
            <span className={isValid ? 'text-green-600' : 'text-red-600'}>
              {requirement.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
