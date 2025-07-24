'use client';

import { Category } from '@/types/Category';

interface CategoryBadgeProps {
  category: Category;
  className?: string;
}

export default function CategoryBadge({ category, className = '' }: CategoryBadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${className}`}
      style={{
        backgroundColor: `${category.color}20`,
        color: category.color,
        border: `1px solid ${category.color}40`
      }}
    >
      {category.name}
    </span>
  );
} 