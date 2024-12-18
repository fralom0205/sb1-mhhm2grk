import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string;
  trend: string;
  icon: LucideIcon;
  color: string;
}

const colorVariants = {
  orange: 'bg-orange-50 text-orange-600',
  green: 'bg-green-50 text-green-600',
  blue: 'bg-blue-50 text-blue-600',
  purple: 'bg-purple-50 text-purple-600',
  indigo: 'bg-indigo-50 text-indigo-600',
  pink: 'bg-pink-50 text-pink-600'
};

export function StatCard({ label, value, trend, icon: Icon, color }: StatCardProps) {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-200 transform hover:scale-105 transition-transform">
      <div className="p-5 relative">
        <div className={`absolute top-0 right-0 w-24 h-24 ${colorVariants[color]} rounded-full opacity-10 transform translate-x-8 -translate-y-8`} />
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className={`p-3 ${colorVariants[color]} rounded-lg`}>
              <Icon className={`h-6 w-6 ${colorVariants[color]}`} />
            </div>
          </div>
          <div className="ml-5 w-0 flex-1 relative z-10">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                {label}
              </dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-bold text-gray-900">
                  {value}
                </div>
              </dd>
              {trend && (
                <dd className="text-sm text-gray-600 mt-1">
                  {trend}
                </dd>
              )}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}