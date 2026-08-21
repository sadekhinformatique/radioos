'use client';

import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FilterChip {
  id: string;
  label: string;
  value: string | number;
  count?: number;
}

interface FilterChipsProps {
  filters: FilterChip[];
  onRemove: (id: string) => void;
  onClearAll?: () => void;
  className?: string;
}

export function FilterChips({ filters, onRemove, onClearAll, className }: FilterChipsProps) {
  if (filters.length === 0) return null;

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      <span className="text-body-sm text-text-secondary">Filtres :</span>
      
      {filters.map((filter) => (
        <span
          key={filter.id}
          className="inline-flex items-center gap-1 px-3 py-1 bg-primary-light text-primary rounded-full text-body-sm"
        >
          <span>{filter.label}</span>
          {filter.count !== undefined && (
            <span className="text-caption text-primary-muted">({filter.count})</span>
          )}
          <button
            onClick={() => onRemove(filter.id)}
            className="ml-1 p-0.5 rounded-full hover:bg-primary/20 transition-colors"
            aria-label={`Retirer le filtre ${filter.label}`}
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}
      
      {filters.length > 1 && onClearAll && (
        <button
          onClick={onClearAll}
          className="text-body-sm text-text-tertiary hover:text-text-primary transition-colors"
        >
          Tout effacer
        </button>
      )}
    </div>
  );
}

// Single filter selector
interface FilterSelectProps {
  label: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (value: string) => void;
  className?: string;
}

export function FilterSelect({ label, value, options, onChange, className }: FilterSelectProps) {
  return (
    <div className={cn('space-y-1', className)}>
      <label className="block text-body-sm font-medium text-text-primary">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input w-full"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

// Search input with empty state
interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onClear?: () => void;
  className?: string;
  noResults?: boolean;
}

export function SearchInput({
  value,
  onChange,
  placeholder = 'Rechercher...',
  onClear,
  className,
  noResults = false,
}: SearchInputProps) {
  return (
    <div className={cn('space-y-1', className)}>
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="input pl-10"
        />
        {/* Search icon */}
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        
        {/* Clear button */}
        {value && (
          <button
            onClick={() => {
              onChange('');
              onClear?.();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-background text-text-tertiary"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      
      {noResults && value && (
        <p className="text-body-sm text-text-secondary">
          Aucun résultat pour &quot;{value}&quot;. Essayez avec d&apos;autres termes.
        </p>
      )}
    </div>
  );
}
