'use client';

import { Category } from '@/types/Category';

interface CategoryBadgeProps {
  category: Category;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outlined' | 'filled';
}

export default function CategoryBadge({ 
  category, 
  className = '', 
  size = 'md',
  variant = 'default'
}: CategoryBadgeProps) {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const variantClasses = {
    default: `bg-gradient-to-r from-${category.color}10 to-${category.color}20 border border-${category.color}30 text-${category.color}700 dark:text-${category.color}300`,
    outlined: `bg-transparent border-2 border-${category.color}400 text-${category.color}600 dark:text-${category.color}400`,
    filled: `bg-gradient-to-r from-${category.color}500 to-${category.color}600 text-white border border-${category.color}500`
  };

  return (
    <span
      className={`
        inline-flex items-center justify-center
        font-semibold rounded-full
        transition-all duration-200
        hover:scale-105 hover:shadow-md
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${className}
      `}
      style={{
        '--category-color': category.color,
        '--category-color-light': `${category.color}20`,
        '--category-color-lighter': `${category.color}10`,
        '--category-color-border': `${category.color}30`,
      } as React.CSSProperties}
    >
      <div 
        className="w-2 h-2 rounded-full mr-2"
        style={{ backgroundColor: category.color }}
      />
      {category.name}
    </span>
  );
} 