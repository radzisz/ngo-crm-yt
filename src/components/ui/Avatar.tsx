import React from 'react';
import { cn } from '../../lib/utils';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: AvatarSize;
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = 'Avatar',
  fallback,
  size = 'md',
  className,
}) => {
  const [imgError, setImgError] = React.useState(false);

  const sizeClasses = {
    xs: 'h-6 w-6 text-xs',
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-base',
    lg: 'h-12 w-12 text-lg',
    xl: 'h-16 w-16 text-xl',
  };

  const getFallbackInitials = () => {
    if (fallback) return fallback.slice(0, 2).toUpperCase();
    if (alt) {
      return alt
        .split(' ')
        .map((word) => word[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();
    }
    return 'U';
  };

  return (
    <div
      className={cn(
        'relative rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center',
        sizeClasses[size],
        className
      )}
    >
      {src && !imgError ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <span className="font-medium text-gray-600 dark:text-gray-200">
          {getFallbackInitials()}
        </span>
      )}
    </div>
  );
};

export default Avatar;