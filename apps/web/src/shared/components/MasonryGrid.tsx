import * as React from 'react';
import { cn } from '../utils/cn';

export interface MasonryGridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

export const MasonryGrid = ({
  children,
  className,
}: MasonryGridProps) => {
  return (
    <div className={cn('masonry-grid w-full', className)}>
      {React.Children.map(children, (child) => (
        <div className="masonry-item">{child}</div>
      ))}
    </div>
  );
};
