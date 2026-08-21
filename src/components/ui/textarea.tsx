'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  maxLength?: number;
  showCounter?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ 
    label, 
    error, 
    helperText, 
    maxLength,
    showCounter = false,
    className,
    id,
    value,
    ...props 
  }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    const currentValue = typeof value === 'string' ? value : '';
    const currentLength = currentValue.length;
    const isNearLimit = maxLength && currentLength > maxLength * 0.9;
    const isOverLimit = maxLength && currentLength > maxLength;

    return (
      <div className="space-y-1">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-body-sm font-medium text-text-primary"
          >
            {label}
          </label>
        )}
        
        <textarea
          ref={ref}
          id={inputId}
          className={cn(
            'input min-h-[100px] resize-y',
            error && 'border-danger focus:border-danger focus:ring-danger',
            className
          )}
          value={value}
          maxLength={maxLength}
          {...props}
        />
        
        <div className="flex justify-between items-center">
          <div>
            {error && (
              <p className="text-body-sm text-danger">{error}</p>
            )}
            
            {helperText && !error && (
              <p className="text-body-sm text-text-tertiary">{helperText}</p>
            )}
          </div>
          
          {(showCounter || maxLength) && (
            <p className={cn(
              'text-caption',
              isOverLimit ? 'text-danger' : isNearLimit ? 'text-warning' : 'text-text-tertiary'
            )}>
              {currentLength}{maxLength ? `/${maxLength}` : ''}
            </p>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
