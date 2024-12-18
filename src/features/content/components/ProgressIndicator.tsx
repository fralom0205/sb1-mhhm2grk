import React from 'react';

interface ProgressIndicatorProps {
  percentage: number;
  label?: string;
}

export function ProgressIndicator({ percentage, label }: ProgressIndicatorProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="relative w-6 h-6">
        <svg className="w-6 h-6 transform -rotate-90">
          <circle
            className="text-gray-200"
            strokeWidth="2"
            stroke="currentColor"
            fill="transparent"
            r="10"
            cx="12"
            cy="12"
          />
          <circle
            className="text-orange-500"
            strokeWidth="2"
            strokeDasharray={`${percentage * 0.628} 999`}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r="10"
            cx="12"
            cy="12"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-xs">
          {percentage}%
        </span>
      </div>
      {label && <span className="text-sm text-gray-500">{label}</span>}
    </div>
  );
}