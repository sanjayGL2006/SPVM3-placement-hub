import * as React from 'react';
import { cn } from '../../utils/cn';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  padded?: boolean;
}

export const Card = ({
  className,
  hoverable = true,
  padded = true,
  children,
  ...props
}: CardProps) => {
  return (
    <div
      className={cn(
        'bg-white dark:bg-[#1C1C1C] rounded-2xl border border-stone-200 dark:border-stone-800 transition-all duration-300',
        hoverable && 'hover:shadow-pinterest-hover hover:-translate-y-0.5 dark:hover:shadow-pinterest-dark-hover',
        padded && 'p-6',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
