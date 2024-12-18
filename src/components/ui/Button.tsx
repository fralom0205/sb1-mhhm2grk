import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  fullWidth?: boolean;
}

export function Button({ 
  variant = 'primary', 
  fullWidth = false,
  className = '', 
  children,
  ...props 
}: ButtonProps) {
  const baseStyles = 'flex justify-center py-2 px-4 border rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500';
  const variantStyles = {
    primary: 'border-transparent text-white bg-orange-500 hover:bg-orange-600',
    secondary: 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50',
  };
  const widthStyles = fullWidth ? 'w-full' : '';

  return (
    <button
      {...props}
      className={`${baseStyles} ${variantStyles[variant]} ${widthStyles} ${className}`}
    >
      {children}
    </button>
  );
}