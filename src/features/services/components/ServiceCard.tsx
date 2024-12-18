import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ServiceCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  onClick: () => void;
}

const colorVariants = {
  orange: 'bg-orange-50 text-orange-700 hover:bg-orange-100',
  blue: 'bg-blue-50 text-blue-700 hover:bg-blue-100',
  green: 'bg-green-50 text-green-700 hover:bg-green-100',
  purple: 'bg-purple-50 text-purple-700 hover:bg-purple-100',
  pink: 'bg-pink-50 text-pink-700 hover:bg-pink-100',
};

export function ServiceCard({ title, description, icon: Icon, color, onClick }: ServiceCardProps) {
  return (
    <button
      onClick={onClick}
      className={`p-6 rounded-lg text-left transition-colors duration-200 ${colorVariants[color]} w-full`}
    >
      <Icon className="w-8 h-8 mb-4" />
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm opacity-90">{description}</p>
    </button>
  );
}