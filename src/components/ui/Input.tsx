import React from 'react';
import { cn } from '../../lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, fullWidth = false, icon, ...props }, ref) => {
    return (
      <div className={cn('mb-4', fullWidth ? 'w-full' : '')}>
        {label && (
          <label
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            htmlFor={props.id || props.name}
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              {icon}
            </div>
          )}
          <input
            className={cn(
              'appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md',
              'focus:outline-none focus:ring-blue-500 focus:border-blue-500',
              'placeholder-gray-400 text-gray-900',
              'disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed',
              'dark:border-gray-600 dark:bg-gray-700 dark:text-white',
              'dark:placeholder-gray-400',
              icon ? 'pl-10' : '',
              error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : '',
              className
            )}
            ref={ref}
            {...props}
          />
        </div>
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;