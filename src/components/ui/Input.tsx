import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  prefix?: string;
}

export function Input({ label, error, prefix, className = '', ...props }: InputProps) {
  const id = props.id || props.name;

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="mt-1">
        {prefix ? (
          <div className="flex rounded-md shadow-sm">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
              {prefix}
            </span>
            <input
              {...props}
              id={id}
              className={`block w-full rounded-none rounded-r-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 ${className}`}
            />
          </div>
        ) : (
          <input
            {...props}
            id={id}
            className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 ${className}`}
          />
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}