'use client';

import { useState } from 'react';
import { Camera, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';

// Avatar sizes
const AVATAR_SIZES = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
  '2xl': 'w-24 h-24 text-xl',
} as const;

type AvatarSize = keyof typeof AVATAR_SIZES;

// Color palette for default avatars (consistent with design system)
const AVATAR_COLORS = [
  'bg-orange-500',   // Primary
  'bg-indigo-500',   // Secondary
  'bg-emerald-500',  // Success
  'bg-violet-500',   // Data 4
  'bg-pink-500',     // Data 5
  'bg-blue-500',     // Info
  'bg-amber-500',    // Warning
  'bg-teal-500',
];

interface AvatarProps {
  src?: string | null;
  name?: string;
  size?: AvatarSize;
  className?: string;
  showUpload?: boolean;
  onUpload?: (file: File) => void;
}

/**
 * Generate consistent color from name
 */
function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

/**
 * Get initials from name
 */
function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

export function Avatar({
  src,
  name = 'U',
  size = 'md',
  className,
  showUpload = false,
  onUpload,
}: AvatarProps) {
  const [imgError, setImgError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const showImage = src && !imgError;
  const bgColor = getAvatarColor(name);
  const initials = getInitials(name);

  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center rounded-full overflow-hidden',
        AVATAR_SIZES[size],
        !showImage && bgColor,
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {showImage ? (
        <img
          src={src}
          alt={name}
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <span className="font-semibold text-white select-none">
          {initials}
        </span>
      )}

      {/* Upload overlay */}
      {showUpload && isHovered && (
        <label className="absolute inset-0 bg-black/50 flex items-center justify-center cursor-pointer">
          <Camera className="w-5 h-5 text-white" />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file && onUpload) {
                // Validate file size (max 5MB)
                if (file.size > 5 * 1024 * 1024) {
                  alert('Image trop volumineuse. Maximum : 5 Mo');
                  return;
                }
                // Validate dimensions
                const img = new Image();
                img.onload = () => {
                  if (img.width < 100 || img.height < 100) {
                    alert('Image trop petite. Minimum : 100×100 pixels');
                    return;
                  }
                  onUpload(file);
                };
                img.src = URL.createObjectURL(file);
              }
            }}
          />
        </label>
      )}
    </div>
  );
}

/**
 * Logo component (square with different default)
 */
export function Logo({
  src,
  name = 'R',
  size = 'lg',
  className,
}: AvatarProps) {
  const [imgError, setImgError] = useState(false);

  const showImage = src && !imgError;

  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center rounded-lg overflow-hidden bg-gradient-to-br from-orange-400 to-orange-600',
        AVATAR_SIZES[size],
        className
      )}
    >
      {showImage ? (
        <img
          src={src}
          alt={name}
          className="w-full h-full object-contain p-1"
          onError={() => setImgError(true)}
        />
      ) : (
        <span className="font-bold text-white select-none text-lg">
          {name.charAt(0).toUpperCase()}
        </span>
      )}
    </div>
  );
}

/**
 * Banner/Cover image component (16:9 ratio)
 */
interface BannerProps {
  src?: string | null;
  alt?: string;
  className?: string;
}

export function Banner({ src, alt = 'Banner', className }: BannerProps) {
  const [imgError, setImgError] = useState(false);

  const showImage = src && !imgError;

  return (
    <div
      className={cn(
        'relative w-full aspect-video rounded-lg overflow-hidden bg-gradient-to-br from-orange-500/20 to-indigo-500/20',
        className
      )}
    >
      {showImage ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-text-tertiary text-sm">Pas de bannière</span>
        </div>
      )}
    </div>
  );
}
