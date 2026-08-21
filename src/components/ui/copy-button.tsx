'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CopyButtonProps {
  text: string;
  label?: string;
  className?: string;
  size?: 'sm' | 'md';
}

export function CopyButton({ text, label, className, size = 'md' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const sizeClasses = {
    sm: 'p-1',
    md: 'p-2',
  };

  return (
    <button
      onClick={handleCopy}
      className={cn(
        'inline-flex items-center gap-2 rounded hover:bg-background transition-colors',
        sizeClasses[size],
        className
      )}
      title={copied ? 'Copié !' : (label || 'Copier')}
    >
      {copied ? (
        <>
          <Check className={cn('text-success', size === 'sm' ? 'w-3 h-3' : 'w-4 h-4')} />
          {label && <span className="text-body-sm text-success">Copié !</span>}
        </>
      ) : (
        <>
          <Copy className={cn('text-text-tertiary', size === 'sm' ? 'w-3 h-3' : 'w-4 h-4')} />
          {label && <span className="text-body-sm text-text-secondary">{label}</span>}
        </>
      )}
    </button>
  );
}

// Copy input (shows value with copy button)
interface CopyInputProps {
  value: string;
  label?: string;
  className?: string;
}

export function CopyInput({ value, label, className }: CopyInputProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className={cn('space-y-1', className)}>
      {label && (
        <label className="block text-body-sm font-medium text-text-primary">
          {label}
        </label>
      )}
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={value}
          readOnly
          className="input flex-1 bg-background"
        />
        <button
          onClick={handleCopy}
          className="btn btn-secondary"
          title={copied ? 'Copié !' : 'Copier'}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-success" />
              <span className="hidden sm:inline">Copié !</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span className="hidden sm:inline">Copier</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
